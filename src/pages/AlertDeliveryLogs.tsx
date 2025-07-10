import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Mail, MessageSquare, Bell, CheckCircle, XCircle, Clock, Search, Filter, Download } from 'lucide-react';

const AlertDeliveryLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const deliveryLogs = [
    {
      id: 1,
      timestamp: '2024-01-15 14:32:15',
      alertType: 'Critical Red Flag',
      recipient: 'john.doe@company.com',
      channel: 'email',
      status: 'delivered',
      subject: 'URGENT: Multiple tenant complaints at Sunset Gardens',
      retryCount: 0,
      deliveryTime: '2.3s'
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:32:16',
      alertType: 'Critical Red Flag',
      recipient: '+1-555-0123',
      channel: 'sms',
      status: 'delivered',
      subject: 'URGENT: Multiple tenant complaints at Sunset Gardens',
      retryCount: 0,
      deliveryTime: '1.8s'
    },
    {
      id: 3,
      timestamp: '2024-01-15 09:15:22',
      alertType: 'Performance Warning',
      recipient: 'sarah.manager@company.com',
      channel: 'email',
      status: 'failed',
      subject: 'Rent collection below threshold - Metro Plaza',
      retryCount: 2,
      deliveryTime: 'N/A',
      error: 'Recipient mailbox full'
    },
    {
      id: 4,
      timestamp: '2024-01-15 09:15:45',
      alertType: 'Performance Warning',
      recipient: 'sarah.manager@company.com',
      channel: 'push',
      status: 'delivered',
      subject: 'Rent collection below threshold - Metro Plaza',
      retryCount: 0,
      deliveryTime: '0.9s'
    }
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'push':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'border-l-green-500';
      case 'failed':
        return 'border-l-red-500';
      case 'pending':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const filteredLogs = deliveryLogs.filter(log => {
    const matchesSearch = log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">Alert Delivery Logs</h1>
        <p className="text-blue-100">
          Track and monitor the delivery status of all alert notifications
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by recipient or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
          
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="delivered">Delivered</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>

        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
        
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Delivery Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">1,198</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">23</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">96.2%</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Logs */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <Card key={log.id} className={`border-l-4 ${getStatusColor(log.status)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(log.status)}
                  <div>
                    <CardTitle className="text-base">{log.subject}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">{log.timestamp}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{log.recipient}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    {getChannelIcon(log.channel)}
                    <span>{log.channel.toUpperCase()}</span>
                  </Badge>
                  <Badge 
                    variant={
                      log.status === 'delivered' ? 'default' :
                      log.status === 'failed' ? 'destructive' : 'secondary'
                    }
                  >
                    {log.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Delivery Time: </span>
                  <span className="font-medium">{log.deliveryTime}</span>
                </div>
                <div>
                  <span className="text-gray-600">Retry Count: </span>
                  <span className="font-medium">{log.retryCount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Alert Type: </span>
                  <span className="font-medium">{log.alertType}</span>
                </div>
              </div>
              {log.error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                  <span className="text-red-600 text-sm">Error: {log.error}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No delivery logs found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlertDeliveryLogs;
