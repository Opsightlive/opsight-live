
-- Create LP report templates table
CREATE TABLE public.lp_report_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  template_name TEXT NOT NULL,
  description TEXT,
  sections JSONB NOT NULL DEFAULT '[]', -- array of section configurations
  chart_configs JSONB DEFAULT '{}', -- chart display settings
  ai_summary_enabled BOOLEAN DEFAULT true,
  auto_generation_enabled BOOLEAN DEFAULT false,
  generation_schedule TEXT, -- cron-like schedule
  email_recipients TEXT[], -- array of email addresses
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create LP reports table for generated reports
CREATE TABLE public.lp_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  template_id UUID REFERENCES public.lp_report_templates(id),
  report_title TEXT NOT NULL,
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  property_ids UUID[] DEFAULT '{}', -- properties included in report
  report_data JSONB NOT NULL DEFAULT '{}', -- compiled report data
  ai_summary TEXT, -- AI-generated summary
  generation_status TEXT NOT NULL DEFAULT 'queued' CHECK (generation_status IN ('queued', 'processing', 'completed', 'failed')),
  pdf_storage_path TEXT, -- path to generated PDF
  error_message TEXT,
  generated_at TIMESTAMP WITH TIME ZONE,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  file_size_bytes BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create report generation queue for batch processing
CREATE TABLE public.report_generation_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  template_id UUID REFERENCES public.lp_report_templates(id),
  report_id UUID REFERENCES public.lp_reports(id),
  priority INTEGER DEFAULT 5, -- 1=highest, 10=lowest
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  worker_id TEXT, -- for tracking which worker is processing
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create report analytics table for tracking usage
CREATE TABLE public.report_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  report_id UUID REFERENCES public.lp_reports(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('generated', 'downloaded', 'emailed', 'viewed')),
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.lp_report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lp_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_generation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for lp_report_templates
CREATE POLICY "Users can manage their own report templates" ON public.lp_report_templates
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for lp_reports
CREATE POLICY "Users can manage their own reports" ON public.lp_reports
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for report_generation_queue
CREATE POLICY "Users can view their own report queue" ON public.report_generation_queue
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage report queue" ON public.report_generation_queue
  FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update report queue" ON public.report_generation_queue
  FOR UPDATE USING (true);

-- RLS policies for report_analytics
CREATE POLICY "Users can view their own report analytics" ON public.report_analytics
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert analytics" ON public.report_analytics
  FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_lp_report_templates_user_active ON public.lp_report_templates(user_id, is_active);
CREATE INDEX idx_lp_reports_user_status ON public.lp_reports(user_id, generation_status);
CREATE INDEX idx_lp_reports_period ON public.lp_reports(report_period_start, report_period_end);
CREATE INDEX idx_report_queue_status_priority ON public.report_generation_queue(status, priority, scheduled_for);
CREATE INDEX idx_report_queue_user_status ON public.report_generation_queue(user_id, status);
CREATE INDEX idx_report_analytics_user_type ON public.report_analytics(user_id, event_type);
CREATE INDEX idx_report_analytics_report_created ON public.report_analytics(report_id, created_at);

-- Add triggers for updated_at
CREATE TRIGGER update_lp_report_templates_updated_at 
  BEFORE UPDATE ON public.lp_report_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lp_reports_updated_at 
  BEFORE UPDATE ON public.lp_reports 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for reports
ALTER TABLE public.lp_reports REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lp_reports;

-- Function to clean up old report queue entries
CREATE OR REPLACE FUNCTION public.cleanup_report_queue()
RETURNS void AS $$
BEGIN
  -- Delete completed queue entries older than 7 days
  DELETE FROM public.report_generation_queue 
  WHERE status IN ('completed', 'failed') 
    AND created_at < now() - INTERVAL '7 days';
    
  -- Delete failed entries with max retries exceeded older than 1 day
  DELETE FROM public.report_generation_queue 
  WHERE status = 'failed' 
    AND retry_count >= max_retries 
    AND created_at < now() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Function to get report generation statistics
CREATE OR REPLACE FUNCTION public.get_report_statistics(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  total_reports BIGINT,
  completed_reports BIGINT,
  failed_reports BIGINT,
  avg_generation_time_minutes NUMERIC,
  total_downloads BIGINT,
  total_emails_sent BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_reports,
    COUNT(*) FILTER (WHERE r.generation_status = 'completed') as completed_reports,
    COUNT(*) FILTER (WHERE r.generation_status = 'failed') as failed_reports,
    COALESCE(AVG(EXTRACT(EPOCH FROM (r.generated_at - r.created_at)) / 60), 0) as avg_generation_time_minutes,
    COALESCE(SUM(r.download_count), 0) as total_downloads,
    COUNT(*) FILTER (WHERE r.email_sent_at IS NOT NULL) as total_emails_sent
  FROM public.lp_reports r
  WHERE r.user_id = p_user_id 
    AND r.created_at >= now() - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
