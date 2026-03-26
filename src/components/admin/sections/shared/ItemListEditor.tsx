/**
 * Enhanced Reorderable List Component for Section Settings
 * 
 * Features:
 * - Add, remove, update, duplicate items
 * - Reorder via buttons and drag & drop
 * - Collapsible items with icon preview
 * - Delete confirmation dialog
 * - Min/max validation with UI feedback
 * - Bulk actions (expand all, collapse all)
 * - Keyboard shortcuts
 * - Empty state with custom icon
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  GripVertical, 
  ChevronDown, 
  ChevronRight, 
  Trash2, 
  Plus,
  ArrowUp,
  ArrowDown,
  Copy,
  MoreHorizontal,
  ChevronsUpDown,
  ChevronsDownUp,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface ItemListEditorProps<T> {
  /** Array of items to manage */
  items: T[];
  /** Callback when items change */
  onItemsChange: (items: T[]) => void;
  /** Render function for item content */
  renderItem: (item: T, index: number, onUpdate: (updates: Partial<T>) => void) => React.ReactNode;
  /** Get display title for item */
  getItemTitle?: (item: T, index: number) => string;
  /** Factory function to create new item */
  createNewItem: () => T;
  /** Label for add button */
  addItemLabel?: string;
  /** Message when list is empty */
  emptyMessage?: string;
  /** Maximum number of items */
  maxItems?: number;
  /** Minimum number of items */
  minItems?: number;
  /** Enable collapsible items */
  collapsible?: boolean;
  /** Container class name */
  className?: string;
  
  // NEW Enhanced features
  /** Show duplicate button (default: true) */
  showDuplicateButton?: boolean;
  /** Custom duplicate logic */
  onDuplicate?: (item: T) => T;
  /** Show delete confirmation dialog */
  confirmDelete?: boolean;
  /** Custom delete confirmation message */
  confirmDeleteMessage?: string;
  /** Get icon to show in header */
  getItemIcon?: (item: T, index: number) => React.ReactNode;
  /** Get subtitle to show in header */
  getItemSubtitle?: (item: T, index: number) => string;
  /** Show item index badge */
  showItemIndex?: boolean;
  /** Icon for empty state */
  emptyStateIcon?: React.ReactNode;
  /** Show bulk actions dropdown */
  showBulkActions?: boolean;
  /** Field to auto-renumber on reorder */
  autoNumberField?: keyof T;
  /** Starting number for auto-numbering */
  autoNumberStart?: number;
}

/**
 * Deep clone an object for duplication
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Apply auto-numbering to items if configured
 */
function applyAutoNumbering<T>(
  items: T[],
  field?: keyof T,
  startNumber = 1
): T[] {
  if (!field) return items;
  
  return items.map((item, index) => ({
    ...item,
    [field]: startNumber + index,
  }));
}

