import React from "react";

export default function ChatContainer({ messages }) {
  const MessageBubble = ({ message }) => {
    const isOwn = message.sender === "own";

    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
        <div
          className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}
        >
          {message.type === "image" ? (
            <div className="rounded-2xl overflow-hidden">
              <img
                src={message.content}
                alt="Shared image"
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div
              className={`px-4 py-2 rounded-2xl ${
                isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              {message.content}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1 text-center">
            {message.time}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length > 0 ? (
        messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Chưa có tin nhắn nào</p>
        </div>
      )}
    </div>
  );
}
