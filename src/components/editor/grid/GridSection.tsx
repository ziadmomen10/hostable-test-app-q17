/**
 * GridSection Component
 * 
 * The top-level grid container that renders sections using CSS Grid.
 * Enforces the Elementor-style layout hierarchy: Section → Column → Widget
 * 
 * CRITICAL: This component contains the SortableContext for columns.
 * Columns are sortable horizontally within a section.
 */

import React, { useMemo } from 'react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { SectionInstance } from '@/types/reactEditor';
import { NormalizedSection, DRAG_TYPES } from '@/types/grid';
import { normalizeSection } from '@/lib/gridNormalizer';
import { SortableColumn } from './SortableColumn';
import { useEditorStore, useSelection, useSelectedSectionId } from '@/stores/editorStore';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface GridSectionProps {
  /** Section instance from document */
  section: SectionInstance;
  /** Whether the editor is in edit mode */
  isEditing: boolean;
  /** Optional class name */
  className?: string;
  /** Children to render in the header area */
  headerContent?: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export const GridSection: React.FC<GridSectionProps> = ({
  section,
  isEditing,
  className,
  headerContent,
}) => {
  const deviceMode = useEditorStore(state => state.deviceMode);
  const selectedSectionId = useSelectedSectionId();
  const selection = useSelection();
  
  // Check if this section is selected
  const isSectionSelected = selectedSectionId === section.id && 
    (selection.type === 'section' || selection.type === 'column');
  
  // Normalize section to grid format (memoized)
  const normalizedSection: NormalizedSection = useMemo(
    () => normalizeSection(section),
    [section]
  );

  const { grid } = normalizedSection;

  // Column IDs for sortable context - CRITICAL for column DnD
  const columnIds = useMemo(() => grid.columns.map(c => c.id), [grid.columns]);

  // Make section droppable for widgets
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `section-${section.id}`,
    data: {
      type: DRAG_TYPES.SECTION,
      sectionId: section.id,
    },
    disabled: !isEditing,
  });

  // Calculate grid template columns based on device mode
  const gridTemplateColumns = useMemo(() => {
    const columns = grid.columns;
    
    if (columns.length === 0) return '1fr';

    // Check responsive overrides
    if (deviceMode === 'mobile' && grid.responsive?.mobile) {
      return `repeat(${grid.responsive.mobile.columns}, 1fr)`;
    }
    if (deviceMode === 'tablet' && grid.responsive?.tablet) {
      return `repeat(${grid.responsive.tablet.columns}, 1fr)`;
    }

    // Use column widths
    return columns.map(col => {
      const width = deviceMode === 'mobile' 
        ? col.width.mobile 
        : deviceMode === 'tablet'
        ? col.width.tablet 
        : col.width.desktop;
      
      // Convert fraction notation to CSS
      if (width?.includes('/')) {
        const [num, denom] = width.split('/').map(Number);
        return `${(num / denom) * 100}%`;
      }
      return width || '1fr';
    }).join(' ');
  }, [grid.columns, grid.responsive, deviceMode]);

  return (
    <div
      ref={setDroppableRef}
      data-section-id={section.id}
      data-section-type={section.type}
      data-grid-normalized={normalizedSection.isNormalized}
      className={cn(
        'grid-section relative',
        !section.visible && 'opacity-50',
        // Add padding when editing to make room for column badges
        isEditing && isSectionSelected && 'pt-8 pb-6',
        isOver && isEditing && 'ring-2 ring-primary/30',
        className
      )}
    >
      {/* Header content (badge, title, subtitle) - rendered by parent */}
      {headerContent}

      {/* Grid container with column sortable context */}
      <SortableContext 
        items={columnIds} 
        strategy={horizontalListSortingStrategy}
      >
        <div
          className={cn(
            "grid-container relative",
            isEditing && isSectionSelected && "bg-muted/10 rounded-lg p-2"
          )}
          style={{
            display: 'grid',
            gridTemplateColumns,
            gap: grid.gap || '1.5rem',
            alignItems: grid.alignment === 'stretch' ? 'stretch' : `flex-${grid.alignment || 'start'}`,
          }}
        >
          {grid.columns.map((column, index) => (
            <SortableColumn
              key={column.id}
              column={column}
              sectionId={section.id}
              columnIndex={index}
              totalColumns={grid.columns.length}
              nextColumnId={grid.columns[index + 1]?.id}
              isEditing={isEditing}
              isSectionSelected={isSectionSelected}
            />
          ))}
        </div>
      </SortableContext>
      
      {/* Grid info badge - shown when section is selected */}
      {isEditing && isSectionSelected && (
        <div className="absolute top-0 right-0 px-2 py-1 bg-primary/10 text-primary text-[10px] font-medium rounded-bl">
          {grid.columns.length} column{grid.columns.length !== 1 ? 's' : ''} • Gap: {grid.gap || '1.5rem'}
        </div>
      )}
    </div>
  );
};

GridSection.displayName = 'GridSection';
