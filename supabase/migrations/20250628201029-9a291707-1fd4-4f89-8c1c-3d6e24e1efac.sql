
-- Create alert rules and thresholds table
CREATE TABLE public.alert_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  rule_name TEXT NOT NULL,
  description TEXT,
  kpi_type TEXT NOT NULL, -- 'occupancy', 'noi', 'collections', 'maintenance_costs', etc.
  property_ids UUID[] DEFAULT '{}', -- empty array means all properties
  threshold_green_min NUMERIC,
  threshold_green_max NUMERIC,
  threshold_yellow_min NUMERIC,
  threshold_yellow_max NUMERIC,
  threshold_red_min NUMERIC,
  threshold_red_max NUMERIC,
  alert_frequency TEXT NOT NULL DEFAULT 'immediate', -- 'immediate', 'hourly', 'daily', 'weekly'
  notification_channels TEXT[] DEFAULT '{"dashboard"}', -- 'dashboard', 'email', 'sms'
  is_active BOOLEAN NOT NULL DEFAULT true,
  conditions JSONB DEFAULT '{}', -- additional conditions and logic
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alert instances table for tracking fired alerts
CREATE TABLE public.alert_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_rule_id UUID REFERENCES public.alert_rules(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  property_id UUID,
  property_name TEXT,
  kpi_type TEXT NOT NULL,
  kpi_value NUMERIC,
  alert_level TEXT NOT NULL, -- 'yellow', 'red'
  alert_message TEXT NOT NULL,
  trigger_data JSONB DEFAULT '{}', -- stores the exact data that triggered the alert
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES auth.users,
  resolved_at TIMESTAMP WITH TIME ZONE,
  notification_sent JSONB DEFAULT '{}', -- tracks which notifications were sent
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification queue table for reliable delivery
CREATE TABLE public.notification_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_instance_id UUID REFERENCES public.alert_instances(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  notification_type TEXT NOT NULL, -- 'email', 'sms', 'dashboard'
  recipient TEXT NOT NULL, -- email address, phone number, or user_id for dashboard
  subject TEXT,
  message TEXT NOT NULL,
  template_data JSONB DEFAULT '{}',
  priority INTEGER NOT NULL DEFAULT 5, -- 1=highest, 10=lowest
  max_retries INTEGER NOT NULL DEFAULT 3,
  retry_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alert processing log for monitoring
CREATE TABLE public.alert_processing_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  processing_type TEXT NOT NULL, -- 'kpi_check', 'notification_send', 'cleanup'
  properties_processed INTEGER DEFAULT 0,
  alerts_triggered INTEGER DEFAULT 0,
  notifications_sent INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'completed', 'failed'
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create user notification preferences
CREATE TABLE public.user_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  dashboard_enabled BOOLEAN NOT NULL DEFAULT true,
  email_address TEXT,
  phone_number TEXT,
  quiet_hours_start TIME DEFAULT '22:00:00',
  quiet_hours_end TIME DEFAULT '08:00:00',
  quiet_hours_timezone TEXT DEFAULT 'UTC',
  emergency_override BOOLEAN NOT NULL DEFAULT true, -- send critical alerts even during quiet hours
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_processing_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for alert_rules
CREATE POLICY "Users can manage their own alert rules" ON public.alert_rules
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for alert_instances
CREATE POLICY "Users can view their own alert instances" ON public.alert_instances
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own alert instances" ON public.alert_instances
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for notification_queue
CREATE POLICY "Users can view their own notifications" ON public.notification_queue
  FOR SELECT USING (auth.uid() = user_id);

-- RLS policies for alert_processing_log
CREATE POLICY "Users can view their own processing logs" ON public.alert_processing_log
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS policies for user_notification_preferences
CREATE POLICY "Users can manage their own notification preferences" ON public.user_notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_alert_rules_user_id ON public.alert_rules(user_id);
CREATE INDEX idx_alert_rules_active ON public.alert_rules(is_active) WHERE is_active = true;
CREATE INDEX idx_alert_instances_user_id ON public.alert_instances(user_id);
CREATE INDEX idx_alert_instances_status ON public.alert_instances(status);
CREATE INDEX idx_alert_instances_created_at ON public.alert_instances(created_at);
CREATE INDEX idx_notification_queue_status ON public.notification_queue(status);
CREATE INDEX idx_notification_queue_scheduled ON public.notification_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_notification_queue_user_id ON public.notification_queue(user_id);
CREATE INDEX idx_alert_processing_log_batch_id ON public.alert_processing_log(batch_id);
CREATE INDEX idx_alert_processing_log_started_at ON public.alert_processing_log(started_at);

-- Add triggers for updated_at
CREATE TRIGGER update_alert_rules_updated_at 
  BEFORE UPDATE ON public.alert_rules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_instances_updated_at 
  BEFORE UPDATE ON public.alert_instances 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_queue_updated_at 
  BEFORE UPDATE ON public.notification_queue 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notification_preferences_updated_at 
  BEFORE UPDATE ON public.user_notification_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create notification preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_notification_preferences (user_id, email_address)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create notification preferences
CREATE TRIGGER create_notification_preferences_on_user_creation
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_notification_preferences();

-- Enable realtime for alert instances and notification queue
ALTER TABLE public.alert_instances REPLICA IDENTITY FULL;
ALTER TABLE public.notification_queue REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.alert_instances;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notification_queue;
