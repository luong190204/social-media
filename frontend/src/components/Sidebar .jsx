import { Compass, Heart, Home, MessageSquare, PlusSquare, Search, User, Video } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

// Top Bar Component (Mobile)
export const TopBar = ({
  onSearchClick,
  onNotificationClick,
  unreadNotifications = 0,
}) => {

  const handleSearch = (query) => {
    if (onSearchClick) {
      onSearchClick(query)
    }
  }

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20 px-4 ">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-center size-20">
          <img src="/assets/Swipy.png" />
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-xs mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm"
              className="pl-10 py-2 bg-gray-100 border-0 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-gray-300"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 [&_svg]:!w-6 [&_svg]:!h-6"
          onClick={onNotificationClick}
        >
          <Heart />
          {unreadNotifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadNotifications > 9 ? "+9" : unreadNotifications}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

// Left Sidebar Component (Desktop)
export const LeftSidebar = ({
  activeItem = "home",
  onNavigate,
  onSearchClick,
  onNotificationClick,
  onCreateClick,
  unreadMessages = 0,
  hasNewNotifications = false,
  currentUser,
}) => {

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r border-gray-200 bg-white z-10">
      <div className="p-6">
        {/* Logo */}
        <div className="size-20 ml-12">
          <img src="/assets/Swipy.png" />
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {/* Trang chủ */}
          <Button
            variant="ghost"
            className={`w-full justify-start p-3 h-12 [&_svg]:!w-6 [&_svg]:!h-6  hover:bg-gray-100 ${
              activeItem === "home" ? "font-semibold" : "font-normal"
            }`}
            onClick={() => handleNavigation("home")}
          >
            <Home className="w-6 h-6 mr-4" />
            Trang chủ
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start p-3 h-12 [&_svg]:!w-6 [&_svg]:!h-6  hover:bg-gray-100 ${
              activeItem === "search" ? "font-semibold" : "font-normal"
            }`}
            onClick={onSearchClick}
          >
            <Search className="w-6 h-6 mr-4" />
            Tìm kiếm
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start p-3 h-12 [&_svg]:!w-6 [&_svg]:!h-6  hover:bg-gray-100 ${
              activeItem === "explore" ? "font-semibold" : "font-normal"
            }`}
            onClick={() => handleNavigation("explore")}
          >
            <Compass className="w-6 h-6 mr-4" />
            Khám phá
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start p-3 h-12 [&_svg]:!w-6 [&_svg]:!h-6  hover:bg-gray-100 ${
              activeItem === "reels" ? "font-semibold" : "font-normal"
            }`}
            onClick={() => handleNavigation("reels")}
          >
            <Video className="w-6 h-6 mr-4" />
            Reels
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start p-3 h-12 [&_svg]:!w-6 [&_svg]:!h-6  hover:bg-gray-100 relative ${
              activeItem === "messages" ? "font-semibold" : "font-normal"
            }`}
            onClick={() => handleNavigation("messages")}
          >
            <MessageSquare className="w-6 h-6 mr-4" />
            Tin nhắn
            {unreadMessages > 0 && (
              <span className="absolute top-2 left-7 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadMessages > 9 ? "+9" : unreadMessages}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start p-3 h-12 [&_svg]:!w-6 [&_svg]:!h-6  hover:bg-gray-100 ${
              activeItem === "notifications" ? "font-semibold" : "font-normal"
            }`}
            onClick={onNotificationClick}
          >
            <Heart className="w-6 h-6 mr-4" />
            Thông báo
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start p-3 h-12 [&_svg]:!w-6 [&_svg]:!h-6 hover:bg-gray-100 font-normal"
            onClick={onCreateClick}
          >
            <PlusSquare className="w-6 h-6 mr-4" />
            Tạo
          </Button>

          {/* Trang cá nhân */}
          <Button
            variant="ghost"
            className={`w-full justify-start p-3 h-12 [&_svg]:!w-6 [&_svg]:!h-6  hover:bg-gray-100 ${
              activeItem === "profile" ? "font-semibold" : "font-normal"
            }`}
            onClick={() => handleNavigation("profile")}
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-6 h-6 rounded-full mr-4"
              />
            ) : (
              <User className="w-6 h-6 mr-4" />
            )}
            Trang cá nhân
          </Button>
        </nav>
      </div>

      {/* Bottom Menu Item */}
      <div className="absolute bottom-6 left-6 right-6 ">
        <Button
          variant="ghost"
          className="w-full justify-start p-3 h-12 [&_svg]:!w-6 [&_svg]:!h-6 hover:bg-gray-100"
          onClick={() => handleNavigation("more")}
        >
          <div className="w-6 h-6 mr-4 flex items-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
            </svg>
          </div>
          Xem thêm
        </Button>
      </div>
    </div>
  );
};

// Bottom Navigation Component (Mobile)
export const BottomNavigation = ({ 
  activeItem = 'home', 
  onNavigate, 
  onCreateClick, 
  currentUser,
    
  unreadMessages = 1 }) => {

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div className="flex items-center justify-around py-3">
        {/* Trang chủ */}
        <Button
          variant="ghost"
          className="p-3 h-8 w-8 [&_svg]:!w-6 [&_svg]:!h-6 "
          onClick={() => handleNavigation("home")}
        >
          <Home
            className={`${
              activeItem === "home" ? "text-black" : "text-gray-600"
            }`}
          />
        </Button>

        <Button
          variant="ghost"
          className="p-3 h-8 w-8 [&_svg]:!w-6 [&_svg]:!h-6"
          onClick={() => handleNavigation("explore")}
        >
          <Compass
            className={`${
              activeItem === "explore" ? "text-black" : "text-gray-600"
            }`}
          />
        </Button>

        <Button
          variant="ghost"
          className="p-3 h-8 w-8 [&_svg]:!w-6 [&_svg]:!h-6"
          onClick={() => handleNavigation("reels")}
        >
          <Video
            className={`${
              activeItem === "reels" ? "text-black" : "text-gray-600"
            }`}
          />
        </Button>

        <Button
          variant="ghost"
          className="p-3 h-8 w-8 [&_svg]:!w-6 [&_svg]:!h-6"
          onClick={onCreateClick}
        >
          <PlusSquare
            className={`${
              activeItem === "reels" ? "text-black" : "text-gray-600"
            }`}
          />
        </Button>

        <Button
          variant="ghost"
          className="p-3 relative h-8 w-8 [&_svg]:!w-6 [&_svg]:!h-6"
          onClick={() => handleNavigation("messages")}
        >
          <MessageSquare
            className={`${
              activeItem === "messages" ? "text-black" : "text-gray-600"
            }`}
          />
          {unreadMessages > 0 && (
            <span className="absolute top-0 left-5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadMessages > 9 ? "+9" : unreadMessages}
            </span>
          )}
        </Button>

        {/* Trang cá nhân */}
        <Button
          variant="ghost"
          size="sm"
          className="p-3  h-8 w-8 [&_svg]:!w-6 [&_svg]:!h-6"
          onClick={() => handleNavigation("profile")}
        >
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt="Profile"
              className={`w-6 h-6 rounded-full ${
                activeItem === "profile" ? "ring-2 ring-black" : ""
              }`}
            />
          ) : (
            <User
              className={`w-6 h-6 ${
                activeItem === "profile" ? "text-black" : "text-gray-600"
              }`}
            />
          )}
        </Button>
      </div>
    </div>
  );
};