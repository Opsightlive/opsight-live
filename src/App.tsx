
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdaptiveLayoutProvider } from "@/contexts/AdaptiveLayoutContext";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import PerformanceMonitor from "@/components/monitoring/PerformanceMonitor";
import AuthWrapper from "@/components/auth/AuthWrapper";
import Layout from "@/components/layout/Layout";
import ModuleLoader from "@/components/navigation/ModuleLoader";
import { lazy } from "react";

// Lazy load all pages for better performance and error isolation
const Index = lazy(() => import("./pages/Index"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const OwnerDashboard = lazy(() => import("./components/owner/OwnerDashboard"));
const OwnerOnboarding = lazy(() => import("./pages/OwnerOnboarding"));
const KPICommandCenter = lazy(() => import("./pages/KPICommandCenter"));
const PortfolioOverview = lazy(() => import("./pages/PortfolioOverview"));
const RedFlagAlerts = lazy(() => import("./pages/RedFlagAlerts"));
const PredictiveSignals = lazy(() => import("./pages/PredictiveSignals"));
const AIIntelligence = lazy(() => import("./pages/AIIntelligence"));
const AIReader = lazy(() => import("./pages/AIReader"));
const DealVettingToolkit = lazy(() => import("./pages/DealVettingToolkit"));
const AlertsNotifications = lazy(() => import("./pages/AlertsNotifications"));
const EmailAutomation = lazy(() => import("./pages/EmailAutomation"));
const SMSAutomation = lazy(() => import("./pages/SMSAutomation"));
const PMEngagementScore = lazy(() => import("./pages/PMEngagementScore"));
const DataIntegration = lazy(() => import("./pages/DataIntegration"));
const IntegrationStatus = lazy(() => import("./pages/IntegrationStatus"));
const DataVault = lazy(() => import("./pages/DataVault"));
const LPReportGenerator = lazy(() => import("./pages/LPReportGenerator"));
const RedFlagTimeline = lazy(() => import("./pages/RedFlagTimeline"));
const ResolutionSummary = lazy(() => import("./pages/ResolutionSummary"));
const AlertDeliveryLogs = lazy(() => import("./pages/AlertDeliveryLogs"));
const LPDashboard = lazy(() => import("./pages/LPDashboard"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));

// Configure React Query for production with retry logic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AdaptiveLayoutProvider>
              <PerformanceMonitor />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={
                  <ModuleLoader moduleName="Landing Page">
                    <LandingPage />
                  </ModuleLoader>
                } />
                <Route path="/login" element={
                  <ModuleLoader moduleName="Login">
                    <LoginPage />
                  </ModuleLoader>
                } />
                <Route path="/signup" element={
                  <ModuleLoader moduleName="Signup">
                    <SignupPage />
                  </ModuleLoader>
                } />
                
                {/* Protected routes with permanent sidebar */}
                <Route path="/dashboard" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Main Dashboard">
                        <Index />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/portfolio" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Portfolio Overview">
                        <PortfolioOverview />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/kpi-command-center" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="KPI Command Center">
                        <KPICommandCenter />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/lp-dashboard" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="LP Dashboard">
                        <LPDashboard />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/red-flag-alerts" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Red Flag Alerts">
                        <RedFlagAlerts />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/predictive" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Predictive Signals">
                        <PredictiveSignals />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/ai-tools" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="AI Intelligence Hub">
                        <AIIntelligence />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/ai-reader" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="AI Reader">
                        <AIReader />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/deal-vetting" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Deal Vetting Toolkit">
                        <DealVettingToolkit />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/notifications" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Alerts & Notifications">
                        <AlertsNotifications />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/email-automation" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Email Automation">
                        <EmailAutomation />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/sms-automation" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="SMS Automation">
                        <SMSAutomation />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/pm-engagement" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="PM Engagement Score">
                        <PMEngagementScore />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/data-integration" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Data Integration">
                        <DataIntegration />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/integration-status" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Integration Status">
                        <IntegrationStatus />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/data-vault" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Data Vault">
                        <DataVault />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/lp-reports" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="LP Report Generator">
                        <LPReportGenerator />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/timeline" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Red Flag Timeline">
                        <RedFlagTimeline />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/resolutions" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Resolution Summary">
                        <ResolutionSummary />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/delivery-logs" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Alert Delivery Logs">
                        <AlertDeliveryLogs />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                {/* Admin route */}
                <Route path="/admin" element={
                  <AuthWrapper>
                    <ModuleLoader moduleName="Admin Dashboard">
                      <AdminDashboard />
                    </ModuleLoader>
                  </AuthWrapper>
                } />

                <Route path="/settings" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="System Settings">
                        <Settings />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/profile" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="User Profile">
                        <UserProfile />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/owner-dashboard" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Owner Dashboard">
                        <OwnerDashboard />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/owner-onboarding" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Owner Onboarding">
                        <OwnerOnboarding />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/help" element={
                  <AuthWrapper>
                    <Layout>
                      <ModuleLoader moduleName="Help Center">
                        <HelpCenter />
                      </ModuleLoader>
                    </Layout>
                  </AuthWrapper>
                } />
              </Routes>
            </AdaptiveLayoutProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
