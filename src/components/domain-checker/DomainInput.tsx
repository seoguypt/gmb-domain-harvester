import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";

interface DomainInputProps {
  domains: string;
  setDomains: (domains: string) => void;
  isLoading: boolean;
  isApiInitialized: boolean;
  onCheck: () => Promise<void>;
  onClear: () => void;
}

export function DomainInput({
  domains,
  setDomains,
  isLoading,
  isApiInitialized,
  onCheck,
  onClear,
}: DomainInputProps) {
  const handleCheck = async () => {
    await onCheck();
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          placeholder="Enter domains (one per line)"
          value={domains}
          onChange={(e) => setDomains(e.target.value)}
          className="min-h-[120px] text-base font-mono pr-8"
          disabled={isLoading || !isApiInitialized}
        />
        {domains && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={onClear}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
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