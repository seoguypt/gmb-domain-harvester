export async function fetchDomainMetrics(domain: string) {
  try {
    console.log('Making DataForSEO request for domain:', domain);
    
    const response = await fetch('/.netlify/functions/dataforseo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ domain })
    });

    console.log('DataForSEO response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('DataForSEO error response:', text);
      throw new Error(`DataForSEO API error: ${text}`);
    }

    const data = await response.json();
    console.log('DataForSEO raw response:', data);

    const result = data?.tasks?.[0]?.result?.[0];
    console.log('DataForSEO result:', result);
    
    if (!result) {
      console.log('No result data found');
      return null;
    }

    const metrics = {
      domain_rating: result.registrar_info?.domain_rank || result.registrar_info?.trust_score || 0,
      semrush_rank: result.registrar_info?.rank || result.registrar_info?.alexa_rank || 0,
      facebook_shares: result.social_metrics?.facebook?.shares || result.social_metrics?.total_shares || 0,
      ahrefs_rank: result.backlinks_info?.backlinks_count || result.backlinks_info?.referring_domains || 0
    };

    console.log('Extracted metrics:', metrics);
    return metrics;

  } catch (error) {
    console.error('Error fetching domain metrics:', error);
    return null;
  }
}
