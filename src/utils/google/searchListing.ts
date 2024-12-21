import { cleanBusinessName, cleanDomain, domainsMatch } from './domainUtils';
import type { GMBListing } from './types';

export const searchGMBListing = async (domain: string): Promise<GMBListing | null> => {
  const cleanedName = cleanBusinessName(domain);
  const cleanedDomain = cleanDomain(domain);
  console.log(`Searching for business: "${cleanedName}" (Domain: ${cleanedDomain})`);

  try {
    // Search for the place
    const searchResponse = await fetch(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': window.googleMapsApiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.websiteUri,places.rating'
        },
        body: JSON.stringify({
          textQuery: cleanedName,
          languageCode: "en"
        })
      }
    );

    const searchData = await searchResponse.json();
    
    if (!searchData.places || searchData.places.length === 0) {
      console.log('No places found');
      return null;
    }

    const place = searchData.places[0];
    
    // Get place details
    const detailsResponse = await fetch(
      `https://places.googleapis.com/v1/places/${place.id}`,
      {
        headers: {
          'X-Goog-Api-Key': window.googleMapsApiKey,
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,websiteUri,rating'
        }
      }
    );

    const placeDetails = await detailsResponse.json();
    
    const websiteMatch = placeDetails.websiteUri && domainsMatch(domain, placeDetails.websiteUri);
    const businessNameLower = placeDetails.displayName?.text?.toLowerCase() || '';
    
    const nameMatch = (businessNameLower.includes(cleanedName) || 
                      cleanedName.includes(businessNameLower)) &&
                      Math.min(businessNameLower.length, cleanedName.length) / 
                      Math.max(businessNameLower.length, cleanedName.length) > 0.7;
    
    if (websiteMatch || nameMatch) {
      console.log(`Match found! Type: ${websiteMatch ? 'website' : 'name'}`);
      return {
        businessName: placeDetails.displayName?.text || "",
        address: placeDetails.formattedAddress || "",
        rating: placeDetails.rating || 0,
        placeId: placeDetails.id,
        matchType: websiteMatch ? "website" : "name",
        websiteUrl: placeDetails.websiteUri,
        type: "business"
      };
    }

    console.log('No match - criteria not met');
    return null;
  } catch (error) {
    console.error('Error searching for place:', error);
    throw error;
  }
};