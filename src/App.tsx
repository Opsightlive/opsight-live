
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdaptiveLayoutProvider } from "@/contexts/AdaptiveLayoutContext";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import PerformanceMonitor from "@/components/monitoring/PerformanceMonitor";
import SuspenseWrapper from "@/components/ui/suspense-wrapper";
import AuthWrapper from "@/components/auth/AuthWrapper";
import Layout from "@/components/layout/Layout";
import { lazy } from "react";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const OwnerDashboard = lazy(() => import("./components/owner/OwnerDashboard"));
const OwnerOnboarding = lazy(() => import("./pages/OwnerOnboarding"));

// Configure React Query for production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
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
                  <SuspenseWrapper loadingText="Loading landing page...">
                    <LandingPage />
                  </SuspenseWrapper>
                } />
                <Route path="/login" element={
                  <SuspenseWrapper loadingText="Loading login...">
                    <LoginPage />
                  </SuspenseWrapper>
                } />
                <Route path="/signup" element={
                  <SuspenseWrapper loadingText="Loading signup...">
                    <SignupPage />
                  </SuspenseWrapper>
                } />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <AuthWrapper>
                    <Layout>
                      <SuspenseWrapper loadingText="Loading dashboard...">
                        <Index />
                      </SuspenseWrapper>
                    </Layout>
                  </AuthWrapper>
                } />
                
                {/* Admin route */}
                <Route path="/admin" element={
                  <AuthWrapper>
                    <SuspenseWrapper loadingText="Loading admin dashboard...">
                      <AdminDashboard />
                    </SuspenseWrapper>
                  </AuthWrapper>
                } />

                <Route path="/settings" element={
                  <AuthWrapper>
                    <Layout>
                      <SuspenseWrapper loadingText="Loading settings...">
                        <Settings />
                      </SuspenseWrapper>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/profile" element={
                  <AuthWrapper>
                    <Layout>
                      <SuspenseWrapper loadingText="Loading profile...">
                        <UserProfile />
                      </SuspenseWrapper>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/owner-dashboard" element={
                  <AuthWrapper>
                    <Layout>
                      <SuspenseWrapper loadingText="Loading owner dashboard...">
                        <OwnerDashboard />
                      </SuspenseWrapper>
                    </Layout>
                  </AuthWrapper>
                } />
                
                <Route path="/owner-onboarding" element={
                  <AuthWrapper>
                    <Layout>
                      <SuspenseWrapper loadingText="Loading onboarding...">
                        <OwnerOnboarding />
                      </SuspenseWrapper>
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
