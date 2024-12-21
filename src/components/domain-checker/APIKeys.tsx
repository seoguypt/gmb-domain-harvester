import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

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
        <div className="flex gap-2">
          <Input
            placeholder="Enter Google Maps API Key"
            value={googleApiKey}
            onChange={(e) => setGoogleApiKey(e.target.value)}
            className="text-lg"
            type="password"
          />
          <Button
            onClick={onInitialize}
            disabled={isInitializing || !googleApiKey}
            className="min-w-[100px]"
          >
            {isInitializing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Initialize API"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}