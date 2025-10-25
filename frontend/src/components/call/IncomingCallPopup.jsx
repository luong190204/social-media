import React, { useEffect } from "react";
import { useCall } from "../../context/CallContext";

export const IncomingCallPopup = () => {
  const { isIncoming, inbound, acceptCall, rejectCall, markMissed } = useCall();

  useEffect(() => {
    let timer;
    if (isIncoming && inbound) {
      // Timeout 30s -> mark missed
      timer = setTimeout(() => {
        if (inbound.callId) {
          markMissed(inbound.callId);
        }
        rejectCall();
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [isIncoming, inbound, markMissed, rejectCall]);

  if (!isIncoming || !inbound) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-lg p-6 rounded-lg z-50 border border-gray-200 min-w-[300px]">
      <div className="font-semibold text-lg mb-2">📞 Cuộc gọi đến</div>
      <div className="text-gray-700 mb-1">
        Từ: <span className="font-medium">{inbound.from}</span>
      </div>
      <div className="text-sm text-gray-600 mb-4">
        {inbound.metadata?.isVideo ? "Cuộc gọi video" : "Cuộc gọi thoại"}
      </div>
      <div className="flex gap-3">
        <button
          onClick={acceptCall}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
        >
          Trả lời
        </button>
        <button
          onClick={rejectCall}
          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
        >
          Từ chối
        </button>
      </div>
    </div>
  );
};

function sendRejectAndCleanup(inbound) {
  // import getStompClient here to send reject
  import("../../lib/socket").then(mod => {
    const stomp = mod.getStompClient();
    if (stomp && stomp.connected) {
      stomp.send("/app/call.send", {}, JSON.stringify({
        type: "reject",
        from: localStorage.getItem("userId"), // or auth store
        to: inbound.from,
        callId: inbound.callId
      }));
    }
  });
}

