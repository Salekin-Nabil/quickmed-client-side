import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import auth from "../../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";

const VideoCall = () => {
  const [user] = useAuthState(auth);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const { userId, secondUserId } = useParams();
  const navigate = useNavigate();

  const [connectionId, setConnectionId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [pcReady, setPcReady] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  const addedCandidates = useRef(new Set());

  useEffect(() => {
    if (user) {
      setConnectionId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (userId && secondUserId) {
      const sortedIds = [userId, secondUserId].sort();
      const session = `${sortedIds[0]}x${sortedIds[1]}`;
      setSessionId(session);
    }
  }, [userId, secondUserId]);

  useEffect(() => {
    if (!connectionId || !sessionId) return;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
      ],
    });
    peerConnection.current = pc;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
        setMediaReady(true);
      })
      .catch((err) => {
        console.error("Failed to get local media", err);
        alert("Waiting for the patient to recieve the call.");
      });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        axios
          .post("https://quick-med.fly.dev/signal", {
            candidate: event.candidate,
            type: "candidate",
            sessionId: sessionId,
            id: connectionId,
          })
          .catch((err) => console.error("Failed to send ICE candidate", err));
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current.srcObject !== event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.oniceconnectionstatechange = () => {};
    pc.onconnectionstatechange = () => {};

    setPcReady(true);

    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }

      axios
        .post("https://quick-med.fly.dev/signal", {
          type: "hangup",
          sessionId: sessionId,
          id: connectionId,
        })
        .catch((err) => console.error("Failed to send hangup signal", err));
    };
  }, [connectionId, sessionId]);

  const getCandidates = async () => {
    try {
      const response = await axios.post("https://quick-med.fly.dev/signal", {
        type: "get-candidates",
        sessionId: sessionId,
        id: connectionId,
      });

      const candidates = response.data.candidates;

      if (Array.isArray(candidates) && candidates.length > 0) {
        for (const candidate of candidates) {
          const candidateKey =
            candidate.candidate +
            "|" +
            candidate.sdpMid +
            "|" +
            candidate.sdpMLineIndex;
          if (!addedCandidates.current.has(candidateKey)) {
            try {
              await peerConnection.current.addIceCandidate(candidate);
              addedCandidates.current.add(candidateKey);
            } catch (error) {
              console.error("Error adding ICE candidate:", error);
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to get ICE candidates", err);
    }
  };

  const pollCandidates = () => {
    getCandidates();
    setTimeout(pollCandidates, 1000);
  };

  const handleCall = async () => {
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      pollCandidates();

      await axios.post("https://quick-med.fly.dev/signal", {
        sdp: offer.sdp,
        type: "offer",
        id: connectionId,
        sessionId: sessionId,
      });

      const pollAnswer = async () => {
        try {
          const response = await axios.post("https://quick-med.fly.dev/signal", {
            type: "get-answer",
            sessionId: sessionId,
            id: connectionId,
          });

          if (response.data.sdp) {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription({
                type: "answer",
                sdp: response.data.sdp,
              })
            );
          } else {
            setTimeout(pollAnswer, 1000);
          }
        } catch (err) {
          console.error("Failed to get answer", err);
          setTimeout(pollAnswer, 1000);
        }
      };
      pollAnswer();
    } catch (err) {
      console.error("Failed during call setup", err);
    }
  };

  const handleAnswer = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const getOffer = async () => {
        try {
          const response = await axios.post("https://quick-med.fly.dev/signal", {
            type: "get-offer",
            sessionId: sessionId,
            id: connectionId,
          });

          if (response.data.sdp) {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription({
                type: "offer",
                sdp: response.data.sdp,
              })
            );

            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            pollCandidates();

            await axios.post("https://quick-med.fly.dev/signal", {
              sdp: answer.sdp,
              type: "answer",
              id: connectionId,
              sessionId: sessionId,
            });
          } else {
            setTimeout(getOffer, 1000);
          }
        } catch (err) {
          console.error("Failed to get offer", err);
          setTimeout(getOffer, 1000);
        }
      };
      getOffer();
    } catch (err) {
      console.error("Failed during answering", err);
      setTimeout(handleAnswer, 1000);
    }
  };

  useEffect(() => {
    if (
      !user ||
      !userId ||
      !secondUserId ||
      !sessionId ||
      !pcReady ||
      !mediaReady
    ) {
      return;
    }

    if (userId === user.uid) {
      handleCall();
    } else if (secondUserId === user.uid) {
      handleAnswer();
    } else {
      console.error("User is neither caller nor callee");
    }
  }, [user, userId, secondUserId, sessionId, pcReady, mediaReady]);

  const endCall = async () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    try {
      await axios.post("https://quick-med.fly.dev/signal", {
        type: "hangup",
        sessionId: sessionId,
        id: connectionId,
      });
      navigate("/");
    } catch (err) {
      console.error("Failed to send hangup signal", err);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-[80vh] w-full bg-black pt-16 pb-16 md:pb-20 overflow-hidden">
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
      />

      <div className="absolute bottom-6 right-6 w-32 h-24 md:w-40 md:h-28 lg:w-48 lg:h-32 border-2 border-gray-700 shadow-lg rounded-lg overflow-hidden">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute bottom-6 flex gap-4 justify-center w-full">
        <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition">
          <i className="fas fa-video text-white"></i>
        </button>
        <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition">
          <i className="fas fa-microphone text-white"></i>
        </button>
        <button
          className="p-3 rounded-full bg-red-600 hover:bg-red-500 transition"
          onClick={endCall}
        >
          <i className="fas fa-phone-slash text-white"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoCall;