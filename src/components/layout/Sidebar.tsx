import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  AlertTriangle, 
  FileText, 
  Users, 
  Building2, 
  Bot, 
  Settings,
  HelpCircle,
  Upload,
  Bell,
  TrendingUp,
  Flag,
  Clock,
  Shield,
  Mail,
  MessageSquare,
  Database,
  Target,
  Crown
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const menuItems = [
    { 
      category: "CORE MODULES",
      items: [
        // Show Company Dashboard for company users, Portfolio Overview for clients
        ...(user?.userType === 'company' 
          ? [{ name: "Company Dashboard", path: "/company-dashboard", icon: Crown }]
          : [{ name: "Portfolio Overview", path: "/", icon: Building2 }]
        ),
        { name: "KPI Command Center", path: "/kpi-center", icon: BarChart3 },
        { name: "Red Flag Alerts", path: "/red-flags", icon: AlertTriangle },
        { name: "AI Reader", path: "/ai-reader", icon: Upload },
        { name: "LP Report Generator", path: "/lp-reports", icon: FileText },
        { name: "LP Dashboard", path: "/lp-dashboard", icon: Users },
      ]
    },
    {
      category: "INTELLIGENCE & AUTOMATION",
      items: [
        { name: "AI Intelligence Tools", path: "/ai-tools", icon: Bot },
        { name: "Predictive Signals", path: "/predictive", icon: TrendingUp },
        { name: "Deal Vetting Toolkit", path: "/deal-vetting", icon: Target },
        { name: "Email Automation", path: "/email-automation", icon: Mail },
        { name: "SMS Automation", path: "/sms-automation", icon: MessageSquare },
        { name: "PM Engagement Score", path: "/pm-engagement", icon: Shield },
      ]
    },
    {
      category: "TRACKING & LOGS",
      items: [
        { name: "Red Flag Timeline", path: "/timeline", icon: Clock },
        { name: "Resolution Summary", path: "/resolutions", icon: Flag },
        { name: "Alert Delivery Logs", path: "/delivery-logs", icon: Bell },
        { name: "Data Vault", path: "/data-vault", icon: Database },
        { name: "Alerts & Notifications", path: "/notifications", icon: Bell },
      ]
    },
    {
      category: "SETTINGS & HELP",
      items: [
        { name: "Settings", path: "/settings", icon: Settings },
        { name: "Help Center", path: "/help", icon: HelpCircle },
      ]
    }
  ];

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-black">OPSIGHT</h1>
        <p className="text-sm text-gray-600 mt-1">
          {user?.userType === 'company' ? 'Executive Dashboard' : 'Operational Insight'}
        </p>
      </div>
      
      <nav className="p-4">
        {menuItems.map((category, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {category.category}
            </h3>
            <ul className="space-y-1">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
