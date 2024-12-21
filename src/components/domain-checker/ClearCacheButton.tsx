import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClearCacheButtonProps {
  onClearComplete: () => void;
}

export function ClearCacheButton({ onClearComplete }: ClearCacheButtonProps) {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const clearCache = async () => {
    setIsClearing(true);
    try {
      const { error } = await supabase
        .from('domain_checks')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      onClearComplete();
      toast({
        title: "Cache Cleared",
        description: "All cached domain checks have been cleared",
      });
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast({
        title: "Error",
        description: "Failed to clear cache",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            onClick={clearCache}
            disabled={isClearing}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isClearing ? "Clearing..." : "Clear Cache"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Warning: This will delete all previously checked domains</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}