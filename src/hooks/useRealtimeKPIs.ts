
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface KPIMetric {
  id: string;
  user_id: string;
  category: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  target_value?: number;
  performance_zone?: string;
  change_percentage?: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

export const useRealtimeKPIs = () => {
  const { user } = useAuth();
  const [kpiData, setKpiData] = useState<KPIMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKPIs = async () => {
    if (!user) {
      setKpiData([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('kpi_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching KPIs:', fetchError);
        setError('Failed to load KPI data');
        return;
      }

      setKpiData(data || []);
    } catch (err) {
      console.error('Error in fetchKPIs:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchKPIs();
  };

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    fetchKPIs();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('kpi_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kpi_metrics',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('KPI update received:', payload);
          fetchKPIs(); // Refresh data when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    kpiData,
    metrics: kpiData,
    events: [], // No events for now since we removed fake data
    isLoading,
    loading: isLoading,
    error,
    refreshData,
    syncDataSources: refreshData
  };
};
