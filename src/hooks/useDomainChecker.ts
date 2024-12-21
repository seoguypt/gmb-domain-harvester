import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { initGoogleMapsApi, searchGMBListing } from "@/utils/google";
import { getCachedDomainCheck, updateDomainCache } from "@/utils/cache/domainCache";
import type { DomainResult } from "@/utils/google/types";
import { supabase } from "@/integrations/supabase/client";

export function useDomainChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const { toast } = useToast();

  const fetchSeoData = async (domain: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('fetchSeoData', {
        body: { domain }
      });

      if (error) {
        console.error('Error fetching SEO data:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error fetching SEO data:', error);
      return null;
    }
  };

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

  const checkDomains = async (domains: string) => {
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

    const totalDomains = domainList.length;
    const newResults: DomainResult[] = [];

    try {
      for (let i = 0; i < domainList.length; i++) {
        const domain = domainList[i];
        let result: DomainResult = {
          domain,
          listing: null,
          tld: domain.split('.').pop() || '',
          domainAge: 'N/A'
        };
        
        try {
          const cachedCheck = await getCachedDomainCheck(domain);
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          if (cachedCheck && new Date(cachedCheck.checked_at) > oneWeekAgo) {
            console.log(`Using cached result for ${domain}`);
            result = {
              ...result,
              listing: cachedCheck.listing,
              semrush_rank: cachedCheck.semrush_rank,
              facebook_shares: cachedCheck.facebook_shares,
              ahrefs_rank: cachedCheck.ahrefs_rank
            };
          } else {
            const [listing, seoData] = await Promise.all([
              searchGMBListing(domain).catch(err => {
                console.error(`Error searching GMB listing for ${domain}:`, err);
                return null;
              }),
              fetchSeoData(domain).catch(err => {
                console.error(`Error fetching SEO data for ${domain}:`, err);
                return null;
              })
            ]);

            result = {
              ...result,
              listing,
              ...(seoData || {})
            };

            // Update cache in background
            updateDomainCache(domain, result).catch(err => {
              console.error(`Error updating cache for ${domain}:`, err);
            });
          }
        } catch (error) {
          console.error(`Error processing domain ${domain}:`, error);
          // Continue with next domain even if there's an error
        }

        newResults.push(result);
        setResults([...newResults]); // Update results immediately for each domain
        setProgress(((i + 1) / totalDomains) * 100);
      }

      toast({
        title: "Domain Check Complete",
        description: `Checked ${totalDomains} domain${totalDomains === 1 ? '' : 's'}`,
      });
    } catch (error) {
      console.error("Error in domain checking process:", error);
      toast({
        title: "Error checking domains",
        description: "Some domains may not have been checked properly.",
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