
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Clock, RefreshCw, Database } from 'lucide-react';

interface IntegrationStatus {
  id: string;
  name: string;
  status: 'connected' | 'syncing' | 'error' | 'pending';
  lastSync: Date;
  properties: number;
  dataTypes: string[];
  healthScore: number;
}

const PMIntegrationStatus = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate fetching integration status
    setIntegrations([
      {
        id: 'yardi',
        name: 'Yardi Voyager',
        status: 'connected',
        lastSync: new Date(Date.now() - 30 * 60 * 1000),
        properties: 12,
        dataTypes: ['Financial', 'Occupancy', 'Maintenance', 'Leasing'],
        healthScore: 98
      },
      {
        id: 'appfolio',
        name: 'AppFolio',
        status: 'syncing',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        properties: 8,
        dataTypes: ['Financial', 'Occupancy'],
        healthScore: 92
      },
      {
        id: 'buildium',
        name: 'Buildium',
        status: 'error',
        lastSync: new Date(Date.now() - 12 * 60 * 60 * 1000),
        properties: 5,
        dataTypes: ['Financial'],
        healthScore: 45
      }
    ]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'syncing': return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <Database className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      connected: 'bg-green-100 text-green-800',
      syncing: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const totalProperties = integrations.reduce((sum, int) => sum + int.properties, 0);
  const connectedIntegrations = integrations.filter(int => int.status === 'connected').length;
  const avgHealthScore = Math.round(integrations.reduce((sum, int) => sum + int.healthScore, 0) / integrations.length);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected Systems</p>
                <p className="text-2xl font-bold">{connectedIntegrations}/{integrations.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Properties Synced</p>
                <p className="text-2xl font-bold">{totalProperties}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Health Score</p>
                <p className="text-2xl font-bold">{avgHealthScore}%</p>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                avgHealthScore >= 90 ? 'bg-green-100' : avgHealthScore >= 70 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <span className={`text-sm font-bold ${
                  avgHealthScore >= 90 ? 'text-green-600' : avgHealthScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {avgHealthScore}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>PM System Integrations</CardTitle>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(integration.status)}
                    <div>
                      <h4 className="font-semibold">{integration.name}</h4>
                      <p className="text-sm text-gray-600">
                        {integration.properties} properties • Last sync: {integration.lastSync.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Health: {integration.healthScore}%</span>
                    {getStatusBadge(integration.status)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {integration.dataTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>

                {integration.status === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 text-sm">
                    <p className="text-red-800 font-medium">Connection Error</p>
                    <p className="text-red-700">Authentication failed. Please check credentials and reconnect.</p>
                    <Button size="sm" className="mt-2">Reconnect</Button>
                  </div>
                )}

                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className={`h-2 rounded-full ${
                      integration.healthScore >= 90 ? 'bg-green-600' : 
                      integration.healthScore >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${integration.healthScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PMIntegrationStatus;
