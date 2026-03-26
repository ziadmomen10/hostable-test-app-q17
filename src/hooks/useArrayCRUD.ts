/**
 * Universal Array CRUD Hook
 * 
 * Provides complete CRUD operations for arrays in section settings:
 * - Add, remove, update, duplicate items
 * - Move up/down, drag reorder
 * - Min/max validation with UI feedback
 * - Auto-renumbering for ordered items
 * - Expanded state management
 */

import { useCallback, useMemo, useState } from 'react';
import { deepClone } from '@/lib/utils/objectHelpers';

export interface UseArrayCRUDOptions<T> {
  /** The array of items to manage */
  items: T[];
  /** Callback when items change */
  onChange: (items: T[]) => void;
  /** Factory function to create a new item */
  createNewItem: () => T;
  /** Optional function to get unique ID for each item */
  getItemId?: (item: T, index: number) => string;
  /** Minimum number of items allowed */
  minItems?: number;
  /** Maximum number of items allowed */
  maxItems?: number;
  /** Field to auto-renumber on reorder (e.g., 'stepNumber') */
  autoNumberField?: keyof T;
  /** Starting number for auto-numbering (default: 1) */
  autoNumberStart?: number;
  /** Callback after item is added */
  onItemAdded?: (item: T, index: number) => void;
  /** Callback after item is removed */
  onItemRemoved?: (item: T, index: number) => void;
  /** Callback after item is duplicated */
  onItemDuplicated?: (originalItem: T, newItem: T, index: number) => void;
  /** Custom duplicate logic */
  duplicateItem?: (item: T) => T;
}

export interface UseArrayCRUDReturn<T> {
  // Core CRUD operations
  /** Add a new item to the end of the array */
  add: () => boolean;
  /** Remove item at index */
  remove: (index: number) => boolean;
  /** Update item at index with partial updates */
  update: (index: number, updates: Partial<T>) => void;
  /** Duplicate item at index */
  duplicate: (index: number) => boolean;
  /** Replace entire item at index */
  replace: (index: number, item: T) => void;
  
  // Reordering operations
  /** Move item up (decrease index) */
  moveUp: (index: number) => void;
  /** Move item down (increase index) */
  moveDown: (index: number) => void;
  /** Move item from one index to another */
  move: (fromIndex: number, toIndex: number) => void;
  
  // Validation state
  /** Whether a new item can be added */
  canAdd: boolean;
  /** Whether any item can be removed */
  canRemove: boolean;
  /** Check if item at index can move up */
  canMoveUp: (index: number) => boolean;
  /** Check if item at index can move down */
  canMoveDown: (index: number) => boolean;
  
  // Expansion state management
  /** Set of expanded item indices */
  expandedItems: Set<number>;
  /** Toggle expansion state of an item */
  toggleExpanded: (index: number) => void;
  /** Expand specific item */
  expand: (index: number) => void;
  /** Collapse specific item */
  collapse: (index: number) => void;
  /** Expand all items */
  expandAll: () => void;
  /** Collapse all items */
  collapseAll: () => void;
  
