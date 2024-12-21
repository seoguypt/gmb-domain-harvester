import { GMBListing } from "./listing";

export interface BatchResult {
  domain: string;
  listing: GMBListing | null;
}

export interface Batch {
  id: string;
  name: string;
  createdAt: string;
  results: BatchResult[];
  websiteMatches: BatchResult[];
  nameMatches: BatchResult[];
}

export interface BatchSummary {
  id: string;
  name: string;
  createdAt: string;
  totalDomains: number;
  websiteMatches: number;
  nameMatches: number;
}
