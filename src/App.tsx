import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthWrapper from "./components/auth/AuthWrapper";
import Layout from "./components/layout/Layout";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AuthWrapper>
            <Layout>
              <Routes>
                <Route path="/" element={<PortfolioOverview />} />
                <Route path="/kpi-center" element={<KPICommandCenter />} />
                <Route path="/red-flags" element={<RedFlagAlerts />} />
                <Route path="/ai-reader" element={<AIReader />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/company-dashboard" element={<CompanyDashboard />} />
                {/* Placeholder routes for remaining modules */}
                <Route path="/lp-reports" element={<div className="p-6"><h1 className="text-2xl font-bold">LP Report Generator</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/lp-dashboard" element={<div className="p-6"><h1 className="text-2xl font-bold">LP Dashboard</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/ai-tools" element={<div className="p-6"><h1 className="text-2xl font-bold">AI Intelligence Tools</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/predictive" element={<div className="p-6"><h1 className="text-2xl font-bold">Predictive Signals</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/deal-vetting" element={<div className="p-6"><h1 className="text-2xl font-bold">Deal Vetting Toolkit</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/email-automation" element={<div className="p-6"><h1 className="text-2xl font-bold">Email Automation</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/sms-automation" element={<div className="p-6"><h1 className="text-2xl font-bold">SMS Automation</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/pm-engagement" element={<div className="p-6"><h1 className="text-2xl font-bold">PM Engagement Score</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/timeline" element={<div className="p-6"><h1 className="text-2xl font-bold">Red Flag Timeline</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/resolutions" element={<div className="p-6"><h1 className="text-2xl font-bold">Resolution Summary</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/delivery-logs" element={<div className="p-6"><h1 className="text-2xl font-bold">Alert Delivery Logs</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/data-vault" element={<div className="p-6"><h1 className="text-2xl font-bold">Data Vault</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/notifications" element={<div className="p-6"><h1 className="text-2xl font-bold">Alerts & Notifications</h1><p className="text-gray-600">Coming Soon</p></div>} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/help/getting-started" element={<GettingStartedGuide />} />
                <Route path="/help/user-management" element={<UserManagementGuide />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthWrapper>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
