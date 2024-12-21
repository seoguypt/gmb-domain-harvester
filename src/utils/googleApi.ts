import { Loader } from "@googlemaps/js-api-loader";

declare global {
  interface Window {
    google: typeof google;
  }
}

let placesService: google.maps.places.PlacesService | null = null;

export const initGoogleMapsApi = async (apiKey: string) => {
  try {
    if (!apiKey) {
      throw new Error('Please enter a Google Maps API key');
    }

    console.log('Initializing Google Maps loader...');
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["places"]
    });

    console.log('Loading Google Maps API...');
    await loader.load();
    
    // Create a dummy map (required for PlacesService)
    const dummyDiv = document.createElement('div');
    const map = new google.maps.Map(dummyDiv, {
      center: { lat: 0, lng: 0 },
      zoom: 1
    });
    
    console.log('Initializing Places service...');
    placesService = new google.maps.places.PlacesService(map);
    
    if (!placesService) {
      throw new Error('Failed to initialize Places service');
    }
    
    console.log('Google Maps API initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Google Maps API:', error);
    throw error;
  }
};

const cleanBusinessName = (domain: string): string => {
  // Remove TLD and common subdomain
  let name = domain.replace(/\.[^/.]+$/, "").replace("www.", "");
  
  // Remove common business suffixes
  const suffixes = [
    "ltd", "limited", "inc", "incorporated", "llc", "corp", "corporation",
    "co", "company", "services", "solutions", "group", "holdings", "enterprises"
  ];
  
  // Convert to lowercase for comparison
  name = name.toLowerCase();
  
  // Remove suffixes if they appear at the end of the name
  suffixes.forEach(suffix => {
    const suffixPattern = new RegExp(`[-_]?${suffix}$`);
    name = name.replace(suffixPattern, '');
  });
  
  // Replace dashes and underscores with spaces
  name = name.replace(/[-_]/g, ' ');
  
  return name.trim();
};

export const searchGMBListing = (domain: string): Promise<{
  businessName: string;
  address: string;
  rating: number;
  type: string;
} | null> => {
  return new Promise((resolve, reject) => {
    if (!placesService) {
      reject(new Error("Places service not initialized"));
      return;
    }

    const cleanedName = cleanBusinessName(domain);
    console.log(`Searching for business: "${cleanedName}"`);

    const request: google.maps.places.TextSearchRequest = {
      query: cleanedName,
      type: 'establishment'
    };

    placesService.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
        // Get more details about the place
        const placeId = results[0].place_id;
        
        placesService.getDetails(
          {
            placeId: placeId,
            fields: ['name', 'formatted_address', 'rating', 'types', 'website']
          },
          (place, detailsStatus) => {
            if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && place) {
              // Only return a match if the website domain matches or the names are very similar
              const placeWebsite = place.website?.toLowerCase() || '';
              const domainLower = domain.toLowerCase();
              
              // Check if the website matches the domain or if it's a subdomain
              const websiteMatch = placeWebsite.includes(domainLower) || 
                                 domainLower.includes(placeWebsite.replace(/^https?:\/\//i, ''));
              
              // Check if the business name is similar to the domain name
              const nameMatch = place.name?.toLowerCase().includes(cleanedName) || 
                              cleanedName.includes(place.name?.toLowerCase() || '');
              
              if (websiteMatch || nameMatch) {
                resolve({
                  businessName: place.name || "",
                  address: place.formatted_address || "",
                  rating: place.rating || 0,
                  type: place.types?.[0] || "Local Business",
                });
              } else {
                resolve(null);
              }
            } else {
              resolve(null);
            }
          }
        );
      } else {
        resolve(null);
      }
    });
  });
};