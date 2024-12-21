import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { initGoogleMapsApi, searchGMBListing } from "@/utils/google";
import { supabase } from "@/integrations/supabase/client";
import type { DomainResult } from "@/utils/google/types";

export function useDomainChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const { toast } = useToast();

  const initializeApi = async (googleApiKey: string) => {
    if (!googleApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Maps API key",
        variant: "destructive",
      });
      return;
    }

    setIsInitializing(true);
    try {
      await initGoogleMapsApi(googleApiKey);
      setIsApiInitialized(true);
      toast({
        title: "API Initialized",
        description: "Google Maps API is ready to use",
      });
    } catch (error) {
      console.error("Failed to initialize Google Maps API:", error);
      toast({
        title: "API Initialization Error",
        description: error instanceof Error ? error.message : "Failed to initialize Google Maps API",
        variant: "destructive",
      });
      setIsApiInitialized(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const getDomainRating = async (domain: string, apiKey: string) => {
    try {
      console.log(`Fetching domain rating for ${domain}`);
      const response = await fetch(
        `https://api.ahrefs.com/v3/site-explorer/domain-rating?target=${encodeURIComponent(domain)}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ahrefs API error:', errorText);
        throw new Error(`Ahrefs API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Ahrefs API response:', data);
      return data?.domain_rating;
    } catch (error) {
      console.error(`Error fetching domain rating for ${domain}:`, error);
      toast({
        title: "Domain Rating Error",
        description: `Failed to fetch domain rating for ${domain}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const checkDomains = async (domains: string, ahrefsApiKey: string) => {
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
        
        let cachedCheck = null;
        try {
          const { data } = await supabase
            .from('domain_checks')
            .select('*')
            .eq('domain', domain)
            .maybeSingle();
          
          cachedCheck = data;
        } catch (error) {
          console.error(`Error fetching cached result for ${domain}:`, error);
        }

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        let listing = null;
        let domainRating = null;
        
        if (cachedCheck && new Date(cachedCheck.checked_at) > oneWeekAgo) {
          console.log(`Using cached result for ${domain}`);
          listing = cachedCheck.listing;
          domainRating = cachedCheck.domain_rating;
        } else {
          try {
            listing = await searchGMBListing(domain);
            
            if (ahrefsApiKey) {
              domainRating = await getDomainRating(domain, ahrefsApiKey);
            }
            
            try {
              if (cachedCheck) {
                await supabase
                  .from('domain_checks')
                  .update({ 
                    listing,
                    domain_rating: domainRating,
                    checked_at: new Date().toISOString()
                  })
                  .eq('domain', domain);
              } else {
                await supabase
                  .from('domain_checks')
                  .insert({ 
                    domain,
                    listing,
                    domain_rating: domainRating,
                    checked_at: new Date().toISOString()
                  });
              }
            } catch (error) {
              console.error(`Error updating database for ${domain}:`, error);
            }
          } catch (error) {
            console.error(`Error checking domain ${domain}:`, error);
          }
        }

        newResults.push({ 
          domain,
          listing,
          tld: domain.split('.').pop() || '',
          domainAge: 'N/A',
          domainRating
        });
        
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
    isLoading,
    isInitializing,
    results,
    progress,
    isApiInitialized,
    initializeApi,
    checkDomains,
  };
}