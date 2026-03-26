/**
 * SortableColumn Component
 * 
 * A column that can be dragged to reorder horizontally within a section.
 * Uses useSortable to enable column reordering.
 * Contains a SortableContext for widget reordering within.
 */

import React, { useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GridColumn as GridColumnType, DRAG_TYPES } from '@/types/grid';
import { SortableWidget } from './SortableWidget';
import { ColumnResizeHandle } from './ColumnResizeHandle';
import { useEditorStore, useSelection } from '@/stores/editorStore';
import { cn } from '@/lib/utils';
import { GripVertical, Plus } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface SortableColumnProps {
  /** Column data */
  column: GridColumnType;
  /** Parent section ID */
  sectionId: string;
  /** Column index within the section */
  columnIndex: number;
  /** Total number of columns in the section */
  totalColumns: number;
  /** ID of the next column (for resize handle) */
  nextColumnId?: string;
  /** Whether the editor is in edit mode */
  isEditing: boolean;
  /** Whether the parent section is selected */
  isSectionSelected?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export const SortableColumn: React.FC<SortableColumnProps> = ({
  column,
  sectionId,
  columnIndex,
  totalColumns,
  nextColumnId,
  isEditing,
  isSectionSelected = false,
}) => {
  const selection = useSelection();
  const selectColumn = useEditorStore(state => state.selectColumn);
  
  // Check if this column is selected
  const isSelected = selection.type === 'column' && 
    selection.sectionId === sectionId && 
    selection.columnId === column.id;

  // Sortable for column reordering
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: column.id,
    data: {
      type: DRAG_TYPES.COLUMN,
      sectionId,
      columnId: column.id,
      index: columnIndex,
    },
    disabled: !isEditing || !isSectionSelected,
  });

  // Style for drag animation
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Widget IDs for sortable context
  const widgetIds = column.widgets.map(w => w.id);

  // Alignment style
  const alignmentStyle = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  }[column.alignment || 'start'];

  // Handle column click to select
  const handleColumnClick = useCallback((e: React.MouseEvent) => {
    if (!isEditing) return;
    
    // Only select if clicking on the column itself, not a widget
    const target = e.target as HTMLElement;
    const isWidget = target.closest('[data-widget-id]');
    if (isWidget) return;
    
    e.stopPropagation();
    selectColumn(sectionId, column.id);
  }, [isEditing, sectionId, column.id, selectColumn]);

  const isLastColumn = columnIndex === totalColumns - 1;

  // Combined style for drag animation + alignment
  const combinedStyle: React.CSSProperties = {
    ...style,
    alignItems: alignmentStyle,
    gap: column.gap || '1rem',
  };

  return (
    <div
      ref={setNodeRef}
      style={combinedStyle}
      data-column-id={column.id}
      data-section-id={sectionId}
      data-column-index={columnIndex}
      onClick={handleColumnClick}
      className={cn(
        'grid-column relative',
        'flex flex-col',
        'transition-all duration-150',
        isEditing && 'min-h-[60px]',
        // Visual states
        isEditing && isSectionSelected && !isSelected && 'border-2 border-dashed border-primary/30',
        isSelected && 'border-2 border-solid border-primary ring-2 ring-primary/20',
        isOver && isEditing && 'ring-2 ring-primary/50 ring-inset bg-primary/5',
        isDragging && 'z-50',
      )}
    >
      {/* Column header with drag handle - shown when section is selected */}
      {isEditing && isSectionSelected && (
        <div className={cn(
          "absolute -top-6 left-0 right-0 flex items-center justify-center gap-2 px-1"
        )}>
          {/* Drag handle - only visible when section selected */}
          <button
            {...listeners}
            {...attributes}
            className={cn(
              "p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing",
              "opacity-60 hover:opacity-100 transition-opacity"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-3 w-3 text-muted-foreground" />
          </button>
          <span className={cn(
            "px-1.5 py-0.5 text-[10px] font-medium rounded",
            isSelected 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            Col {columnIndex + 1}
          </span>
        </div>
      )}

      {/* Widget sortable context */}
      <SortableContext items={widgetIds} strategy={verticalListSortingStrategy}>
        {column.widgets.map((widget, widgetIndex) => (
          <SortableWidget
            key={widget.id}
            widget={widget}
            sectionId={sectionId}
            columnId={column.id}
            index={widgetIndex}
            isEditing={isEditing}
          />
        ))}
      </SortableContext>

      {/* Empty column indicator with add button */}
      {isEditing && column.widgets.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 min-h-[60px] gap-2">
          <Plus className="h-4 w-4 text-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">Drop widgets here</span>
        </div>
      )}
      
      {/* Widget count badge - shown when column has widgets and section is selected */}
      {isEditing && isSectionSelected && column.widgets.length > 0 && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] rounded z-10">
          {column.widgets.length} widget{column.widgets.length !== 1 ? 's' : ''}
        </div>
      )}
      
      {/* Resize handle - shown between columns when editing */}
      {isEditing && isSectionSelected && !isLastColumn && (
        <ColumnResizeHandle
          sectionId={sectionId}
          columnId={column.id}
          adjacentColumnId={nextColumnId}
          isLast={isLastColumn}
        />
      )}
    </div>
  );
};

SortableColumn.displayName = 'SortableColumn';
