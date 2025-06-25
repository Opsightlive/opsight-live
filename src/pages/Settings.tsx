import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, CreditCard, Calendar } from 'lucide-react';
import UserManagement from '@/components/users/UserManagement';

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
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="integrations" className="text-lg font-medium">Integrations</TabsTrigger>
              <TabsTrigger value="performance" className="text-lg font-medium">Performance Triggers</TabsTrigger>
              <TabsTrigger value="alerts" className="text-lg font-medium">Alert Preferences</TabsTrigger>
              <TabsTrigger value="subscription" className="text-lg font-medium">Subscription</TabsTrigger>
              <TabsTrigger value="access" className="text-lg font-medium">Access</TabsTrigger>
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

            <TabsContent value="subscription" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">SUBSCRIPTION</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Current Plan</h3>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Plan:</span>
                          <span className="text-lg font-semibold">Professional</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Price:</span>
                          <span className="text-lg font-semibold">$99/month</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Next Billing:</span>
                          <span>July 25, 2025</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Properties:</span>
                          <span>3 of 25 used</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Billing History
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                          <CreditCard className="w-8 h-8 text-gray-600" />
                          <div className="flex-1">
                            <div className="font-medium">•••• •••• •••• 4242</div>
                            <div className="text-sm text-gray-500">Expires 12/25</div>
                          </div>
                          <Badge variant="outline">Default</Badge>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          Update Payment Method
                        </Button>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Billing Information</h4>
                      <p className="text-sm text-yellow-700">
                        Your subscription will automatically renew on July 25, 2025. 
                        You can cancel anytime from this page.
                      </p>
                      <Button variant="link" className="text-red-600 p-0 mt-2 h-auto">
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="access" className="space-y-6">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
