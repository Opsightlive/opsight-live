
import React from 'react';
import { Outlet } from 'react-router-dom';
import PermanentSidebar from '../navigation/PermanentSidebar';
import Header from './Header';
import ResponsiveContainer from './ResponsiveContainer';
import Navigation from './Navigation';
import { useAdaptiveLayoutContext } from '@/contexts/AdaptiveLayoutContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { screenInfo, layoutSettings } = useAdaptiveLayoutContext();

  const getFontSizeClass = () => {
    switch (layoutSettings.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getLayoutDensityClass = () => {
    switch (layoutSettings.layoutDensity) {
      case 'compact': return 'space-y-2';
      case 'spacious': return 'space-y-8';
      default: return 'space-y-4';
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-gray-50 flex",
      getFontSizeClass(),
      // Add safe area padding for devices with notches
      screenInfo.hasNotch && "pt-safe-area-inset-top pb-safe-area-inset-bottom"
    )}>
      {/* Global Navigation Back Button */}
      <Navigation />
      
      {/* Permanent Sidebar - Always present and visible */}
      <div className="flex-shrink-0">
        <PermanentSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        {/* Page Content with Module Loading */}
        <main className={cn(
          "flex-1 overflow-auto",
          screenInfo.isMobile ? "p-2" : "p-4 md:p-6",
          getLayoutDensityClass()
        )}>
          <ResponsiveContainer
            maxWidth={screenInfo.isTV ? '2xl' : 'full'}
            padding={screenInfo.isMobile ? 'sm' : 'md'}
          >
            {children || <Outlet />}
          </ResponsiveContainer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
