
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, TrendingDown, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const PortfolioOverview = () => {
  const portfolioMetrics = [
    { name: 'Total Properties', value: '24', change: '+2', trend: 'up' },
    { name: 'Total Units', value: '1,847', change: '+45', trend: 'up' },
    { name: 'Avg Occupancy', value: '94.2%', change: '+1.5%', trend: 'up' },
    { name: 'Monthly Revenue', value: '$2.4M', change: '+$120K', trend: 'up' }
  ];

  const performanceData = [
    { property: 'Sunset Gardens', occupancy: 96, revenue: 285000, noi: 68 },
    { property: 'Metro Plaza', occupancy: 92, revenue: 320000, noi: 71 },
    { property: 'Riverside Towers', occupancy: 89, revenue: 195000, noi: 65 },
    { property: 'Oak Street Commons', occupancy: 97, revenue: 410000, noi: 74 }
  ];

  const monthlyTrends = [
    { month: 'Jul', revenue: 2200, expenses: 1400, noi: 800 },
    { month: 'Aug', revenue: 2350, expenses: 1450, noi: 900 },
    { month: 'Sep', revenue: 2280, expenses: 1420, noi: 860 },
    { month: 'Oct', revenue: 2400, expenses: 1480, noi: 920 },
    { month: 'Nov', revenue: 2450, expenses: 1500, noi: 950 },
    { month: 'Dec', revenue: 2500, expenses: 1520, noi: 980 }
  ];

  const assetAllocation = [
    { type: 'Multifamily', value: 65, color: '#3B82F6' },
    { type: 'Mixed Use', value: 20, color: '#10B981' },
    { type: 'Retail', value: 10, color: '#F59E0B' },
    { type: 'Office', value: 5, color: '#EF4444' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Portfolio Overview</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Complete portfolio performance summary with key metrics and property insights
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span>24 Properties</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>1,847 Units</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>94.2% Occupancy</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span>$2.4M Revenue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto py-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {portfolioMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <div className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        {metric.change}
                      </div>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & NOI Trends</CardTitle>
                <CardDescription>Monthly financial performance (in thousands)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} name="Revenue" />
                    <Line type="monotone" dataKey="noi" stroke="#10B981" strokeWidth={2} name="NOI" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Portfolio composition by property type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ type, value }) => `${type}: ${value}%`}
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Property Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Properties</CardTitle>
              <CardDescription>Key metrics for your best performing assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((property, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{property.property}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <div>
                          <span className="text-sm text-gray-600">Occupancy: </span>
                          <span className="font-medium">{property.occupancy}%</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Revenue: </span>
                          <span className="font-medium">${property.revenue.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">NOI Margin: </span>
                          <span className="font-medium">{property.noi}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={property.occupancy > 95 ? 'default' : property.occupancy > 90 ? 'secondary' : 'destructive'}>
                        {property.occupancy > 95 ? 'Excellent' : property.occupancy > 90 ? 'Good' : 'Needs Attention'}
                      </Badge>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Generate LP Report</h3>
                    <p className="text-sm text-gray-600">Create quarterly investor report</p>
                  </div>
                  <Button>Generate</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Portfolio Analysis</h3>
                    <p className="text-sm text-gray-600">Run comprehensive analysis</p>
                  </div>
                  <Button variant="outline">Analyze</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Market Comparison</h3>
                    <p className="text-sm text-gray-600">Compare to market benchmarks</p>
                  </div>
                  <Button variant="outline">Compare</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;
