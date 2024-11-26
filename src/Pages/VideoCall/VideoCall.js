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
  const { userId, secondUserId, appointmentID } = useParams();
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
      console.log("WebSocket connection opened");
      ws.current.send(
        JSON.stringify({
          type: "init",
          id: connectionId,
          sessionId: sessionId,
        })
      );
      console.log("Sent init message:", {
        type: "init",
        id: connectionId,
        sessionId: sessionId,
      });

      setupPeerConnection();
    };

    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

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

    ws.current.onclose = () => {
      console.log("WebSocket closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connectionId, sessionId]);

  const setupPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });
    peerConnection.current = pc;

    const sortedIds = [userId, secondUserId].sort();
    const isInitiator = connectionId === sortedIds[0];

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(async (stream) => {
        console.log("Local stream obtained");
        localStream.current = stream;
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        if (isInitiator) {
          try {
            console.log("Creating offer");
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
            console.log("Sent offer:", pc.localDescription);
          } catch (err) {
            console.error("Error creating offer:", err);
          }
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        alert("Couldn't get access to microphone or camera.");
      });

    pc.onicecandidate = (event) => {
      if (event.candidate && ws.current) {
        console.log("Sending ICE candidate:", event.candidate);
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
      console.log("Remote track received");
      if (remoteVideoRef.current.srcObject !== event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state changed to", pc.iceConnectionState);
    };

    if (!isInitiator) {
      pc.onnegotiationneeded = async () => {
        try {
          console.log("Negotiation needed");
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
          console.log("Sent offer after negotiation needed:", pc.localDescription);
        } catch (err) {
          console.error("Error during negotiation needed:", err);
        }
      };
    }
  };

  const handleOfferMsg = async (data) => {
    try {
      console.log("Received offer:", data);
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
      console.log("Sent answer:", peerConnection.current.localDescription);

      while (iceCandidatesQueue.current.length) {
        const candidate = iceCandidatesQueue.current.shift();
        await peerConnection.current.addIceCandidate(candidate);
      }
    } catch (err) {
      console.error("Error handling offer:", err);
    }
  };

  const handleAnswerMsg = async (data) => {
    try {
      console.log("Received answer:", data);
      const desc = new RTCSessionDescription(data.sdp);
      await peerConnection.current.setRemoteDescription(desc);

      while (iceCandidatesQueue.current.length) {
        const candidate = iceCandidatesQueue.current.shift();
        await peerConnection.current.addIceCandidate(candidate);
      }
    } catch (err) {
      console.error("Error handling answer:", err);
    }
  };

  const handleNewICECandidateMsg = async (data) => {
    try {
      console.log("Received ICE candidate:", data);
      const candidate = new RTCIceCandidate(data.candidate);
      if (peerConnection.current.remoteDescription) {
        await peerConnection.current.addIceCandidate(candidate);
      } else {
        iceCandidatesQueue.current.push(candidate);
      }
    } catch (err) {
      console.error("Error adding received ICE candidate:", err);
    }
  };

  const handleHangupMsg = async () => {
    console.log("Received hangup message");
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

      const url = `https://quickmed-server-side.onrender.com/bookings/calls/ended/${appointmentID}`;
      fetch(url, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((result) => {
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
    <div className="flex flex-row">
      <div className="relative flex items-center justify-center h-[80vh] w-full bg-black pt-16 pb-16 md:pb-20 overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover shadow-lg"
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
      <div className="flex flex-col w-56 bg-gray-900 text-white">
          <div className="flex flex-row bg-gray-700">
              <div className=" bg-blue-500 w-2"></div>
              <div className="text-xs p-4 font-semibold">
                This text is what I am telling you in the video
              </div>
          </div>
      </div>
    </div>
  );
};

export default VideoCall;
