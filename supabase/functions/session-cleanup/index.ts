
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Clean up expired sessions and tokens
    const { error: cleanupError } = await supabaseClient.rpc('cleanup_expired_auth_data');
    
    if (cleanupError) {
      console.error('Cleanup error:', cleanupError);
      throw cleanupError;
    }

    // Get cleanup statistics
    const { data: stats, error: statsError } = await supabaseClient
      .from('user_sessions')
      .select('count(*)', { count: 'exact' })
      .eq('is_active', true);

    if (statsError) {
      console.error('Stats error:', statsError);
    }

    const activeSessions = stats?.[0]?.count || 0;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Session cleanup completed',
        activeSessions 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Session cleanup failed:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
