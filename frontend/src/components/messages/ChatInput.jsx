import { Camera, Heart, Send, Smile } from 'lucide-react';
import React, { useState } from 'react'

const ChatInput = ({ onSendMessage  }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-white">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <Camera className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500" />
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhắn tin..."
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Smile className="w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-500" />
              {message.trim() ? (
                <Send
                  className="w-5 h-5 text-blue-500 cursor-pointer"
                  onClick={handleSend}
                />
              ) : (
                <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput
