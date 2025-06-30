import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Link2, CheckCircle, AlertCircle, Clock, Settings, Zap, Shield, Cloud, Plus, RefreshCw, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Navigation from '@/components/layout/Navigation';
import { usePMIntegration } from '@/hooks/usePMIntegration';
import RealtimePMIntegrationStatus from '@/components/integration/RealtimePMIntegrationStatus';

const DataIntegration = () => {
  const navigate = useNavigate();
  const { integrations, isLoading, loadIntegrations, syncIntegration, deleteIntegration } = usePMIntegration();

  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  const availableIntegrations = [
    { name: 'OneSite', type: 'Property Management', description: 'Connect your OneSite property management system', isRecommended: true },
    { name: 'Buildium', type: 'Property Management', description: 'Cloud-based property management software' },
    { name: 'RentManager', type: 'Property Management', description: 'Comprehensive property management solution' },
    { name: 'MRI Software', type: 'Property Management', description: 'Real estate investment management' },
    { name: 'Sage Intacct', type: 'Accounting', description: 'Cloud financial management' },
    { name: 'Xero', type: 'Accounting', description: 'Online accounting software' },
    { name: 'CoStar', type: 'Market Data', description: 'Commercial real estate information' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
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
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'syncing':
        return <Badge className="bg-yellow-100 text-yellow-800">Syncing</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Disconnected</Badge>;
    }
  };

  const handleConnectPM = (pmName: string) => {
    if (pmName === 'OneSite') {
      navigate('/pm-integration?pm=onesite');
    } else {
      alert(`${pmName} integration coming soon! OneSite is currently available for testing.`);
    }
  };

  return (
    <>
      <Navigation />
      <Layout>
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
              <Button 
                onClick={() => navigate('/pm-integration?pm=onesite')}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Connect OneSite
              </Button>
            </div>
          </div>

          {/* Real-time Status */}
          <RealtimePMIntegrationStatus />

          {/* Quick Start Card - Only show if no integrations */}
          {integrations.length === 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">🚀 Quick Start: Connect Your OneSite System</CardTitle>
                <CardDescription className="text-blue-600">
                  Ready to test the OneSite integration? Click below to connect your property management system and start syncing data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/pm-integration?pm=onesite')}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Link2 className="h-5 w-5 mr-2" />
                  Set Up OneSite Integration
                </Button>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue={integrations.length > 0 ? "connected" : "available"} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="available">Available Integrations</TabsTrigger>
              <TabsTrigger value="connected">Connected Systems ({integrations.length})</TabsTrigger>
              <TabsTrigger value="settings">Sync Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableIntegrations.map((integration, index) => (
                  <Card key={index} className={`hover:shadow-lg transition-shadow ${integration.isRecommended ? 'border-blue-300 bg-blue-50' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Database className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {integration.name}
                              {integration.isRecommended && (
                                <Badge className="bg-blue-600 text-white">Recommended</Badge>
                              )}
                            </CardTitle>
                            <CardDescription>{integration.type}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{integration.description}</p>
                      <Button 
                        className="w-full"
                        onClick={() => handleConnectPM(integration.name)}
                        variant={integration.isRecommended ? "default" : "outline"}
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        {integration.name === 'OneSite' ? 'Connect Now' : 'Connect'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="connected" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading integrations...</p>
                </div>
              ) : integrations.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Integrations Connected Yet</h3>
                  <p className="text-gray-500 mb-4">Connect your first property management system to get started</p>
                  <Button onClick={() => navigate('/pm-integration')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Integration
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {integrations.map((integration) => (
                    <Card key={integration.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            {integration.integration_name}
                          </CardTitle>
                          {getStatusBadge(integration.sync_status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
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

                          {integration.error_log && (
                            <div>
                              <p className="text-sm font-medium text-red-600">Error</p>
                              <p className="text-sm text-red-600">{integration.error_log}</p>
                            </div>
                          )}
                          
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => syncIntegration(integration.id)}
                              disabled={integration.sync_status === 'syncing'}
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Sync Now
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteIntegration(integration.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
      </Layout>
    </>
  );
};

export default DataIntegration;
