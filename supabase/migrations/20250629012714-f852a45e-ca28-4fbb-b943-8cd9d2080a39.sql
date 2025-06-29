
-- Create table to track module configurations and states
CREATE TABLE public.module_states (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  module_name text NOT NULL,
  module_version text NOT NULL DEFAULT '1.0.0',
  configuration jsonb NOT NULL DEFAULT '{}',
  feature_flags jsonb NOT NULL DEFAULT '{}',
  data_schema jsonb NOT NULL DEFAULT '{}',
  ui_layout jsonb NOT NULL DEFAULT '{}',
  business_logic jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE(user_id, module_name)
);

-- Create table to track feature history and changes
CREATE TABLE public.feature_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  module_name text NOT NULL,
  feature_name text NOT NULL,
  change_type text NOT NULL CHECK (change_type IN ('created', 'updated', 'disabled', 'enabled', 'deleted')),
  previous_state jsonb,
  new_state jsonb NOT NULL,
  change_description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL
);

-- Create table to store application-wide consistency rules
CREATE TABLE public.consistency_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  rule_name text NOT NULL,
  rule_type text NOT NULL CHECK (rule_type IN ('layout', 'navigation', 'data_flow', 'business_logic', 'ui_pattern')),
  rule_definition jsonb NOT NULL,
  affected_modules text[] NOT NULL DEFAULT '{}',
  is_enforced boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, rule_name)
);

-- Create table to track cross-module dependencies
CREATE TABLE public.module_dependencies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  source_module text NOT NULL,
  target_module text NOT NULL,
  dependency_type text NOT NULL CHECK (dependency_type IN ('data', 'ui', 'navigation', 'business_logic')),
  dependency_details jsonb NOT NULL DEFAULT '{}',
  is_critical boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, source_module, target_module, dependency_type)
);

-- Enable Row Level Security
ALTER TABLE public.module_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consistency_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_dependencies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for module_states
CREATE POLICY "Users can view their own module states" 
  ON public.module_states 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own module states" 
  ON public.module_states 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own module states" 
  ON public.module_states 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for feature_history
CREATE POLICY "Users can view their own feature history" 
  ON public.feature_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create feature history entries" 
  ON public.feature_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND auth.uid() = created_by);

-- Create RLS policies for consistency_rules
CREATE POLICY "Users can view their own consistency rules" 
  ON public.consistency_rules 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own consistency rules" 
  ON public.consistency_rules 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for module_dependencies
CREATE POLICY "Users can view their own module dependencies" 
  ON public.module_dependencies 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own module dependencies" 
  ON public.module_dependencies 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_module_states_user_module ON public.module_states(user_id, module_name);
CREATE INDEX idx_feature_history_user_module ON public.feature_history(user_id, module_name);
CREATE INDEX idx_feature_history_created_at ON public.feature_history(created_at DESC);
CREATE INDEX idx_consistency_rules_user_type ON public.consistency_rules(user_id, rule_type);
CREATE INDEX idx_module_dependencies_source ON public.module_dependencies(user_id, source_module);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_module_states_updated_at
  BEFORE UPDATE ON public.module_states
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consistency_rules_updated_at
  BEFORE UPDATE ON public.consistency_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically track feature changes
CREATE OR REPLACE FUNCTION public.track_module_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into feature_history when module_states changes
  INSERT INTO public.feature_history (
    user_id,
    module_name,
    feature_name,
    change_type,
    previous_state,
    new_state,
    change_description,
    created_by
  ) VALUES (
    NEW.user_id,
    NEW.module_name,
    'module_configuration',
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'created'
      WHEN TG_OP = 'UPDATE' THEN 'updated'
    END,
    CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
    row_to_json(NEW),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'Module state created'
      WHEN TG_OP = 'UPDATE' THEN 'Module state updated'
    END,
    NEW.user_id
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic change tracking
CREATE TRIGGER track_module_state_changes
  AFTER INSERT OR UPDATE ON public.module_states
  FOR EACH ROW
  EXECUTE FUNCTION public.track_module_changes();
