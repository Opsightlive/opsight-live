
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  BarChart3, 
  AlertTriangle, 
  Bot,
  Users,
  Settings,
  HelpCircle,
  FileText,
  Mail,
  MessageSquare,
  TrendingUp,
  Calendar,
  Database,
  Bell,
  X,
  ChevronDown,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AISuggestionsPanel from '@/components/ai/AISuggestionsPanel';

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path?: string;
  companyOnly?: boolean;
  children?: SidebarItem[];
  component?: React.ComponentType;
}

interface SidebarProps {
  onClose?: () => void;
}

const sidebarItems: SidebarItem[] = [
  // Core Dashboard & Overview
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard'
  },
  {
    icon: Building2,
    label: 'Portfolio Overview',
    path: '/portfolio'
  },
  
  // Alerts & Monitoring (with dropdown)
  {
    icon: AlertTriangle,
    label: 'Alerts & Monitoring',
    children: [
      {
        icon: AlertTriangle,
        label: 'Red Flag Alerts',
        path: '/red-flag-alerts'
      },
      {
        icon: Calendar,
        label: 'Red Flag Timeline',
        path: '/timeline'
      },
      {
        icon: TrendingUp,
        label: 'Predictive Signals',
        path: '/predictive'
      },
      {
        icon: Bell,
        label: 'Alerts & Notifications',
        path: '/notifications'
      },
      {
        icon: Bell,
        label: 'Alert Delivery Logs',
        path: '/delivery-logs'
      }
    ]
  },
  
  // Analytics & KPIs
  {
    icon: BarChart3,
    label: 'Analytics & KPIs',
    children: [
      {
        icon: BarChart3,
        label: 'KPI Command Center',
        path: '/kpi-center'
      },
      {
        icon: BarChart3,
        label: 'PM Engagement Score',
        path: '/pm-engagement'
      }
    ]
  },
  
  // AI Tools (with dropdown including AI Suggestions)
  {
    icon: Bot,
    label: 'AI Tools',
    children: [
      {
        icon: Bot,
        label: 'AI Reader',
        path: '/ai-reader'
      },
      {
        icon: Bot,
        label: 'AI Intelligence Tools',
        path: '/ai-tools'
      },
      {
        icon: Lightbulb,
        label: 'AI Suggestions',
        component: AISuggestionsPanel
      }
    ]
  },
  
  // Reports & Analytics (with dropdown)
  {
    icon: FileText,
    label: 'Reports & Analytics',
    children: [
      {
        icon: FileText,
        label: 'Resolution Summary',
        path: '/resolutions'
      },
      {
        icon: FileText,
        label: 'LP Report Generator',
        path: '/lp-reports'
      },
      {
        icon: TrendingUp,
        label: 'LP Dashboard',
        path: '/lp-dashboard'
      },
      {
        icon: FileText,
        label: 'Deal Vetting Toolkit',
        path: '/deal-vetting'
      }
    ]
  },
  
  // Automation (with dropdown)
  {
    icon: Mail,
    label: 'Automation',
    children: [
      {
        icon: Mail,
        label: 'Email Automation',
        path: '/email-automation'
      },
      {
        icon: MessageSquare,
        label: 'SMS Automation',
        path: '/sms-automation'
      }
    ]
  },
  
  // Data & Management
  {
    icon: Database,
    label: 'Data Vault',
    path: '/data-vault'
  },
  
  // Administration (Company Only)
  {
    icon: Users,
    label: 'User Management',
    path: '/users',
    companyOnly: true
  },
  
  // Settings & Support
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings'
  },
  {
    icon: HelpCircle,
    label: 'Help Center',
    path: '/help'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const { isCompanyUser } = useAuth();
  const { isMobile } = useDeviceDetection();
  const [expandedItems, setExpandedItems] = useState<string[]>(['AI Tools']); // Default expand AI Tools to show suggestions

  const filteredItems = sidebarItems.filter(item => 
    !item.companyOnly || isCompanyUser
  );

  const handleItemClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const isActive = item.path ? location.pathname === item.path : false;
    const hasActiveChild = item.children?.some(child => child.path === location.pathname);
    
    return (
      <li key={item.label}>
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleExpanded(item.label)}
              className={cn(
                "w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 group",
                (isActive || hasActiveChild)
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              <item.icon 
                className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  (isActive || hasActiveChild)
                    ? "text-blue-700" 
                    : "text-gray-500 group-hover:text-gray-700"
                )} 
              />
              <span className="flex-1 text-left">{item.label}</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {isExpanded && (
              <ul className="ml-4 mt-1 space-y-1">
                {item.children.map(child => {
                  if (child.component) {
                    const Component = child.component;
                    return (
                      <li key={child.label} className="px-4 py-2">
                        <Component />
                      </li>
                    );
                  }
                  return renderSidebarItem(child, level + 1);
                })}
              </ul>
            )}
          </>
        ) : (
          <Link
            to={item.path!}
            onClick={handleItemClick}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 group",
              level > 0 ? "ml-4" : "",
              isActive 
                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                : "text-gray-700 hover:text-gray-900"
            )}
          >
            <item.icon 
              className={cn(
                "mr-3 h-5 w-5 transition-colors",
                level > 0 ? "h-4 w-4" : "",
                isActive 
                  ? "text-blue-700" 
                  : "text-gray-500 group-hover:text-gray-700"
              )} 
            />
            {item.label}
          </Link>
        )}
      </li>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 ${isMobile ? 'w-80' : 'w-64'} h-full flex flex-col`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
              alt="OPSIGHT Logo" 
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-xl font-bold text-gray-900">OPSIGHT</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <nav className={`${isMobile ? 'mt-4' : 'mt-8'} px-4 pb-8`}>
          <ul className="space-y-2">
            {filteredItems.map(item => renderSidebarItem(item))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
