
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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
  const [dashboardData] = useState<DashboardData>({
    totalProperties: 0,
    totalUnits: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    noi: 0,
    recentAlerts: [],
    upcomingTasks: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasRealData] = useState(false);

  useEffect(() => {
    // No real data loading - just set loading to false
    setIsLoading(false);
  }, [user]);

  return {
    dashboardData,
    isLoading,
    hasRealData,
    currentProperty: { name: 'Trinity Trace' }
  };
};
