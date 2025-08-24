import React from 'react'

import Sidebar from '@/components/Sidebar '
import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "1rem" }}>
          <Outlet /> {/* render các page con */}
        </div>
      </div>
    </div>
  );
}

export default MainLayout
