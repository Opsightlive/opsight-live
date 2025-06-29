
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard = () => {
  const portfolioStats = {
    totalProperties: 4,
    totalUnits: 172,
    occupancyRate: 94.2,
    monthlyRevenue: 163000,
    netOperatingIncome: 127500,
    averageRent: 1850
  };

  const recentAlerts = [
    {
      id: 1,
      property: 'Sunset Gardens',
      type: 'Maintenance',
      message: 'HVAC system requires inspection',
      severity: 'medium',
      time: '2 hours ago'
    },
    {
      id: 2,
      property: 'Metro Plaza',
      type: 'Financial',
      message: 'Rent collection below target',
      severity: 'high',
      time: '4 hours ago'
    },
    {
      id: 3,
      property: 'Riverside Commons',
      type: 'Occupancy',
      message: 'New lease signed - Unit 304',
      severity: 'low',
      time: '1 day ago'
    }
  ];

  const upcomingTasks = [
    { task: 'Monthly financial report due', date: 'Tomorrow', priority: 'high' },
    { task: 'Property inspection - Metro Plaza', date: 'Dec 30', priority: 'medium' },
    { task: 'Lease renewal discussion', date: 'Jan 2', priority: 'medium' },
    { task: 'Budget planning meeting', date: 'Jan 5', priority: 'low' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your properties today.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Last updated: Just now
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{portfolioStats.totalProperties}</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {portfolioStats.totalUnits} total units
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                ${portfolioStats.monthlyRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Occupancy Rate</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{portfolioStats.occupancyRate}%</div>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Above market average
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-600">NOI</CardTitle>
              <TrendingUp className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-900">
                ${portfolioStats.netOperatingIncome.toLocaleString()}
              </div>
              <p className="text-xs text-indigo-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5% YoY growth
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Recent Alerts
                </CardTitle>
                <CardDescription>
                  Important notifications requiring your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {alert.severity === 'high' ? (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          ) : alert.severity === 'medium' ? (
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{alert.property}</p>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(alert.severity)} variant="outline">
                          {alert.type}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Tasks */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>
                  Your schedule for the next week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{task.task}</p>
                        <p className="text-xs text-gray-500">{task.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' : 
                          task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                        }`}></div>
                        <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts to help you manage your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <Building2 className="h-6 w-6" />
                <span className="text-sm">Add Property</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Financial Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Tenant Portal</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
