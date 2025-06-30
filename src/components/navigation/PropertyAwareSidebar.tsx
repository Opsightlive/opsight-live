
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  AlertTriangle,
  Building2,
  Home,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Bell,
  FileText,
  Settings,
  Shield,
  Database,
  Activity,
  Bot,
  Target,
  Mail,
  MessageSquare,
  Clock,
  User,
  CreditCard,
  HelpCircle,
  PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAdaptiveLayoutContext } from '@/contexts/AdaptiveLayoutContext';

interface PropertyAwareSidebarProps {
  className?: string;
}

const PropertyAwareSidebar: React.FC<PropertyAwareSidebarProps> = ({ className }) => {
  const { user } = useAuth();
  const { dashboardData, hasRealData } = useDashboardData();
  const { screenInfo } = useAdaptiveLayoutContext();
  const location = useLocation();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Property-specific navigation with Trinity Trace context
  const propertyAwareNavigation = [
    {
      title: 'Trinity Trace Dashboard',
      items: [
        { name: 'Portfolio Overview', href: '/portfolio', icon: Home, description: 'Trinity Trace performance' },
        { name: 'Trinity Trace KPIs', href: '/kpi-command-center', icon: BarChart3, description: 'Live Trinity Trace metrics' },
        { name: 'Property Dashboard', href: '/dashboard', icon: Building2, description: 'Trinity Trace insights' },
        { name: 'LP Dashboard', href: '/lp-dashboard', icon: PieChart, description: 'Trinity Trace investor view' },
      ]
    },
    {
      title: 'Trinity Trace Operations',
      items: [
        { name: 'Property Alerts', href: '/red-flag-alerts', icon: AlertTriangle, description: 'Trinity Trace alert monitoring' },
        { name: 'Occupancy Tracking', href: '/predictive', icon: Users, description: 'Trinity Trace occupancy insights' },
        { name: 'Revenue Analysis', href: '/financials', icon: DollarSign, description: 'Trinity Trace financial performance' },
        { name: 'Performance Trends', href: '/performance', icon: TrendingUp, description: 'Trinity Trace analytics' },
      ]
    },
    {
      title: 'Trinity Trace Management',
      items: [
        { name: 'Property Data Hub', href: '/data-integration', icon: Database, description: 'Trinity Trace data connections' },
        { name: 'OneSite Integration', href: '/integration-status', icon: Activity, description: 'Trinity Trace PM system' },
        { name: 'Tenant Communications', href: '/email-automation', icon: Mail, description: 'Trinity Trace tenant messaging' },
        { name: 'Maintenance Tracking', href: '/maintenance', icon: Settings, description: 'Trinity Trace work orders' },
      ]
    },
    {
      title: 'Trinity Trace Intelligence',
      items: [
        { name: 'AI Property Insights', href: '/ai-tools', icon: Bot, description: 'Trinity Trace AI analysis' },
        { name: 'Investment Analysis', href: '/deal-vetting', icon: Target, description: 'Trinity Trace investment tools' },
        { name: 'Document Processing', href: '/ai-reader', icon: FileText, description: 'Trinity Trace document AI' },
        { name: 'Property Reports', href: '/lp-reports', icon: FileText, description: 'Trinity Trace reporting' },
      ]
    },
    {
      title: 'Communications & Alerts',
      items: [
        { name: 'Alert Center', href: '/notifications', icon: Bell, description: 'Trinity Trace notifications' },
        { name: 'SMS Automation', href: '/sms-automation', icon: MessageSquare, description: 'Trinity Trace SMS system' },
        { name: 'Alert Timeline', href: '/timeline', icon: Clock, description: 'Trinity Trace alert history' },
        { name: 'Resolution Tracking', href: '/resolutions', icon: Shield, description: 'Trinity Trace issue resolution' },
      ]
    },
    {
      title: 'Account & Settings',
      items: [
        { name: 'User Profile', href: '/profile', icon: User, description: 'Your account settings' },
        { name: 'System Settings', href: '/settings', icon: Settings, description: 'Trinity Trace configuration' },
        { name: 'Subscription', href: '/subscription', icon: CreditCard, description: 'Billing and subscription' },
        { name: 'Help Center', href: '/help', icon: HelpCircle, description: 'Support and documentation' },
      ]
    }
  ];

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
            propertyAwareNavigation={propertyAwareNavigation}
            isActive={isActive}
            hasRealData={hasRealData}
            propertyCount={dashboardData.totalProperties}
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
        propertyAwareNavigation={propertyAwareNavigation}
        isActive={isActive}
        isCollapsed={isCollapsed}
        hasRealData={hasRealData}
        propertyCount={dashboardData.totalProperties}
        onToggleCollapse={handleToggleCollapse}
      />
    </div>
  );
};

