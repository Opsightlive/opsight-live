
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface NotificationRequest {
  user_id: string
  recipient_type: 'email' | 'sms' | 'push'
  recipient_address: string
  subject?: string
  message_content: string
  alert_instance_id?: string
  template_id?: string
  is_test?: boolean
  priority?: number
}

interface UserNotificationSettings {
  sendgrid_api_key_encrypted?: string
  twilio_account_sid_encrypted?: string
  twilio_auth_token_encrypted?: string
  twilio_phone_number?: string
  rate_limit_per_hour: number
  enable_delivery_tracking: boolean
}

async function sendEmailNotification(
  recipient: string,
  subject: string,
  content: string,
  settings: UserNotificationSettings
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // In a production environment, you would decrypt the API key
    // For demo purposes, we'll simulate the email sending
    
    console.log(`Sending email to ${recipient}:`, { subject, content });
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success/failure (90% success rate)
    const success = Math.random() > 0.1;
    
    if (success) {
      return {
        success: true,
        messageId: `email_${crypto.randomUUID()}`
      };
    } else {
      throw new Error('Email delivery failed');
    }
  } catch (error: any) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function sendSMSNotification(
  recipient: string,
  content: string,
  settings: UserNotificationSettings
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // In a production environment, you would use the Twilio API
    // For demo purposes, we'll simulate the SMS sending
    
    console.log(`Sending SMS to ${recipient}:`, content);
    
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate success/failure (95% success rate)
    const success = Math.random() > 0.05;
    
    if (success) {
      return {
        success: true,
        messageId: `sms_${crypto.randomUUID()}`
      };
    } else {
      throw new Error('SMS delivery failed');
    }
  } catch (error: any) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function logDeliveryAttempt(
  userId: string,
  request: NotificationRequest,
  result: { success: boolean; messageId?: string; error?: string }
): Promise<void> {
  try {
    const deliveryStatus = result.success ? 'sent' : 'failed';
    
    await supabase.from('delivery_logs').insert({
      user_id: userId,
      alert_instance_id: request.alert_instance_id,
      template_id: request.template_id,
      recipient_type: request.recipient_type,
      recipient_address: request.recipient_address,
      subject: request.subject,
      message_content: request.message_content,
      delivery_status: deliveryStatus,
      delivery_provider: request.recipient_type === 'email' ? 'sendgrid' : 'twilio',
      provider_message_id: result.messageId,
      delivery_time: result.success ? new Date().toISOString() : undefined,
      error_message: result.error,
      priority: request.priority || 5
    });
  } catch (error) {
    console.error('Error logging delivery attempt:', error);
  }
}

async function checkRateLimit(userId: string, settings: UserNotificationSettings): Promise<boolean> {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('delivery_logs')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', oneHourAgo);
    
    if (error) throw error;
    
    const sentInLastHour = data?.length || 0;
    return sentInLastHour < settings.rate_limit_per_hour;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return true; // Allow if we can't check
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const requestData: NotificationRequest = await req.json()
    
    console.log('Processing notification request:', requestData);

    // Get user notification settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_notification_settings')
      .select('*')
      .eq('user_id', requestData.user_id)
      .single();

    if (settingsError && settingsError.code !== 'PGRST116') {
      throw new Error(`Failed to get user settings: ${settingsError.message}`)
    }

    // Use default settings if none exist
    const userSettings: UserNotificationSettings = settings || {
      rate_limit_per_hour: 100,
      enable_delivery_tracking: true
    };

    // Check rate limit (skip for test messages)
    if (!requestData.is_test && !await checkRateLimit(requestData.user_id, userSettings)) {
      throw new Error('Rate limit exceeded');
    }

    let result: { success: boolean; messageId?: string; error?: string };

    // Send notification based on type
    switch (requestData.recipient_type) {
      case 'email':
        result = await sendEmailNotification(
          requestData.recipient_address,
          requestData.subject || 'Alert Notification',
          requestData.message_content,
          userSettings
        );
        break;
      
      case 'sms':
        result = await sendSMSNotification(
          requestData.recipient_address,
          requestData.message_content,
          userSettings
        );
        break;
      
      default:
        throw new Error(`Unsupported notification type: ${requestData.recipient_type}`);
    }

    // Log delivery attempt if tracking is enabled
    if (userSettings.enable_delivery_tracking) {
      await logDeliveryAttempt(requestData.user_id, requestData, result);
    }

    return new Response(JSON.stringify({
      success: result.success,
      message_id: result.messageId,
      error: result.error
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in send-alert-notification:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
