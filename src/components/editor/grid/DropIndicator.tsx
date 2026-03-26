/**
 * DropIndicator Component
 * 
 * Visual indicator showing where items will be dropped.
 * Supports section, column, and widget drop positions.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { DragType, DRAG_TYPES } from '@/types/grid';

// ============================================================================
// Types
// ============================================================================

export interface DropIndicatorProps {
  /** Type of drop target */
  type: DragType;
  /** Position relative to target */
  position: 'before' | 'after';
  /** Whether the indicator is active (showing) */
  isActive: boolean;
  /** Optional class name */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export const DropIndicator: React.FC<DropIndicatorProps> = ({
  type,
  position,
  isActive,
  className,
}) => {
  if (!isActive) return null;

  return (
    <div 
      className={cn(
        'absolute pointer-events-none z-50 transition-all',
        // Section: horizontal line across full width
        type === DRAG_TYPES.SECTION && 'left-0 right-0 h-1 bg-primary rounded-full',
        type === DRAG_TYPES.SECTION && position === 'before' && 'top-0 -translate-y-1/2',
        type === DRAG_TYPES.SECTION && position === 'after' && 'bottom-0 translate-y-1/2',
        // Column: vertical line full height
        type === DRAG_TYPES.COLUMN && 'top-0 bottom-0 w-1 bg-primary rounded-full',
        type === DRAG_TYPES.COLUMN && position === 'before' && 'left-0 -translate-x-1/2',
        type === DRAG_TYPES.COLUMN && position === 'after' && 'right-0 translate-x-1/2',
        // Widget: horizontal line within column
        type === DRAG_TYPES.WIDGET && 'left-2 right-2 h-0.5 bg-primary rounded-full',
        type === DRAG_TYPES.WIDGET && position === 'before' && 'top-0 -translate-y-1/2',
        type === DRAG_TYPES.WIDGET && position === 'after' && 'bottom-0 translate-y-1/2',
        className
      )}
    >
      {/* Dot at ends */}
      {(type === DRAG_TYPES.SECTION || type === DRAG_TYPES.WIDGET) && (
        <>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
        </>
      )}
      {type === DRAG_TYPES.COLUMN && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
        </>
      )}
    </div>
  );
};

DropIndicator.displayName = 'DropIndicator';
