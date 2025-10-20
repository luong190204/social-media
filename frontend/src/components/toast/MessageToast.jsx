// src/components/toast/MessageToast.jsx
import { MessageCircle } from "lucide-react";
import React from "react";

const MessageToast = ({ message, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative flex items-center gap-3 bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-950 backdrop-blur-xl shadow-2xl rounded-3xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20 border border-gray-200/50 dark:border-neutral-700/50 w-[340px] overflow-hidden"
    >
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Avatar with glow effect */}
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 bg-blue-500/30 blur-lg rounded-full animate-pulse" />
        <img
          src={message.senderAvatar || "/assets/avatar.jpg"}
          alt="avatar"
          className="relative w-12 h-12 rounded-full object-cover ring-2 ring-blue-400/50 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900"
        />
        {/* Online indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-neutral-900" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">
            {message.senderName}
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            • now
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm truncate leading-relaxed">
          {message.content}
        </p>
      </div>

      {/* Message icon with animation */}
      <div className="relative flex-shrink-0 z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full animate-ping" />
          <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
            <MessageCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Bottom shine effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </div>
  );
};

export default MessageToast;
