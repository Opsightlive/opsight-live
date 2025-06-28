
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DocumentProcessingRequest {
  documentId: string;
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

    const { documentId, userId } = await req.json() as DocumentProcessingRequest

    console.log(`Processing document ${documentId} for user ${userId}`)

    // Update document status to processing
    await supabase
      .from('documents')
      .update({ 
        processing_status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .eq('user_id', userId)

    // Get document details
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      throw new Error(`Document not found: ${docError?.message}`)
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(document.storage_path)

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`)
    }

    // Process file based on type
    let extractedData: any = {}
    let kpis: any[] = []

    if (document.file_type.toLowerCase().includes('pdf')) {
      const result = await processPDF(fileData, document.filename)
      extractedData = result.extractedData
      kpis = result.kpis
    } else if (document.file_type.toLowerCase().includes('excel') || document.file_type.toLowerCase().includes('spreadsheet')) {
      const result = await processExcel(fileData, document.filename)
      extractedData = result.extractedData
      kpis = result.kpis
    } else if (document.file_type.toLowerCase().includes('csv')) {
      const result = await processCSV(fileData, document.filename)
      extractedData = result.extractedData
      kpis = result.kpis
    } else {
      const result = await processTextDocument(fileData, document.filename)
      extractedData = result.extractedData
      kpis = result.kpis
    }

    // Store extracted KPIs
    for (const kpi of kpis) {
      await supabase
        .from('extracted_kpis')
        .insert({
          document_id: documentId,
          user_id: userId,
          kpi_type: kpi.type,
          kpi_name: kpi.name,
          kpi_value: kpi.value,
          kpi_unit: kpi.unit,
          period_start: kpi.period_start,
          period_end: kpi.period_end,
          property_name: kpi.property_name,
          extraction_confidence: kpi.confidence,
          raw_text: kpi.raw_text
        })
    }

    // Update document with extracted data
    await supabase
      .from('documents')
      .update({
        processing_status: 'completed',
        extracted_data: extractedData,
        confidence_score: calculateOverallConfidence(kpis),
        category: categorizeDocument(extractedData, kpis),
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)

    console.log(`Successfully processed document ${documentId}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Document processed successfully',
        extractedKPIs: kpis.length,
        category: categorizeDocument(extractedData, kpis)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing document:', error)

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

async function processPDF(fileData: Blob, filename: string) {
  // Convert PDF to text using a simple text extraction approach
  const text = await extractTextFromPDF(fileData)
  return extractKPIsFromText(text, filename)
}

async function processExcel(fileData: Blob, filename: string) {
  // Process Excel/spreadsheet files
  const text = await extractTextFromExcel(fileData)
  return extractKPIsFromText(text, filename)
}

async function processCSV(fileData: Blob, filename: string) {
  const text = await fileData.text()
  return extractKPIsFromText(text, filename)
}

async function processTextDocument(fileData: Blob, filename: string) {
  const text = await fileData.text()
  return extractKPIsFromText(text, filename)
}

async function extractTextFromPDF(fileData: Blob): Promise<string> {
  // Simple PDF text extraction - in production, use proper PDF parser
  const arrayBuffer = await fileData.arrayBuffer()
  const text = new TextDecoder().decode(arrayBuffer)
  return text
}

async function extractTextFromExcel(fileData: Blob): Promise<string> {
  // Simple Excel text extraction - in production, use proper Excel parser
  const text = await fileData.text()
  return text
}

function extractKPIsFromText(text: string, filename: string) {
  const kpis: any[] = []
  const extractedData: any = {
    filename,
    processedAt: new Date().toISOString(),
    textLength: text.length
  }

  // Extract Leasing KPIs
  const leasingKPIs = extractLeasingKPIs(text)
  kpis.push(...leasingKPIs)

  // Extract Collections KPIs
  const collectionsKPIs = extractCollectionsKPIs(text)
  kpis.push(...collectionsKPIs)

  // Extract Staffing KPIs
  const staffingKPIs = extractStaffingKPIs(text)
  kpis.push(...staffingKPIs)

  // Extract Financial KPIs
  const financialKPIs = extractFinancialKPIs(text)
  kpis.push(...financialKPIs)

  // Extract Operations KPIs
  const operationsKPIs = extractOperationsKPIs(text)
  kpis.push(...operationsKPIs)

  return { extractedData, kpis }
}

function extractLeasingKPIs(text: string) {
  const kpis: any[] = []
  const lowerText = text.toLowerCase()

  // Occupancy Rate
  const occupancyMatches = text.match(/occupancy.*?(\d+\.?\d*%)/gi)
  if (occupancyMatches) {
    occupancyMatches.forEach(match => {
      const value = parseFloat(match.match(/(\d+\.?\d*)/)?.[0] || '0')
      kpis.push({
        type: 'leasing',
        name: 'Occupancy Rate',
        value: value,
        unit: '%',
        confidence: 0.85,
        raw_text: match
      })
    })
  }

  // Lease Renewals
  const renewalMatches = text.match(/renewal.*?(\d+\.?\d*%)/gi)
  if (renewalMatches) {
    renewalMatches.forEach(match => {
      const value = parseFloat(match.match(/(\d+\.?\d*)/)?.[0] || '0')
      kpis.push({
        type: 'leasing',
        name: 'Renewal Rate',
        value: value,
        unit: '%',
        confidence: 0.80,
        raw_text: match
      })
    })
  }

  // Average Rent
  const rentMatches = text.match(/(?:average|avg).*?rent.*?\$(\d+,?\d*)/gi)
  if (rentMatches) {
    rentMatches.forEach(match => {
      const value = parseFloat(match.match(/\$(\d+,?\d*)/)?.[1]?.replace(',', '') || '0')
      kpis.push({
        type: 'leasing',
        name: 'Average Rent',
        value: value,
        unit: '$',
        confidence: 0.90,
        raw_text: match
      })
    })
  }

  return kpis
}

function extractCollectionsKPIs(text: string) {
  const kpis: any[] = []

  // Collection Rate
  const collectionMatches = text.match(/collection.*?(\d+\.?\d*%)/gi)
  if (collectionMatches) {
    collectionMatches.forEach(match => {
      const value = parseFloat(match.match(/(\d+\.?\d*)/)?.[0] || '0')
      kpis.push({
        type: 'collections',
        name: 'Collection Rate',
        value: value,
        unit: '%',
        confidence: 0.85,
        raw_text: match
      })
    })
  }

  // Delinquency Rate
  const delinquencyMatches = text.match(/delinquency.*?(\d+\.?\d*%)/gi)
  if (delinquencyMatches) {
    delinquencyMatches.forEach(match => {
      const value = parseFloat(match.match(/(\d+\.?\d*)/)?.[0] || '0')
      kpis.push({
        type: 'collections',
        name: 'Delinquency Rate',
        value: value,
        unit: '%',
        confidence: 0.80,
        raw_text: match
      })
    })
  }

  return kpis
}

function extractStaffingKPIs(text: string) {
  const kpis: any[] = []

  // Turnover Rate
  const turnoverMatches = text.match(/turnover.*?(\d+\.?\d*%)/gi)
  if (turnoverMatches) {
    turnoverMatches.forEach(match => {
      const value = parseFloat(match.match(/(\d+\.?\d*)/)?.[0] || '0')
      kpis.push({
        type: 'staffing',
        name: 'Turnover Rate',
        value: value,
        unit: '%',
        confidence: 0.75,
        raw_text: match
      })
    })
  }

  // Staffing Levels
  const staffingMatches = text.match(/staff.*?(\d+)\s*(?:employees|staff|people)/gi)
  if (staffingMatches) {
    staffingMatches.forEach(match => {
      const value = parseFloat(match.match(/(\d+)/)?.[0] || '0')
      kpis.push({
        type: 'staffing',
        name: 'Staff Count',
        value: value,
        unit: 'employees',
        confidence: 0.70,
        raw_text: match
      })
    })
  }

  return kpis
}

function extractFinancialKPIs(text: string) {
  const kpis: any[] = []

  // Revenue
  const revenueMatches = text.match(/(?:revenue|income).*?\$(\d+,?\d*,?\d*)/gi)
  if (revenueMatches) {
    revenueMatches.forEach(match => {
      const value = parseFloat(match.match(/\$(\d+,?\d*,?\d*)/)?.[1]?.replace(/,/g, '') || '0')
      kpis.push({
        type: 'financial',
        name: 'Revenue',
        value: value,
        unit: '$',
        confidence: 0.90,
        raw_text: match
      })
    })
  }

  // NOI (Net Operating Income)
  const noiMatches = text.match(/(?:noi|net operating income).*?\$(\d+,?\d*,?\d*)/gi)
  if (noiMatches) {
    noiMatches.forEach(match => {
      const value = parseFloat(match.match(/\$(\d+,?\d*,?\d*)/)?.[1]?.replace(/,/g, '') || '0')
      kpis.push({
        type: 'financial',
        name: 'Net Operating Income',
        value: value,
        unit: '$',
        confidence: 0.95,
        raw_text: match
      })
    })
  }

  // Expenses
  const expenseMatches = text.match(/(?:expenses|costs).*?\$(\d+,?\d*,?\d*)/gi)
  if (expenseMatches) {
    expenseMatches.forEach(match => {
      const value = parseFloat(match.match(/\$(\d+,?\d*,?\d*)/)?.[1]?.replace(/,/g, '') || '0')
      kpis.push({
        type: 'financial',
        name: 'Operating Expenses',
        value: value,
        unit: '$',
        confidence: 0.85,
        raw_text: match
      })
    })
  }

  return kpis
}

function extractOperationsKPIs(text: string) {
  const kpis: any[] = []

  // Maintenance Requests
  const maintenanceMatches = text.match(/maintenance.*?(\d+)\s*(?:requests|tickets|issues)/gi)
  if (maintenanceMatches) {
    maintenanceMatches.forEach(match => {
      const value = parseFloat(match.match(/(\d+)/)?.[0] || '0')
      kpis.push({
        type: 'operations',
        name: 'Maintenance Requests',
        value: value,
        unit: 'requests',
        confidence: 0.80,
        raw_text: match
      })
    })
  }

  // Response Time
  const responseMatches = text.match(/response.*?(\d+\.?\d*)\s*(?:hours|days)/gi)
  if (responseMatches) {
    responseMatches.forEach(match => {
      const value = parseFloat(match.match(/(\d+\.?\d*)/)?.[0] || '0')
      const unit = match.includes('hours') ? 'hours' : 'days'
      kpis.push({
        type: 'operations',
        name: 'Average Response Time',
        value: value,
        unit: unit,
        confidence: 0.75,
        raw_text: match
      })
    })
  }

  return kpis
}

function calculateOverallConfidence(kpis: any[]): number {
  if (kpis.length === 0) return 0
  const total = kpis.reduce((sum, kpi) => sum + (kpi.confidence || 0), 0)
  return Math.round((total / kpis.length) * 100) / 100
}

function categorizeDocument(extractedData: any, kpis: any[]): string {
  const kpiTypes = kpis.map(kpi => kpi.type)
  const typeCounts = kpiTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const dominantType = Object.entries(typeCounts).sort(([,a], [,b]) => b - a)[0]?.[0]
  
  switch (dominantType) {
    case 'financial': return 'Financial Report'
    case 'leasing': return 'Leasing Report'
    case 'collections': return 'Collections Report'
    case 'staffing': return 'Staffing Report'
    case 'operations': return 'Operations Report'
    default: return 'General Report'
  }
}
