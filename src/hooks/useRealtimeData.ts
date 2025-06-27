
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  // Set up realtime subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to KPI updates
    const kpiChannel = supabase
      .channel('kpi-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'kpi_updates',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New KPI update:', payload);
          const newUpdate = payload.new as KPIUpdate;
          setKpiUpdates(prev => [newUpdate, ...prev].slice(0, 50)); // Keep last 50 updates
          
          // Show notification for critical alerts
          if (newUpdate.alert_level === 'critical') {
            toast.error(`Critical Alert: ${newUpdate.kpi_type} has changed significantly!`);
          } else if (newUpdate.alert_level === 'high') {
            toast.warning(`High Alert: ${newUpdate.kpi_type} requires attention`);
          }
        }
      )
      .subscribe();

    // Subscribe to user preferences changes
    const preferencesChannel = supabase
      .channel('user-preferences')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_preferences',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Preferences updated:', payload);
          const updatedPrefs = payload.new as any;
          setUserPreferences({
            preferences: updatedPrefs.preferences || {},
            saved_views: updatedPrefs.saved_views || [],
            saved_filters: updatedPrefs.saved_filters || {},
            dashboard_settings: updatedPrefs.dashboard_settings || {}
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(kpiChannel);
      supabase.removeChannel(preferencesChannel);
    };
  }, [user]);

  const loadInitialData = async () => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      // Load KPI updates
      const { data: kpiData, error: kpiError } = await supabase
        .from('kpi_updates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (kpiError) {
        console.error('Error loading KPI updates:', kpiError);
        toast.error('Failed to load KPI updates');
      } else {
        setKpiUpdates(kpiData || []);
      }

      // Load user preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (prefsError) {
        console.error('Error loading preferences:', prefsError);
        // Create default preferences if they don't exist
        if (prefsError.code === 'PGRST116') {
          await createDefaultPreferences();
        } else {
          toast.error('Failed to load user preferences');
        }
      } else {
        setUserPreferences({
          preferences: prefsData.preferences || {},
          saved_views: prefsData.saved_views || [],
          saved_filters: prefsData.saved_filters || {},
          dashboard_settings: prefsData.dashboard_settings || {}
        });
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
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          preferences: {},
          saved_views: [],
          saved_filters: {},
          dashboard_settings: {}
        });

      if (error) {
        console.error('Error creating default preferences:', error);
      } else {
        setUserPreferences({
          preferences: {},
          saved_views: [],
          saved_filters: {},
          dashboard_settings: {}
        });
      }
    } catch (error) {
      console.error('Error creating default preferences:', error);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating preferences:', error);
        toast.error('Failed to save preferences');
        return false;
      }

      toast.success('Preferences saved successfully');
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to save preferences');
      return false;
    }
  };

  const saveView = async (viewName: string, viewData: any): Promise<boolean> => {
    if (!userPreferences) return false;

    const updatedViews = [...userPreferences.saved_views, { name: viewName, data: viewData, created_at: new Date().toISOString() }];
    
    return await updatePreferences({
      saved_views: updatedViews
    });
  };

  const saveFilter = async (filterName: string, filterData: any): Promise<boolean> => {
    if (!userPreferences) return false;

    const updatedFilters = {
      ...userPreferences.saved_filters,
      [filterName]: filterData
    };

    return await updatePreferences({
      saved_filters: updatedFilters
    });
  };

  const updateDashboardSettings = async (settings: any): Promise<boolean> => {
    return await updatePreferences({
      dashboard_settings: settings
    });
  };

  return {
    kpiUpdates,
    userPreferences,
    isLoading,
    updatePreferences,
    saveView,
    saveFilter,
    updateDashboardSettings,
    refreshData: loadInitialData
  };
};
