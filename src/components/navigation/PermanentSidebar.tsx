
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { getVisibleNavigation, NavigationSection } from '@/config/navigationConfig';
import { useAdaptiveLayoutContext } from '@/contexts/AdaptiveLayoutContext';

interface PermanentSidebarProps {
  className?: string;
}

const PermanentSidebar: React.FC<PermanentSidebarProps> = ({ className }) => {
  const { userRoles, serverStatus } = useAuth();
  const { screenInfo } = useAdaptiveLayoutContext();
  const location = useLocation();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [visibleNavigation, setVisibleNavigation] = useState<NavigationSection[]>([]);

  // Update visible navigation when user roles change
  useEffect(() => {
    const navigation = getVisibleNavigation(userRoles);
    setVisibleNavigation(navigation);
  }, [userRoles]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === href;
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Mobile sidebar
  if (screenInfo.isMobile) {
    return (
      <>
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMobileToggle}
          className="fixed top-4 left-4 z-50 bg-white shadow-lg md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <div className={cn(
          "fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <MobileSidebarContent 
            visibleNavigation={visibleNavigation}
            isActive={isActive}
            serverStatus={serverStatus}
            onClose={() => setIsMobileOpen(false)}
          />
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={cn(
      "hidden md:flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 relative z-10",
      isCollapsed ? "w-16" : "w-72",
      className
    )}>
      <DesktopSidebarContent
        visibleNavigation={visibleNavigation}
        isActive={isActive}
        isCollapsed={isCollapsed}
        serverStatus={serverStatus}
        onToggleCollapse={handleToggleCollapse}
      />
    </div>
  );
};

// Mobile sidebar content component
const MobileSidebarContent: React.FC<{
  visibleNavigation: NavigationSection[];
  isActive: (href: string) => boolean;
  serverStatus: 'healthy' | 'degraded' | 'unhealthy';
  onClose: () => void;
}> = ({ visibleNavigation, isActive, serverStatus, onClose }) => (
  <div className="flex flex-col h-full">
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
          alt="OPSIGHT" 
          className="h-8 w-8 mr-3"
        />
        <span className="text-xl font-bold text-gray-900">OPSIGHT</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>

    {/* Server Status Indicator */}
    {serverStatus !== 'healthy' && (
      <div className="p-3 bg-yellow-50 border-b border-yellow-200">
        <div className="flex items-center text-sm text-yellow-800">
          <AlertTriangle className="h-4 w-4 mr-2" />
          System {serverStatus}
        </div>
      </div>
    )}

    {/* Navigation */}
    <div className="flex-1 overflow-y-auto p-2">
      <NavigationSections 
        sections={visibleNavigation} 
        isActive={isActive} 
        isCollapsed={false}
      />
    </div>

    {/* Footer */}
    <div className="p-4 border-t border-gray-200">
      <div className="text-xs text-gray-500">
        <p>© 2025 OPSIGHT</p>
        <p>Version 2.1.0</p>
      </div>
    </div>
  </div>
);

// Desktop sidebar content component
const DesktopSidebarContent: React.FC<{
  visibleNavigation: NavigationSection[];
  isActive: (href: string) => boolean;
  isCollapsed: boolean;
  serverStatus: 'healthy' | 'degraded' | 'unhealthy';
  onToggleCollapse: () => void;
}> = ({ visibleNavigation, isActive, isCollapsed, serverStatus, onToggleCollapse }) => (
  <>
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-gray-200 min-h-[60px]">
      {!isCollapsed && (
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
            alt="OPSIGHT" 
            className="h-8 w-8 mr-3"
          />
          <span className="text-xl font-bold text-gray-900">OPSIGHT</span>
        </div>
      )}
      
      <button
        onClick={onToggleCollapse}
        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        )}
      </button>
    </div>

    {/* Server Status Indicator */}
    {serverStatus !== 'healthy' && !isCollapsed && (
      <div className="p-3 bg-yellow-50 border-b border-yellow-200">
        <div className="flex items-center text-sm text-yellow-800">
          <AlertTriangle className="h-4 w-4 mr-2" />
          System {serverStatus}
        </div>
      </div>
    )}

    {/* Navigation */}
    <div className="flex-1 overflow-y-auto p-2">
      <NavigationSections 
        sections={visibleNavigation} 
        isActive={isActive} 
        isCollapsed={isCollapsed}
      />
    </div>

    {/* Footer */}
    {!isCollapsed && (
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>© 2025 OPSIGHT</p>
          <p>Version 2.1.0</p>
        </div>
      </div>
    )}
  </>
);

// Navigation sections component
const NavigationSections: React.FC<{
  sections: NavigationSection[];
  isActive: (href: string) => boolean;
  isCollapsed: boolean;
}> = ({ sections, isActive, isCollapsed }) => (
  <nav className="space-y-6">
    {sections.map((section) => (
      <div key={section.title}>
        {!isCollapsed && (
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {section.title}
          </h3>
        )}
        <div className="space-y-1">
          {section.items.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                  active
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <IconComponent className={cn(
                  "flex-shrink-0",
                  isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3",
                  active ? "text-blue-700" : "text-gray-500"
                )} />
                {!isCollapsed && (
                  <>
                    <span className="truncate flex-1">{item.name}</span>
                    {item.isNew && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        New
                      </Badge>
                    )}
                    {item.badge && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    ))}
  </nav>
);

export default PermanentSidebar;
