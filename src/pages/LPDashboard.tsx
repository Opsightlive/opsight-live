import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Users, Building2, FileText, PieChart, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const LPDashboard = () => {
  const portfolioMetrics = [
    { name: 'Total Investment', value: '$12.5M', change: '+$2.1M', trend: 'up' },
    { name: 'Current Value', value: '$18.7M', change: '+$1.8M', trend: 'up' },
    { name: 'Total Return', value: '49.6%', change: '+4.2%', trend: 'up' },
    { name: 'Annual IRR', value: '18.3%', change: '+1.1%', trend: 'up' }
  ];

  const quarterlyReturns = [
    { quarter: 'Q1 2023', returns: 4.2, distributions: 125000 },
    { quarter: 'Q2 2023', returns: 5.1, distributions: 142000 },
    { quarter: 'Q3 2023', returns: 3.8, distributions: 138000 },
    { quarter: 'Q4 2023', returns: 6.2, distributions: 165000 },
    { quarter: 'Q1 2024', returns: 4.9, distributions: 158000 },
    { quarter: 'Q2 2024', returns: 5.7, distributions: 172000 }
  ];

  const investmentAllocation = [
    { name: 'Multifamily', value: 65, amount: 8125000, color: '#3B82F6' },
    { name: 'Mixed Use', value: 20, amount: 2500000, color: '#10B981' },
    { name: 'Retail', value: 10, amount: 1250000, color: '#F59E0B' },
    { name: 'Office', value: 5, amount: 625000, color: '#EF4444' }
  ];

  const propertyPerformance = [
    { property: 'Sunset Gardens', investment: 2500000, currentValue: 3200000, irr: 22.1, status: 'Performing' },
    { property: 'Metro Plaza', investment: 3200000, currentValue: 4100000, irr: 19.8, status: 'Performing' },
    { property: 'Riverside Towers', investment: 1800000, currentValue: 2300000, irr: 16.5, status: 'Performing' },
    { property: 'Oak Street Commons', investment: 2800000, currentValue: 3600000, irr: 20.3, status: 'Performing' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Limited Partner Dashboard</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Comprehensive investor portal with performance analytics and reporting
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  <span>Investment Performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>Quarterly Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Portfolio Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>ROI Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Summary Cards */}
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
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Returns & Distributions</CardTitle>
              <CardDescription>Performance over the last 6 quarters</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quarterlyReturns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="returns" fill="#3B82F6" name="Returns %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investment Allocation</CardTitle>
              <CardDescription>Portfolio distribution by asset type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={investmentAllocation}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {investmentAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Property Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Property Performance Summary</CardTitle>
            <CardDescription>Individual investment performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {propertyPerformance.map((property, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{property.property}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <div>
                        <span className="text-sm text-gray-600">Investment: </span>
                        <span className="font-medium">${property.investment.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Current Value: </span>
                        <span className="font-medium">${property.currentValue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">IRR: </span>
                        <span className="font-medium">{property.irr}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">
                      {property.status}
                    </Badge>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribution History */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution History</CardTitle>
            <CardDescription>Quarterly cash distributions received</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={quarterlyReturns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="distributions" stroke="#10B981" strokeWidth={2} name="Distributions ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Download Reports</h3>
                  <p className="text-sm text-gray-600">Get quarterly investor reports</p>
                </div>
                <Button>Download</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Tax Documents</h3>
                  <p className="text-sm text-gray-600">Access K-1s and tax forms</p>
                </div>
                <Button variant="outline">Access</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Contact Sponsor</h3>
                  <p className="text-sm text-gray-600">Reach out to the investment team</p>
                </div>
                <Button variant="outline">Contact</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LPDashboard;
