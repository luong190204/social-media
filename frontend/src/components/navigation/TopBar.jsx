import React from 'react'
import { Button } from '../ui/button';
import { Heart, Search } from 'lucide-react';
import { Input } from '../ui/input';

const TopBar = ({ unreadNotifications = 10, onSearchClick, onNotificationClick }) => {

    const handleSearch = (query) => {
      if (onSearchClick) {
        onSearchClick(query);
      }
    };

    return (
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20 px-4 ">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-center size-20">
            <img src="/assets/Swipy.png" alt='Swipy Logo'/>
          </div>

          {/* Search bar */}
          <div
            className="flex-1 \ max-w-[70%] sm:max-w-xs mx-4"
          >
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
}

export default TopBar
