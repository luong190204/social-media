import { MoreVertical, Search } from 'lucide-react';
import React from 'react'

export const ChatSidebar = ({ users, selectedUser, onUserSelect }) => {
   const Avatar = ({ src, name, size = 'md', hasStory = false, isOnline = false }) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };

    const initial = name?.charAt(0).toUpperCase() || '?';

    return (
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full ${hasStory ? 'ring-2 ring-pink-500 ring-offset-2' : ''} overflow-hidden bg-gray-200 flex items-center justify-center`}>
          {src ? (
            <img src={src} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-600 font-medium">{initial}</span>
          )}
        </div>
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
    );
  };

  // UserItem component inline
  const UserItem = ({ user, isActive, onClick }) => {
    return (
      <div
        onClick={() => onClick(user)}
        className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${isActive ? 'bg-blue-50' : ''}`}
      >
        <Avatar
          src={user.avatar}
          name={user.name}
          hasStory={user.hasStory}
          isOnline={user.isOnline}
        />
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
            {user.isVerified && (
              <div className="ml-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">
            {user.lastMessage || 'Hoạt động ' + user.time}
          </p>
        </div>
        <span className="text-xs text-gray-400">{user.time}</span>
      </div>
    );
  };

  return (
    <div className="w-1/3 border-r flex flex-col">
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

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {users.map(user => (
          <UserItem
            key={user.id}
            user={user}
            isActive={selectedUser?.id === user.id}
            onClick={onUserSelect}
          />
        ))}
      </div>
    </div>
  );


};