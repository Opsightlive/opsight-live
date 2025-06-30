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
  error_log?: string | null;
}

interface CreateIntegrationCredentials {
  username: string;
  password: string;
  apiKey?: string;
  endpoint?: string;
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
    credentials: CreateIntegrationCredentials,
    syncFrequency: string = 'daily'
  ) => {
    if (!user) {
      const errorMsg = 'Please log in to create integrations';
      console.error(errorMsg);
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      console.log('Starting integration creation process...');
      console.log('User ID:', user.id);
      console.log('PM Software:', pmSoftware);
      
      // Validate credentials before storing
      if (!credentials.username || !credentials.password) {
        throw new Error('Username and password are required');
      }

      // For OneSite, validate specific requirements
      if (pmSoftware.toLowerCase() === 'onesite') {
        if (!credentials.username.includes('@')) {
          throw new Error('OneSite requires an email address as username');
        }
      }

      console.log('Credentials validated, encrypting...');

      // Encrypt credentials using base64 encoding (in production, use proper encryption)
      const encryptedCredentials = btoa(JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        apiKey: credentials.apiKey || null,
        endpoint: credentials.endpoint || null,
        encrypted_at: new Date().toISOString()
      }));

      console.log('Credentials encrypted, inserting into database...');

      const { data, error } = await supabase
        .from('pm_integrations')
        .insert({
          user_id: user.id,
          pm_software: pmSoftware,
          integration_name: integrationName,
          credentials_encrypted: encryptedCredentials,
          sync_frequency: syncFrequency,
          sync_status: 'active',
          settings: {
            auto_sync: true,
            last_credential_update: new Date().toISOString(),
            api_version: '1.0'
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        console.error('No data returned from insert operation');
        throw new Error('No data returned from database insert');
      }

      console.log('Integration created successfully:', data);
      setIntegrations(prev => [data, ...prev]);
      toast.success(`Integration "${integrationName}" created successfully`);
      
      // Test the integration immediately
      try {
        await testIntegration(data.id);
      } catch (testError) {
        console.warn('Integration created but test failed:', testError);
        // Don't throw here - integration was created successfully
      }
      
      return data;
    } catch (error: any) {
      console.error('Error creating integration:', error);
      toast.error(`Failed to create integration: ${error.message}`);
      throw error; // Re-throw so the calling component can handle it
    }
  }, [user]);

  const testIntegration = useCallback(async (integrationId: string) => {
    if (!user) return;

    try {
      // Update status to testing
      await supabase
        .from('pm_integrations')
        .update({ sync_status: 'testing' })
        .eq('id', integrationId);

      // Call the sync function to test the connection
      const { data, error } = await supabase.functions
        .invoke('sync-pm-data', {
          body: {
            integrationId,
            userId: user.id,
            testMode: true
          }
        });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast.success('Integration test successful');
        await loadIntegrations(); // Refresh the list
      } else {
        throw new Error(data.error || 'Test failed');
      }
    } catch (error: any) {
      console.error('Error testing integration:', error);
      
      // Update integration with error status
      await supabase
        .from('pm_integrations')
        .update({ 
          sync_status: 'error',
          error_log: error.message
        })
        .eq('id', integrationId);
      
      toast.error(`Integration test failed: ${error.message}`);
      await loadIntegrations(); // Refresh to show error status
    }
  }, [user, loadIntegrations]);

  const syncIntegration = useCallback(async (integrationId: string) => {
    if (!user) return;

    try {
      // Update status to syncing
      await supabase
        .from('pm_integrations')
        .update({ sync_status: 'syncing' })
        .eq('id', integrationId);

      toast.info('Starting data sync...');

      const { data, error } = await supabase.functions
        .invoke('sync-pm-data', {
          body: {
            integrationId,
            userId: user.id
          }
        });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast.success(`Successfully synced ${data.syncedKPIs} KPIs from ${data.pmSoftware}`);
      } else {
        throw new Error(data.error || 'Sync failed');
      }

      // Refresh integrations to show updated status
      await loadIntegrations();
    } catch (error: any) {
      console.error('Error syncing integration:', error);
      
      // Update integration with error status
      await supabase
        .from('pm_integrations')
        .update({ 
          sync_status: 'error',
          error_log: error.message 
        })
        .eq('id', integrationId);
      
      toast.error(`Failed to sync integration: ${error.message}`);
      await loadIntegrations();
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

  const updateIntegrationCredentials = useCallback(async (
    integrationId: string,
    credentials: CreateIntegrationCredentials
  ) => {
    if (!user) return;

    try {
      // Encrypt new credentials
      const encryptedCredentials = btoa(JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        apiKey: credentials.apiKey || null,
        endpoint: credentials.endpoint || null,
        encrypted_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('pm_integrations')
        .update({
          credentials_encrypted: encryptedCredentials,
          sync_status: 'active',
          error_log: null,
          settings: {
            auto_sync: true,
            last_credential_update: new Date().toISOString(),
            api_version: '1.0'
          }
        })
        .eq('id', integrationId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast.success('Credentials updated successfully');
      
      // Test the updated integration
      await testIntegration(integrationId);
      
      await loadIntegrations();
    } catch (error: any) {
      console.error('Error updating credentials:', error);
      toast.error(`Failed to update credentials: ${error.message}`);
    }
  }, [user, testIntegration, loadIntegrations]);

  return {
    integrations,
    isLoading,
    loadIntegrations,
    createIntegration,
    syncIntegration,
    deleteIntegration,
    testIntegration,
    updateIntegrationCredentials
  };
};
