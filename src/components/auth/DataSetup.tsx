import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Database, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DataSetupProps {
  onComplete: () => void;
}

const DataSetup: React.FC<DataSetupProps> = ({ onComplete }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionComplete, setConnectionComplete] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsConnecting(false);
    setConnectionComplete(true);
    
    // Complete the setup and redirect to dashboard
    setTimeout(() => {
      localStorage.removeItem('pendingRegistration');
      navigate('/dashboard');
      onComplete();
    }, 2000);
  };

  if (connectionComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
            <p className="text-gray-600 mb-4">
              Your data is connected and your dashboard is ready. 
              Redirecting you now...
            </p>
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Final Step: Connect Your Data</h1>
          <p className="text-xl text-blue-100">
            We'll now connect to your property management system and start importing your data.
          </p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-6 w-6 text-blue-600 mr-2" />
              Data Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Payment configured successfully</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Account setup completed</span>
              </div>
              <div className="flex items-center space-x-3">
                {isConnecting ? (
                  <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                )}
                <span className={isConnecting ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                  {isConnecting ? 'Connecting to your PM system...' : 'Ready to connect data source'}
                </span>
              </div>
            </div>

            {!isConnecting && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Ready to Connect</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Click the button below to establish a secure connection to your property management system. 
                      This will start importing your portfolio data and generating insights.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isConnecting && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Connection in Progress</h4>
                    <p className="text-sm text-green-700 mt-1">
                      We're securely connecting to your PM system and importing your data. 
                      This usually takes a few moments...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                {isConnecting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <>
                    <Database className="w-5 h-5 mr-2" />
                    Connect & Access Dashboard
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataSetup;
