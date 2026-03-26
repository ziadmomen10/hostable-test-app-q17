/**
 * SortableWidget Component
 * 
 * A widget that can be dragged to reorder within a column or moved between columns.
 * Uses useSortable with explicit drag handle for controlled drag initiation.
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GridWidget as GridWidgetType, DRAG_TYPES } from '@/types/grid';
import { getWidgetComponent } from '@/lib/widgetRegistry.tsx';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface SortableWidgetProps {
  /** Widget data */
  widget: GridWidgetType;
  /** Parent section ID */
  sectionId: string;
  /** Parent column ID */
  columnId: string;
  /** Index within the column */
  index: number;
  /** Whether the editor is in edit mode */
  isEditing: boolean;
}

// ============================================================================
// Component
// ============================================================================

export const SortableWidget: React.FC<SortableWidgetProps> = ({
  widget,
  sectionId,
  columnId,
  index,
  isEditing,
}) => {
  // Set up sortable for drag-and-drop
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: widget.id,
    data: {
      type: DRAG_TYPES.WIDGET,
      sectionId,
      columnId,
      widgetId: widget.id,
      index,
    },
    disabled: !isEditing,
  });

  // Transform style for drag animation
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get the widget component from registry
  const WidgetComponent = getWidgetComponent(widget.type);

  // Non-editing mode: render widget directly
  if (!isEditing) {
    return (
      <div
        data-widget-id={widget.id}
        data-widget-type={widget.type}
        className="grid-widget"
      >
        <WidgetComponent
          widget={widget}
          sectionId={sectionId}
          columnId={columnId}
          index={index}
          isEditing={false}
        />
      </div>
    );
  }

  // Editing mode: render with drag handles
  return (
    <div
      ref={setNodeRef}
      style={style}
      data-widget-id={widget.id}
      data-widget-type={widget.type}
      data-section-id={sectionId}
      data-column-id={columnId}
      className={cn(
        'grid-widget relative group',
        isDragging && 'opacity-50 z-50',
        isOver && 'ring-2 ring-primary/50',
      )}
      {...attributes}
    >
      {/* Visible drag handle on left edge */}
      <div 
        ref={setActivatorNodeRef}
        {...listeners}
        className={cn(
          'absolute left-0 top-0 bottom-0 w-6',
          'flex items-center justify-center',
          'bg-muted/70 opacity-0 group-hover:opacity-100',
          'cursor-grab active:cursor-grabbing transition-opacity',
          'rounded-l-md border-r border-border/50',
          'z-10'
        )}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Widget content with left padding for handle */}
      <div className="pl-0 group-hover:pl-6 transition-all">
        <WidgetComponent
          widget={widget}
          sectionId={sectionId}
          columnId={columnId}
          index={index}
          isEditing={true}
        />
      </div>

      {/* Drop indicator overlay */}
      {isOver && (
        <div className="absolute inset-x-0 -top-0.5 h-1 bg-primary rounded-full" />
      )}
    </div>
  );
};

SortableWidget.displayName = 'SortableWidget';
