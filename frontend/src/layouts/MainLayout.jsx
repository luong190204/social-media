import Header from "@/components/header/Header";
import { LeftSidebar } from "@/components/navigation";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import React from "react";

import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();
  const isMessagePage = location.pathname.startsWith("/messages");

  return (
    <div
      className={`flex flex-col h-screen bg-white ${
        isMessagePage ? "overflow-hidden" : "overflow-y-auto"
      }`}
    >
      {/* Top bar luôn hiển thị */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar cho desktop */}
        <div className="hidden md:block w-64">
          <LeftSidebar />
        </div>

        {/* Nội dung chính */}
        <div
          className={`flex-1 ${
            isMessagePage ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          <Outlet />
        </div>
      </div>

      {/* Bottom nav cho mobile */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default MainLayout;
