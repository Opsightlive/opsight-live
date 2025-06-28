
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface KPIThreshold {
  greenMin?: number
  greenMax?: number
  yellowMin?: number
  yellowMax?: number
  redMin?: number
  redMax?: number
}

interface AlertRule {
  id: string
  user_id: string
  rule_name: string
  kpi_type: string
  property_ids: string[]
  threshold_green_min?: number
  threshold_green_max?: number
  threshold_yellow_min?: number
  threshold_yellow_max?: number
  threshold_red_min?: number
  threshold_red_max?: number
  alert_frequency: string
  notification_channels: string[]
  conditions: any
}

interface ExtractedKPI {
  id: string
  user_id: string
  kpi_type: string
  kpi_name: string
  kpi_value: number
  property_name: string
  extraction_confidence: number
  created_at: string
}

async function processKPIAlerts() {
  const batchId = crypto.randomUUID()
  const startTime = Date.now()
  
  console.log(`Starting KPI alert processing batch: ${batchId}`)
  
  try {
    // Log processing start
    await supabase.from('alert_processing_log').insert({
      batch_id: batchId,
      processing_type: 'kpi_check',
      status: 'running'
    })

    // Get all active alert rules
    const { data: alertRules, error: rulesError } = await supabase
      .from('alert_rules')
      .select('*')
      .eq('is_active', true)

    if (rulesError) {
      throw new Error(`Failed to fetch alert rules: ${rulesError.message}`)
    }

    if (!alertRules || alertRules.length === 0) {
      console.log('No active alert rules found')
      return
    }

    let totalPropertiesProcessed = 0
    let totalAlertsTriggered = 0

    // Process each user's alert rules
    const userGroups = alertRules.reduce((groups: any, rule: AlertRule) => {
      if (!groups[rule.user_id]) {
        groups[rule.user_id] = []
      }
      groups[rule.user_id].push(rule)
      return groups
    }, {})

    for (const [userId, userRules] of Object.entries(userGroups)) {
      try {
        const results = await processUserAlerts(userId, userRules as AlertRule[], batchId)
        totalPropertiesProcessed += results.propertiesProcessed
        totalAlertsTriggered += results.alertsTriggered
      } catch (error) {
        console.error(`Error processing alerts for user ${userId}:`, error)
      }
    }

    const processingTime = Date.now() - startTime

    // Update processing log
    await supabase.from('alert_processing_log').update({
      properties_processed: totalPropertiesProcessed,
      alerts_triggered: totalAlertsTriggered,
      processing_time_ms: processingTime,
      status: 'completed',
      completed_at: new Date().toISOString()
    }).eq('batch_id', batchId)

    console.log(`Batch ${batchId} completed: ${totalPropertiesProcessed} properties, ${totalAlertsTriggered} alerts`)

  } catch (error) {
    console.error('Error in processKPIAlerts:', error)
    
    await supabase.from('alert_processing_log').update({
      status: 'failed',
      error_message: error.message,
      completed_at: new Date().toISOString()
    }).eq('batch_id', batchId)
  }
}

async function processUserAlerts(userId: string, rules: AlertRule[], batchId: string) {
  let propertiesProcessed = 0
  let alertsTriggered = 0

  // Get recent KPI data for this user
  const { data: kpiData, error: kpiError } = await supabase
    .from('extracted_kpis')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
    .order('created_at', { ascending: false })

  if (kpiError) {
    throw new Error(`Failed to fetch KPI data for user ${userId}: ${kpiError.message}`)
  }

  if (!kpiData || kpiData.length === 0) {
    return { propertiesProcessed, alertsTriggered }
  }

  // Group KPIs by property and type
  const kpiGroups = kpiData.reduce((groups: any, kpi: ExtractedKPI) => {
    const key = `${kpi.property_name || 'Unknown'}_${kpi.kpi_type}`
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(kpi)
    return groups
  }, {})

  // Process each rule
  for (const rule of rules) {
    try {
      const ruleResults = await processAlertRule(rule, kpiGroups, batchId)
      alertsTriggered += ruleResults.alertsTriggered
    } catch (error) {
      console.error(`Error processing rule ${rule.id}:`, error)
    }
  }

  propertiesProcessed = Object.keys(kpiGroups).length

  return { propertiesProcessed, alertsTriggered }
}

