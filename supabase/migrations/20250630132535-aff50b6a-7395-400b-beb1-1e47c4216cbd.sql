
-- Create table for automated report configurations
CREATE TABLE public.automated_report_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  report_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  schedule TEXT NOT NULL DEFAULT 'weekly',
  email_recipients TEXT[] DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  last_generated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.automated_report_configs ENABLE ROW LEVEL SECURITY;

-- Create policies for automated_report_configs
CREATE POLICY "Users can view their own report configs" 
  ON public.automated_report_configs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own report configs" 
  ON public.automated_report_configs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own report configs" 
  ON public.automated_report_configs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own report configs" 
  ON public.automated_report_configs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_automated_report_configs_updated_at
  BEFORE UPDATE ON public.automated_report_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
