
-- Create message templates table
CREATE TABLE public.message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('email', 'sms', 'push')),
  subject TEXT, -- for email templates
  message_content TEXT NOT NULL,
  variables JSONB DEFAULT '{}', -- available template variables
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery logs table for tracking all notifications
CREATE TABLE public.delivery_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  alert_instance_id UUID REFERENCES public.alert_instances(id),
  template_id UUID REFERENCES public.message_templates(id),
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('email', 'sms', 'push')),
  recipient_address TEXT NOT NULL,
  subject TEXT,
  message_content TEXT NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  delivery_provider TEXT, -- 'sendgrid', 'twilio', etc.
  provider_message_id TEXT,
  delivery_time TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  priority INTEGER DEFAULT 5, -- 1=highest, 10=lowest
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery statistics table for monitoring
CREATE TABLE public.delivery_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push')),
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_failed INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  delivery_rate NUMERIC DEFAULT 0,
  open_rate NUMERIC DEFAULT 0,
  click_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date, channel)
);

-- Create user notification settings table
CREATE TABLE public.user_notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  sendgrid_api_key_encrypted TEXT,
  twilio_account_sid_encrypted TEXT,
  twilio_auth_token_encrypted TEXT,
  twilio_phone_number TEXT,
  default_email_template_id UUID REFERENCES public.message_templates(id),
  default_sms_template_id UUID REFERENCES public.message_templates(id),
  rate_limit_per_hour INTEGER DEFAULT 100,
  enable_delivery_tracking BOOLEAN DEFAULT true,
  webhook_url TEXT, -- for delivery status updates
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for message_templates
CREATE POLICY "Users can manage their own message templates" ON public.message_templates
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for delivery_logs
CREATE POLICY "Users can view their own delivery logs" ON public.delivery_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage delivery logs" ON public.delivery_logs
  FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update delivery logs" ON public.delivery_logs
  FOR UPDATE USING (true);

-- RLS policies for delivery_statistics
CREATE POLICY "Users can view their own delivery statistics" ON public.delivery_statistics
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage delivery statistics" ON public.delivery_statistics
  FOR ALL WITH CHECK (true);

-- RLS policies for user_notification_settings
CREATE POLICY "Users can manage their own notification settings" ON public.user_notification_settings
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_message_templates_user_type ON public.message_templates(user_id, template_type);
CREATE INDEX idx_delivery_logs_user_status ON public.delivery_logs(user_id, delivery_status);
CREATE INDEX idx_delivery_logs_created_at ON public.delivery_logs(created_at);
CREATE INDEX idx_delivery_logs_alert_instance ON public.delivery_logs(alert_instance_id);
CREATE INDEX idx_delivery_statistics_user_date ON public.delivery_statistics(user_id, date);
CREATE INDEX idx_notification_queue_priority_scheduled ON public.notification_queue(priority, scheduled_for) WHERE status = 'pending';

-- Add triggers for updated_at
CREATE TRIGGER update_message_templates_updated_at 
  BEFORE UPDATE ON public.message_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_logs_updated_at 
  BEFORE UPDATE ON public.delivery_logs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_statistics_updated_at 
  BEFORE UPDATE ON public.delivery_statistics 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notification_settings_updated_at 
  BEFORE UPDATE ON public.user_notification_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for delivery logs
ALTER TABLE public.delivery_logs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_logs;

-- Create function to update delivery statistics
CREATE OR REPLACE FUNCTION public.update_delivery_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update daily statistics when delivery status changes
  INSERT INTO public.delivery_statistics (user_id, date, channel, total_sent, total_delivered, total_failed)
  VALUES (
    NEW.user_id,
    NEW.created_at::date,
    NEW.recipient_type,
    CASE WHEN NEW.delivery_status IN ('sent', 'delivered') THEN 1 ELSE 0 END,
    CASE WHEN NEW.delivery_status = 'delivered' THEN 1 ELSE 0 END,
    CASE WHEN NEW.delivery_status = 'failed' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, date, channel) DO UPDATE SET
    total_sent = delivery_statistics.total_sent + CASE WHEN NEW.delivery_status IN ('sent', 'delivered') THEN 1 ELSE 0 END,
    total_delivered = delivery_statistics.total_delivered + CASE WHEN NEW.delivery_status = 'delivered' THEN 1 ELSE 0 END,
    total_failed = delivery_statistics.total_failed + CASE WHEN NEW.delivery_status = 'failed' THEN 1 ELSE 0 END,
    delivery_rate = CASE 
      WHEN (delivery_statistics.total_sent + CASE WHEN NEW.delivery_status IN ('sent', 'delivered') THEN 1 ELSE 0 END) > 0 
      THEN (delivery_statistics.total_delivered + CASE WHEN NEW.delivery_status = 'delivered' THEN 1 ELSE 0 END)::numeric / 
           (delivery_statistics.total_sent + CASE WHEN NEW.delivery_status IN ('sent', 'delivered') THEN 1 ELSE 0 END)::numeric * 100
      ELSE 0 
    END,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for delivery statistics
CREATE TRIGGER delivery_logs_statistics_trigger
  AFTER INSERT OR UPDATE OF delivery_status ON public.delivery_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_delivery_statistics();
