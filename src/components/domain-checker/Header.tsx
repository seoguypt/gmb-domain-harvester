import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClearCacheButton } from "./ClearCacheButton";

interface HeaderProps {
  onClearComplete: () => void;
}

export function Header({ onClearComplete }: HeaderProps) {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight">Domain Checker</h1>
      <p className="text-muted-foreground">
        Check if domains have active Google My Business listings
      </p>
      <div className="flex justify-center gap-2 mt-2">
        <Link to="/found">
          <Button variant="outline">
            View Found Domains
          </Button>
        </Link>
        <ClearCacheButton onClearComplete={onClearComplete} />
      </div>
    </div>
  );
}