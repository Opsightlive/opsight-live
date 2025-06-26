
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Upload, Database, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DataSetupProps {
  onComplete: () => void;
}

const DataSetup: React.FC<DataSetupProps> = ({ onComplete }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('pendingRegistration');
    if (stored) {
      setRegistrationData(JSON.parse(stored));
    }
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleDataSetupComplete = async () => {
    if (!registrationData) return;

    setIsConnecting(true);

    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Complete the registration
      const success = await register(
        registrationData.email,
        registrationData.password,
        registrationData.userData
      );

      if (success) {
        localStorage.removeItem('pendingRegistration');
        onComplete();
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  if (!registrationData) {
    return <div>Loading...</div>;
  }

  const { userData } = registrationData;
  const isConnectPM = userData?.dataSource === 'connect-pm';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="mr-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-black mb-2">OPSIGHT</h1>
          <p className="text-blue-600 text-lg tracking-wider">OPERATIONAL INSIGHT</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-8">
            {isConnectPM ? 'Connecting Your Data' : 'Setup Complete'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isConnectPM 
              ? 'We\'re connecting to your property management system to sync your data.'
              : 'Your account is ready! You can start uploading reports manually.'
            }
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              {isConnectPM ? (
                <Database className="h-6 w-6 text-blue-600 mr-2" />
              ) : (
                <Upload className="h-6 w-6 text-blue-600 mr-2" />
              )}
              {isConnectPM ? 'PM System Connection' : 'Manual Upload Setup'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isConnectPM ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Payment processed successfully</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Credentials verified and encrypted</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Properties configured: {userData?.properties?.length || 0}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>PM Software: {userData?.pmSoftware || 'Not specified'}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">🔄 Syncing your data...</p>
                  <p className="text-blue-700 text-sm mt-1">
                    This process may take a few minutes. We're importing your properties, 
                    units, tenants, and financial data.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Payment processed successfully</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Account setup complete</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Properties configured: {userData?.properties?.length || 0}</span>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-orange-800 font-medium">📄 Manual Upload Setup</p>
                  <p className="text-orange-700 text-sm mt-1">
                    You can start uploading your property reports manually once your 
                    account is activated.
                  </p>
                </div>
              </>
            )}

            <Button 
              onClick={handleDataSetupComplete}
              disabled={isConnecting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isConnecting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isConnectPM ? 'Connecting...' : 'Setting up...'}</span>
                </div>
              ) : (
                'Complete Setup & Access Dashboard'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataSetup;
