import React, { useEffect, useRef, useState } from "react";
import auth from "../../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";

const VideoCall = () => {
  const [user] = useAuthState(auth);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null); 
  const { userId, secondUserId } = useParams();
  const { appointmentID } = useParams();
  const navigate = useNavigate();

  const [connectionId, setConnectionId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const ws = useRef(null);
  const iceCandidatesQueue = useRef([]);

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

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

    ws.current = new WebSocket("wss://quick-med.fly.dev/ws/call");

    ws.current.onopen = () => {
      ws.current.send(
        JSON.stringify({
          type: "init",
          id: connectionId,
          sessionId: sessionId,
        })
      );
    };

    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "offer":
          await handleOfferMsg(data);
          break;
        case "answer":
          await handleAnswerMsg(data);
          break;
        case "candidate":
          await handleNewICECandidateMsg(data);
          break;
        case "hangup":
          await handleHangupMsg();
          break;
        default:
          break;
      }
    };

    ws.current.onclose = () => {};

    ws.current.onerror = (error) => {};

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connectionId, sessionId]);

  useEffect(() => {
    if (!connectionId || !sessionId) return;

    const pc = new RTCPeerConnection({
      // iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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
        localStream.current = stream; 
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      })
      .catch((err) => {
        alert("Couldn't get access to microphone or camera.");
      });

    pc.onicecandidate = (event) => {
      if (event.candidate && ws.current) {
        ws.current.send(
          JSON.stringify({
            type: "candidate",
            candidate: event.candidate,
            id: connectionId,
            sessionId: sessionId,
          })
        );
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current.srcObject !== event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const sortedIds = [userId, secondUserId].sort();
    const isInitiator = connectionId === sortedIds[0];

    if (isInitiator) {
      pc.addEventListener("negotiationneeded", async () => {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          ws.current.send(
            JSON.stringify({
              type: "offer",
              sdp: pc.localDescription,
              id: connectionId,
              sessionId: sessionId,
            })
          );
        } catch (err) {}
      });
    }

    pc.addEventListener("iceconnectionstatechange", () => {
      if (pc.iceConnectionState === "failed") {}
    });

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

      if (ws.current) {
        ws.current.send(
          JSON.stringify({
            type: "hangup",
            id: connectionId,
            sessionId: sessionId,
          })
        );
        ws.current.close();
      }
    };
  }, [connectionId, sessionId]);

  const handleOfferMsg = async (data) => {
    try {
      const desc = new RTCSessionDescription(data.sdp);
      await peerConnection.current.setRemoteDescription(desc);

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      ws.current.send(
        JSON.stringify({
          type: "answer",
          sdp: peerConnection.current.localDescription,
          id: connectionId,
          sessionId: sessionId,
        })
      );

      while (iceCandidatesQueue.current.length) {
        const candidate = iceCandidatesQueue.current.shift();
        await peerConnection.current.addIceCandidate(candidate);
      }
    } catch (err) {}
  };

  const handleAnswerMsg = async (data) => {
    try {
      const desc = new RTCSessionDescription(data.sdp);
      await peerConnection.current.setRemoteDescription(desc);

      while (iceCandidatesQueue.current.length) {
        const candidate = iceCandidatesQueue.current.shift();
        await peerConnection.current.addIceCandidate(candidate);
      }
    } catch (err) {}
  };

  const handleNewICECandidateMsg = async (data) => {
    try {
      const candidate = new RTCIceCandidate(data.candidate);
      if (peerConnection.current.remoteDescription) {
        await peerConnection.current.addIceCandidate(candidate);
      } else {
        iceCandidatesQueue.current.push(candidate);
      }
    } catch (err) {}
  };

  const handleHangupMsg = async () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    navigate("/");
  };

  const endCall = async () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());

        const url = `http://localhost:3000/bookings/calls/ended/${appointmentID}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
        })
        .then(res=> res.json())
        .then(result =>{
            console.log(result);
        });
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          type: "hangup",
          id: connectionId,
          sessionId: sessionId,
        })
      );
      ws.current.close();
    }
    navigate("/");
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsVideoEnabled(track.enabled);
      });
    }
  };

  const toggleAudio = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsAudioEnabled(track.enabled);
      });
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
        <button
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          onClick={toggleVideo}
        >
          <i
            className={`fas ${
              isVideoEnabled ? "fa-video" : "fa-video-slash"
            } text-white`}
          ></i>
        </button>
        <button
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          onClick={toggleAudio}
        >
          <i
            className={`fas ${
              isAudioEnabled ? "fa-microphone" : "fa-microphone-slash"
            } text-white`}
          ></i>
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
