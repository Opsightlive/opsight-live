
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthWrapper from "./components/auth/AuthWrapper";
import Layout from "./components/layout/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DemoPage from "./pages/DemoPage";
import PortfolioOverview from "./pages/PortfolioOverview";
import KPICommandCenter from "./pages/KPICommandCenter";
import RedFlagAlerts from "./pages/RedFlagAlerts";
import AIReader from "./pages/AIReader";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import UserManagement from "./components/users/UserManagement";
import HelpCenter from "./pages/HelpCenter";
import GettingStartedGuide from "./pages/help/GettingStartedGuide";
import UserManagementGuide from "./pages/help/UserManagementGuide";
import CompanyDashboard from "./pages/CompanyDashboard";
import AlertDeliveryLogs from "./pages/AlertDeliveryLogs";
import AlertsNotifications from "./pages/AlertsNotifications";
import DataVault from "./pages/DataVault";
import SMSAutomation from "./pages/SMSAutomation";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Protected Route Component for Company Access
const CompanyProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user || user.userType !== 'company') {
    return <NotFound />;
  }
  
  return <>{children}</>;
};

// Dashboard Routes - Protected by AuthWrapper
const DashboardRoutes = () => (
  <AuthWrapper>
    <Layout showNavigation={true}>
      <Routes>
        <Route path="/dashboard" element={<PortfolioOverview />} />
        <Route path="/portfolio" element={<PortfolioOverview />} />
        <Route path="/kpi-center" element={<KPICommandCenter />} />
        <Route path="/red-flag-alerts" element={<RedFlagAlerts />} />
        <Route path="/ai-reader" element={<AIReader />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/company-dashboard" element={
          <CompanyProtectedRoute>
            <CompanyDashboard />
          </CompanyProtectedRoute>
        } />
        {/* All the modules from sidebar */}
        <Route path="/lp-reports" element={<div className="p-6"><h1 className="text-2xl font-bold">LP Report Generator</h1><p className="text-gray-600">Coming Soon</p></div>} />
        <Route path="/lp-dashboard" element={<div className="p-6"><h1 className="text-2xl font-bold">LP Dashboard</h1><p className="text-gray-600">Coming Soon</p></div>} />
        <Route path="/ai-tools" element={<div className="p-6"><h1 className="text-2xl font-bold">AI Intelligence Tools</h1><p className="text-gray-600">Coming Soon</p></div>} />
        <Route path="/predictive" element={<div className="p-6"><h1 className="text-2xl font-bold">Predictive Signals</h1><p className="text-gray-600">Coming Soon</p></div>} />
        <Route path="/deal-vetting" element={<div className="p-6"><h1 className="text-2xl font-bold">Deal Vetting Toolkit</h1><p className="text-gray-600">Coming Soon</p></div>} />
        <Route path="/email-automation" element={<div className="p-6"><h1 className="text-2xl font-bold">Email Automation</h1><p className="text-gray-600">Coming Soon</p></div>} />
        <Route path="/sms-automation" element={<SMSAutomation />} />
        <Route path="/pm-engagement" element={<div className="p-6"><h1 className="text-2xl font-bold">PM Engagement Score</h1><p className="text-gray-600">Coming Soon</p></div>} />
        <Route path="/timeline" element={<div className="p-6"><h1 className="text-2xl font-bold">Red Flag Timeline</h1><p className="text-gray-600">Coming Soon</p></div>} />
        <Route path="/resolutions" element={<div className="p-6"><h1 className="text-2xl font-bold">Resolution Summary</h1><p className="text-gray-600">Coming Soon</p></div>} />
        <Route path="/delivery-logs" element={<AlertDeliveryLogs />} />
        <Route path="/data-vault" element={<DataVault />} />
        <Route path="/notifications" element={<AlertsNotifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/help/getting-started" element={<GettingStartedGuide />} />
        <Route path="/help/user-management" element={<UserManagementGuide />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  </AuthWrapper>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/demo" element={<DemoPage />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/*" element={<DashboardRoutes />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
