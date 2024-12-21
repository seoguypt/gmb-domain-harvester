export interface GMBListing {
  businessName: string;
  address: string;
  rating: number;
  type: string;
  placeId: string;
  matchType: "website" | "name" | null;
  websiteUrl?: string;
}

export interface GoogleMapsConfig {
  apiKey: string;
  libraries: string[];
  version: string;
}