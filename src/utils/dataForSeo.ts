import { supabase } from "@/integrations/supabase/client";

const BASE_URL = 'https://api.dataforseo.com/v3';

export async function getDomainAge(domain: string) {
  try {
    const { data: loginData } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'DATAFORSEO_LOGIN')
      .maybeSingle();

    const { data: passwordData } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'DATAFORSEO_PASSWORD')
      .maybeSingle();

    if (!loginData?.value || !passwordData?.value) {
      console.error('DataForSEO credentials not found');
      return 'N/A (API credentials not set)';
    }

    const auth = Buffer.from(`${loginData.value}:${passwordData.value}`).toString('base64');
    
    const response = await fetch(`${BASE_URL}/domain_analytics/whois/live`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ target: domain }])
    });

    const data = await response.json();
    
    if (data.tasks?.[0]?.result?.[0]?.items?.[0]) {
      const whoisData = data.tasks[0].result[0].items[0];
      const creationDate = new Date(whoisData.creation_date);
      const now = new Date();
      const ageInYears = ((now.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
      return `${ageInYears} years`;
    }
    
    return 'N/A';
  } catch (error) {
    console.error('Error fetching domain age:', error);
    return 'N/A (API error)';
  }
}