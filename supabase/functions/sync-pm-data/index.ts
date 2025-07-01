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
    // Use hardcoded values since Railway environment variables aren't working
    const supabase = createClient(
      'https://oafnvnczdrcuvbdizqif.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZm52bmN6ZHJjdXZiZGl6cWlmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MjE0MCwiZXhwIjoyMDY2NjI4MTQwfQ.Xa2qJkF9_Nw5k7z_8gVDiNkHT8tBE1nKn4xkH0zXgJE'
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

    if (testMode) {
      console.log('Running in TEST MODE - generating realistic demo data')
      
      // Generate realistic demo data for Trinity Trace
      const demoData = {
        occupancyRate: 94.2,
        totalUnits: 312,
        availableUnits: 18,
        monthlyRevenue: 485000,
        avgRent: 1850
      };

      // Store demo KPIs in database
      const kpiInserts = [
        {
          user_id: userId,
          integration_id: integrationId,
          kpi_type: 'leasing',
          kpi_name: 'Occupancy Rate',
          kpi_value: demoData.occupancyRate,
          kpi_unit: '%',
          property_name: 'Trinity Trace',
          extraction_confidence: 1.0,
          source_system: 'OneSite Demo'
        },
        {
          user_id: userId,
          integration_id: integrationId,
          kpi_type: 'property',
          kpi_name: 'Total Units',
          kpi_value: demoData.totalUnits,
          kpi_unit: 'units',
          property_name: 'Trinity Trace',
          extraction_confidence: 1.0,
          source_system: 'OneSite Demo'
        },
        {
          user_id: userId,
          integration_id: integrationId,
          kpi_type: 'financial',
          kpi_name: 'Monthly Revenue',
          kpi_value: demoData.monthlyRevenue,
          kpi_unit: '$',
          property_name: 'Trinity Trace',
          extraction_confidence: 1.0,
          source_system: 'OneSite Demo'
        }
      ];

      const { error: kpiError } = await supabase
        .from('extracted_kpis')
        .insert(kpiInserts);

      if (kpiError) {
        console.error('Error inserting demo KPIs:', kpiError);
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

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Demo data generated successfully',
          syncedKPIs: kpiInserts.length,
          pmSoftware: 'OneSite',
          propertyName: 'Trinity Trace',
          extractedData: demoData,
          mode: 'demo'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Starting PRODUCTION scraping for OneSite...')

    // Import Puppeteer for production scraping
    const puppeteer = await import('https://deno.land/x/puppeteer@16.2.0/mod.ts')
    
    // Launch browser with proper configuration for Deno
    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    })

    const page = await browser.newPage()
    
    try {
      // Set realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
      
      // Navigate to OneSite login
      console.log('Navigating to OneSite login...')
      await page.goto('https://www.onesite.com/login', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      })

      // Wait for login form to be visible
      await page.waitForSelector('input[type="email"], input[name="username"], input[name="email"]', { timeout: 10000 })

      // Login with credentials
      console.log('Attempting login with provided credentials...')
      
      // Try different possible selectors for username/email
      const usernameSelector = await page.$('input[type="email"], input[name="username"], input[name="email"]')
      if (usernameSelector) {
        await usernameSelector.type(credentials.username)
      } else {
        throw new Error('Could not find username/email input field')
      }

      // Try different possible selectors for password
      const passwordSelector = await page.$('input[type="password"], input[name="password"]')
      if (passwordSelector) {
        await passwordSelector.type(credentials.password)
      } else {
        throw new Error('Could not find password input field')
      }
      
      // Click login button
      const loginButton = await page.$('button[type="submit"], input[type="submit"], .login-button, button:contains("Login"), button:contains("Sign In")')
      if (loginButton) {
        await loginButton.click()
      } else {
        throw new Error('Could not find login button')
      }

      // Wait for navigation after login
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 })

      // Check if login was successful by looking for error messages
      const errorElement = await page.$('.error, .alert-danger, [class*="error"]')
      if (errorElement) {
        const errorText = await errorElement.textContent()
        throw new Error(`Login failed: ${errorText}`)
      }

      // Look for Trinity Trace property
      console.log('Searching for Trinity Trace property...')
      
      // Wait a bit for the page to fully load
      await page.waitForTimeout(3000)

      // Try to find Trinity Trace in property list/dropdown
      const trinityTraceFound = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.some(el => 
          el.textContent && el.textContent.toLowerCase().includes('trinity trace')
        );
      });

      if (!trinityTraceFound) {
        // Try common property switcher patterns
        const propertySelectors = [
          'select[name*="property"]',
          '.property-selector',
          '#property-select',
          '[data-testid*="property"]'
        ]

        let propertyFound = false
        for (const selector of propertySelectors) {
          const element = await page.$(selector)
          if (element) {
            console.log(`Found property selector: ${selector}`)
            // Try to select Trinity Trace from dropdown
            try {
              await page.select(selector, 'Trinity Trace')
              propertyFound = true
              break
            } catch (e) {
              // Continue to next selector
            }
          }
        }

        if (!propertyFound) {
          throw new Error('Trinity Trace property not found in OneSite portal. Please verify the property name and access permissions.')
        }
      } else {
        // Click on Trinity Trace property
        await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('*'));
          const trinityElement = elements.find(el => 
            el.textContent && el.textContent.toLowerCase().includes('trinity trace')
          );
          if (trinityElement && trinityElement.click) {
            trinityElement.click();
          }
        });
      }

      await page.waitForTimeout(5000); // Wait for property to load

      // Extract key metrics from the dashboard
      console.log('Extracting Trinity Trace data...')
      
      const propertyData = await page.evaluate(() => {
        const data = {
          occupancyRate: null,
          totalUnits: null,
          availableUnits: null,
          monthlyRevenue: null,
          avgRent: null
        };

        // Helper function to extract numbers from text
        const extractNumber = (text) => {
          if (!text) return null;
          const match = text.match(/[\d,]+\.?\d*/);
          return match ? parseFloat(match[0].replace(/,/g, '')) : null;
        };

        // Helper function to extract percentage
        const extractPercentage = (text) => {
          if (!text) return null;
          const match = text.match(/([\d.]+)%/);
          return match ? parseFloat(match[1]) : null;
        };

        // Try to find occupancy rate
        const occupancyElements = document.querySelectorAll('*');
        for (const el of occupancyElements) {
          const text = el.textContent || '';
          if (text.toLowerCase().includes('occupancy') && text.includes('%')) {
            data.occupancyRate = extractPercentage(text);
            if (data.occupancyRate) break;
          }
        }

        // Try to find total units
        const unitElements = document.querySelectorAll('*');
        for (const el of unitElements) {
          const text = el.textContent || '';
          if ((text.toLowerCase().includes('total units') || text.toLowerCase().includes('unit count')) && /\d+/.test(text)) {
            data.totalUnits = extractNumber(text);
            if (data.totalUnits) break;
          }
        }

        // Try to find revenue data
        const revenueElements = document.querySelectorAll('*');
        for (const el of revenueElements) {
          const text = el.textContent || '';
          if ((text.toLowerCase().includes('revenue') || text.toLowerCase().includes('income')) && text.includes('$')) {
            data.monthlyRevenue = extractNumber(text.replace('$', ''));
            if (data.monthlyRevenue) break;
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
          extractedData: propertyData,
          mode: 'production'
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

    // Update integration with error status using hardcoded values too
    const supabase = createClient(
      'https://oafnvnczdrcuvbdizqif.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZm52bmN6ZHJjdXZiZGl6cWlmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MjE0MCwiZXhwIjoyMDY2NjI4MTQwfQ.Xa2qJkF9_Nw5k7z_8gVDiNkHT8tBE1nKn4xkH0zXgJE'
    )

    try {
      const { integrationId } = await req.json();
      await supabase
        .from('pm_integrations')
        .update({ 
          sync_status: 'error',
          error_log: error.message
        })
        .eq('id', integrationId)
    } catch (updateError) {
      console.error('Error updating integration status:', updateError)
    }

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
