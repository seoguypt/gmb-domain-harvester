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

      if (error) throw error;
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

    try {
      const newResults = [];
      for (let i = 0; i < domainList.length; i++) {
        const domain = domainList[i];
        
        const cachedCheck = await getCachedDomainCheck(domain);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        let listing = null;
        let seoData = null;
        
        if (cachedCheck && new Date(cachedCheck.checked_at) > oneWeekAgo) {
          console.log(`Using cached result for ${domain}`);
          listing = cachedCheck.listing;
          seoData = {
            semrush_rank: cachedCheck.semrush_rank,
            facebook_shares: cachedCheck.facebook_shares,
            ahrefs_rank: cachedCheck.ahrefs_rank
          };
        } else {
          try {
            listing = await searchGMBListing(domain);
            seoData = await fetchSeoData(domain);
            await updateDomainCache(domain, { 
              listing,
              ...seoData,
              processed_at: new Date().toISOString()
            });
          } catch (error) {
            console.error(`Error checking domain ${domain}:`, error);
          }
        }

        newResults.push({ 
          domain,
          listing,
          tld: domain.split('.').pop() || '',
          domainAge: 'N/A',
          ...seoData
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