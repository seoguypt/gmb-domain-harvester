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

const cleanDomain = (domain: string): string => {
  // Remove protocol and www
  let cleaned = domain.toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '');
  
  // Common multi-part TLDs
  const multiPartTlds = [
    'co.uk', 'com.au', 'co.nz', 'co.jp', 'co.in', 
    'com.br', 'com.mx', 'co.za', 'com.sg', 'com.hk'
  ];
  
  // Check for multi-part TLDs first
  for (const tld of multiPartTlds) {
    if (cleaned.endsWith(`.${tld}`)) {
      cleaned = cleaned.slice(0, -(tld.length + 1)); // +1 for the dot
      console.log(`Found multi-part TLD: .${tld}, cleaned domain: ${cleaned}`);
      return cleaned;
    }
  }
  
  // If no multi-part TLD found, remove single TLD
  return cleaned.replace(/\.[^/.]+$/, '');
};

const cleanBusinessName = (domain: string): string => {
  let name = cleanDomain(domain);
  
  const suffixes = [
    "ltd", "limited", "inc", "incorporated", "llc", "corp", "corporation",
    "co", "company", "services", "solutions", "group", "holdings", "enterprises"
  ];
  
  suffixes.forEach(suffix => {
    const suffixPattern = new RegExp(`[-_]?${suffix}$`);
    name = name.replace(suffixPattern, '');
  });
  
  name = name.replace(/[-_]/g, ' ');
  
  return name.trim();
};

const normalizeDomain = (url: string): string => {
  return url.toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')  // Remove trailing slashes
    .split('/')[0];       // Get just the domain part
};

const domainsMatch = (domain1: string, domain2: string): boolean => {
  const norm1 = normalizeDomain(domain1);
  const norm2 = normalizeDomain(domain2);
  
  return norm1 === norm2 || 
         `www.${norm1}` === norm2 || 
         norm1 === `www.${norm2}`;
};

export const searchGMBListing = (domain: string): Promise<{
  businessName: string;
  address: string;
  rating: number;
  type: string;
  placeId: string;
  matchType: "website" | "name" | null;
  websiteUrl?: string;
} | null> => {
  return new Promise((resolve, reject) => {
    if (!placesService) {
      reject(new Error("Places service not initialized"));
      return;
    }

    const cleanedName = cleanBusinessName(domain);
    const cleanedDomain = cleanDomain(domain);
    console.log(`Searching for business: "${cleanedName}" (Domain: ${cleanedDomain})`);

    const request: google.maps.places.TextSearchRequest = {
      query: cleanedName,
      type: 'establishment'
    };

    placesService.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
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
              
              const nameMatch = (businessNameLower.includes(cleanedName) || 
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
                  placeId: placeId,
                  matchType: websiteMatch ? "website" : "name",
                  websiteUrl: place.website || undefined
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
  });
};
