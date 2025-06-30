
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePropertyData } from './usePropertyData';

interface DashboardKPI {
  kpi_type: string;
  kpi_name: string;
  kpi_value: number;
  kpi_unit?: string;
  property_name?: string;
  created_at: string;
}

interface DashboardData {
  totalProperties: number;
  totalUnits: number;
  monthlyRevenue: number;
  occupancyRate: number;
  noi: number;
  recentAlerts: any[];
  upcomingTasks: any[];
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const { currentProperty, properties } = usePropertyData();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProperties: 0,
    totalUnits: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    noi: 0,
    recentAlerts: [],
    upcomingTasks: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasRealData, setHasRealData] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching dashboard data for user:', user.id);
        console.log('Current property:', currentProperty);

        // Get all KPI data for the user
        const { data: kpiData, error: kpiError } = await supabase
          .from('extracted_kpis')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (kpiError) {
          console.error('Error fetching KPI data:', kpiError);
          throw kpiError;
        }

        console.log('All KPI data:', kpiData);

        let filteredKPIs = kpiData || [];
        
        // If we have a current property, filter KPIs for that property
        if (currentProperty && currentProperty.name) {
          filteredKPIs = kpiData?.filter(kpi => kpi.property_name === currentProperty.name) || [];
          console.log('Filtered KPIs for current property:', filteredKPIs);
        }

        if (filteredKPIs.length > 0) {
          setHasRealData(true);
          const processedData = processKPIData(filteredKPIs, properties.length);
          setDashboardData(processedData);
          console.log('Processed dashboard data:', processedData);
        } else {
          setHasRealData(false);
          console.log('No KPI data found, showing empty state');
          // Show empty state with property count
          setDashboardData({
            totalProperties: properties.length,
            totalUnits: 0,
            monthlyRevenue: 0,
            occupancyRate: 0,
            noi: 0,
            recentAlerts: [],
            upcomingTasks: []
          });
        }

        // Fetch recent alerts
        const { data: alertsData } = await supabase
          .from('alert_instances')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setDashboardData(prev => ({
          ...prev,
          recentAlerts: alertsData || []
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setHasRealData(false);
        setDashboardData({
          totalProperties: properties.length,
          totalUnits: 0,
          monthlyRevenue: 0,
          occupancyRate: 0,
          noi: 0,
          recentAlerts: [],
          upcomingTasks: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, currentProperty, properties.length]);

  const processKPIData = (kpiData: DashboardKPI[], totalProperties: number): DashboardData => {
    console.log('Processing KPI data:', kpiData);
    
    // Get latest values for each KPI type
    const latestKPIs = kpiData.reduce((acc, kpi) => {
      const key = `${kpi.kpi_type}-${kpi.kpi_name}`;
      if (!acc[key] || new Date(kpi.created_at) > new Date(acc[key].created_at)) {
        acc[key] = kpi;
      }
      return acc;
    }, {} as Record<string, DashboardKPI>);

    const kpiArray = Object.values(latestKPIs);
    console.log('Latest KPIs:', kpiArray);
    
    // Extract key metrics from real data
    const occupancyKPI = kpiArray.find(k => 
      k.kpi_name.toLowerCase().includes('occupancy') || 
      k.kpi_type.toLowerCase().includes('occupancy')
    );
    
    const rentRollKPI = kpiArray.find(k => 
      k.kpi_name.toLowerCase().includes('rent') || 
      k.kpi_name.toLowerCase().includes('revenue') ||
      k.kpi_type.toLowerCase().includes('financial')
    );
    
    const collectionKPI = kpiArray.find(k => 
      k.kpi_name.toLowerCase().includes('collection') ||
      k.kpi_name.toLowerCase().includes('collect')
    );

    console.log('Found KPIs:', { occupancyKPI, rentRollKPI, collectionKPI });
    
    return {
      totalProperties: totalProperties,
      totalUnits: 100, // This would need to come from property details
      monthlyRevenue: rentRollKPI?.kpi_value || 0,
      occupancyRate: occupancyKPI?.kpi_value || 0,
      noi: (rentRollKPI?.kpi_value || 0) * 0.78, // Estimated NOI
      recentAlerts: [],
      upcomingTasks: []
    };
  };

  return {
    dashboardData,
    isLoading,
    hasRealData,
    currentProperty
  };
};
