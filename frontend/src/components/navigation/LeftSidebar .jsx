import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sidebarItems } from './menuItems';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';
import { UseNotificationStore } from '@/store/useNotificationStore';

const LeftSidebar  = ({ currentUser, onCreateClick }) => {

  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);
  
  const { conversations } = useChatStore();
  // kiểm tra xem có tin nhắn chưa đọc không
  const hasUnreadMessages = conversations?.some(conv => conv.unReadCount > 0);

  const { notifications } = UseNotificationStore();
  // Trả về true nếu có ít nhất 1 thông báo chưa đọc
  const hasUnreadNotifications = notifications?.some((n) => !n.read)
  return (
    <div
      className={`hidden lg:block fixed left-0 top-0 h-full border-r mt-20 border-gray-200 bg-white z-10 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo + Toggle button */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <img src="/assets/Swipy.png" alt="Logo" className="w-24 "/>
        )}

        <Button 
          className="pl-2"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        > 
          {collapsed ? <Menu /> : <X />}
        </Button>
      </div>

        {/* Menu items */}
        <nav className="space-y-4">
          {sidebarItems.map((item) => {
            const isActive =
              item.path && location.pathname.startsWith(item.path);

            const handleClick = () => {
              if (item.action === "create" && onCreateClick) {
                onCreateClick();
              } else if (item.path) {
                navigate(item.path);
              }
            };

            let badgeCount = 0;
            if (item.id === "messages" && hasUnreadMessages) badgeCount = 1;
            if (item.id === "notifications" && hasUnreadNotifications) badgeCount = 1;

            return (
              <Button
                key={item.id}
                onClick={handleClick}
                className={`relative w-full h-12 [&_svg]:!w-6 [&_svg]:!h-6  hover:bg-gray-200 bg-gray-100 text-black 
                  ${isActive ? "font-bold" : "font-normal"} 
                  ${collapsed ? "justify-center pl-6" : "justify-start px-8"}`}
              >
                {item.isAvatar && currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="profile"
                    className="w-6 h-6 rounded-full mr-3"
                  />
                ) : (
                  <item.icon className="w-6 h-6 mr-3" />
                )}

                {!collapsed && <span className='ml-3'>{item.label}</span>}

                {item.hasBadge && badgeCount > 0 && (
                  <span className="absolute top-2 right-7 w-2 h-2 rounded-full bg-red-500"></span>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
  );
}

export default LeftSidebar; 
