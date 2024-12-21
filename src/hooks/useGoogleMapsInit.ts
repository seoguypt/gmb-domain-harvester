import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { initGoogleMapsApi } from "@/utils/googleApi";

export function useGoogleMapsInit(initialApiKey: string) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const { toast } = useToast();

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

  return {
    apiKey,
    setApiKey,
    isInitializing,
    isApiInitialized,
    initializeApi,
  };
}