import { supabase } from "@/integrations/supabase/client";
import type { GMBListing, DomainResult } from "@/utils/google/types";
import type { Json } from "@/integrations/supabase/types";

// Convert GMBListing to a JSON-compatible format
const convertListingToJson = (listing: GMBListing | null): Json => {
  if (!listing) return null;
  return {
    placeId: listing.placeId,
    businessName: listing.businessName,
    address: listing.address,
    rating: listing.rating,
    matchType: listing.matchType,
    type: listing.type,
    websiteUrl: listing.websiteUrl
  } as Json;
};

// Convert JSON back to GMBListing
const convertJsonToListing = (json: Json): GMBListing | null => {
  if (!json || typeof json !== 'object') return null;
  const listing = json as Record<string, unknown>;
  
  if (
    typeof listing.placeId === 'string' &&
    typeof listing.businessName === 'string' &&
    typeof listing.address === 'string' &&
    typeof listing.rating === 'number' &&
    (listing.matchType === 'website' || listing.matchType === 'name')
  ) {
    return {
      placeId: listing.placeId,
      businessName: listing.businessName,
      address: listing.address,
      rating: listing.rating,
      matchType: listing.matchType as 'website' | 'name',
      type: listing.type as string | undefined,
      websiteUrl: listing.websiteUrl as string | undefined
    };
  }
  return null;
};

export const getCachedDomainCheck = async (domain: string) => {
  try {
    const { data } = await supabase
      .from('domain_checks')
      .select('*')
      .eq('domain', domain)
      .maybeSingle();
    
    if (data) {
      return {
        ...data,
        listing: convertJsonToListing(data.listing)
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching cached result for ${domain}:`, error);
    return null;
  }
};

export const updateDomainCache = async (domain: string, result: Partial<DomainResult>) => {
  try {
    const jsonListing = convertListingToJson(result.listing);
    
    const existingCheck = await getCachedDomainCheck(domain);
    
    if (existingCheck) {
      await supabase
        .from('domain_checks')
        .update({ 
          listing: jsonListing,
          domain_rating: result.domainRating,
          checked_at: new Date().toISOString()
        })
        .eq('domain', domain);
    } else {
      await supabase
        .from('domain_checks')
        .insert({ 
          domain,
          listing: jsonListing,
          domain_rating: result.domainRating,
          checked_at: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error(`Error updating database for ${domain}:`, error);
  }
};