/**
 * GridWidget Component
 * 
 * The atomic content unit inside a column.
 * Widgets are layout-agnostic and NEVER control layout.
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GridWidget as GridWidgetType } from '@/types/grid';
import { getWidgetComponent } from '@/lib/widgetRegistry';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface GridWidgetComponentProps {
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
  /** Optional class name */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export const GridWidget: React.FC<GridWidgetComponentProps> = ({
  widget,
  sectionId,
  columnId,
  index,
  isEditing,
  className,
}) => {
  // Set up sortable for drag-and-drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: widget.id,
    data: {
      type: 'widget',
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
    opacity: isDragging ? 0.5 : 1,
  };

  // Get the widget component from registry
  const WidgetComponent = getWidgetComponent(widget.type);

  // Non-editing mode: render widget directly
  if (!isEditing) {
    return (
      <div
        data-widget-id={widget.id}
        data-widget-type={widget.type}
        className={cn('grid-widget', className)}
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
        'grid-widget relative',
        'touch-none',
        isDragging && 'z-50',
        className
      )}
      {...attributes}
      {...listeners}
    >
      {/* Widget content */}
      <WidgetComponent
        widget={widget}
        sectionId={sectionId}
        columnId={columnId}
        index={index}
        isEditing={true}
      />

      {/* Drag handle indicator (visible on hover) */}
      {isEditing && (
        <div 
          className={cn(
            'absolute -left-2 top-1/2 -translate-y-1/2',
            'w-1 h-8 bg-primary/30 rounded-full',
            'opacity-0 hover:opacity-100 transition-opacity',
            'cursor-grab active:cursor-grabbing'
          )}
        />
      )}
    </div>
  );
};

GridWidget.displayName = 'GridWidget';
