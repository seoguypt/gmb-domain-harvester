import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Building2, Star, Loader2 } from "lucide-react";
import { initGoogleMapsApi, searchGMBListing } from "@/utils/googleApi";

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
            <div className="flex gap-2">
              <Input
                placeholder="Enter Google Maps API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="text-lg"
                type="password"
              />
              <Button
                onClick={initializeApi}
                disabled={isInitializing || !apiKey}
                className="min-w-[100px]"
              >
                {isInitializing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Initialize API"
                )}
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter domain (e.g., example.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="text-lg"
                disabled={isLoading || !isApiInitialized}
              />
              <Button
                onClick={checkDomain}
                disabled={isLoading || !isApiInitialized}
                className="min-w-[100px]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Check"
                )}
              </Button>
            </div>
          </div>

          {listing && (
            <div className="space-y-4 animate-fadeIn">
              <div className="h-px bg-border" />
              
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{listing.businessName}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{listing.address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-muted-foreground" />
                  <span>{listing.rating} / 5.0</span>
                </div>
                
                <div className="inline-flex">
                  <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    {listing.type}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}