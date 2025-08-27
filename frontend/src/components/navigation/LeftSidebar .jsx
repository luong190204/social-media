import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sidebarItems } from './menuItems';
import { Button } from '../ui/button';

const LeftSidebar  = ({ currentUser, unreadMessages = 8, unreadNotifications = 6, onCreateClick }) => {

    const location = useLocation();
    const navigate = useNavigate();

  return (
    <div className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r border-gray-200 bg-white z-10">
      <div className="p-6">
        {/*  Logo */}
        <img src="/assets/Swipy.png" alt="Logo" className="mb-6 w-24 ml-10" />

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
            if (item.id === "messages") badgeCount = unreadMessages;
            if (item.id === "notifications") badgeCount = unreadNotifications;

            return (
              <Button
                key={item.id}
                onClick={handleClick}
                className={`w-full justify-start p-3 h-12 [&_svg]:!w-6 [&_svg]:!h-6  hover:bg-gray-200 bg-gray-100 text-black ${
                  isActive ? "font-bold" : "font-normal"
                }`}
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

                {item.label}

                {item.hasBadge && badgeCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default LeftSidebar; 
