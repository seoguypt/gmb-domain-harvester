import { Loader } from "@googlemaps/js-api-loader";
import type { GoogleMapsConfig } from "./types";

let placesService: google.maps.places.PlacesService | null = null;

const defaultConfig: GoogleMapsConfig = {
  apiKey: "",
  libraries: ["places"],
  version: "weekly"
};

export const initGoogleMapsApi = async (apiKey: string) => {
  try {
    if (!apiKey) {
      throw new Error('Please enter a Google Maps API key');
    }

    console.log('Initializing Google Maps loader...');
    const loader = new Loader({
      ...defaultConfig,
      apiKey
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
    return placesService;
  } catch (error) {
    console.error('Error initializing Google Maps API:', error);
    throw error;
  }
};

export const getPlacesService = () => placesService;