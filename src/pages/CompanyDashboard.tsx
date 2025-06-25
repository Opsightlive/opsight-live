
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Users, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Clock, Activity, Settings, Target, PieChart, BarChart3, Crown } from 'lucide-react';

const CompanyDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // CEO/Founder Financial Metrics
  const financialMetrics = {
    monthlyRevenue: 47200,
    monthlyExpenses: 28500,
    netProfit: 18700,
    profitMargin: 39.6,
    yearlyProjection: 566400,
    cashFlow: 'positive'
  };

  // Business Growth & Direction
  const businessMetrics = {
    totalConsumers: 247,
    monthlyGrowthRate: 12.3,
    customerRetentionRate: 94.2,
    marketPenetration: 8.7,
    competitivePosition: 'Strong',
    industryRanking: 3
  };

  // Strategic Goals & Vision
  const strategicGoals = [
    { goal: 'Reach 500 active clients', progress: 49.4, target: 'Q4 2024' },
    { goal: '$100K monthly recurring revenue', progress: 47.2, target: 'Q1 2025' },
    { goal: 'Expand to 3 new markets', progress: 33.3, target: 'Q2 2025' },
    { goal: 'Launch enterprise tier', progress: 75, target: 'Q4 2024' }
  ];

  const recentAlerts = [
    {
      id: 1,
      client: 'Premier Property Group',
      type: 'Revenue Alert',
      message: 'Client upgraded to Enterprise plan (+$300/month)',
      severity: 'info',
      timestamp: '5 min ago',
      status: 'resolved'
    },
    {
      id: 2,
      client: 'Sunset Realty Partners',
      type: 'Churn Risk',
      message: 'Support tickets increased 300% this week',
      severity: 'high',
      timestamp: '12 min ago',
      status: 'active'
    },
    {
      id: 3,
      client: 'Metro Housing Solutions',
      type: 'Expansion Opportunity',
      message: 'Inquiring about multi-location package',
      severity: 'info',
      timestamp: '1 hour ago',
      status: 'pending'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8 text-yellow-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CEO Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">OPSIGHT Executive Overview & Strategic Insights</p>
            </div>
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
              Executive Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Financial Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(financialMetrics.netProfit)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">
                {financialMetrics.profitMargin}% margin
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(financialMetrics.monthlyRevenue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                {formatCurrency(financialMetrics.yearlyProjection)} projected yearly
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Expenses</p>
                <p className="text-3xl font-bold text-red-600">{formatCurrency(financialMetrics.monthlyExpenses)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-2">
              <Badge className={`text-xs ${financialMetrics.cashFlow === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Cash flow {financialMetrics.cashFlow}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Consumers</p>
                <p className="text-3xl font-bold text-purple-600">{businessMetrics.totalConsumers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-purple-100 text-purple-800 text-xs">
                +{businessMetrics.monthlyGrowthRate}% growth rate
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Strategic Goals & Vision */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Strategic Goals & Vision</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {strategicGoals.map((goal, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{goal.goal}</span>
                  <Badge variant="outline" className="text-xs">{goal.target}</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${goal.progress}%`}}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {goal.progress}% complete
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Business Intelligence & Market Position */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-green-600" />
              <span>Market Position & Intelligence</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">{businessMetrics.customerRetentionRate}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Customer Retention</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">#{businessMetrics.industryRanking}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Industry Ranking</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">{businessMetrics.marketPenetration}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Market Penetration</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">{businessMetrics.competitivePosition}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Competitive Position</div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Where We're Heading</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Positioned for aggressive expansion into enterprise markets with strong unit economics and proven product-market fit. 
                Focus on scaling operations while maintaining quality and customer satisfaction.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Business Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Business Intelligence Alerts</span>
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
                    <Badge className={`text-xs ${alert.status === 'active' ? 'bg-red-100 text-red-800' : alert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {alert.status}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="ml-2">
                  Review
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            View All Business Alerts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDashboard;
