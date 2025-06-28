
-- This query safely checks if the KPI tables exist without making any changes
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('kpi_metrics', 'kpi_events', 'kpi_aggregations', 'data_integration_sources')
ORDER BY table_name;

-- Check if the performance zone function exists
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'calculate_performance_zone';
