
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { KPIMetric } from '@/hooks/useRealtimeKPIs';

interface KPIChartsSectionProps {
  timeRange: string;
  category: string;
  realTimeData?: KPIMetric[];
}

interface TrendDataPoint {
  month: string;
  occupancy: number;
  revenue: number;
  noi: number;
  expenses: number;
  riskScore: number;
  forecast?: boolean;
}

const KPIChartsSection = ({ timeRange, category, realTimeData = [] }: KPIChartsSectionProps) => {
  // Generate trend data from real-time metrics or use mock data
  const trendData = useMemo(() => {
    if (realTimeData.length > 0) {
      // Group metrics by month and create trend data
      const monthlyData: Record<string, Partial<TrendDataPoint> & { month: string; count: number }> = realTimeData.reduce((acc, metric) => {
        const month = new Date(metric.created_at).toLocaleDateString('en-US', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { month, count: 0 };
        }
        
        // Map metric names to chart properties
        switch (metric.metric_name) {
          case 'Occupancy Rate':
            acc[month].occupancy = metric.metric_value;
            break;
          case 'Gross Revenue':
            acc[month].revenue = metric.metric_value;
            break;
          case 'NOI Margin':
            acc[month].noi = metric.metric_value;
            break;
          case 'Operating Expenses':
            acc[month].expenses = metric.metric_value;
            break;
          case 'Risk Score':
            acc[month].riskScore = metric.metric_value;
            break;
        }
        acc[month].count++;
        return acc;
      }, {} as Record<string, Partial<TrendDataPoint> & { month: string; count: number }>);

      // Convert to proper TrendDataPoint array with defaults
      return Object.values(monthlyData).map(item => ({
        month: item.month,
        occupancy: item.occupancy || 0,
        revenue: item.revenue || 0,
        noi: item.noi || 0,
        expenses: item.expenses || 0,
        riskScore: item.riskScore || 0
      } as TrendDataPoint)).slice(0, 12);
    }

    // Fallback to mock data if no real data available
    const months = timeRange === '12m' ? 12 : timeRange === '6m' ? 6 : timeRange === '3m' ? 3 : 1;
    return Array.from({ length: months }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      occupancy: 90 + Math.random() * 8,
      revenue: 2000000 + Math.random() * 500000,
      noi: 1200000 + Math.random() * 300000,
      expenses: 800000 + Math.random() * 200000,
      riskScore: 1 + Math.random() * 3
    }));
  }, [timeRange, realTimeData]);

  const forecastData = useMemo(() => {
    const futureMonths = 6;
    return Array.from({ length: futureMonths }, (_, i) => ({
      month: new Date(2024, 12 + i, 1).toLocaleDateString('en-US', { month: 'short' }),
      occupancy: 92 + Math.random() * 6,
      revenue: 2200000 + Math.random() * 400000,
      noi: 0,
      expenses: 0,
      riskScore: 0,
      forecast: true
    }));
  }, []);

  const combinedData: TrendDataPoint[] = [...trendData, ...forecastData];

  // Performance distribution from real data
  const pieData = useMemo(() => {
    if (realTimeData.length === 0) {
      return [
        { name: 'Green Zone', value: 65, color: '#10B981' },
        { name: 'Yellow Zone', value: 25, color: '#F59E0B' },
        { name: 'Red Zone', value: 10, color: '#EF4444' }
      ];
    }

    const zoneCounts = realTimeData.reduce((acc: any, metric) => {
      acc[metric.performance_zone] = (acc[metric.performance_zone] || 0) + 1;
      return acc;
    }, {});

    const total = realTimeData.length;
    return [
      { name: 'Green Zone', value: Math.round((zoneCounts.green || 0) / total * 100), color: '#10B981' },
      { name: 'Yellow Zone', value: Math.round((zoneCounts.yellow || 0) / total * 100), color: '#F59E0B' },
      { name: 'Red Zone', value: Math.round((zoneCounts.red || 0) / total * 100), color: '#EF4444' }
    ];
  }, [realTimeData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends & Forecasts</CardTitle>
          <CardDescription>
            {realTimeData.length > 0 ? 'Live data with projections' : 'Historical data with 6-month projections'}
          </CardDescription>
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
                strokeDasharray="5 5"
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
          <CardDescription>
            {realTimeData.length > 0 ? `Current status of ${realTimeData.length} metrics` : 'KPI performance across all categories'}
          </CardDescription>
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
