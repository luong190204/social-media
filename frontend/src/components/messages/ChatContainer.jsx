import { useChatStore } from "@/store/useChatStore";
import React, { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./MessageSkeleton";
import ChatInput from "./ChatInput";
import { useAuthStore } from "@/store/useAuthStore";

export default function ChatContainer({ messages }) {

  const messageEndRef = useRef();

  const { isMessagesLoading, selectConversation } = useChatStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages])

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <ChatInput />
      </div>
    )
  }
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 bg-white">
      <div className="max-w-3xl mx-auto space-y-1">
        {messages?.map((message) => {
          const isOwnMessage = message.senderId === authUser.id;
          const isImagePartner =
            message.senderId === selectConversation.partnerId;
          return (
            <div
              key={message.id}
              className={`flex gap-2 ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar bên trái cho tin nhắn của đối phương */}
              {!isOwnMessage && isImagePartner && (
                <img
                  src={selectConversation.partnerAvatar || "/assets/avatar.jpg"}
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0 self-end mb-4"
                  alt="Avatar"
                />
              )}

              <div
                className={`flex flex-col max-w-[70%] ${
                  isOwnMessage ? "items-end" : "items-start"
                }`}
              >
                {/* Message Bubble */}
                <div
                  className={`relative  rounded-3xl break-words ${
                    isOwnMessage
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-gray-300 text-gray-900 rounded-bl-md"
                  }`}
                >
                  {message.type === "IMAGE" ? (
                    <img
                      src={message.content}
                      alt="Sent image"
                      className="rounded-2xl max-w-full h-auto max-h-80 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    />
                  ) : (
                    <p className="text-[15px] px-3 py-2 leading-5 whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                </div>

                {/* Timestamp */}
                {message.timestamp && (
                  <span className="text-[11px] text-gray-400 mt-1 px-2">
                    {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
}
