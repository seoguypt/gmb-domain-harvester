import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { initGoogleMapsApi, searchGMBListing } from "@/utils/googleApi";
import { APIKeyInput } from "./domain-checker/APIKeyInput";
import { DomainInput } from "./domain-checker/DomainInput";
import { BulkResults } from "./domain-checker/BulkResults";

interface GMBListing {
  businessName: string;
  address: string;
  rating: number;
  type: string;
}

export function DomainChecker() {
  const [domains, setDomains] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [results, setResults] = useState<{ domain: string; listing: GMBListing | null; }[]>([]);
  const { toast } = useToast();
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [apiKey, setApiKey] = useState("");

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

    const domainList = domains
      .split("\n")
      .map(d => d.trim())
      .filter(d => d);

    try {
      const newResults = [];
      for (const domain of domainList) {
        try {
          const listing = await searchGMBListing(domain);
          newResults.push({ domain, listing });
        } catch (error) {
          console.error(`Error checking domain ${domain}:`, error);
          newResults.push({ domain, listing: null });
        }
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
          </div>

          {results.length > 0 && <BulkResults results={results} />}
        </div>
      </Card>
    </div>
  );
}