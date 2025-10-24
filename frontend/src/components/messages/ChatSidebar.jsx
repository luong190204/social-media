import { MoreVertical, Search } from 'lucide-react';
import React, { useEffect } from 'react'
import SearchUserMessage from '../header/SearchUserMessage';
import { useAuthStore } from '@/store/useAuthStore';
import { useOnlineStore } from '@/store/useOnlineStore';

export const ChatSidebar = ({ partner, selectedUser, onUserSelect }) => {
  const { authUser } = useAuthStore();

  const { onlineUsers } = useOnlineStore();

  return (
    <div className="hidden md:block w-[400px] border-r border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b flex items-center">
        <h1 className="text-xl font-semibold">{authUser.username}</h1>
        <div className="ml-auto">
          <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>
      </div>

      <SearchUserMessage />

      {/* Messages Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tin nhắn</h2>
          <div className="text-sm text-gray-500">Tin nhắn đang chờ</div>
        </div>
      </div>

      {/* Conversations List */}
      {partner.length === 0 ? (
        <p className="p-4 text-gray-500 text-sm text-center">
          Chưa có cuộc trò chuyện nào
        </p>
      ) : (
        partner.map((conv) => {
          const isOnline = onlineUsers.includes(conv.partnerId);

          return (
            <div
              key={conv.id}
              className={`flex items-center p-3 cursor-pointer ${
                selectedUser?.id === conv.id ? "bg-gray-300" : ""
              }`}
              onClick={() => onUserSelect(conv)}
            >
              <div className="relative">
                <img
                  src={conv.partnerAvatar || "/assets/avatar.jpg"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full  ${
                    isOnline ? "bg-green-500 border-2 border-white" : ""
                  }`}
                ></span>
              </div>

              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate">{conv.partnerName}</p>
                  {conv.lastMessageTime && (
                    <span className="text-xs text-gray-400 ">
                      {new Date(conv.lastMessageTime).toLocaleDateString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>

                <p
                  className={`text-sm truncate ${
                    conv.unReadCount > 0
                      ? "text-gray-900 font-semibold"
                      : "text-gray-500 font-normal"
                  } `}
                >
                  {conv.lastMessageContent
                    ? conv.lastMessageContent.startsWith("http")
                      ? "Hình ảnh"
                      : conv.lastMessageContent
                    : "Chưa có tin nhắn"}
                </p>
              </div>

              {conv.unReadCount > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                  {conv.unReadCount}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};