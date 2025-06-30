
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, AlertTriangle, Plus, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RealDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trinity Trace Dashboard</h1>
          <p className="text-gray-600 mt-2">Real OneSite integration is not implemented</p>
        </div>
        <Badge variant="destructive">
          No Real Data Connection
        </Badge>
      </div>

      {/* Honest No Integration State */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-12 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-semibold text-red-900 mb-4">Real OneSite Integration Not Available</h2>
          <p className="text-red-700 mb-6 max-w-2xl mx-auto">
            This system cannot actually connect to OneSite or extract real property data. 
            The previous "integrations" were only generating fake data. To get real Trinity Trace data, 
            you would need actual OneSite API access or web scraping implementation.
          </p>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">What This System Cannot Do:</h3>
              <ul className="text-sm text-red-700 space-y-1 text-left max-w-md mx-auto">
                <li>• Cannot log into OneSite portals</li>
                <li>• Cannot scrape live property data</li>
                <li>• Cannot access real occupancy rates</li>
                <li>• Cannot pull actual rent rolls</li>
                <li>• Cannot get real maintenance requests</li>
              </ul>
            </div>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => window.open('https://onesite.com', '_blank')}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to OneSite Directly
              </Button>
              <Button 
                onClick={() => navigate('/data-integration')}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                View Integration Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trinity Trace Focus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Trinity Trace Property
          </CardTitle>
          <CardDescription>
            To get real data for Trinity Trace, you need actual OneSite integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              No real property data available. This dashboard will only show actual data 
              once proper OneSite integration is implemented.
            </p>
            <Button 
              onClick={() => navigate('/pm-integration')}
              variant="outline"
            >
              Integration Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealDashboard;
