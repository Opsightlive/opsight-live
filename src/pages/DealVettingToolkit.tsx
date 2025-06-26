
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, Calculator, TrendingUp, MapPin } from 'lucide-react';

const DealVettingToolkit = () => {
  const [dealScore, setDealScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setDealScore(82);
      setIsAnalyzing(false);
    }, 2000);
  };

  const marketMetrics = [
    { label: 'Cap Rate', value: '5.8%', status: 'good', benchmark: '5.5%' },
    { label: 'Cash on Cash', value: '12.4%', status: 'excellent', benchmark: '10%' },
    { label: 'Debt Service Coverage', value: '1.35x', status: 'good', benchmark: '1.25x' },
    { label: 'Vacancy Rate', value: '4.2%', status: 'good', benchmark: '5%' }
  ];

  const riskFactors = [
    { factor: 'Market Saturation', level: 'Low', color: 'green' },
    { factor: 'Interest Rate Risk', level: 'Medium', color: 'yellow' },
    { factor: 'Tenant Credit Risk', level: 'Low', color: 'green' },
    { factor: 'Property Condition', level: 'Medium', color: 'yellow' },
    { factor: 'Location Score', level: 'High', color: 'red' }
  ];

  const comparableDeals = [
    { address: '123 Oak Street', price: '$2.8M', capRate: '5.5%', distance: '0.3 miles' },
    { address: '456 Maple Ave', price: '$3.1M', capRate: '5.9%', distance: '0.7 miles' },
    { address: '789 Pine Blvd', price: '$2.6M', capRate: '5.2%', distance: '1.2 miles' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deal Vetting Toolkit</h1>
          <p className="text-gray-600 mt-2">Comprehensive analysis for investment opportunities</p>
        </div>
        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-green-600 hover:bg-green-700">
          <Calculator className="h-4 w-4 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze Deal'}
        </Button>
      </div>

      <Tabs defaultValue="input" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input">Deal Input</TabsTrigger>
          <TabsTrigger value="analysis">Financial Analysis</TabsTrigger>
          <TabsTrigger value="market">Market Comps</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Enter the key details for deal analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Property Address</Label>
                  <Input id="address" placeholder="123 Main Street" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Purchase Price</Label>
                  <Input id="price" placeholder="$2,500,000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Number of Units</Label>
                  <Input id="units" placeholder="24" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sqft">Total Square Feet</Label>
                  <Input id="sqft" placeholder="18,500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent">Current Monthly Rent</Label>
                  <Input id="rent" placeholder="$36,000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenses">Monthly Expenses</Label>
                  <Input id="expenses" placeholder="$18,000" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {dealScore > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Deal Score
                  <Badge variant={dealScore >= 80 ? 'default' : dealScore >= 60 ? 'secondary' : 'destructive'}>
                    {dealScore >= 80 ? 'Excellent' : dealScore >= 60 ? 'Good' : 'Poor'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Overall Score</span>
                    <span className="font-bold">{dealScore}/100</span>
                  </div>
                  <Progress value={dealScore} className="h-3" />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <div className="flex items-center space-x-2">
                      {metric.status === 'excellent' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {metric.status === 'good' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                      {metric.status === 'poor' && <XCircle className="h-5 w-5 text-red-600" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Benchmark: {metric.benchmark}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparable Properties</CardTitle>
              <CardDescription>Recent sales within 2 miles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparableDeals.map((deal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{deal.address}</p>
                        <p className="text-sm text-gray-500">{deal.distance}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{deal.price}</p>
                      <p className="text-sm text-gray-500">Cap Rate: {deal.capRate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis</CardTitle>
              <CardDescription>Key risk factors for this investment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`h-5 w-5 ${
                        risk.color === 'green' ? 'text-green-500' : 
                        risk.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'
                      }`} />
                      <span className="font-medium">{risk.factor}</span>
                    </div>
                    <Badge variant={
                      risk.level === 'Low' ? 'default' : 
                      risk.level === 'Medium' ? 'secondary' : 'destructive'
                    }>
                      {risk.level} Risk
                    </Badge>
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

export default DealVettingToolkit;
