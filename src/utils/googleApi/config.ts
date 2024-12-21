import { Loader } from "@googlemaps/js-api-loader";

type Library = "places" | "drawing" | "geometry" | "localContext" | "visualization";

export interface GoogleMapsConfig {
  apiKey: string;
  version: string;
  libraries: Library[];
}

export const createGoogleMapsLoader = (apiKey: string): Loader => {
  const config: GoogleMapsConfig = {
    apiKey,
    version: "weekly",
    libraries: ["places"]
  };
  
  return new Loader(config);
};