
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
                  
                  {/* Dashboard Routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/financial-overview" element={<FinancialOverview />} />
                  <Route path="/forecast-alerts" element={<ForecastAlerts />} />
                  <Route path="/maintenance-tracker" element={<MaintenanceTracker />} />
                  <Route path="/property-map" element={<PropertyMap />} />
                  <Route path="/risk-core" element={<RiskCore />} />
                  <Route path="/tenant-portal" element={<TenantPortal />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* Public company page */}
                  <Route path="/company" element={<CompanyPage />} />

                  {/* Example Placeholder Module Route */}
                  <Route
                    path="/example-module"
                    element={
                      <PlaceholderModule
                        moduleName="Example Module"
                        description="This is a placeholder module for demonstration purposes."
                      />
                    }
                  />

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
