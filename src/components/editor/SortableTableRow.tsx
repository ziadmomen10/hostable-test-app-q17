/**
 * SortableTableRow
 * 
 * A table-row-compatible sortable component that renders as <tr> instead of <div>.
 * Fixes the broken table layout issue when using regular SortableItem with tables.
 */

import React from 'react';
import { useSortable, AnimateLayoutChanges, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  if (args.wasDragging) return false;
  return defaultAnimateLayoutChanges(args);
};

interface SortableTableRowProps {
  id: string;
  sectionId: string;
  arrayPath: string;
  index: number;
  isEditing: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SortableTableRow({
  id,
  sectionId,
  arrayPath,
  index,
  isEditing,
  children,
  className,
}: SortableTableRowProps) {
  const { 
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { type: 'item', sectionId, arrayPath, index },
    disabled: !isEditing,
    animateLayoutChanges,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn('relative group/sortable', className)}
      {...attributes}
    >
      {isEditing && (
        <td className="w-8 p-0 relative">
          <div 
            ref={setActivatorNodeRef}
            {...listeners}
            className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/sortable:opacity-100 p-1 bg-primary/90 rounded cursor-grab z-30"
          >
            <GripVertical className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
        </td>
      )}
      {children}
    </tr>
  );
}

export default SortableTableRow;
