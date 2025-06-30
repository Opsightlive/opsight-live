
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
    if (user) {
      loadRealKPIData();
    }
  }, [user]);

  const loadRealKPIData = async () => {
    try {
      console.log('Loading real KPI data for user:', user?.id);
      
      // Get extracted KPIs from database
      const { data: kpis, error } = await supabase
        .from('extracted_kpis')
        .select('*')
        .eq('user_id', user?.id)
        .eq('property_name', 'Trinity Trace')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading KPIs:', error);
        setIsLoading(false);
        return;
      }

      console.log('Loaded KPIs:', kpis);

      if (kpis && kpis.length > 0) {
        // Extract specific KPI values
        const occupancyKPI = kpis.find(kpi => kpi.kpi_name === 'Occupancy Rate');
        const unitsKPI = kpis.find(kpi => kpi.kpi_name === 'Total Units');
        const revenueKPI = kpis.find(kpi => kpi.kpi_name === 'Monthly Revenue');

        const newDashboardData = {
          totalProperties: 1, // Trinity Trace
          totalUnits: unitsKPI ? Number(unitsKPI.kpi_value) : 0,
          monthlyRevenue: revenueKPI ? Number(revenueKPI.kpi_value) : 0,
          occupancyRate: occupancyKPI ? Number(occupancyKPI.kpi_value) : 0,
          noi: revenueKPI ? Number(revenueKPI.kpi_value) * 0.65 : 0, // Estimate NOI as 65% of revenue
          recentAlerts: [],
          upcomingTasks: []
        };

        console.log('Setting dashboard data:', newDashboardData);
        setDashboardData(newDashboardData);
        setHasRealData(true);
      } else {
        console.log('No KPI data found, keeping defaults');
        setHasRealData(false);
      }
    } catch (error) {
      console.error('Error in loadRealKPIData:', error);
      setHasRealData(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dashboardData,
    isLoading,
    hasRealData,
    currentProperty: { name: 'Trinity Trace' },
    refreshData: loadRealKPIData
  };
};
