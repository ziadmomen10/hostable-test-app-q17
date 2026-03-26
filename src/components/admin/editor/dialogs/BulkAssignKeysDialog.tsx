/**
 * BulkAssignKeysDialog Component
 * 
 * Dialog for bulk assigning translation keys to unassigned text elements.
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Key, Check, CheckSquare, Square, Loader2 } from 'lucide-react';

export interface UnassignedElement {
  component: any;
  tagName: string;
  section: string;
  content: string;
  suggestedKey: string;
  selected: boolean;
}

export interface BulkAssignKeysDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  namespace: string;
  elements: UnassignedElement[];
  createEnglishTranslations: boolean;
  isAssigning: boolean;
  onToggleElement: (index: number) => void;
  onSelectAll: (selectAll: boolean) => void;
  onUpdateKey: (index: number, newKey: string) => void;
  onCreateEnglishChange: (checked: boolean) => void;
  onAssign: () => void;
}

export const BulkAssignKeysDialog: React.FC<BulkAssignKeysDialogProps> = ({
  isOpen,
  onOpenChange,
  namespace,
  elements,
  createEnglishTranslations,
  isAssigning,
  onToggleElement,
  onSelectAll,
  onUpdateKey,
  onCreateEnglishChange,
  onAssign,
}) => {
  const selectedCount = elements.filter(el => el.selected).length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Bulk Assign Translation Keys
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-sm text-muted-foreground mb-4">
          Found <span className="font-semibold text-foreground">{elements.length}</span> text elements without translation keys
          <span className="mx-2">•</span>
          Namespace: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{namespace}</code>
        </div>
        
        {elements.length > 0 && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSelectAll(true)}
              >
                <CheckSquare className="h-3.5 w-3.5 mr-1" />
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSelectAll(false)}
              >
                <Square className="h-3.5 w-3.5 mr-1" />
                Deselect All
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedCount} selected
            </div>
          </div>
        )}
        
        <ScrollArea className="flex-1 border rounded-lg">
          {elements.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Check className="h-12 w-12 mx-auto mb-3 text-primary/50" />
              <p className="font-medium">All elements have translation keys!</p>
              <p className="text-sm mt-1">No unassigned text elements found.</p>
            </div>
          ) : (
            <div className="divide-y">
              {elements.map((element, index) => (
                <div 
                  key={index} 
                  className={`p-3 hover:bg-muted/50 transition-colors ${element.selected ? '' : 'opacity-50'}`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={element.selected}
                      onCheckedChange={() => onToggleElement(index)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs font-mono">
                          &lt;{element.tagName}&gt;
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {element.section}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground truncate mb-2" title={element.content}>
                        "{element.content}"
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Key:</span>
                        <Input
                          value={element.suggestedKey}
                          onChange={(e) => onUpdateKey(index, e.target.value)}
                          className="h-7 text-xs font-mono flex-1"
                          disabled={!element.selected}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="createEnglish"
              checked={createEnglishTranslations}
              onCheckedChange={(checked) => onCreateEnglishChange(checked === true)}
            />
            <Label htmlFor="createEnglish" className="text-sm cursor-pointer">
              Create English translations with current content
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={onAssign}
              disabled={isAssigning || selectedCount === 0}
            >
              {isAssigning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-1" />
                  Assign {selectedCount} Keys
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAssignKeysDialog;
