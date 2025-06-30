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
import { usePropertyData } from '@/hooks/usePropertyData';
import { useAdaptiveLayoutContext } from '@/contexts/AdaptiveLayoutContext';
import PropertySwitcher from './PropertySwitcher';

interface PropertyAwareSidebarProps {
  className?: string;
}

const PropertyAwareSidebar: React.FC<PropertyAwareSidebarProps> = ({ className }) => {
  const { user } = useAuth();
  const { properties, currentProperty } = usePropertyData();
  const { screenInfo } = useAdaptiveLayoutContext();
  const location = useLocation();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Dynamic navigation based on current property
  const getPropertyAwareNavigation = () => {
    const propertyName = currentProperty?.name || 'Your Property';
    
    return [
      {
        title: `${propertyName} Dashboard`,
        items: [
          { name: 'Portfolio Overview', href: '/portfolio', icon: Home, description: `${propertyName} performance` },
          { name: `${propertyName} KPIs`, href: '/kpi-command-center', icon: BarChart3, description: `Live ${propertyName} metrics` },
          { name: 'Property Dashboard', href: '/dashboard', icon: Building2, description: `${propertyName} insights` },
          { name: 'LP Dashboard', href: '/lp-dashboard', icon: PieChart, description: `${propertyName} investor view` },
        ]
      },
      {
        title: `${propertyName} Operations`,
        items: [
          { name: 'Property Alerts', href: '/red-flag-alerts', icon: AlertTriangle, description: `${propertyName} alert monitoring` },
          { name: 'Occupancy Tracking', href: '/predictive', icon: Users, description: `${propertyName} occupancy insights` },
          { name: 'Revenue Analysis', href: '/financials', icon: DollarSign, description: `${propertyName} financial performance` },
          { name: 'Performance Trends', href: '/performance', icon: TrendingUp, description: `${propertyName} analytics` },
        ]
      },
      {
        title: `${propertyName} Management`,
        items: [
          { name: 'Property Data Hub', href: '/data-integration', icon: Database, description: `${propertyName} data connections` },
          { name: `${currentProperty?.pm_software || 'PM'} Integration`, href: '/integration-status', icon: Activity, description: `${propertyName} PM system` },
          { name: 'Tenant Communications', href: '/email-automation', icon: Mail, description: `${propertyName} tenant messaging` },
          { name: 'Maintenance Tracking', href: '/maintenance', icon: Settings, description: `${propertyName} work orders` },
        ]
      },
      {
        title: `${propertyName} Intelligence`,
        items: [
          { name: 'AI Property Insights', href: '/ai-tools', icon: Bot, description: `${propertyName} AI analysis` },
          { name: 'Investment Analysis', href: '/deal-vetting', icon: Target, description: `${propertyName} investment tools` },
          { name: 'Document Processing', href: '/ai-reader', icon: FileText, description: `${propertyName} document AI` },
          { name: 'Property Reports', href: '/lp-reports', icon: FileText, description: `${propertyName} reporting` },
        ]
      },
      {
        title: 'Communications & Alerts',
        items: [
          { name: 'Alert Center', href: '/notifications', icon: Bell, description: `${propertyName} notifications` },
          { name: 'SMS Automation', href: '/sms-automation', icon: MessageSquare, description: `${propertyName} SMS system` },
          { name: 'Alert Timeline', href: '/timeline', icon: Clock, description: `${propertyName} alert history` },
          { name: 'Resolution Tracking', href: '/resolutions', icon: Shield, description: `${propertyName} issue resolution` },
        ]
      },
      {
        title: 'Account & Settings',
        items: [
          { name: 'User Profile', href: '/profile', icon: User, description: 'Your account settings' },
          { name: 'System Settings', href: '/settings', icon: Settings, description: `${propertyName} configuration` },
          { name: 'Subscription', href: '/subscription', icon: CreditCard, description: 'Billing and subscription' },
          { name: 'Help Center', href: '/help', icon: HelpCircle, description: 'Support and documentation' },
        ]
      }
    ];
  };

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
            propertyAwareNavigation={getPropertyAwareNavigation()}
            isActive={isActive}
            currentProperty={currentProperty}
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
        propertyAwareNavigation={getPropertyAwareNavigation()}
        isActive={isActive}
        isCollapsed={isCollapsed}
        currentProperty={currentProperty}
        onToggleCollapse={handleToggleCollapse}
      />
    </div>
  );
};

// Mobile sidebar content component
const MobileSidebarContent: React.FC<{
  propertyAwareNavigation: any[];
  isActive: (href: string) => boolean;
  currentProperty: any;
  onClose: () => void;
}> = ({ propertyAwareNavigation, isActive, currentProperty, onClose }) => (
  <div className="flex flex-col h-full">
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center">
        <Building2 className="h-8 w-8 mr-3 text-blue-600" />
        <div>
          <span className="text-lg font-bold text-gray-900">OPSIGHT</span>
          <div className="text-xs text-gray-500">Property Management</div>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>

    {/* Property Switcher */}
    <PropertySwitcher />

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
        <p>Property Dashboard v2.1</p>
      </div>
    </div>
  </div>
);

// Desktop sidebar content component
const DesktopSidebarContent: React.FC<{
  propertyAwareNavigation: any[];
  isActive: (href: string) => boolean;
  isCollapsed: boolean;
  currentProperty: any;
  onToggleCollapse: () => void;
}> = ({ propertyAwareNavigation, isActive, isCollapsed, currentProperty, onToggleCollapse }) => (
  <>
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-gray-200 min-h-[60px]">
      {!isCollapsed && (
        <div className="flex items-center">
          <Building2 className="h-8 w-8 mr-3 text-blue-600" />
          <div>
            <span className="text-lg font-bold text-gray-900">OPSIGHT</span>
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

    {/* Property Switcher */}
    {!isCollapsed && <PropertySwitcher />}

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
          <p>Property Dashboard v2.1</p>
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
