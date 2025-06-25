
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncedData, setSyncedData] = useState({
    rentRoll: true,
    generalLedger: true,
    delinquencyReport: true,
    unitAvailability: true,
    workOrders: true,
    trafficReport: true
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      
      <Card className="bg-white border-2 border-blue-200 rounded-lg">
        <CardContent className="p-6">
          <Tabs defaultValue="integrations" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="integrations" className="text-lg font-medium">Integrations</TabsTrigger>
              <TabsTrigger value="performance" className="text-lg font-medium">Performance Triggers</TabsTrigger>
              <TabsTrigger value="alerts" className="text-lg font-medium">Alert Preferences</TabsTrigger>
              <TabsTrigger value="subscription" className="text-lg font-medium">Subscription & Access</TabsTrigger>
            </TabsList>

            <TabsContent value="integrations" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">INTEGRATIONS</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">PM Software:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">AppFolio</span>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">Next Sync Scheduled:</span>
                        <span className="text-lg">June 17, 2025 at</span>
                      </div>
                      <Button variant="outline" className="w-fit">Test Connection</Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">Auto-Sync Enabled:</span>
                        <Switch 
                          checked={autoSyncEnabled} 
                          onCheckedChange={setAutoSyncEnabled}
                        />
                      </div>
                      <Button variant="link" className="text-blue-600 p-0 h-auto">Sync History</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Data Being Synced:</h3>
                    <div className="space-y-3">
                      {Object.entries(syncedData).map(([key, checked]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox 
                            checked={checked}
                            onCheckedChange={(value) => setSyncedData(prev => ({
                              ...prev,
                              [key]: value as boolean
                            }))}
                          />
                          <label className="text-lg capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2 pt-4">
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>All reports imported successfully</span>
                      </div>
                      <div className="flex items-center space-x-2 text-yellow-600">
                        <AlertTriangle className="h-5 w-5" />
                        <span>1 report failed to sync</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">PERFORMANCE TRIGGERS</h2>
                <p className="text-gray-600">Configure performance monitoring triggers and thresholds here.</p>
                <div className="mt-4 p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Performance trigger settings coming soon...</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">ALERT PREFERENCES</h2>
                <p className="text-gray-600">Customize how and when you receive alerts.</p>
                <div className="mt-4 p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Alert preference settings coming soon...</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">SUBSCRIPTION & ACCESS</h2>
                <p className="text-gray-600">Manage your subscription and access settings.</p>
                <div className="mt-4 p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Subscription settings coming soon...</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
