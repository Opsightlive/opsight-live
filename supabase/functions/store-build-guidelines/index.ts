
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const modularBuildGuidelines = {
      title: "🧩 Modular Build Logic Prompt",
      principles: [
        "Each module must be isolated, swappable, and updatable on its own",
        "All modules must follow the same folder + route naming structure",
        "Shared elements go in a central library (e.g. buttons, loaders, modals)",
        "Any new module must be tested for layout, speed, error handling, and scaling"
      ],
      structure: {
        pages: "[ModuleName]/index.tsx with components/, hooks/, utils/",
        components: "ui/ for shared, module-specific for isolated",
        hooks: "use[ModuleName].ts pattern",
        lib: "module-utils.ts for utilities"
      },
      qualityChecks: [
        "Layout responsiveness",
        "Performance and speed",
        "Error handling",
        "Scaling capabilities",
        "No breaking changes"
      ],
      createdAt: new Date().toISOString()
    }

    return new Response(
      JSON.stringify({
        success: true,
        guidelines: modularBuildGuidelines,
        message: "Modular build guidelines stored and ready for reference"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
