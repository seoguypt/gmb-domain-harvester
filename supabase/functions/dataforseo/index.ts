import { serve } from 'https://deno.fresh.run/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DATAFORSEO_LOGIN = Deno.env.get('DATAFORSEO_LOGIN')
const DATAFORSEO_PASSWORD = Deno.env.get('DATAFORSEO_PASSWORD')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
      console.error('DataForSEO credentials not found')
      return new Response(
        JSON.stringify({ error: 'DataForSEO credentials not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { domain } = await req.json()
    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Domain is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const auth = btoa(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`)
    
    const response = await fetch('https://api.dataforseo.com/v3/domain_analytics/domain/overview', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ target: domain }])
    })

    const data = await response.json()
    console.log('DataForSEO response:', data)

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in DataForSEO function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})