
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Home, Wrench, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ExtractedKPI {
  id: string;
  kpi_type: string;
  kpi_name: string;
  kpi_value: number;
  kpi_unit: string;
  property_name: string;
  extraction_confidence: number;
  created_at: string;
}

const KPIDashboard = () => {
  const { user } = useAuth();
  const [kpis, setKPIs] = useState<ExtractedKPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadKPIs();
    }
  }, [user]);

  const loadKPIs = async () => {
    try {
      const { data, error } = await supabase
        .from('extracted_kpis')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setKPIs(data || []);
    } catch (error) {
      console.error('Error loading KPIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getKPIsByType = (type: string) => {
    return kpis.filter(kpi => kpi.kpi_type === type);
  };

  const getKPIIcon = (type: string) => {
    switch (type) {
      case 'financial':
        return <DollarSign className="h-5 w-5" />;
      case 'leasing':
        return <Home className="h-5 w-5" />;
      case 'collections':
        return <TrendingUp className="h-5 w-5" />;
      case 'staffing':
        return <Users className="h-5 w-5" />;
      case 'operations':
        return <Wrench className="h-5 w-5" />;
      default:
        return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getKPISummary = (type: string) => {
    const typeKPIs = getKPIsByType(type);
    const avgConfidence = typeKPIs.length > 0 
      ? typeKPIs.reduce((sum, kpi) => sum + (kpi.extraction_confidence || 0), 0) / typeKPIs.length
      : 0;

    return {
      count: typeKPIs.length,
      avgConfidence: Math.round(avgConfidence * 100),
      latest: typeKPIs[0]?.created_at ? new Date(typeKPIs[0].created_at).toLocaleDateString() : 'N/A'
    };
  };

  const prepareChartData = (type: string) => {
    const typeKPIs = getKPIsByType(type);
    const grouped = typeKPIs.reduce((acc, kpi) => {
      const date = new Date(kpi.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(kpi);
      return acc;
    }, {} as Record<string, ExtractedKPI[]>);

    return Object.entries(grouped).map(([date, kpis]) => ({
      date,
      count: kpis.length,
      avgConfidence: Math.round(kpis.reduce((sum, kpi) => sum + (kpi.extraction_confidence || 0), 0) / kpis.length * 100)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const kpiTypes = ['financial', 'leasing', 'collections', 'staffing', 'operations'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpiTypes.map((type) => {
          const summary = getKPISummary(type);
          return (
            <Card key={type}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getKPIIcon(type)}
                    <h3 className="font-semibold capitalize">{type}</h3>
                  </div>
                  <Badge variant="secondary">{summary.count}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Avg Confidence</span>
                    <span className={getConfidenceColor(summary.avgConfidence / 100)}>
                      {summary.avgConfidence}%
                    </span>
                  </div>
                  <Progress value={summary.avgConfidence} className="h-2" />
                  <div className="text-xs text-gray-500">
                    Latest: {summary.latest}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          {kpiTypes.map((type) => (
            <TabsTrigger key={type} value={type} className="capitalize">
              {type}
            </TabsTrigger>
          ))}
        </TabsList>

        {kpiTypes.map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getKPIIcon(type)}
                    {type.charAt(0).toUpperCase() + type.slice(1)} KPIs Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={prepareChartData(type)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="KPI Count"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent {type.charAt(0).toUpperCase() + type.slice(1)} KPIs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {getKPIsByType(type).slice(0, 10).map((kpi) => (
                      <div key={kpi.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{kpi.kpi_name}</h4>
                          <Badge 
                            variant="outline" 
                            className={getConfidenceColor(kpi.extraction_confidence || 0)}
                          >
                            {Math.round((kpi.extraction_confidence || 0) * 100)}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Value:</span>
                            <span className="ml-1 font-medium">
                              {kpi.kpi_value?.toLocaleString()} {kpi.kpi_unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Property:</span>
                            <span className="ml-1">{kpi.property_name || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(kpi.created_at).toLocaleDateString()} at{' '}
                          {new Date(kpi.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default KPIDashboard;
