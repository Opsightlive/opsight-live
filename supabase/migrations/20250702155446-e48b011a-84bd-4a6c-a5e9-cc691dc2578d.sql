
-- Create tables to track and enforce change isolation
CREATE TABLE public.change_validation_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  affected_modules TEXT[] NOT NULL,
  isolation_boundaries JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table to log all changes and their validation status
CREATE TABLE public.change_execution_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  change_description TEXT NOT NULL,
  affected_files TEXT[] NOT NULL,
  validation_status TEXT NOT NULL CHECK (validation_status IN ('BLOCKED', 'APPROVED', 'FAILED')),
  isolation_verified BOOLEAN DEFAULT false,
  rollback_data JSONB,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  executed_by TEXT,
  error_details TEXT
);

-- Create table to store module isolation boundaries
CREATE TABLE public.module_isolation_boundaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id TEXT NOT NULL UNIQUE,
  allowed_files TEXT[] NOT NULL,
  protected_functions TEXT[] NOT NULL,
  isolation_scope JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert core isolation rules that cannot be violated
INSERT INTO public.change_validation_rules (rule_name, rule_type, affected_modules, isolation_boundaries) VALUES
('Dashboard Protection', 'CRITICAL', ARRAY['Dashboard', 'KPI', 'PropertyManagement'], '{"protected_features": ["Dashboard Loading", "KPI Data Display", "Property Management Integration"]}'),
('Data Integration Protection', 'CRITICAL', ARRAY['DataIntegration', 'PMIntegration'], '{"protected_features": ["Data Source Connection", "User Authentication", "Real-time Updates"]}'),
('System Stability Core', 'SYSTEM', ARRAY['SystemStability'], '{"protected_features": ["System Monitoring", "Change Validation", "Isolation Enforcement"]}');

-- Create function to enforce isolation before any changes
CREATE OR REPLACE FUNCTION public.enforce_change_isolation()
RETURNS TRIGGER AS $$
DECLARE
  violation_count INTEGER;
BEGIN
  -- Check if change violates any active isolation rules
  SELECT COUNT(*) INTO violation_count
  FROM public.change_validation_rules cvr
  WHERE cvr.is_active = true
    AND (NEW.affected_files && (
      SELECT array_agg(boundary->>'protected_files')
      FROM jsonb_array_elements(cvr.isolation_boundaries) AS boundary
    ));
  
  IF violation_count > 0 THEN
    RAISE EXCEPTION 'ISOLATION VIOLATION: Change blocked by enforcement system. Contact system administrator.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce isolation on every change attempt
CREATE TRIGGER enforce_isolation_trigger
  BEFORE INSERT ON public.change_execution_log
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_change_isolation();

-- Enable RLS on all validation tables
ALTER TABLE public.change_validation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_execution_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_isolation_boundaries ENABLE ROW LEVEL SECURITY;

-- Create policies for system-level access
CREATE POLICY "System rules are read-only" ON public.change_validation_rules
  FOR SELECT USING (true);

CREATE POLICY "Change log is append-only" ON public.change_execution_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Isolation boundaries are protected" ON public.module_isolation_boundaries
  FOR SELECT USING (true);
