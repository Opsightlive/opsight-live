
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Plus, Sync, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { usePMIntegration } from '@/hooks/usePMIntegration';

const PMIntegrationSetup = () => {
  const { integrations, isLoading, loadIntegrations, createIntegration, syncIntegration, deleteIntegration } = usePMIntegration();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    pmSoftware: '',
    integrationName: '',
    username: '',
    password: '',
    apiKey: '',
    endpoint: '',
    syncFrequency: 'daily'
  });

  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const credentials = {
      username: formData.username,
      password: formData.password,
      apiKey: formData.apiKey,
      endpoint: formData.endpoint
    };

    const result = await createIntegration(
      formData.pmSoftware,
      formData.integrationName,
      credentials,
      formData.syncFrequency
    );

    if (result) {
      setIsModalOpen(false);
      setFormData({
        pmSoftware: '',
        integrationName: '',
        username: '',
        password: '',
        apiKey: '',
        endpoint: '',
        syncFrequency: 'daily'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'syncing':
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
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Property Management Integrations</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add PM Integration</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="pmSoftware">PM Software</Label>
                <Select value={formData.pmSoftware} onValueChange={(value) => setFormData({...formData, pmSoftware: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select PM Software" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yardi">Yardi</SelectItem>
                    <SelectItem value="appfolio">AppFolio</SelectItem>
                    <SelectItem value="resman">ResMan</SelectItem>
                    <SelectItem value="entrata">Entrata</SelectItem>
                    <SelectItem value="buildium">Buildium</SelectItem>
                    <SelectItem value="propertyware">Propertyware</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="integrationName">Integration Name</Label>
                <Input
                  id="integrationName"
                  value={formData.integrationName}
                  onChange={(e) => setFormData({...formData, integrationName: e.target.value})}
                  placeholder="e.g., Downtown Properties Yardi"
                  required
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="API Username"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="API Password"
                  required
                />
              </div>

              <div>
                <Label htmlFor="apiKey">API Key (if applicable)</Label>
                <Input
                  id="apiKey"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                  placeholder="API Key"
                />
              </div>

              <div>
                <Label htmlFor="endpoint">API Endpoint (if custom)</Label>
                <Input
                  id="endpoint"
                  value={formData.endpoint}
                  onChange={(e) => setFormData({...formData, endpoint: e.target.value})}
                  placeholder="https://api.example.com"
                />
              </div>

              <div>
                <Label htmlFor="syncFrequency">Sync Frequency</Label>
                <Select value={formData.syncFrequency} onValueChange={(value) => setFormData({...formData, syncFrequency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Create Integration
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {integration.integration_name}
                </CardTitle>
                <Badge className={getStatusColor(integration.sync_status)}>
                  {getStatusIcon(integration.sync_status)}
                  <span className="ml-1 capitalize">{integration.sync_status}</span>
                </Badge>
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
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => syncIntegration(integration.id)}
                    disabled={integration.sync_status === 'syncing'}
                  >
                    <Sync className="h-4 w-4 mr-1" />
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

      {integrations.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Integrations Yet</h3>
            <p className="text-gray-600 mb-4">
              Connect your property management software to automatically sync KPI data.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Integration
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PMIntegrationSetup;
