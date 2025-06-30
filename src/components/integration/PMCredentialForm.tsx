
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PMCredential {
  username: string;
  password: string;
  pmSoftware: string;
  apiUrl?: string;
}

interface PMCredentialFormProps {
  pmSoftware: string;
  onCredentialsSubmit: (credentials: PMCredential) => void;
  onBack: () => void;
}

const PMCredentialForm: React.FC<PMCredentialFormProps> = ({ 
  pmSoftware, 
  onCredentialsSubmit, 
  onBack 
}) => {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<PMCredential>({
    username: '',
    password: '',
    pmSoftware,
    apiUrl: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTestResult(null);

    try {
      // Test the credentials first
      const response = await fetch('/api/test-pm-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        setTestResult('success');
        toast({
          title: "Connection successful!",
          description: `Successfully connected to ${pmSoftware}`,
        });
        
        // Submit the credentials to parent component
        onCredentialsSubmit(credentials);
      } else {
        setTestResult('error');
        toast({
          title: "Connection failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setTestResult('error');
      toast({
        title: "Connection error",
        description: "Unable to test connection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSoftwareInstructions = (software: string) => {
    switch (software.toLowerCase()) {
      case 'yardi':
        return "Enter your Yardi Voyager username and password. Make sure your account has API access enabled.";
      case 'appfolio':
        return "Enter your AppFolio username and password. Your account needs API permissions to access reports.";
      case 'resman':
        return "Enter your RESMan username and password. Ensure your account has data export permissions.";
      case 'entrata':
        return "Enter your Entrata username and password. Your account must have API access configured.";
      default:
        return "Enter your property management software credentials.";
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Connect to {pmSoftware}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your credentials are encrypted and stored securely. OPSIGHT uses these credentials only to 
              automatically sync your property data and generate reports.
            </AlertDescription>
          </Alert>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {getSoftwareInstructions(pmSoftware)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username / Email</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter your username or email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {pmSoftware === 'Custom' && (
              <div className="space-y-2">
                <Label htmlFor="apiUrl">API URL</Label>
                <Input
                  id="apiUrl"
                  type="url"
                  value={credentials.apiUrl}
                  onChange={(e) => setCredentials(prev => ({ ...prev, apiUrl: e.target.value }))}
                  placeholder="https://your-pm-software.com/api"
                />
              </div>
            )}

            {testResult === 'success' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  Connection successful! Your credentials have been verified.
                </AlertDescription>
              </Alert>
            )}

            {testResult === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to connect. Please verify your credentials and try again.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Testing Connection...' : 'Connect & Save'}
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
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PMCredentialForm;
