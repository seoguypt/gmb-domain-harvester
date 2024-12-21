import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";

interface APIKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function APIKeyInput({ value, onChange }: APIKeyInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="apiKey">Google Maps API Key</Label>
        <a
          href="https://console.cloud.google.com/apis/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          Check API Usage
        </a>
      </div>
      <Input
        type="password"
        id="apiKey"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your Google Maps API key"
      />
    </div>
  );
}