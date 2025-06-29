
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
  Eye,
  Calendar,
  Map,
  Calculator,
  Search,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { UserRole } from '@/services/authService';

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: any;
  description?: string;
  requiredRoles?: UserRole[];
  isNew?: boolean;
  badge?: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
  requiredRoles?: UserRole[];
}

export const navigationConfig: NavigationSection[] = [
  {
    title: 'Dashboard',
    items: [
      { id: 'dashboard', name: 'Main Dashboard', href: '/dashboard', icon: Home, description: 'Overview of all metrics' },
      { id: 'portfolio', name: 'Portfolio Overview', href: '/portfolio', icon: Building2, description: 'Property portfolio management' },
      { id: 'kpi-command', name: 'KPI Command Center', href: '/kpi-command-center', icon: BarChart3, description: 'Real-time KPI monitoring' },
      { id: 'lp-dashboard', name: 'LP Dashboard', href: '/lp-dashboard', icon: PieChart, description: 'Limited Partner insights' }
    ]
  },
  {
    title: 'Risk & Monitoring',
    items: [
      { id: 'red-flags', name: 'Red Flag Alerts', href: '/red-flag-alerts', icon: AlertTriangle, description: 'Critical issue monitoring' },
      { id: 'predictive', name: 'Predictive Signals', href: '/predictive', icon: TrendingUp, description: 'AI-powered forecasting' },
      { id: 'risk-core', name: 'Risk Core', href: '/risk-core', icon: Shield, description: 'Risk assessment engine', isNew: true },
      { id: 'forecast-alerts', name: 'Forecast Alerts', href: '/forecast-alerts', icon: Clock, description: 'Predictive alert system' }
    ]
  },
  {
    title: 'AI Intelligence',
    items: [
      { id: 'ai-tools', name: 'AI Intelligence Hub', href: '/ai-tools', icon: Bot, description: 'AI-powered insights' },
      { id: 'ai-reader', name: 'AI Reader', href: '/ai-reader', icon: FileText, description: 'Document processing AI' },
      { id: 'deal-vetting', name: 'Deal Vetting Toolkit', href: '/deal-vetting', icon: Target, description: 'Investment analysis tools' },
      { id: 'ai-suggestions', name: 'AI Suggestions', href: '/ai-suggestions', icon: Zap, description: 'Smart recommendations' }
    ]
  },
  {
    title: 'Communications',
    items: [
      { id: 'notifications', name: 'Alerts & Notifications', href: '/notifications', icon: Bell, description: 'Notification center' },
      { id: 'email-automation', name: 'Email Automation', href: '/email-automation', icon: Mail, description: 'Automated email campaigns' },
      { id: 'sms-automation', name: 'SMS Automation', href: '/sms-automation', icon: MessageSquare, description: 'SMS notification system' },
      { id: 'pm-engagement', name: 'PM Engagement Score', href: '/pm-engagement', icon: Users, description: 'Property manager metrics' }
    ]
  },
  {
    title: 'Data & Operations',
    items: [
      { id: 'data-integration', name: 'Data Integration', href: '/data-integration', icon: Database, description: 'Data source management' },
      { id: 'integration-status', name: 'Integration Status', href: '/integration-status', icon: Activity, description: 'System health monitoring' },
      { id: 'data-vault', name: 'Data Vault', href: '/data-vault', icon: Shield, description: 'Secure data storage' },
      { id: 'analytics', name: 'Advanced Analytics', href: '/analytics', icon: Calculator, description: 'Deep data analysis' }
    ]
  },
  {
    title: 'Reports & Insights',
    items: [
      { id: 'lp-reports', name: 'LP Report Generator', href: '/lp-reports', icon: FileText, description: 'Generate investor reports' },
      { id: 'timeline', name: 'Red Flag Timeline', href: '/timeline', icon: Clock, description: 'Historical issue tracking' },
      { id: 'resolutions', name: 'Resolution Summary', href: '/resolutions', icon: Zap, description: 'Issue resolution tracking' },
      { id: 'delivery-logs', name: 'Alert Delivery Logs', href: '/delivery-logs', icon: Activity, description: 'Notification delivery status' },
      { id: 'performance', name: 'Performance Reports', href: '/performance', icon: TrendingUp, description: 'Portfolio performance analysis' }
    ]
  },
  {
    title: 'Portfolio Management',
    items: [
      { id: 'property-map', name: 'Property Map', href: '/property-map', icon: Map, description: 'Geographic property view' },
      { id: 'tenant-portal', name: 'Tenant Portal', href: '/tenant-portal', icon: Users, description: 'Tenant management' },
      { id: 'maintenance', name: 'Maintenance Tracker', href: '/maintenance', icon: Briefcase, description: 'Property maintenance system' },
      { id: 'financials', name: 'Financial Overview', href: '/financials', icon: DollarSign, description: 'Financial performance tracking' }
    ]
  },
  {
    title: 'Settings & Support',
    requiredRoles: ['owner', 'pm'],
    items: [
      { id: 'profile', name: 'User Profile', href: '/profile', icon: User, description: 'Personal account settings' },
      { id: 'settings', name: 'System Settings', href: '/settings', icon: Settings, description: 'Application configuration' },
      { id: 'subscription', name: 'Subscription', href: '/subscription', icon: CreditCard, description: 'Billing and subscription' },
      { id: 'help', name: 'Help Center', href: '/help', icon: HelpCircle, description: 'Support and documentation' }
    ]
  }
];

export const getVisibleNavigation = (userRoles: UserRole[]): NavigationSection[] => {
  return navigationConfig
    .filter(section => !section.requiredRoles || section.requiredRoles.some(role => userRoles.includes(role)))
    .map(section => ({
      ...section,
      items: section.items.filter(item => 
        !item.requiredRoles || item.requiredRoles.some(role => userRoles.includes(role))
      )
    }))
    .filter(section => section.items.length > 0);
};
