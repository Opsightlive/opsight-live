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
import EmailVerification from "@/pages/EmailVerification";import DemoPage from '@/pages/DemoPage';
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
import PricingPage from "@/pages/PricingPage";import DataSetup from '@/components/auth/DataSetup';
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
                <AuthWrapper>
                  <Layout>
                    <DemoMode />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/dashboard" element={
                <AuthWrapper>
                  <Layout>
                    <Index />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/portfolio" element={
                <AuthWrapper>
                  <Layout>
                    <PortfolioOverview />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/kpi-center" element={
                <AuthWrapper>
                  <Layout>
                    <KPICommandCenter />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/red-flag-alerts" element={
                <AuthWrapper>
                  <Layout>
                    <RedFlagAlerts />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/data-integration" element={
                <AuthWrapper>
                  <Layout>
                    <DataIntegration />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/integration-status" element={
                <AuthWrapper>
                  <Layout>
                    <IntegrationStatus />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/lp-dashboard" element={
                <AuthWrapper>
                  <Layout>
                    <LPDashboard />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/lp-reports" element={
                <AuthWrapper>
                  <Layout>
                    <LPReportGenerator />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/ai-tools" element={
                <AuthWrapper>
                  <Layout>
                    <AIIntelligence />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/ai-reader" element={
                <AuthWrapper>
                  <Layout>
                    <AIReader />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/predictive" element={
                <AuthWrapper>
                  <Layout>
                    <PredictiveSignals />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/deal-vetting" element={
                <AuthWrapper>
                  <Layout>
                    <DealVettingToolkit />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/email-automation" element={
                <AuthWrapper>
                  <Layout>
                    <EmailAutomation />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/sms-automation" element={
                <AuthWrapper>
                  <Layout>
                    <SMSAutomation />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/pm-engagement" element={
                <AuthWrapper>
                  <Layout>
                    <PMEngagementScore />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/timeline" element={
                <AuthWrapper>
                  <Layout>
                    <RedFlagTimeline />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/resolutions" element={
                <AuthWrapper>
                  <Layout>
                    <ResolutionSummary />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/delivery-logs" element={
                <AuthWrapper>
                  <Layout>
                    <AlertDeliveryLogs />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/data-vault" element={
                <AuthWrapper>
                  <Layout>
                    <DataVault />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/notifications" element={
                <AuthWrapper>
                  <Layout>
                    <AlertsNotifications />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/company-dashboard" element={
                <AuthWrapper>
                  <Layout>
                    <CompanyDashboard />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/users" element={
                <AuthWrapper>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/owner-onboarding" element={
                <AuthWrapper>
                  <Layout>
                    <OwnerOnboardingPage />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/settings" element={
                <AuthWrapper>
                  <Layout>
                    <Settings />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/subscription" element={
                <AuthWrapper>
                  <Layout>
                    <SubscriptionSettings />
                  </Layout>
                </AuthWrapper>
              } />
              <Route path="/profile" element={
                <AuthWrapper>
                  <Layout>
                    <UserProfile />
                  </Layout>
                </AuthWrapper>
              } />
             <Route path="/help" element={<HelpCenter />} />
              <Route path="/pricing" element={<PricingPage />} />              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/data-setup" element={
                <AuthWrapper>
                   <DataSetup onComplete={() => {}} />
                </AuthWrapper>
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
