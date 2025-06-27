import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/auth/AuthWrapper';
import Layout from '@/components/layout/Layout';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Suspense } from 'react';

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

// Configure React Query with optimized settings for production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Toaster />
              <Suspense fallback={<LoadingSpinner fullScreen text="Loading application..." />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/company" element={<CompanyPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/demo" element={<DemoPage />} />
                  <Route path="/demo-mode" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <DemoMode />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/dashboard" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <Index />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/portfolio" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <PortfolioOverview />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/kpi-center" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <KPICommandCenter />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/red-flag-alerts" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <RedFlagAlerts />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/data-integration" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <DataIntegration />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/integration-status" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <IntegrationStatus />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/lp-dashboard" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <LPDashboard />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/lp-reports" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <LPReportGenerator />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/ai-tools" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <AIIntelligence />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/ai-reader" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <AIReader />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/predictive" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <PredictiveSignals />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/deal-vetting" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <DealVettingToolkit />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/email-automation" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <EmailAutomation />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/sms-automation" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <SMSAutomation />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/pm-engagement" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <PMEngagementScore />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/timeline" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <RedFlagTimeline />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/resolutions" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <ResolutionSummary />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/delivery-logs" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <AlertDeliveryLogs />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/data-vault" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <DataVault />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/notifications" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <AlertsNotifications />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/company-dashboard" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <CompanyDashboard />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/users" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <UserManagement />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/owner-onboarding" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <OwnerOnboardingPage />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/settings" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <Settings />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/help" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                        <Layout>
                          <HelpCenter />
                        </Layout>
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                  <Route path="/data-setup" element={
                    <ErrorBoundary>
                      <AuthWrapper>
                         <DataSetup onComplete={() => {}} />
                      </AuthWrapper>
                    </ErrorBoundary>
                  } />
                </Routes>
              </Suspense>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
