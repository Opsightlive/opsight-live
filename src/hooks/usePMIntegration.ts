
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PMIntegration {
  id: string;
  pm_software: string;
  integration_name: string;
  sync_status: string;
  last_sync: string | null;
  sync_frequency: string;
}

export const usePMIntegration = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<PMIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadIntegrations = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pm_integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setIntegrations(data || []);
    } catch (error: any) {
      console.error('Error loading integrations:', error);
      toast.error('Failed to load integrations');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createIntegration = useCallback(async (
    pmSoftware: string,
    integrationName: string,
    credentials: any,
    syncFrequency: string = 'daily'
  ) => {
    if (!user) {
      toast.error('Please log in to create integrations');
      return;
    }

    try {
      // Encrypt credentials (in production, use proper encryption)
      const encryptedCredentials = btoa(JSON.stringify(credentials));

      const { data, error } = await supabase
        .from('pm_integrations')
        .insert({
          user_id: user.id,
          pm_software: pmSoftware,
          integration_name: integrationName,
          credentials_encrypted: encryptedCredentials,
          sync_frequency: syncFrequency,
          sync_status: 'active'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setIntegrations(prev => [data, ...prev]);
      toast.success(`Integration "${integrationName}" created successfully`);
      
      return data;
    } catch (error: any) {
      console.error('Error creating integration:', error);
      toast.error(`Failed to create integration: ${error.message}`);
      return null;
    }
  }, [user]);

  const syncIntegration = useCallback(async (integrationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.functions
        .invoke('sync-pm-data', {
          body: {
            integrationId,
            userId: user.id
          }
        });

      if (error) {
        throw error;
      }

      // Refresh integrations
      await loadIntegrations();
      toast.success('Integration synced successfully');
    } catch (error: any) {
      console.error('Error syncing integration:', error);
      toast.error(`Failed to sync integration: ${error.message}`);
    }
  }, [user, loadIntegrations]);

  const deleteIntegration = useCallback(async (integrationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pm_integrations')
        .delete()
        .eq('id', integrationId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setIntegrations(prev => prev.filter(int => int.id !== integrationId));
      toast.success('Integration deleted successfully');
    } catch (error: any) {
      console.error('Error deleting integration:', error);
      toast.error(`Failed to delete integration: ${error.message}`);
    }
  }, [user]);

  return {
    integrations,
    isLoading,
    loadIntegrations,
    createIntegration,
    syncIntegration,
    deleteIntegration
  };
};
