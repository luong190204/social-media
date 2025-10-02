import { MoreVertical, Search } from 'lucide-react';
import React, { useEffect } from 'react'

export const ChatSidebar = ({ users, selectedUser, onUserSelect }) => {

  return (
    <div className="hidden md:block w-[400px] border-r border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b flex items-center">
        <h1 className="text-xl font-semibold">buidihluong</h1>
        <div className="ml-auto">
          <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Messages Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tin nhắn</h2>
          <div className="text-sm text-gray-500">Tin nhắn đang chờ</div>
        </div>
      </div>

      {/* Conversations List */}
      {users.length === 0 ? (
        <p className="p-4 text-gray-500 text-sm text-center">
          Chưa có cuộc trò chuyện nào
        </p>
      ) : (
        users.map((conv) => (
          <div
            key={conv.id}
            className={`flex items-center p-3 cursor-pointer ${
              selectedUser?.id === conv.id ? "bg-gray-300" : ""
            }`}
            onClick={() => onUserSelect(conv)}
          >
            <button onClick={() => console.log("conv", conv)}>
              Click
            </button>

            <img
              src={conv.partnerAvatar || "/assets/avatar.jpg"}
              className="w-10 h-10 rounded-full object-cover"
            />

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

              <p className="text-sm text-gray-500 truncate">
                {conv.lastMessageContent
                  ? conv.lastMessageContent.startsWith("http")
                    ? "Hình ảnh"
                    : conv.lastMessageContent
                  : "Chưa có tin nhắn"}
              </p>
            </div>

            {conv.unreadCount > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {conv.unreadCount}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
};