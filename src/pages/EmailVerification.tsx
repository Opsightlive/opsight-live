import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || type !== 'signup') {
          setVerificationStatus('error');
          setErrorMessage('Invalid verification link');
          return;
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (error) {
          console.error('Email verification error:', error);
          setVerificationStatus('error');
          setErrorMessage(error.message || 'Email verification failed');
          return;
        }

        setVerificationStatus('success');
        toast.success('Email verified successfully!');
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);

      } catch (error: any) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');
        setErrorMessage('An unexpected error occurred');
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate]);

  const handleGoToDashboard = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleGoToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>
            {verificationStatus === 'loading' && 'Verifying your email...'}
            {verificationStatus === 'success' && 'Your email has been verified!'}
            {verificationStatus === 'error' && 'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {verificationStatus === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              <p className="text-gray-600">Please wait while we verify your email...</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <p className="text-green-600 font-medium">Email verified successfully!</p>
              <p className="text-gray-600 text-sm">
                You will be redirected to your dashboard shortly...
              </p>
              <Button onClick={handleGoToDashboard} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-12 w-12 text-red-600" />
              <p className="text-red-600 font-medium">Verification Failed</p>
              <p className="text-gray-600 text-sm">{errorMessage}</p>
              <div className="flex space-x-2 w-full">
                <Button variant="outline" onClick={handleGoToLogin} className="flex-1">
                  Go to Login
                </Button>
                <Button onClick={() => window.location.reload()} className="flex-1">
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
