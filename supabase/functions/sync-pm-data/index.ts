
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PMSyncRequest {
  integrationId: string;
  userId: string;
  testMode?: boolean;
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

    const { integrationId, userId, testMode = false } = await req.json() as PMSyncRequest

    console.log(`PM data sync requested for integration ${integrationId}, testMode: ${testMode}`)

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
        sync_status: 'error',
        error_log: 'Real OneSite integration not implemented. This system cannot actually connect to OneSite or scrape real data.',
        last_sync: new Date().toISOString()
      })
      .eq('id', integrationId)

    console.log('Integration marked as error - real scraping not implemented')

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Real OneSite integration is not implemented. This system cannot actually connect to OneSite or extract real property data. Only test mode with mock data is available.'
      }),
      { 
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in PM sync function:', error)

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
