import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface KPIMetric {
  id: string;
  category: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  target_value?: number;
  previous_value?: number;
  change_percentage?: number;
  performance_zone: 'green' | 'yellow' | 'red';
  created_at: string;
}

export interface KPIEvent {
  id: string;
  event_type: string;
  category: string;
  metric_name: string;
  old_value?: number;
  new_value?: number;
  alert_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export const useRealtimeKPIs = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<KPIMetric[]>([]);
  const [events, setEvents] = useState<KPIEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial KPI data
  useEffect(() => {
    if (!user) return;

    const fetchKPIs = async () => {
      try {
        setLoading(true);
        
        // Get latest metrics for each category/metric_name combination
        const { data: kpiData, error: kpiError } = await supabase
          .from('kpi_metrics')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (kpiError) throw kpiError;

        // Group by category and metric_name, keeping only the latest
        const latestMetrics = kpiData.reduce((acc: any, metric: any) => {
          const key = `${metric.category}-${metric.metric_name}`;
          if (!acc[key] || new Date(metric.created_at) > new Date(acc[key].created_at)) {
            acc[key] = metric;
          }
          return acc;
        }, {});

        setMetrics(Object.values(latestMetrics));

        // Get recent events
        const { data: eventData, error: eventError } = await supabase
          .from('kpi_events')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (eventError) throw eventError;
        setEvents(eventData || []);

      } catch (err: any) {
        console.error('Error fetching KPIs:', err);
        setError(err.message);
        toast.error('Failed to load KPI data');
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    console.log('Setting up KPI real-time subscriptions...');

    // Subscribe to KPI metrics changes
    const metricsChannel = supabase
      .channel('kpi-metrics-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'kpi_metrics',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New KPI metric:', payload.new);
          const newMetric = payload.new as KPIMetric;
          
          setMetrics(prev => {
            const filtered = prev.filter(m => 
              !(m.category === newMetric.category && m.metric_name === newMetric.metric_name)
            );
            return [...filtered, newMetric].sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
          });

          toast.success(`${newMetric.metric_name} updated`, {
            description: `New value: ${newMetric.metric_value}${newMetric.metric_unit || ''}`
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'kpi_metrics',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Updated KPI metric:', payload.new);
          const updatedMetric = payload.new as KPIMetric;
          
          setMetrics(prev => 
            prev.map(m => 
              m.id === updatedMetric.id ? updatedMetric : m
            )
          );
        }
      )
      .subscribe();

    // Subscribe to KPI events
    const eventsChannel = supabase
      .channel('kpi-events-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'kpi_events',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New KPI event:', payload.new);
          const newEvent = payload.new as KPIEvent;
          
          setEvents(prev => [newEvent, ...prev.slice(0, 49)]);

          // Show alert for high priority events
          if (newEvent.alert_level === 'high' || newEvent.alert_level === 'critical') {
            toast.error(`${newEvent.metric_name} Alert`, {
              description: `${newEvent.event_type.replace('_', ' ')} - Check your KPI dashboard`
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up KPI subscriptions...');
      supabase.removeChannel(metricsChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [user]);

  // Function to manually trigger KPI update
  const updateKPI = async (kpiData: Partial<KPIMetric>) => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('kpi-processor', {
        body: {
          action: 'process_kpi_update',
          data: {
            user_id: user.id,
            ...kpiData
          }
        }
      });

      if (error) throw error;
      toast.success('KPI updated successfully');
    } catch (err: any) {
      console.error('Error updating KPI:', err);
      toast.error('Failed to update KPI');
    }
  };

  // Function to sync data sources
  const syncDataSources = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('data-integration', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      toast.success('Data sources synced successfully');
    } catch (err: any) {
      console.error('Error syncing data sources:', err);
      toast.error('Failed to sync data sources');
    }
  };

  return {
    metrics,
    events,
    loading,
    error,
    updateKPI,
    syncDataSources
  };
};
