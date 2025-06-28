
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PMSyncRequest {
  integrationId: string;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { integrationId, userId } = await req.json() as PMSyncRequest

    console.log(`Syncing PM data for integration ${integrationId}`)

    // Get integration details
    const { data: integration, error: integrationError } = await supabase
      .from('pm_integrations')
      .select('*')
      .eq('id', integrationId)
      .eq('user_id', userId)
      .single()

    if (integrationError || !integration) {
      throw new Error(`Integration not found: ${integrationError?.message}`)
    }

    // Update sync status
    await supabase
      .from('pm_integrations')
      .update({ 
        sync_status: 'syncing',
        last_sync: new Date().toISOString()
      })
      .eq('id', integrationId)

    let syncedData: any = {}
    let extractedKPIs: any[] = []

    // Sync based on PM software type
    switch (integration.pm_software.toLowerCase()) {
      case 'yardi':
        const yardiResult = await syncYardiData(integration)
        syncedData = yardiResult.data
        extractedKPIs = yardiResult.kpis
        break
      case 'appfolio':
        const appfolioResult = await syncAppFolioData(integration)
        syncedData = appfolioResult.data
        extractedKPIs = appfolioResult.kpis
        break
      case 'resman':
        const resmanResult = await syncResManData(integration)
        syncedData = resmanResult.data
        extractedKPIs = resmanResult.kpis
        break
      case 'entrata':
        const entrataResult = await syncEntrataData(integration)
        syncedData = entrataResult.data
        extractedKPIs = entrataResult.kpis
        break
      default:
        throw new Error(`Unsupported PM software: ${integration.pm_software}`)
    }

    // Store extracted KPIs
    for (const kpi of extractedKPIs) {
      await supabase
        .from('extracted_kpis')
        .insert({
          user_id: userId,
          kpi_type: kpi.type,
          kpi_name: kpi.name,
          kpi_value: kpi.value,
          kpi_unit: kpi.unit,
          period_start: kpi.period_start,
          period_end: kpi.period_end,
          property_name: kpi.property_name,
          extraction_confidence: kpi.confidence,
          raw_text: `Synced from ${integration.pm_software}`
        })
    }

    // Update integration with success status
    await supabase
      .from('pm_integrations')
      .update({
        sync_status: 'active',
        last_sync: new Date().toISOString(),
        error_log: null,
        settings: {
          ...integration.settings,
          last_sync_data: syncedData,
          last_sync_kpis: extractedKPIs.length
        }
      })
      .eq('id', integrationId)

    console.log(`Successfully synced ${extractedKPIs.length} KPIs from ${integration.pm_software}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'PM data synced successfully',
        syncedKPIs: extractedKPIs.length,
        pmSoftware: integration.pm_software
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error syncing PM data:', error)

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function syncYardiData(integration: any) {
  // Simulate Yardi API integration
  const mockData = {
    properties: [
      {
        name: "Sunset Gardens",
        occupancy: 94.2,
        rent_roll: 145000,
        collections: 98.5,
        maintenance_requests: 12
      }
    ]
  }

  const kpis = [
    {
      type: 'leasing',
      name: 'Occupancy Rate',
      value: 94.2,
      unit: '%',
      property_name: 'Sunset Gardens',
      confidence: 0.95,
      period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0]
    },
    {
      type: 'financial',
      name: 'Rent Roll',
      value: 145000,
      unit: '$',
      property_name: 'Sunset Gardens',
      confidence: 0.98,
      period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0]
    },
    {
      type: 'collections',
      name: 'Collection Rate',
      value: 98.5,
      unit: '%',
      property_name: 'Sunset Gardens',
      confidence: 0.95,
      period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0]
    }
  ]

  return { data: mockData, kpis }
}

async function syncAppFolioData(integration: any) {
  // Simulate AppFolio API integration
  const mockData = {
    properties: [
      {
        name: "Metro Apartments",
        occupancy: 91.8,
        rent_roll: 167000,
        collections: 96.2,
        maintenance_requests: 8
      }
    ]
  }

  const kpis = [
    {
      type: 'leasing',
      name: 'Occupancy Rate',
      value: 91.8,
      unit: '%',
      property_name: 'Metro Apartments',
      confidence: 0.95,
      period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0]
    },
    {
      type: 'financial',
      name: 'Rent Roll',
      value: 167000,
      unit: '$',
      property_name: 'Metro Apartments',
      confidence: 0.98,
      period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0]
    }
  ]

  return { data: mockData, kpis }
}

async function syncResManData(integration: any) {
  // Simulate ResMan API integration
  const mockData = {
    properties: [
      {
        name: "Downtown Towers",
        occupancy: 89.5,
        rent_roll: 201000,
        collections: 97.8,
        maintenance_requests: 15
      }
    ]
  }

  const kpis = [
    {
      type: 'leasing',
      name: 'Occupancy Rate',
      value: 89.5,
      unit: '%',
      property_name: 'Downtown Towers',
      confidence: 0.95,
      period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0]
    },
    {
      type: 'operations',
      name: 'Maintenance Requests',
      value: 15,
      unit: 'requests',
      property_name: 'Downtown Towers',
      confidence: 0.90,
      period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0]
    }
  ]

  return { data: mockData, kpis }
}

async function syncEntrataData(integration: any) {
  // Simulate Entrata API integration
  const mockData = {
    properties: [
      {
        name: "Riverside Commons",
        occupancy: 96.1,
        rent_roll: 182000,
        collections: 99.1,
        maintenance_requests: 6
      }
    ]
  }

  const kpis = [
    {
      type: 'leasing',
      name: 'Occupancy Rate',
      value: 96.1,
      unit: '%',
      property_name: 'Riverside Commons',
      confidence: 0.95,
      period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0]
    },
    {
      type: 'collections',
      name: 'Collection Rate',
      value: 99.1,
      unit: '%',
      property_name: 'Riverside Commons',
      confidence: 0.98,
      period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0]
    }
  ]

  return { data: mockData, kpis }
}
