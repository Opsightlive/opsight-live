import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface KPIUpdate {
  id: string;
  kpi_type: string;
  current_value: number;
  previous_value: number;
  change_percentage: number;
  alert_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  property_id: string;
}

interface UserPreferences {
  preferences: any;
  saved_views: any[];
  saved_filters: any;
  dashboard_settings: any;
}

export const useRealtimeData = () => {
  const { user } = useAuth();
  const [kpiUpdates, setKpiUpdates] = useState<KPIUpdate[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    loadInitialData();
  }, [user]);

  const loadInitialData = async () => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      // Load KPI updates from API
      const kpiResponse = await fetch(`/api/kpi-updates/${user.id}`);
      if (kpiResponse.ok) {
        const kpiData = await kpiResponse.json();
        setKpiUpdates(kpiData || []);
      } else {
        console.error('Failed to load KPI updates');
      }

      // Load user preferences from API
      const prefsResponse = await fetch(`/api/user-preferences/${user.id}`);
      if (prefsResponse.ok) {
        const prefsData = await prefsResponse.json();
        setUserPreferences({
          preferences: prefsData.preferences || {},
          saved_views: Array.isArray(prefsData.savedViews) ? prefsData.savedViews : [],
          saved_filters: prefsData.savedFilters || {},
          dashboard_settings: prefsData.dashboardSettings || {}
        });
      } else if (prefsResponse.status === 404) {
        // Create default preferences if they don't exist
        await createDefaultPreferences();
      } else {
        console.error('Failed to load user preferences');
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultPreferences = async () => {
    if (!user) return;

    try {
      const defaultPrefs = {
        userId: user.id,
        preferences: {
          theme: 'light',
          notifications: true,
          autoRefresh: true
        },
        savedViews: [],
        savedFilters: {},
        dashboardSettings: {
          layout: 'grid',
          refreshInterval: 30000
        }
      };

      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultPrefs),
      });

      if (response.ok) {
        const newPrefs = await response.json();
        setUserPreferences({
          preferences: newPrefs.preferences || {},
          saved_views: Array.isArray(newPrefs.savedViews) ? newPrefs.savedViews : [],
          saved_filters: newPrefs.savedFilters || {},
          dashboard_settings: newPrefs.dashboardSettings || {}
        });
      }
    } catch (error) {
      console.error('Error creating default preferences:', error);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return false;

    try {
      const response = await fetch(`/api/user-preferences/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedPrefs = await response.json();
        setUserPreferences({
          preferences: updatedPrefs.preferences || {},
          saved_views: Array.isArray(updatedPrefs.savedViews) ? updatedPrefs.savedViews : [],
          saved_filters: updatedPrefs.savedFilters || {},
          dashboard_settings: updatedPrefs.dashboardSettings || {}
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  return {
    kpiUpdates,
    userPreferences,
    isLoading,
    updatePreferences,
    refreshData,
  };
};