
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, DollarSign, TrendingUp, Users, AlertTriangle, CheckCircle, Clock, Plus } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useNavigate } from 'react-router-dom';

const RealDashboard = () => {
  const { dashboardData, isLoading, hasRealData, currentProperty } = useDashboardData();
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
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
            <p className="text-gray-600 mt-2">Connect your property management system to see live data</p>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Demo Mode
          </Badge>
        </div>

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

        {/* Benefits Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Real-Time Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 text-sm">
                Automatic synchronization of occupancy rates, rent rolls, and collection data from OneSite.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Live KPI Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 text-sm">
                Monitor key performance indicators across your entire portfolio in real-time.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Intelligent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 text-sm">
                Get notified when metrics change or require your attention.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Real-time data from your connected property management systems
            {currentProperty && ` - Currently viewing: ${currentProperty.name}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Live Data</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalProperties}</div>
            <p className="text-xs text-muted-foreground">Connected properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dashboardData.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From OneSite sync</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.occupancyRate > 90 ? 'Above target' : 'Below target'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NOI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(dashboardData.noi).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Net Operating Income</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
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
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
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
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-gray-600">All systems operating normally</p>
                <p className="text-sm text-gray-500 mt-2">
                  Your {currentProperty?.name || 'property'} is performing well
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Data Sync Status
            </CardTitle>
            <CardDescription>Integration health and sync information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">OneSite Integration</p>
                    <p className="text-xs text-gray-500">
                      {currentProperty?.name ? `Syncing ${currentProperty.name}` : 'Active'}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-1">Latest KPIs</div>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>• Occupancy: {dashboardData.occupancyRate.toFixed(1)}%</div>
                  <div>• Revenue: ${dashboardData.monthlyRevenue.toLocaleString()}</div>
                  <div>• NOI: ${Math.round(dashboardData.noi).toLocaleString()}</div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/data-integration')}
              >
                Manage Integrations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealDashboard;
