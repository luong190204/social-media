import React from "react";
import { useCall } from "../../context/CallContext";

const IncomingCallPopup = () => {
  const { isIncoming, caller, startCall, endCall } = useCall();

  if (!isIncoming) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-white shadow-xl p-4 rounded-xl z-50">
      <p className="font-medium mb-2">{caller} đang gọi cho bạn...</p>
      <div className="flex gap-2">
        <button
          onClick={() => startCall(caller)}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Trả lời
        </button>
        <button
          onClick={endCall}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Từ chối
        </button>
      </div>
    </div>
  );
};

export default IncomingCallPopup;
