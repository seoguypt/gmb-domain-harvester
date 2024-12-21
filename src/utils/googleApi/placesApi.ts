import { NETLIFY_FUNCTIONS_URL } from "./config";
import { cleanBusinessName } from "./domainUtils";

export const initGoogleMapsApi = async (apiKey: string) => {
  try {
    if (!apiKey) {
      throw new Error('Please enter a Google Maps API key');
    }
    
    console.log('Google Maps API key validated');
    return true;
  } catch (error) {
    console.error('Error initializing Google Maps API:', error);
    throw error;
  }
};

export const searchGMBListing = async (domain: string): Promise<{
  businessName: string;
  address: string;
  rating: number;
  type: string;
  placeId: string;
  matchType: "website" | "name" | null;
  websiteUrl?: string;
} | null> => {
  try {
    const cleanedName = cleanBusinessName(domain);
    console.log(`Searching for business: "${cleanedName}" (Domain: ${domain})`);

    const response = await fetch(`${NETLIFY_FUNCTIONS_URL}/places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domain,
        query: cleanedName
      })
    });

    if (!response.ok) {
      throw new Error(`Places API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Places API error: ${data.error}`);
    }

    return data.result;
  } catch (error) {
    console.error('Error searching GMB listing:', error);
    throw error;
  }
};
