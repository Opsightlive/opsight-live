
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PMIntegrationWizard from '@/components/integration/PMIntegrationWizard';
import Navigation from '@/components/layout/Navigation';
import { Shield, Zap, BarChart3, AlertTriangle } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PMIntegrationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preSelectedPM = searchParams.get('pm') || undefined;

  const handleIntegrationComplete = () => {
    console.log('PM Integration completed successfully');
    // Navigate to dashboard instead of using window.location.href
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Property Management Integration
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect your property management software to enable automatic data synchronization, 
              real-time KPI tracking, and intelligent red flag detection.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Automatic Sync</h3>
                <p className="text-sm text-gray-600">
                  Real-time data synchronization from your PM software
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">KPI Tracking</h3>
                <p className="text-sm text-gray-600">
                  Automated KPI extraction and performance monitoring
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Red Flag Alerts</h3>
                <p className="text-sm text-gray-600">
                  Predictive alerts for potential issues and risks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-600">
                  Bank-level encryption and security for your data
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Integration Wizard */}
          <PMIntegrationWizard 
            onComplete={handleIntegrationComplete} 
            preSelectedPM={preSelectedPM}
          />

          {/* Supported Software */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Supported Property Management Software
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                'Yardi Voyager',
                'AppFolio',
                'RESMan',
                'Entrata',
                'Rent Manager',
                'Buildium',
                'Console',
                'London Computer Systems',
                'MRI Software'
              ].map((software) => (
                <Badge key={software} variant="secondary" className="text-sm py-2 px-4">
                  {software}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Don't see your PM software? Contact us for custom integration support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMIntegrationPage;
