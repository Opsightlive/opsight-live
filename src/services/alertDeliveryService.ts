
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MessageTemplate {
  id?: string;
  template_name: string;
  template_type: 'email' | 'sms' | 'push';
  subject?: string;
  message_content: string;
  variables: Record<string, string>;
  is_active: boolean;
}

export interface DeliveryLog {
  id: string;
  alert_instance_id?: string;
  template_id?: string;
  recipient_type: 'email' | 'sms' | 'push';
  recipient_address: string;
  subject?: string;
  message_content: string;
  delivery_status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  delivery_provider?: string;
  provider_message_id?: string;
  delivery_time?: string;
  opened_at?: string;
  clicked_at?: string;
  error_message?: string;
  retry_count: number;
  priority: number;
  created_at: string;
}

export interface DeliveryStatistics {
  date: string;
  channel: 'email' | 'sms' | 'push';
  total_sent: number;
  total_delivered: number;
  total_failed: number;
  total_opened: number;
  total_clicked: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
}

export interface NotificationSettings {
  id?: string;
  sendgrid_api_key_encrypted?: string;
  twilio_account_sid_encrypted?: string;
  twilio_auth_token_encrypted?: string;
  twilio_phone_number?: string;
  default_email_template_id?: string;
  default_sms_template_id?: string;
  rate_limit_per_hour: number;
  enable_delivery_tracking: boolean;
  webhook_url?: string;
}

class AlertDeliveryService {
  // Message Templates
  async getMessageTemplates(userId: string): Promise<MessageTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching message templates:', error);
      toast.error('Failed to load message templates');
      return [];
    }
  }

  async saveMessageTemplate(userId: string, template: MessageTemplate): Promise<boolean> {
    try {
      const templateData = {
        user_id: userId,
        ...template
      };

      const { error } = template.id
        ? await supabase
            .from('message_templates')
            .update(templateData)
            .eq('id', template.id)
            .eq('user_id', userId)
        : await supabase
            .from('message_templates')
            .insert(templateData);

      if (error) throw error;

      toast.success(template.id ? 'Template updated successfully' : 'Template created successfully');
      return true;
    } catch (error: any) {
      console.error('Error saving message template:', error);
      toast.error('Failed to save template');
      return false;
    }
  }

  async deleteMessageTemplate(userId: string, templateId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', templateId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Template deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
      return false;
    }
  }

  // Template Preview
  processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template;
    
    // Replace template variables like {{property_name}}, {{alert_level}}, etc.
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, String(value || ''));
    });

    return processed;
  }

  async previewTemplate(template: MessageTemplate, sampleData: Record<string, any>): Promise<{
    subject?: string;
    content: string;
  }> {
    const processedContent = this.processTemplate(template.message_content, sampleData);
    const processedSubject = template.subject 
      ? this.processTemplate(template.subject, sampleData)
      : undefined;

    return {
      subject: processedSubject,
      content: processedContent
    };
  }

  // Delivery Logs
  async getDeliveryLogs(userId: string, limit: number = 100): Promise<DeliveryLog[]> {
    try {
      const { data, error } = await supabase
        .from('delivery_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching delivery logs:', error);
      toast.error('Failed to load delivery logs');
      return [];
    }
  }

  // Delivery Statistics
  async getDeliveryStatistics(userId: string, days: number = 30): Promise<DeliveryStatistics[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('delivery_statistics')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching delivery statistics:', error);
      toast.error('Failed to load delivery statistics');
      return [];
    }
  }

  // Notification Settings
  async getNotificationSettings(userId: string): Promise<NotificationSettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_notification_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching notification settings:', error);
      return null;
    }
  }

  async saveNotificationSettings(userId: string, settings: NotificationSettings): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_notification_settings')
        .upsert({
          user_id: userId,
          ...settings
        });

      if (error) throw error;

      toast.success('Notification settings saved successfully');
      return true;
    } catch (error: any) {
      console.error('Error saving notification settings:', error);
      toast.error('Failed to save notification settings');
      return false;
    }
  }

  // Test Delivery
  async testDelivery(
    userId: string,
    template: MessageTemplate,
    recipient: string,
    testData: Record<string, any>
  ): Promise<boolean> {
    try {
      const preview = await this.previewTemplate(template, testData);
      
      // Call edge function to send test message
      const { data, error } = await supabase.functions.invoke('send-alert-notification', {
        body: {
          user_id: userId,
          recipient_type: template.template_type,
          recipient_address: recipient,
          subject: preview.subject,
          message_content: preview.content,
          is_test: true
        }
      });

      if (error) throw error;

      toast.success(`Test ${template.template_type} sent successfully`);
      return true;
    } catch (error: any) {
      console.error('Error sending test delivery:', error);
      toast.error('Failed to send test message');
      return false;
    }
  }

  // Queue Alert for Delivery
  async queueAlert(
    userId: string,
    alertInstanceId: string,
    templateId: string,
    recipient: string,
    recipientType: 'email' | 'sms',
    alertData: Record<string, any>
  ): Promise<boolean> {
    try {
      // Get template
      const { data: template, error: templateError } = await supabase
        .from('message_templates')
        .select('*')
        .eq('id', templateId)
        .eq('user_id', userId)
        .single();

      if (templateError) throw templateError;

      const preview = await this.previewTemplate(template, alertData);

      // Add to notification queue
      const { error } = await supabase
        .from('notification_queue')
        .insert({
          user_id: userId,
          alert_instance_id: alertInstanceId,
          notification_type: recipientType,
          recipient,
          subject: preview.subject,
          message: preview.content,
          template_data: alertData,
          priority: alertData.alert_level === 'critical' ? 1 : alertData.alert_level === 'high' ? 2 : 3
        });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error queuing alert:', error);
      return false;
    }
  }

  // Get available template variables
  getAvailableVariables(): Record<string, string> {
    return {
      property_name: 'Name of the property',
      alert_level: 'Alert severity level (red, yellow)',
      metric_name: 'Name of the KPI metric',
      metric_value: 'Current value of the metric',
      target_value: 'Target value for the metric',
      change_percentage: 'Percentage change from previous value',
      alert_message: 'Generated alert message',
      user_name: 'Name of the user',
      date: 'Current date',
      time: 'Current time'
    };
  }
}

export const alertDeliveryService = new AlertDeliveryService();
