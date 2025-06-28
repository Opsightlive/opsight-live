
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AlertRule {
  id?: string;
  rule_name: string;
  description?: string;
  kpi_type: string;
  property_ids: string[];
  threshold_green_min?: number;
  threshold_green_max?: number;
  threshold_yellow_min?: number;
  threshold_yellow_max?: number;
  threshold_red_min?: number;
  threshold_red_max?: number;
  alert_frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  notification_channels: string[];
  is_active: boolean;
  conditions?: any;
}

interface AlertInstance {
  id: string;
  alert_rule_id: string;
  property_name: string;
  kpi_type: string;
  kpi_value: number;
  alert_level: 'yellow' | 'red';
  alert_message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  trigger_data: any;
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
}

interface NotificationPreferences {
  email_enabled: boolean;
  sms_enabled: boolean;
  dashboard_enabled: boolean;
  email_address?: string;
  phone_number?: string;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  emergency_override: boolean;
}

export const useRedFlagEngine = () => {
  const { user } = useAuth();
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [alertInstances, setAlertInstances] = useState<AlertInstance[]>([]);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load alert rules
  const loadAlertRules = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('alert_rules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlertRules(data || []);
    } catch (error: any) {
      console.error('Error loading alert rules:', error);
      toast.error('Failed to load alert rules');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load alert instances
  const loadAlertInstances = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('alert_instances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAlertInstances(data || []);
    } catch (error: any) {
      console.error('Error loading alert instances:', error);
      toast.error('Failed to load alerts');
    }
  }, [user]);

  // Load notification preferences
  const loadNotificationPrefs = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setNotificationPrefs(data);
    } catch (error: any) {
      console.error('Error loading notification preferences:', error);
    }
  }, [user]);

  // Create or update alert rule
  const saveAlertRule = useCallback(async (rule: AlertRule): Promise<boolean> => {
    if (!user) return false;

    try {
      const ruleData = {
        user_id: user.id,
        ...rule
      };

      const { error } = rule.id
        ? await supabase
            .from('alert_rules')
            .update(ruleData)
            .eq('id', rule.id)
            .eq('user_id', user.id)
        : await supabase
            .from('alert_rules')
            .insert(ruleData);

      if (error) throw error;

      toast.success(rule.id ? 'Alert rule updated' : 'Alert rule created');
      await loadAlertRules();
      return true;
    } catch (error: any) {
      console.error('Error saving alert rule:', error);
      toast.error('Failed to save alert rule');
      return false;
    }
  }, [user, loadAlertRules]);

  // Delete alert rule
  const deleteAlertRule = useCallback(async (ruleId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('alert_rules')
        .delete()
        .eq('id', ruleId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Alert rule deleted');
      await loadAlertRules();
      return true;
    } catch (error: any) {
      console.error('Error deleting alert rule:', error);
      toast.error('Failed to delete alert rule');
      return false;
    }
  }, [user, loadAlertRules]);

  // Acknowledge alert
  const acknowledgeAlert = useCallback(async (alertId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('alert_instances')
        .update({
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: user.id
        })
        .eq('id', alertId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Alert acknowledged');
      await loadAlertInstances();
      return true;
    } catch (error: any) {
      console.error('Error acknowledging alert:', error);
      toast.error('Failed to acknowledge alert');
      return false;
    }
  }, [user, loadAlertInstances]);

  // Resolve alert
  const resolveAlert = useCallback(async (alertId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('alert_instances')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Alert resolved');
      await loadAlertInstances();
      return true;
    } catch (error: any) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
      return false;
    }
  }, [user, loadAlertInstances]);

  // Update notification preferences
  const updateNotificationPrefs = useCallback(async (prefs: NotificationPreferences): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user.id,
          ...prefs
        });

      if (error) throw error;

      toast.success('Notification preferences updated');
      await loadNotificationPrefs();
      return true;
    } catch (error: any) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update preferences');
      return false;
    }
  }, [user, loadNotificationPrefs]);

  // Preview alert logic
  const previewAlertLogic = useCallback((rule: AlertRule, sampleValue: number) => {
    const evaluateThreshold = (value: number): 'green' | 'yellow' | 'red' => {
      if (rule.threshold_red_min !== undefined && value < rule.threshold_red_min) return 'red';
      if (rule.threshold_red_max !== undefined && value > rule.threshold_red_max) return 'red';
      if (rule.threshold_yellow_min !== undefined && value < rule.threshold_yellow_min) return 'yellow';
      if (rule.threshold_yellow_max !== undefined && value > rule.threshold_yellow_max) return 'yellow';
      return 'green';
    };

    const level = evaluateThreshold(sampleValue);
    const message = `${level === 'red' ? 'Critical' : level === 'yellow' ? 'Warning' : 'Normal'}: ${rule.rule_name} - Value: ${sampleValue}`;

    return {
      level,
      message,
      wouldTrigger: level !== 'green',
      explanation: {
        value: sampleValue,
        thresholds: {
          red: {
            min: rule.threshold_red_min,
            max: rule.threshold_red_max
          },
          yellow: {
            min: rule.threshold_yellow_min,
            max: rule.threshold_yellow_max
          },
          green: {
            min: rule.threshold_green_min,
            max: rule.threshold_green_max
          }
        },
        logic: level === 'red' 
          ? 'Value falls within RED threshold range'
          : level === 'yellow'
          ? 'Value falls within YELLOW threshold range'
          : 'Value is within acceptable GREEN range'
      }
    };
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const alertsChannel = supabase
      .channel('alert-instances')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alert_instances',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New alert received:', payload);
          setAlertInstances(prev => [payload.new as AlertInstance, ...prev]);
          
          // Show real-time toast for new alerts
          const alert = payload.new as AlertInstance;
          toast(alert.alert_message, {
            description: `${alert.property_name} - ${alert.kpi_type}`,
            action: {
              label: 'View',
              onClick: () => console.log('Navigate to alerts')
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(alertsChannel);
    };
  }, [user]);

  // Load data on mount
  useEffect(() => {
    if (user) {
      loadAlertRules();
      loadAlertInstances();
      loadNotificationPrefs();
    }
  }, [user, loadAlertRules, loadAlertInstances, loadNotificationPrefs]);

  return {
    alertRules,
    alertInstances,
    notificationPrefs,
    isLoading,
    saveAlertRule,
    deleteAlertRule,
    acknowledgeAlert,
    resolveAlert,
    updateNotificationPrefs,
    previewAlertLogic,
    loadAlertRules,
    loadAlertInstances
  };
};