async function processAlertRule(rule: AlertRule, kpiGroups: any, batchId: string) {
  let alertsTriggered = 0

  // Find matching KPIs for this rule
  const matchingKPIs = Object.entries(kpiGroups).filter(([key, kpis]: [string, any]) => {
    const [propertyName, kpiType] = key.split('_')
    return kpiType === rule.kpi_type
  })

  for (const [key, kpis] of matchingKPIs) {
    const [propertyName] = key.split('_')
    const latestKPI = (kpis as ExtractedKPI[])[0] // Most recent KPI

    if (!latestKPI || latestKPI.kpi_value === null) continue

    const alertLevel = evaluateThresholds(latestKPI.kpi_value, rule)
    
    if (alertLevel === 'yellow' || alertLevel === 'red') {
      // Check if we should create an alert based on frequency
      const shouldAlert = await shouldCreateAlert(rule, propertyName, alertLevel)
      
      if (shouldAlert) {
        await createAlertInstance(rule, latestKPI, alertLevel, batchId)
        alertsTriggered++
      }
    }
  }

  return { alertsTriggered }
}

function evaluateThresholds(value: number, rule: AlertRule): 'green' | 'yellow' | 'red' {
  // Red thresholds (highest priority)
  if (rule.threshold_red_min !== null && value < rule.threshold_red_min) return 'red'
  if (rule.threshold_red_max !== null && value > rule.threshold_red_max) return 'red'
  
  // Yellow thresholds
  if (rule.threshold_yellow_min !== null && value < rule.threshold_yellow_min) return 'yellow'
  if (rule.threshold_yellow_max !== null && value > rule.threshold_yellow_max) return 'yellow'
  
  return 'green'
}

async function shouldCreateAlert(rule: AlertRule, propertyName: string, alertLevel: string): Promise<boolean> {
  if (rule.alert_frequency === 'immediate') return true

  // Check for existing recent alerts
  const timeThresholds = {
    hourly: 60 * 60 * 1000,
    daily: 24 * 60 * 60 * 1000,
    weekly: 7 * 24 * 60 * 60 * 1000
  }

  const threshold = timeThresholds[rule.alert_frequency as keyof typeof timeThresholds]
  if (!threshold) return true

  const cutoffTime = new Date(Date.now() - threshold).toISOString()

  const { data: recentAlerts } = await supabase
    .from('alert_instances')
    .select('id')
    .eq('alert_rule_id', rule.id)
    .eq('property_name', propertyName)
    .eq('alert_level', alertLevel)
    .gte('created_at', cutoffTime)
    .limit(1)

  return !recentAlerts || recentAlerts.length === 0
}

