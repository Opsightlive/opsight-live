
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Brain, MessageSquare, FileText, TrendingUp, Zap, AlertCircle, CheckCircle, Settings, Activity, BarChart3, Target } from 'lucide-react';

const AIIntelligence = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const aiTools = [
    {
      id: 'document-analysis',
      title: 'Smart Document Analysis',
      description: 'AI-powered analysis of lease agreements, financial reports, and property documents with 96% accuracy',
      icon: FileText,
      status: 'active',
      accuracy: 96,
      lastUpdated: '2 hours ago',
      processingSpeed: '2.3 sec/doc'
    },
    {
      id: 'predictive-analytics',
      title: 'Predictive Market Intelligence',
      description: 'Forecast market trends and property performance using advanced machine learning algorithms',
      icon: TrendingUp,
      status: 'active',
      accuracy: 89,
      lastUpdated: '1 hour ago',
      processingSpeed: '15 sec/analysis'
    },
    {
      id: 'risk-assessment',
      title: 'Automated Risk Assessment',
      description: 'Real-time evaluation of portfolio risks and opportunities with comprehensive scoring',
      icon: AlertCircle,
      status: 'active',
      accuracy: 93,
      lastUpdated: '30 min ago',
      processingSpeed: '5 sec/property'
    },
    {
      id: 'tenant-screening',
      title: 'Intelligent Tenant Screening',
      description: 'AI-enhanced tenant evaluation and risk scoring with behavioral pattern analysis',
      icon: Brain,
      status: 'beta',
      accuracy: 91,
      lastUpdated: '3 hours ago',
      processingSpeed: '8 sec/applicant'
    }
  ];

  const recentInsights = [
    {
      id: 1,
      title: 'Market Opportunity Detected',
      description: 'AI identified 3 properties in downtown area with rent increase potential of 8-12%',
      priority: 'high',
      confidence: 87,
      impact: '$45K annual revenue increase',
      timeframe: 'Next 30 days'
    },
    {
      id: 2,
      title: 'Maintenance Cost Optimization',
      description: 'Predictive model suggests preventive maintenance could reduce costs by 15%',
      priority: 'medium',
      confidence: 92,
      impact: '$23K cost savings',
      timeframe: 'Next 60 days'
    },
    {
      id: 3,
      title: 'Lease Renewal Strategy',
      description: 'AI recommends targeted retention offers for 12 high-value tenants',
      priority: 'medium',
      confidence: 78,
      impact: '$67K retention value',
      timeframe: 'Next 45 days'
    }
  ];

  const aiMetrics = [
    { label: 'Documents Processed', value: '2,847', change: '+12%' },
    { label: 'Predictions Made', value: '1,234', change: '+8%' },
    { label: 'Insights Generated', value: '456', change: '+15%' },
    { label: 'Average Accuracy', value: '92.5%', change: '+2.1%' }
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">AI Intelligence Center</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Advanced AI-powered analytics and insights for smarter property management decisions
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <span>4 AI Tools Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  <span>92.5% Avg Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>456 Insights Generated</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <span>Real-time Processing</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                <Settings className="h-4 w-4 mr-2" />
                Configure AI
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* AI Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {aiMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-green-600">{metric.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tools">AI Tools</TabsTrigger>
            <TabsTrigger value="insights">Latest Insights</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiTools.map((tool) => (
                <Card key={tool.id} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <tool.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tool.title}</CardTitle>
                          <Badge variant={tool.status === 'active' ? 'default' : 'secondary'}>
                            {tool.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Accuracy</div>
                        <div className="font-bold text-green-600">{tool.accuracy}%</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{tool.description}</CardDescription>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Performance:</span>
                        <span>{tool.accuracy}%</span>
                      </div>
                      <Progress value={tool.accuracy} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Speed:</span>
                          <div className="font-medium">{tool.processingSpeed}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Updated:</span>
                          <div className="font-medium">{tool.lastUpdated}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Zap className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        {selectedTool === tool.id ? 'Hide' : 'Details'}
                      </Button>
                    </div>
                    
                    {selectedTool === tool.id && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Tool Details</h4>
                        <div className="text-sm space-y-1">
                          <p><strong>Status:</strong> {tool.status === 'active' ? 'Active and processing' : 'Beta testing'}</p>
                          <p><strong>Last Analysis:</strong> {tool.lastUpdated}</p>
                          <p><strong>Processing Speed:</strong> {tool.processingSpeed}</p>
                          <p><strong>Accuracy Rate:</strong> {tool.accuracy}% over last 30 days</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-4">
              {recentInsights.map((insight) => (
                <Card key={insight.id} className={`border-l-4 ${getPriorityColor(insight.priority)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{insight.title}</h3>
                          <Badge variant={getPriorityBadge(insight.priority) as any}>
                            {insight.priority} priority
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{insight.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Confidence:</span>
                            <div className="font-medium">{insight.confidence}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Impact:</span>
                            <div className="font-medium text-green-600">{insight.impact}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Timeframe:</span>
                            <div className="font-medium">{insight.timeframe}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Target className="h-4 w-4 mr-2" />
                          Act Now
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Tool Performance</CardTitle>
                  <CardDescription>Accuracy rates over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiTools.map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <tool.icon className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{tool.title}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Progress value={tool.accuracy} className="w-20 h-2" />
                          <span className="text-sm font-medium">{tool.accuracy}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Processing Statistics</CardTitle>
                  <CardDescription>Real-time AI processing metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Documents Analyzed Today:</span>
                      <span className="font-medium">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Predictions Generated:</span>
                      <span className="font-medium">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insights Created:</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Processing Time:</span>
                      <span className="font-medium">4.2 sec</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Uptime:</span>
                      <span className="font-medium text-green-600">99.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AIIntelligence;
