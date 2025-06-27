
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Database, 
  CreditCard,
  Users,
  Shield,
  Key,
  Mail,
  Phone,
  Globe,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserManagement from '@/components/users/UserManagement';

const Settings = () => {
  const { toast } = useToast();
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    companyName: 'OPSIGHT Solutions',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en',
    
    // User Profile
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Asset Manager',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    redFlagAlerts: true,
    pmEngagementAlerts: true,
    
    // AI Reader
    aiReaderMode: localStorage.getItem('aiReaderMode') || 'automatic',
    
    // Data & Privacy
    dataRetention: '12',
    analyticsTracking: true,
    shareUsageData: false,
    
    // Appearance
    theme: 'light',
    compactMode: false
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Save AI Reader mode to localStorage
    if (key === 'aiReaderMode') {
      localStorage.setItem('aiReaderMode', value);
    }
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleManageBilling = () => {
    toast({
      title: "Redirecting to Billing",
      description: "Opening billing management portal...",
    });
    // Here you would redirect to billing portal
  };

  const handleViewInvoices = () => {
    toast({
      title: "Opening Invoices",
      description: "Redirecting to invoice history...",
    });
    // Here you would open invoices page
  };

  const handleChangePlan = () => {
    toast({
      title: "Plan Selection",
      description: "Opening plan selection...",
    });
    // Here you would open plan selection
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Cancel Subscription",
      description: "Opening cancellation process...",
      variant: "destructive",
    });
    // Here you would handle cancellation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div>
            <h1 className="text-4xl font-bold mb-4">Settings</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Manage your account preferences, notifications, and system configurations
            </p>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => handleSettingChange('companyName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings.firstName}
                    onChange={(e) => handleSettingChange('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings.lastName}
                    onChange={(e) => handleSettingChange('lastName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleSettingChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={settings.role} onValueChange={(value) => handleSettingChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GP">GP</SelectItem>
                      <SelectItem value="LP">LP</SelectItem>
                      <SelectItem value="Asset Manager">Asset Manager</SelectItem>
                      <SelectItem value="Property Manager">Property Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Browser push notifications</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReports">Weekly Reports</Label>
                  <p className="text-sm text-gray-500">Receive weekly performance summaries</p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="redFlagAlerts">Red Flag Alerts</Label>
                  <p className="text-sm text-gray-500">Immediate alerts for critical issues</p>
                </div>
                <Switch
                  id="redFlagAlerts"
                  checked={settings.redFlagAlerts}
                  onCheckedChange={(checked) => handleSettingChange('redFlagAlerts', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pmEngagementAlerts">PM Engagement Alerts</Label>
                  <p className="text-sm text-gray-500">Alerts when PM engagement drops</p>
                </div>
                <Switch
                  id="pmEngagementAlerts"
                  checked={settings.pmEngagementAlerts}
                  onCheckedChange={(checked) => handleSettingChange('pmEngagementAlerts', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dataRetention">Data Retention (months)</Label>
                <Select value={settings.dataRetention} onValueChange={(value) => handleSettingChange('dataRetention', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analyticsTracking">Analytics Tracking</Label>
                  <p className="text-sm text-gray-500">Help improve our service with usage analytics</p>
                </div>
                <Switch
                  id="analyticsTracking"
                  checked={settings.analyticsTracking}
                  onCheckedChange={(checked) => handleSettingChange('analyticsTracking', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="shareUsageData">Share Usage Data</Label>
                  <p className="text-sm text-gray-500">Share anonymized usage data for research</p>
                </div>
                <Switch
                  id="shareUsageData"
                  checked={settings.shareUsageData}
                  onCheckedChange={(checked) => handleSettingChange('shareUsageData', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* User Access Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Access Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Team Members</h4>
                  <p className="text-sm text-gray-500">3 active users</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowUserManagement(true)}
                >
                  Manage Users
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">john.doe@example.com</span>
                  <Badge variant="outline">Admin</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">sarah.pm@example.com</span>
                  <Badge variant="outline">Manager</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">mike.analyst@example.com</span>
                  <Badge variant="outline">Viewer</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription & Billing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Current Plan</h4>
                  <p className="text-sm text-gray-500">Premium Plan - $295/property/month</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Properties</span>
                  <span>3 properties</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Monthly Total</span>
                  <span className="font-medium">$885.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Billing</span>
                  <span>Jan 15, 2024</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleChangePlan}>
                  Change Plan
                </Button>
                <Button variant="outline" onClick={handleManageBilling}>
                  Manage Billing
                </Button>
                <Button variant="outline" onClick={handleViewInvoices}>
                  View Invoices
                </Button>
                <Button variant="outline" onClick={handleCancelSubscription} className="text-red-600 hover:text-red-700">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Settings
            </Button>
          </div>
        </div>
      </div>

      {/* User Management Modal */}
      <Dialog open={showUserManagement} onOpenChange={setShowUserManagement}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Management</DialogTitle>
          </DialogHeader>
          <UserManagement />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
