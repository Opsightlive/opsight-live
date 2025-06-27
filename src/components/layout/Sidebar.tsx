
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle,
  BarChart3,
  Brain,
  Target,
  Briefcase,
  Mail,
  MessageSquare,
  UserCheck,
  Calendar,
  CheckSquare,
  Archive,
  Bell,
  LogOut,
  X,
  Database,
  Eye,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  FileSearch
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceDetection } from '@/hooks/use-device-detection';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isCompanyUser } = useAuth();
  const { isMobile } = useDeviceDetection();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'ai-tools': false,
  });

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onClose) onClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard,
      description: 'Portfolio overview and key metrics'
    },
    { 
      name: 'Portfolio', 
      href: '/portfolio', 
      icon: Building2,
      description: 'Property portfolio management'
    },
    { 
      name: 'KPI Center', 
      href: '/kpi-center', 
      icon: TrendingUp,
      description: 'Key performance indicators'
    },
    { 
      name: 'Red Flag Alerts', 
      href: '/red-flag-alerts', 
      icon: AlertTriangle,
      description: 'Critical issues and alerts',
      badge: '3'
    },
    { 
      name: 'Data Integration', 
      href: '/data-integration', 
      icon: Database,
      description: 'Connect your PM systems'
    },
    { 
      name: 'Integration Status', 
      href: '/integration-status', 
      icon: CheckCircle,
      description: 'Monitor data sync health'
    }
  ];

  const modules = [
    {
      category: 'LP & Reporting',
      items: [
        { name: 'LP Dashboard', href: '/lp-dashboard', icon: BarChart3 },
        { name: 'LP Reports', href: '/lp-reports', icon: FileText }
      ]
    },
    {
      category: 'AI Tools',
      key: 'ai-tools',
      expandable: true,
      items: [
        { name: 'AI Tools', href: '/ai-tools', icon: Brain },
        { name: 'AI Reader', href: '/ai-reader', icon: FileSearch },
        { name: 'Predictive Signals', href: '/predictive', icon: Target },
        { name: 'Deal Vetting', href: '/deal-vetting', icon: Briefcase }
      ]
    },
    {
      category: 'Automation',
      items: [
        { name: 'Email Automation', href: '/email-automation', icon: Mail },
        { name: 'SMS Automation', href: '/sms-automation', icon: MessageSquare }
      ]
    },
    {
      category: 'Management',
      items: [
        { name: 'PM Engagement', href: '/pm-engagement', icon: UserCheck },
        { name: 'Timeline', href: '/timeline', icon: Calendar },
        { name: 'Resolutions', href: '/resolutions', icon: CheckSquare }
      ]
    },
    {
      category: 'System',
      items: [
        { name: 'Delivery Logs', href: '/delivery-logs', icon: Archive },
        { name: 'Data Vault', href: '/data-vault', icon: Archive },
        { name: 'Notifications', href: '/notifications', icon: Bell }
      ]
    }
  ];

  const companyItems = [
    { 
      name: 'Company Dashboard', 
      href: '/company-dashboard', 
      icon: Building2,
      description: 'Company-wide analytics and management'
    },
    { 
      name: 'User Management', 
      href: '/users', 
      icon: Users,
      description: 'Manage company users and permissions'
    }
  ];

  const settingsItems = [
    { 
      name: 'Owner Setup', 
      href: '/owner-onboarding', 
      icon: Target,
      description: 'Customize your experience'
    },
    { 
      name: 'Demo Mode', 
      href: '/demo-mode', 
      icon: Eye,
      description: 'Try OPSIGHT with sample data'
    },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle }
  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full w-64 bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
            alt="OPSIGHT Logo" 
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-xl font-bold text-gray-900">OPSIGHT</h1>
        </div>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* User Info */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                {isCompanyUser && (
                  <Badge className="text-xs mt-1 bg-blue-100 text-blue-800">Company</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1 mb-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleLinkClick}
                className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </div>
                {item.badge && (
                  <Badge variant="destructive" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          <Separator className="my-4" />

          {/* Company Features (if company user) */}
          {isCompanyUser && (
            <>
              <div className="mb-4">
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Company
                </h3>
                <nav className="space-y-1">
                  {companyItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={handleLinkClick}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <Separator className="my-4" />
            </>
          )}

          {/* Modules */}
          {modules.map((section, index) => (
            <div key={section.category} className="mb-4">
              <div className="flex items-center justify-between px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.category}
                </h3>
                {section.expandable && (
                  <button
                    onClick={() => toggleSection(section.key!)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections[section.key!] ? (
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-gray-400" />
                    )}
                  </button>
                )}
              </div>
              <nav className="space-y-1">
                {section.expandable ? (
                  <>
                    <Link
                      to={section.items[0].href}
                      onClick={handleLinkClick}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(section.items[0].href)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <section.items[0].icon className="mr-3 h-4 w-4" />
                      {section.items[0].name}
                    </Link>
                    {expandedSections[section.key!] && (
                      <div className="ml-4 space-y-1">
                        {section.items.slice(1).map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={handleLinkClick}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              isActive(item.href)
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <item.icon className="mr-3 h-4 w-4" />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  section.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={handleLinkClick}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Link>
                  ))
                )}
              </nav>
              {index < modules.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <nav className="space-y-1 mb-3">
          {settingsItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleLinkClick}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
