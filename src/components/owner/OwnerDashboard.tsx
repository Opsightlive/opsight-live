
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Building2, DollarSign } from 'lucide-react';
import { useOwnerInsights } from '@/hooks/useOwnerInsights';

const OwnerDashboard = () => {
  const { insights, isLoading, refreshInsights } = useOwnerInsights();

  const portfolioMetrics = [
    {
      label: 'Portfolio NOI',
      value: '$2.4M',
      change: '+12.3%',
      trend: 'up' as const,
      benchmark: 'vs market: +12%'
    },
    {
      label: 'Avg Occupancy',
      value: '91.2%',
      change: '+2.1%',
      trend: 'up' as const,
      benchmark: 'vs market: +3%'
    },
    {
      label: 'PM Performance',
      value: '82/100',
      change: '-5.2%',
      trend: 'down' as const,
      benchmark: 'needs attention'
    },
    {
      label: 'Collection Rate',
      value: '96.8%',
      change: '+0.8%',
      trend: 'up' as const,
      benchmark: 'vs market: +2%'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance': return TrendingUp;
      case 'risk': return AlertTriangle;
      case 'opportunity': return Target;
      case 'benchmark': return Building2;
      default: return DollarSign;
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {portfolioMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <div className={`flex items-center space-x-1 text-sm ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>{metric.change}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{metric.benchmark}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Owner Insights */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            AI Owner Insights
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshInsights}
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Refresh'}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {insights.slice(0, 3).map((insight) => {
                const IconComponent = getInsightIcon(insight.type);
                return (
                  <div key={insight.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold">{insight.title}</h4>
                      </div>
                      <Badge className={`${getPriorityColor(insight.priority)} text-white`}>
                        {insight.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-2">{insight.insight}</p>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium text-blue-800">Impact: {insight.impact}</p>
                      <p className="text-sm text-blue-700">Recommendation: {insight.recommendation}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                      <span>Properties: {insight.properties.length}</span>
                      <span>{insight.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard;
