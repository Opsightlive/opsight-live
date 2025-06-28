
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];

interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

class DataService {
  private maxRetries = 3;
  private baseDelay = 1000;

  private async withRetry<T>(
    operation: () => Promise<T>,
    retries = this.maxRetries
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        const delay = this.baseDelay * (this.maxRetries - retries + 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.withRetry(operation, retries - 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx status codes
    return (
      error?.code === 'NETWORK_ERROR' ||
      error?.code === 'TIMEOUT' ||
      (error?.status >= 500 && error?.status < 600)
    );
  }

  async getUserProfile(userId: string): Promise<ServiceResponse<Tables['user_profiles']['Row']>> {
    try {
      const result = await this.withRetry(async () => {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        return data;
      });

      return { data: result, error: null, success: true };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch user profile',
        success: false
      };
    }
  }

  async getUserLayoutSettings(userId: string, deviceType: string): Promise<ServiceResponse<Tables['user_layout_settings']['Row']>> {
    try {
      const result = await this.withRetry(async () => {
        const { data, error } = await supabase
          .from('user_layout_settings')
          .select('*')
          .eq('user_id', userId)
          .eq('device_type', deviceType)
          .order('last_used', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
      });

      return { data: result, error: null, success: true };
    } catch (error) {
      console.error('Error fetching layout settings:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch layout settings',
        success: false
      };
    }
  }

  async updateLayoutSettings(settings: Tables['user_layout_settings']['Insert']): Promise<ServiceResponse<Tables['user_layout_settings']['Row']>> {
    try {
      const result = await this.withRetry(async () => {
        const { data, error } = await supabase
          .from('user_layout_settings')
          .upsert(settings, {
            onConflict: 'user_id,device_type',
            ignoreDuplicates: false
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      });

      return { data: result, error: null, success: true };
    } catch (error) {
      console.error('Error updating layout settings:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update layout settings',
        success: false
      };
    }
  }

  async getProperties(userId: string): Promise<ServiceResponse<Tables['properties']['Row'][]>> {
    try {
      const result = await this.withRetry(async () => {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      });

      return { data: result, error: null, success: true };
    } catch (error) {
      console.error('Error fetching properties:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch properties',
        success: false
      };
    }
  }

  // Health check for monitoring
  async healthCheck(): Promise<ServiceResponse<{ status: string; timestamp: string }>> {
    try {
      const result = await this.withRetry(async () => {
        const { error } = await supabase.from('user_profiles').select('id').limit(1);
        if (error) throw error;
        
        return {
          status: 'healthy',
          timestamp: new Date().toISOString()
        };
      });

      return { data: result, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Health check failed',
        success: false
      };
    }
  }
}

export const dataService = new DataService();
