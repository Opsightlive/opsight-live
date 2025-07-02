import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, BarChart3, Activity, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const KPICommandCenter = () => {
  const kpiMetrics = [
    { name: 'Occupancy Rate', value: '92.5%', change: '+0.8%', trend: 'up' },
    { name: 'Net Operating Income', value: '$1.25M', change: '+5.2%', trend: 'up' },
    { name: 'Expense Ratio', value: '45.7%', change: '-1.5%', trend: 'down' },
    { name: 'Tenant Satisfaction', value: '4.6/5', change: '+0.2', trend: 'up' }
  ];

  const propertyPerformance = [
    { property: 'Sunset Gardens', occupancy: 94, revenue: 285000, expenses: 150000, noi: 135000 },
    { property: 'Metro Plaza', occupancy: 91, revenue: 320000, expenses: 170000, noi: 150000 },
    { property: 'Riverside Towers', occupancy: 88, revenue: 195000, expenses: 110000, noi: 85000 },
    { property: 'Oak Street Commons', occupancy: 96, revenue: 410000, expenses: 220000, noi: 190000 }
  ];

  const expenseBreakdown = [
    { category: 'Maintenance', value: 320000, color: '#3B82F6' },
    { category: 'Utilities', value: 210000, color: '#10B981' },
    { category: 'Management Fees', value: 180000, color: '#F59E0B' },
    { category: 'Insurance', value: 90000, color: '#EF4444' }
  ];

  const monthlyCashFlow = [
    { month: 'Jul', revenue: 220000, expenses: 140000, cashFlow: 80000 },
    { month: 'Aug', revenue: 235000, expenses: 145000, cashFlow: 90000 },
    { month: 'Sep', revenue: 228000, expenses: 142000, cashFlow: 86000 },
    { month: 'Oct', revenue: 240000, expenses: 148000, cashFlow: 92000 },
    { month: 'Nov', revenue: 245000, expenses: 150000, cashFlow: 95000 },
    { month: 'Dec', revenue: 250000, expenses: 152000, cashFlow: 98000 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">KPI Command Center</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Real-time performance monitoring and key performance indicators dashboard
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  <span>Performance Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <span>Real-time Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span>Automated Alerts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpiMetrics.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <div className={`flex items-center text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      {kpi.change}
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Cash Flow</CardTitle>
              <CardDescription>Net cash flow trend over the last six months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyCashFlow}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cashFlow" stroke="#3B82F6" strokeWidth={2} name="Cash Flow" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Distribution of expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ category, value }) => `${category}: $${value.toLocaleString()}`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Property Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Property Performance Overview</CardTitle>
            <CardDescription>Key financial metrics for each property</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {propertyPerformance.map((property, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{property.property}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{property.occupancy}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">${property.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${property.expenses.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${property.noi.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Actionable Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Actionable Insights</CardTitle>
            <CardDescription>AI-driven recommendations for portfolio optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Optimize Rent Strategy</h3>
                <p className="text-sm text-gray-600">Increase revenue by adjusting rental rates based on market trends</p>
              </div>
              <Button variant="outline">Analyze</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Reduce Operating Expenses</h3>
                <p className="text-sm text-gray-600">Identify areas to cut costs and improve efficiency</p>
              </div>
              <Button variant="outline">Explore</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Improve Tenant Retention</h3>
                <p className="text-sm text-gray-600">Implement strategies to increase tenant satisfaction and reduce turnover</p>
              </div>
              <Button variant="outline">Implement</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KPICommandCenter;
