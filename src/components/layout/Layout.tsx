
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout = ({ children, showNavigation = false }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-50">
          {showNavigation && (
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
