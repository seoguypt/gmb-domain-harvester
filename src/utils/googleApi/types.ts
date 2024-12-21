import type { Libraries } from "@googlemaps/js-api-loader";

export interface GoogleMapsConfig {
  apiKey: string;
  version: string;
  libraries: Libraries;
}

export interface GMBListing {
  businessName: string;
  address: string;
  rating: number;
  type: string;
  placeId: string;
  matchType: "website" | "name" | null;
  websiteUrl?: string;
}