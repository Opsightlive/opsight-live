
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { usePMIntegration } from './usePMIntegration';

interface PMIntegrationStatus {
  user_id: string;
  integration_id: string;
  status: string;
  pm_software: string;
  last_sync: string | null;
}

interface KPIUpdate {
  user_id: string;
  kpi_type: string;
  kpi_name: string;
  kpi_value: number;
  property_name: string;
  created_at: string;
}

export const useRealtimePMIntegration = () => {
  const { user } = useAuth();
  const { loadIntegrations } = usePMIntegration();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time PM integration listeners...');
    setIsListening(true);

    // Subscribe to real-time changes on pm_integrations table
    const integrationsChannel = supabase
      .channel('pm-integrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pm_integrations',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('PM Integration real-time update:', payload);
          
          if (payload.eventType === 'UPDATE') {
            const integration = payload.new;
            
            if (integration.sync_status === 'active' && payload.old?.sync_status !== 'active') {
              toast.success(`${integration.pm_software} integration completed successfully!`);
            } else if (integration.sync_status === 'syncing') {
              toast.info(`Syncing data from ${integration.pm_software}...`);
            } else if (integration.sync_status === 'error') {
              toast.error(`Integration error with ${integration.pm_software}`);
            }
          }
          
          // Refresh integrations list
          loadIntegrations();
        }
      )
      .subscribe();

    // Subscribe to real-time changes on extracted_kpis table
    const kpisChannel = supabase
      .channel('extracted-kpis-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'extracted_kpis',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New KPI data received:', payload.new);
          const kpi = payload.new;
          
          toast.success(`New ${kpi.kpi_name} data received`, {
            description: `${kpi.kpi_value} ${kpi.kpi_unit || ''} from ${kpi.property_name || 'your property'}`
          });
        }
      )
      .subscribe();

    // Listen to custom PostgreSQL notifications
    const notificationChannel = supabase
      .channel('integration-notifications')
      .on('postgres_changes', { event: '*', schema: '*', table: '*' }, () => {})
      .subscribe();

    // Listen for PostgreSQL NOTIFY events
    const setupNotificationListener = async () => {
      try {
        // Set up listener for integration status changes
        const { error } = await supabase.rpc('pg_notify', {
          channel: 'integration_status_change',
          payload: JSON.stringify({ test: 'connection' })
        });
        
        if (error) {
          console.warn('Could not set up notification listener:', error);
        }
      } catch (error) {
        console.warn('Notification setup error:', error);
      }
    };

    setupNotificationListener();

    return () => {
      console.log('Cleaning up PM integration real-time subscriptions...');
      supabase.removeChannel(integrationsChannel);
      supabase.removeChannel(kpisChannel);
      supabase.removeChannel(notificationChannel);
      setIsListening(false);
    };
  }, [user, loadIntegrations]);

  return {
    isListening
  };
};
