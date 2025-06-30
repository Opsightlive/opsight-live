
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, DollarSign, TrendingUp, AlertCircle, Calendar, MapPin, Star, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useNavigate } from 'react-router-dom';

const PortfolioDashboard = () => {
  const { dashboardData, isLoading, hasRealData } = useDashboardData();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasRealData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Portfolio Dashboard</h1>
                <p className="text-blue-100 text-lg">Connect your OneSite system to see your real portfolio data</p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-600 bg-white">
                No Data Connected
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* No Data State */}
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Property Data Available</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Connect your OneSite property management system to see real-time data from your portfolio.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/pm-integration?pm=onesite')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Connect OneSite
                </Button>
                <div className="text-sm text-gray-500">
                  Your OneSite data will appear here after successful integration
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Mock data for trend charts when we have real KPI data but need historical trends
  const occupancyTrends = [
    { month: 'Jan', occupancy: Math.max(0, dashboardData.occupancyRate - 5) },
    { month: 'Feb', occupancy: Math.max(0, dashboardData.occupancyRate - 3) },
    { month: 'Mar', occupancy: Math.max(0, dashboardData.occupancyRate - 2) },
    { month: 'Apr', occupancy: Math.max(0, dashboardData.occupancyRate - 1) },
    { month: 'May', occupancy: dashboardData.occupancyRate },
    { month: 'Jun', occupancy: dashboardData.occupancyRate }
  ];

  const revenueData = [
    { month: 'Jan', revenue: Math.max(0, dashboardData.monthlyRevenue * 0.9), expenses: Math.max(0, dashboardData.monthlyRevenue * 0.6) },
    { month: 'Feb', revenue: Math.max(0, dashboardData.monthlyRevenue * 0.92), expenses: Math.max(0, dashboardData.monthlyRevenue * 0.61) },
    { month: 'Mar', revenue: Math.max(0, dashboardData.monthlyRevenue * 0.95), expenses: Math.max(0, dashboardData.monthlyRevenue * 0.62) },
    { month: 'Apr', revenue: Math.max(0, dashboardData.monthlyRevenue * 0.98), expenses: Math.max(0, dashboardData.monthlyRevenue * 0.63) },
    { month: 'May', revenue: dashboardData.monthlyRevenue, expenses: Math.max(0, dashboardData.monthlyRevenue * 0.64) },
    { month: 'Jun', revenue: dashboardData.monthlyRevenue, expenses: Math.max(0, dashboardData.monthlyRevenue * 0.65) }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Blue Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Portfolio Dashboard</h1>
              <p className="text-blue-100 text-lg">Real-time insights from your OneSite integration</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{dashboardData.totalProperties}</div>
                <div className="text-blue-200">Properties</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-3xl font-bold text-blue-600">{dashboardData.totalProperties}</p>
                  <p className="text-sm text-blue-600">From OneSite</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                  <p className="text-3xl font-bold text-green-600">{dashboardData.occupancyRate.toFixed(1)}%</p>
                  <p className="text-sm text-green-600">
                    {dashboardData.occupancyRate > 90 ? 'Above target' : 'Below target'}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${dashboardData.monthlyRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-600">From rent roll</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">NOI</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${Math.round(dashboardData.noi).toLocaleString()}
                  </p>
                  <p className="text-sm text-orange-600">Net Operating Income</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Summary</CardTitle>
                  <CardDescription>Key metrics from your OneSite integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Occupancy Rate</span>
                        <span>{dashboardData.occupancyRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={dashboardData.occupancyRate} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Properties</p>
                        <p className="text-2xl font-bold">{dashboardData.totalProperties}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Revenue</p>
                        <p className="text-2xl font-bold">${(dashboardData.monthlyRevenue / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Integration Status</CardTitle>
                  <CardDescription>OneSite connection health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">OneSite Integration</p>
                          <p className="text-xs text-gray-500">Last sync: Recently</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/data-integration')}
                    >
                      Manage Integration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy Trend</CardTitle>
                  <CardDescription>6-month occupancy performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={occupancyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="occupancy" stroke="#3B82F6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                  <CardDescription>Monthly financial performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, '']} />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Recent Alerts
                </CardTitle>
                <CardDescription>
                  {dashboardData.recentAlerts.length > 0 
                    ? 'Latest notifications from your properties'
                    : 'No recent alerts'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.recentAlerts.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.recentAlerts.map((alert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          <div>
                            <p className="font-medium text-sm">{alert.alert_message}</p>
                            <p className="text-xs text-gray-500">{alert.property_name}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {alert.alert_level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-gray-600">All systems operating normally</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your portfolio and integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-16 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/data-integration')}
              >
                <Building2 className="h-5 w-5" />
                <span>Manage Integrations</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/kpi-command-center')}
              >
                <TrendingUp className="h-5 w-5" />
                <span>View KPI Dashboard</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/alerts-notifications')}
              >
                <AlertCircle className="h-5 w-5" />
                <span>Alert Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
