
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Settings, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { usePMIntegration } from '@/hooks/usePMIntegration';
import ScrapingTestPanel from './ScrapingTestPanel';

const PMIntegrationStatus = () => {
  const { integrations, isLoading, loadIntegrations, deleteIntegration } = usePMIntegration();

  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'syncing':
      case 'testing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'syncing':
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading integrations...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">PM Integration Status</h2>
        <Button onClick={loadIntegrations} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {integrations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Integrations Found</h3>
            <p className="text-gray-600 mb-4">
              You haven't connected any property management software yet.
            </p>
            <Button onClick={() => window.location.href = '/data-integration'}>
              Add Integration
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {integration.integration_name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(integration.sync_status)}>
                      {getStatusIcon(integration.sync_status)}
                      <span className="ml-1 capitalize">{integration.sync_status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">PM Software</p>
                    <p className="text-sm text-gray-600 capitalize">{integration.pm_software}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Sync Frequency</p>
                    <p className="text-sm text-gray-600 capitalize">{integration.sync_frequency}</p>
                  </div>
                  
                  {integration.last_sync && (
                    <div>
                      <p className="text-sm font-medium">Last Sync</p>
                      <p className="text-sm text-gray-600">
                        {new Date(integration.last_sync).toLocaleDateString()} at{' '}
                        {new Date(integration.last_sync).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteIntegration(integration.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>

                {/* Add the scraping test panel */}
                <ScrapingTestPanel integration={integration} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PMIntegrationStatus;
