import { Loader } from "@googlemaps/js-api-loader";

declare global {
  interface Window {
    google: typeof google;
    googleMapsApiKey: string;
  }
}

export let placesService: google.maps.places.PlacesService | null = null;

export const initGoogleMapsApi = async (apiKey: string): Promise<void> => {
  try {
    window.googleMapsApiKey = apiKey;
    
    // We still need to load the Maps JavaScript API for the PlaceId links to work
    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"]
    });

    await loader.load();
    
    // Create a dummy map (needed for PlaceId links)
    const mapDiv = document.createElement('div');
    const map = new google.maps.Map(mapDiv);
    placesService = new google.maps.places.PlacesService(map);

    console.log('Google Maps API initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Maps API:', error);
    throw error;
  }
};