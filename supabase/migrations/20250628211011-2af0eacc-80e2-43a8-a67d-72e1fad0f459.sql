
-- Create comprehensive KPI metrics table
CREATE TABLE public.kpi_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  property_id UUID REFERENCES public.user_properties(id),
  category TEXT NOT NULL, -- 'leasing', 'revenue', 'staffing', 'financials', 'risk'
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT, -- '%', '$', 'days', 'count', etc.
  target_value NUMERIC,
  previous_value NUMERIC,
  change_percentage NUMERIC,
  performance_zone TEXT CHECK (performance_zone IN ('green', 'yellow', 'red')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create KPI aggregations table for pre-calculated totals
CREATE TABLE public.kpi_aggregations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  category TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  aggregation_type TEXT NOT NULL, -- 'sum', 'avg', 'count', 'latest'
  aggregated_value NUMERIC NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  property_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create KPI real-time events table for streaming updates
CREATE TABLE public.kpi_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  property_id UUID REFERENCES public.user_properties(id),
  event_type TEXT NOT NULL, -- 'metric_update', 'threshold_breach', 'forecast_change'
  category TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  old_value NUMERIC,
  new_value NUMERIC,
  alert_level TEXT CHECK (alert_level IN ('low', 'medium', 'high', 'critical')),
  event_data JSONB DEFAULT '{}',
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data integration sources table
CREATE TABLE public.data_integration_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'pm_software', 'accounting', 'api_webhook', 'manual'
  endpoint_url TEXT,
  api_credentials_encrypted TEXT,
  mapping_config JSONB DEFAULT '{}', -- maps source fields to our KPI metrics
  sync_frequency TEXT DEFAULT 'hourly', -- 'realtime', 'hourly', 'daily'
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'active',
  error_log TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_aggregations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_integration_sources ENABLE ROW LEVEL SECURITY;

-- RLS policies for kpi_metrics
CREATE POLICY "Users can manage their own KPI metrics" ON public.kpi_metrics
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for kpi_aggregations
CREATE POLICY "Users can view their own KPI aggregations" ON public.kpi_aggregations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage KPI aggregations" ON public.kpi_aggregations
  FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update KPI aggregations" ON public.kpi_aggregations
  FOR UPDATE USING (true);

-- RLS policies for kpi_events
CREATE POLICY "Users can view their own KPI events" ON public.kpi_events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create KPI events" ON public.kpi_events
  FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update KPI events" ON public.kpi_events
  FOR UPDATE USING (true);

-- RLS policies for data_integration_sources
CREATE POLICY "Users can manage their own data sources" ON public.data_integration_sources
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_kpi_metrics_user_category ON public.kpi_metrics(user_id, category);
CREATE INDEX idx_kpi_metrics_property_period ON public.kpi_metrics(property_id, period_start, period_end);
CREATE INDEX idx_kpi_aggregations_user_category ON public.kpi_aggregations(user_id, category);
CREATE INDEX idx_kpi_events_user_processed ON public.kpi_events(user_id, processed);
CREATE INDEX idx_kpi_events_created_at ON public.kpi_events(created_at);
CREATE INDEX idx_data_sources_user_status ON public.data_integration_sources(user_id, sync_status);

-- Add triggers for updated_at
CREATE TRIGGER update_kpi_metrics_updated_at 
  BEFORE UPDATE ON public.kpi_metrics 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_integration_sources_updated_at 
  BEFORE UPDATE ON public.data_integration_sources 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for KPI events and metrics
ALTER TABLE public.kpi_events REPLICA IDENTITY FULL;
ALTER TABLE public.kpi_metrics REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.kpi_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kpi_metrics;

-- Create function to calculate performance zones
CREATE OR REPLACE FUNCTION public.calculate_performance_zone(
  current_value NUMERIC,
  target_value NUMERIC,
  metric_type TEXT DEFAULT 'higher_better'
) RETURNS TEXT AS $$
BEGIN
  IF target_value IS NULL THEN
    RETURN 'yellow';
  END IF;
  
  IF metric_type = 'higher_better' THEN
    IF current_value >= target_value THEN
      RETURN 'green';
    ELSIF current_value >= target_value * 0.9 THEN
      RETURN 'yellow';
    ELSE
      RETURN 'red';
    END IF;
  ELSE -- lower_better for things like expenses, days to lease
    IF current_value <= target_value THEN
      RETURN 'green';
    ELSIF current_value <= target_value * 1.1 THEN
      RETURN 'yellow';
    ELSE
      RETURN 'red';
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to trigger KPI events on metric changes
CREATE OR REPLACE FUNCTION public.trigger_kpi_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert event for significant changes (>5% change)
  IF (OLD.metric_value IS NULL OR 
      ABS((NEW.metric_value - OLD.metric_value) / NULLIF(OLD.metric_value, 0)) > 0.05) THEN
    
    INSERT INTO public.kpi_events (
      user_id,
      property_id,
      event_type,
      category,
      metric_name,
      old_value,
      new_value,
      alert_level,
      event_data
    ) VALUES (
      NEW.user_id,
      NEW.property_id,
      'metric_update',
      NEW.category,
      NEW.metric_name,
      OLD.metric_value,
      NEW.metric_value,
      CASE 
        WHEN NEW.performance_zone = 'red' THEN 'high'
        WHEN NEW.performance_zone = 'yellow' THEN 'medium'
        ELSE 'low'
      END,
      jsonb_build_object(
        'change_percentage', NEW.change_percentage,
        'performance_zone', NEW.performance_zone
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for KPI metric changes
CREATE TRIGGER kpi_metrics_change_trigger
  AFTER UPDATE ON public.kpi_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_kpi_event();
