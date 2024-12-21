import { Grid, Table as TableIcon } from "lucide-react";
import { Button } from "../ui/button";

interface ViewToggleProps {
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setViewMode('table')}
        className={viewMode === 'table' ? 'bg-accent' : ''}
      >
        <TableIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setViewMode('grid')}
        className={viewMode === 'grid' ? 'bg-accent' : ''}
      >
        <Grid className="h-4 w-4" />
      </Button>
    </div>
  );
}