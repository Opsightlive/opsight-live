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
import EmailAutomation from "./pages/EmailAutomation";
import LPDashboard from "./pages/LPDashboard";
import LPReportGenerator from "./pages/LPReportGenerator";
import AIIntelligence from "./pages/AIIntelligence";
import PMEngagementScore from "./pages/PMEngagementScore";
import PredictiveSignals from "./pages/PredictiveSignals";
import DealVettingToolkit from "./pages/DealVettingToolkit";
import RedFlagTimeline from "./pages/RedFlagTimeline";
import ResolutionSummary from "./pages/ResolutionSummary";
import SubscriptionSettings from "./pages/SubscriptionSettings";
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
        <Route path="/lp-reports" element={<LPReportGenerator />} />
        <Route path="/lp-dashboard" element={<LPDashboard />} />
        <Route path="/ai-tools" element={<AIIntelligence />} />
        <Route path="/predictive" element={<PredictiveSignals />} />
        <Route path="/deal-vetting" element={<DealVettingToolkit />} />
        <Route path="/email-automation" element={<EmailAutomation />} />
        <Route path="/sms-automation" element={<SMSAutomation />} />
        <Route path="/pm-engagement" element={<PMEngagementScore />} />
        <Route path="/timeline" element={<RedFlagTimeline />} />
        <Route path="/resolutions" element={<ResolutionSummary />} />
        <Route path="/delivery-logs" element={<AlertDeliveryLogs />} />
        <Route path="/data-vault" element={<DataVault />} />
        <Route path="/notifications" element={<AlertsNotifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/help/getting-started" element={<GettingStartedGuide />} />
        <Route path="/help/user-management" element={<UserManagementGuide />} />
        <Route path="/subscription" element={<SubscriptionSettings />} />
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
