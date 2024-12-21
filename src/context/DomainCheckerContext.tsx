import React, { createContext, useContext, useState } from "react";
import { useToast } from "../components/ui/use-toast";
import { searchGMBListing } from "../utils/googleApi";

interface GMBListing {
  businessName: string;
  address: string;
  rating: number;
  type: string;
  placeId: string;
  matchType: "website" | "name" | null;
  websiteUrl?: string;
}

interface DomainResult {
  domain: string;
  listing: GMBListing | null;
}

interface DomainCheckerContextType {
  domains: string;
  setDomains: (domains: string) => void;
  isLoading: boolean;
  results: DomainResult[];
  setResults: React.Dispatch<React.SetStateAction<DomainResult[]>>;
  websiteMatches: DomainResult[];
  progress: number;
  checkDomains: (isApiInitialized: boolean) => Promise<void>;
  clearWebsiteMatches: () => void;
}

const DomainCheckerContext = createContext<DomainCheckerContextType | undefined>(undefined);

export function DomainCheckerProvider({ children }: { children: React.ReactNode }) {
  const [domains, setDomains] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [websiteMatches, setWebsiteMatches] = useState<DomainResult[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const clearWebsiteMatches = () => {
    setWebsiteMatches([]);
    toast({
      title: "Success",
      description: "All website matches have been cleared",
    });
  };

  const checkDomains = async (isApiInitialized: boolean) => {
    if (!domains.trim()) {
      toast({
        title: "Please enter domains",
        description: "Enter one or more domains to check for GMB listings",
        variant: "destructive",
      });
      return;
    }

    if (!isApiInitialized) {
      toast({
        title: "API Not Ready",
        description: "Please enter your API key and initialize the API first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults([]);
    setProgress(0);

    const domainList = domains
      .split("\n")
      .map(d => d.trim())
      .filter(d => d);

    try {
      const BATCH_SIZE = 5; // Process 5 domains concurrently
      const UPDATE_INTERVAL = 10000; // 10 seconds
      let processedCount = 0;
      let batchResults: DomainResult[] = [];
      let lastUpdateTime = Date.now();

      // Split domains into batches
      for (let i = 0; i < domainList.length; i += BATCH_SIZE) {
        const batch = domainList.slice(i, i + BATCH_SIZE);
        
        // Process batch concurrently
        const batchPromises = batch.map(async (domain) => {
          try {
            const listing = await searchGMBListing(domain);
            return { domain, listing };
          } catch (error) {
            console.error(`Error checking domain ${domain}:`, error);
            return { domain, listing: null };
          }
        });

        // Wait for current batch to complete
        const batchResults = await Promise.all(batchPromises);
        processedCount += batchResults.length;
        
        // Update results and website matches
        const currentTime = Date.now();
        if (currentTime - lastUpdateTime >= UPDATE_INTERVAL || processedCount === domainList.length) {
          setResults(prev => [...prev, ...batchResults]);
          
          // Update website matches
          const newWebsiteMatches = batchResults.filter(result => result.listing?.matchType === 'website');
          if (newWebsiteMatches.length > 0) {
            setWebsiteMatches(prev => [...prev, ...newWebsiteMatches]);
          }
          
          lastUpdateTime = currentTime;
        }
        
        setProgress((processedCount / domainList.length) * 100);
      }
      toast({
        title: "Domain Check Complete",
        description: `Checked ${domainList.length} domain${domainList.length === 1 ? '' : 's'}`,
      });
    } catch (error) {
      console.error("Error checking domains:", error);
      toast({
        title: "Error checking domains",
        description: "Unable to check GMB listings at this time.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <DomainCheckerContext.Provider
      value={{
        domains,
        setDomains,
        isLoading,
        results,
        setResults,
        websiteMatches,
        progress,
        checkDomains,
        clearWebsiteMatches,
      }}
    >
      {children}
    </DomainCheckerContext.Provider>
  );
}

export function useDomainChecker() {
  const context = useContext(DomainCheckerContext);
  if (context === undefined) {
    throw new Error("useDomainChecker must be used within a DomainCheckerProvider");
  }
  return context;
}
