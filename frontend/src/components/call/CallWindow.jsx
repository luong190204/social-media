import React, { useEffect, useRef } from "react";
import { useCall } from "../../context/CallContext";

const CallWindow = () => {
  const { localStream, remoteStream, endCall, isCallActive } = useCall();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream)
      localVideoRef.current.srcObject = localStream;
    if (remoteVideoRef.current && remoteStream)
      remoteVideoRef.current.srcObject = remoteStream;
  }, [localStream, remoteStream]);

  if (!isCallActive) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
      <video
        ref={remoteVideoRef}
        autoPlay
        className="w-3/4 rounded-xl mb-4 border border-gray-600"
      />
      <video
        ref={localVideoRef}
        autoPlay
        muted
        className="w-1/4 rounded-xl absolute bottom-10 right-10 border border-gray-600"
      />
      <button
        onClick={endCall}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-full"
      >
        Kết thúc
      </button>
    </div>
  );
};

export default CallWindow;