// Mobile sidebar content component
const MobileSidebarContent: React.FC<{
  propertyAwareNavigation: any[];
  isActive: (href: string) => boolean;
  hasRealData: boolean;
  propertyCount: number;
  onClose: () => void;
}> = ({ propertyAwareNavigation, isActive, hasRealData, propertyCount, onClose }) => (
  <div className="flex flex-col h-full">
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center">
        <Building2 className="h-8 w-8 mr-3 text-blue-600" />
        <div>
          <span className="text-lg font-bold text-gray-900">Trinity Trace</span>
          <div className="text-xs text-gray-500">Property Management</div>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>

    {/* Property Status */}
    <div className="p-3 bg-blue-50 border-b border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-blue-800">
          <div className={cn("w-2 h-2 rounded-full mr-2", hasRealData ? "bg-green-500" : "bg-orange-500")} />
          <span>{hasRealData ? `${propertyCount} Properties Connected` : 'Connect Your Property'}</span>
        </div>
        {hasRealData && (
          <Badge className="bg-green-100 text-green-800 text-xs">Live Data</Badge>
        )}
      </div>
    </div>

    {/* Navigation */}
    <div className="flex-1 overflow-y-auto p-2">
      <NavigationSections 
        sections={propertyAwareNavigation} 
        isActive={isActive} 
        isCollapsed={false}
      />
    </div>

    {/* Footer */}
    <div className="p-4 border-t border-gray-200">
      <div className="text-xs text-gray-500">
        <p>© 2025 OPSIGHT</p>
        <p>Trinity Trace Dashboard v2.1</p>
      </div>
    </div>
  </div>
);

// Desktop sidebar content component
const DesktopSidebarContent: React.FC<{
  propertyAwareNavigation: any[];
  isActive: (href: string) => boolean;
  isCollapsed: boolean;
  hasRealData: boolean;
  propertyCount: number;
  onToggleCollapse: () => void;
}> = ({ propertyAwareNavigation, isActive, isCollapsed, hasRealData, propertyCount, onToggleCollapse }) => (
  <>
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-gray-200 min-h-[60px]">
      {!isCollapsed && (
        <div className="flex items-center">
          <Building2 className="h-8 w-8 mr-3 text-blue-600" />
          <div>
            <span className="text-lg font-bold text-gray-900">Trinity Trace</span>
            <div className="text-xs text-gray-500">Property Management</div>
          </div>
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

    {/* Property Status */}
    {!isCollapsed && (
      <div className="p-3 bg-blue-50 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-blue-800">
            <div className={cn("w-2 h-2 rounded-full mr-2", hasRealData ? "bg-green-500" : "bg-orange-500")} />
            <span>{hasRealData ? `${propertyCount} Properties Connected` : 'Connect Your Property'}</span>
          </div>
          {hasRealData && (
            <Badge className="bg-green-100 text-green-800 text-xs">Live</Badge>
          )}
        </div>
      </div>
    )}

    {/* Navigation */}
    <div className="flex-1 overflow-y-auto p-2">
      <NavigationSections 
        sections={propertyAwareNavigation} 
        isActive={isActive} 
        isCollapsed={isCollapsed}
      />
    </div>

    {/* Footer */}
    {!isCollapsed && (
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>© 2025 OPSIGHT</p>
          <p>Trinity Trace Dashboard v2.1</p>
        </div>
      </div>
    )}
  </>
);

// Navigation sections component
const NavigationSections: React.FC<{
  sections: any[];
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
          {section.items.map((item: any) => {
            const IconComponent = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                  active
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
                title={isCollapsed ? item.description : undefined}
              >
                <IconComponent className={cn(
                  "flex-shrink-0",
                  isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3",
                  active ? "text-blue-700" : "text-gray-500"
                )} />
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    ))}
  </nav>
);

export default PropertyAwareSidebar;
