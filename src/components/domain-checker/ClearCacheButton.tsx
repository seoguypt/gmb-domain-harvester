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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface ClearCacheButtonProps {
  onClearComplete: () => void;
}

export function ClearCacheButton({ onClearComplete }: ClearCacheButtonProps) {
  const [isClearing, setIsClearing] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const clearCache = async () => {
    if (confirmText !== "DELETE") {
      toast({
        title: "Invalid Confirmation",
        description: "Please type DELETE to confirm",
        variant: "destructive",
      });
      return;
    }

    setIsClearing(true);
    try {
      const { error } = await supabase
        .from('domain_checks')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      onClearComplete();
      setIsOpen(false);
      setConfirmText("");
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
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                disabled={isClearing}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {isClearing ? "Clearing..." : "Clear Cache"}
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <p>This action cannot be undone. This will permanently delete all cached domain checks.</p>
                <p>Please type <span className="font-mono font-bold">DELETE</span> to confirm:</p>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="font-mono"
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setConfirmText("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={clearCache}
                disabled={confirmText !== "DELETE"}
              >
                Delete Cache
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
          <TooltipContent>
            <p>Warning: This will delete all previously checked domains</p>
          </TooltipContent>
        </AlertDialog>
      </Tooltip>
    </TooltipProvider>
  );
}