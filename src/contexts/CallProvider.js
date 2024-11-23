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
  const [userID, setUserID] = useState("");

  useEffect(() => {
      if(user) {
        fetch(`http://localhost:3000/users/${user.email}`, {
          method: 'GET', 
          headers: {
              'authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
      }).then(res => {return res.json()})
      .then(data => {
        if (!user) return;

        const ws = new WebSocket(`wss://quick-med.fly.dev/ws?user_id=${data._id}`);
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
        setUserID(data._id);
      });
      }
  }, [user]);

  // useEffect(() => {
  //   if (!user) return;
  //   console.log("User ID Yo: ", userID);

  //   const ws = new WebSocket(`wss://quick-med.fly.dev/ws?user_id=${userID}`);
  //   setSocket(ws);

  //   ws.onmessage = (event) => {
  //     const message = JSON.parse(event.data);
  //     if (message.type === "incoming_call") {
  //       setIncomingCall(message);
  //     } else if (message.type === "call_answer") {
  //       handleAnswer(message.answer);
  //     } else if (message.type === "ice-candidate") {
  //       peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
  //     }
  //   };
  //   initializePeerConnection();
  // }, [user]);

  const initializePeerConnection = () => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);
  };

  const initiateCall = async (fromID, targetID, appointmentID) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.send(JSON.stringify({ type: "call", offer, target_id: targetID, appointment_id: appointmentID }));
    navigate(`/call/${fromID._id}/to/${targetID}/for/${appointmentID}`);
  };

  const acceptCall = (fromId, appntmntID) => {
    navigate(`/call/${fromId}/to/${userID}/for/${appntmntID}`);
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