import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import auth from "../../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";

const VideoCall = () => {
  const [user] = useAuthState(auth);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const connectionId = user.uid;
  const [sessionId] = useState("shared-session-id");

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnection.current = pc;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      })
      .catch((err) => console.error("Failed to get local media", err));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        axios
          .post("http://localhost:8080/signal", {
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

    pc.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", pc.iceConnectionState);
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection State:", pc.connectionState);
    };

    return () => {
      pc.close();
    };
  }, [connectionId, sessionId]);

  const getCandidates = async () => {
    try {
      const response = await axios.post("http://localhost:8080/signal", {
        type: "get-candidates",
        sessionId: sessionId,
        id: connectionId,
      });
      const candidates = response.data.candidates;
      for (const candidate of candidates) {
        await peerConnection.current.addIceCandidate(candidate);
      }
    } catch (err) {
      console.error("Failed to get ICE candidates", err);
    }
  };

  const pollCandidates = () => {
    if (
      peerConnection.current.iceConnectionState !== "connected" &&
      peerConnection.current.iceConnectionState !== "completed"
    ) {
      getCandidates();
      setTimeout(pollCandidates, 1000);
    }
  };

  const handleCall = async () => {
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      await axios.post("http://localhost:8080/signal", {
        sdp: offer.sdp,
        type: "offer",
        id: connectionId,
        sessionId: sessionId,
      });

      const pollAnswer = async () => {
        try {
          const response = await axios.post("http://localhost:8080/signal", {
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

            pollCandidates();
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
      const response = await axios.post("http://localhost:8080/signal", {
        type: "get-offer",
        sessionId: sessionId,
        id: connectionId,
      });

      if (response.data.sdp) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription({ type: "offer", sdp: response.data.sdp })
        );

        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        await axios.post("http://localhost:8080/signal", {
          sdp: answer.sdp,
          type: "answer",
          id: connectionId,
          sessionId: sessionId,
        });

        pollCandidates();
      } else {
        console.error("No offer SDP received from server");
      }
    } catch (err) {
      console.error("Failed during answering", err);
    }
  };

  return (
    <div>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "300px" }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: "300px" }}
      />
      <button onClick={handleCall}>Начать звонок</button>
      <button onClick={handleAnswer}>Ответить на звонок</button>
    </div>
  );
};

export default VideoCall;
