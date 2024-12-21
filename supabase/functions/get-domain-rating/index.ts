import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { domain, apiKey } = await req.json()
    
    if (!domain || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Domain and API key are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Fetching domain rating for ${domain}`)

    const response = await fetch(
      `https://apiv2.ahrefs.com/?from=domain_rating&target=${encodeURIComponent(domain)}&mode=exact&output=json&token=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!response.ok) {
      console.error(`Ahrefs API error: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error(`Error details: ${errorText}`)
      throw new Error(`Ahrefs API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Ahrefs API response:', data)
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in get-domain-rating function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})