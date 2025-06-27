
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Property {
  id?: string;
  name: string;
  address: string;
  units: number;
  tier: 'basic' | 'professional' | 'enterprise';
  pm_software?: string;
  payment_method: 'card' | 'ach';
  monthly_cost?: number;
}

export interface OnboardingData {
  company_name?: string;
  role?: string;
  data_source?: string;
  total_cost?: number;
  discount?: number;
  setup_completed?: boolean;
  payment_completed?: boolean;
}

class SupabaseService {
  // User Properties Management
  async getUserProperties(userId: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('user_properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
      return [];
    }
  }

  async saveUserProperty(userId: string, property: Property): Promise<boolean> {
    try {
      const propertyData = {
        user_id: userId,
        name: property.name,
        address: property.address,
        units: property.units,
        tier: property.tier,
        pm_software: property.pm_software,
        payment_method: property.payment_method,
        monthly_cost: property.monthly_cost
      };

      const { error } = property.id
        ? await supabase
            .from('user_properties')
            .update(propertyData)
            .eq('id', property.id)
            .eq('user_id', userId)
        : await supabase
            .from('user_properties')
            .insert(propertyData);

      if (error) {
        console.error('Error saving property:', error);
        toast.error('Failed to save property');
        return false;
      }

      toast.success(property.id ? 'Property updated successfully' : 'Property added successfully');
      return true;
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
      return false;
    }
  }

  async deleteUserProperty(userId: string, propertyId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_properties')
        .delete()
        .eq('id', propertyId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property');
        return false;
      }

      toast.success('Property deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
      return false;
    }
  }

  // Onboarding Data Management
  async saveOnboardingData(userId: string, data: OnboardingData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('onboarding_data')
        .upsert({
          user_id: userId,
          ...data
        });

      if (error) {
        console.error('Error saving onboarding data:', error);
        toast.error('Failed to save setup data');
        return false;
      }

      toast.success('Setup data saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast.error('Failed to save setup data');
      return false;
    }
  }

  async getOnboardingData(userId: string): Promise<OnboardingData | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Not found error is OK
          console.error('Error fetching onboarding data:', error);
        }
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      return null;
    }
  }

  // KPI Updates Management
  async createKPIUpdate(
    userId: string,
    propertyId: string,
    kpiType: string,
    currentValue: number,
    previousValue: number,
    alertLevel: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<boolean> {
    try {
      const changePercentage = previousValue !== 0 
        ? ((currentValue - previousValue) / previousValue) * 100 
        : 0;

      const { error } = await supabase
        .from('kpi_updates')
        .insert({
          user_id: userId,
          property_id: propertyId,
          kpi_type: kpiType,
          current_value: currentValue,
          previous_value: previousValue,
          change_percentage: changePercentage,
          alert_level: alertLevel
        });

      if (error) {
        console.error('Error creating KPI update:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error creating KPI update:', error);
      return false;
    }
  }

  // User Activity Logging
  async logUserActivity(
    userId: string,
    actionType: string,
    actionDetails: any = {},
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: userId,
          action_type: actionType,
          action_details: actionDetails,
          success,
          error_message: errorMessage
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  // Batch Operations
  async saveMultipleProperties(userId: string, properties: Property[]): Promise<boolean> {
    try {
      const propertiesData = properties.map(property => ({
        user_id: userId,
        name: property.name,
        address: property.address,
        units: property.units,
        tier: property.tier,
        pm_software: property.pm_software,
        payment_method: property.payment_method,
        monthly_cost: property.monthly_cost
      }));

      const { error } = await supabase
        .from('user_properties')
        .insert(propertiesData);

      if (error) {
        console.error('Error saving multiple properties:', error);
        toast.error('Failed to save properties');
        return false;
      }

      toast.success(`${properties.length} properties saved successfully`);
      return true;
    } catch (error) {
      console.error('Error saving multiple properties:', error);
      toast.error('Failed to save properties');
      return false;
    }
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export const supabaseService = new SupabaseService();
