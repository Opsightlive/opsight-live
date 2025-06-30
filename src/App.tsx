
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import FinancialOverview from '@/pages/FinancialOverview';
import ForecastAlerts from '@/pages/ForecastAlerts';
import MaintenanceTracker from '@/pages/MaintenanceTracker';
import PropertyMap from '@/pages/PropertyMap';
import RiskCore from '@/pages/RiskCore';
import TenantPortal from '@/pages/TenantPortal';
import Settings from '@/pages/Settings';
import DataIntegration from '@/pages/DataIntegration';
import IntegrationStatus from '@/pages/IntegrationStatus';
import PMIntegrationPage from '@/pages/PMIntegrationPage';
import PlaceholderModule from '@/pages/PlaceholderModule';
import NotFound from '@/pages/NotFound';
import CompanyPage from '@/pages/CompanyPage';
import DemoMode from '@/pages/DemoMode';
import DemoPage from '@/pages/DemoPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import OnboardingSetup from '@/components/auth/OnboardingSetup';

import { AdaptiveLayoutProvider } from '@/contexts/AdaptiveLayoutContext';
import { ModuleMemoryProvider } from '@/contexts/ModuleMemoryContext';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ModuleMemoryProvider>
            <AdaptiveLayoutProvider>
              <Toaster />
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={(error, errorInfo) => {
                  console.error('Global error:', error, errorInfo);
                }}
              >
                <Routes>
                  {/* Public landing page */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<OnboardingSetup onComplete={() => window.location.href = '/dashboard'} />} />
                  
                  {/* Demo Routes */}
                  <Route path="/demo" element={<DemoMode />} />
                  <Route path="/book-demo" element={<DemoPage />} />
                  
                  {/* Main Dashboard Routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/portfolio" element={<PlaceholderModule moduleName="Portfolio Overview" description="Manage your property portfolio" />} />
                  <Route path="/kpi-command-center" element={<PlaceholderModule moduleName="KPI Command Center" description="Real-time KPI monitoring and alerts" />} />
                  <Route path="/lp-dashboard" element={<PlaceholderModule moduleName="LP Dashboard" description="Limited Partner insights and reporting" />} />
                  
                  {/* Risk & Monitoring */}
                  <Route path="/red-flag-alerts" element={<PlaceholderModule moduleName="Red Flag Alerts" description="Critical issue monitoring and alerts" />} />
                  <Route path="/predictive" element={<PlaceholderModule moduleName="Predictive Signals" description="AI-powered forecasting and predictions" />} />
                  <Route path="/risk-core" element={<RiskCore />} />
                  <Route path="/forecast-alerts" element={<ForecastAlerts />} />
                  
                  {/* AI Intelligence */}
                  <Route path="/ai-tools" element={<PlaceholderModule moduleName="AI Intelligence Hub" description="AI-powered insights and tools" />} />
                  <Route path="/ai-reader" element={<PlaceholderModule moduleName="AI Reader" description="Document processing and analysis" />} />
                  <Route path="/deal-vetting" element={<PlaceholderModule moduleName="Deal Vetting Toolkit" description="Investment analysis and due diligence" />} />
                  <Route path="/ai-suggestions" element={<PlaceholderModule moduleName="AI Suggestions" description="Smart recommendations and insights" />} />
                  
                  {/* Communications */}
                  <Route path="/notifications" element={<PlaceholderModule moduleName="Alerts & Notifications" description="Notification center and management" />} />
                  <Route path="/email-automation" element={<PlaceholderModule moduleName="Email Automation" description="Automated email campaigns and alerts" />} />
                  <Route path="/sms-automation" element={<PlaceholderModule moduleName="SMS Automation" description="SMS notification and alert system" />} />
                  <Route path="/pm-engagement" element={<PlaceholderModule moduleName="PM Engagement Score" description="Property manager performance metrics" />} />
                  
                  {/* Data & Operations */}
                  <Route path="/data-integration" element={<DataIntegration />} />
                  <Route path="/integration-status" element={<IntegrationStatus />} />
                  <Route path="/pm-integration" element={<PMIntegrationPage />} />
                  <Route path="/data-vault" element={<PlaceholderModule moduleName="Data Vault" description="Secure data storage and management" />} />
                  <Route path="/analytics" element={<PlaceholderModule moduleName="Advanced Analytics" description="Deep data analysis and insights" />} />
                  
                  {/* Reports & Insights */}
                  <Route path="/lp-reports" element={<PlaceholderModule moduleName="LP Report Generator" description="Generate comprehensive investor reports" />} />
                  <Route path="/timeline" element={<PlaceholderModule moduleName="Red Flag Timeline" description="Historical issue tracking and resolution" />} />
                  <Route path="/resolutions" element={<PlaceholderModule moduleName="Resolution Summary" description="Issue resolution tracking and analytics" />} />
                  <Route path="/delivery-logs" element={<PlaceholderModule moduleName="Alert Delivery Logs" description="Notification delivery status and logs" />} />
                  <Route path="/performance" element={<PlaceholderModule moduleName="Performance Reports" description="Portfolio performance analysis and reporting" />} />
                  
                  {/* Portfolio Management */}
                  <Route path="/property-map" element={<PropertyMap />} />
                  <Route path="/tenant-portal" element={<TenantPortal />} />
                  <Route path="/maintenance" element={<MaintenanceTracker />} />
                  <Route path="/financials" element={<FinancialOverview />} />
                  
                  {/* Settings & Support */}
                  <Route path="/profile" element={<PlaceholderModule moduleName="User Profile" description="Personal account settings and preferences" />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/subscription" element={<PlaceholderModule moduleName="Subscription" description="Billing and subscription management" />} />
                  <Route path="/help" element={<PlaceholderModule moduleName="Help Center" description="Support documentation and resources" />} />
                  
                  {/* Public company page */}
                  <Route path="/company" element={<CompanyPage />} />

                  {/* 404 Not Found Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </AdaptiveLayoutProvider>
          </ModuleMemoryProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
