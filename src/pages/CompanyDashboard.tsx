
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Users, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Clock, Activity, Settings } from 'lucide-react';

const CompanyDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedClient, setSelectedClient] = useState('all');

  const clientStats = {
    totalClients: 47,
    activeClients: 43,
    newThisMonth: 5,
    churnRate: 2.1
  };

  const systemHealth = {
    uptime: 99.97,
    avgResponseTime: 145,
    activeConnections: 1247,
    dataProcessed: '2.4TB'
  };

  const recentAlerts = [
    {
      id: 1,
      client: 'Premier Property Group',
      type: 'Integration Error',
      message: 'AppFolio sync failed for Oak Ridge Complex',
      severity: 'high',
      timestamp: '5 min ago',
      status: 'active'
    },
    {
      id: 2,
      client: 'Sunset Realty Partners',
      type: 'Performance Alert',
      message: 'Multiple red flags triggered for Cedar Point',
      severity: 'critical',
      timestamp: '12 min ago',
      status: 'acknowledged'
    },
    {
      id: 3,
      client: 'Urban Living Management',
      type: 'System Notice',
      message: 'Monthly report generation completed',
      severity: 'info',
      timestamp: '1 hour ago',
      status: 'resolved'
    }
  ];

  const topClients = [
    { name: 'Premier Property Group', properties: 12, revenue: '$2,400', status: 'active', plan: 'Enterprise' },
    { name: 'Sunset Realty Partners', properties: 8, revenue: '$1,600', status: 'active', plan: 'Professional' },
    { name: 'Urban Living Management', properties: 15, revenue: '$3,000', status: 'active', plan: 'Enterprise' },
    { name: 'Metro Housing Solutions', properties: 6, revenue: '$1,200', status: 'trial', plan: 'Professional' },
    { name: 'Coastal Properties Inc', properties: 9, revenue: '$1,800', status: 'active', plan: 'Professional' }
  ];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">OPSIGHT Company Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Internal operations and client management</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{clientStats.totalClients}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center">
              <Badge className="bg-green-100 text-green-800 text-xs">
                +{clientStats.newThisMonth} this month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Clients</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{clientStats.activeClients}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">
                {((clientStats.activeClients / clientStats.totalClients) * 100).toFixed(1)}% active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{systemHealth.uptime}%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">
                {systemHealth.avgResponseTime}ms avg response
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">$47.2K</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">
                +12.3% vs last month
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Recent System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{alert.client}</span>
                      <Badge variant="outline" className="text-xs">{alert.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{alert.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{alert.timestamp}</span>
                      <Badge className={`text-xs ${alert.status === 'active' ? 'bg-red-100 text-red-800' : alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="ml-2">
                    View
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Top Clients</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{client.name}</span>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {client.properties} properties • {client.plan} plan
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{client.revenue}</div>
                  <div className="text-xs text-gray-500">monthly</div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Clients
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-600" />
            <span>System Health & Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{systemHealth.uptime}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: `${systemHealth.uptime}%`}}></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{systemHealth.avgResponseTime}ms</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</div>
              <div className="text-xs text-green-600 mt-1">
                <CheckCircle className="h-3 w-3 inline mr-1" />
                Excellent
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{systemHealth.activeConnections}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Connections</div>
              <div className="text-xs text-gray-500 mt-1">
                <Clock className="h-3 w-3 inline mr-1" />
                Real-time
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{systemHealth.dataProcessed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Data Processed</div>
              <div className="text-xs text-gray-500 mt-1">This month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDashboard;
