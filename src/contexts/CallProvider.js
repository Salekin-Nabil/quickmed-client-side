import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(`ws://localhost:8080/ws?user_id=${user.uid}`);
    setSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "incoming_call") {
        setIncomingCall(message);
      } else if (message.type === "call_answer") {
        handleAnswer(message.answer);
      } else if (message.type === "ice-candidate") {
        peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
      }
    };
    initializePeerConnection();
  }, [user]);

  const initializePeerConnection = () => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);
  };

  const initiateCall = async (targetID) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.send(JSON.stringify({ type: "call", offer, target_id: targetID }));
    navigate(`/call/${user.uid}/to/${targetID}`);
  };

  const acceptCall = (fromId) => {
    navigate(`/call/${fromId}/to/${user.uid}`);
  };

  const handleAnswer = async (answer) => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  return (
    <CallContext.Provider
      value={{ initiateCall, incomingCall, acceptCall, peerConnection }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
