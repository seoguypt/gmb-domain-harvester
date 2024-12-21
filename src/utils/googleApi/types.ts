type Library = "places" | "drawing" | "geometry" | "localContext" | "visualization";

export interface GoogleMapsConfig {
  apiKey: string;
  version: string;
  libraries: Library[];
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