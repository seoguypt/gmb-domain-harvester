import { supabase } from "@/integrations/supabase/client";

export const fetchDomainRating = async (domain: string, apiKey: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('get-domain-rating', {
      body: { domain, apiKey }
    });

    if (error) {
      console.error('Ahrefs API error:', error);
      throw new Error(`Failed to fetch domain rating: ${error.message}`);
    }

    return data?.domain_rating;
  } catch (error) {
    console.error(`Error fetching domain rating for ${domain}:`, error);
    throw error;
  }
};