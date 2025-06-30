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
      console.log('Creating OneSite integration with credentials:', { username: credentials.username });
      
      // Create the integration using the hook
      const integration = await createIntegration(
        'OneSite',
        'OneSite Integration',
        {
          username: credentials.username,
          password: credentials.password,
          endpoint: 'https://api.onesite.com' // Default OneSite API endpoint
        },
        'daily'
      );

      if (integration) {
        setTestResult('success');
        console.log('Integration created successfully:', integration.id);
        
        // Call the parent callback
        onCredentialsSubmit(credentials);
      } else {
        setTestResult('error');
        setErrorMessage('Integration creation returned no result. Please check your credentials and try again.');
      }
      
    } catch (error: any) {
      console.error('Error creating integration:', error);
      setTestResult('error');
      setErrorMessage(error.message || 'An unexpected error occurred while creating the integration.');
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
            Connect to OneSite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your OneSite credentials are encrypted and stored securely. OPSIGHT uses these credentials only to 
              automatically sync your property data and generate reports.
            </AlertDescription>
          </Alert>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">OneSite Integration Instructions</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Use your OneSite portal email address as the username</li>
                <li>• Use your regular OneSite password</li>
                <li>• This will run in test mode first to validate your credentials</li>
                <li>• Contact your OneSite administrator if you need API access enabled</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Email Address</Label>
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
                Use the same email you use to log into OneSite
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your OneSite password"
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
                  Credentials saved successfully! Integration is being set up...
                </AlertDescription>
              </Alert>
            )}

            {testResult === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errorMessage || 'Failed to create integration. Please verify your credentials and try again.'}
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
                className="flex-1"
              >
                {isSubmitting || isLoading ? 'Creating Integration...' : 'Connect OneSite'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-2">Security & Privacy</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Credentials are encrypted using AES-256 encryption</li>
                <li>• Only used for automated data synchronization</li>
                <li>• Never shared with third parties</li>
                <li>• You can revoke access at any time</li>
                <li>• All API calls are logged for audit purposes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OneSiteCredentialForm;
