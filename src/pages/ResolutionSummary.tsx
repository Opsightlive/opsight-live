
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, TrendingUp, TrendingDown, Target, FileText, Calendar } from 'lucide-react';

const ResolutionSummary = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const resolutionStats = {
    totalResolved: 47,
    averageTime: 2.8,
    resolutionRate: 89,
    costSavings: 125000
  };

  const resolutionsByCategory = [
    { category: 'Maintenance', resolved: 18, pending: 3, avgTime: 2.1, trend: 'up' },
    { category: 'Tenant Relations', resolved: 12, pending: 2, avgTime: 3.5, trend: 'down' },
    { category: 'Financial', resolved: 8, pending: 1, avgTime: 4.2, trend: 'up' },
    { category: 'Occupancy', resolved: 6, pending: 2, avgTime: 1.8, trend: 'up' },
    { category: 'Operations', resolved: 3, pending: 0, avgTime: 2.0, trend: 'stable' }
  ];

  const recentResolutions = [
    {
      id: 1,
      property: 'Sunset Gardens Apartments',
      issue: 'HVAC System Failure',
      resolvedDate: '2024-01-14',
      resolutionTime: '1.5 days',
      cost: '$8,500',
      impact: 'Prevented 15% tenant turnover',
      method: 'Emergency contractor replacement'
    },
    {
      id: 2,
      property: 'Metro Plaza Complex',
      issue: 'High Vacancy Rate',
      resolvedDate: '2024-01-12',
      resolutionTime: '21 days',
      cost: '$12,000',
      impact: 'Increased occupancy to 94%',
      method: 'Marketing campaign + rent incentives'
    },
    {
      id: 3,
      property: 'Riverside Towers',
      issue: 'Water Damage Claims',
      resolvedDate: '2024-01-10',
      resolutionTime: '5 days',
      cost: '$25,000',
      impact: 'Avoided insurance premium increase',
      method: 'Pipe replacement + unit renovation'
    }
  ];

  const topResolutionMethods = [
    { method: 'Preventive Maintenance', usage: 34, effectiveness: 92 },
    { method: 'Tenant Communication', usage: 28, effectiveness: 85 },
    { method: 'Vendor Negotiation', usage: 21, effectiveness: 78 },
    { method: 'Process Optimization', usage: 17, effectiveness: 89 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resolution Summary</h1>
          <p className="text-gray-600 mt-2">Track and analyze how issues are being resolved across your portfolio</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Issues Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">{resolutionStats.totalResolved}</span>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{resolutionStats.averageTime}</span>
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500">Days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{resolutionStats.resolutionRate}%</span>
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <Progress value={resolutionStats.resolutionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cost Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">${resolutionStats.costSavings.toLocaleString()}</span>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-500">Through resolution</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="recent">Recent Resolutions</TabsTrigger>
          <TabsTrigger value="methods">Resolution Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolution Performance by Category</CardTitle>
              <CardDescription>Breakdown of resolution metrics across different issue types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resolutionsByCategory.map((category, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{category.category}</h3>
                        <Badge variant="outline">{category.resolved} resolved</Badge>
                        {category.pending > 0 && (
                          <Badge variant="secondary">{category.pending} pending</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {category.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                        {category.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                        <span className="text-sm text-gray-600">{category.avgTime} days avg</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(category.resolved / (category.resolved + category.pending)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="space-y-4">
            {recentResolutions.map((resolution) => (
              <Card key={resolution.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{resolution.issue}</CardTitle>
                      <CardDescription>{resolution.property}</CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {resolution.resolvedDate}
                      </Badge>
                      <p className="text-sm text-gray-600">Resolved in {resolution.resolutionTime}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Resolution Method</h4>
                      <p className="text-sm">{resolution.method}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Cost</h4>
                      <p className="text-sm font-bold">{resolution.cost}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Impact</h4>
                      <p className="text-sm text-green-600">{resolution.impact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Effective Resolution Methods</CardTitle>
              <CardDescription>Analysis of resolution approaches and their success rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topResolutionMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{method.method}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Usage Frequency</span>
                          <span>{method.usage}%</span>
                        </div>
                        <Progress value={method.usage} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Effectiveness</span>
                          <span>{method.effectiveness}%</span>
                        </div>
                        <Progress value={method.effectiveness} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResolutionSummary;
