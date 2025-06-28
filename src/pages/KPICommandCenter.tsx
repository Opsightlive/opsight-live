
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, BarChart3, Activity, Zap, RefreshCw, Database } from 'lucide-react';
import { useRealtimeKPIs } from '@/hooks/useRealtimeKPIs';
import { useAuth } from '@/contexts/AuthContext';
import { kpiService } from '@/services/kpiService';
import KPIMetricsGrid from '@/components/kpi/KPIMetricsGrid';
import KPIChartsSection from '@/components/kpi/KPIChartsSection';
import PropertyComparisonTable from '@/components/kpi/PropertyComparisonTable';
import KPILoadingState from '@/components/kpi/KPILoadingState';
import KPIErrorState from '@/components/kpi/KPIErrorState';
import KPINoDataState from '@/components/kpi/KPINoDataState';

const KPICommandCenter = () => {
  const { user } = useAuth();
  const { metrics, events, loading, error, syncDataSources } = useRealtimeKPIs();
  const [selectedTimeRange, setSelectedTimeRange] = useState('12m');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Transform real-time metrics to display format
  const transformedMetrics = metrics
    .filter(metric => selectedCategory === 'all' || metric.category === selectedCategory)
    .map(metric => ({
      name: metric.metric_name,
      value: formatMetricValue(metric.metric_value, metric.metric_unit),
      change: formatChangeValue(metric.change_percentage),
      trend: (metric.change_percentage || 0) >= 0 ? 'up' as const : 'down' as const,
      target: metric.target_value || 100,
      current: metric.metric_value,
      zone: metric.performance_zone as 'green' | 'yellow' | 'red'
    }));

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncDataSources();
    setRefreshing(false);
  };

  const handleManualSync = async () => {
    if (!user) return;
    
    try {
      await kpiService.syncDataSources(user.id);
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  if (loading) return <KPILoadingState />;
  if (error) return <KPIErrorState error={error} onRetry={handleRefresh} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">KPI Command Center</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Real-time performance monitoring powered by live data integration
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  <span>Live Metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Real-time Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <span>Event Streaming</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <span>Data Integration</span>
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
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleManualSync}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Database className="h-4 w-4 mr-2" />
                Sync Data
              </Button>
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Data Feed Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Last Update:</span>
                  <span className="text-sm font-mono">
                    {metrics.length > 0 ? new Date(metrics[0].created_at).toLocaleTimeString() : 'No data'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
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
                <Badge variant="outline" className="text-sm">
                  {transformedMetrics.length} Live Metrics
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        {events.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent KPI Events</CardTitle>
              <CardDescription>Real-time alerts and metric changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {events.slice(0, 10).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        event.alert_level === 'critical' ? 'bg-red-500' :
                        event.alert_level === 'high' ? 'bg-orange-500' :
                        event.alert_level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="font-medium">{event.metric_name}</span>
                      <span className="text-sm text-gray-600">{event.event_type.replace('_', ' ')}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono">
                        {event.old_value} → {event.new_value}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* KPI Metrics Grid */}
        <KPIMetricsGrid metrics={transformedMetrics} />

        {/* Charts and Analytics */}
        <KPIChartsSection 
          timeRange={selectedTimeRange}
          category={selectedCategory}
          realTimeData={metrics}
        />

        {/* Property Comparison */}
        <PropertyComparisonTable />

        {/* No Data State */}
        {transformedMetrics.length === 0 && (
          <KPINoDataState 
            category={selectedCategory}
            onReset={() => setSelectedCategory('all')}
          />
        )}
      </div>
    </div>
  );
};

// Helper functions
function formatMetricValue(value: number, unit?: string): string {
  if (unit === '$') {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (unit === '%') {
    return `${value.toFixed(1)}%`;
  } else if (unit === 'days') {
    return Math.round(value).toString();
  }
  return value.toLocaleString();
}

function formatChangeValue(changePercentage?: number): string {
  if (!changePercentage) return '+0%';
  const sign = changePercentage >= 0 ? '+' : '';
  return `${sign}${changePercentage.toFixed(1)}%`;
}

export default KPICommandCenter;
