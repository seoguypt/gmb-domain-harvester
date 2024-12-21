import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useDomainChecker } from "../../context/DomainCheckerContext";

export function ClearCacheButton() {
  const { toast } = useToast();
  const { clearWebsiteMatches, clearNameMatches } = useDomainChecker();

  const clearAllData = () => {
    try {
      clearWebsiteMatches();
      clearNameMatches();
      toast({
        title: "Success",
        description: "All matches have been cleared",
      });
    } catch (error) {
      console.error('Error clearing data:', error);
      toast({
        title: "Error",
        description: "Failed to clear matches",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={clearAllData}
      className="gap-2"
    >
      <Trash2 className="h-4 w-4" />
      Clear All
    </Button>
  );
}
