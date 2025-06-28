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

export interface KPIMetric {
  id?: string;
  category: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  target_value?: number;
  previous_value?: number;
  change_percentage?: number;
  performance_zone?: 'green' | 'yellow' | 'red';
  property_id?: string;
  period_start: string;
  period_end: string;
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

      return (data as DataIntegrationSource[]) || [];
    } catch (error) {
      console.error('Error fetching data sources:', error);
      toast.error('Failed to load data sources');
      return [];
    }
  }

  // KPI Metrics Management
  async createKPIMetric(userId: string, kpiData: KPIMetric): Promise<boolean> {
    try {
      // Calculate performance zone if target is provided
      let performanceZone = 'yellow';
      if (kpiData.target_value) {
        const { data: zoneData, error: zoneError } = await supabase
          .rpc('calculate_performance_zone', {
            current_value: kpiData.metric_value,
            target_value: kpiData.target_value,
            metric_type: 'higher_better'
          });

        if (!zoneError && zoneData) {
          performanceZone = zoneData;
        }
      }

      const { error } = await supabase
        .from('kpi_metrics')
        .insert({
          user_id: userId,
          category: kpiData.category,
          metric_name: kpiData.metric_name,
          metric_value: kpiData.metric_value,
          metric_unit: kpiData.metric_unit,
          target_value: kpiData.target_value,
          previous_value: kpiData.previous_value,
          change_percentage: kpiData.change_percentage,
          performance_zone: performanceZone,
          property_id: kpiData.property_id,
          period_start: kpiData.period_start,
          period_end: kpiData.period_end
        });

      if (error) {
        console.error('Error creating KPI metric:', error);
        toast.error('Failed to create KPI metric');
        return false;
      }

      toast.success('KPI metric created successfully');
      return true;
    } catch (error) {
      console.error('Error creating KPI metric:', error);
      toast.error('Failed to create KPI metric');
      return false;
    }
  }

  async getKPIMetrics(userId: string, category?: string): Promise<KPIMetric[]> {
    try {
      let query = supabase
        .from('kpi_metrics')
        .select('*')
        .eq('user_id', userId);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching KPI metrics:', error);
        toast.error('Failed to load KPI metrics');
        return [];
      }

      return (data as KPIMetric[]) || [];
    } catch (error) {
      console.error('Error fetching KPI metrics:', error);
      toast.error('Failed to load KPI metrics');
      return [];
    }
  }

  async updateKPIMetric(userId: string, metricId: string, updateData: Partial<KPIMetric>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('kpi_metrics')
        .update(updateData)
        .eq('id', metricId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating KPI metric:', error);
        toast.error('Failed to update KPI metric');
        return false;
      }

      toast.success('KPI metric updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating KPI metric:', error);
      toast.error('Failed to update KPI metric');
      return false;
    }
  }

  // Manual KPI Updates (keeping for compatibility)
  async updateKPIMetricLegacy(userId: string, kpiData: {
    property_id?: string;
    category: string;
    metric_name: string;
    metric_value: number;
    metric_unit?: string;
    target_value?: number;
  }): Promise<boolean> {
    const currentDate = new Date().toISOString().split('T')[0];
    
    return this.createKPIMetric(userId, {
      ...kpiData,
      period_start: currentDate,
      period_end: currentDate
    });
  }

  // KPI Events
  async getKPIEvents(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('kpi_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching KPI events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching KPI events:', error);
      return [];
    }
  }

  // Test connection for data sources
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
        toast.success(`Synchronized ${data.results?.length || 0} data sources`);
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

  // Generate sample data for demo purposes
  async generateSampleKPIData(userId: string): Promise<boolean> {
    try {
      const currentDate = new Date();
      const sampleMetrics = [
        {
          category: 'leasing',
          metric_name: 'Occupancy Rate',
          metric_value: 92.5,
          metric_unit: '%',
          target_value: 95.0,
          period_start: currentDate.toISOString().split('T')[0],
          period_end: currentDate.toISOString().split('T')[0]
        },
        {
          category: 'revenue',
          metric_name: 'Monthly Rent Revenue',
          metric_value: 125000,
          metric_unit: '$',
          target_value: 130000,
          period_start: currentDate.toISOString().split('T')[0],
          period_end: currentDate.toISOString().split('T')[0]
        },
        {
          category: 'financials',
          metric_name: 'Operating Expense Ratio',
          metric_value: 45.2,
          metric_unit: '%',
          target_value: 40.0,
          period_start: currentDate.toISOString().split('T')[0],
          period_end: currentDate.toISOString().split('T')[0]
        }
      ];

      for (const metric of sampleMetrics) {
        await this.createKPIMetric(userId, metric);
      }

      toast.success('Sample KPI data generated successfully');
      return true;
    } catch (error) {
      console.error('Error generating sample data:', error);
      toast.error('Failed to generate sample data');
      return false;
    }
  }

  // Webhook endpoint for external integrations
  getWebhookUrl(): string {
    return `https://oafnvnczdrcuvbdizqif.supabase.co/functions/v1/data-integration/webhook`;
  }
}

export const kpiService = new KPIService();
