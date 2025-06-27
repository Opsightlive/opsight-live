
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Layout from "./components/layout/Layout";

// Import existing pages
import CompanyDashboard from "./pages/CompanyDashboard";
import LPDashboard from "./pages/LPDashboard";
import PortfolioOverview from "./pages/PortfolioOverview";
import KPICommandCenter from "./pages/KPICommandCenter";
import RedFlagAlerts from "./pages/RedFlagAlerts";
import AIIntelligence from "./pages/AIIntelligence";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import UserManagement from "./components/users/UserManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CompanyDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/lp-dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LPDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PortfolioOverview />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/kpi-command-center"
              element={
                <ProtectedRoute>
                  <Layout>
                    <KPICommandCenter />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/red-flag-alerts"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RedFlagAlerts />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-intelligence"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AIIntelligence />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HelpCenter />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
