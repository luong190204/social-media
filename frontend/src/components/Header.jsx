import { Badge, Bell, LogOut, MessageCircle, Search, Settings, User } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';

const Header = () => {
    
    const { authUser } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hasNotifications, setHasNotifications] = useState(true);
    const [hasMessages, setHasMessages] = useState(true);

    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen(true);
    }

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-white via-purple-50/30 to-pink-50/30 backdrop-blur-sm border-b border-gray-200/60 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">
        {/* Logo bên trái */}
        <div className="flex-shrink-0">
          <a href="/">
            <img src="/assets/Swipy.png" alt="Swipy" className="w-28" />
          </a>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm"
              className="pl-10 py-2 bg-gray-100 border-0 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-gray-400"
            />
          </div>
        </div>

        {/* avatar, thông báo, message */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            {/* Nút thông báo */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full bg-gray-300"
              onClick={() => navigate("/notification")}
            >
              <Bell className="h-6 w-6" />
              {/* {hasNotifications && (
                <Badge className="absolute top-1 right-1 w-2 h-2 p-0 bg-red-500 border-2 border-white rounded-full" />
              )} */}
            </Button>

            {/* Nút tin nhắn */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full bg-gray-300"
              onClick={() => navigate("/messages")}
            >
              <MessageCircle className="h-6 w-6" />
              {/* {hasMessages && (
                <Badge className="absolute top-1 right-1 w-2 h-2 p-0 bg-red-500 border-2 border-white rounded-full" />
              )} */}
            </Button>
          </div>

          {/* Avatar */}
          <div className="relative">
            <button
              className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-gray-300 transition-all"
              onClick={toggleDropdown}
            >
              <img
                src={authUser?.profilePic || "/assets/avatar.jpg"}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </button>
            {/* Dropdown open */}
            {isDropdownOpen && (
              <>
                {/* Overlay để đóng dropdown khi click bên ngoài */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>

                {/* Menu dropdown */}
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4 mr-3 text-gray-500" />
                    Trang cá nhân
                  </a>

                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-3 text-gray-500" />
                    Cài đặt
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => alert("Đăng xuất")}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Đăng Xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header
