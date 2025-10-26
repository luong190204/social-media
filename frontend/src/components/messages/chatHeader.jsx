// src/components/ChatHeader.jsx
import React, { useState } from "react";
import { Info, Phone, Video, MoreVertical } from "lucide-react";
import { useVideoCall } from "../../context/VideoCallContext";
import { useOnlineStore } from "@/store/useOnlineStore";

const Avatar = ({ src, name, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const initial = name?.charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-600 font-medium">{initial}</span>
      )}
    </div>
  );
};

export default function ChatHeader({ user }) {
  const { initiateVideoCall, initiateAudioCall, callStatus } = useVideoCall();
  const [showMenu, setShowMenu] = useState(false);

  const { onlineUsers } = useOnlineStore();
  const isOnline = onlineUsers.includes(user?.partnerId);

  const handleVideoCall = () => {
    if (!user) {
      console.error("No user selected");
      return;
    }

    if (callStatus !== "idle") {
      alert("You are already in a call");
      return;
    }

    initiateVideoCall(user);
  };

  const handleAudioCall = () => {
    if (!user) {
      console.error("No user selected");
      return;
    }

    if (callStatus !== "idle") {
      alert("You are already in a call");
      return;
    }

    initiateAudioCall(user);
  };

  return (
    <div className="flex items-center justify-between p-4 mt-6 border-b bg-white shadow-sm">

      {/* User Info */}
      <div className="flex items-center">
        <Avatar src={user?.partnerAvatar} name={user?.fullName} size="sm" />
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{user?.partnerName}</h3>
          <p className="text-xs text-gray-500">
            {isOnline ? (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Đang hoạt động
              </span>
            ) : (
              "Ngoại tuyến"
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* Audio Call Button */}
        <button
          onClick={handleAudioCall}
          disabled={callStatus !== "idle"}
          className={`p-2 rounded-full transition-colors ${
            callStatus !== "idle"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-blue-50 text-blue-600 hover:text-blue-700"
          }`}
          title="Audio call"
        >
          <Phone className="w-5 h-5" />
        </button>

        {/* Video Call Button */}
        <button
          onClick={handleVideoCall}
          disabled={callStatus !== "idle"}
          className={`p-2 rounded-full transition-colors ${
            callStatus !== "idle"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-blue-50 text-blue-600 hover:text-blue-700"
          }`}
          title="Video call"
        >
          <Video className="w-5 h-5" />
        </button>

        {/* Info Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-700 transition-colors relative"
          title="More options"
        >
          <MoreVertical className="w-5 h-5" />

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => {
                  console.log("View profile:", user);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Info className="w-4 h-4 mr-2" />
                Trang cá nhân
              </button>
              <button
                onClick={() => {
                  console.log("Mute conversation:", user);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Tắt thông báo
              </button>
              <button
                onClick={() => {
                  console.log("Block user:", user);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Chặn người dùng
              </button>
            </div>
          )}
        </button>
      </div>

      {/* Close dropdown when clicking outside */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
