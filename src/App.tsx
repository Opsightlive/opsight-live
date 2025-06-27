
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
import DataSetup from '@/components/auth/DataSetup';

const queryClient = new QueryClient();

function App() {
  return (
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
              <Route path="/demo-mode" element={<DemoMode />} />
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
  );
}

export default App;
