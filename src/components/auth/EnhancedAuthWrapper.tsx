
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import OnboardingFlow from './OnboardingFlow';

interface EnhancedAuthWrapperProps {
  children: React.ReactNode;
}

const EnhancedAuthWrapper: React.FC<EnhancedAuthWrapperProps> = ({ children }) => {
  const { user, isLoading, serverStatus } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Loading screen with no white flash
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <img 
              src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
              alt="OPSIGHT" 
              className="h-16 w-16 mx-auto animate-pulse"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">OPSIGHT</h1>
          <div className="flex items-center justify-center space-x-2 text-white">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span>Loading...</span>
          </div>
          
          {/* Server status indicator */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            {serverStatus === 'healthy' ? (
              <Wifi className="h-4 w-4 text-green-400" />
            ) : serverStatus === 'degraded' ? (
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
            <span className="text-sm text-gray-300">
              {serverStatus === 'healthy' ? 'Connected' : 
               serverStatus === 'degraded' ? 'Slow Connection' : 'Connection Issues'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Server error fallback
  if (serverStatus === 'unhealthy') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Service Temporarily Unavailable</h3>
                  <p className="text-sm mt-1">
                    Our authentication services are experiencing issues. This typically resolves within a few minutes.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-600">
                    Retry attempt: {retryCount + 1}/3
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setRetryCount(prev => prev + 1);
                      window.location.reload();
                    }}
                    disabled={retryCount >= 2}
                  >
                    {retryCount >= 2 ? 'Max Retries Reached' : 'Retry Connection'}
                  </Button>
                </div>
                
                {retryCount >= 2 && (
                  <div className="text-xs text-red-600 mt-2">
                    If the problem persists, please contact support at support@opsight.com
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Check if user needs onboarding
  if (user) {
    // Show onboarding flow if user hasn't completed it
    const needsOnboarding = !localStorage.getItem('onboardingCompleted');
    if (needsOnboarding) {
      return <OnboardingFlow />;
    }

    // User is authenticated and onboarded
    return <>{children}</>;
  }

  // Show authentication forms
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Server status bar */}
      {serverStatus === 'degraded' && (
        <div className="bg-yellow-500/20 border-b border-yellow-500/30 p-2">
          <div className="flex items-center justify-center space-x-2 text-yellow-200 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>Service is running slower than usual</span>
          </div>
        </div>
      )}
      
      {isLogin ? (
        <LoginForm onRegisterClick={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onLoginClick={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default EnhancedAuthWrapper;