export function ItemListEditor<T>({
  items,
  onItemsChange,
  renderItem,
  getItemTitle,
  createNewItem,
  addItemLabel = 'Add Item',
  emptyMessage = 'No items yet. Click the button below to add one.',
  maxItems,
  minItems = 0,
  collapsible = true,
  className,
  // Enhanced features
  showDuplicateButton = true,
  onDuplicate,
  confirmDelete = false,
  confirmDeleteMessage = 'Are you sure you want to delete this item? This action cannot be undone.',
  getItemIcon,
  getItemSubtitle,
  showItemIndex = false,
  emptyStateIcon,
  showBulkActions = true,
  autoNumberField,
  autoNumberStart = 1,
}: ItemListEditorProps<T>) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

  // Helper to apply changes with auto-numbering
  const applyChanges = useCallback((newItems: T[]) => {
    const processed = applyAutoNumbering(newItems, autoNumberField, autoNumberStart);
    onItemsChange(processed);
  }, [onItemsChange, autoNumberField, autoNumberStart]);

  const toggleExpanded = useCallback((index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handleAdd = useCallback(() => {
    if (maxItems && items.length >= maxItems) return;
    const newItem = createNewItem();
    const newItems = [...items, newItem];
    applyChanges(newItems);
    setExpandedItems((prev) => new Set(prev).add(newItems.length - 1));
  }, [items, createNewItem, applyChanges, maxItems]);

  const handleRemove = useCallback((index: number) => {
    if (items.length <= minItems) return;
    
    // If confirmation is enabled, show dialog
    if (confirmDelete) {
      setDeleteConfirmIndex(index);
      return;
    }
    
    executeRemove(index);
  }, [items.length, minItems, confirmDelete]);

  const executeRemove = useCallback((index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    applyChanges(newItems);
    // Update expanded items indices
    setExpandedItems((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
    setDeleteConfirmIndex(null);
  }, [items, applyChanges]);

  const handleUpdate = useCallback((index: number, updates: Partial<T>) => {
    const newItems = items.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    );
    applyChanges(newItems);
  }, [items, applyChanges]);

  const handleDuplicate = useCallback((index: number) => {
    if (maxItems && items.length >= maxItems) return;
    
    const originalItem = items[index];
    const newItem = onDuplicate 
      ? onDuplicate(originalItem) 
      : deepClone(originalItem);
    
    const newItems = [
      ...items.slice(0, index + 1),
      newItem,
      ...items.slice(index + 1),
    ];
    applyChanges(newItems);
    
    // Expand the duplicate and update indices
    setExpandedItems((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i <= index) next.add(i);
        else next.add(i + 1);
      });
      next.add(index + 1);
      return next;
    });
  }, [items, applyChanges, onDuplicate, maxItems]);

  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    applyChanges(newItems);
    // Update expanded state
    setExpandedItems((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i === index) next.add(index - 1);
        else if (i === index - 1) next.add(index);
        else next.add(i);
      });
      return next;
    });
  }, [items, applyChanges]);

  const handleMoveDown = useCallback((index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    applyChanges(newItems);
    // Update expanded state
    setExpandedItems((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i === index) next.add(index + 1);
        else if (i === index + 1) next.add(index);
        else next.add(i);
      });
      return next;
    });
  }, [items, applyChanges]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    
    const newItems = [...items];
    const draggedItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    applyChanges(newItems);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  // Bulk actions
  const expandAll = useCallback(() => {
    setExpandedItems(new Set(items.map((_, i) => i)));
  }, [items]);

  const collapseAll = useCallback(() => {
    setExpandedItems(new Set());
  }, []);

  const canAdd = !maxItems || items.length < maxItems;
  const canRemove = items.length > minItems;
  const remainingSlots = maxItems ? maxItems - items.length : undefined;

  // Empty state
  if (items.length === 0) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex flex-col items-center justify-center py-8 border border-dashed rounded-lg bg-muted/20">
          {emptyStateIcon || <Package className="h-10 w-10 text-muted-foreground/50 mb-2" />}
          <p className="text-sm text-muted-foreground text-center max-w-[200px]">
            {emptyMessage}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {addItemLabel}
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={cn('space-y-2', className)}>
        {/* Header with count and bulk actions */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {items.length} item{items.length !== 1 ? 's' : ''}
            {remainingSlots !== undefined && remainingSlots > 0 && (
              <span className="ml-1">({remainingSlots} more allowed)</span>
            )}
          </span>
          
          {showBulkActions && items.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <MoreHorizontal className="h-3 w-3 mr-1" />
                  <span className="text-xs">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={expandAll}>
                  <ChevronsUpDown className="h-3 w-3 mr-2" />
                  Expand All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={collapseAll}>
                  <ChevronsDownUp className="h-3 w-3 mr-2" />
                  Collapse All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Item list */}
        {items.map((item, index) => {
          const isExpanded = expandedItems.has(index);
          const title = getItemTitle ? getItemTitle(item, index) : `Item ${index + 1}`;
          const icon = getItemIcon ? getItemIcon(item, index) : null;
          const subtitle = getItemSubtitle ? getItemSubtitle(item, index) : null;

          const itemContent = (
            <Card
              key={index}
              className={cn(
                'transition-all',
                dragIndex === index && 'opacity-50 ring-2 ring-primary'
              )}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center gap-2 p-3">
                {/* Drag handle */}
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                  <GripVertical className="h-4 w-4" />
                </div>

                {/* Expand/collapse trigger */}
                {collapsible ? (
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 flex-1 text-left min-w-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      
                      {/* Item index badge */}
                      {showItemIndex && (
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted text-xs font-medium shrink-0">
                          {index + 1}
                        </span>
                      )}
                      
                      {/* Item icon */}
                      {icon && (
                        <span className="shrink-0">{icon}</span>
                      )}
                      
                      {/* Title and subtitle */}
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium truncate block">{title}</span>
                        {subtitle && (
                          <span className="text-xs text-muted-foreground truncate block">{subtitle}</span>
                        )}
                      </div>
                    </button>
                  </CollapsibleTrigger>
                ) : (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {showItemIndex && (
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted text-xs font-medium shrink-0">
                        {index + 1}
                      </span>
                    )}
                    {icon && <span className="shrink-0">{icon}</span>}
                    <span className="flex-1 text-sm font-medium truncate">{title}</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-0.5 shrink-0">
                  {/* Reorder buttons */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Move up</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === items.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Move down</TooltipContent>
                  </Tooltip>

                  {/* Duplicate button */}
                  {showDuplicateButton && canAdd && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDuplicate(index)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Duplicate</TooltipContent>
                    </Tooltip>
                  )}

                  {/* Delete button */}
                  {canRemove && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleRemove(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

              {/* Item content */}
              {collapsible ? (
                <CollapsibleContent>
                  <div className="px-3 pb-3 pt-0 border-t">
                    <div className="pt-3">
                      {renderItem(item, index, (updates) => handleUpdate(index, updates))}
                    </div>
                  </div>
                </CollapsibleContent>
              ) : (
                <div className="px-3 pb-3 pt-0 border-t">
                  <div className="pt-3">
                    {renderItem(item, index, (updates) => handleUpdate(index, updates))}
                  </div>
                </div>
              )}
            </Card>
          );

          return collapsible ? (
            <Collapsible key={index} open={isExpanded} onOpenChange={() => toggleExpanded(index)}>
              {itemContent}
            </Collapsible>
          ) : (
            itemContent
          );
        })}

        {/* Add button */}
        {canAdd && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {addItemLabel}
          </Button>
        )}

        {/* Max items reached message */}
        {!canAdd && maxItems && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Maximum of {maxItems} items reached
          </p>
        )}

        {/* Delete confirmation dialog */}
        <AlertDialog open={deleteConfirmIndex !== null} onOpenChange={() => setDeleteConfirmIndex(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Item</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDeleteMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirmIndex !== null && executeRemove(deleteConfirmIndex)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
