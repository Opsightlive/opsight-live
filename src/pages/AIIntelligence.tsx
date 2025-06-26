
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Brain, TrendingUp, AlertTriangle, FileText, Search, Zap } from 'lucide-react';

const AIIntelligence = () => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [analysisType, setAnalysisType] = useState('');
  const [query, setQuery] = useState('');

  const properties = [
    { value: 'greenview', label: 'Greenview Apartments' },
    { value: 'oakwood', label: 'Oakwood Commons' },
    { value: 'cedar', label: 'Cedar Ridge Complex' }
  ];

  const analysisTypes = [
    { value: 'performance', label: 'Performance Analysis' },
    { value: 'risk', label: 'Risk Assessment' },
    { value: 'predictive', label: 'Predictive Modeling' },
    { value: 'market', label: 'Market Comparison' }
  ];

  const aiInsights = [
    {
      type: 'Risk Alert',
      icon: AlertTriangle,
      color: 'text-red-600',
      title: 'High Delinquency Pattern Detected',
      description: 'Units 201-205 show consistent late payments. Recommend immediate intervention.',
      confidence: 94
    },
    {
      type: 'Opportunity',
      icon: TrendingUp,
      color: 'text-green-600',
      title: 'Rent Optimization Potential',
      description: '12% below market rate. Projected $2,400/month additional revenue.',
      confidence: 87
    },
    {
      type: 'Prediction',
      icon: Brain,
      color: 'text-blue-600',
      title: 'Maintenance Cost Forecast',
      description: 'HVAC systems likely to need replacement in Q3. Budget $45K.',
      confidence: 78
    }
  ];

  const quickActions = [
    { label: 'Generate Risk Report', icon: FileText },
    { label: 'Market Analysis', icon: TrendingUp },
    { label: 'Predictive Dashboard', icon: Brain },
    { label: 'Query Builder', icon: Search }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Bot className="h-8 w-8 text-blue-600 mr-3" />
            AI Intelligence Tools
          </h1>
          <p className="text-gray-600">Advanced AI-powered analytics and insights for your property portfolio.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Query Interface */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-6 w-6 text-blue-600 mr-2" />
                  AI Analysis Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Property</Label>
                    <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Property" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map((property) => (
                          <SelectItem key={property.value} value={property.value}>
                            {property.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Analysis Type</Label>
                    <Select value={analysisType} onValueChange={setAnalysisType}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Analysis" />
                      </SelectTrigger>
                      <SelectContent>
                        {analysisTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">AI Query</Label>
                  <Input
                    placeholder="Ask AI anything about your properties... (e.g., What are the top risks for Q3?)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-12"
                  />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                  <Zap className="h-5 w-5 mr-2" />
                  Analyze with AI
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Latest AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <insight.icon className={`h-6 w-6 ${insight.color} mt-1`} />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-500">{insight.type}</span>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {insight.confidence}% confidence
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                            <p className="text-gray-600 text-sm">{insight.description}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button key={index} variant="outline" className="w-full justify-start h-12">
                    <action.icon className="h-5 w-5 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* AI Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>AI Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Prediction Accuracy</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Risk Detection Rate</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-medium">1.2s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIntelligence;
