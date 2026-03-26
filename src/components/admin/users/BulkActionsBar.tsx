import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, X, Loader2 } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => Promise<void>;
}

const BulkActionsBar: React.FC<Props> = ({ selectedCount, onClearSelection, onBulkDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await onBulkDelete();
    setDeleting(false);
    setConfirmOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 mb-4 animate-in slide-in-from-top-2">
        <span className="text-sm font-medium">{selectedCount} selected</span>
        <Button variant="destructive" size="sm" onClick={() => setConfirmOpen(true)} className="rounded-lg">
          <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete Selected
        </Button>
        <Button variant="ghost" size="sm" onClick={onClearSelection} className="ml-auto rounded-lg">
          <X className="h-3.5 w-3.5 mr-1.5" /> Clear
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} Users</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedCount} user{selectedCount > 1 ? 's' : ''} and all their data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : `Delete ${selectedCount} Users`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BulkActionsBar;
