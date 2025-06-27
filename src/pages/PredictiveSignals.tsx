
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, Target, BarChart3, Activity } from 'lucide-react';

const PredictiveSignals = () => {
  const signals = [
    {
      id: 1,
      property: 'Sunset Gardens Apartments',
      signal: 'Occupancy Drop Risk',
      probability: 85,
      severity: 'High',
      timeframe: '30-60 days',
      indicators: ['Lease renewal rate declining', 'Market competition increasing', 'Maintenance requests rising'],
      trend: 'down'
    },
    {
      id: 2,
      property: 'Metro Plaza Complex',
      signal: 'Rent Growth Opportunity',
      probability: 78,
      severity: 'Medium',
      timeframe: '60-90 days',
      indicators: ['Market rents rising', 'Low vacancy rate', 'High demand area'],
      trend: 'up'
    },
    {
      id: 3,
      property: 'Riverside Towers',
      signal: 'Maintenance Cost Spike',
      probability: 92,
      severity: 'High',
      timeframe: '15-30 days',
      indicators: ['Aging HVAC systems', 'Increasing repair frequency', 'Tenant complaints rising'],
      trend: 'down'
    }
  ];

  const marketTrends = [
    { metric: 'Average Rent Growth', value: '3.2%', change: '+0.5%', trend: 'up' },
    { metric: 'Vacancy Rate', value: '4.8%', change: '-0.3%', trend: 'down' },
    { metric: 'Days to Lease', value: '28', change: '+2', trend: 'up' },
    { metric: 'Tenant Satisfaction', value: '4.2/5', change: '-0.1', trend: 'down' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Red Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Predictive Signals</h1>
              <p className="text-xl text-red-100 max-w-3xl">AI-powered insights to anticipate portfolio performance and potential issues</p>
            </div>
            <Button className="bg-white text-red-600 hover:bg-red-50 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Configure Alerts
            </Button>
          </div>
        </div>

        {/* Market Trends Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {marketTrends.map((trend, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{trend.metric}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{trend.value}</span>
                  <div className={`flex items-center ${trend.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="text-sm ml-1">{trend.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Predictive Signals */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Predictive Signals</h2>
          {signals.map((signal) => (
            <Card key={signal.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{signal.property}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Target className="h-4 w-4 mr-1" />
                      {signal.signal}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={signal.severity === 'High' ? 'destructive' : 'secondary'}>
                      {signal.severity}
                    </Badge>
                    <div className={`flex items-center ${signal.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {signal.trend === 'up' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Probability</span>
                      <span>{signal.probability}%</span>
                    </div>
                    <Progress value={signal.probability} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Expected Timeframe</h4>
                      <p className="text-sm">{signal.timeframe}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Key Indicators</h4>
                      <ul className="text-sm space-y-1">
                        {signal.indicators.map((indicator, index) => (
                          <li key={index} className="flex items-center">
                            <AlertTriangle className="h-3 w-3 text-yellow-500 mr-2" />
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Create Action Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictiveSignals;
