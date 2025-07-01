import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { oneSiteApiService, OneSiteCredentials } from './oneSiteApiService';

export interface PMCredentials {
  username: string;
  password: string;
  pmSoftware: string;
  apiUrl?: string;
  clientId?: string;
}

export interface ScrapedData {
  financials: any[];
  tenants: any[];
  maintenance: any[];
  leases: any[];
  properties: any[];
  kpis: any[];
}

export interface ScrapingResult {
  success: boolean;
  data?: ScrapedData;
  error?: string;
  creditsUsed?: number;
}

class PMScrapingService {
  // Real OneSite scraper using actual API
  async scrapeOneSite(credentials: PMCredentials): Promise<ScrapingResult> {
    try {
      console.log('Starting real OneSite API scraping...');
      
      const oneSiteCredentials: OneSiteCredentials = {
        username: credentials.username,
        password: credentials.password,
        clientId: credentials.apiUrl || undefined,
        baseUrl: credentials.apiUrl || undefined
      };

      // Step 1: Authenticate
      const authSuccess = await oneSiteApiService.authenticate(oneSiteCredentials);
      if (!authSuccess) {
        return { success: false, error: 'Authentication failed' };
      }

      // Step 2: Get all properties
      const properties = await oneSiteApiService.getProperties();
      console.log(`Found ${properties.length} properties`);

      if (properties.length === 0) {
        return { success: false, error: 'No properties found in your OneSite account' };
      }

      // Step 3: Get comprehensive data for each property
      const allFinancials: any[] = [];
      const allTenants: any[] = [];
      const allMaintenance: any[] = [];
      const allLeases: any[] = [];
      const generatedKPIs: any[] = [];

      for (const property of properties) {
        try {
          const comprehensiveData = await oneSiteApiService.getComprehensiveData(property.propertyId);
          
          // Add property context to each data point
          allFinancials.push(...comprehensiveData.financials.map(f => ({
            ...f,
            propertyName: property.propertyName,
            source: 'onesite'
          })));

          allTenants.push(...comprehensiveData.tenants.map(t => ({
            ...t,
            propertyName: property.propertyName,
            source: 'onesite'
          })));

          allMaintenance.push(...comprehensiveData.maintenance.map(m => ({
            ...m,
            propertyName: property.propertyName,
            source: 'onesite'
          })));

          // Generate leases from tenant data
          const leases = comprehensiveData.tenants.map(tenant => ({
            unit: tenant.unitNumber,
            startDate: tenant.leaseStart,
            endDate: tenant.leaseEnd,
            rent: tenant.monthlyRent,
            tenant: tenant.tenantName,
            propertyName: property.propertyName,
            source: 'onesite'
          }));
          allLeases.push(...leases);

          // Generate KPIs from the data
          const kpis = this.generateKPIsFromOneSiteData(property, comprehensiveData);
          generatedKPIs.push(...kpis);

        } catch (error) {
          console.error(`Error fetching data for property ${property.propertyId}:`, error);
          // Continue with other properties even if one fails
        }
      }

      const scrapedData: ScrapedData = {
        properties: properties.map(p => ({ ...p, source: 'onesite' })),
        financials: allFinancials,
        tenants: allTenants,
        maintenance: allMaintenance,
        leases: allLeases,
        kpis: generatedKPIs
      };

      console.log('OneSite scraping completed successfully');
      console.log(`Scraped data summary:`, {
        properties: scrapedData.properties.length,
        financials: scrapedData.financials.length,
        tenants: scrapedData.tenants.length,
        maintenance: scrapedData.maintenance.length,
        kpis: scrapedData.kpis.length
      });

      return {
        success: true,
        data: scrapedData,
        creditsUsed: this.calculateCreditsUsed(scrapedData)
      };

    } catch (error) {
      console.error('OneSite scraping error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown scraping error' 
      };
    }
  }

