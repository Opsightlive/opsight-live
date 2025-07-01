
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  AlertTriangle, 
  Bot, 
  Users, 
  Building2, 
  Settings, 
  HelpCircle,
  TrendingUp,
  DollarSign,
  FileText,
  Zap,
  Shield,
  ChevronLeft,
  ChevronRight,
  Home,
  PieChart,
  Bell,
  Mail,
  MessageSquare,
  Database,
  Activity,
  Target,
  Clock,
  User,
  CreditCard,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAdaptiveLayoutContext } from '@/contexts/AdaptiveLayoutContext';

const Sidebar = () => {
  const { screenInfo, layoutSettings, updateLayoutSetting } = useAdaptiveLayoutContext();
  const [isCollapsed, setIsCollapsed] = useState(layoutSettings.sidebarCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Dashboard',
      items: [
        { name: 'Main Dashboard', href: '/dashboard', icon: Home },
        { name: 'Portfolio Overview', href: '/portfolio', icon: Building2 },
        { name: 'KPI Command Center', href: '/kpi-command-center', icon: BarChart3 },
        { name: 'LP Dashboard', href: '/lp-dashboard', icon: PieChart },
      ]
    },
    {
      title: 'Risk & Monitoring',
      items: [
        { name: 'Red Flag Alerts', href: '/red-flag-alerts', icon: AlertTriangle },
        { name: 'Predictive Signals', href: '/predictive', icon: TrendingUp },
        { name: 'Risk Core', href: '/risk-core', icon: Shield },
        { name: 'Forecast Alerts', href: '/forecast-alerts', icon: Clock },
      ]
    },
    {
      title: 'AI Intelligence',
      items: [
        { name: 'AI Intelligence Hub', href: '/ai-tools', icon: Bot },
        { name: 'AI Reader', href: '/ai-reader', icon: FileText },
        { name: 'Deal Vetting Toolkit', href: '/deal-vetting', icon: Target },
        { name: 'AI Suggestions', href: '/ai-suggestions', icon: Zap },
      ]
    },
    {
      title: 'Communications',
      items: [
        { name: 'Alerts & Notifications', href: '/notifications', icon: Bell },
        { name: 'Email Automation', href: '/email-automation', icon: Mail },
        { name: 'SMS Automation', href: '/sms-automation', icon: MessageSquare },
        { name: 'PM Engagement Score', href: '/pm-engagement', icon: Users },
      ]
    },
    {
      title: 'Data & Operations',
      items: [
        { name: 'Data Integration', href: '/data-integration', icon: Database },
        { name: 'Integration Status', href: '/integration-status', icon: Activity },
        { name: 'Data Vault', href: '/data-vault', icon: Shield },
      ]
    },
    {
      title: 'Reports & Insights',
      items: [
        { name: 'LP Report Generator', href: '/lp-reports', icon: FileText },
        { name: 'Red Flag Timeline', href: '/timeline', icon: Clock },
        { name: 'Resolution Summary', href: '/resolutions', icon: Zap },
        { name: 'Alert Delivery Logs', href: '/delivery-logs', icon: Activity },
      ]
    },
    {
      title: 'Settings & Support',
      items: [
        { name: 'User Profile', href: '/profile', icon: User },
        { name: 'System Settings', href: '/settings', icon: Settings },
        { name: 'Subscription', href: '/subscription', icon: CreditCard },
        { name: 'Help Center', href: '/help', icon: HelpCircle },
      ]
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    updateLayoutSetting('sidebarCollapsed', newCollapsed);
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Update local state when context changes
  useEffect(() => {
    setIsCollapsed(layoutSettings.sidebarCollapsed);
  }, [layoutSettings.sidebarCollapsed]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

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
          "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-2">
              <nav className="space-y-6">
                {navigationItems.map((section) => (
                  <div key={section.title}>
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                              "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                              isActive(item.href)
                                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            )}
                          >
                            <IconComponent className={cn(
                              "h-5 w-5 mr-3",
                              isActive(item.href) ? "text-blue-700" : "text-gray-500"
                            )} />
                            <span className="truncate">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <p>© 2025 OPSIGHT</p>
                <p>Version 2.1.0</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={cn(
      "hidden md:flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
          onClick={handleToggleCollapse}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-6">
          {navigationItems.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <IconComponent className={cn(
                        "flex-shrink-0",
                        isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3",
                        isActive(item.href) ? "text-blue-700" : "text-gray-500"
                      )} />
                      {!isCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="text-xs text-gray-500">
            <p>© 2025 OPSIGHT</p>
            <p>Version 2.1.0</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
