import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Banknote,
  CreditCard,
  PieChart,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

const CashFlowManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('12-months');

  const cashFlowData = {
    currentBalance: 245000,
    monthlyInflow: 125000,
    monthlyOutflow: 87500,
    netCashFlow: 37500,
    operatingExpenses: 62000,
    platformCosts: 25500,
    profitMargin: 34.2
  };

  const monthlyData = [
    { month: 'Jan', inflow: 95000, outflow: 65000, net: 30000 },
    { month: 'Feb', inflow: 108000, outflow: 72000, net: 36000 },
    { month: 'Mar', inflow: 115000, outflow: 78000, net: 37000 },
    { month: 'Apr', inflow: 120000, outflow: 82000, net: 38000 },
    { month: 'May', inflow: 118000, outflow: 85000, net: 33000 },
    { month: 'Jun', inflow: 125000, outflow: 87000, net: 38000 },
    { month: 'Jul', inflow: 132000, outflow: 89000, net: 43000 },
    { month: 'Aug', inflow: 128000, outflow: 91000, net: 37000 },
    { month: 'Sep', inflow: 135000, outflow: 88000, net: 47000 },
    { month: 'Oct', inflow: 142000, outflow: 92000, net: 50000 },
    { month: 'Nov', inflow: 138000, outflow: 95000, net: 43000 },
    { month: 'Dec', inflow: 145000, outflow: 98000, net: 47000 }
  ];

  const expenseBreakdown = [
    { name: 'Platform Costs', value: 25500, color: '#3B82F6' },
    { name: 'Staff Salaries', value: 35000, color: '#10B981' },
    { name: 'Operations', value: 15000, color: '#F59E0B' },
    { name: 'Marketing', value: 8000, color: '#EF4444' },
    { name: 'Other', value: 4000, color: '#8B5CF6' }
  ];

  const revenueStreams = [
    {
      name: 'Monthly Subscriptions',
      amount: 98500,
      growth: 12.5,
      percentage: 78.8
    },
    {
      name: 'Setup Fees',
      amount: 18000,
      growth: 8.3,
      percentage: 14.4
    },
    {
      name: 'Premium Features',
      amount: 8500,
      growth: 25.7,
      percentage: 6.8
    }
  ];

  return (
    <div className="space-y-6">
      {/* Cash Flow Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Current Balance</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${cashFlowData.currentBalance.toLocaleString()}
                </p>
              </div>
              <Banknote className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Monthly Inflow</p>
                <p className="text-2xl font-bold text-green-900">
                  ${cashFlowData.monthlyInflow.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12.5% vs last month
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Monthly Outflow</p>
                <p className="text-2xl font-bold text-red-900">
                  ${cashFlowData.monthlyOutflow.toLocaleString()}
                </p>
                <p className="text-sm text-red-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8.2% vs last month
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Net Cash Flow</p>
                <p className="text-2xl font-bold text-purple-900">
                  ${cashFlowData.netCashFlow.toLocaleString()}
                </p>
                <p className="text-sm text-purple-600">
                  {cashFlowData.profitMargin}% profit margin
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Trend */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Cash Flow Trend</CardTitle>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="12-months">12 Months</SelectItem>
                  <SelectItem value="24-months">24 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="inflow" stroke="#10B981" strokeWidth={2} name="Inflow" />
                <Line type="monotone" dataKey="outflow" stroke="#EF4444" strokeWidth={2} name="Outflow" />
                <Line type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={3} name="Net" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Streams */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Streams Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueStreams.map((stream, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full bg-${index === 0 ? 'blue' : index === 1 ? 'green' : 'purple'}-500`}></div>
                  <div>
                    <h4 className="font-semibold">{stream.name}</h4>
                    <p className="text-sm text-gray-500">{stream.percentage}% of total revenue</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">${stream.amount.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">+{stream.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Generate Financial Report
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Export Cash Flow Data
        </Button>
      </div>
    </div>
  );
};

export default CashFlowManagement;
