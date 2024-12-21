import { placesService } from './initialization';
import { cleanBusinessName, cleanDomain, domainsMatch } from './domainUtils';
import type { GMBListing } from './types';

export const searchGMBListing = (domain: string): Promise<GMBListing | null> => {
  return new Promise((resolve, reject) => {
    if (!placesService) {
      reject(new Error("Places service not initialized"));
      return;
    }

    const cleanedName = cleanBusinessName(domain);
    const cleanedDomain = cleanDomain(domain);
    console.log(`Searching for business: "${cleanedName}" (Domain: ${cleanedDomain})`);

    // First try searching by the full business name
    const searchByName = () => {
      const request: google.maps.places.TextSearchRequest = {
        query: cleanedName,
        type: 'establishment'
      };

      placesService.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          // Sort results to prioritize exact matches
          results.sort((a, b) => {
            const aName = a.name?.toLowerCase() || '';
            const bName = b.name?.toLowerCase() || '';
            const nameToMatch = cleanedName.toLowerCase();
            
            // Exact matches first
            if (aName === nameToMatch && bName !== nameToMatch) return -1;
            if (bName === nameToMatch && aName !== nameToMatch) return 1;
            
            // Then partial matches
            const aIncludes = aName.includes(nameToMatch) || nameToMatch.includes(aName);
            const bIncludes = bName.includes(nameToMatch) || nameToMatch.includes(bName);
            if (aIncludes && !bIncludes) return -1;
            if (bIncludes && !aIncludes) return 1;
            
            return 0;
          });

          const placeId = results[0].place_id;
          
          placesService.getDetails(
            {
              placeId: placeId,
              fields: ['name', 'formatted_address', 'rating', 'types', 'website']
            },
            (place, detailsStatus) => {
              if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && place) {
                const placeWebsite = place.website || '';
                const businessNameLower = place.name?.toLowerCase() || '';
                
                console.log(`Comparing:
                  Input domain: ${domain}
                  Cleaned domain: ${cleanedDomain}
                  Place website: ${placeWebsite}
                  Place name: ${businessNameLower}
                  Cleaned name: ${cleanedName}`);
                
                const websiteMatch = placeWebsite && domainsMatch(domain, placeWebsite);
                const nameMatch = businessNameLower.includes(cleanedName) || 
                                cleanedName.includes(businessNameLower);
                
                if (websiteMatch || nameMatch) {
                  console.log(`Match found! Type: ${websiteMatch ? 'website' : 'name'}`);
                  resolve({
                    businessName: place.name || "",
                    address: place.formatted_address || "",
                    rating: place.rating || 0,
                    placeId: placeId,
                    matchType: websiteMatch ? "website" : "name",
                    websiteUrl: place.website || undefined,
                    type: place.types?.[0]
                  });
                } else {
                  console.log('No match - criteria not met');
                  resolve(null);
                }
              } else {
                console.log('No match - could not get place details');
                resolve(null);
              }
            }
          );
        } else {
          console.log('No match - no search results');
          resolve(null);
        }
      });
    };

    // Start the search process
    searchByName();
  });
};