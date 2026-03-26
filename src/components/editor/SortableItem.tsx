/**
 * SortableItem
 * 
 * Universal sortable wrapper for array items within sections.
 * Preserves original component styling while adding DnD functionality.
 * 
 * Key features:
 * - NO fixed dimensions - takes size of child content
 * - Drag handle on hover (not always visible)
 * - Uses setActivatorNodeRef for handle-only dragging
 * - Preserves all original styling
 * - Visual drop indicator when dragging over
 */

import React from 'react';
import { useSortable, defaultAnimateLayoutChanges, type AnimateLayoutChanges } from '@dnd-kit/sortable';
import { useDndContext } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom animateLayoutChanges - animate other items during sort, not the dragged item
const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;
  
  // Skip animation for the dragged item itself (it uses DragOverlay)
  if (wasDragging) {
    return false;
  }
  
  // Always animate other items during sort
  return defaultAnimateLayoutChanges(args);
};

interface SortableItemProps {
  id: string;
  sectionId: string;
  arrayPath: string;
  index: number;
  isEditing: boolean;
  children: React.ReactNode;
  className?: string;
  handlePosition?: 'left' | 'top-left' | 'top-right';
}

export function SortableItem({ 
  id, 
  sectionId, 
  arrayPath, 
  index, 
  isEditing, 
  children, 
  className,
  handlePosition = 'top-left',
}: SortableItemProps) {
  // Check if we're inside a DndContext - if not, just render children directly
  // This makes the component safe to use in live preview mode
  const dndContext = useDndContext();
  const hasDndContext = dndContext && 'active' in dndContext;
  
  // If no DndContext or not editing, render children without sortable functionality
  if (!hasDndContext || !isEditing) {
    return <>{children}</>;
  }

  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    setActivatorNodeRef,
    transform, 
    transition, 
    isDragging,
    isOver,
    active,
  } = useSortable({
    id,
    data: {
      type: 'item',
      sectionId,
      arrayPath,
      index,
    },
    disabled: !isEditing,
    animateLayoutChanges,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
    willChange: isDragging ? 'transform' : undefined,
  };

  const handleClasses = {
    'left': '-left-4 top-1/2 -translate-y-1/2',
    'top-left': 'left-1 top-1',
    'top-right': 'right-1 top-1',
  };

  // Determine if we should show drop indicator
  // Only show when something is being dragged over this item and it's not self
  const showDropIndicator = isOver && active?.id !== id;
  
  // Determine indicator position based on handle position
  const isVerticalLayout = handlePosition === 'left';

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn("relative group/sortable overflow-visible", className)} 
      {...attributes}
    >
      {/* Drop indicator - appears when dragging over */}
      {showDropIndicator && (
        <div 
          className={cn(
            "absolute z-40 pointer-events-none",
            isVerticalLayout
              ? "left-0 right-0 -top-1 h-0.5 bg-primary rounded-full shadow-[0_0_8px_2px_hsl(var(--primary)/0.5)]"
              : "top-0 bottom-0 -left-1 w-0.5 bg-primary rounded-full shadow-[0_0_8px_2px_hsl(var(--primary)/0.5)]"
          )}
        />
      )}
      
      {/* Drag handle - appears on hover */}
      {isEditing && (
        <div 
          ref={setActivatorNodeRef}
          {...listeners}
          className={cn(
            "absolute z-30 opacity-0 group-hover/sortable:opacity-100 transition-opacity",
            "p-1.5 bg-primary/90 rounded cursor-grab active:cursor-grabbing shadow-md",
            handleClasses[handlePosition]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
      )}
      
      {/* Selection ring when dragging */}
      {isDragging && (
        <div className="absolute inset-0 ring-2 ring-primary rounded-lg pointer-events-none z-20" />
      )}
      
      {children}
    </div>
  );
}

export default SortableItem;
