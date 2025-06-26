import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, MessageSquare } from 'lucide-react';

const PMEngagementScore = () => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');

  const properties = [
    { value: 'greenview', label: 'Greenview Apartments' },
    { value: 'oakwood', label: 'Oakwood Commons' },
    { value: 'cedar', label: 'Cedar Ridge Complex' }
  ];

  const timeframes = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'ytd', label: 'Year to Date' }
  ];

  const pmPerformance = [
    {
      name: 'Sarah Johnson',
      property: 'Greenview Apartments',
      score: 92,
      trend: 'up',
      responseTime: '2.3 hrs',
      completionRate: 94,
      tenantSatisfaction: 4.7,
      status: 'excellent'
    },
    {
      name: 'Mike Chen',
      property: 'Oakwood Commons',
      score: 78,
      trend: 'down',
      responseTime: '4.1 hrs',
      completionRate: 87,
      tenantSatisfaction: 4.2,
      status: 'good'
    },
    {
      name: 'Lisa Rodriguez',
      property: 'Cedar Ridge Complex',
      score: 85,
      trend: 'up',
      responseTime: '3.2 hrs',
      completionRate: 91,
      tenantSatisfaction: 4.5,
      status: 'good'
    }
  ];

  const engagementMetrics = [
    { label: 'Response Time', value: '3.2 hrs', target: '<4 hrs', status: 'good' },
    { label: 'Work Order Completion', value: '91%', target: '>90%', status: 'excellent' },
    { label: 'Tenant Communication', value: '4.5/5', target: '>4.0', status: 'excellent' },
    { label: 'Proactive Actions', value: '78%', target: '>75%', status: 'good' },
    { label: 'Documentation Quality', value: '82%', target: '>80%', status: 'good' },
    { label: 'Follow-up Rate', value: '67%', target: '>70%', status: 'warning' }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            Property Management Engagement Score
          </h1>
          <p className="text-gray-600">Monitor and improve property manager performance across all properties.</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Property</label>
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Properties</SelectItem>
                    {properties.map((property) => (
                      <SelectItem key={property.value} value={property.value}>
                        {property.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Timeframe</label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map((timeframe) => (
                      <SelectItem key={timeframe.value} value={timeframe.value}>
                        {timeframe.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* PM Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Property Manager Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pmPerformance.map((pm, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{pm.name}</h3>
                          <p className="text-gray-600 text-sm">{pm.property}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(pm.score)}`}>
                            {pm.score}
                            {pm.trend === 'up' ? (
                              <TrendingUp className="inline h-5 w-5 ml-1" />
                            ) : (
                              <TrendingDown className="inline h-5 w-5 ml-1" />
                            )}
                          </div>
                          <Badge className={getStatusColor(pm.status)}>
                            {pm.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Response Time</span>
                          <p className="font-medium">{pm.responseTime}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Completion Rate</span>
                          <p className="font-medium">{pm.completionRate}%</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Tenant Rating</span>
                          <p className="font-medium">{pm.tenantSatisfaction}/5.0</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Progress value={pm.score} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {engagementMetrics.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <Badge className={getStatusColor(metric.status)}>
                          {metric.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">{metric.value}</span>
                        <span className="text-sm text-gray-500">Target: {metric.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Average</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">85</div>
                <p className="text-gray-600 mb-4">Engagement Score</p>
                <Progress value={85} className="h-3 mb-4" />
                <div className="flex items-center justify-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+3% from last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card>
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Follow-up Rate Below Target</p>
                    <p className="text-xs text-gray-600">Mike Chen needs improvement</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Excellent Performance</p>
                    <p className="text-xs text-gray-600">Sarah Johnson exceeded targets</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Quarterly Review Due</p>
                    <p className="text-xs text-gray-600">Schedule performance reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Feedback
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Training Plan
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Team Meeting
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMEngagementScore;
