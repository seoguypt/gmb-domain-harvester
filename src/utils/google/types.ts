export interface GMBListing {
  businessName: string;
  address: string;
  rating: number;
  type: string;
  placeId: string;
  matchType: "website" | "name" | null;
  websiteUrl?: string;
}

export interface DomainMetrics {
  organic: {
    pos_1: number;
    count: number;
    estimated_paid_traffic_cost: number;
  };
}

export interface BacklinksInfo {
  referringDomains: number;
  backlinks: number;
  dofollow: number;
}

export interface DomainResult {
  domain: string;
  listing: GMBListing | null;
  domainAge?: string;
  registrar?: string;
  expiryDate?: string;
  tld?: string;
  registered?: boolean;
  metrics?: DomainMetrics;
  backlinksInfo?: BacklinksInfo;
}