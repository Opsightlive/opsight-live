
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Wrench,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useOwnerInsights } from '@/hooks/useOwnerInsights';
import DashboardTutorial from '../dashboard/DashboardTutorial';

const OwnerDashboard = () => {
  const { insights, isLoading } = useOwnerInsights();
  const [showTutorial, setShowTutorial] = useState(false);

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const portfolioMetrics = {
    totalValue: 12500000,
    totalProperties: 8,
    totalUnits: 156,
    occupancyRate: 94.2,
    monthlyNOI: 89500,
    cashFlow: 67800,
    maintenanceCosts: 15200
  };

  const redFlags = [
    {
      id: 1,
      property: 'Sunset Gardens',
      issue: 'Occupancy dropped to 78%',
      severity: 'high',
      daysOpen: 5
    },
    {
      id: 2,
      property: 'Metro Plaza',
      issue: 'Maintenance costs up 40%',
      severity: 'medium',
      daysOpen: 12
    },
    {
      id: 3,
      property: 'Oak Ridge Apartments',
      issue: 'Late rent payments increasing',
      severity: 'medium',
      daysOpen: 3
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'lease',
      message: 'New lease signed at Riverside Commons - Unit 204',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 2,
      type: 'maintenance',
      message: 'HVAC repair completed at Metro Plaza - Unit 301',
      time: '4 hours ago',
      icon: Wrench,
      color: 'blue'
    },
    {
      id: 3,
      type: 'financial',
      message: 'Monthly rent roll updated for all properties',
      time: '1 day ago',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 4,
      type: 'alert',
      message: 'Vacancy alert: 3 units available at Sunset Gardens',
      time: '2 days ago',
      icon: AlertTriangle,
      color: 'orange'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portfolio data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative p-6">
      {/* Tutorial Component */}
      {showTutorial && (
        <DashboardTutorial onClose={() => setShowTutorial(false)} />
      )}

      {/* Header with Tutorial Button */}
      <div className="flex items-center justify-between" data-tutorial="sidebar">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your properties.</p>
        </div>
        <Button onClick={startTutorial} variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Take Tour
        </Button>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tutorial="portfolio-overview">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-blue-900">
                  ${(portfolioMetrics.totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Monthly NOI</p>
                <p className="text-3xl font-bold text-green-900">
                  ${portfolioMetrics.monthlyNOI.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Properties</p>
                <p className="text-3xl font-bold text-purple-900">
                  {portfolioMetrics.totalProperties}
                </p>
                <p className="text-sm text-purple-600">{portfolioMetrics.totalUnits} units</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Occupancy Rate</p>
                <p className="text-3xl font-bold text-orange-900">
                  {portfolioMetrics.occupancyRate}%
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-tutorial="kpi-cards">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +${portfolioMetrics.cashFlow.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Costs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${portfolioMetrics.maintenanceCosts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDownRight className="h-3 w-3 mr-1 text-red-600" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,850</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              +3.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Red Flag Alerts */}
        <Card data-tutorial="red-flags">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Red Flag Alerts
              <Badge variant="destructive" className="ml-2">
                {redFlags.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {redFlags.map((flag) => (
                <div key={flag.id} className="border-l-4 border-red-500 pl-4 hover:bg-gray-50 p-3 rounded cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{flag.property}</p>
                      <p className="text-sm text-gray-600">{flag.issue}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={flag.severity === 'high' ? 'destructive' : 'secondary'}>
                        {flag.severity}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {flag.daysOpen} days
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card data-tutorial="recent-activity">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className={`rounded-full p-2 bg-${activity.color}-100`}>
                      <IconComponent className={`h-4 w-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Activity Log
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card data-tutorial="ai-insights">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-purple-600" />
            AI-Powered Owner Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Market Opportunity</h4>
              <p className="text-sm text-blue-800">
                Based on local market trends, consider raising rents by 3-5% at Riverside Commons 
                to match market rates while maintaining competitive positioning.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Cost Optimization</h4>
              <p className="text-sm text-green-800">
                Preventive maintenance scheduling could reduce emergency repair costs by 25% 
                based on your portfolio's maintenance patterns.
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">Occupancy Forecast</h4>
              <p className="text-sm text-orange-800">
                Seasonal trends suggest potential 2-3% occupancy dip in Q1. Consider 
                early renewal incentives for existing tenants.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Investment Insight</h4>
              <p className="text-sm text-purple-800">
                Your portfolio's NOI growth rate of 8.5% exceeds market average. 
                Consider expanding in similar demographics and locations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard;
