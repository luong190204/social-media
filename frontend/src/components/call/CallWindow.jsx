import React, { useEffect, useRef } from "react";
import { useCall } from "../../context/CallContext";
import { Phone } from "lucide-react";

const CallWindow = () => {
  const { inCall, isCalling, localVideoRef, remoteVideoRef, hangup } =
    useCall();

  // Hiển thị khi đang gọi HOẶC đã kết nối
  if (!inCall && !isCalling) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-6xl h-[85vh] bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
        {/* Remote video (màn hình chính) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover bg-gray-800"
        />

        {/* Local video (PiP - Picture in Picture) */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-48 h-36 absolute right-6 top-6 rounded-lg border-2 border-white shadow-xl object-cover bg-gray-700"
        />

        {/* Call status overlay */}
        <div className="absolute top-6 left-6">
          {isCalling && !inCall && (
            <div className="bg-blue-500/90 text-white px-4 py-2 rounded-lg font-medium shadow-lg">
              🔄 Đang kết nối...
            </div>
          )}

          {inCall && (
            <div className="bg-green-500/90 text-white px-4 py-2 rounded-lg font-medium shadow-lg">
              ✓ Đang trong cuộc gọi
            </div>
          )}
        </div>

        {/* Control buttons */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={hangup}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold transition shadow-lg flex items-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Kết thúc
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallWindow;
