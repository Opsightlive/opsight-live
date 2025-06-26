import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Users, 
  Database,
  Image as ImageIcon,
  Save,
  Trash2,
  Upload
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SidebarImageManager from '@/components/sidebar/SidebarImageManager';

const Settings = () => {
  const { user, isCompanyUser } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    redFlags: true,
    reports: true
  });
  const [aiReaderMode, setAiReaderMode] = useState('automatic');

  const handleSaveSettings = () => {
    // Save AI Reader mode to localStorage
    localStorage.setItem('aiReaderMode', aiReaderMode);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Settings</h1>
              <p className="text-xl text-blue-100 max-w-3xl">Manage your account and application preferences</p>
            </div>
            <Badge variant={isCompanyUser ? "default" : "secondary"} className="bg-white text-blue-600">
              {isCompanyUser ? "Company Account" : "Client Account"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="sidebar">Sidebar Images</TabsTrigger>
            {isCompanyUser && <TabsTrigger value="users">Users</TabsTrigger>}
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure your basic account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      defaultValue={user?.company || ""}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="darkMode" />
                  <Label htmlFor="darkMode">Enable dark mode</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="autoSave" defaultChecked />
                  <Label htmlFor="autoSave">Auto-save changes</Label>
                </div>

                <Separator />

                {/* AI Reader Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    <Label className="text-base font-medium">AI Reader Upload Mode</Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Choose how documents are uploaded to the AI Reader
                  </p>
                  <RadioGroup 
                    value={aiReaderMode} 
                    onValueChange={setAiReaderMode}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="automatic" id="automatic" />
                      <Label htmlFor="automatic" className="cursor-pointer">
                        <div>
                          <div className="font-medium">Automatic Upload</div>
                          <div className="text-sm text-gray-600">
                            Documents are automatically processed and analyzed
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual" className="cursor-pointer">
                        <div>
                          <div className="font-medium">Manual Upload</div>
                          <div className="text-sm text-gray-600">
                            You manually select and upload documents for processing
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive alerts and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, email: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Alerts</Label>
                      <p className="text-sm text-gray-600">Get urgent alerts via SMS</p>
                    </div>
                    <Switch 
                      checked={notifications.sms}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, sms: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Red Flag Alerts</Label>
                      <p className="text-sm text-gray-600">Critical property alerts</p>
                    </div>
                    <Switch 
                      checked={notifications.redFlags}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, redFlags: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full md:w-auto">
                  Change Password
                </Button>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                  </div>
                  <select className="p-2 border border-gray-300 rounded-md">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                    <option>Never</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sidebar Images */}
          <TabsContent value="sidebar" className="space-y-6">
            <SidebarImageManager />
          </TabsContent>

          {/* Users (Company Only) */}
          {isCompanyUser && (
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage team members and their permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Invite New User</Button>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      User management features will be available here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Manage your data and storage preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800">Data Export</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Export all your data in CSV or JSON format
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Export Data
                  </Button>
                </div>
                
                <Separator />
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800">Danger Zone</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive" size="sm" className="mt-2">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
