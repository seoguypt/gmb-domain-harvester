import { Loader } from "@googlemaps/js-api-loader";

let placesService: google.maps.places.PlacesService | null = null;

export const initGoogleMapsApi = async () => {
  const loader = new Loader({
    apiKey: "", // We'll need to set this up
    version: "weekly",
    libraries: ["places"]
  });

  await loader.load();
  
  // Create a dummy map (required for PlacesService)
  const dummyDiv = document.createElement('div');
  const map = new google.maps.Map(dummyDiv, {
    center: { lat: 0, lng: 0 },
    zoom: 1
  });
  
  placesService = new google.maps.places.PlacesService(map);
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

    const request = {
      query: domain.replace(/\.[^/.]+$/, ""), // Remove TLD
      type: ['establishment']
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