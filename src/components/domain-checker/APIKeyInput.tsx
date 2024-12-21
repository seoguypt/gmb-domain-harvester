import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface APIKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  isInitializing: boolean;
  onInitialize: () => Promise<void>;
  isApiInitialized: boolean;
  dataForSeoLogin: string;
  setDataForSeoLogin: (login: string) => void;
  dataForSeoPassword: string;
  setDataForSeoPassword: (password: string) => void;
}

export function APIKeyInput({
  apiKey,
  setApiKey,
  isInitializing,
  onInitialize,
  isApiInitialized,
  dataForSeoLogin,
  setDataForSeoLogin,
  dataForSeoPassword,
  setDataForSeoPassword,
}: APIKeyInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Enter Google Maps API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="text-lg"
          type="password"
        />
        <Button
          onClick={onInitialize}
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
          placeholder="DataForSEO Login"
          value={dataForSeoLogin}
          onChange={(e) => setDataForSeoLogin(e.target.value)}
          className="text-lg"
          type="text"
        />
        <Input
          placeholder="DataForSEO Password"
          value={dataForSeoPassword}
          onChange={(e) => setDataForSeoPassword(e.target.value)}
          className="text-lg"
          type="password"
        />
      </div>
    </div>
  );
}