  // Generate KPIs from real OneSite data
  private generateKPIsFromOneSiteData(property: any, data: any): any[] {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const kpis: any[] = [];

    // Occupancy Rate KPI
    if (property.occupancyRate !== undefined) {
      kpis.push({
        type: 'occupancy',
        name: 'Occupancy Rate',
        value: property.occupancyRate,
        unit: '%',
        target: 95,
        property: property.propertyName,
        periodStart: lastMonth.toISOString().split('T')[0],
        periodEnd: thisMonth.toISOString().split('T')[0],
        confidence: 1.0,
        source: 'onesite'
      });
    }

    // Revenue KPI
    if (property.totalRevenue) {
      kpis.push({
        type: 'revenue',
        name: 'Monthly Revenue',
        value: property.totalRevenue,
        unit: '$',
        target: property.totalRevenue * 1.05, // 5% growth target
        property: property.propertyName,
        periodStart: lastMonth.toISOString().split('T')[0],
        periodEnd: thisMonth.toISOString().split('T')[0],
        confidence: 1.0,
        source: 'onesite'
      });
    }

    // NOI KPI
    if (property.noi) {
      kpis.push({
        type: 'noi',
        name: 'Net Operating Income',
        value: property.noi,
        unit: '$',
        target: property.noi * 1.1, // 10% improvement target
        property: property.propertyName,
        periodStart: lastMonth.toISOString().split('T')[0],
        periodEnd: thisMonth.toISOString().split('T')[0],
        confidence: 1.0,
        source: 'onesite'
      });
    }

    // Maintenance Cost per Unit
    if (data.maintenance && data.maintenance.length > 0 && property.units) {
      const totalMaintenanceCost = data.maintenance.reduce((sum: number, item: any) => sum + (item.cost || 0), 0);
      const costPerUnit = totalMaintenanceCost / property.units;
      
      kpis.push({
        type: 'maintenance',
        name: 'Maintenance Cost per Unit',
        value: costPerUnit,
        unit: '$',
        target: 150, // Target $150 per unit per month
        property: property.propertyName,
        periodStart: lastMonth.toISOString().split('T')[0],
        periodEnd: thisMonth.toISOString().split('T')[0],
        confidence: 1.0,
        source: 'onesite'
      });
    }

    return kpis;
  }

  // Main scraping orchestrator - now uses real APIs
  async scrapePMSoftware(credentials: PMCredentials): Promise<ScrapingResult> {
    console.log(`Starting real scrape for ${credentials.pmSoftware}...`);
    
    switch (credentials.pmSoftware.toLowerCase()) {
      case 'onesite':
        return await this.scrapeOneSite(credentials);
      case 'yardi':
        return { success: false, error: 'Yardi integration coming soon - real API connection needed' };
      case 'appfolio':
        return { success: false, error: 'AppFolio integration coming soon - real API connection needed' };
      default:
        return { success: false, error: 'Unsupported PM software' };
    }
  }

  // Store real scraped data in database
  async storeScrapedData(userId: string, data: ScrapedData, pmSoftware: string): Promise<boolean> {
    try {
      console.log('Storing real scraped data in database...');

      // Store KPIs in extracted_kpis table
      for (const kpi of data.kpis) {
        const { error: kpiError } = await supabase.from('extracted_kpis').insert({
          user_id: userId,
          kpi_type: kpi.type,
          kpi_name: kpi.name,
          kpi_value: kpi.value,
          kpi_unit: kpi.unit,
          property_name: kpi.property,
          period_start: kpi.periodStart,
          period_end: kpi.periodEnd,
          extraction_confidence: kpi.confidence || 1.0
        });

        if (kpiError) {
          console.error('Error storing KPI:', kpiError);
        }
      }

      // Store in kpi_metrics for real-time tracking
      for (const kpi of data.kpis) {
        const { error: metricsError } = await supabase.from('kpi_metrics').insert({
          user_id: userId,
          category: this.getKPICategory(kpi.type),
          metric_name: kpi.name,
          metric_value: kpi.value,
          metric_unit: kpi.unit,
          target_value: kpi.target,
          performance_zone: this.calculatePerformanceZone(kpi.value, kpi.target),
          period_start: kpi.periodStart,
          period_end: kpi.periodEnd
        });

        if (metricsError) {
          console.error('Error storing metrics:', metricsError);
        }
      }

      console.log(`Successfully stored ${data.kpis.length} KPIs from real ${pmSoftware} data`);
      return true;
    } catch (error) {
      console.error('Error storing scraped data:', error);
      return false;
    }
  }

