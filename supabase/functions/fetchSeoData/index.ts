import { corsHeaders } from '../_shared/cors.ts'

interface SeoApiResponse {
  semrush_rank?: number
  facebook_shares?: number
  ahrefs_rank?: number
}

const processDomain = async (domain: string): Promise<SeoApiResponse> => {
  const apiUrl = `https://seo-rank.my-addr.com/api2/sr+fb/EB975177B65125C2B1DB7ED9D45638B1/${domain}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    return {
      semrush_rank: data.sr_rank || null,
      facebook_shares: data.fb_shares || null,
      ahrefs_rank: data.ahrefs_rank || null,
    };
  } catch (error) {
    console.error(`Error fetching SEO data for ${domain}:`, error);
    return {};
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { domain } = await req.json();
    
    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Domain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const seoData = await processDomain(domain);
    
    return new Response(
      JSON.stringify(seoData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})