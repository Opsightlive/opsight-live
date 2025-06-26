
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, MessageSquare, FileText, TrendingUp, Zap, AlertCircle, CheckCircle } from 'lucide-react';

const AIIntelligence = () => {
  const aiTools = [
    {
      title: 'Smart Document Analysis',
      description: 'AI-powered analysis of lease agreements, financial reports, and property documents',
      icon: FileText,
      status: 'active',
      accuracy: '96%'
    },
    {
      title: 'Predictive Market Intelligence',
      description: 'Forecast market trends and property performance using machine learning',
      icon: TrendingUp,
      status: 'active',
      accuracy: '89%'
    },
    {
      title: 'Automated Risk Assessment',
      description: 'Real-time evaluation of portfolio risks and opportunities',
      icon: AlertCircle,
      status: 'active',
      accuracy: '93%'
    },
    {
      title: 'Intelligent Tenant Screening',
      description: 'AI-enhanced tenant evaluation and risk scoring',
      icon: Brain,
      status: 'beta',
      accuracy: '91%'
    }
  ];

  const insights = [
    {
      title: 'Market Opportunity Detected',
      description: 'AI identified 3 properties in your area with rent increase potential of 8-12%',
      priority: 'high',
      confidence: 87
    },
    {
      title: 'Maintenance Cost Optimization',
      description: 'Predictive model suggests preventive maintenance could reduce costs by 15%',
      priority: 'medium',
      confidence: 92
    },
    {
      title: 'Lease Renewal Strategy',
      description: 'AI recommends targeted retention offers for 12 high-value tenants',
      priority: 'medium',
      confidence: 78
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-2">AI Intelligence Tools</h1>
          <p className="text-blue-100">
            Advanced AI-powered analytics and insights for smarter property management decisions
          </p>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {aiTools.map((tool, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
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
                    <div className="font-bold text-green-600">{tool.accuracy}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{tool.description}</CardDescription>
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Configure Tool
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Latest AI Insights
            </CardTitle>
            <CardDescription>
              Recent discoveries and recommendations from our AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    insight.priority === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {insight.priority === 'high' ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'}>
                        {insight.priority} priority
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AIIntelligence;
