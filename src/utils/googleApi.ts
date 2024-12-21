import { Loader } from "@googlemaps/js-api-loader";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    google: typeof google;
  }
}

let placesService: google.maps.places.PlacesService | null = null;

export const initGoogleMapsApi = async () => {
  try {
    console.log('Fetching Google Maps API key from Supabase...');
    const { data, error } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'GOOGLE_MAPS_API_KEY')
      .maybeSingle();

    if (error) {
      console.error('Error fetching API key:', error);
      throw new Error('Failed to fetch Google Maps API key');
    }
    
    if (!data?.value) {
      console.error('Google Maps API key not found or empty');
      throw new Error('Google Maps API key not found');
    }

    console.log('Initializing Google Maps loader...');
    const loader = new Loader({
      apiKey: data.value,
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

    const request: google.maps.places.TextSearchRequest = {
      query: domain.replace(/\.[^/.]+$/, ""), // Remove TLD
      type: 'establishment'
    };

    placesService.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
        const place = results[0];
        resolve({
          businessName: place.name || "",
          address: place.formatted_address || "",
          rating: place.rating || 0,
          type: place.types?.[0] || "Local Business",
        });
      } else {
        resolve(null);
      }
    });
  });
};