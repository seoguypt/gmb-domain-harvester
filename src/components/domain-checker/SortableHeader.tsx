import { TableHead } from "../ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentKey: string;
  direction: 'asc' | 'desc';
  onSort: (key: string) => void;
}

export function SortableHeader({ 
  label, 
  sortKey, 
  currentKey, 
  direction, 
  onSort 
}: SortableHeaderProps) {
  const isActive = currentKey === sortKey;

  return (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        <span>{label}</span>
        <div className="w-4">
          {isActive ? (
            direction === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
    </TableHead>
  );
}
