import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { APIKeyInput } from "./APIKeyInput";

interface APIKeysProps {
  googleApiKey: string;
  setGoogleApiKey: (key: string) => void;
  isInitializing: boolean;
  onInitialize: () => Promise<void>;
  isApiInitialized: boolean;
}

export function APIKeys({
  googleApiKey,
  setGoogleApiKey,
  isInitializing,
  onInitialize,
  isApiInitialized,
}: APIKeysProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <APIKeyInput 
          value={googleApiKey}
          onChange={setGoogleApiKey}
        />
        <Button
          onClick={onInitialize}
          disabled={isInitializing || !googleApiKey}
          className="w-full"
        >
          {isInitializing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {isApiInitialized ? "API Ready" : "Initialize API"}
        </Button>
      </div>
    </div>
  );
}