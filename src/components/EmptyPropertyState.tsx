
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Database, Link2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyPropertyStateProps {
  hasIntegrations: boolean;
  integrationCount: number;
}

const EmptyPropertyState: React.FC<EmptyPropertyStateProps> = ({ 
  hasIntegrations, 
  integrationCount 
}) => {
  const navigate = useNavigate();

  if (!hasIntegrations) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-center max-w-md">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Properties Connected
          </h2>
          <p className="text-gray-600 mb-6">
            Connect your property management software to start seeing real data from your properties.
          </p>
          <Button 
            onClick={() => navigate('/data-integration')}
            className="bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Link2 className="h-5 w-5 mr-2" />
            Connect Your PM Software
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          Syncing Property Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-orange-700">
            You have {integrationCount} PM system{integrationCount !== 1 ? 's' : ''} connected, 
            but we're still syncing your property data. This usually takes a few minutes after 
            connecting your PM software.
          </p>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/integration-status')}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <Database className="h-4 w-4 mr-2" />
              Check Integration Status
            </Button>
            <Button 
              onClick={() => navigate('/data-integration')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Link2 className="h-4 w-4 mr-2" />
              Manage Integrations
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyPropertyState;
