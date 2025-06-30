
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import PropertyAwareSidebar from '@/components/navigation/PropertyAwareSidebar';
import { useAdaptiveLayoutContext } from '@/contexts/AdaptiveLayoutContext';

const Layout = () => {
  const { screenInfo } = useAdaptiveLayoutContext();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <PropertyAwareSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className={screenInfo.isMobile ? "p-4" : "p-6"}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
