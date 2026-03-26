/**
 * SectionList
 * 
 * Left panel tab that shows all sections in the current page.
 * Supports reordering, visibility toggle, and deletion.
 * 
 * NOTE: This component is now nested inside the root DndContext in ReactPageEditor.
 * Reordering of sections in this list is handled by the parent DndContext.
 * This component only provides the UI - drag events bubble up to ReactPageEditor.
 * 
 * Uses Zustand store directly for better performance.
 */

import React, { useCallback } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  useEditorStore, 
  usePageData, 
  useSelectedSectionId,
} from '@/stores/editorStore';
import { getSectionDefinition } from '@/lib/sectionDefinitions.tsx';
import { SectionInstance } from '@/types/reactEditor';
import { Button } from '@/components/ui/button';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================================================
// Sortable Section Item
// ============================================================================

interface SectionItemProps {
  section: SectionInstance;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}

function SectionItem({
  section,
  index,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDelete,
}: SectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const definition = getSectionDefinition(section.type);
  const Icon = definition?.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all',
        isSelected && 'bg-primary/10 border-primary',
        !isSelected && 'hover:bg-muted/50',
        isDragging && 'opacity-50 shadow-lg',
        !section.visible && 'opacity-50'
      )}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-0.5 rounded hover:bg-muted cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Section Icon */}
      <div className={cn(
        'w-6 h-6 rounded flex items-center justify-center shrink-0',
        isSelected ? 'bg-primary/20' : 'bg-muted'
      )}>
        {Icon ? (
          <Icon className={cn('h-3 w-3', isSelected ? 'text-primary' : 'text-muted-foreground')} />
        ) : (
          <span className="text-xs text-muted-foreground">{index + 1}</span>
        )}
      </div>

      {/* Section Name */}
      <span className="flex-1 text-sm truncate" title={definition?.displayName || section.type}>
        {definition?.displayName || section.type}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          title={section.visible ? 'Hide section' : 'Show section'}
        >
          {section.visible ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete section"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <ChevronRight className="h-4 w-4 text-primary shrink-0" />
      )}
    </div>
  );
}

// ============================================================================
// SectionList Component
// ============================================================================

export function SectionList() {
  // Use Zustand store directly
  const pageData = usePageData();
  const selectedSectionId = useSelectedSectionId();
  const selectSection = useEditorStore(state => state.selectSection);
  const toggleSectionVisibility = useEditorStore(state => state.toggleSectionVisibility);
  const deleteSection = useEditorStore(state => state.deleteSection);

  // Handle delete with confirmation
  const handleDelete = useCallback((sectionId: string) => {
    if (window.confirm('Delete this section?')) {
      deleteSection(sectionId);
      toast.success('Section deleted');
    }
  }, [deleteSection]);

  if (!pageData || pageData.sections.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        <p>No sections yet.</p>
        <p className="text-xs mt-1">Add sections from the Blocks tab.</p>
      </div>
    );
  }

  const sortedSections = [...pageData.sections].sort((a, b) => a.order - b.order);

  // NOTE: SortableContext is used here but drag events bubble up to the root
  // DndContext in ReactPageEditor which handles section reordering
  return (
    <div className="p-2 space-y-1">
      <SortableContext
        items={sortedSections.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        {sortedSections.map((section, index) => (
          <SectionItem
            key={section.id}
            section={section}
            index={index}
            isSelected={selectedSectionId === section.id}
            onSelect={() => selectSection(section.id)}
            onToggleVisibility={() => toggleSectionVisibility(section.id)}
            onDelete={() => handleDelete(section.id)}
          />
        ))}
      </SortableContext>
    </div>
  );
}

export default SectionList;
