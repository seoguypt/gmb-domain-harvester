import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { searchGMBListing } from "@/utils/googleApi";
import { supabase } from "@/integrations/supabase/client";

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
    domain_rating?: number;
    semrush_rank?: number;
    facebook_shares?: number;
    ahrefs_rank?: number;
  }[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const fetchDomainAnalytics = async (domain: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('dataforseo', {
        body: { domain }
      });

      if (error) {
        console.error('Error fetching domain analytics:', error);
        return null;
      }

      if (data?.tasks?.[0]?.result?.[0]) {
        const metrics = data.tasks[0].result[0];
        console.log('DataForSEO metrics:', metrics);
        return {
          domain_rating: metrics.domain_rank,
          semrush_rank: metrics.semrush_rank,
          facebook_shares: metrics.facebook_shares,
          ahrefs_rank: metrics.ahrefs_rank
        };
      }
      return null;
    } catch (error) {
      console.error('Error calling DataForSEO function:', error);
      return null;
    }
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
      const newResults = [];
      for (let i = 0; i < domainList.length; i++) {
        const domain = domainList[i];
        try {
          const { data: cachedResult } = await supabase
            .from('domain_checks')
            .select('*')
            .eq('domain', domain)
            .maybeSingle();

          let listing;
          let metrics = null;

          if (cachedResult) {
            console.log('Cache hit for domain:', domain);
            listing = cachedResult.listing;
            metrics = {
              domain_rating: cachedResult.domain_rating,
              semrush_rank: cachedResult.semrush_rank,
              facebook_shares: cachedResult.facebook_shares,
              ahrefs_rank: cachedResult.ahrefs_rank
            };
          } else {
            console.log('Cache miss for domain:', domain);
            listing = await searchGMBListing(domain);
            metrics = await fetchDomainAnalytics(domain);

            if (listing || metrics) {
              await supabase
                .from('domain_checks')
                .insert({
                  domain: domain,
                  listing: listing,
                  checked_at: new Date().toISOString(),
                  ...(metrics && {
                    domain_rating: metrics.domain_rating,
                    semrush_rank: metrics.semrush_rank,
                    facebook_shares: metrics.facebook_shares,
                    ahrefs_rank: metrics.ahrefs_rank
                  })
                });
            }
          }
          
          newResults.push({ 
            domain, 
            listing,
            ...metrics
          });
        } catch (error) {
          console.error(`Error checking domain ${domain}:`, error);
          newResults.push({ domain, listing: null });
        }
        setProgress(((i + 1) / domainList.length) * 100);
      }
      
      setResults(newResults);
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