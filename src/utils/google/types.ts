export interface GMBListing {
  placeId: string;
  businessName: string;
  address: string;
  rating: number;
  matchType: 'website' | 'name';
  type?: string;
  websiteUrl?: string;
}

export interface DomainResult {
  domain: string;
  listing: GMBListing | null;
  tld: string;
  domainAge: string;
}