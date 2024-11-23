import React, { useEffect, useState } from "react";
import { useCall } from "../contexts/CallProvider";

const VideoCallWrapper = ({ children }) => {
  const { incomingCall, acceptCall} = useCall();
  const [showCallModal, setShowCallModal] = useState();
  const [accepted, setAccepted] = useState(false);
  const [caller, setCaller] = useState();
  useEffect(() => {
    if (incomingCall) {
      fetch(`http://localhost:3000/users/id/${incomingCall.from_id}`, {
        method: 'GET',
        headers:{
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then(res => {
        return res.json()})
    .then(data => {
        setCaller(data)
    });
    if (caller && accepted === false) {
      setShowCallModal(true);
    }
    }
  }, [incomingCall, caller]);

  return (
    <div className="relative">
      {children}
      {showCallModal && (
        <div className="absolute top-32 inset-x-0 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-sm mx-auto">
            <p className="text-lg font-semibold mb-4">
              Incoming call from {caller.name}
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => {
                  setAccepted(true);
                  setShowCallModal(false);
                  acceptCall(incomingCall.from_id, incomingCall.appointment_id);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => setShowCallModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallWrapper;