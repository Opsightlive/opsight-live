
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts"

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

    console.log(`Starting PM data sync for integration ${integrationId}, testMode: ${testMode}`)

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

    try {
      switch (integration.pm_software.toLowerCase()) {
        case 'onesite':
          const oneSiteResult = await scrapeOneSiteData(integration, testMode)
          syncedData = oneSiteResult.data
          extractedKPIs = oneSiteResult.kpis
          break
        case 'yardi':
          const yardiResult = await scrapeYardiData(integration, testMode)
          syncedData = yardiResult.data
          extractedKPIs = yardiResult.kpis
          break
        case 'appfolio':
          const appfolioResult = await scrapeAppFolioData(integration, testMode)
          syncedData = appfolioResult.data
          extractedKPIs = appfolioResult.kpis
          break
        default:
          throw new Error(`PM software ${integration.pm_software} not yet supported for web scraping`)
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
            raw_text: `Scraped from ${integration.pm_software} on ${new Date().toISOString()}`
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
            last_sync_kpis: extractedKPIs.length,
            last_sync_success: true
          }
        })
        .eq('id', integrationId)

      console.log(`Successfully scraped ${extractedKPIs.length} KPIs from ${integration.pm_software}`)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'PM data scraped successfully',
          syncedKPIs: extractedKPIs.length,
          pmSoftware: integration.pm_software,
          testMode
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } catch (syncError) {
      console.error('Scraping error:', syncError)
      
      // Update integration with error status
      await supabase
        .from('pm_integrations')
        .update({
          sync_status: 'error',
          error_log: syncError.message,
          settings: {
            ...integration.settings,
            last_sync_success: false,
            last_sync_error: syncError.message
          }
        })
        .eq('id', integrationId)

      throw syncError
    }

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

async function scrapeOneSiteData(integration: any, testMode: boolean = false) {
  console.log('Starting OneSite web scraping...')
  
  // Decrypt credentials
  const credentials = JSON.parse(atob(integration.credentials_encrypted))
  
  if (testMode) {
    console.log('Test mode: Returning mock OneSite data')
    return getMockOneSiteData()
  }

  let browser
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: true
    })

    const page = await browser.newPage()
    
    // Set viewport and user agent
    await page.setViewport({ width: 1200, height: 800 })
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

    console.log('Navigating to OneSite login page...')
    await page.goto('https://www.realpage.com/login', { waitUntil: 'networkidle0' })

    // Fill login form
    console.log('Filling login credentials...')
    await page.waitForSelector('input[name="Email"], input[type="email"], #Email', { timeout: 10000 })
    await page.type('input[name="Email"], input[type="email"], #Email', credentials.username)
    
    await page.waitForSelector('input[name="Password"], input[type="password"], #Password', { timeout: 5000 })
    await page.type('input[name="Password"], input[type="password"], #Password', credentials.password)

    // Submit login form
    console.log('Submitting login form...')
    const loginButton = await page.$('button[type="submit"], input[type="submit"], .login-button')
    if (loginButton) {
      await loginButton.click()
    } else {
      await page.keyboard.press('Enter')
    }

    // Wait for navigation after login
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 })
    } catch (navError) {
      console.log('Navigation timeout, checking current page...')
    }

    // Check if login was successful
    const currentUrl = page.url()
    console.log('Current URL after login:', currentUrl)
    
    if (currentUrl.includes('login') || currentUrl.includes('signin')) {
      throw new Error('Login failed - still on login page')
    }

    // Navigate to dashboard/properties page
    console.log('Navigating to properties dashboard...')
    const dashboardUrls = [
      'https://www.realpage.com/dashboard',
      'https://www.realpage.com/properties',
      'https://leasing.realpage.com/dashboard'
    ]

    let dashboardLoaded = false
    for (const url of dashboardUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 })
        dashboardLoaded = true
        console.log(`Successfully loaded dashboard: ${url}`)
        break
      } catch (error) {
        console.log(`Failed to load ${url}, trying next...`)
      }
    }

    if (!dashboardLoaded) {
      throw new Error('Could not load dashboard page')
    }

    // Extract property data from the page
    console.log('Extracting property data...')
    const propertyData = await page.evaluate(() => {
      const properties = []
      
      // Look for property cards, tables, or lists
      const propertyElements = document.querySelectorAll(
        '.property-card, .property-item, .property-row, [data-property], .building-item'
      )

      propertyElements.forEach((element, index) => {
        const property = {
          id: `property-${index + 1}`,
          name: '',
          occupancy: null,
          rent_roll: null,
          collection_rate: null,
          maintenance_requests: null
        }

        // Extract property name
        const nameElement = element.querySelector('.property-name, .building-name, h3, h4, .title')
        if (nameElement) {
          property.name = nameElement.textContent?.trim() || `Property ${index + 1}`
        }

        // Extract occupancy data
        const occupancyElement = element.querySelector('[class*="occupancy"], [data-metric="occupancy"]')
        if (occupancyElement) {
          const occupancyText = occupancyElement.textContent || ''
          const occupancyMatch = occupancyText.match(/(\d+\.?\d*)%/)
          if (occupancyMatch) {
            property.occupancy = parseFloat(occupancyMatch[1])
          }
        }

        // Extract rent roll data
        const rentElement = element.querySelector('[class*="rent"], [class*="revenue"], [data-metric="rent"]')
        if (rentElement) {
          const rentText = rentElement.textContent || ''
          const rentMatch = rentText.match(/\$?([\d,]+)/)
          if (rentMatch) {
            property.rent_roll = parseFloat(rentMatch[1].replace(/,/g, ''))
          }
        }

        if (property.name) {
          properties.push(property)
        }
      })

      // If no structured data found, try to extract from tables
      if (properties.length === 0) {
        const tables = document.querySelectorAll('table')
        tables.forEach(table => {
          const rows = table.querySelectorAll('tr')
          rows.forEach((row, index) => {
            if (index === 0) return // Skip header
            
            const cells = row.querySelectorAll('td, th')
            if (cells.length >= 2) {
              const property = {
                id: `table-property-${index}`,
                name: cells[0]?.textContent?.trim() || `Property ${index}`,
                occupancy: null,
                rent_roll: null
              }

              // Try to parse numeric data from other cells
              for (let i = 1; i < cells.length; i++) {
                const cellText = cells[i]?.textContent || ''
                
                // Check for percentage (occupancy)
                const percentMatch = cellText.match(/(\d+\.?\d*)%/)
                if (percentMatch && !property.occupancy) {
                  property.occupancy = parseFloat(percentMatch[1])
                }

                // Check for dollar amounts (rent)
                const dollarMatch = cellText.match(/\$?([\d,]+)/)
                if (dollarMatch && !property.rent_roll) {
                  property.rent_roll = parseFloat(dollarMatch[1].replace(/,/g, ''))
                }
              }

              if (property.name !== `Property ${index}`) {
                properties.push(property)
              }
            }
          })
        })
      }

      return properties
    })

    console.log('Extracted property data:', propertyData)

    // Convert to KPIs
    const kpis = []
    const currentDate = new Date()
    const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)

    propertyData.forEach(property => {
      if (property.occupancy !== null) {
        kpis.push({
          type: 'leasing',
          name: 'Occupancy Rate',
          value: property.occupancy,
          unit: '%',
          property_name: property.name,
          confidence: 0.85,
          period_start: firstOfMonth.toISOString().split('T')[0],
          period_end: currentDate.toISOString().split('T')[0]
        })
      }

      if (property.rent_roll !== null) {
        kpis.push({
          type: 'financial',
          name: 'Monthly Rent Roll',
          value: property.rent_roll,
          unit: '$',
          property_name: property.name,
          confidence: 0.80,
          period_start: firstOfMonth.toISOString().split('T')[0],
          period_end: currentDate.toISOString().split('T')[0]
        })
      }
    })

    await browser.close()

    return {
      data: {
        properties: propertyData,
        sync_timestamp: new Date().toISOString(),
        total_properties: propertyData.length,
        scraping_method: 'puppeteer'
      },
      kpis
    }

  } catch (error) {
    if (browser) {
      await browser.close()
    }
    console.error('OneSite scraping error:', error)
    throw new Error(`OneSite scraping failed: ${error.message}`)
  }
}

async function scrapeYardiData(integration: any, testMode: boolean = false) {
  if (testMode) {
    return getMockYardiData()
  }
  
  console.log('Yardi scraping not yet implemented')
  throw new Error('Yardi web scraping is not yet implemented. Please use test mode or contact support.')
}

async function scrapeAppFolioData(integration: any, testMode: boolean = false) {
  if (testMode) {
    return getMockAppFolioData()
  }
  
  console.log('AppFolio scraping not yet implemented')
  throw new Error('AppFolio web scraping is not yet implemented. Please use test mode or contact support.')
}

function getMockOneSiteData() {
  const currentDate = new Date()
  const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  
  return {
    data: {
      properties: [{
        id: 'mock-onesite-1',
        name: 'OneSite Demo Property',
        occupancy: 94.5,
        rent_roll: 125000,
        collection_rate: 97.2,
        maintenance_requests: 8
      }],
      sync_timestamp: new Date().toISOString(),
      total_properties: 1,
      scraping_method: 'mock'
    },
    kpis: [
      {
        type: 'leasing',
        name: 'Occupancy Rate',
        value: 94.5,
        unit: '%',
        property_name: 'OneSite Demo Property',
        confidence: 0.95,
        period_start: firstOfMonth.toISOString().split('T')[0],
        period_end: currentDate.toISOString().split('T')[0]
      },
      {
        type: 'financial',
        name: 'Monthly Rent Roll',
        value: 125000,
        unit: '$',
        property_name: 'OneSite Demo Property',
        confidence: 0.95,
        period_start: firstOfMonth.toISOString().split('T')[0],
        period_end: currentDate.toISOString().split('T')[0]
      }
    ]
  }
}

function getMockYardiData() {
  const currentDate = new Date()
  const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  
  return {
    data: {
      properties: [{
        name: 'Yardi Demo Property',
        occupancy: 91.8,
        rent_roll: 145000,
        collection_rate: 98.1
      }]
    },
    kpis: [
      {
        type: 'leasing',
        name: 'Occupancy Rate',
        value: 91.8,
        unit: '%',
        property_name: 'Yardi Demo Property',
        confidence: 0.95,
        period_start: firstOfMonth.toISOString().split('T')[0],
        period_end: currentDate.toISOString().split('T')[0]
      }
    ]
  }
}

function getMockAppFolioData() {
  const currentDate = new Date()
  const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  
  return {
    data: {
      properties: [{
        name: 'AppFolio Demo Property',
        occupancy: 89.3,
        rent_roll: 167000,
        collection_rate: 96.8
      }]
    },
    kpis: [
      {
        type: 'leasing',
        name: 'Occupancy Rate',
        value: 89.3,
        unit: '%',
        property_name: 'AppFolio Demo Property',
        confidence: 0.95,
        period_start: firstOfMonth.toISOString().split('T')[0],
        period_end: currentDate.toISOString().split('T')[0]
      }
    ]
  }
}
