/**
 * FloatingToolbar
 * 
 * A contextual toolbar that appears near the selected element.
 * Provides quick actions: Edit, Duplicate, Delete, Move, Settings.
 * 
 * Uses Zustand store directly for better performance.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  useEditorStore, 
  useSelection, 
  usePageData,
  useSelectedSection,
} from '@/stores/editorStore';
import { getElementById } from '@/stores/elementRegistry';
import { Button } from '@/components/ui/button';
import { 
  Pencil, 
  Copy, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

interface ToolbarPosition {
  top: number;
  left: number;
  placement: 'above' | 'below';
}

// ============================================================================
// Component
// ============================================================================

export function FloatingToolbar() {
  const selection = useSelection();
  const selectedSection = useSelectedSection();
  const pageData = usePageData();
  
  // Get store actions directly
  const startInlineEdit = useEditorStore(state => state.startInlineEdit);
  const clearSelection = useEditorStore(state => state.clearSelection);
  const duplicateSection = useEditorStore(state => state.duplicateSection);
  const deleteSection = useEditorStore(state => state.deleteSection);
  const reorderSections = useEditorStore(state => state.reorderSections);
  
  const [position, setPosition] = useState<ToolbarPosition | null>(null);
  
  // Calculate position based on selected element
  const updatePosition = useCallback(() => {
    if (selection.type !== 'element' || !selection.sectionId || !selection.elementPath) {
      setPosition(null);
      return;
    }
    
    // Try registry first, fall back to DOM query
    const registration = getElementById(selection.sectionId, selection.elementPath);
    let el = registration?.ref.current;
    
    if (!el) {
      el = document.querySelector(
        `[data-editable="${selection.elementPath}"][data-section-id="${selection.sectionId}"]`
      ) as HTMLElement;
    }
    
    if (!el) {
      setPosition(null);
      return;
    }
    
    const rect = el.getBoundingClientRect();
    const toolbarHeight = 40; // Approximate toolbar height
    const margin = 8;
    
    // Prefer above, but go below if not enough space
    const spaceAbove = rect.top;
    const placement = spaceAbove > toolbarHeight + margin ? 'above' : 'below';
    
    setPosition({
      top: placement === 'above' 
        ? rect.top - toolbarHeight - margin 
        : rect.bottom + margin,
      left: rect.left,
      placement,
    });
  }, [selection]);
  
  // Update position on selection change and scroll/resize
  useEffect(() => {
    if (selection.isInlineEditing) {
      setPosition(null);
      return;
    }
    
    updatePosition();
    
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition, selection.isInlineEditing]);
  
  // Don't render if no element selected or inline editing
  if (!position || selection.type !== 'element' || selection.isInlineEditing) {
    return null;
  }
  
  // Get section index for move actions
  const sectionIndex = pageData?.sections.findIndex(s => s.id === selection.sectionId) ?? -1;
  const canMoveUp = sectionIndex > 0;
  const canMoveDown = pageData ? sectionIndex < pageData.sections.length - 1 : false;
  
  // Handlers
  const handleEdit = () => {
    startInlineEdit();
  };
  
  const handleDuplicate = () => {
    if (selection.sectionId) {
      duplicateSection(selection.sectionId);
      toast.success('Section duplicated');
    }
  };
  
  const handleDelete = () => {
    if (selection.sectionId && window.confirm('Delete this section?')) {
      deleteSection(selection.sectionId);
      toast.success('Section deleted');
    }
  };
  
  const handleMoveUp = () => {
    if (canMoveUp) {
      reorderSections(sectionIndex, sectionIndex - 1);
    }
  };
  
  const handleMoveDown = () => {
    if (canMoveDown) {
      reorderSections(sectionIndex, sectionIndex + 1);
    }
  };
  
  const handleClose = () => {
    clearSelection();
  };
  
  const toolbarContent = (
    <div
      className={cn(
        'fixed z-[10000] flex items-center gap-1 p-1 bg-background border rounded-lg shadow-lg',
        'animate-in fade-in-0 zoom-in-95 duration-150'
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {/* Edit Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 gap-1"
        onClick={handleEdit}
        title="Edit inline (Double-click)"
      >
        <Pencil className="h-3.5 w-3.5" />
        <span className="text-xs">Edit</span>
      </Button>
      
      {/* Divider */}
      <div className="w-px h-5 bg-border" />
      
      {/* Move Up */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleMoveUp}
        disabled={!canMoveUp}
        title="Move section up"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </Button>
      
      {/* Move Down */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleMoveDown}
        disabled={!canMoveDown}
        title="Move section down"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>
      
      {/* Divider */}
      <div className="w-px h-5 bg-border" />
      
      {/* Duplicate */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleDuplicate}
        title="Duplicate section"
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
      
      {/* Delete */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-destructive hover:text-destructive"
        onClick={handleDelete}
        title="Delete section"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
      
      {/* Divider */}
      <div className="w-px h-5 bg-border" />
      
      {/* Close */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleClose}
        title="Deselect"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
  
  return createPortal(toolbarContent, document.body);
}

export default FloatingToolbar;
