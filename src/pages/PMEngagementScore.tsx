
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, MessageSquare, Clock, Star, AlertTriangle, CheckCircle } from 'lucide-react';

const PMEngagementScore = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');

  // Sample data for PM engagement scores
  const pmScores = [
    {
      name: 'Sarah Johnson',
      property: 'Sunset Gardens',
      score: 92,
      trend: 'up',
      change: '+5',
      responseTime: '2.3 hrs',
      satisfaction: 4.8,
      issues: 3
    },
    {
      name: 'Mike Chen',
      property: 'Metro Plaza',
      score: 87,
      trend: 'up',
      change: '+2',
      responseTime: '3.1 hrs',
      satisfaction: 4.6,
      issues: 1
    },
    {
      name: 'Lisa Rodriguez',
      property: 'Riverside Towers',
      score: 78,
      trend: 'down',
      change: '-4',
      responseTime: '4.7 hrs',
      satisfaction: 4.2,
      issues: 8
    },
    {
      name: 'David Kim',
      property: 'Oak Street Commons',
      score: 85,
      trend: 'up',
      change: '+1',
      responseTime: '2.8 hrs',
      satisfaction: 4.5,
      issues: 2
    }
  ];

  const engagementTrends = [
    { month: 'Jul', score: 82 },
    { month: 'Aug', score: 85 },
    { month: 'Sep', score: 83 },
    { month: 'Oct', score: 87 },
    { month: 'Nov', score: 89 },
    { month: 'Dec', score: 86 }
  ];

  const scoreDistribution = [
    { range: '90-100', count: 12, color: '#10B981' },
    { range: '80-89', count: 18, color: '#3B82F6' },
    { range: '70-79', count: 8, color: '#F59E0B' },
    { range: '60-69', count: 3, color: '#EF4444' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { variant: 'default' as const, label: 'Excellent' };
    if (score >= 80) return { variant: 'secondary' as const, label: 'Good' };
    if (score >= 70) return { variant: 'outline' as const, label: 'Fair' };
    return { variant: 'destructive' as const, label: 'Needs Improvement' };
  };

  const overallMetrics = {
    averageScore: 86,
    totalPMs: 41,
    topPerformers: 12,
    needsAttention: 3
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-2">PM Engagement Score</h1>
          <p className="text-blue-100">
            Monitor and analyze property manager performance and tenant engagement metrics
          </p>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-blue-600">{overallMetrics.averageScore}</p>
                </div>
                <Star className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total PMs</p>
                  <p className="text-2xl font-bold">{overallMetrics.totalPMs}</p>
                </div>
                <Users className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Top Performers</p>
                  <p className="text-2xl font-bold text-green-600">{overallMetrics.topPerformers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Needs Attention</p>
                  <p className="text-2xl font-bold text-red-600">{overallMetrics.needsAttention}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="individual" className="space-y-6">
          <TabsList>
            <TabsTrigger value="individual">Individual Scores</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-4">
            {pmScores.map((pm, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{pm.name}</CardTitle>
                      <CardDescription>{pm.property}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(pm.score)}`}>
                          {pm.score}
                        </div>
                        <Badge {...getScoreBadge(pm.score)}>
                          {getScoreBadge(pm.score).label}
                        </Badge>
                      </div>
                      <div className={`flex items-center ${pm.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {pm.trend === 'up' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                        <span className="ml-1 font-medium">{pm.change}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Avg Response</p>
                        <p className="font-medium">{pm.responseTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Satisfaction</p>
                        <p className="font-medium">{pm.satisfaction}/5.0</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Open Issues</p>
                        <p className="font-medium">{pm.issues}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm">Send Feedback</Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Performance Score</span>
                      <span>{pm.score}/100</span>
                    </div>
                    <Progress value={pm.score} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Score Trends</CardTitle>
                <CardDescription>Average PM engagement scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[70, 95]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Distribution of PM engagement scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Categories</CardTitle>
                  <CardDescription>PM performance breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={scoreDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ range, count }) => `${range}: ${count}`}
                      >
                        {scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PMEngagementScore;
