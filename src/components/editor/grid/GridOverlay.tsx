/**
 * Grid Overlay Component
 * 
 * Renders visual feedback for grid structure:
 * - Column outlines when section is selected
 * - Column boundaries on hover
 * - Gap indicators
 * - Drop zone visualization
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useEditorStore, useSelection } from '@/stores/editorStore';
import type { SectionGrid } from '@/types/grid';

interface GridOverlayProps {
  sectionId: string;
  grid: SectionGrid;
  isSelected: boolean;
  isHovered: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export function GridOverlay({
  sectionId,
  grid,
  isSelected,
  isHovered,
  containerRef,
}: GridOverlayProps) {
  const { columns, gap = '1rem' } = grid;
  const selection = useSelection();
  const isGridVisible = isSelected || isHovered;

  if (!isGridVisible || columns.length === 0) {
    return null;
  }

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-10"
      aria-hidden="true"
    >
      {/* Grid column outlines */}
      <div 
        className={cn(
          "absolute inset-0 grid",
          "transition-opacity duration-150"
        )}
        style={{
          gridTemplateColumns: columns
            .map(col => col.width.desktop || '1fr')
            .join(' '),
          gap,
        }}
      >
        {columns.map((column, index) => {
          const isColumnSelected = selection.type === 'column' && 
            selection.columnId === column.id;
          
          return (
            <div
              key={column.id}
              className={cn(
                "relative transition-all duration-150",
                isSelected && !isColumnSelected && "border-2 border-dashed border-primary/30",
                isColumnSelected && "border-2 border-solid border-primary ring-2 ring-primary/20"
              )}
            >
              {/* Column index badge */}
              {isSelected && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
                  Col {index + 1}
                </div>
              )}
              
              {/* Widget count indicator */}
              {isSelected && column.widgets.length > 0 && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                  {column.widgets.length} widget{column.widgets.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Gap indicators - shown between columns */}
      {isSelected && columns.length > 1 && (
        <div 
          className="absolute inset-0 grid pointer-events-none"
          style={{
            gridTemplateColumns: columns
              .map(col => col.width.desktop || '1fr')
              .join(' '),
            gap,
          }}
        >
          {columns.slice(0, -1).map((_, index) => (
            <div
              key={`gap-${index}`}
              className="relative"
              style={{ gridColumn: index + 1 }}
            >
              <div 
                className="absolute right-0 top-0 bottom-0 flex items-center justify-center translate-x-1/2 z-20"
                style={{ width: gap }}
              >
                <div className="w-px h-full border-l border-dashed border-muted-foreground/40" />
                <span className="absolute px-1 py-0.5 bg-background text-muted-foreground text-[10px] rounded whitespace-nowrap">
                  {gap}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type { GridOverlayProps };
