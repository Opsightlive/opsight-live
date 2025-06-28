
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Plus, 
  Settings, 
  Bell, 
  CheckCircle, 
  Eye,
  Trash2,
  Edit,
  Play,
  Pause,
  Activity
} from 'lucide-react';
import { useRedFlagEngine } from '@/hooks/useRedFlagEngine';
import AlertRuleBuilder from './AlertRuleBuilder';

const RedFlagAlertDashboard = () => {
  const {
    alertRules,
    alertInstances,
    notificationPrefs,
    isLoading,
    saveAlertRule,
    deleteAlertRule,
    acknowledgeAlert,
    resolveAlert,
    updateNotificationPrefs,
    previewAlertLogic
  } = useRedFlagEngine();

  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);

  const activeAlerts = alertInstances.filter(alert => alert.status === 'active');
  const acknowledgedAlerts = alertInstances.filter(alert => alert.status === 'acknowledged');
  const resolvedAlerts = alertInstances.filter(alert => alert.status === 'resolved');

  const handleCreateRule = () => {
    setEditingRule(null);
    setShowRuleBuilder(true);
  };

  const handleEditRule = (rule: any) => {
    setEditingRule(rule);
    setShowRuleBuilder(true);
  };

  const handleSaveRule = async (rule: any) => {
    const success = await saveAlertRule(rule);
    if (success) {
      setShowRuleBuilder(false);
      setEditingRule(null);
    }
    return success;
  };

  const handleCancelBuilder = () => {
    setShowRuleBuilder(false);
    setEditingRule(null);
  };

  const toggleRuleStatus = async (rule: any) => {
    await saveAlertRule({
      ...rule,
      is_active: !rule.is_active
    });
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showRuleBuilder) {
    return (
      <AlertRuleBuilder
        rule={editingRule}
        onSave={handleSaveRule}
        onCancel={handleCancelBuilder}
        onPreview={previewAlertLogic}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Red Flag Alert Engine</h1>
          <p className="text-gray-600 mt-1">
            24/7 automated monitoring with real-time alerts
          </p>
        </div>
        <Button onClick={handleCreateRule} className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Alert Rule
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">{activeAlerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alert Rules</p>
                <p className="text-2xl font-bold">{alertRules.length}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rules</p>
                <p className="text-2xl font-bold text-green-600">
                  {alertRules.filter(r => r.is_active).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-blue-600">
                  {resolvedAlerts.filter(a => 
                    new Date(a.resolved_at || '').toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alert Instances</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        {/* Alert Instances Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Active Alerts ({activeAlerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {activeAlerts.map(alert => (
                  <div key={alert.id} className="border rounded-lg p-3 bg-red-50 border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.alert_message}</p>
                        <p className="text-xs text-gray-600">{alert.property_name}</p>
                      </div>
                      <Badge className={getAlertLevelColor(alert.alert_level)}>
                        {alert.alert_level.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(alert.created_at).toLocaleString()}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="h-6 px-2 text-xs"
                        >
                          Acknowledge
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveAlert(alert.id)}
                          className="h-6 px-2 text-xs"
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {activeAlerts.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No active alerts</p>
                )}
              </CardContent>
            </Card>

            {/* Acknowledged Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <Eye className="h-5 w-5" />
                  Acknowledged ({acknowledgedAlerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {acknowledgedAlerts.map(alert => (
                  <div key={alert.id} className="border rounded-lg p-3 bg-yellow-50 border-yellow-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.alert_message}</p>
                        <p className="text-xs text-gray-600">{alert.property_name}</p>
                      </div>
                      <Badge className={getAlertLevelColor(alert.alert_level)}>
                        {alert.alert_level.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Ack: {new Date(alert.acknowledged_at || '').toLocaleString()}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveAlert(alert.id)}
                        className="h-6 px-2 text-xs"
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
                {acknowledgedAlerts.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No acknowledged alerts</p>
                )}
              </CardContent>
            </Card>

            {/* Resolved Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Resolved ({resolvedAlerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {resolvedAlerts.slice(0, 10).map(alert => (
                  <div key={alert.id} className="border rounded-lg p-3 bg-green-50 border-green-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.alert_message}</p>
                        <p className="text-xs text-gray-600">{alert.property_name}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        RESOLVED
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      Resolved: {new Date(alert.resolved_at || '').toLocaleString()}
                    </div>
                  </div>
                ))}
                {resolvedAlerts.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No resolved alerts</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alert Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {alertRules.map(rule => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rule.rule_name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleRuleStatus(rule)}
                      >
                        {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">KPI Type</p>
                      <p className="text-sm text-gray-600 capitalize">{rule.kpi_type.replace('_', ' ')}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Thresholds</p>
                      <div className="flex gap-2 text-xs">
                        {rule.threshold_red_min !== undefined && (
                          <Badge variant="destructive">Red: {rule.threshold_red_min}+</Badge>
                        )}
                        {rule.threshold_yellow_min !== undefined && (
                          <Badge variant="secondary">Yellow: {rule.threshold_yellow_min}+</Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Notifications</p>
                      <div className="flex gap-1 text-xs">
                        {rule.notification_channels.map(channel => (
                          <Badge key={channel} variant="outline" className="capitalize">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditRule(rule)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteAlertRule(rule.id!)}
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

          {alertRules.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Alert Rules Yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first alert rule to start monitoring your properties.
                </p>
                <Button onClick={handleCreateRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert Rule
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Notification Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Configure how you want to receive alert notifications.
                </p>
                
                {/* Notification preferences form would go here */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">
                      Enabled: {notificationPrefs?.email_enabled ? 'Yes' : 'No'}
                    </p>
                    {notificationPrefs?.email_address && (
                      <p className="text-sm text-gray-600">
                        Address: {notificationPrefs.email_address}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">
                      Enabled: {notificationPrefs?.sms_enabled ? 'Yes' : 'No'}
                    </p>
                    {notificationPrefs?.phone_number && (
                      <p className="text-sm text-gray-600">
                        Phone: {notificationPrefs.phone_number}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RedFlagAlertDashboard;
