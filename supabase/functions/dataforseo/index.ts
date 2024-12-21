import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { domain } = await req.json();

    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Domain is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const login = Deno.env.get('DATAFORSEO_LOGIN');
    const password = Deno.env.get('DATAFORSEO_PASSWORD');

    if (!login || !password) {
      console.error('DataForSEO credentials not found');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const auth = btoa(`${login}:${password}`);
    
    console.log('Making request to DataForSEO API for domain:', domain);
    
    // Use the domain analytics overview endpoint
    const response = await fetch('https://api.dataforseo.com/v3/domain_analytics/domain/overview/live', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        target: domain,
        include_subdomains: true
      }])
    });

    const responseText = await response.text();
    console.log('DataForSEO API Response Status:', response.status);
    console.log('DataForSEO API Response Text:', responseText);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: `DataForSEO API error: ${responseText}`,
          status: response.status 
        }),
        { 
          status: 200, // Return 200 to prevent Supabase from retrying
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = JSON.parse(responseText);
    console.log('DataForSEO API Raw Response:', JSON.stringify(data, null, 2));
    
    // Extract relevant metrics from the response
    const result = data?.tasks?.[0]?.result?.[0];
    console.log('DataForSEO Result Object:', JSON.stringify(result, null, 2));
    
    if (!result) {
      console.log('No result data found in API response');
      return new Response(
        JSON.stringify({ error: 'No data available for this domain' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Log the raw result to see the structure
    console.log('Raw result structure:', JSON.stringify(result, null, 2));

    // Map API response fields to our expected metrics
    const metrics = {
      domain_rating: result.organic?.metrics?.organic_traffic || result.organic?.metrics?.organic_keywords || 0,
      semrush_rank: result.organic?.metrics?.organic_position || result.organic?.metrics?.organic_keywords || 0,
      facebook_shares: result.organic?.metrics?.organic_traffic || 0,
      ahrefs_rank: result.organic?.metrics?.organic_keywords || 0
    };

    console.log('Mapped metrics:', JSON.stringify(metrics, null, 2));
    
    console.log('Extracted Metrics:', JSON.stringify(metrics, null, 2));
    
    return new Response(
      JSON.stringify({ 
        tasks: [{ 
          result: [metrics],
          status_code: 20000,
          status_message: "Ok"
        }] 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in dataforseo function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
