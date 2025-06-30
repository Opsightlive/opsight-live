
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

    // Decrypt credentials
    let credentials;
    try {
      credentials = JSON.parse(atob(integration.credentials_encrypted));
    } catch (error) {
      throw new Error('Invalid credentials format');
    }

    // Update sync status to syncing
    await supabase
      .from('pm_integrations')
      .update({ sync_status: 'syncing' })
      .eq('id', integrationId)

    console.log('Starting Puppeteer scraping for OneSite...')

    // Import Puppeteer dynamically for Deno edge functions
    const puppeteer = await import('https://deno.land/x/puppeteer@16.2.0/mod.ts')
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    
    try {
      // Navigate to OneSite login
      console.log('Navigating to OneSite login...')
      await page.goto('https://www.onesite.com/login', { waitUntil: 'networkidle2' })

      // Login with credentials
      console.log('Logging into OneSite...')
      await page.type('input[name="username"], input[type="email"]', credentials.username)
      await page.type('input[name="password"], input[type="password"]', credentials.password)
      
      // Click login button
      await page.click('button[type="submit"], input[type="submit"], .login-button')
      await page.waitForNavigation({ waitUntil: 'networkidle2' })

      // Look for Trinity Trace property
      console.log('Searching for Trinity Trace property...')
      
      // Try to find Trinity Trace in property list/dropdown
      const trinityTraceFound = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.some(el => 
          el.textContent && el.textContent.toLowerCase().includes('trinity trace')
        );
      });

      if (!trinityTraceFound) {
        throw new Error('Trinity Trace property not found in OneSite portal');
      }

      // Click on Trinity Trace property
      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const trinityElement = elements.find(el => 
          el.textContent && el.textContent.toLowerCase().includes('trinity trace')
        );
        if (trinityElement) {
          trinityElement.click();
        }
      });

      await page.waitForTimeout(3000); // Wait for property to load

      // Extract key metrics
      console.log('Extracting Trinity Trace data...')
      
      const propertyData = await page.evaluate(() => {
        const data = {
          occupancyRate: null,
          totalUnits: null,
          availableUnits: null,
          monthlyRevenue: null,
          avgRent: null
        };

        // Look for common OneSite data patterns
        const getText = (selector) => {
          const el = document.querySelector(selector);
          return el ? el.textContent.trim() : null;
        };

        // Try various selectors that OneSite might use
        const occupancySelectors = [
          '[data-testid*="occupancy"]',
          '.occupancy-rate',
          '*[class*="occupancy"]',
          '*[id*="occupancy"]'
        ];

        const unitSelectors = [
          '[data-testid*="units"]',
          '.unit-count',
          '*[class*="unit"]',
          '*[id*="unit"]'
        ];

        const revenueSelectors = [
          '[data-testid*="revenue"]',
          '.revenue',
          '*[class*="revenue"]',
          '*[id*="revenue"]'
        ];

        // Extract occupancy rate
        for (const selector of occupancySelectors) {
          const text = getText(selector);
          if (text && text.includes('%')) {
            data.occupancyRate = parseFloat(text.replace('%', ''));
            break;
          }
        }

        // Extract unit counts
        for (const selector of unitSelectors) {
          const text = getText(selector);
          if (text && /\d+/.test(text)) {
            const numbers = text.match(/\d+/g);
            if (numbers) {
              data.totalUnits = parseInt(numbers[0]);
              break;
            }
          }
        }

        // Extract revenue data
        for (const selector of revenueSelectors) {
          const text = getText(selector);
          if (text && /\$/.test(text)) {
            const amount = text.replace(/[^\d.]/g, '');
            data.monthlyRevenue = parseFloat(amount);
            break;
          }
        }

        return data;
      });

      console.log('Extracted property data:', propertyData);

      // Store extracted KPIs in database
      const kpiInserts = [];
      
      if (propertyData.occupancyRate !== null) {
        kpiInserts.push({
          user_id: userId,
          integration_id: integrationId,
          kpi_type: 'leasing',
          kpi_name: 'Occupancy Rate',
          kpi_value: propertyData.occupancyRate,
          kpi_unit: '%',
          property_name: 'Trinity Trace',
          extraction_confidence: 0.85,
          source_system: 'OneSite'
        });
      }

      if (propertyData.totalUnits !== null) {
        kpiInserts.push({
          user_id: userId,
          integration_id: integrationId,
          kpi_type: 'property',
          kpi_name: 'Total Units',
          kpi_value: propertyData.totalUnits,
          kpi_unit: 'units',
          property_name: 'Trinity Trace',
          extraction_confidence: 0.9,
          source_system: 'OneSite'
        });
      }

      if (propertyData.monthlyRevenue !== null) {
        kpiInserts.push({
          user_id: userId,
          integration_id: integrationId,
          kpi_type: 'financial',
          kpi_name: 'Monthly Revenue',
          kpi_value: propertyData.monthlyRevenue,
          kpi_unit: '$',
          property_name: 'Trinity Trace',
          extraction_confidence: 0.8,
          source_system: 'OneSite'
        });
      }

      if (kpiInserts.length > 0) {
        const { error: kpiError } = await supabase
          .from('extracted_kpis')
          .insert(kpiInserts);

        if (kpiError) {
          console.error('Error inserting KPIs:', kpiError);
        }
      }

      // Update integration status to active
      await supabase
        .from('pm_integrations')
        .update({ 
          sync_status: 'active',
          last_sync: new Date().toISOString(),
          error_log: null
        })
        .eq('id', integrationId)

      await browser.close();

      console.log(`Successfully extracted ${kpiInserts.length} KPIs from Trinity Trace`)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Successfully scraped Trinity Trace data from OneSite',
          syncedKPIs: kpiInserts.length,
          pmSoftware: 'OneSite',
          propertyName: 'Trinity Trace',
          extractedData: propertyData
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )

    } catch (scrapingError) {
      await browser.close();
      throw scrapingError;
    }

  } catch (error) {
    console.error('Error in PM sync function:', error)

    // Update integration with error status
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabase
      .from('pm_integrations')
      .update({ 
        sync_status: 'error',
        error_log: error.message
      })
      .eq('id', req.json().integrationId)

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
