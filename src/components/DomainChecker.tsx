import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { initGoogleMapsApi, searchGMBListing } from "@/utils/google";
import { APIKeys } from "./domain-checker/APIKeys";
import { DomainInput } from "./domain-checker/DomainInput";
import { BulkResults } from "./domain-checker/BulkResults";
import { ProgressIndicator } from "./domain-checker/ProgressIndicator";
import type { DomainResult } from "@/utils/google/types";
import { supabase } from "@/integrations/supabase/client";

export function DomainChecker() {
  const [domains, setDomains] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [googleApiKey, setGoogleApiKey] = useState("AIzaSyDrdKNl-vB_wFSUIGfe-ipW2_o3YPZxrE4");
  const [ahrefsApiKey, setAhrefsApiKey] = useState("");

  const initializeApi = async () => {
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

  const checkDomains = async () => {
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
        
        // If we have a cached result less than a week old, use it
        if (cachedCheck && new Date(cachedCheck.checked_at) > oneWeekAgo) {
          console.log(`Using cached result for ${domain}`);
          listing = cachedCheck.listing;
          domainRating = cachedCheck.domain_rating;
        } else {
          // Otherwise, fetch new data
          try {
            listing = await searchGMBListing(domain);
            
            // Fetch domain rating from Ahrefs if API key is provided
            if (ahrefsApiKey) {
              try {
                const ratingResponse = await fetch(`https://api.ahrefs.com/v3/site-explorer/domain-rating?target=${encodeURIComponent(domain)}`, {
                  headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${ahrefsApiKey}`
                  }
                });
                
                if (ratingResponse.ok) {
                  const ratingData = await ratingResponse.json();
                  domainRating = ratingData.domain?.domain_rating;
                }
              } catch (error) {
                console.error(`Error fetching domain rating for ${domain}:`, error);
              }
            }
            
            // Store or update the result in the database
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-2xl p-8 glass-card animate-fadeIn">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Domain Checker</h1>
            <p className="text-muted-foreground">
              Check if domains have active Google My Business listings
            </p>
          </div>

          <div className="space-y-4">
            <APIKeys
              googleApiKey={googleApiKey}
              setGoogleApiKey={setGoogleApiKey}
              ahrefsApiKey={ahrefsApiKey}
              setAhrefsApiKey={setAhrefsApiKey}
              isInitializing={isInitializing}
              onInitialize={initializeApi}
              isApiInitialized={isApiInitialized}
            />

            <DomainInput
              domains={domains}
              setDomains={setDomains}
              isLoading={isLoading}
              isApiInitialized={isApiInitialized}
              onCheck={checkDomains}
            />

            <ProgressIndicator isLoading={isLoading} progress={progress} />
          </div>

          {results.length > 0 && <BulkResults results={results} />}
        </div>
      </Card>
    </div>
  );
}