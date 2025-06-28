
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportConfig {
  report_id: string;
  user_id: string;
  config: {
    report_title: string;
    report_period_start: string;
    report_period_end: string;
    property_ids: string[];
    sections: any[];
    ai_summary_enabled: boolean;
    email_recipients: string[];
  };
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

    const { report_id, user_id, config } = await req.json() as ReportConfig

    console.log(`Starting report generation for report ${report_id}`)

    // Update status to processing
    await supabase
      .from('lp_reports')
      .update({ 
        generation_status: 'processing',
        generated_at: new Date().toISOString()
      })
      .eq('id', report_id)

    // Update queue status
    await supabase
      .from('report_generation_queue')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString(),
        worker_id: crypto.randomUUID()
      })
      .eq('report_id', report_id)

    // Fetch user properties and KPI data
    const { data: properties, error: propError } = await supabase
      .from('user_properties')
      .select('*')
      .eq('user_id', user_id)
      .in('id', config.property_ids)

    if (propError) throw propError

    // Fetch KPI metrics for the period
    const { data: kpiMetrics, error: kpiError } = await supabase
      .from('kpi_metrics')
      .select('*')
      .eq('user_id', user_id)
      .in('property_id', config.property_ids)
      .gte('period_start', config.report_period_start)
      .lte('period_end', config.report_period_end)

    if (kpiError) throw kpiError

    // Generate report data
    const reportData = await generateReportData({
      properties: properties || [],
      kpiMetrics: kpiMetrics || [],
      config,
      user_id
    })

    // Generate AI summary if enabled
    let aiSummary = null
    if (config.ai_summary_enabled) {
      aiSummary = await generateAISummary(reportData, config)
    }

    // Generate PDF (simulate for now)
    const pdfPath = await generatePDF(reportData, aiSummary, config)

    // Update report with completion
    const { error: updateError } = await supabase
      .from('lp_reports')
      .update({ 
        generation_status: 'completed',
        report_data: reportData,
        ai_summary: aiSummary,
        pdf_storage_path: pdfPath,
        file_size_bytes: Math.floor(Math.random() * 5000000) + 1000000 // 1-5MB simulation
      })
      .eq('id', report_id)

    if (updateError) throw updateError

    // Update queue status
    await supabase
      .from('report_generation_queue')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('report_id', report_id)

    // Send email if recipients specified
    if (config.email_recipients && config.email_recipients.length > 0) {
      await sendReportEmail(report_id, user_id, config.email_recipients, supabase)
    }

    // Log analytics
    await supabase
      .from('report_analytics')
      .insert({
        user_id,
        report_id,
        event_type: 'generated',
        event_data: {
          properties_count: properties?.length || 0,
          sections_count: config.sections.filter(s => s.enabled).length,
          ai_summary_enabled: config.ai_summary_enabled
        }
      })

    console.log(`Report generation completed for report ${report_id}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        report_id,
        message: 'Report generated successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error generating report:', error)

    // Update report status to failed
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { report_id } = await req.json().catch(() => ({}))
    
    if (report_id) {
      await supabase
        .from('lp_reports')
        .update({ 
          generation_status: 'failed',
          error_message: error.message
        })
        .eq('id', report_id)

      await supabase
        .from('report_generation_queue')
        .update({ 
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_details: { message: error.message, stack: error.stack }
        })
        .eq('report_id', report_id)
    }

    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function generateReportData(params: {
  properties: any[];
  kpiMetrics: any[];
  config: any;
  user_id: string;
}) {
  const { properties, kpiMetrics, config } = params

  // Aggregate KPI data by property and metric type
  const kpisByProperty = properties.map(property => {
    const propertyKpis = kpiMetrics.filter(kpi => kpi.property_id === property.id)
    
    return {
      property,
      kpis: propertyKpis,
      summary: {
        total_revenue: propertyKpis
          .filter(k => k.category === 'financial' && k.metric_name.includes('revenue'))
          .reduce((sum, k) => sum + (k.metric_value || 0), 0),
        occupancy_rate: propertyKpis
          .find(k => k.metric_name === 'occupancy_rate')?.metric_value || 0,
        noi: propertyKpis
          .find(k => k.metric_name === 'net_operating_income')?.metric_value || 0
      }
    }
  })

  // Generate portfolio-level metrics
  const portfolioMetrics = {
    total_properties: properties.length,
    total_units: properties.reduce((sum, p) => sum + (p.units || 0), 0),
    avg_occupancy: kpisByProperty.reduce((sum, p) => sum + p.summary.occupancy_rate, 0) / properties.length,
    total_revenue: kpisByProperty.reduce((sum, p) => sum + p.summary.total_revenue, 0),
    total_noi: kpisByProperty.reduce((sum, p) => sum + p.summary.noi, 0)
  }

  // Generate trend analysis
  const trends = generateTrendAnalysis(kpiMetrics)

  // Generate alerts and flags
  const alerts = generatePerformanceAlerts(kpisByProperty)

  return {
    period: {
      start: config.report_period_start,
      end: config.report_period_end
    },
    portfolio: portfolioMetrics,
    properties: kpisByProperty,
    trends,
    alerts,
    charts: generateChartData(kpiMetrics),
    generated_at: new Date().toISOString()
  }
}

function generateTrendAnalysis(kpiMetrics: any[]) {
  // Simplified trend analysis
  const revenueMetrics = kpiMetrics.filter(k => k.metric_name.includes('revenue'))
  const occupancyMetrics = kpiMetrics.filter(k => k.metric_name === 'occupancy_rate')

  return {
    revenue_trend: revenueMetrics.length > 0 ? 
      (revenueMetrics[revenueMetrics.length - 1]?.change_percentage || 0) : 0,
    occupancy_trend: occupancyMetrics.length > 0 ? 
      (occupancyMetrics[occupancyMetrics.length - 1]?.change_percentage || 0) : 0,
    performance_summary: 'Portfolio showing stable performance with minor fluctuations'
  }
}

function generatePerformanceAlerts(kpisByProperty: any[]) {
  const alerts = []

  kpisByProperty.forEach(property => {
    if (property.summary.occupancy_rate < 85) {
      alerts.push({
        type: 'warning',
        property: property.property.name,
        message: `Low occupancy rate: ${property.summary.occupancy_rate.toFixed(1)}%`,
        severity: 'medium'
      })
    }

    if (property.summary.noi < 0) {
      alerts.push({
        type: 'critical',
        property: property.property.name,
        message: 'Negative NOI detected',
        severity: 'high'
      })
    }
  })

  return alerts
}

function generateChartData(kpiMetrics: any[]) {
  // Generate data for charts
  return {
    revenue_chart: kpiMetrics
      .filter(k => k.metric_name.includes('revenue'))
      .map(k => ({ date: k.period_start, value: k.metric_value })),
    occupancy_chart: kpiMetrics
      .filter(k => k.metric_name === 'occupancy_rate')
      .map(k => ({ date: k.period_start, value: k.metric_value }))
  }
}

async function generateAISummary(reportData: any, config: any): Promise<string> {
  // Simulate AI summary generation
  const summaryPoints = [
    `Portfolio of ${reportData.portfolio.total_properties} properties with ${reportData.portfolio.total_units} total units`,
    `Average occupancy rate of ${reportData.portfolio.avg_occupancy.toFixed(1)}%`,
    `Total portfolio NOI of $${reportData.portfolio.total_noi.toLocaleString()}`,
  ]

  if (reportData.trends.revenue_trend > 0) {
    summaryPoints.push(`Revenue trending up by ${reportData.trends.revenue_trend.toFixed(1)}%`)
  } else if (reportData.trends.revenue_trend < 0) {
    summaryPoints.push(`Revenue declining by ${Math.abs(reportData.trends.revenue_trend).toFixed(1)}%`)
  }

  if (reportData.alerts.length > 0) {
    summaryPoints.push(`${reportData.alerts.length} performance alerts requiring attention`)
  }

  summaryPoints.push('Overall portfolio performance remains within acceptable parameters')

  return summaryPoints.join('. ') + '.'
}

async function generatePDF(reportData: any, aiSummary: string | null, config: any): Promise<string> {
  // Simulate PDF generation - in production this would use a PDF library
  const pdfPath = `reports/${config.report_id}_${Date.now()}.pdf`
  
  // This would actually generate and store the PDF
  console.log('Generated PDF:', pdfPath)
  
  return pdfPath
}

async function sendReportEmail(reportId: string, userId: string, recipients: string[], supabase: any) {
  try {
    // This would integrate with your email service
    console.log(`Sending report ${reportId} to ${recipients.length} recipients`)
    
    // Update report email status
    await supabase
      .from('lp_reports')
      .update({ email_sent_at: new Date().toISOString() })
      .eq('id', reportId)

    // Log email event
    await supabase
      .from('report_analytics')
      .insert({
        user_id: userId,
        report_id: reportId,
        event_type: 'emailed',
        event_data: { recipients_count: recipients.length }
      })

  } catch (error) {
    console.error('Error sending report email:', error)
  }
}
