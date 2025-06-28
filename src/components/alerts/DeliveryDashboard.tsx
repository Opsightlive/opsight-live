
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Phone, 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Activity,
  Eye
} from 'lucide-react';
import { useAlertDelivery } from '@/hooks/useAlertDelivery';
import MessageTemplateEditor from './MessageTemplateEditor';
import { MessageTemplate } from '@/services/alertDeliveryService';

const DeliveryDashboard = () => {
  const {
    templates,
    deliveryLogs,
    statistics,
    isLoading,
    saveTemplate,
    deleteTemplate,
    previewTemplate,
    testDelivery,
    availableVariables
  } = useAlertDelivery();

  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | undefined>();

  // Calculate summary statistics
  const todayStats = statistics.filter(s => 
    s.date === new Date().toISOString().split('T')[0]
  );
  
  const totalSentToday = todayStats.reduce((sum, s) => sum + s.total_sent, 0);
  const totalDeliveredToday = todayStats.reduce((sum, s) => sum + s.total_delivered, 0);
  const totalFailedToday = todayStats.reduce((sum, s) => sum + s.total_failed, 0);

  const recentLogs = deliveryLogs.slice(0, 10);

  const handleCreateTemplate = () => {
    setEditingTemplate(undefined);
    setShowTemplateEditor(true);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setShowTemplateEditor(true);
  };

  const handleSaveTemplate = async (template: MessageTemplate) => {
    const success = await saveTemplate(template);
    if (success) {
      setShowTemplateEditor(false);
      setEditingTemplate(undefined);
    }
    return success;
  };

  const handleCancelEditor = () => {
    setShowTemplateEditor(false);
    setEditingTemplate(undefined);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'bounced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'sent':
        return <Send className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
      case 'bounced':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Phone className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  if (showTemplateEditor) {
    return (
      <MessageTemplateEditor
        template={editingTemplate}
        onSave={handleSaveTemplate}
        onCancel={handleCancelEditor}
        onPreview={previewTemplate}
        onTest={testDelivery}
        availableVariables={availableVariables}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alert Delivery System</h1>
          <p className="text-gray-600 mt-1">
            Manage templates, monitor deliveries, and track performance
          </p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sent Today</p>
                <p className="text-2xl font-bold">{totalSentToday}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered Today</p>
                <p className="text-2xl font-bold text-green-600">{totalDeliveredToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Today</p>
                <p className="text-2xl font-bold text-red-600">{totalFailedToday}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {templates.map(template => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getChannelIcon(template.template_type)}
                      {template.template_name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.is_active ? 'default' : 'secondary'}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {template.template_type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {template.subject && (
                      <div>
                        <p className="text-sm font-medium">Subject:</p>
                        <p className="text-sm text-gray-600 truncate">{template.subject}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium">Message Preview:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.message_content.substring(0, 100)}...
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => template.id && deleteTemplate(template.id)}
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

          {templates.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first message template to start sending alerts.
                </p>
                <Button onClick={handleCreateTemplate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Delivery Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Delivery Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getChannelIcon(log.recipient_type)}
                      <div>
                        <p className="font-medium text-sm">{log.recipient_address}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(log.delivery_status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(log.delivery_status)}
                          {log.delivery_status.toUpperCase()}
                        </div>
                      </Badge>
                      {log.retry_count > 0 && (
                        <Badge variant="outline">
                          Retry {log.retry_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                {recentLogs.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No delivery logs yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {['email', 'sms'].map(channel => {
              const channelStats = statistics.filter(s => s.channel === channel);
              const totalSent = channelStats.reduce((sum, s) => sum + s.total_sent, 0);
              const totalDelivered = channelStats.reduce((sum, s) => sum + s.total_delivered, 0);
              const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent * 100) : 0;

              return (
                <Card key={channel}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      {getChannelIcon(channel)}
                      {channel} Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Sent</p>
                          <p className="text-xl font-bold">{totalSent}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Delivered</p>
                          <p className="text-xl font-bold text-green-600">{totalDelivered}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                        <p className="text-xl font-bold">{deliveryRate.toFixed(1)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryDashboard;
