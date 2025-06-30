
-- Enable real-time updates for remaining tables (kpi_metrics might already be enabled)
ALTER TABLE public.kpi_events REPLICA IDENTITY FULL;
ALTER TABLE public.pm_integrations REPLICA IDENTITY FULL;
ALTER TABLE public.extracted_kpis REPLICA IDENTITY FULL;

-- Add only the tables that aren't already in the publication
-- We'll check each one individually to avoid errors
DO $$
BEGIN
    -- Try to add kpi_events to realtime publication
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.kpi_events;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already in publication, skip
        NULL;
    END;
    
    -- Try to add pm_integrations to realtime publication
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.pm_integrations;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already in publication, skip
        NULL;
    END;
    
    -- Try to add extracted_kpis to realtime publication
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.extracted_kpis;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already in publication, skip
        NULL;
    END;
END $$;

-- Create a function to broadcast integration status changes
CREATE OR REPLACE FUNCTION public.broadcast_integration_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Trigger real-time event when integration status changes
  PERFORM pg_notify(
    'integration_status_change',
    json_build_object(
      'user_id', NEW.user_id,
      'integration_id', NEW.id,
      'status', NEW.sync_status,
      'pm_software', NEW.pm_software,
      'last_sync', NEW.last_sync
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS integration_status_trigger ON public.pm_integrations;
CREATE TRIGGER integration_status_trigger
  AFTER UPDATE ON public.pm_integrations
  FOR EACH ROW
  WHEN (OLD.sync_status IS DISTINCT FROM NEW.sync_status OR OLD.last_sync IS DISTINCT FROM NEW.last_sync)
  EXECUTE FUNCTION public.broadcast_integration_status();

-- Create a function to broadcast new KPI data
CREATE OR REPLACE FUNCTION public.broadcast_kpi_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Trigger real-time event when new KPIs are added
  PERFORM pg_notify(
    'kpi_data_update',
    json_build_object(
      'user_id', NEW.user_id,
      'kpi_type', NEW.kpi_type,
      'kpi_name', NEW.kpi_name,
      'kpi_value', NEW.kpi_value,
      'property_name', NEW.property_name,
      'created_at', NEW.created_at
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS kpi_update_trigger ON public.extracted_kpis;
CREATE TRIGGER kpi_update_trigger
  AFTER INSERT ON public.extracted_kpis
  FOR EACH ROW
  EXECUTE FUNCTION public.broadcast_kpi_update();
