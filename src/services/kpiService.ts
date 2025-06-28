
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DataIntegrationSource {
  id?: string;
  source_name: string;
  source_type: 'pm_software' | 'accounting' | 'api_webhook' | 'manual';
  endpoint_url?: string;
  api_credentials_encrypted?: string;
  mapping_config?: any;
  sync_frequency?: string;
  sync_status?: string;
}

class KPIService {
  // Data Integration Management
  async createDataSource(userId: string, sourceData: DataIntegrationSource): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('data_integration_sources')
        .insert({
          user_id: userId,
          ...sourceData
        });

      if (error) {
        console.error('Error creating data source:', error);
        toast.error('Failed to create data source');
        return false;
      }

      toast.success('Data source created successfully');
      return true;
    } catch (error) {
      console.error('Error creating data source:', error);
      toast.error('Failed to create data source');
      return false;
    }
  }

  async getDataSources(userId: string): Promise<DataIntegrationSource[]> {
    try {
      const { data, error } = await supabase
        .from('data_integration_sources')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching data sources:', error);
        toast.error('Failed to load data sources');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching data sources:', error);
      toast.error('Failed to load data sources');
      return [];
    }
  }

  async testConnection(sourceId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('data-integration/test-connection', {
        body: { source_id: sourceId }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Connection test successful');
        return true;
      } else {
        toast.error('Connection test failed');
        return false;
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error('Connection test failed');
      return false;
    }
  }

  async syncDataSources(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('data-integration/sync', {
        body: { user_id: userId }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Synchronized ${data.results.length} data sources`);
        return true;
      } else {
        toast.error('Data synchronization failed');
        return false;
      }
    } catch (error) {
      console.error('Error syncing data sources:', error);
      toast.error('Data synchronization failed');
      return false;
    }
  }

  // Manual KPI Updates
  async updateKPIMetric(userId: string, kpiData: {
    property_id?: string;
    category: string;
    metric_name: string;
    metric_value: number;
    metric_unit?: string;
    target_value?: number;
  }): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('kpi-processor', {
        body: {
          action: 'process_kpi_update',
          data: {
            user_id: userId,
            ...kpiData
          }
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('KPI metric updated successfully');
        return true;
      } else {
        toast.error('Failed to update KPI metric');
        return false;
      }
    } catch (error) {
      console.error('Error updating KPI metric:', error);
      toast.error('Failed to update KPI metric');
      return false;
    }
  }

  // Aggregation and Reporting
  async aggregateMetrics(userId: string, category: string, periodStart: string, periodEnd: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('kpi-processor', {
        body: {
          action: 'aggregate_metrics',
          data: {
            user_id: userId,
            category,
            period_start: periodStart,
            period_end: periodEnd
          }
        }
      });

      if (error) throw error;

      if (data.success) {
        console.log('Metrics aggregated successfully');
        return true;
      } else {
        console.error('Failed to aggregate metrics');
        return false;
      }
    } catch (error) {
      console.error('Error aggregating metrics:', error);
      return false;
    }
  }

  async generateForecasts(userId: string, category: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.functions.invoke('kpi-processor', {
        body: {
          action: 'generate_forecasts',
          data: {
            user_id: userId,
            category
          }
        }
      });

      if (error) throw error;

      return data.forecasts || [];
    } catch (error) {
      console.error('Error generating forecasts:', error);
      return [];
    }
  }

  // Webhook endpoint for external integrations
  getWebhookUrl(): string {
    return `https://oafnvnczdrcuvbdizqif.supabase.co/functions/v1/data-integration/webhook`;
  }
}

export const kpiService = new KPIService();
