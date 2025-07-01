
import { toast } from 'sonner';

export interface OneSiteCredentials {
  username: string;
  password: string;
  clientId?: string;
  baseUrl?: string;
}

export interface OneSiteProperty {
  propertyId: string;
  propertyName: string;
  address: string;
  units: number;
  occupancyRate: number;
  totalRevenue: number;
  expenses: number;
  noi: number;
}

export interface OneSiteFinancialData {
  propertyId: string;
  period: string;
  grossRent: number;
  totalIncome: number;
  totalExpenses: number;
  netOperatingIncome: number;
  occupancyRate: number;
  collectionLoss: number;
}

export interface OneSiteTenantData {
  tenantId: string;
  propertyId: string;
  unitNumber: string;
  tenantName: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  securityDeposit: number;
  status: string;
}

export interface OneSiteMaintenanceData {
  workOrderId: string;
  propertyId: string;
  unitNumber: string;
  description: string;
  priority: string;
  status: string;
  cost: number;
  dateCreated: string;
  dateCompleted?: string;
}

class OneSiteApiService {
  private baseUrl: string = 'https://api.onesite.com/v1';
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  // Real authentication with OneSite API
  async authenticate(credentials: OneSiteCredentials): Promise<boolean> {
    try {
      console.log('Authenticating with OneSite API...');
      
      const authUrl = credentials.baseUrl || this.baseUrl;
      const response = await fetch(`${authUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'password',
          username: credentials.username,
          password: credentials.password,
          client_id: credentials.clientId || 'opsight_integration'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OneSite auth failed:', response.status, errorText);
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const authData = await response.json();
      this.accessToken = authData.access_token;
      
      // Set token expiry (usually 1 hour)
      this.tokenExpiry = new Date(Date.now() + (authData.expires_in || 3600) * 1000);
      
      console.log('OneSite authentication successful');
      return true;
    } catch (error) {
      console.error('OneSite authentication error:', error);
      toast.error('Failed to authenticate with OneSite');
      return false;
    }
  }

  // Check if token is valid and not expired
  private isTokenValid(): boolean {
    return this.accessToken !== null && 
           this.tokenExpiry !== null && 
           this.tokenExpiry > new Date();
  }

  // Make authenticated API request
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.isTokenValid()) {
      throw new Error('No valid access token. Please authenticate first.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.accessToken = null;
        this.tokenExpiry = null;
        throw new Error('Authentication expired. Please re-authenticate.');
      }
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  }

  // Get all properties
  async getProperties(): Promise<OneSiteProperty[]> {
    try {
      console.log('Fetching properties from OneSite...');
      const data = await this.makeRequest('/properties');
      
      return data.properties?.map((prop: any) => ({
        propertyId: prop.property_id,
        propertyName: prop.property_name,
        address: prop.address,
        units: prop.total_units,
        occupancyRate: prop.occupancy_rate,
        totalRevenue: prop.total_revenue,
        expenses: prop.total_expenses,
        noi: prop.net_operating_income
      })) || [];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  // Get financial data for a property
  async getFinancialData(propertyId: string, startDate: string, endDate: string): Promise<OneSiteFinancialData[]> {
    try {
      console.log(`Fetching financial data for property ${propertyId}...`);
      const data = await this.makeRequest(`/properties/${propertyId}/financials?start_date=${startDate}&end_date=${endDate}`);
      
      return data.financials?.map((fin: any) => ({
        propertyId: fin.property_id,
        period: fin.period,
        grossRent: fin.gross_rent,
        totalIncome: fin.total_income,
        totalExpenses: fin.total_expenses,
        netOperatingIncome: fin.net_operating_income,
        occupancyRate: fin.occupancy_rate,
        collectionLoss: fin.collection_loss
      })) || [];
    } catch (error) {
      console.error('Error fetching financial data:', error);
      throw error;
    }
  }

  // Get tenant data for a property
  async getTenantData(propertyId: string): Promise<OneSiteTenantData[]> {
    try {
      console.log(`Fetching tenant data for property ${propertyId}...`);
      const data = await this.makeRequest(`/properties/${propertyId}/tenants`);
      
      return data.tenants?.map((tenant: any) => ({
        tenantId: tenant.tenant_id,
        propertyId: tenant.property_id,
        unitNumber: tenant.unit_number,
        tenantName: tenant.tenant_name,
        leaseStart: tenant.lease_start_date,
        leaseEnd: tenant.lease_end_date,
        monthlyRent: tenant.monthly_rent,
        securityDeposit: tenant.security_deposit,
        status: tenant.lease_status
      })) || [];
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      throw error;
    }
  }

  // Get maintenance data for a property
  async getMaintenanceData(propertyId: string): Promise<OneSiteMaintenanceData[]> {
    try {
      console.log(`Fetching maintenance data for property ${propertyId}...`);
      const data = await this.makeRequest(`/properties/${propertyId}/work-orders`);
      
      return data.work_orders?.map((wo: any) => ({
        workOrderId: wo.work_order_id,
        propertyId: wo.property_id,
        unitNumber: wo.unit_number,
        description: wo.description,
        priority: wo.priority,
        status: wo.status,
        cost: wo.total_cost,
        dateCreated: wo.date_created,
        dateCompleted: wo.date_completed
      })) || [];
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      throw error;
    }
  }

  // Get comprehensive property data
  async getComprehensiveData(propertyId: string): Promise<{
    property: OneSiteProperty;
    financials: OneSiteFinancialData[];
    tenants: OneSiteTenantData[];
    maintenance: OneSiteMaintenanceData[];
  }> {
    try {
      const properties = await this.getProperties();
      const property = properties.find(p => p.propertyId === propertyId);
      
      if (!property) {
        throw new Error(`Property ${propertyId} not found`);
      }

      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [financials, tenants, maintenance] = await Promise.all([
        this.getFinancialData(propertyId, startDate, endDate),
        this.getTenantData(propertyId),
        this.getMaintenanceData(propertyId)
      ]);

      return {
        property,
        financials,
        tenants,
        maintenance
      };
    } catch (error) {
      console.error('Error fetching comprehensive data:', error);
      throw error;
    }
  }
}

export const oneSiteApiService = new OneSiteApiService();