  // Helper methods
  private async simulateLogin(credentials: PMCredentials): Promise<{ success: boolean }> {
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true };
  }

  private async extractFinancials(credentials: PMCredentials): Promise<any[]> {
    return this.generateMockFinancials(credentials.pmSoftware);
  }

  private async extractTenants(credentials: PMCredentials): Promise<any[]> {
    return this.generateMockTenants(credentials.pmSoftware);
  }

  private async extractMaintenance(credentials: PMCredentials): Promise<any[]> {
    return this.generateMockMaintenance(credentials.pmSoftware);
  }

  private async extractLeases(credentials: PMCredentials): Promise<any[]> {
    return this.generateMockLeases(credentials.pmSoftware);
  }

  private async extractProperties(credentials: PMCredentials): Promise<any[]> {
    return this.generateMockProperties(credentials.pmSoftware);
  }

  private async extractKPIs(credentials: PMCredentials): Promise<any[]> {
    return this.generateMockKPIs(credentials.pmSoftware);
  }

  // Mock data generators for testing
  private generateMockFinancials(source: string): any[] {
    return [
      { month: '2024-01', revenue: 125000, expenses: 85000, noi: 40000, source },
      { month: '2024-02', revenue: 128000, expenses: 87000, noi: 41000, source },
      { month: '2024-03', revenue: 130000, expenses: 89000, noi: 41000, source }
    ];
  }

  private generateMockTenants(source: string): any[] {
    return [
      { unit: '101', tenant: 'John Smith', rent: 1200, moveIn: '2023-01-15', source },
      { unit: '102', tenant: 'Jane Doe', rent: 1250, moveIn: '2023-03-01', source },
      { unit: '201', tenant: 'Bob Johnson', rent: 1300, moveIn: '2023-06-15', source }
    ];
  }

  private generateMockMaintenance(source: string): any[] {
    return [
      { unit: '101', issue: 'HVAC Repair', cost: 450, date: '2024-01-15', source },
      { unit: '205', issue: 'Plumbing Fix', cost: 280, date: '2024-01-20', source }
    ];
  }

  private generateMockLeases(source: string): any[] {
    return [
      { unit: '101', startDate: '2024-01-01', endDate: '2024-12-31', rent: 1200, source },
      { unit: '102', startDate: '2024-02-01', endDate: '2025-01-31', rent: 1250, source }
    ];
  }

  private generateMockProperties(source: string): any[] {
    return [
      { name: 'Sunset Apartments', units: 24, occupancy: 0.92, source },
      { name: 'Downtown Towers', units: 48, occupancy: 0.88, source }
    ];
  }

  private generateMockKPIs(source: string): any[] {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return [
      {
        type: 'occupancy',
        name: 'Occupancy Rate',
        value: 92.5,
        unit: '%',
        target: 95,
        property: 'Sunset Apartments',
        periodStart: lastMonth.toISOString().split('T')[0],
        periodEnd: thisMonth.toISOString().split('T')[0],
        confidence: 0.98,
        source
      },
      {
        type: 'revenue',
        name: 'Monthly Revenue',
        value: 128000,
        unit: '$',
        target: 130000,
        property: 'All Properties',
        periodStart: lastMonth.toISOString().split('T')[0],
        periodEnd: thisMonth.toISOString().split('T')[0],
        confidence: 0.95,
        source
      },
      {
        type: 'leasing',
        name: 'Days to Lease',
        value: 18,
        unit: 'days',
        target: 15,
        property: 'All Properties',
        periodStart: lastMonth.toISOString().split('T')[0],
        periodEnd: thisMonth.toISOString().split('T')[0],
        confidence: 0.90,
        source
      },
      {
        type: 'maintenance',
        name: 'Maintenance Cost per Unit',
        value: 185,
        unit: '$',
        target: 150,
        property: 'All Properties',
        periodStart: lastMonth.toISOString().split('T')[0],
        periodEnd: thisMonth.toISOString().split('T')[0],
        confidence: 0.88,
        source
      }
    ];
  }

  private async scrapeAppFolio(credentials: PMCredentials): Promise<ScrapingResult> {
    try {
      console.log('Starting AppFolio scrape...');
      
      const scrapedData: ScrapedData = {
        financials: this.generateMockFinancials('appfolio'),
        tenants: this.generateMockTenants('appfolio'),
        maintenance: this.generateMockMaintenance('appfolio'),
        leases: this.generateMockLeases('appfolio'),
        properties: this.generateMockProperties('appfolio'),
        kpis: this.generateMockKPIs('appfolio')
      };

      return { success: true, data: scrapedData, creditsUsed: 38 };
    } catch (error) {
      return { success: false, error: 'AppFolio scraping failed' };
    }
  }

  private calculateCreditsUsed(data: ScrapedData): number {
    const baseCredits = 10;
    const dataPoints = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);
    return baseCredits + Math.floor(dataPoints / 5);
  }

  private getKPICategory(kpiType: string): string {
    const categoryMap: { [key: string]: string } = {
      'occupancy': 'leasing',
      'revenue': 'revenue',
      'leasing': 'leasing',
      'maintenance': 'staffing',
      'noi': 'financials',
      'expenses': 'financials'
    };
    return categoryMap[kpiType] || 'financials';
  }

  private calculatePerformanceZone(current: number, target?: number): 'green' | 'yellow' | 'red' {
    if (!target) return 'yellow';
    
    const percentage = current / target;
    if (percentage >= 0.95) return 'green';
    if (percentage >= 0.85) return 'yellow';
    return 'red';
  }
}

export const pmScrapingService = new PMScrapingService();
