
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Check if user has any PM integrations
        const { data: integrations } = await supabase
          .from('pm_integrations')
          .select('*')
          .eq('user_id', user.id);

        // Fetch real KPI data
        const { data: kpiData } = await supabase
          .from('extracted_kpis')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (kpiData && kpiData.length > 0) {
          setHasRealData(true);
          
          // Process real KPI data
          const processedData = processKPIData(kpiData);
          setDashboardData(processedData);
        } else {
          setHasRealData(false);
          // Show demo data with clear indication
          setDashboardData({
            totalProperties: 0,
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const processKPIData = (kpiData: DashboardKPI[]): DashboardData => {
    const latestKPIs = kpiData.reduce((acc, kpi) => {
      const key = `${kpi.kpi_type}-${kpi.kpi_name}`;
      if (!acc[key] || new Date(kpi.created_at) > new Date(acc[key].created_at)) {
        acc[key] = kpi;
      }
      return acc;
    }, {} as Record<string, DashboardKPI>);

    const kpiArray = Object.values(latestKPIs);
    
    // Extract key metrics
    const occupancyKPI = kpiArray.find(k => k.kpi_name.toLowerCase().includes('occupancy'));
    const rentRollKPI = kpiArray.find(k => k.kpi_name.toLowerCase().includes('rent'));
    const collectionKPI = kpiArray.find(k => k.kpi_name.toLowerCase().includes('collection'));
    
    // Count unique properties
    const uniqueProperties = new Set(kpiArray.map(k => k.property_name).filter(Boolean));
    
    return {
      totalProperties: uniqueProperties.size,
      totalUnits: 100, // This would come from property data
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
    hasRealData
  };
};
