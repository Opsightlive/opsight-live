
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Target,
  Zap,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { useRealtimeKPIs } from '@/hooks/useRealtimeKPIs';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';

const KPICommandCenter = () => {
  const { user } = useAuth();
  const { kpiData, isLoading, error, refreshData } = useRealtimeKPIs();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d');

  const getPerformanceColor = (zone: string) => {
    switch (zone) {
      case 'green': return 'text-green-600 bg-green-50 border-green-200';
      case 'yellow': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'red': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPerformanceIcon = (zone: string) => {
    switch (zone) {
      case 'green': return <TrendingUp className="h-4 w-4" />;
      case 'yellow': return <Target className="h-4 w-4" />;
      case 'red': return <TrendingDown className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const filteredKPIs = kpiData.filter(kpi => {
    if (selectedCategory === 'all') return true;
    return kpi.category === selectedCategory;
  });

  const categories = [...new Set(kpiData.map(kpi => kpi.category))];

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
              <p className="text-gray-600">Please log in to view your KPI data.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4">KPI Command Center</h1>
                <p className="text-xl text-blue-100 max-w-3xl">
                  Real-time performance metrics and key performance indicators from your integrated property management systems.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshData()}
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Filters:</span>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                </div>
                <Badge variant="outline" className="text-sm">
                  {filteredKPIs.length} KPIs
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* KPI Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading KPI data...</p>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => refreshData()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : filteredKPIs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No KPI Data Available</h3>
                <p className="text-gray-600 mb-4">
                  Connect your property management system to start tracking KPIs.
                </p>
                <Button onClick={() => window.location.href = '/data-integration'}>
                  <Zap className="h-4 w-4 mr-2" />
                  Set Up Integration
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredKPIs.map((kpi) => (
                <Card key={kpi.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-700">
                        {kpi.metric_name}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPerformanceColor(kpi.performance_zone)}`}
                      >
                        {getPerformanceIcon(kpi.performance_zone)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          {typeof kpi.metric_value === 'number' 
                            ? kpi.metric_value.toLocaleString() 
                            : kpi.metric_value}
                        </span>
                        <span className="text-sm text-gray-500">
                          {kpi.metric_unit}
                        </span>
                      </div>
                      
                      {kpi.target_value && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Target:</span>
                          <span className="font-medium">
                            {kpi.target_value.toLocaleString()} {kpi.metric_unit}
                          </span>
                        </div>
                      )}
                      
                      {kpi.change_percentage && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Change:</span>
                          <span className={`font-medium flex items-center ${
                            kpi.change_percentage > 0 
                              ? 'text-green-600' 
                              : kpi.change_percentage < 0 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                          }`}>
                            {kpi.change_percentage > 0 && <TrendingUp className="h-3 w-3 mr-1" />}
                            {kpi.change_percentage < 0 && <TrendingDown className="h-3 w-3 mr-1" />}
                            {Math.abs(kpi.change_percentage).toFixed(1)}%
                          </span>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Category: {kpi.category}</span>
                          <span>
                            {new Date(kpi.period_start).toLocaleDateString()} - 
                            {new Date(kpi.period_end).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default KPICommandCenter;
