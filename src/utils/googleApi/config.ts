import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";

export const createGoogleMapsLoader = (apiKey: string): Loader => {
  const config: LoaderOptions = {
    apiKey,
    version: "weekly",
    libraries: ["places"]
  };
  
  return new Loader(config);
};