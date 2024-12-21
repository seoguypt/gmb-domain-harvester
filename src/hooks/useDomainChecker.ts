import { useState } from "react";
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

export function useDomainChecker() {
  const [domains, setDomains] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    domain: string;
    listing: GMBListing | null;
  }[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

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
      const BATCH_SIZE = 20; // Process more domains concurrently with rate limiting
      const UPDATE_INTERVAL = 10000; // 10 seconds
      let processedCount = 0;
      let batchResults: { domain: string; listing: GMBListing | null; }[] = [];
      let lastUpdateTime = Date.now();

      // Process domains in batches
      for (let i = 0; i < domainList.length; i += BATCH_SIZE) {
        const batch = domainList.slice(i, Math.min(i + BATCH_SIZE, domainList.length));
        
        // Process batch concurrently - rate limiter in searchGMBListing handles the throttling
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
        const currentBatchResults = await Promise.all(batchPromises);
        processedCount += currentBatchResults.length;
        batchResults.push(...currentBatchResults);
        
        // Update results if enough time has passed or this is the last batch
        const currentTime = Date.now();
        if (currentTime - lastUpdateTime >= UPDATE_INTERVAL || processedCount === domainList.length) {
          setResults(prev => [...prev, ...batchResults]);
          batchResults = [];
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

  return {
    domains,
    setDomains,
    isLoading,
    results,
    setResults,
    progress,
    checkDomains,
  };
}
