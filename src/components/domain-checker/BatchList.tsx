import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { BatchSummary } from "../../types/batch";
import { format } from "date-fns";

interface BatchListProps {
  batches: BatchSummary[];
  currentBatchId: string | null;
  onSelectBatch: (id: string) => void;
  onDeleteBatch: (id: string) => void;
  onRenameBatch: (id: string, newName: string) => void;
}

export function BatchList({ 
  batches, 
  currentBatchId, 
  onSelectBatch, 
  onDeleteBatch, 
  onRenameBatch 
}: BatchListProps) {
  const [editingBatch, setEditingBatch] = useState<{ id: string; name: string } | null>(null);

  const handleRename = () => {
    if (editingBatch) {
      onRenameBatch(editingBatch.id, editingBatch.name);
      setEditingBatch(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Saved Batches</h2>
      <div className="grid gap-4">
        {batches.map(batch => (
          <Card 
            key={batch.id}
            className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
              batch.id === currentBatchId ? 'border-primary' : ''
            }`}
            onClick={() => onSelectBatch(batch.id)}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">{batch.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(batch.createdAt), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBatch({ id: batch.id, name: batch.name });
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rename Batch</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Input
                        value={editingBatch?.name || ''}
                        onChange={(e) => setEditingBatch(prev => 
                          prev ? { ...prev, name: e.target.value } : null
                        )}
                        placeholder="Enter new name"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditingBatch(null)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleRename}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBatch(batch.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Total Domains</div>
                <div className="font-medium">{batch.totalDomains}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Website Matches</div>
                <div className="font-medium text-green-600">{batch.websiteMatches}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Name Matches</div>
                <div className="font-medium text-yellow-600">{batch.nameMatches}</div>
              </div>
            </div>
          </Card>
        ))}
        {batches.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No saved batches yet
          </div>
        )}
      </div>
    </div>
  );
}
