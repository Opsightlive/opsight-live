
import React from 'react';
import { AlertTriangle, Home, Settings, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SafeModeScreenProps {
  moduleName?: string;
  error?: Error;
  onRetry?: () => void;
}

const SafeModeScreen: React.FC<SafeModeScreenProps> = ({ 
  moduleName = 'Unknown Module', 
  error,
  onRetry 
}) => {
  const handleReload = () => {
    window.location.reload();
  };

  const errorMessage = error?.message || 'An unexpected error occurred while loading this module.';

  return (
    <div className="flex items-center justify-center min-h-[500px] p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-xl">Safe Mode Activated</CardTitle>
          <CardDescription>
            The {moduleName} module encountered an issue and has been temporarily disabled.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Error Details:</strong><br />
              {errorMessage}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">What you can do:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Try refreshing the page</li>
              <li>• Check your internet connection</li>
              <li>• Navigate to another module</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-2">
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={handleReload}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
            
            <Button 
              variant="ghost" 
              asChild
              className="w-full"
            >
              <Link to="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Error ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafeModeScreen;
