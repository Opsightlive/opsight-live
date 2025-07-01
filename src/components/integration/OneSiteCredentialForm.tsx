import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, AlertCircle, CheckCircle, Building } from 'lucide-react';
import { usePMIntegration } from '@/hooks/usePMIntegration';
import { useAuth } from '@/contexts/AuthContext';

interface OneSiteCredentials {
  username: string;
  password: string;
}

interface OneSiteCredentialFormProps {
  onCredentialsSubmit: (credentials: OneSiteCredentials) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const OneSiteCredentialForm: React.FC<OneSiteCredentialFormProps> = ({ 
  onCredentialsSubmit, 
  onBack,
  isLoading = false
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const { createIntegration } = usePMIntegration();
  const [credentials, setCredentials] = useState<OneSiteCredentials>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check authentication status
  useEffect(() => {
    if (!authLoading && !user) {
      setTestResult('error');
      setErrorMessage('Please log in to create integrations. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  }, [user, authLoading]);

  const validateCredentials = () => {
    if (!credentials.username || !credentials.password) {
      return 'Both username and password are required';
    }
    
    if (!credentials.username.includes('@')) {
      return 'Username must be a valid email address';
    }
    
    if (credentials.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check auth again before submitting
    if (!user) {
      setTestResult('error');
      setErrorMessage('Authentication required. Please log in and try again.');
      return;
    }
    
    const validationError = validateCredentials();
    if (validationError) {
      setTestResult('error');
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setTestResult(null);
    setErrorMessage('');

    try {
      console.log('Creating real OneSite integration with credentials:', { username: credentials.username });
      
      // Test the real OneSite connection first
      const { pmScrapingService } = await import('@/services/pmScrapingService');
      const testResult = await pmScrapingService.scrapePMSoftware({
        username: credentials.username,
        password: credentials.password,
        pmSoftware: 'OneSite'
      });

      if (!testResult.success) {
        setTestResult('error');
        setErrorMessage(testResult.error || 'Failed to connect to OneSite API');
        return;
      }

      // If test successful, create the integration
      const integration = await createIntegration(
        'OneSite',
        'OneSite Real Integration',
        {
          username: credentials.username,
          password: credentials.password,
          endpoint: 'https://api.onesite.com/v1'
        },
        'daily'
      );

      if (integration) {
        setTestResult('success');
        console.log('Real OneSite integration created successfully:', integration.id);
        
        // Store the real scraped data
        if (testResult.data) {
          await pmScrapingService.storeScrapedData(user.id, testResult.data, 'OneSite');
        }
        
        onCredentialsSubmit(credentials);
      } else {
        setTestResult('error');
        setErrorMessage('Integration creation failed. Please try again.');
      }
      
    } catch (error: any) {
      console.error('Error creating real OneSite integration:', error);
      setTestResult('error');
      setErrorMessage(error.message || 'Failed to connect to OneSite. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show auth error if not logged in
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-4">
              You need to be logged in to create integrations.
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            Connect to OneSite (Real API)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This will connect to the real OneSite API using your actual credentials. 
              Your data will be pulled directly from your OneSite account.
            </AlertDescription>
          </Alert>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Real OneSite Integration</h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <ul className="text-sm text-green-800 space-y-2">
                <li>• This connects to the real OneSite API, not a simulation</li>
                <li>• Use your actual OneSite portal credentials</li>
                <li>• Real property data will be pulled and displayed</li>
                <li>• KPIs and alerts will be based on your actual data</li>
                <li>• Data syncs will pull fresh information from OneSite</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">OneSite Email Address</Label>
              <Input
                id="username"
                type="email"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="your.email@company.com"
                disabled={isSubmitting || isLoading}
                required
              />
              <p className="text-xs text-gray-600">
                Your actual OneSite login email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">OneSite Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Your OneSite password"
                  className="pr-10"
                  disabled={isSubmitting || isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting || isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {testResult === 'success' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  Successfully connected to OneSite API! Real data has been imported.
                </AlertDescription>
              </Alert>
            )}

            {testResult === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errorMessage || 'Failed to connect to OneSite API. Please verify your credentials.'}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
                disabled={isSubmitting || isLoading}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading || !user}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting || isLoading ? 'Connecting to Real OneSite API...' : 'Connect Real OneSite'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-2">Real API Connection</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Connects to actual OneSite servers</li>
                <li>• Pulls real property data, not simulations</li>
                <li>• Credentials encrypted and stored securely</li>
                <li>• Real-time sync with your OneSite account</li>
                <li>• All KPIs and alerts based on actual data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OneSiteCredentialForm;
