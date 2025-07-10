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

class DatabaseService {
  // User Properties Management
  async getUserProperties(userId: string): Promise<Property[]> {
    try {
      const response = await fetch(`/api/user-properties/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        address: item.address,
        units: item.units,
        tier: item.tier as 'basic' | 'professional' | 'enterprise',
        pm_software: item.pmSoftware,
        payment_method: item.paymentMethod as 'card' | 'ach',
        monthly_cost: item.monthlyCost ? parseFloat(item.monthlyCost) : undefined
      }));
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
      return [];
    }
  }

  async saveUserProperty(userId: string, property: Property): Promise<boolean> {
    try {
      const propertyData = {
        userId: userId,
        name: property.name,
        address: property.address,
        units: property.units,
        tier: property.tier,
        pmSoftware: property.pm_software,
        paymentMethod: property.payment_method,
        monthlyCost: property.monthly_cost?.toString()
      };

      const url = property.id ? `/api/user-properties/${property.id}` : '/api/user-properties';
      const method = property.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error('Failed to save property');
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
      const response = await fetch(`/api/user-properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
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
      const onboardingData = {
        userId: userId,
        companyName: data.company_name,
        role: data.role,
        dataSource: data.data_source,
        totalCost: data.total_cost?.toString(),
        discount: data.discount?.toString(),
        setupCompleted: data.setup_completed,
        paymentCompleted: data.payment_completed
      };

      // Try to get existing data first
      const getResponse = await fetch(`/api/onboarding-data/${userId}`);
      const method = getResponse.ok ? 'PUT' : 'POST';
      const url = getResponse.ok ? `/api/onboarding-data/${userId}` : '/api/onboarding-data';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(onboardingData),
      });

      if (!response.ok) {
        throw new Error('Failed to save onboarding data');
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
      const response = await fetch(`/api/onboarding-data/${userId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Not found is OK
        }
        throw new Error('Failed to fetch onboarding data');
      }
      
      const data = await response.json();
      return {
        company_name: data.companyName,
        role: data.role,
        data_source: data.dataSource,
        total_cost: data.totalCost ? parseFloat(data.totalCost) : undefined,
        discount: data.discount ? parseFloat(data.discount) : undefined,
        setup_completed: data.setupCompleted,
        payment_completed: data.paymentCompleted
      };
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

      const kpiData = {
        userId: userId,
        propertyId: propertyId,
        kpiType: kpiType,
        currentValue: currentValue.toString(),
        previousValue: previousValue.toString(),
        changePercentage: changePercentage.toString(),
        alertLevel: alertLevel
      };

      const response = await fetch('/api/kpi-updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kpiData),
      });

      if (!response.ok) {
        throw new Error('Failed to create KPI update');
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
      const logData = {
        userId: userId,
        actionType: actionType,
        actionDetails: actionDetails,
        success: success,
        errorMessage: errorMessage
      };

      await fetch('/api/user-activity-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  // Batch Operations
  async saveMultipleProperties(userId: string, properties: Property[]): Promise<boolean> {
    try {
      // Save properties one by one since we don't have a batch endpoint
      for (const property of properties) {
        const success = await this.saveUserProperty(userId, property);
        if (!success) {
          throw new Error('Failed to save one or more properties');
        }
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
      const response = await fetch('/api/health');
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export const supabaseService = new DatabaseService();
