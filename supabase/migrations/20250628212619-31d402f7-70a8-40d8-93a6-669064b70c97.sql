
-- Check what KPI tables currently exist
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('kpi_metrics', 'kpi_events', 'kpi_aggregations', 'data_integration_sources')
ORDER BY table_name, ordinal_position;

-- Check what functions exist
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('calculate_performance_zone', 'trigger_kpi_event');

-- Check RLS policies
SELECT 
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('kpi_metrics', 'kpi_events', 'kpi_aggregations', 'data_integration_sources');
