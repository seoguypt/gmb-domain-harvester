export interface GMBListing {
  businessName: string;
  address: string;
  rating: number;
  type: string;
  placeId: string;
  matchType: "website" | "name" | null;
  websiteUrl?: string;
}

type Library = 'places' | 'geometry' | 'drawing' | 'visualization';

export interface GoogleMapsConfig {
  apiKey: string;
  libraries: Library[];
  version: string;
}