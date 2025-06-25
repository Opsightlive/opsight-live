import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { CheckCircle, AlertTriangle, CreditCard, Calendar, Bell, TrendingDown, Users, DollarSign } from 'lucide-react';
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

  // Performance Triggers State
  const [performanceTriggers, setPerformanceTriggers] = useState({
    occupancyRate: { enabled: true, threshold: 85, comparison: 'below' },
    rentCollection: { enabled: true, threshold: 95, comparison: 'below' },
    maintenanceBacklog: { enabled: true, threshold: 10, comparison: 'above' },
    averageRent: { enabled: true, threshold: 5, comparison: 'below' },
    turnoverRate: { enabled: true, threshold: 15, comparison: 'above' }
  });

  // Alert Preferences State
  const [alertPreferences, setAlertPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    criticalAlertsOnly: false,
    frequency: 'immediate',
    quietHours: { enabled: true, start: '22:00', end: '08:00' }
  });

  const updatePerformanceTrigger = (key: string, field: string, value: any) => {
    setPerformanceTriggers(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

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

            <TabsContent value="performance" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">PERFORMANCE TRIGGERS</h2>
                <p className="text-gray-600 mb-8">Set automated triggers to monitor key performance metrics and receive alerts when thresholds are exceeded.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Financial Metrics</h3>
                    
                    {/* Rent Collection Rate */}
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Rent Collection Rate</span>
                        </div>
                        <Switch 
                          checked={performanceTriggers.rentCollection.enabled}
                          onCheckedChange={(value) => updatePerformanceTrigger('rentCollection', 'enabled', value)}
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Label className="min-w-[80px]">Alert when</Label>
                          <Select value={performanceTriggers.rentCollection.comparison} onValueChange={(value) => updatePerformanceTrigger('rentCollection', 'comparison', value)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="below">Below</SelectItem>
                              <SelectItem value="above">Above</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input 
                            type="number" 
                            value={performanceTriggers.rentCollection.threshold}
                            onChange={(e) => updatePerformanceTrigger('rentCollection', 'threshold', Number(e.target.value))}
                            className="w-20" 
                          />
                          <span>%</span>
                        </div>
                      </div>
                    </Card>

                    {/* Average Rent Performance */}
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <TrendingDown className="h-5 w-5 text-orange-600" />
                          <span className="font-medium">Average Rent Performance</span>
                        </div>
                        <Switch 
                          checked={performanceTriggers.averageRent.enabled}
                          onCheckedChange={(value) => updatePerformanceTrigger('averageRent', 'enabled', value)}
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Label className="min-w-[80px]">Alert when</Label>
                          <Select value={performanceTriggers.averageRent.comparison} onValueChange={(value) => updatePerformanceTrigger('averageRent', 'comparison', value)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="below">Below</SelectItem>
                              <SelectItem value="above">Above</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input 
                            type="number" 
                            value={performanceTriggers.averageRent.threshold}
                            onChange={(e) => updatePerformanceTrigger('averageRent', 'threshold', Number(e.target.value))}
                            className="w-20" 
                          />
                          <span>% vs market</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Operational Metrics</h3>
                    
                    {/* Occupancy Rate */}
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Occupancy Rate</span>
                        </div>
                        <Switch 
                          checked={performanceTriggers.occupancyRate.enabled}
                          onCheckedChange={(value) => updatePerformanceTrigger('occupancyRate', 'enabled', value)}
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Label className="min-w-[80px]">Alert when</Label>
                          <Select value={performanceTriggers.occupancyRate.comparison} onValueChange={(value) => updatePerformanceTrigger('occupancyRate', 'comparison', value)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="below">Below</SelectItem>
                              <SelectItem value="above">Above</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input 
                            type="number" 
                            value={performanceTriggers.occupancyRate.threshold}
                            onChange={(e) => updatePerformanceTrigger('occupancyRate', 'threshold', Number(e.target.value))}
                            className="w-20" 
                          />
                          <span>%</span>
                        </div>
                      </div>
                    </Card>

                    {/* Maintenance Backlog */}
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <span className="font-medium">Maintenance Backlog</span>
                        </div>
                        <Switch 
                          checked={performanceTriggers.maintenanceBacklog.enabled}
                          onCheckedChange={(value) => updatePerformanceTrigger('maintenanceBacklog', 'enabled', value)}
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Label className="min-w-[80px]">Alert when</Label>
                          <Select value={performanceTriggers.maintenanceBacklog.comparison} onValueChange={(value) => updatePerformanceTrigger('maintenanceBacklog', 'comparison', value)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="above">Above</SelectItem>
                              <SelectItem value="below">Below</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input 
                            type="number" 
                            value={performanceTriggers.maintenanceBacklog.threshold}
                            onChange={(e) => updatePerformanceTrigger('maintenanceBacklog', 'threshold', Number(e.target.value))}
                            className="w-20" 
                          />
                          <span>open tickets</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Triggers</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">ALERT PREFERENCES</h2>
                <p className="text-gray-600 mb-8">Customize how and when you receive alerts and notifications.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Notification Channels</h3>
                    
                    <Card className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Bell className="h-5 w-5 text-blue-600" />
                            <div>
                              <span className="font-medium">Email Notifications</span>
                              <p className="text-sm text-gray-500">Receive alerts via email</p>
                            </div>
                          </div>
                          <Switch 
                            checked={alertPreferences.emailNotifications}
                            onCheckedChange={(value) => setAlertPreferences(prev => ({...prev, emailNotifications: value}))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Bell className="h-5 w-5 text-green-600" />
                            <div>
                              <span className="font-medium">SMS Notifications</span>
                              <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
                            </div>
                          </div>
                          <Switch 
                            checked={alertPreferences.smsNotifications}
                            onCheckedChange={(value) => setAlertPreferences(prev => ({...prev, smsNotifications: value}))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Bell className="h-5 w-5 text-purple-600" />
                            <div>
                              <span className="font-medium">In-App Notifications</span>
                              <p className="text-sm text-gray-500">Show notifications in the dashboard</p>
                            </div>
                          </div>
                          <Switch 
                            checked={alertPreferences.inAppNotifications}
                            onCheckedChange={(value) => setAlertPreferences(prev => ({...prev, inAppNotifications: value}))}
                          />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h4 className="font-semibold mb-4">Alert Frequency</h4>
                      <Select value={alertPreferences.frequency} onValueChange={(value) => setAlertPreferences(prev => ({...prev, frequency: value}))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="hourly">Hourly Digest</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Digest</SelectItem>
                        </SelectContent>
                      </Select>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Report Preferences</h3>
                    
                    <Card className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Weekly Performance Reports</span>
                          <Switch 
                            checked={alertPreferences.weeklyReports}
                            onCheckedChange={(value) => setAlertPreferences(prev => ({...prev, weeklyReports: value}))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">Monthly Summary Reports</span>
                          <Switch 
                            checked={alertPreferences.monthlyReports}
                            onCheckedChange={(value) => setAlertPreferences(prev => ({...prev, monthlyReports: value}))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">Critical Alerts Only</span>
                          <Switch 
                            checked={alertPreferences.criticalAlertsOnly}
                            onCheckedChange={(value) => setAlertPreferences(prev => ({...prev, criticalAlertsOnly: value}))}
                          />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h4 className="font-semibold mb-4">Quiet Hours</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Enable Quiet Hours</span>
                          <Switch 
                            checked={alertPreferences.quietHours.enabled}
                            onCheckedChange={(value) => setAlertPreferences(prev => ({
                              ...prev, 
                              quietHours: {...prev.quietHours, enabled: value}
                            }))}
                          />
                        </div>
                        
                        {alertPreferences.quietHours.enabled && (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-4">
                              <Label className="min-w-[60px]">From</Label>
                              <Input 
                                type="time" 
                                value={alertPreferences.quietHours.start}
                                onChange={(e) => setAlertPreferences(prev => ({
                                  ...prev, 
                                  quietHours: {...prev.quietHours, start: e.target.value}
                                }))}
                                className="w-32"
                              />
                            </div>
                            <div className="flex items-center space-x-4">
                              <Label className="min-w-[60px]">To</Label>
                              <Input 
                                type="time" 
                                value={alertPreferences.quietHours.end}
                                onChange={(e) => setAlertPreferences(prev => ({
                                  ...prev, 
                                  quietHours: {...prev.quietHours, end: e.target.value}
                                }))}
                                className="w-32"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <Button variant="outline">Test Notifications</Button>
                  <Button>Save Preferences</Button>
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
