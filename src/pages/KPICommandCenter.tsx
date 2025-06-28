
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, BarChart3, Activity, Zap, Refresh } from 'lucide-react';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useAuth } from '@/contexts/AuthContext';
import KPIMetricsGrid from '@/components/kpi/KPIMetricsGrid';
import KPIChartsSection from '@/components/kpi/KPIChartsSection';
import PropertyComparisonTable from '@/components/kpi/PropertyComparisonTable';
import KPILoadingState from '@/components/kpi/KPILoadingState';
import KPIErrorState from '@/components/kpi/KPIErrorState';
import KPINoDataState from '@/components/kpi/KPINoDataState';

const KPICommandCenter = () => {
  const { user } = useAuth();
  const { kpiUpdates, isLoading } = useRealtimeData();
  const [selectedTimeRange, setSelectedTimeRange] = useState('12m');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Simulate comprehensive KPI data with caching
  const kpiData = useMemo(() => {
    const baseMetrics = {
      leasing: [
        { name: 'Occupancy Rate', value: '94.2%', change: '+2.1%', trend: 'up', target: 95, current: 94.2, zone: 'green' },
        { name: 'Average Days to Lease', value: '18', change: '-3', trend: 'up', target: 15, current: 18, zone: 'yellow' },
        { name: 'Lease Renewal Rate', value: '87%', change: '+4%', trend: 'up', target: 85, current: 87, zone: 'green' },
        { name: 'New Leases MTD', value: '42', change: '+8', trend: 'up', target: 40, current: 42, zone: 'green' }
      ],
      revenue: [
        { name: 'Gross Revenue', value: '$2.4M', change: '+8.5%', trend: 'up', target: 2.3, current: 2.4, zone: 'green' },
        { name: 'Revenue per Unit', value: '$1,850', change: '+3.2%', trend: 'up', target: 1800, current: 1850, zone: 'green' },
        { name: 'Collection Rate', value: '96.8%', change: '+1.1%', trend: 'up', target: 95, current: 96.8, zone: 'green' },
        { name: 'Late Fees Collected', value: '$28K', change: '-5%', trend: 'down', target: 30, current: 28, zone: 'yellow' }
      ],
      staffing: [
        { name: 'Staff Utilization', value: '89%', change: '+2%', trend: 'up', target: 85, current: 89, zone: 'green' },
        { name: 'Turnover Rate', value: '12%', change: '-3%', trend: 'up', target: 15, current: 12, zone: 'green' },
        { name: 'Training Hours', value: '124', change: '+15', trend: 'up', target: 120, current: 124, zone: 'green' },
        { name: 'Response Time', value: '4.2h', change: '-0.8h', trend: 'up', target: 4, current: 4.2, zone: 'yellow' }
      ],
      financials: [
        { name: 'NOI Margin', value: '64.3%', change: '+1.8%', trend: 'up', target: 60, current: 64.3, zone: 'green' },
        { name: 'Operating Expenses', value: '$890K', change: '-2.1%', trend: 'up', target: 900, current: 890, zone: 'green' },
        { name: 'Cap Ex Spending', value: '$156K', change: '+12%', trend: 'down', target: 150, current: 156, zone: 'yellow' },
        { name: 'Cash Flow', value: '$1.55M', change: '+6.8%', trend: 'up', target: 1.4, current: 1.55, zone: 'green' }
      ],
      risk: [
        { name: 'Risk Score', value: '2.3', change: '-0.5', trend: 'up', target: 3, current: 2.3, zone: 'green' },
        { name: 'Open Work Orders', value: '23', change: '+5', trend: 'down', target: 20, current: 23, zone: 'yellow' },
        { name: 'Insurance Claims', value: '1', change: '-2', trend: 'up', target: 3, current: 1, zone: 'green' },
        { name: 'Compliance Score', value: '94%', change: '+2%', trend: 'up', target: 90, current: 94, zone: 'green' }
      ]
    };

    return selectedCategory === 'all' 
      ? Object.values(baseMetrics).flat()
      : baseMetrics[selectedCategory as keyof typeof baseMetrics] || [];
  }, [selectedCategory]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  if (isLoading) return <KPILoadingState />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">KPI Command Center</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Real-time performance monitoring across all business metrics
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
            <div className="flex items-center gap-4">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="12m">12 Months</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Refresh className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">Filter by Category:</span>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="leasing">Leasing</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="staffing">Staffing</SelectItem>
                    <SelectItem value="financials">Financials</SelectItem>
                    <SelectItem value="risk">Risk Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="outline" className="text-sm">
                {kpiData.length} Metrics Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* KPI Metrics Grid */}
        <KPIMetricsGrid metrics={kpiData} />

        {/* Charts and Analytics */}
        <KPIChartsSection 
          timeRange={selectedTimeRange}
          category={selectedCategory}
        />

        {/* Property Comparison */}
        <PropertyComparisonTable />

        {/* No Data State */}
        {kpiData.length === 0 && (
          <KPINoDataState 
            category={selectedCategory}
            onReset={() => setSelectedCategory('all')}
          />
        )}
      </div>
    </div>
  );
};

export default KPICommandCenter;
