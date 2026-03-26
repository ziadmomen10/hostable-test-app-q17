/**
 * EditorCanvas
 * 
 * The main canvas component that renders sections as real React components.
 * Supports drag-and-drop reordering via @dnd-kit.
 * Supports RTL direction for RTL languages.
 * Supports element-level selection and inline editing.
 * 
 * NOTE: DndContext is now owned by ReactPageEditor to enable cross-panel
 * drag-and-drop from BlockLibrary to canvas. This component provides
 * droppable zones and sortable contexts within the shared DndContext.
 * 
 * Drag Type Hierarchy:
 * - BLOCK: Can drop onto canvas drop zones (from library)
 * - SECTION: Can only drop among sections
 * - COLUMN: Can only drop among columns of the same section
 * - WIDGET: Can drop among widgets or onto columns
 * 
 * Uses Zustand store directly for better performance.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  useDroppable,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  useEditorStore, 
  useSelection, 
  useDragContext, 
  useEditorMode,
  usePageData,
  useSelectedSectionId,
  useDeviceMode,
  useIsLoading,
} from '@/stores/editorStore';
import { DRAG_TYPES } from '@/types/grid';
import { getElementCount } from '@/stores/elementRegistry';
import { useI18n } from '@/contexts/I18nContext';
import SectionWrapper from './SectionWrapper';
import { EditorSectionRenderer } from './EditorSectionRenderer';
import SelectionOverlay from './SelectionOverlay';
import SectionOverlay from './SectionOverlay';
import FloatingToolbar from './FloatingToolbar';
import InlineEditor from './InlineEditor';
import { EditorModeProvider } from '@/contexts/EditorModeContext';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

// ============================================================================
// Props
// ============================================================================

interface EditorCanvasProps {
  /** Whether a block is currently being dragged from the library */
  isDraggingBlock?: boolean;
}

// ============================================================================
// Debug Panel (Development Only)
// ============================================================================

function DebugPanel() {
  const store = useEditorStore();
  const selection = useSelection();
  const editorMode = useEditorMode();
  
  // Only show in development and when enabled
  if (typeof window === 'undefined') return null;
  if (process.env.NODE_ENV === 'production') return null;
  if (!(window as any).__EDITOR_DEBUG) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: '#000',
      color: '#0f0',
      padding: 10,
      fontSize: 10,
      fontFamily: 'monospace',
      maxWidth: 320,
      maxHeight: 400,
      overflow: 'auto',
      zIndex: 99999,
      borderRadius: 4,
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    }}>
      <div style={{ marginBottom: 4, fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: 4 }}>
        🔧 Editor Debug (Zustand)
      </div>
      <div>Mode: <span style={{ color: '#ff0' }}>{editorMode}</span></div>
      <div>Section: <span style={{ color: '#0ff' }}>{selection.sectionId || 'none'}</span></div>
      <div>Element: <span style={{ color: '#0ff' }}>{selection.elementPath || 'none'}</span></div>
      <div>Inline Edit: <span style={{ color: selection.isInlineEditing ? '#0f0' : '#f00' }}>{selection.isInlineEditing ? 'YES' : 'no'}</span></div>
      <div>Dirty: <span style={{ color: store.hasUnsavedChanges ? '#ff0' : '#0f0' }}>{store.hasUnsavedChanges ? '⚠️ YES' : '✓ No'}</span></div>
      <div>Sections: <span style={{ color: '#fff' }}>{store.pageData?.sections.length ?? 0}</span></div>
      <div>History: <span style={{ color: '#fff' }}>{store.historyIndex + 1}/{store.history.length}</span></div>
      <div>Autosave: <span style={{ color: '#fff' }}>{store.autosaveStatus}</span></div>
      <div>Registry: <span style={{ color: '#0ff' }}>{getElementCount()} elements</span></div>
    </div>
  );
}

// ============================================================================
// Drop Zone Component
// ============================================================================

interface DropZoneProps {
  index: number;
  isActive: boolean;
}

