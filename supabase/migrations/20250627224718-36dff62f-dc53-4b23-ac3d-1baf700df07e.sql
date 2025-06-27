
-- Create a table for user layout settings and preferences
CREATE TABLE public.user_layout_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  device_type TEXT NOT NULL DEFAULT 'desktop', -- 'mobile', 'tablet', 'desktop', 'tv'
  screen_width INTEGER,
  screen_height INTEGER,
  sidebar_collapsed BOOLEAN DEFAULT false,
  compact_view BOOLEAN DEFAULT false,
  card_layout TEXT DEFAULT 'grid', -- 'grid', 'list', 'compact'
  theme_preference TEXT DEFAULT 'light',
  font_size TEXT DEFAULT 'medium', -- 'small', 'medium', 'large'
  layout_density TEXT DEFAULT 'comfortable', -- 'compact', 'comfortable', 'spacious'
  custom_settings JSONB DEFAULT '{}',
  last_used TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_layout_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user layout settings
CREATE POLICY "Users can view their own layout settings" 
  ON public.user_layout_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own layout settings" 
  ON public.user_layout_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own layout settings" 
  ON public.user_layout_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own layout settings" 
  ON public.user_layout_settings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_user_layout_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_layout_settings_updated_at
  BEFORE UPDATE ON public.user_layout_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_layout_settings_updated_at();

-- Create index for better performance
CREATE INDEX idx_user_layout_settings_user_id ON public.user_layout_settings(user_id);
CREATE INDEX idx_user_layout_settings_device_type ON public.user_layout_settings(user_id, device_type);
