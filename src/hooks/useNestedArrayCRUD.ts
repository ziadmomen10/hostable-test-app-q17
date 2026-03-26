/**
 * Nested Array CRUD Hook
 * 
 * Manages arrays within arrays (e.g., Pricing Plans → Features).
 * Provides CRUD operations for child arrays while maintaining parent context.
 */

import { useCallback, useMemo } from 'react';

export interface UseNestedArrayCRUDOptions<TParent, TChild> {
  /** Array of parent items */
  parents: TParent[];
  /** Callback when parents change */
  onParentsChange: (parents: TParent[]) => void;
  /** Extract children array from parent */
  getChildren: (parent: TParent) => TChild[];
  /** Return new parent with updated children */
  setChildren: (parent: TParent, children: TChild[]) => TParent;
  /** Factory function to create a new child */
  createNewChild: () => TChild;
  /** Currently selected parent index */
  parentIndex: number;
  /** Minimum children per parent */
  minChildren?: number;
  /** Maximum children per parent */
  maxChildren?: number;
  /** Custom duplicate logic for children */
  duplicateChild?: (child: TChild) => TChild;
}

export interface UseNestedArrayCRUDReturn<TChild> {
  /** Current children for selected parent */
  children: TChild[];
  /** Add a new child to selected parent */
  addChild: () => boolean;
  /** Remove child at index from selected parent */
  removeChild: (index: number) => boolean;
  /** Update child at index */
  updateChild: (index: number, updates: Partial<TChild>) => void;
  /** Duplicate child at index */
  duplicateChild: (index: number) => boolean;
  /** Move child to new position */
  moveChild: (fromIndex: number, toIndex: number) => void;
  /** Move child up */
  moveChildUp: (index: number) => void;
  /** Move child down */
  moveChildDown: (index: number) => void;
  /** Whether a new child can be added */
  canAddChild: boolean;
  /** Whether any child can be removed */
  canRemoveChild: boolean;
  /** Check if child can move up */
  canMoveChildUp: (index: number) => boolean;
  /** Check if child can move down */
  canMoveChildDown: (index: number) => boolean;
  /** Number of children */
  childCount: number;
  /** Whether children array is empty */
  hasChildren: boolean;
}

/**
 * Deep clone an object for duplication
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function useNestedArrayCRUD<TParent, TChild>({
  parents,
  onParentsChange,
  getChildren,
  setChildren,
  createNewChild,
  parentIndex,
  minChildren = 0,
  maxChildren,
  duplicateChild: customDuplicateChild,
}: UseNestedArrayCRUDOptions<TParent, TChild>): UseNestedArrayCRUDReturn<TChild> {
  // Get current parent and its children
  const currentParent = parents[parentIndex];
  const children = useMemo(() => 
    currentParent ? getChildren(currentParent) : [],
    [currentParent, getChildren]
  );
  
  // Validation
  const canAddChild = useMemo(() => 
    !maxChildren || children.length < maxChildren,
    [children.length, maxChildren]
  );
  const canRemoveChild = useMemo(() => 
    children.length > minChildren,
    [children.length, minChildren]
  );
  
  // Helper to update children for current parent
  const updateParentChildren = useCallback((newChildren: TChild[]) => {
    if (!currentParent) return;
    
    const newParents = parents.map((parent, i) =>
      i === parentIndex ? setChildren(parent, newChildren) : parent
    );
    onParentsChange(newParents);
  }, [parents, parentIndex, currentParent, setChildren, onParentsChange]);
  
  // Add child
  const addChild = useCallback((): boolean => {
    if (!canAddChild) return false;
    
    const newChild = createNewChild();
    updateParentChildren([...children, newChild]);
    return true;
  }, [canAddChild, createNewChild, children, updateParentChildren]);
  
  // Remove child
  const removeChild = useCallback((index: number): boolean => {
    if (!canRemoveChild || index < 0 || index >= children.length) return false;
    
    updateParentChildren(children.filter((_, i) => i !== index));
    return true;
  }, [canRemoveChild, children, updateParentChildren]);
  
  // Update child
  const updateChild = useCallback((index: number, updates: Partial<TChild>) => {
    if (index < 0 || index >= children.length) return;
    
    const newChildren = children.map((child, i) =>
      i === index ? { ...child, ...updates } : child
    );
    updateParentChildren(newChildren);
  }, [children, updateParentChildren]);
  
  // Duplicate child
  const duplicateChild = useCallback((index: number): boolean => {
    if (!canAddChild || index < 0 || index >= children.length) return false;
    
    const originalChild = children[index];
    const newChild = customDuplicateChild 
      ? customDuplicateChild(originalChild) 
      : deepClone(originalChild);
    
    const newChildren = [
      ...children.slice(0, index + 1),
      newChild,
      ...children.slice(index + 1),
    ];
    updateParentChildren(newChildren);
    return true;
  }, [canAddChild, children, customDuplicateChild, updateParentChildren]);
  
  // Move child to new position
  const moveChild = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= children.length) return;
    if (toIndex < 0 || toIndex >= children.length) return;
    
    const newChildren = [...children];
    const [movedChild] = newChildren.splice(fromIndex, 1);
    newChildren.splice(toIndex, 0, movedChild);
    updateParentChildren(newChildren);
  }, [children, updateParentChildren]);
  
  // Move child up
  const moveChildUp = useCallback((index: number) => {
    if (index <= 0) return;
    moveChild(index, index - 1);
  }, [moveChild]);
  
  // Move child down
  const moveChildDown = useCallback((index: number) => {
    if (index >= children.length - 1) return;
    moveChild(index, index + 1);
  }, [children.length, moveChild]);
  
  // Validation helpers
  const canMoveChildUp = useCallback((index: number) => index > 0, []);
  const canMoveChildDown = useCallback((index: number) => 
    index < children.length - 1, 
    [children.length]
  );
  
  return {
    children,
    addChild,
    removeChild,
    updateChild,
    duplicateChild,
    moveChild,
    moveChildUp,
    moveChildDown,
    canAddChild,
    canRemoveChild,
    canMoveChildUp,
    canMoveChildDown,
    childCount: children.length,
    hasChildren: children.length > 0,
  };
}

export default useNestedArrayCRUD;
