
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AISuggestionsPanel from '@/components/ai/AISuggestionsPanel';

const AlertsNotifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    browser: false
  });

  const [soundEnabled, setSoundEnabled] = useState(true);

  const recentAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Low Collection Rate Alert',
      message: 'Oak Ridge Complex collection rate dropped to 92%',
      timestamp: '2024-01-15 14:30',
      property: 'Oak Ridge Complex',
      read: false,
      delivered: ['email', 'sms']
    },
    {
      id: 2,
      type: 'warning',
      title: 'Maintenance Response Time',
      message: 'Average response time exceeded 48 hours',
      timestamp: '2024-01-15 12:15',
      property: 'Sunset Gardens',
      read: true,
      delivered: ['email', 'push']
    },
    {
      id: 3,
      type: 'info',
      title: 'Monthly Report Available',
      message: 'December property performance report is ready',
      timestamp: '2024-01-15 09:00',
      property: 'All Properties',
      read: true,
      delivered: ['email']
    }
  ];

  const handleNotificationToggle = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    
    toast({
      title: "Notification Settings Updated",
      description: `${type} notifications ${notifications[type] ? 'disabled' : 'enabled'}`,
    });
  };

  const handleMarkAsRead = (alertId: number) => {
    toast({
      title: "Alert Marked as Read",
      description: "Alert status updated",
    });
  };

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch(type) {
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'info': return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Red Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-lg shadow-lg">
          <div>
            <h1 className="text-4xl font-bold mb-4">Alerts & Notifications</h1>
            <p className="text-xl text-red-100 max-w-3xl">Manage your notification preferences and view real-time alerts from across your property portfolio</p>
          </div>
        </div>

        {/* AI Suggestions Panel */}
        <AISuggestionsPanel />

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>Email Notifications</span>
                  </div>
                  <p className="text-sm text-gray-600">Receive alerts and updates via email</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={() => handleNotificationToggle('email')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span>SMS Alerts</span>
                  </div>
                  <p className="text-sm text-gray-600">Get urgent alerts via SMS</p>
                </div>
                <Switch 
                  checked={notifications.sms}
                  onCheckedChange={() => handleNotificationToggle('sms')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <span>Push Notifications</span>
                  </div>
                  <p className="text-sm text-gray-600">Receive notifications on your device</p>
                </div>
                <Switch 
                  checked={notifications.push}
                  onCheckedChange={() => handleNotificationToggle('push')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <span>Browser Notifications</span>
                  </div>
                  <p className="text-sm text-gray-600">Receive notifications in your browser</p>
                </div>
                <Switch 
                  checked={notifications.browser}
                  onCheckedChange={() => handleNotificationToggle('browser')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <div>
          <h2 className="text-lg font-semibold text-black mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <Card key={alert.id} className="border-2">
                <CardContent className="flex items-start justify-between p-4">
                  <div className="flex items-start">
                    {getAlertIcon(alert.type)}
                    <div className="ml-3 space-y-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-sm font-semibold">{alert.title}</CardTitle>
                        {getAlertBadge(alert.type)}
                      </div>
                      <p className="text-gray-600 text-sm">{alert.message}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(alert.timestamp).toLocaleString()} - {alert.property}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {alert.delivered.map((channel) => (
                          <Badge key={channel} variant="secondary" className="text-xs">
                            {channel.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button variant="ghost" size="icon" onClick={() => handleMarkAsRead(alert.id)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsNotifications;
