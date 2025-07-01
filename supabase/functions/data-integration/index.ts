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
    // Use the correct Supabase environment variables for edge functions
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    console.log('Edge function environment check:', {
      supabaseUrl: supabaseUrl ? 'Available' : 'Missing',
      supabaseKey: supabaseKey ? 'Available' : 'Missing'
    })

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables not configured properly')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (action) {
      case 'webhook':
        return await handleWebhook(supabase, req)
      case 'sync':
        return await syncDataSources(supabase, req)
      case 'test-connection':
        return await testConnection(supabase, req)
      default:
        throw new Error(`Unknown endpoint: ${action}`)
    }
  } catch (error) {
    console.error('Data integration error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function handleWebhook(supabase: any, req: Request) {
  const payload = await req.json()
  console.log('Received webhook payload:', payload)

  // Extract KPI data from webhook payload
  const kpiUpdates = extractKPIData(payload)

  // Process each KPI update
  const results = await Promise.all(
    kpiUpdates.map(async (kpi: any) => {
      // Call KPI processor function
      const processorResponse = await supabase.functions.invoke('kpi-processor', {
        body: { action: 'process_kpi_update', data: kpi }
      })

      return processorResponse
    })
  )

  return new Response(
    JSON.stringify({ success: true, processed: results.length }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function syncDataSources(supabase: any, req: Request) {
  const { user_id } = await req.json()

  // Get active data sources for user
  const { data: sources, error } = await supabase
    .from('data_integration_sources')
    .select('*')
    .eq('user_id', user_id)
    .eq('sync_status', 'active')

  if (error) throw error

  const syncResults = await Promise.all(
    sources.map(async (source: any) => {
      try {
        console.log('Syncing source:', source.source_name)
        
        // Simulate data sync based on source type
        const kpiData = await fetchDataFromSource(source)
        
        // Process KPI updates
        const processingPromises = kpiData.map((kpi: any) =>
          supabase.functions.invoke('kpi-processor', {
            body: { action: 'process_kpi_update', data: { user_id, ...kpi } }
          })
        )

        await Promise.all(processingPromises)

        // Update last sync time
        await supabase
          .from('data_integration_sources')
          .update({ last_sync_at: new Date().toISOString() })
          .eq('id', source.id)

        return { source: source.source_name, success: true, records: kpiData.length }
      } catch (error) {
        console.error(`Sync failed for ${source.source_name}:`, error)
        
        // Log error
        await supabase
          .from('data_integration_sources')
          .update({ error_log: error.message })
          .eq('id', source.id)

        return { source: source.source_name, success: false, error: error.message }
      }
    })
  )

  return new Response(
    JSON.stringify({ success: true, results: syncResults }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function testConnection(supabase: any, req: Request) {
  const { source_id } = await req.json()

  const { data: source, error } = await supabase
    .from('data_integration_sources')
    .select('*')
    .eq('id', source_id)
    .single()

  if (error) throw error

  try {
    // Test connection based on source type
    const testResult = await performConnectionTest(source)
    
    return new Response(
      JSON.stringify({ success: true, connection: 'active', details: testResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, connection: 'failed', error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

function extractKPIData(payload: any) {
  // Extract KPI data from various webhook formats
  const kpiUpdates = []

  // Property management software webhook format
  if (payload.property_data) {
    const propertyData = payload.property_data
    
    kpiUpdates.push({
      property_id: propertyData.property_id,
      category: 'leasing',
      metric_name: 'Occupancy Rate',
      metric_value: propertyData.occupancy_rate,
      metric_unit: '%',
      target_value: 95
    })

    if (propertyData.revenue) {
      kpiUpdates.push({
        property_id: propertyData.property_id,
        category: 'revenue',
        metric_name: 'Gross Revenue',
        metric_value: propertyData.revenue,
        metric_unit: '$',
        target_value: propertyData.revenue * 1.05
      })
    }
  }

  // Accounting software webhook format
  if (payload.financial_data) {
    const financialData = payload.financial_data
    
    kpiUpdates.push({
      property_id: financialData.property_id,
      category: 'financials',
      metric_name: 'NOI Margin',
      metric_value: financialData.noi_margin,
      metric_unit: '%',
      target_value: 60
    })
  }

  return kpiUpdates
}

async function fetchDataFromSource(source: any) {
  // Simulate fetching data from different source types
  const mockData = []

  switch (source.source_type) {
    case 'pm_software':
      mockData.push(
        {
          property_id: null,
          category: 'leasing',
          metric_name: 'Occupancy Rate',
          metric_value: 92 + Math.random() * 6,
          metric_unit: '%',
          target_value: 95
        },
        {
          property_id: null,
          category: 'leasing',
          metric_name: 'Average Days to Lease',
          metric_value: 15 + Math.random() * 10,
          metric_unit: 'days',
          target_value: 15
        }
      )
      break

    case 'accounting':
      mockData.push(
        {
          property_id: null,
          category: 'revenue',
          metric_name: 'Gross Revenue',
          metric_value: 2200000 + Math.random() * 400000,
          metric_unit: '$',
          target_value: 2300000
        },
        {
          property_id: null,
          category: 'financials',
          metric_name: 'NOI Margin',
          metric_value: 60 + Math.random() * 8,
          metric_unit: '%',
          target_value: 60
        }
      )
      break
  }

  return mockData
}

async function performConnectionTest(source: any) {
  // Simulate connection testing
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    status: 'connected',
    response_time: '245ms',
    last_data_point: new Date().toISOString()
  }
}
