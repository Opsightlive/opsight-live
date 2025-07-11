import ErrorBoundary from '@/components/error/ErrorBoundary';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/auth/AuthWrapper';
import Layout from '@/components/layout/Layout';

// Page imports
import LandingPage from '@/pages/LandingPage';
import CompanyPage from '@/pages/CompanyPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DemoPage from '@/pages/DemoPage';
import DemoMode from '@/pages/DemoMode';
import Index from '@/pages/Index';
import PortfolioOverview from '@/pages/PortfolioOverview';
import KPICommandCenter from '@/pages/KPICommandCenter';
import RedFlagAlerts from '@/pages/RedFlagAlerts';
import DataIntegration from '@/pages/DataIntegration';
import IntegrationStatus from '@/pages/IntegrationStatus';
import LPDashboard from '@/pages/LPDashboard';
import LPReportGenerator from '@/pages/LPReportGenerator';
import AIIntelligence from '@/pages/AIIntelligence';
import AIReader from '@/pages/AIReader';
import PredictiveSignals from '@/pages/PredictiveSignals';
import DealVettingToolkit from '@/pages/DealVettingToolkit';
import EmailAutomation from '@/pages/EmailAutomation';
import SMSAutomation from '@/pages/SMSAutomation';
import PMEngagementScore from '@/pages/PMEngagementScore';
import RedFlagTimeline from '@/pages/RedFlagTimeline';
import ResolutionSummary from '@/pages/ResolutionSummary';
import AlertDeliveryLogs from '@/pages/AlertDeliveryLogs';
import DataVault from '@/pages/DataVault';
import AlertsNotifications from '@/pages/AlertsNotifications';
import CompanyDashboard from '@/pages/CompanyDashboard';
import UserManagement from '@/components/users/UserManagement';
import OwnerOnboardingPage from '@/pages/OwnerOnboarding';
import Settings from '@/pages/Settings';
import HelpCenter from '@/pages/HelpCenter';
import DataSetup from '@/components/auth/DataSetup';
import SubscriptionSettings from '@/pages/SubscriptionSettings';
import UserProfile from '@/pages/UserProfile';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Toaster />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/company" element={<CompanyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/demo-mode" element={
              } />
              <Route path="/dashboard" element={
              } />
              <Route path="/portfolio" element={
              } />
              <Route path="/kpi-center" element={
              } />
              <Route path="/red-flag-alerts" element={
              } />
              <Route path="/data-integration" element={
              } />
              <Route path="/integration-status" element={
              } />
              <Route path="/lp-dashboard" element={
              } />
              <Route path="/lp-reports" element={
              } />
              <Route path="/ai-tools" element={
              } />
              <Route path="/ai-reader" element={
              } />
              <Route path="/predictive" element={
              } />
              <Route path="/deal-vetting" element={
              } />
              <Route path="/email-automation" element={
              } />
              <Route path="/sms-automation" element={
              } />
              <Route path="/pm-engagement" element={
              } />
              <Route path="/timeline" element={
              } />
              <Route path="/resolutions" element={
              } />
              <Route path="/delivery-logs" element={
              } />
              <Route path="/data-vault" element={
              } />
              <Route path="/notifications" element={
              } />
              <Route path="/company-dashboard" element={
              } />
              <Route path="/users" element={
              } />
              <Route path="/owner-onboarding" element={
              } />
              <Route path="/settings" element={
              } />
              <Route path="/subscription" element={
              } />
              <Route path="/profile" element={
              } />
              <Route path="/help" element={<HelpCenter />} />
              } />
              <Route path="/data-setup" element={
              } />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
          </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
