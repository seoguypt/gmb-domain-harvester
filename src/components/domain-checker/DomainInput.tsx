import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface DomainInputProps {
  domain: string;
  setDomain: (domain: string) => void;
  isLoading: boolean;
  isApiInitialized: boolean;
  onCheck: () => Promise<void>;
}

export function DomainInput({
  domain,
  setDomain,
  isLoading,
  isApiInitialized,
  onCheck,
}: DomainInputProps) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter domain (e.g., example.com)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        className="text-lg"
        disabled={isLoading || !isApiInitialized}
      />
      <Button
        onClick={onCheck}
        disabled={isLoading || !isApiInitialized}
        className="min-w-[100px]"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
      </Button>
    </div>
  );
}