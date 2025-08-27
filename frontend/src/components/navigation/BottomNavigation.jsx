import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { bottomNavItems } from './menuItems';
import { Button } from '../ui/button';

const BottomNavigation = ({ currentUser, unreadMessages = 0, unreadNotifications = 0, onCreateClick }) => {
  
    const location = useLocation();
    const navigate = useNavigate();
    
    return (
        <nav className='lg:hidden fixed bottom-0 left-0 right-0 border-t bg-white border-gray-200 z-20'>
            <div className='flex items-center justify-around py-3'>
                {bottomNavItems.map((item) => {
                    if (item.id === "create") {
                        return (
                          <Button
                            key={item.id}
                            onClick={onCreateClick}
                            className="p-3 h-12 [&_svg]:!w-6 [&_svg]:!h-6 bg-gray-100 text-black hover:bg-gray-200"
                          >
                            <item.icon className=" text-gray-600" />
                          </Button>
                        );
                    }

                    const isActive = item.path && location.pathname.startsWith(item.path);

                    let badgeCount = 0;
                    if (item.id === "messages") badgeCount = unreadMessages;
                    if (item.id === "notifications") badgeCount = unreadNotifications;

                    return (
                      <Button
                        key={item.id}
                        onClick={() => item.path && navigate(item.path)}
                        className="relative p-3 h-12 [&_svg]:!w-6 [&_svg]:!h-6 hover:bg-gray-200 bg-gray-100 text-black"
                      >
                        {item.isAvatar && currentUser?.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt="Profile"
                            className={`w-6 h-6 rounded-full ${
                              isActive ? "ring-2 ring-black" : ""
                            }`}
                          />
                        ) : (
                          <item.icon
                            className={`w-6 h-6 ${
                              isActive ? "text-black" : "text-gray-600"
                            }`}
                          />
                        )}

                        {item.hasBadge && badgeCount > 0 && (
                          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {badgeCount > 9 ? "+9" : badgeCount}
                          </span>
                        )}
                      </Button>
                    );
                })}

                
            </div>
        </nav>
    )
}

export default BottomNavigation
