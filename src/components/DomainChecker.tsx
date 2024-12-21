import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { initGoogleMapsApi, searchGMBListing } from "@/utils/googleApi";
import { APIKeyInput } from "./domain-checker/APIKeyInput";
import { DomainInput } from "./domain-checker/DomainInput";
import { BulkResults } from "./domain-checker/BulkResults";
import { Header } from "./domain-checker/Header";
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

export function DomainChecker() {
  const [domains, setDomains] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [results, setResults] = useState<{ domain: string; listing: GMBListing | null; }[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [apiKey, setApiKey] = useState("AIzaSyDrdKNl-vB_wFSUIGfe-ipW2_o3YPZxrE4");

  const initializeApi = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Maps API key",
        variant: "destructive",
      });
      return;
    }

    setIsInitializing(true);
    try {
      await initGoogleMapsApi(apiKey);
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
        try {
          const { data: cachedResult } = await supabase
            .from('domain_checks')
            .select('listing')
            .eq('domain', domain)
            .maybeSingle();

          let listing;
          if (cachedResult) {
            console.log('Cache hit for domain:', domain);
            listing = cachedResult.listing;
          } else {
            console.log('Cache miss for domain:', domain);
            listing = await searchGMBListing(domain);
            if (listing) {
              await supabase
                .from('domain_checks')
                .insert({
                  domain: domain,
                  listing: listing,
                  checked_at: new Date().toISOString()
                });
            }
          }
          
          newResults.push({ domain, listing });
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-2xl p-8 glass-card animate-fadeIn">
        <div className="space-y-8">
          <Header onClearComplete={() => setResults([])} />

          <div className="space-y-4">
            <APIKeyInput
              apiKey={apiKey}
              setApiKey={setApiKey}
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

            {isLoading && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  Checking domains... {Math.round(progress)}%
                </p>
              </div>
            )}
          </div>

          {results.length > 0 && <BulkResults results={results} />}
        </div>
      </Card>
    </div>
  );
}
