import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { initGoogleMapsApi, searchGMBListing } from "@/utils/googleApi";
import { APIKeyInput } from "./domain-checker/APIKeyInput";
import { DomainInput } from "./domain-checker/DomainInput";
import { ListingResult } from "./domain-checker/ListingResult";

interface GMBListing {
  businessName: string;
  address: string;
  rating: number;
  type: string;
}

export function DomainChecker() {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [listing, setListing] = useState<GMBListing | null>(null);
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

  const checkDomain = async () => {
    if (!domain) {
      toast({
        title: "Please enter a domain",
        description: "Enter a domain to check for GMB listings",
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
    setListing(null);

    try {
      const result = await searchGMBListing(domain);
      if (result) {
        setListing(result);
        toast({
          title: "GMB Listing Found!",
          description: "We found an active GMB listing for this domain.",
        });
      } else {
        toast({
          title: "No GMB Listing Found",
          description: "We couldn't find a GMB listing for this domain.",
        });
      }
    } catch (error) {
      console.error("Error checking domain:", error);
      toast({
        title: "Error checking domain",
        description: "Unable to check GMB listing at this time.",
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
              Check if a domain has an active Google My Business listing
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
              domain={domain}
              setDomain={setDomain}
              isLoading={isLoading}
              isApiInitialized={isApiInitialized}
              onCheck={checkDomain}
            />
          </div>

          {listing && <ListingResult listing={listing} />}
        </div>
      </Card>
    </div>
  );
}