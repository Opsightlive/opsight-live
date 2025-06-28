
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, data } = await req.json()
    console.log('KPI Processor action:', action, 'data:', data)

    switch (action) {
      case 'process_kpi_update':
        return await processKPIUpdate(supabase, data)
      case 'aggregate_metrics':
        return await aggregateMetrics(supabase, data)
      case 'generate_forecasts':
        return await generateForecasts(supabase, data)
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  } catch (error) {
    console.error('KPI Processor error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function processKPIUpdate(supabase: any, data: any) {
  const { user_id, property_id, category, metric_name, metric_value, target_value, metric_unit } = data
  
  // Get previous value for comparison
  const { data: previousMetric } = await supabase
    .from('kpi_metrics')
    .select('metric_value')
    .eq('user_id', user_id)
    .eq('property_id', property_id)
    .eq('category', category)
    .eq('metric_name', metric_name)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const previous_value = previousMetric?.metric_value || 0
  const change_percentage = previous_value !== 0 
    ? ((metric_value - previous_value) / previous_value) * 100 
    : 0

  // Calculate performance zone
  const { data: zoneResult } = await supabase
    .rpc('calculate_performance_zone', {
      current_value: metric_value,
      target_value: target_value,
      metric_type: category === 'staffing' || category === 'risk' ? 'lower_better' : 'higher_better'
    })

  const performance_zone = zoneResult || 'yellow'

  // Insert new KPI metric
  const { data: newMetric, error } = await supabase
    .from('kpi_metrics')
    .insert({
      user_id,
      property_id,
      category,
      metric_name,
      metric_value,
      metric_unit,
      target_value,
      previous_value,
      change_percentage,
      performance_zone,
      period_start: new Date().toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0]
    })
    .select()
    .single()

  if (error) throw error

  console.log('Processed KPI update:', newMetric)

  return new Response(
    JSON.stringify({ success: true, metric: newMetric }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function aggregateMetrics(supabase: any, data: any) {
  const { user_id, category, period_start, period_end } = data

  // Aggregate metrics by category
  const { data: metrics, error } = await supabase
    .from('kpi_metrics')
    .select('metric_name, metric_value, property_id')
    .eq('user_id', user_id)
    .eq('category', category)
    .gte('period_start', period_start)
    .lte('period_end', period_end)

  if (error) throw error

  // Group by metric name and calculate aggregations
  const aggregations = metrics.reduce((acc: any, metric: any) => {
    if (!acc[metric.metric_name]) {
      acc[metric.metric_name] = {
        values: [],
        properties: new Set()
      }
    }
    acc[metric.metric_name].values.push(metric.metric_value)
    acc[metric.metric_name].properties.add(metric.property_id)
    return acc
  }, {})

  // Insert aggregations
  const aggregationPromises = Object.entries(aggregations).map(async ([metric_name, data]: [string, any]) => {
    const values = data.values
    const avg_value = values.reduce((sum: number, val: number) => sum + val, 0) / values.length

    return supabase
      .from('kpi_aggregations')
      .upsert({
        user_id,
        category,
        metric_name,
        aggregation_type: 'avg',
        aggregated_value: avg_value,
        period_start,
        period_end,
        property_count: data.properties.size
      })
  })

  await Promise.all(aggregationPromises)

  return new Response(
    JSON.stringify({ success: true, aggregated_metrics: Object.keys(aggregations).length }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function generateForecasts(supabase: any, data: any) {
  const { user_id, category } = data

  // Get historical data for forecasting
  const { data: historicalData, error } = await supabase
    .from('kpi_metrics')
    .select('metric_name, metric_value, created_at')
    .eq('user_id', user_id)
    .eq('category', category)
    .order('created_at', { ascending: true })
    .limit(100)

  if (error) throw error

  // Simple linear trend forecasting
  const forecasts = generateLinearForecasts(historicalData)

  console.log('Generated forecasts for', category, ':', forecasts.length, 'metrics')

  return new Response(
    JSON.stringify({ success: true, forecasts }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

function generateLinearForecasts(data: any[]) {
  const metricGroups = data.reduce((acc: any, item: any) => {
    if (!acc[item.metric_name]) {
      acc[item.metric_name] = []
    }
    acc[item.metric_name].push({
      value: item.metric_value,
      date: new Date(item.created_at).getTime()
    })
    return acc
  }, {})

  return Object.entries(metricGroups).map(([metric_name, values]: [string, any]) => {
    if (values.length < 2) return { metric_name, forecast: values[0]?.value || 0 }

    // Simple linear regression
    const n = values.length
    const sumX = values.reduce((sum: number, v: any) => sum + v.date, 0)
    const sumY = values.reduce((sum: number, v: any) => sum + v.value, 0)
    const sumXY = values.reduce((sum: number, v: any) => sum + (v.date * v.value), 0)
    const sumX2 = values.reduce((sum: number, v: any) => sum + (v.date * v.date), 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Forecast 30 days ahead
    const futureDate = Date.now() + (30 * 24 * 60 * 60 * 1000)
    const forecast = slope * futureDate + intercept

    return { metric_name, forecast: Math.max(0, forecast) }
  })
}
