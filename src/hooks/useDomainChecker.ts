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
      let batchResults: { domain: string; listing: GMBListing | null; }[] = [];
      let lastUpdateTime = Date.now();

      for (let i = 0; i < domainList.length; i++) {
        const domain = domainList[i];
        try {
          const listing = await searchGMBListing(domain);
          batchResults.push({ domain, listing });
        } catch (error) {
          console.error(`Error checking domain ${domain}:`, error);
          batchResults.push({ domain, listing: null });
        }
        
        const currentTime = Date.now();
        if (currentTime - lastUpdateTime >= 10000 || i === domainList.length - 1) {
          setResults(prev => [...prev, ...batchResults]);
          batchResults = [];
          lastUpdateTime = currentTime;
        }
        
        setProgress(((i + 1) / domainList.length) * 100);
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
