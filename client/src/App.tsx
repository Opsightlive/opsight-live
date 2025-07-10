import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';

// Page imports
import Landing from '@/pages/Landing';
import Home from '@/pages/Home';
import KPICommandCenter from '@/pages/KPICommandCenter';
import AIIntelligence from '@/pages/AIIntelligence';
import AlertsNotifications from '@/pages/AlertsNotifications';
import NotFound from '@/pages/NotFound';

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
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/kpi-command-center" component={KPICommandCenter} />
          <Route path="/ai-intelligence" component={AIIntelligence} />
          <Route path="/alerts-notifications" component={AlertsNotifications} />
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