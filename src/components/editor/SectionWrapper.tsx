/**
 * SectionWrapper
 * 
 * Wraps each section with:
 * - Drag handle for reordering (in toolbar)
 * - Section type label
 * - Quick actions (delete, duplicate, visibility)
 * 
 * Uses Zustand store directly for better performance.
 * Phase 5: Pure Overlay System - Visual feedback moved to SectionOverlay
 */

import React, { useCallback, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore } from '@/stores/editorStore';
import { getSectionDefinition } from '@/lib/sectionDefinitions.tsx';
import { SectionInstance } from '@/types/reactEditor';
import { Button } from '@/components/ui/button';
import { 
  GripVertical, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================================================
// Props
// ============================================================================

interface SectionWrapperProps {
  section: SectionInstance;
  isSelected: boolean;
  isDragging: boolean;
  children: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export function SectionWrapper({
  section,
  isSelected,
  isDragging,
  children,
}: SectionWrapperProps) {
  // Get store actions directly
  const selectSection = useEditorStore(state => state.selectSection);
  const deleteSection = useEditorStore(state => state.deleteSection);
  const duplicateSection = useEditorStore(state => state.duplicateSection);
  const toggleSectionVisibility = useEditorStore(state => state.toggleSectionVisibility);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: section.id,
    data: {
      type: 'section',
      sectionId: section.id,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const definition = getSectionDefinition(section.type);
  const Icon = definition?.icon;

  // Get saved dimensions from section props
  const savedMinHeight = section.props?.minHeight;
  const savedMaxWidth = section.props?.maxWidth;

  // Handlers
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    selectSection(section.id);
  }, [selectSection, section.id]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this section?')) {
      deleteSection(section.id);
      toast.success('Section deleted');
    }
  }, [deleteSection, section.id]);

  const handleDuplicate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateSection(section.id);
    toast.success('Section duplicated');
  }, [duplicateSection, section.id]);

  const handleToggleVisibility = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSectionVisibility(section.id);
  }, [toggleSectionVisibility, section.id]);

  // Combine refs
  const setCombinedRef = useCallback((node: HTMLDivElement | null) => {
    setNodeRef(node);
    (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }, [setNodeRef]);

  return (
    <div
      ref={setCombinedRef}
      style={{
        ...style,
        minHeight: savedMinHeight || undefined,
        maxWidth: savedMaxWidth || undefined,
      }}
      className={cn(
        'relative group/section transition-all duration-200 mx-auto overflow-visible',
        isDragging && 'opacity-50 scale-[0.98]',
        !section.visible && 'opacity-40'
      )}
      onClick={handleClick}
      data-section-wrapper
      data-section-id={section.id}
      data-dnd-type="section"
    >
      {/* LEFT SIDE DRAG HANDLE - Visible on hover, positioned inside section */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute left-2 top-1/2 -translate-y-1/2 z-30',
          'flex flex-col items-center gap-1 p-2 rounded-lg',
          'bg-primary/90 shadow-lg cursor-grab active:cursor-grabbing',
          'opacity-0 group-hover/section:opacity-100 transition-all duration-200',
          'hover:bg-primary hover:scale-105',
          isSelected && 'opacity-100'
        )}
        onClick={(e) => e.stopPropagation()}
        title="Drag to reorder section"
      >
        <GripVertical className="h-5 w-5 text-primary-foreground" />
        <span className="text-[10px] font-medium text-primary-foreground/80 whitespace-nowrap">
          Drag
        </span>
      </div>

      {/* Selection indicator - left border */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1 rounded-full transition-all duration-200',
          isSelected ? 'bg-primary' : 'bg-transparent group-hover/section:bg-primary/30'
        )}
      />

      {/* Top Toolbar - Only visible when selected or hovered */}
      <div
        className={cn(
          'absolute -top-10 left-0 right-0 flex items-center justify-between px-2 py-1 z-20 transition-opacity',
          isSelected || 'opacity-0 group-hover/section:opacity-100'
        )}
      >
        {/* Left side - Section type badge */}
        <div className="flex items-center gap-2">
          {/* Section Type Badge */}
          <div className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium shadow-sm">
            {Icon && <Icon className="h-3 w-3" />}
            <span>{definition?.displayName || section.type}</span>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1 bg-background rounded shadow-sm border">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleToggleVisibility}
            title={section.visible ? 'Hide section' : 'Show section'}
          >
            {section.visible ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleDuplicate}
            title="Duplicate section"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={handleDelete}
            title="Delete section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Section Content - overflow visible for item drag handles */}
      <div className={cn('overflow-visible', !section.visible && 'pointer-events-none')}>
        {children}
      </div>

      {/* Drag overlay indicator when dragging */}
      {isDragging && (
        <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg pointer-events-none z-10" />
      )}
    </div>
  );
}

export default SectionWrapper;
