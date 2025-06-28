
-- Create table for storing uploaded documents
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processing_status TEXT NOT NULL DEFAULT 'pending',
  processing_error TEXT,
  extracted_data JSONB DEFAULT '{}',
  confidence_score NUMERIC(5,2),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for extracted KPIs
CREATE TABLE public.extracted_kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  kpi_type TEXT NOT NULL, -- 'leasing', 'collections', 'staffing', 'financial', 'operations'
  kpi_name TEXT NOT NULL,
  kpi_value NUMERIC,
  kpi_unit TEXT,
  period_start DATE,
  period_end DATE,
  property_name TEXT,
  extraction_confidence NUMERIC(5,2),
  raw_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for PM software integrations
CREATE TABLE public.pm_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  pm_software TEXT NOT NULL, -- 'yardi', 'appfolio', 'resman', 'entrata', etc.
  integration_name TEXT NOT NULL,
  api_endpoint TEXT,
  credentials_encrypted TEXT, -- encrypted JSON with API keys/credentials
  sync_frequency TEXT NOT NULL DEFAULT 'daily', -- 'realtime', 'hourly', 'daily', 'weekly'
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_status TEXT NOT NULL DEFAULT 'active',
  error_log TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for background processing jobs
CREATE TABLE public.processing_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  job_type TEXT NOT NULL, -- 'document_processing', 'pm_sync', 'kpi_extraction'
  job_status TEXT NOT NULL DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed'
  priority INTEGER NOT NULL DEFAULT 5,
  payload JSONB NOT NULL DEFAULT '{}',
  result JSONB DEFAULT '{}',
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pm_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;

-- RLS policies for documents
CREATE POLICY "Users can view their own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own documents" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for extracted KPIs
CREATE POLICY "Users can view their own KPIs" ON public.extracted_kpis
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own KPIs" ON public.extracted_kpis
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own KPIs" ON public.extracted_kpis
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own KPIs" ON public.extracted_kpis
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for PM integrations
CREATE POLICY "Users can view their own integrations" ON public.pm_integrations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own integrations" ON public.pm_integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own integrations" ON public.pm_integrations
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own integrations" ON public.pm_integrations
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for processing jobs
CREATE POLICY "Users can view their own jobs" ON public.processing_jobs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own jobs" ON public.processing_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own jobs" ON public.processing_jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false);

-- Storage policies for documents bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create indexes for performance
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_processing_status ON public.documents(processing_status);
CREATE INDEX idx_extracted_kpis_user_id ON public.extracted_kpis(user_id);
CREATE INDEX idx_extracted_kpis_document_id ON public.extracted_kpis(document_id);
CREATE INDEX idx_extracted_kpis_kpi_type ON public.extracted_kpis(kpi_type);
CREATE INDEX idx_pm_integrations_user_id ON public.pm_integrations(user_id);
CREATE INDEX idx_processing_jobs_user_id ON public.processing_jobs(user_id);
CREATE INDEX idx_processing_jobs_status ON public.processing_jobs(job_status);

-- Add triggers for updated_at
CREATE TRIGGER update_documents_updated_at 
  BEFORE UPDATE ON public.documents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pm_integrations_updated_at 
  BEFORE UPDATE ON public.pm_integrations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