function DropZone({ index, isActive }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-zone-${index}`,
    data: { 
      type: 'drop-zone', 
      index,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-all duration-200 mx-4',
        // When not dragging a block, be invisible
        !isActive && 'h-0',
        // When dragging a block, show as potential drop target
        isActive && 'h-16 border-2 border-dashed border-primary/40 rounded-lg bg-primary/5 my-2',
        // When hovering over this drop zone
        isActive && isOver && 'border-primary bg-primary/10 scale-[1.02]',
      )}
    >
      {isActive && (
        <div className={cn(
          'h-full flex items-center justify-center gap-2 text-sm',
          isOver ? 'text-primary' : 'text-muted-foreground'
        )}>
          <Plus className="h-4 w-4" />
          <span>Drop here to insert</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Empty Canvas Drop Zone
// ============================================================================

function EmptyCanvasDropZone({ isActive }: { isActive: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-empty-zone',
    data: { 
      type: 'canvas-empty', 
      index: 0,
    },
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        'flex-1 flex items-center justify-center bg-muted/30 min-h-[400px] transition-all duration-200',
        isActive && 'bg-primary/5',
        isActive && isOver && 'bg-primary/10',
      )}
    >
      <div className={cn(
        'text-center p-8 border-2 border-dashed rounded-lg transition-all',
        isActive && isOver 
          ? 'border-primary bg-primary/10' 
          : 'border-muted-foreground/30'
      )}>
        <h3 className={cn(
          'font-medium mb-2',
          isActive && isOver ? 'text-primary' : 'text-muted-foreground'
        )}>
          {isActive ? 'Drop section here' : 'No sections yet'}
        </h3>
        <p className="text-sm text-muted-foreground/70">
          {isActive 
            ? 'Release to add the section' 
            : 'Drag a section from the left panel to get started'}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Device Width Classes
// ============================================================================

const deviceWidthClasses = {
  desktop: 'max-w-full',
  tablet: 'max-w-[768px]',
  mobile: 'max-w-[375px]',
};

// ============================================================================
// EditorCanvas Component
// ============================================================================

export function EditorCanvas({ isDraggingBlock = false }: EditorCanvasProps) {
  // Use Zustand store directly
  const pageData = usePageData();
  const deviceMode = useDeviceMode();
  const selectedSectionId = useSelectedSectionId();
  const isLoading = useIsLoading();
  
  // CRITICAL: Subscribe to sectionVersions to force re-renders when ANY section updates
  const sectionVersions = useEditorStore(state => state.sectionVersions);
  const totalVersion = Object.values(sectionVersions).reduce((a, b) => a + b, 0);
  
  const { isRTL, direction } = useI18n();
  
  // Get store actions directly
  const selectElement = useEditorStore(state => state.selectElement);
  const selectSection = useEditorStore(state => state.selectSection);
  const clearSelection = useEditorStore(state => state.clearSelection);
  const setHoveredElement = useEditorStore(state => state.setHoveredElement);
  const startInlineEdit = useEditorStore(state => state.startInlineEdit);
  const stopInlineEdit = useEditorStore(state => state.stopInlineEdit);
  
  const selection = useSelection();
  const editorMode = useEditorMode();
  const dragContext = useDragContext();
  
  // Active drag ID for visual feedback
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(null);

  // Track active section for drag overlay
  const activeSection = dragContext?.type === 'section' && activeDragId
    ? pageData?.sections.find(s => s.id === activeDragId)
    : null;

  // Handle click on editable elements
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if clicked on an editable element
    const editableEl = target.closest('[data-editable]');
    if (editableEl) {
      const path = editableEl.getAttribute('data-editable');
      const sectionId = editableEl.getAttribute('data-section-id');
      
      if (path && sectionId) {
        e.stopPropagation();
        selectElement(sectionId, path);
        selectSection(sectionId);
        return;
      }
    }
    
    // Check if clicked on a section (but not an editable element)
    const sectionEl = target.closest('[data-section-wrapper]');
    if (sectionEl) {
      const sectionId = sectionEl.getAttribute('data-section-id');
      if (sectionId) {
        clearSelection();
        selectSection(sectionId);
        return;
      }
    }
    
    // Clicked outside - deselect all
    if (e.target === e.currentTarget) {
      clearSelection();
      selectSection(null);
    }
  }, [selectSection, selectElement, clearSelection]);

  // Handle double-click for inline editing
  const handleCanvasDoubleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const editableEl = target.closest('[data-editable]');
    
    if (editableEl) {
      const path = editableEl.getAttribute('data-editable');
      const sectionId = editableEl.getAttribute('data-section-id');
      
      if (path && sectionId) {
        e.stopPropagation();
        e.preventDefault();
        
        if (selection.elementPath !== path || selection.sectionId !== sectionId) {
          selectElement(sectionId, path);
        }
        
        startInlineEdit();
      }
    }
  }, [selection, selectElement, startInlineEdit]);

  // Handle mouse enter/leave for hover
  const handleMouseOver = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const editableEl = target.closest('[data-editable]');
    
    if (editableEl) {
      const path = editableEl.getAttribute('data-editable');
      const sectionId = editableEl.getAttribute('data-section-id');
      
      if (path && sectionId) {
        setHoveredElement(sectionId, path);
      }
    } else {
      setHoveredElement(null, null);
    }
  }, [setHoveredElement]);

  const handleMouseLeave = useCallback(() => {
    setHoveredElement(null, null);
  }, [setHoveredElement]);

  // Keyboard handler for Escape to exit inline edit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selection.isInlineEditing) {
          stopInlineEdit();
        } else if (selection.type !== 'none') {
          clearSelection();
          selectSection(null);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, stopInlineEdit, clearSelection, selectSection]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    );
  }

  // Empty state - show large drop zone
  if (!pageData || pageData.sections.length === 0) {
    return (
      <EditorModeProvider isEditorMode={true} showTranslationBadges={true} pageData={pageData}>
        <div 
          className="h-full overflow-auto bg-muted/30 p-4"
          dir="ltr"
          onClick={handleCanvasClick}
        >
          <EmptyCanvasDropZone isActive={isDraggingBlock} />
        </div>
        <DebugPanel />
      </EditorModeProvider>
    );
  }

  // Sort sections by order
  const sortedSections = [...pageData.sections].sort((a, b) => a.order - b.order);
  const sectionIds = sortedSections.map(s => s.id);

  return (
    <EditorModeProvider isEditorMode={true} showTranslationBadges={true} pageData={pageData}>
      {/* Outer container - ALWAYS LTR to keep admin UI consistent */}
      <div 
        className="h-full overflow-auto bg-muted/30 p-4"
        dir="ltr"
        onClick={handleCanvasClick}
        onDoubleClick={handleCanvasDoubleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        {/* Inner content - follows language direction for page preview */}
        <div
          className={cn(
            'mx-auto bg-background min-h-full shadow-lg transition-all duration-300',
            deviceWidthClasses[deviceMode]
          )}
          dir={direction}
        >
          <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
            {/* Drop zone before first section */}
            <DropZone index={0} isActive={isDraggingBlock} />
            
            {sortedSections.map((section, index) => (
              <React.Fragment key={section.id}>
                <SectionWrapper
                  section={section}
                  isSelected={selectedSectionId === section.id}
                  isDragging={editorMode === 'dragging' && dragContext?.type === 'section' && dragContext.sectionId === section.id}
                >
                  <EditorSectionRenderer
                    section={section}
                    isEditing={true}
                  />
                </SectionWrapper>
                
                {/* Drop zone after each section */}
                <DropZone index={index + 1} isActive={isDraggingBlock} />
              </React.Fragment>
            ))}
          </SortableContext>
        </div>
        
        {/* Overlay System */}
        <SelectionOverlay />
        <SectionOverlay />
        <FloatingToolbar />
        <InlineEditor />
        
        {/* Debug Panel (dev only, enable with window.__EDITOR_DEBUG = true) */}
        <DebugPanel />
      </div>
    </EditorModeProvider>
  );
}

export default EditorCanvas;
