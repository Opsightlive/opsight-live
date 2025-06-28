
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

interface KPIChartsSectionProps {
  timeRange: string;
  category: string;
}

const KPIChartsSection = ({ timeRange, category }: KPIChartsSectionProps) => {
  // Generate sample trend data based on time range
  const trendData = useMemo(() => {
    const months = timeRange === '12m' ? 12 : timeRange === '6m' ? 6 : timeRange === '3m' ? 3 : 1;
    return Array.from({ length: months }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      occupancy: 90 + Math.random() * 8,
      revenue: 2000000 + Math.random() * 500000,
      noi: 1200000 + Math.random() * 300000,
      expenses: 800000 + Math.random() * 200000,
      riskScore: 1 + Math.random() * 3
    }));
  }, [timeRange]);

  const forecastData = useMemo(() => {
    const futureMonths = 6;
    return Array.from({ length: futureMonths }, (_, i) => ({
      month: new Date(2024, 12 + i, 1).toLocaleDateString('en-US', { month: 'short' }),
      occupancy: 92 + Math.random() * 6,
      revenue: 2200000 + Math.random() * 400000,
      forecast: true
    }));
  }, []);

  const combinedData = [...trendData, ...forecastData];

  const pieData = [
    { name: 'Leasing', value: 25, color: '#3B82F6' },
    { name: 'Revenue', value: 30, color: '#10B981' },
    { name: 'Staffing', value: 20, color: '#F59E0B' },
    { name: 'Financials', value: 15, color: '#EF4444' },
    { name: 'Risk', value: 10, color: '#8B5CF6' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends & Forecasts</CardTitle>
          <CardDescription>12-month historical data with 6-month projections</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toLocaleString() : value,
                  name
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="occupancy" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Occupancy Rate (%)"
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray={combinedData.some(d => d.forecast) ? "5 5" : ""}
                name="Revenue ($)"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Zones Distribution</CardTitle>
          <CardDescription>KPI performance across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses</CardTitle>
          <CardDescription>Monthly financial performance comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Score Trend</CardTitle>
          <CardDescription>Risk management performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="riskScore" 
                stroke="#EF4444" 
                fill="#FEE2E2"
                name="Risk Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIChartsSection;
