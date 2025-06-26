
import React from 'react';
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
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  companyOnly?: boolean;
}

const sidebarItems: SidebarItem[] = [
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
  {
    icon: BarChart3,
    label: 'KPI Command Center',
    path: '/kpi-center'
  },
  {
    icon: AlertTriangle,
    label: 'Red Flag Alerts',
    path: '/red-flag-alerts'
  },
  {
    icon: Bot,
    label: 'AI Reader',
    path: '/ai-reader'
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
    icon: Bot,
    label: 'AI Intelligence Tools',
    path: '/ai-tools'
  },
  {
    icon: TrendingUp,
    label: 'Predictive Signals',
    path: '/predictive'
  },
  {
    icon: FileText,
    label: 'Deal Vetting Toolkit',
    path: '/deal-vetting'
  },
  {
    icon: Mail,
    label: 'Email Automation',
    path: '/email-automation'
  },
  {
    icon: MessageSquare,
    label: 'SMS Automation',
    path: '/sms-automation'
  },
  {
    icon: BarChart3,
    label: 'PM Engagement Score',
    path: '/pm-engagement'
  },
  {
    icon: Calendar,
    label: 'Red Flag Timeline',
    path: '/timeline'
  },
  {
    icon: FileText,
    label: 'Resolution Summary',
    path: '/resolutions'
  },
  {
    icon: Bell,
    label: 'Alert Delivery Logs',
    path: '/delivery-logs'
  },
  {
    icon: Database,
    label: 'Data Vault',
    path: '/data-vault'
  },
  {
    icon: Bell,
    label: 'Alerts & Notifications',
    path: '/notifications'
  },
  {
    icon: Users,
    label: 'User Management',
    path: '/users',
    companyOnly: true
  },
  {
    icon: FileText,
    label: 'Demo Reports',
    path: '/demo'
  },
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

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isCompanyUser } = useAuth();

  const filteredItems = sidebarItems.filter(item => 
    !item.companyOnly || isCompanyUser
  );

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 group",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                      : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      isActive 
                        ? "text-blue-700" 
                        : "text-gray-500 group-hover:text-gray-700"
                    )} 
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
