import { LeftSidebar } from '@/components/navigation';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import TopBar from '@/components/navigation/TopBar';
import React from 'react'

import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="main-layout min-h-screen bg-white flex flex-col">
      {/* Top bar luôn hiển thị */}
      <TopBar />

      <div className="flex flex-1">
        {/* Sidebar cho desktop */}
        <div className="hidden md:block w-64">
          <LeftSidebar />
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>

      {/* Sidebar phụ bên phải (tuỳ chọn, gợi ý follow) */}
      {/* <aside className="hidden lg:block w-80 border-l">
        <RightSidebar />
      </aside> */}

      {/* Bottom nav cho mobile */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};


export default MainLayout
