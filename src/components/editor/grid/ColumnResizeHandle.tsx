/**
 * ColumnResizeHandle Component
 * 
 * Resize handle for adjusting column widths.
 * Resizing is COLUMN-based only, not widget-based.
 * Updates the store with new column widths on resize end.
 */

import React, { useCallback, useRef, useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface ColumnResizeHandleProps {
  /** Section ID */
  sectionId: string;
  /** Column ID being resized */
  columnId: string;
  /** Adjacent column ID (for proportional resizing) */
  adjacentColumnId?: string;
  /** Whether this column is the last one (no right handle) */
  isLast?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export const ColumnResizeHandle: React.FC<ColumnResizeHandleProps> = ({
  sectionId,
  columnId,
  adjacentColumnId,
  isLast = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const adjacentStartWidthRef = useRef(0);
  
  const updateColumnWidth = useEditorStore(state => state.updateColumnWidth);
  const pageData = useEditorStore(state => state.pageData);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    startXRef.current = e.clientX;

    // Get current column element and its width
    const columnEl = document.querySelector(`[data-column-id="${columnId}"]`);
    const adjacentEl = adjacentColumnId 
      ? document.querySelector(`[data-column-id="${adjacentColumnId}"]`)
      : null;
    
    if (columnEl) {
      startWidthRef.current = columnEl.getBoundingClientRect().width;
    }
    if (adjacentEl) {
      adjacentStartWidthRef.current = adjacentEl.getBoundingClientRect().width;
    }

    // Add global listeners
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startXRef.current;
      const newWidth = startWidthRef.current + deltaX;
      
      // Apply temporary style for visual feedback
      const colEl = document.querySelector(`[data-column-id="${columnId}"]`) as HTMLElement;
      const adjEl = adjacentColumnId 
        ? document.querySelector(`[data-column-id="${adjacentColumnId}"]`) as HTMLElement
        : null;
      
      if (colEl) {
        colEl.style.flex = `0 0 ${Math.max(50, newWidth)}px`;
      }
      // Proportionally resize adjacent column
      if (adjEl && adjacentStartWidthRef.current > 0) {
        const adjNewWidth = adjacentStartWidthRef.current - deltaX;
        adjEl.style.flex = `0 0 ${Math.max(50, adjNewWidth)}px`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Calculate final width as percentage
      const columnEl = document.querySelector(`[data-column-id="${columnId}"]`) as HTMLElement;
      const adjacentEl = adjacentColumnId 
        ? document.querySelector(`[data-column-id="${adjacentColumnId}"]`) as HTMLElement
        : null;
      const gridEl = columnEl?.parentElement;
      
      if (columnEl && gridEl) {
        const gridWidth = gridEl.getBoundingClientRect().width;
        const finalWidth = columnEl.getBoundingClientRect().width;
        const widthPercent = `${((finalWidth / gridWidth) * 100).toFixed(2)}%`;
        
        // Reset inline styles
        columnEl.style.flex = '';
        
        // Get current column width from store
        const section = pageData?.sections.find(s => s.id === sectionId);
        const column = section?.grid?.columns.find(c => c.id === columnId);
        
        if (column) {
          // Update store with new width
          updateColumnWidth(sectionId, columnId, {
            ...column.width,
            desktop: widthPercent,
          });
        }
        
        // Also update adjacent column if resized proportionally
        if (adjacentEl && adjacentColumnId) {
          const adjFinalWidth = adjacentEl.getBoundingClientRect().width;
          const adjWidthPercent = `${((adjFinalWidth / gridWidth) * 100).toFixed(2)}%`;
          
          adjacentEl.style.flex = '';
          
          const adjColumn = section?.grid?.columns.find(c => c.id === adjacentColumnId);
          if (adjColumn) {
            updateColumnWidth(sectionId, adjacentColumnId, {
              ...adjColumn.width,
              desktop: adjWidthPercent,
            });
          }
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [columnId, adjacentColumnId, sectionId, updateColumnWidth, pageData]);

  // Don't render handle for last column
  if (isLast) return null;

  return (
    <div
      className={cn(
        'absolute top-0 bottom-0 -right-1 w-2 cursor-col-resize z-20',
        'hover:bg-primary/30 transition-colors',
        isDragging && 'bg-primary/40'
      )}
      onMouseDown={handleMouseDown}
    >
      {/* Visual indicator line */}
      <div 
        className={cn(
          'absolute top-0 bottom-0 right-0.5 w-0.5',
          'bg-transparent hover:bg-primary transition-colors',
          isDragging && 'bg-primary'
        )}
      />
      
      {/* Width indicator during drag */}
      {isDragging && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] rounded whitespace-nowrap">
          Resizing...
        </div>
      )}
    </div>
  );
};

ColumnResizeHandle.displayName = 'ColumnResizeHandle';
