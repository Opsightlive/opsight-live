
import React, { useState, useEffect } from 'react';
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
  Zap,
  Plus
} from 'lucide-react';
import { useOwnerInsights } from '@/hooks/useOwnerInsights';
import DashboardTutorial from '../dashboard/DashboardTutorial';
import { useNavigate } from 'react-router-dom';
import { useAdaptiveLayoutContext } from '@/contexts/AdaptiveLayoutContext';
import ResponsiveContainer from '../layout/ResponsiveContainer';
import AdaptiveGrid from '../layout/AdaptiveGrid';
import AdaptiveCard from '../ui/adaptive-card';

const OwnerDashboard = () => {
  const { insights, isLoading } = useOwnerInsights();
  const [showTutorial, setShowTutorial] = useState(false);
  const navigate = useNavigate();
  const { screenInfo, layoutSettings } = useAdaptiveLayoutContext();

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const handleAddProperty = () => {
    navigate('/owner-onboarding');
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
    <ResponsiveContainer className="space-y-6 relative">
      {/* Tutorial Component */}
      {showTutorial && (
        <DashboardTutorial onClose={() => setShowTutorial(false)} />
      )}

      {/* Header with Tutorial Button and Add Property */}
      <div className={`flex ${screenInfo.isMobile ? 'flex-col space-y-4' : 'items-center justify-between'}`} data-tutorial="sidebar">
        <div>
          <h1 className={`font-bold text-gray-900 ${screenInfo.isMobile ? 'text-2xl' : 'text-3xl'}`}>
            Portfolio Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your multifamily properties.
          </p>
        </div>
        <div className={`flex items-center ${screenInfo.isMobile ? 'justify-between' : 'gap-3'}`}>
          <Button onClick={handleAddProperty} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
          <Button onClick={startTutorial} variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Take Tour
          </Button>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      <div data-tutorial="portfolio-overview">
        <AdaptiveGrid minItemWidth={250} gap="md">
          <AdaptiveCard className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Portfolio Value</p>
                <p className={`font-bold text-blue-900 ${screenInfo.isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  ${(portfolioMetrics.totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <Building2 className={`text-blue-600 ${screenInfo.isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
            </div>
          </AdaptiveCard>

          <AdaptiveCard className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Monthly NOI</p>
                <p className={`font-bold text-green-900 ${screenInfo.isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  ${portfolioMetrics.monthlyNOI.toLocaleString()}
                </p>
              </div>
              <TrendingUp className={`text-green-600 ${screenInfo.isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
            </div>
          </AdaptiveCard>

          <AdaptiveCard className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Properties</p>
                <p className={`font-bold text-purple-900 ${screenInfo.isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  {portfolioMetrics.totalProperties}
                </p>
                <p className="text-sm text-purple-600">{portfolioMetrics.totalUnits} units</p>
              </div>
              <Building2 className={`text-purple-600 ${screenInfo.isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
            </div>
          </AdaptiveCard>

          <AdaptiveCard className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Occupancy Rate</p>
                <p className={`font-bold text-orange-900 ${screenInfo.isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  {portfolioMetrics.occupancyRate}%
                </p>
              </div>
              <Users className={`text-orange-600 ${screenInfo.isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
            </div>
          </AdaptiveCard>
        </AdaptiveGrid>
      </div>

      {/* KPI Cards */}
      <div data-tutorial="kpi-cards">
        <AdaptiveGrid minItemWidth={300} gap="md">
          <AdaptiveCard 
            title="Cash Flow"
            headerContent={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="text-2xl font-bold text-green-600">
              +${portfolioMetrics.cashFlow.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              +12.5% from last month
            </p>
          </AdaptiveCard>

          <AdaptiveCard 
            title="Maintenance Costs"
            headerContent={<Wrench className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="text-2xl font-bold text-red-600">
              ${portfolioMetrics.maintenanceCosts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDownRight className="h-3 w-3 mr-1 text-red-600" />
              +8.2% from last month
            </p>
          </AdaptiveCard>

          <AdaptiveCard 
            title="Average Rent"
            headerContent={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="text-2xl font-bold">$1,850</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              +3.2% from last month
            </p>
          </AdaptiveCard>
        </AdaptiveGrid>
      </div>

      <AdaptiveGrid minItemWidth={400} gap="lg">
        {/* Red Flag Alerts */}
        <AdaptiveCard 
          data-tutorial="red-flags"
          title="Red Flag Alerts"
          headerContent={
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              <Badge variant="destructive">
                {redFlags.length}
              </Badge>
            </div>
          }
        >
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
        </AdaptiveCard>

        {/* Recent Activity */}
        <AdaptiveCard 
          data-tutorial="recent-activity"
          title="Recent Activity"
          headerContent={<MessageSquare className="h-5 w-5 mr-2 text-blue-600" />}
        >
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
        </AdaptiveCard>
      </AdaptiveGrid>

      {/* AI Insights */}
      <AdaptiveCard 
        data-tutorial="ai-insights"
        title="AI-Powered Owner Insights"
        headerContent={<Zap className="h-5 w-5 mr-2 text-purple-600" />}
      >
        <AdaptiveGrid minItemWidth={280} gap="md">
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
        </AdaptiveGrid>
      </AdaptiveCard>
    </ResponsiveContainer>
  );
};

export default OwnerDashboard;
