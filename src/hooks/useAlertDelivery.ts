
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { alertDeliveryService, MessageTemplate, DeliveryLog, DeliveryStatistics, NotificationSettings } from '@/services/alertDeliveryService';
import { supabase } from '@/integrations/supabase/client';

export const useAlertDelivery = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLog[]>([]);
  const [statistics, setStatistics] = useState<DeliveryStatistics[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load data functions
  const loadTemplates = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await alertDeliveryService.getMessageTemplates(user.id);
      setTemplates(data);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadDeliveryLogs = useCallback(async () => {
    if (!user) return;
    const data = await alertDeliveryService.getDeliveryLogs(user.id);
    setDeliveryLogs(data);
  }, [user]);

  const loadStatistics = useCallback(async () => {
    if (!user) return;
    const data = await alertDeliveryService.getDeliveryStatistics(user.id);
    setStatistics(data);
  }, [user]);

  const loadSettings = useCallback(async () => {
    if (!user) return;
    const data = await alertDeliveryService.getNotificationSettings(user.id);
    setSettings(data);
  }, [user]);

  // Template management
  const saveTemplate = async (template: MessageTemplate): Promise<boolean> => {
    if (!user) return false;
    const success = await alertDeliveryService.saveMessageTemplate(user.id, template);
    if (success) {
      await loadTemplates();
    }
    return success;
  };

  const deleteTemplate = async (templateId: string): Promise<boolean> => {
    if (!user) return false;
    const success = await alertDeliveryService.deleteMessageTemplate(user.id, templateId);
    if (success) {
      await loadTemplates();
    }
    return success;
  };

  // Settings management
  const saveSettings = async (newSettings: NotificationSettings): Promise<boolean> => {
    if (!user) return false;
    const success = await alertDeliveryService.saveNotificationSettings(user.id, newSettings);
    if (success) {
      await loadSettings();
    }
    return success;
  };

  // Template preview
  const previewTemplate = async (template: MessageTemplate, sampleData: Record<string, any>) => {
    return await alertDeliveryService.previewTemplate(template, sampleData);
  };

  // Test delivery
  const testDelivery = async (
    template: MessageTemplate,
    recipient: string,
    testData: Record<string, any>
  ): Promise<boolean> => {
    if (!user) return false;
    return await alertDeliveryService.testDelivery(user.id, template, recipient, testData);
  };

  // Real-time delivery log updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('delivery-logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'delivery_logs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New delivery log:', payload);
          setDeliveryLogs(prev => [payload.new as DeliveryLog, ...prev.slice(0, 99)]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'delivery_logs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Updated delivery log:', payload);
          setDeliveryLogs(prev => 
            prev.map(log => 
              log.id === payload.new.id ? payload.new as DeliveryLog : log
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadTemplates();
      loadDeliveryLogs();
      loadStatistics();
      loadSettings();
    }
  }, [user, loadTemplates, loadDeliveryLogs, loadStatistics, loadSettings]);

  return {
    templates,
    deliveryLogs,
    statistics,
    settings,
    isLoading,
    saveTemplate,
    deleteTemplate,
    saveSettings,
    previewTemplate,
    testDelivery,
    loadTemplates,
    loadDeliveryLogs,
    loadStatistics,
    availableVariables: alertDeliveryService.getAvailableVariables()
  };
};
