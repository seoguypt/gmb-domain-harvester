import { supabase } from "@/integrations/supabase/client";
import type { DomainResult } from "@/utils/google/types";

export const getCachedDomainCheck = async (domain: string) => {
  try {
    const { data } = await supabase
      .from('domain_checks')
      .select('*')
      .eq('domain', domain)
      .maybeSingle();
    
    return data;
  } catch (error) {
    console.error(`Error fetching cached result for ${domain}:`, error);
    return null;
  }
};

export const updateDomainCache = async (domain: string, result: Partial<DomainResult>) => {
  try {
    const existingCheck = await getCachedDomainCheck(domain);
    
    if (existingCheck) {
      await supabase
        .from('domain_checks')
        .update({ 
          listing: result.listing,
          domain_rating: result.domainRating,
          checked_at: new Date().toISOString()
        })
        .eq('domain', domain);
    } else {
      await supabase
        .from('domain_checks')
        .insert({ 
          domain,
          listing: result.listing,
          domain_rating: result.domainRating,
          checked_at: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error(`Error updating database for ${domain}:`, error);
  }
};