async function createAlertInstance(rule: AlertRule, kpi: ExtractedKPI, alertLevel: string, batchId: string) {
  const alertMessage = generateAlertMessage(rule, kpi, alertLevel)
  
  const { data: alertInstance, error } = await supabase
    .from('alert_instances')
    .insert({
      alert_rule_id: rule.id,
      user_id: rule.user_id,
      property_name: kpi.property_name,
      kpi_type: rule.kpi_type,
      kpi_value: kpi.kpi_value,
      alert_level: alertLevel,
      alert_message: alertMessage,
      trigger_data: {
        kpi_id: kpi.id,
        kpi_name: kpi.kpi_name,
        extraction_confidence: kpi.extraction_confidence,
        batch_id: batchId,
        thresholds: {
          red_min: rule.threshold_red_min,
          red_max: rule.threshold_red_max,
          yellow_min: rule.threshold_yellow_min,
          yellow_max: rule.threshold_yellow_max
        }
      }
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating alert instance:', error)
    return
  }

  // Queue notifications
  await queueNotifications(rule, alertInstance, alertMessage)
}

function generateAlertMessage(rule: AlertRule, kpi: ExtractedKPI, alertLevel: string): string {
  const severity = alertLevel === 'red' ? 'Critical' : 'Warning'
  const property = kpi.property_name || 'Unknown Property'
  const value = kpi.kpi_value?.toLocaleString() || 'N/A'
  
  return `${severity}: ${rule.rule_name} triggered for ${property}. ${kpi.kpi_name}: ${value}`
}

async function queueNotifications(rule: AlertRule, alertInstance: any, message: string) {
  const { data: userPrefs } = await supabase
    .from('user_notification_preferences')
    .select('*')
    .eq('user_id', rule.user_id)
    .single()

  const notifications = []

  for (const channel of rule.notification_channels) {
    if (channel === 'dashboard') {
      notifications.push({
        alert_instance_id: alertInstance.id,
        user_id: rule.user_id,
        notification_type: 'dashboard',
        recipient: rule.user_id,
        message,
        priority: alertInstance.alert_level === 'red' ? 1 : 3
      })
    } else if (channel === 'email' && userPrefs?.email_enabled && userPrefs?.email_address) {
      notifications.push({
        alert_instance_id: alertInstance.id,
        user_id: rule.user_id,
        notification_type: 'email',
        recipient: userPrefs.email_address,
        subject: `Red Flag Alert: ${rule.rule_name}`,
        message,
        priority: alertInstance.alert_level === 'red' ? 1 : 3
      })
    } else if (channel === 'sms' && userPrefs?.sms_enabled && userPrefs?.phone_number) {
      notifications.push({
        alert_instance_id: alertInstance.id,
        user_id: rule.user_id,
        notification_type: 'sms',
        recipient: userPrefs.phone_number,
        message: message.substring(0, 160), // SMS length limit
        priority: alertInstance.alert_level === 'red' ? 1 : 3
      })
    }
  }

  if (notifications.length > 0) {
    await supabase.from('notification_queue').insert(notifications)
  }
}

async function processNotificationQueue() {
  const batchId = crypto.randomUUID()
  console.log(`Starting notification processing batch: ${batchId}`)

  try {
    // Get pending notifications
    const { data: notifications, error } = await supabase
      .from('notification_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(100) // Process in batches

    if (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`)
    }

    if (!notifications || notifications.length === 0) {
      return
    }

    let sentCount = 0
    let failedCount = 0

    for (const notification of notifications) {
      try {
        const success = await sendNotification(notification)
        if (success) {
          await supabase.from('notification_queue').update({
            status: 'sent',
            sent_at: new Date().toISOString()
          }).eq('id', notification.id)
          sentCount++
        } else {
          throw new Error('Notification sending failed')
        }
      } catch (error) {
        console.error(`Failed to send notification ${notification.id}:`, error)
        
        const newRetryCount = notification.retry_count + 1
        const status = newRetryCount >= notification.max_retries ? 'failed' : 'pending'
        const scheduledFor = status === 'pending' 
          ? new Date(Date.now() + Math.pow(2, newRetryCount) * 60000).toISOString() // Exponential backoff
          : notification.scheduled_for

        await supabase.from('notification_queue').update({
          retry_count: newRetryCount,
          status,
          error_message: error.message,
          scheduled_for: scheduledFor
        }).eq('id', notification.id)

        if (status === 'failed') failedCount++
      }
    }

    console.log(`Notification batch ${batchId} completed: ${sentCount} sent, ${failedCount} failed`)

  } catch (error) {
    console.error('Error in processNotificationQueue:', error)
  }
}

async function sendNotification(notification: any): Promise<boolean> {
  switch (notification.notification_type) {
    case 'dashboard':
      // Dashboard notifications are handled by real-time subscriptions
      return true
    
    case 'email':
      // In a real implementation, you would integrate with an email service
      // For now, we'll log it
      console.log(`Would send email to ${notification.recipient}: ${notification.message}`)
      return true
    
    case 'sms':
      // In a real implementation, you would integrate with an SMS service
      console.log(`Would send SMS to ${notification.recipient}: ${notification.message}`)
      return true
    
    default:
      return false
  }
}

// Main handler
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    if (action === 'process_kpis') {
      await processKPIAlerts()
      return new Response(JSON.stringify({ success: true, message: 'KPI processing completed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else if (action === 'process_notifications') {
      await processNotificationQueue()
      return new Response(JSON.stringify({ success: true, message: 'Notification processing completed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      // Default: run both processes
      await Promise.all([
        processKPIAlerts(),
        processNotificationQueue()
      ])
      
      return new Response(JSON.stringify({ success: true, message: 'Alert engine processing completed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    console.error('Error in red-flag-monitor:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
