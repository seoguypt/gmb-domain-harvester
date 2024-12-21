import { DATAFORSEO_CONFIG } from "../config/dataforseo";

export async function fetchDomainMetrics(domain: string) {
  if (!DATAFORSEO_CONFIG.login || !DATAFORSEO_CONFIG.password) {
    console.error('DataForSEO credentials not configured');
    return null;
  }

  try {
    const auth = btoa(`${DATAFORSEO_CONFIG.login}:${DATAFORSEO_CONFIG.password}`);
    
    const response = await fetch('https://api.dataforseo.com/v3/domain_analytics/whois/overview/live', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        target: domain
      }])
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`DataForSEO API error: ${text}`);
    }

    const data = await response.json();
    const result = data?.tasks?.[0]?.result?.[0];
    
    if (!result) {
      return null;
    }

    return {
      domain_rating: result.registrar_info?.domain_rank || result.registrar_info?.trust_score || 0,
      semrush_rank: result.registrar_info?.rank || result.registrar_info?.alexa_rank || 0,
      facebook_shares: result.social_metrics?.facebook?.shares || result.social_metrics?.total_shares || 0,
      ahrefs_rank: result.backlinks_info?.backlinks_count || result.backlinks_info?.referring_domains || 0
    };

  } catch (error) {
    console.error('Error fetching domain metrics:', error);
    return null;
  }
}
