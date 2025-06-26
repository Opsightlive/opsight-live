
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Navigation from './Navigation';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout = ({ children, showNavigation = false }: LayoutProps) => {
  const location = useLocation();
  
  // Don't show navigation (back button) on dashboard
  const shouldShowNavigation = showNavigation && location.pathname !== '/dashboard';

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-50">
          {shouldShowNavigation && (
            <div className="p-4">
              <Navigation />
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
