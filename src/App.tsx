import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthWrapper from "@/components/auth/AuthWrapper";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import OwnerDashboard from "./components/owner/OwnerDashboard";
import OwnerOnboarding from "./pages/OwnerOnboarding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <AuthWrapper>
                <Layout>
                  <Index />
                </Layout>
              </AuthWrapper>
            } />
            
            {/* Admin route */}
            <Route path="/admin" element={
              <AuthWrapper>
                <AdminDashboard />
              </AuthWrapper>
            } />

            <Route path="/settings" element={
              <AuthWrapper>
                <Layout>
                  <Settings />
                </Layout>
              </AuthWrapper>
            } />
            <Route path="/profile" element={
              <AuthWrapper>
                <Layout>
                  <Profile />
                </Layout>
              </AuthWrapper>
            } />
            <Route path="/owner-dashboard" element={
              <AuthWrapper>
                <Layout>
                  <OwnerDashboard />
                </Layout>
              </AuthWrapper>
            } />
            <Route path="/owner-onboarding" element={
              <AuthWrapper>
                <Layout>
                  <OwnerOnboarding />
                </Layout>
              </AuthWrapper>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
