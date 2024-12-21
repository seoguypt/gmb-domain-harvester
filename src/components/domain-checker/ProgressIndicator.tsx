import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  isLoading: boolean;
  progress: number;
}

export function ProgressIndicator({ isLoading, progress }: ProgressIndicatorProps) {
  if (!isLoading) return null;

  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-center text-muted-foreground">
        Checking domains... {Math.round(progress)}%
      </p>
    </div>
  );
}