import React from "react";
import { Phone, Video } from "lucide-react";
import { useCall } from "../../context/CallContext";

const CallButton = ({ targetId, video = true }) => {
  const { startCall } = useCall();

  const handleCall = () => {
    console.log("CallButton clicked, targetId:", targetId);
    if (!targetId) {
      alert("Không tìm thấy người dùng để gọi!");
      return;
    }
    startCall(targetId, { isVideo: video });
  };

  return (
    <button
      onClick={handleCall}
      className="p-2 text-gray-900 rounded-full hover:bg-gray-100 transition"
      title={video ? "Gọi video" : "Gọi thoại"}
    >
      <div className="flex items-center space-x-2">
        {video ? (
          <Video className="w-5 h-5 text-gray-600 hover:text-blue-500" />
        ) : (
          <Phone className="w-5 h-5 text-gray-600 hover:text-blue-500" />
        )}
      </div>
    </button>
  );
};

export default CallButton;
