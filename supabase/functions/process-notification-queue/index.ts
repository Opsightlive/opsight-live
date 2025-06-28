
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface QueuedNotification {
  id: string
  user_id: string
  alert_instance_id?: string
  notification_type: string
  recipient: string
  subject?: string
  message: string
  priority: number
  retry_count: number
  max_retries: number
  template_data: any
  created_at: string
}

async function processQueuedNotifications() {
  const batchId = crypto.randomUUID()
  console.log(`Starting notification queue processing batch: ${batchId}`)

  try {
    // Get pending notifications ordered by priority and creation time
    const { data: notifications, error } = await supabase
      .from('notification_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(50) // Process in batches

    if (error) throw error

    if (!notifications || notifications.length === 0) {
      console.log('No pending notifications found')
      return { processed: 0, failed: 0 }
    }

    console.log(`Found ${notifications.length} notifications to process`)

    let processed = 0
    let failed = 0

    // Process each notification
    for (const notification of notifications as QueuedNotification[]) {
      try {
        console.log(`Processing notification ${notification.id}`)

        // Call the send-alert-notification function
        const { data: result, error: sendError } = await supabase.functions.invoke('send-alert-notification', {
          body: {
            user_id: notification.user_id,
            recipient_type: notification.notification_type,
            recipient_address: notification.recipient,
            subject: notification.subject,
            message_content: notification.message,
            alert_instance_id: notification.alert_instance_id,
            priority: notification.priority
          }
        })

        if (sendError) throw sendError

        if (result?.success) {
          // Mark as sent
          await supabase
            .from('notification_queue')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('id', notification.id)

          processed++
          console.log(`Successfully sent notification ${notification.id}`)
        } else {
          throw new Error(result?.error || 'Unknown error')
        }

      } catch (error: any) {
        console.error(`Failed to process notification ${notification.id}:`, error)

        const newRetryCount = notification.retry_count + 1
        const shouldRetry = newRetryCount < notification.max_retries

        if (shouldRetry) {
          // Schedule for retry with exponential backoff
          const retryDelay = Math.pow(2, newRetryCount) * 60 * 1000 // exponential backoff in minutes
          const scheduledFor = new Date(Date.now() + retryDelay).toISOString()

          await supabase
            .from('notification_queue')
            .update({
              retry_count: newRetryCount,
              error_message: error.message,
              scheduled_for: scheduledFor
            })
            .eq('id', notification.id)

          console.log(`Scheduled notification ${notification.id} for retry ${newRetryCount} at ${scheduledFor}`)
        } else {
          // Mark as failed
          await supabase
            .from('notification_queue')
            .update({
              status: 'failed',
              error_message: error.message,
              retry_count: newRetryCount
            })
            .eq('id', notification.id)

          failed++
          console.log(`Notification ${notification.id} failed permanently after ${newRetryCount} attempts`)
        }
      }
    }

    console.log(`Batch ${batchId} completed: ${processed} processed, ${failed} failed`)
    return { processed, failed }

  } catch (error: any) {
    console.error('Error in processQueuedNotifications:', error)
    throw error
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const result = await processQueuedNotifications()

    return new Response(JSON.stringify({
      success: true,
      ...result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Error in process-notification-queue:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
