import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';

// Page imports
import LandingPage from '@/pages/LandingPage';
import Home from '@/pages/Home';
import KPICommandCenter from '@/pages/KPICommandCenter';
import AIIntelligence from '@/pages/AIIntelligence';
import AlertsNotifications from '@/pages/AlertsNotifications';
import CompanyPage from '@/pages/CompanyPage';
import HelpCenter from '@/pages/HelpCenter';
import NotFound from '@/pages/NotFound';
import DemoPage from '@/pages/DemoPage';
import PortfolioDashboard from '@/pages/PortfolioDashboard';
import PortfolioOverview from '@/pages/PortfolioOverview';
import PredictiveSignals from '@/pages/PredictiveSignals';
import RedFlagAlerts from '@/pages/RedFlagAlerts';
import PMEngagementScore from '@/pages/PMEngagementScore';
import DataIntegration from '@/pages/DataIntegration';
import Settings from '@/pages/Settings';
import UserProfile from '@/pages/UserProfile';
import AIReader from '@/pages/AIReader';
import AISuggestions from '@/pages/AISuggestions';
import DataVault from '@/pages/DataVault';
import DealVettingToolkit from '@/pages/DealVettingToolkit';
import EmailAutomation from '@/pages/EmailAutomation';
import SMSAutomation from '@/pages/SMSAutomation';
import LPDashboard from '@/pages/LPDashboard';
import LPReportGenerator from '@/pages/LPReportGenerator';
import CompanyDashboard from '@/pages/CompanyDashboard';

function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={LandingPage} />
          <Route path="/company" component={CompanyPage} />
          <Route path="/help" component={HelpCenter} />
          <Route path="/demo" component={DemoPage} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={PortfolioDashboard} />
          <Route path="/portfolio-overview" component={PortfolioOverview} />
          <Route path="/kpi-command-center" component={KPICommandCenter} />
          <Route path="/predictive-signals" component={PredictiveSignals} />
          <Route path="/red-flag-alerts" component={RedFlagAlerts} />
          <Route path="/ai-intelligence" component={AIIntelligence} />
          <Route path="/ai-reader" component={AIReader} />
          <Route path="/ai-suggestions" component={AISuggestions} />
          <Route path="/pm-engagement" component={PMEngagementScore} />
          <Route path="/alerts-notifications" component={AlertsNotifications} />
          <Route path="/data-integration" component={DataIntegration} />
          <Route path="/data-vault" component={DataVault} />
          <Route path="/deal-vetting" component={DealVettingToolkit} />
          <Route path="/email-automation" component={EmailAutomation} />
          <Route path="/sms-automation" component={SMSAutomation} />
          <Route path="/lp-dashboard" component={LPDashboard} />
          <Route path="/lp-reports" component={LPReportGenerator} />
          <Route path="/company-dashboard" component={CompanyDashboard} />
          <Route path="/settings" component={Settings} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/company" component={CompanyPage} />
          <Route path="/help" component={HelpCenter} />
          <Route path="/demo" component={DemoPage} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen">
      <Toaster />
      <AppRouter />
    </div>
  );
}

export default App;