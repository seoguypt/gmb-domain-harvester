export interface GMBListing {
  placeId: string;
  businessName: string;
  address: string;
  rating: number;
  matchType: 'website' | 'name';
}

export interface DomainResult {
  domain: string;
  listing: GMBListing | null;
  tld: string;
  domainAge: string;
}