  // Utilities
  /** Number of items in the array */
  itemCount: number;
  /** Whether the array is empty */
  isEmpty: boolean;
  /** Get item by index */
  getItem: (index: number) => T | undefined;
  /** Remaining slots before max is reached */
  remainingSlots: number | undefined;
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

export function useArrayCRUD<T>({
  items,
  onChange,
  createNewItem,
  getItemId,
  minItems = 0,
  maxItems,
  autoNumberField,
  autoNumberStart = 1,
  onItemAdded,
  onItemRemoved,
  onItemDuplicated,
  duplicateItem,
}: UseArrayCRUDOptions<T>): UseArrayCRUDReturn<T> {
  // Expansion state
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));
  
  // Validation states
  const canAdd = useMemo(() => !maxItems || items.length < maxItems, [items.length, maxItems]);
  const canRemove = useMemo(() => items.length > minItems, [items.length, minItems]);
  const itemCount = items.length;
  const isEmpty = items.length === 0;
  const remainingSlots = maxItems ? maxItems - items.length : undefined;
  
  // Apply changes with optional auto-numbering
  const applyChanges = useCallback((newItems: T[]) => {
    const processed = applyAutoNumbering(newItems, autoNumberField, autoNumberStart);
    onChange(processed);
  }, [onChange, autoNumberField, autoNumberStart]);
  
  // Add new item
  const add = useCallback((): boolean => {
    if (!canAdd) return false;
    
    const newItem = createNewItem();
    const newItems = [...items, newItem];
    applyChanges(newItems);
    
    // Expand the new item
    setExpandedItems(prev => new Set(prev).add(items.length));
    
    onItemAdded?.(newItem, items.length);
    return true;
  }, [canAdd, createNewItem, items, applyChanges, onItemAdded]);
  
  // Remove item at index
  const remove = useCallback((index: number): boolean => {
    if (!canRemove || index < 0 || index >= items.length) return false;
    
    const removedItem = items[index];
    const newItems = items.filter((_, i) => i !== index);
    applyChanges(newItems);
    
    // Update expanded items indices
    setExpandedItems(prev => {
      const next = new Set<number>();
      prev.forEach(i => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
    
    onItemRemoved?.(removedItem, index);
    return true;
  }, [canRemove, items, applyChanges, onItemRemoved]);
  
  // Update item at index
  const update = useCallback((index: number, updates: Partial<T>) => {
    if (index < 0 || index >= items.length) return;
    
    const newItems = items.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );
    applyChanges(newItems);
  }, [items, applyChanges]);
  
  // Replace entire item at index
  const replace = useCallback((index: number, item: T) => {
    if (index < 0 || index >= items.length) return;
    
    const newItems = items.map((existing, i) => i === index ? item : existing);
    applyChanges(newItems);
  }, [items, applyChanges]);
  
  // Duplicate item at index
  const duplicate = useCallback((index: number): boolean => {
    if (!canAdd || index < 0 || index >= items.length) return false;
    
    const originalItem = items[index];
    const newItem = duplicateItem 
      ? duplicateItem(originalItem) 
      : deepClone(originalItem);
    
    const newItems = [
      ...items.slice(0, index + 1),
      newItem,
      ...items.slice(index + 1),
    ];
    applyChanges(newItems);
    
    // Expand the new item and update indices
    setExpandedItems(prev => {
      const next = new Set<number>();
      prev.forEach(i => {
        if (i <= index) next.add(i);
        else next.add(i + 1);
      });
      next.add(index + 1); // Expand the duplicate
      return next;
    });
    
    onItemDuplicated?.(originalItem, newItem, index + 1);
    return true;
  }, [canAdd, items, applyChanges, duplicateItem, onItemDuplicated]);
  
  // Move item up
  const moveUp = useCallback((index: number) => {
    if (index <= 0 || index >= items.length) return;
    
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    applyChanges(newItems);
    
    // Update expanded state
    setExpandedItems(prev => {
      const next = new Set<number>();
      prev.forEach(i => {
        if (i === index) next.add(index - 1);
        else if (i === index - 1) next.add(index);
        else next.add(i);
      });
      return next;
    });
  }, [items, applyChanges]);
  
  // Move item down
  const moveDown = useCallback((index: number) => {
    if (index < 0 || index >= items.length - 1) return;
    
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    applyChanges(newItems);
    
    // Update expanded state
    setExpandedItems(prev => {
      const next = new Set<number>();
      prev.forEach(i => {
        if (i === index) next.add(index + 1);
        else if (i === index + 1) next.add(index);
        else next.add(i);
      });
      return next;
    });
  }, [items, applyChanges]);
  
  // Move item from one index to another (for drag & drop)
  const move = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= items.length) return;
    if (toIndex < 0 || toIndex >= items.length) return;
    
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    applyChanges(newItems);
    
    // Update expanded state
    setExpandedItems(prev => {
      const next = new Set<number>();
      prev.forEach(i => {
        if (i === fromIndex) {
          next.add(toIndex);
        } else if (fromIndex < toIndex) {
          // Moving down
          if (i > fromIndex && i <= toIndex) next.add(i - 1);
          else next.add(i);
        } else {
          // Moving up
          if (i >= toIndex && i < fromIndex) next.add(i + 1);
          else next.add(i);
        }
      });
      return next;
    });
  }, [items, applyChanges]);
  
  // Expansion state management
  const toggleExpanded = useCallback((index: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);
  
  const expand = useCallback((index: number) => {
    setExpandedItems(prev => new Set(prev).add(index));
  }, []);
  
  const collapse = useCallback((index: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }, []);
  
  const expandAll = useCallback(() => {
    setExpandedItems(new Set(items.map((_, i) => i)));
  }, [items]);
  
  const collapseAll = useCallback(() => {
    setExpandedItems(new Set());
  }, []);
  
  // Validation helpers
  const canMoveUp = useCallback((index: number) => index > 0, []);
  const canMoveDown = useCallback((index: number) => index < items.length - 1, [items.length]);
  
  // Get item by index
  const getItem = useCallback((index: number) => items[index], [items]);
  
  return {
    // Core CRUD
    add,
    remove,
    update,
    duplicate,
    replace,
    
    // Reordering
    moveUp,
    moveDown,
    move,
    
    // Validation
    canAdd,
    canRemove,
    canMoveUp,
    canMoveDown,
    
    // Expansion
    expandedItems,
    toggleExpanded,
    expand,
    collapse,
    expandAll,
    collapseAll,
    
    // Utilities
    itemCount,
    isEmpty,
    getItem,
    remainingSlots,
  };
}

export default useArrayCRUD;
