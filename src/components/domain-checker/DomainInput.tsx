import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { CostEstimation } from "./CostEstimation";
import { useMemo } from "react";

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
  const domainCount = useMemo(() => {
    return domains
      .split("\n")
      .map(d => d.trim())
      .filter(d => d).length;
  }, [domains]);

  const handleCheck = async () => {
    await onCheck();
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Enter domains (one per line)"
        value={domains}
        onChange={(e) => setDomains(e.target.value)}
        className="min-h-[120px] text-base font-mono"
        disabled={isLoading || !isApiInitialized}
      />
      <CostEstimation domainCount={domainCount} />
      <Button
        onClick={handleCheck}
        disabled={isLoading || !isApiInitialized}
        className="w-full"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {isLoading ? "Checking Domains..." : "Check Domains"}
      </Button>
    </div>
  );
}