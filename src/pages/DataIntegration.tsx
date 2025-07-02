import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Link2, CheckCircle, AlertCircle, Clock, Settings, Zap, Shield, Cloud } from 'lucide-react';

const DataIntegration = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'Yardi Voyager',
      type: 'Property Management',
      status: 'connected',
      lastSync: '2 minutes ago',
      properties: 12,
      units: 847,
      logo: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: 'AppFolio',
      type: 'Property Management',
      status: 'connected',
      lastSync: '5 minutes ago',
      properties: 8,
      units: 623,
      logo: '/api/placeholder/40/40'
    },
    {
      id: 3,
      name: 'RentManager',
      type: 'Property Management',
      status: 'syncing',
      lastSync: 'In progress',
      properties: 4,
      units: 377,
      logo: '/api/placeholder/40/40'
    },
    {
      id: 4,
      name: 'QuickBooks',
      type: 'Accounting',
      status: 'error',
      lastSync: '2 hours ago',
      properties: 0,
      units: 0,
      logo: '/api/placeholder/40/40'
    }
  ]);

  const availableIntegrations = [
    { name: 'Buildium', type: 'Property Management', description: 'Cloud-based property management software' },
    { name: 'Rent Manager', type: 'Property Management', description: 'Comprehensive property management solution' },
    { name: 'MRI Software', type: 'Property Management', description: 'Real estate investment management' },
    { name: 'Sage Intacct', type: 'Accounting', description: 'Cloud financial management' },
    { name: 'Xero', type: 'Accounting', description: 'Online accounting software' },
    { name: 'CoStar', type: 'Market Data', description: 'Commercial real estate information' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'syncing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'syncing':
        return <Badge className="bg-yellow-100 text-yellow-800">Syncing</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Disconnected</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Data Integration Hub</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Connect and manage all your property management systems and data sources
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <span>Multi-Source Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  <span>Real-time Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Secure Connections</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  <span>Cloud-based</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="connected" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connected">Connected Systems</TabsTrigger>
            <TabsTrigger value="available">Available Integrations</TabsTrigger>
            <TabsTrigger value="settings">Sync Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="connected" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={integration.logo} 
                          alt={integration.name}
                          className="w-10 h-10 rounded-lg"
                        />
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.type}</CardDescription>
                        </div>
                      </div>
                      {getStatusIcon(integration.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      {getStatusBadge(integration.status)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Sync</span>
                      <span className="text-sm font-medium">{integration.lastSync}</span>
                    </div>

                    {integration.properties > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Properties</span>
                          <span className="text-sm font-medium">{integration.properties}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Units</span>
                          <span className="text-sm font-medium">{integration.units.toLocaleString()}</span>
                        </div>
                      </>
                    )}

                    {integration.status === 'syncing' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Sync Progress</span>
                          <span>67%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      {integration.status === 'error' && (
                        <Button size="sm" className="flex-1">
                          <Zap className="h-4 w-4 mr-2" />
                          Reconnect
                        </Button>
                      )}
                      {integration.status === 'connected' && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Database className="h-4 w-4 mr-2" />
                          Sync Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableIntegrations.map((integration, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Database className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription>{integration.type}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{integration.description}</p>
                    <Button className="w-full">
                      <Link2 className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sync Frequency</CardTitle>
                  <CardDescription>How often should we sync your data?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="frequency" value="realtime" defaultChecked />
                      <span>Real-time (recommended)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="frequency" value="hourly" />
                      <span>Every hour</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="frequency" value="daily" />
                      <span>Daily</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="frequency" value="manual" />
                      <span>Manual only</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Preferences</CardTitle>
                  <CardDescription>Choose what data to sync</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Financial data</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Tenant information</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Maintenance records</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Lease agreements</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>Marketing data</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Get notified about sync status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Sync completion</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Sync errors</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>Weekly summary</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Data security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Encrypt data in transit</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Two-factor authentication</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Audit logging</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataIntegration;
