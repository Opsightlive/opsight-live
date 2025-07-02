-- Fix security vulnerabilities in RLS policies
-- Remove public write access and restrict to system operations only

-- Drop existing insecure policies
DROP POLICY IF EXISTS "System can manage delivery logs" ON public.delivery_logs;
DROP POLICY IF EXISTS "System can manage delivery statistics" ON public.delivery_statistics;
DROP POLICY IF EXISTS "System can manage KPI aggregations" ON public.kpi_aggregations;
DROP POLICY IF EXISTS "System can create KPI events" ON public.kpi_events;
DROP POLICY IF EXISTS "System can insert KPI updates" ON public.kpi_updates;
DROP POLICY IF EXISTS "System can insert analytics" ON public.report_analytics;
DROP POLICY IF EXISTS "System can manage report queue" ON public.report_generation_queue;
DROP POLICY IF EXISTS "System can insert activity logs" ON public.user_activity_logs;

-- Create secure policies that only allow authenticated system operations
-- These tables should only be written to by backend processes, not client code

-- Delivery logs - only allow service role or specific system operations
CREATE POLICY "Service role can manage delivery logs" ON public.delivery_logs
FOR ALL USING (auth.role() = 'service_role');

-- Delivery statistics - only allow service role
CREATE POLICY "Service role can manage delivery statistics" ON public.delivery_statistics
FOR ALL USING (auth.role() = 'service_role');

-- KPI aggregations - only allow service role
CREATE POLICY "Service role can manage KPI aggregations" ON public.kpi_aggregations
FOR ALL USING (auth.role() = 'service_role');

-- KPI events - only allow service role
CREATE POLICY "Service role can manage KPI events" ON public.kpi_events
FOR ALL USING (auth.role() = 'service_role');

-- KPI updates - only allow service role
CREATE POLICY "Service role can manage KPI updates" ON public.kpi_updates
FOR ALL USING (auth.role() = 'service_role');

-- Report analytics - only allow service role
CREATE POLICY "Service role can manage report analytics" ON public.report_analytics
FOR ALL USING (auth.role() = 'service_role');

-- Report generation queue - only allow service role
CREATE POLICY "Service role can manage report queue" ON public.report_generation_queue
FOR ALL USING (auth.role() = 'service_role');

-- User activity logs - only allow service role
CREATE POLICY "Service role can manage activity logs" ON public.user_activity_logs
FOR ALL USING (auth.role() = 'service_role');