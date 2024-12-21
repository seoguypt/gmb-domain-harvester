import { getPlacesService } from "./config";
import { cleanBusinessName, domainsMatch } from "./domainUtils";
import type { GMBListing } from "./types";

export const searchGMBListing = (domain: string): Promise<GMBListing | null> => {
  return new Promise((resolve, reject) => {
    const placesService = getPlacesService();
    if (!placesService) {
      reject(new Error("Places service not initialized"));
      return;
    }

    const cleanedName = cleanBusinessName(domain);
    console.log(`Searching for business: "${cleanedName}" (Domain: ${domain})`);

    // Using the new Places API search method
    const searchRequest: google.maps.places.FindPlaceFromTextRequest = {
      query: cleanedName,
      fields: ['name', 'formatted_address', 'rating', 'type', 'place_id', 'website']
    };

    placesService.findPlaceFromText(
      searchRequest,
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
          const place = results[0];
          const placeWebsite = place.website || '';
          const businessNameLower = place.name?.toLowerCase() || '';
          
          console.log(`Found place:
            Place name: ${businessNameLower}
            Place website: ${placeWebsite}
            Cleaned name: ${cleanedName}`);
          
          const websiteMatch = placeWebsite && domainsMatch(domain, placeWebsite);
          
          // Only check name match if no website match is found
          const nameMatch = !websiteMatch && 
                          (businessNameLower.includes(cleanedName) || 
                           cleanedName.includes(businessNameLower)) &&
                          Math.min(businessNameLower.length, cleanedName.length) / 
                          Math.max(businessNameLower.length, cleanedName.length) > 0.7;
          
          if (websiteMatch || nameMatch) {
            console.log(`Match found! Type: ${websiteMatch ? 'website' : 'name'}`);
            resolve({
              businessName: place.name || "",
              address: place.formatted_address || "",
              rating: place.rating || 0,
              type: place.types?.[0] || "Local Business",
              placeId: place.place_id || "",
              matchType: websiteMatch ? "website" : "name",
              websiteUrl: place.website || undefined
            });
          } else {
            console.log('No match - criteria not met');
            resolve(null);
          }
        } else {
          console.log('No match - no search results');
          resolve(null);
        }
      }
    );
  });
};