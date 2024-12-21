import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { DomainStats } from "./DomainStats";

interface DomainInputProps {
  domains: string;
  setDomains: (domains: string) => void;
  isLoading: boolean;
  isApiInitialized: boolean;
  onCheck: () => Promise<void>;
}

export function DomainInput({
  domains,
  setDomains,
  isLoading,
  isApiInitialized,
  onCheck,
}: DomainInputProps) {
  // Count domains from textarea
  const domainCount = domains.trim() 
    ? domains.split('\n').filter(d => d.trim()).length 
    : 0;

  return (
    <div className="space-y-4">
      <DomainStats domainCount={domainCount} />
      
      <div className="space-y-2">
        <Textarea
          placeholder="Enter domains (one per line)"
          value={domains}
          onChange={(e) => setDomains(e.target.value)}
          className="min-h-[120px] text-base font-mono"
          disabled={isLoading || !isApiInitialized}
        />
        <Button
          onClick={onCheck}
          disabled={isLoading || !isApiInitialized}
          className="w-full"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isLoading ? "Checking Domains..." : "Check Domains"}
        </Button>
      </div>
    </div>
  );
}
