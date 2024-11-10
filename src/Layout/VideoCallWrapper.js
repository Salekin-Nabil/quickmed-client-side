import React, { useEffect, useState } from "react";
import { useCall } from "../contexts/CallProvider";

const VideoCallWrapper = ({ children }) => {
  const { incomingCall, acceptCall } = useCall();
  const [showCallModal, setShowCallModal] = useState();
  useEffect(() => {
    if (incomingCall) {
      setShowCallModal(true);
    }
  }, [incomingCall]);

  return (
    <div className="relative">
      {children}
      {showCallModal && (
        <div className="absolute top-32 inset-x-0 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-sm mx-auto">
            <p className="text-lg font-semibold mb-4">
              Incoming call from {incomingCall.from_id}
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => {
                  setShowCallModal(false);
                  acceptCall(incomingCall.from_id);
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