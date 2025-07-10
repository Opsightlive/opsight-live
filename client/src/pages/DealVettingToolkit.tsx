import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FileText, Calculator, TrendingUp, AlertTriangle, CheckCircle, DollarSign, BarChart3, Target } from 'lucide-react';

const DealVettingToolkit = () => {
  const [propertyAddress, setPropertyAddress] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  const vettingCriteria = [
    {
      category: 'Financial Analysis',
      items: [
        { name: 'Cap Rate Analysis', status: 'complete', score: 8.5 },
        { name: 'Cash-on-Cash Return', status: 'complete', score: 7.2 },
        { name: 'IRR Calculation', status: 'pending', score: null },
        { name: 'Break-even Analysis', status: 'complete', score: 9.1 }
      ]
    },
    {
      category: 'Market Conditions',
      items: [
        { name: 'Comparable Sales', status: 'complete', score: 8.8 },
        { name: 'Rental Rate Analysis', status: 'complete', score: 7.9 },
        { name: 'Market Trends', status: 'complete', score: 8.3 },
        { name: 'Competition Analysis', status: 'warning', score: 6.2 }
      ]
    },
    {
      category: 'Property Assessment',
      items: [
        { name: 'Physical Inspection', status: 'complete', score: 8.7 },
        { name: 'Maintenance History', status: 'complete', score: 7.5 },
        { name: 'Capital Improvements', status: 'complete', score: 8.1 },
        { name: 'Environmental Check', status: 'pending', score: null }
      ]
    }
  ];

  const dealScorecard = {
    overall: 82,
    financial: 85,
    market: 78,
    property: 84,
    risk: 'Medium',
    recommendation: 'Proceed with Caution'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">Deal Vetting Toolkit</h1>
        <p className="text-blue-100">
          Comprehensive analysis tools for evaluating potential property investments
        </p>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analysis">Deal Analysis</TabsTrigger>
          <TabsTrigger value="calculator">Financial Calculator</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Address</label>
                  <Input
                    placeholder="Enter property address"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Purchase Price</label>
                  <Input
                    placeholder="$0"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                  />
                </div>
                <Button className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Start Analysis
                </Button>
              </CardContent>
            </Card>

            {/* Deal Scorecard */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Deal Scorecard
                  </span>
                  <Badge 
                    variant={dealScorecard.overall >= 80 ? 'default' : dealScorecard.overall >= 60 ? 'secondary' : 'destructive'}
                    className="text-lg px-3 py-1"
                  >
                    {dealScorecard.overall}/100
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Financial Score</span>
                      <span>{dealScorecard.financial}/100</span>
                    </div>
                    <Progress value={dealScorecard.financial} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Market Score</span>
                      <span>{dealScorecard.market}/100</span>
                    </div>
                    <Progress value={dealScorecard.market} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Property Score</span>
                      <span>{dealScorecard.property}/100</span>
                    </div>
                    <Progress value={dealScorecard.property} className="h-2" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Risk Level: <span className="text-yellow-600">{dealScorecard.risk}</span></p>
                    <p className="text-sm text-gray-600 mt-1">Recommendation: {dealScorecard.recommendation}</p>
                  </div>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vetting Criteria */}
          <div className="space-y-6">
            {vettingCriteria.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(item.status)}
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.score && (
                            <span className={`font-bold ${getScoreColor(item.score)}`}>
                              {item.score}/10
                            </span>
                          )}
                          <Button size="sm" variant="outline">
                            {item.status === 'pending' ? 'Start' : 'Review'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  ROI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Purchase Price</label>
                    <Input placeholder="$500,000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Down Payment</label>
                    <Input placeholder="$100,000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Rent</label>
                    <Input placeholder="$2,500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Expenses</label>
                    <Input placeholder="$800" />
                  </div>
                </div>
                <Button className="w-full">Calculate Returns</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Cap Rate</span>
                    <span className="font-bold text-green-600">6.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash-on-Cash Return</span>
                    <span className="font-bold text-green-600">12.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Cash Flow</span>
                    <span className="font-bold text-green-600">$1,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Cash Flow</span>
                    <span className="font-bold text-green-600">$14,400</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Download comprehensive deal analysis reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Comprehensive Deal Analysis</h4>
                    <p className="text-sm text-gray-600">Full financial and market analysis report</p>
                  </div>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Executive Summary</h4>
                    <p className="text-sm text-gray-600">Key metrics and recommendation summary</p>
                  </div>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DealVettingToolkit;
