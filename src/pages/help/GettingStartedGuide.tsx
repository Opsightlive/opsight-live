
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GettingStartedGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/help')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Getting Started with OpSight</h1>
          <p className="text-gray-600 mt-2">Your complete guide to using the Asset Performance OS</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2 text-blue-600" />
                Quick Start Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <Play className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-600">Watch this 5-minute overview to get started with OpSight's key features.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">1. Complete Your Profile</h3>
                  <p className="text-gray-600">Add your company information and property details in Settings.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">2. Connect Your Data Sources</h3>
                  <p className="text-gray-600">Link your property management system or upload reports manually.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">3. Set Up Alerts</h3>
                  <p className="text-gray-600">Configure red flag alerts for key performance metrics.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">4. Customize Your Dashboard</h3>
                  <p className="text-gray-600">Arrange KPI widgets to match your workflow.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Portfolio Overview</h3>
                  <p className="text-sm text-gray-600">Monitor all your properties from a single dashboard with real-time performance metrics.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">KPI Command Center</h3>
                  <p className="text-sm text-gray-600">Track key performance indicators with customizable charts and benchmarks.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Red Flag Alerts</h3>
                  <p className="text-sm text-gray-600">Get notified of issues before they become problems with intelligent monitoring.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">AI Reader</h3>
                  <p className="text-sm text-gray-600">Automatically process and analyze property management reports.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedGuide;
