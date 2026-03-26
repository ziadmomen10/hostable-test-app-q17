/**
 * ReactPageEditor
 * 
 * The main React-native page editor component with translation engine integration.
 * 
 * IMPORTANT: EditorContent MUST be rendered inside EditorProvider context.
 * 
 * This component owns the root DndContext to enable drag-and-drop from
 * the BlockLibrary panel to the EditorCanvas.
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  pointerWithin,
  rectIntersection,
  MeasuringStrategy,
  UniqueIdentifier,
  CollisionDetection,
  DragOverEvent,
} from '@dnd-kit/core';
import { EditorProvider, useSaveContext } from './EditorProvider';
import { TranslationEngineProvider } from '@/contexts/TranslationEngineContext';
import { useI18n } from '@/contexts/I18nContext';
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { BlockLibrary } from './BlockLibrary';
import { SectionList } from './SectionList';
import { SettingsPanel } from './SettingsPanel';
import { TranslationPanel } from './TranslationPanel';
import { PageData } from '@/types/reactEditor';
import { DRAG_TYPES } from '@/types/grid';
import { Layers, LayoutGrid, Languages, PanelLeftClose, PanelRightClose, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReactEditorShortcuts } from '@/hooks/useReactEditorShortcuts';
import { 
  useEditorStore, 
  useSelectedSectionId, 
  useCanUndo, 
  useCanRedo,
  useDragContext,
  useEditorMode,
  usePageData,
} from '@/stores/editorStore';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { toast } from 'sonner';
import { getSectionDefinition } from '@/lib/sectionDefinitions.tsx';

// ============================================================================
// Props
// ============================================================================

interface ReactPageEditorProps {
  pageId: string;
  pageTitle: string;
  pageUrl: string;
  initialPageData: PageData | null;
  onSave?: (pageData: PageData) => Promise<void>;
  onClose: () => void;
  onUnsavedChange?: (hasUnsaved: boolean) => void;
}

// ============================================================================
// Left Panel Tab Switcher
// ============================================================================

interface LeftPanelProps {
  activeTab: 'sections' | 'blocks';
  onTabChange: (tab: 'sections' | 'blocks') => void;
  onCollapse: () => void;
}

function LeftPanel({ activeTab, onTabChange, onCollapse }: LeftPanelProps) {
  return (
    <div className="w-full h-full border-r bg-card flex flex-col min-w-0">
      {/* Tab Switcher */}
      <div className="flex border-b shrink-0">
        <button
          className={cn(
            'flex-1 p-2 text-xs font-medium flex items-center justify-center gap-1 transition-colors',
            activeTab === 'sections'
              ? 'bg-muted text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => onTabChange('sections')}
        >
          <Layers className="h-3 w-3" />
          Sections
        </button>
        <button
          className={cn(
            'flex-1 p-2 text-xs font-medium flex items-center justify-center gap-1 transition-colors',
            activeTab === 'blocks'
              ? 'bg-muted text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => onTabChange('blocks')}
        >
          <LayoutGrid className="h-3 w-3" />
          Blocks
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onCollapse}
          title="Collapse panel"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'sections' ? <SectionList /> : <BlockLibrary />}
      </div>
    </div>
  );
}

// ============================================================================
// Right Panel with Settings and Translations tabs
// ============================================================================

interface RightPanelProps {
  activeTab: 'settings' | 'translations';
  onTabChange: (tab: 'settings' | 'translations') => void;
  pageId: string;
  pageUrl: string;
  onCollapse: () => void;
}

function RightPanel({ activeTab, onTabChange, pageId, pageUrl, onCollapse }: RightPanelProps) {
  return (
    <div className="w-full h-full border-l bg-card flex flex-col min-w-0">
      {/* Tab Switcher */}
      <div className="flex border-b shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onCollapse}
          title="Collapse panel"
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
        <button
          className={cn(
            'flex-1 p-2 text-xs font-medium flex items-center justify-center gap-1 transition-colors',
            activeTab === 'settings'
              ? 'bg-muted text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => onTabChange('settings')}
        >
          Settings
        </button>
        <button
          className={cn(
            'flex-1 p-2 text-xs font-medium flex items-center justify-center gap-1 transition-colors',
            activeTab === 'translations'
              ? 'bg-muted text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => onTabChange('translations')}
        >
          <Languages className="h-3 w-3" />
          Translations
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden min-w-0">
        {activeTab === 'settings' ? (
          <SettingsPanel />
        ) : (
          <TranslationPanel pageId={pageId} pageUrl={pageUrl} />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Inner Content Component (to access context)
// ============================================================================

interface EditorContentProps {
  pageId: string;
  pageTitle: string;
  pageUrl: string;
  onClose: () => void;
}

function EditorContent({ pageId, pageTitle, pageUrl, onClose }: EditorContentProps) {
  const [leftTab, setLeftTab] = useState<'sections' | 'blocks'>('sections');
  const [rightTab, setRightTab] = useState<'settings' | 'translations'>('settings');
  
  // Panel refs for collapse/expand
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  
  // Get save function from save context
  const { savePageData } = useSaveContext();
  
  // Use Zustand selectors for state
  const selectedSectionId = useSelectedSectionId();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const pageData = usePageData();
  const dragContext = useDragContext();
  const editorMode = useEditorMode();
  
  // Get actions from store
  const { 
    undo, 
    redo, 
    deleteSection, 
    duplicateSection, 
    selectSection,
    addSection,
    startDrag,
    endDrag,
    setDragging,
  } = useEditorStore();

  // Handle preview - open page in new tab
  const handlePreview = useCallback(() => {
    window.open(pageUrl, '_blank');
  }, [pageUrl]);

  // Wire keyboard shortcuts
  useReactEditorShortcuts({
    onSave: savePageData,
    onUndo: undo,
    onRedo: redo,
    onDelete: () => {
      if (selectedSectionId) {
        deleteSection(selectedSectionId);
      }
    },
    onDuplicate: () => {
      if (selectedSectionId) {
        duplicateSection(selectedSectionId);
      }
    },
    onDeselect: () => selectSection(null),
    onPreview: handlePreview,
    onClose,
    selectedSectionId,
    canUndo,
    canRedo,
  });

  // ============================================================================
  // Root DndContext Setup - Handles block drags from library to canvas
  // ============================================================================
  
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // CRITICAL FIX: Disable DnD sensors during inline editing
  // This prevents the PointerSensor from intercepting events
  // that should go to the TipTap editor
  const activeSensors = useMemo(() => {
    if (editorMode === 'inline-editing') {
      return []; // No sensors = no DnD interference
    }
    return sensors;
  }, [editorMode, sensors]);

  // Custom collision detection
  const collisionDetection: CollisionDetection = useCallback((args) => {
    const currentDragContext = useEditorStore.getState().dragContext;
    const dragType = currentDragContext?.type;
    
    // For widgets, use pointer position within column bounds
    if (dragType === 'widget') {
      return pointerWithin(args);
    }
    
    // For columns, use rect intersection
    if (dragType === 'column') {
      return rectIntersection(args);
    }
    
    // For blocks dragging to canvas, use pointer within
    if (dragType === 'block') {
      return pointerWithin(args);
    }
    
    // For sections and legacy, use closest center
    return closestCenter(args);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as any;
    
    setActiveDragId(active.id);
    setDragging(true);
    
    console.log('[ReactPageEditor] Drag start:', { id: active.id, type: data?.type });
    
    // Handle BLOCK drags from library
    if (data?.type === DRAG_TYPES.BLOCK) {
      startDrag({
        type: 'block',
        sourceId: String(active.id),
        sectionId: '',
        blockType: data.blockType,
        blockDisplayName: data.displayName,
      });
      document.body.classList.add('is-dragging-block');
      return;
    }
    
    // Other drag types are handled by EditorCanvas
    // We need to forward these to the canvas's internal handling
    if (data?.type === 'item') {
      startDrag({
        type: 'element',
        sourceId: String(active.id),
        sectionId: data.sectionId,
        arrayPath: data.arrayPath,
        index: data.index,
      });
      document.body.classList.add('is-dragging-element');
    } else if (data?.type === DRAG_TYPES.WIDGET) {
      startDrag({
        type: 'widget',
        sourceId: String(active.id),
        sectionId: data.sectionId,
        columnId: data.columnId,
        widgetId: data.widgetId,
        index: data.index,
      });
      document.body.classList.add('is-dragging-element');
    } else if (data?.type === DRAG_TYPES.COLUMN) {
      startDrag({
        type: 'column',
        sourceId: String(active.id),
        sectionId: data.sectionId,
        columnId: data.columnId,
        index: data.index,
      });
      document.body.classList.add('is-dragging-element');
    } else if (data?.type === DRAG_TYPES.SECTION || data?.type === 'section') {
      startDrag({
        type: 'section',
        sourceId: String(active.id),
        sectionId: data.sectionId || String(active.id),
      });
    } else if (data?.type === 'element') {
      startDrag({
        type: 'element',
        sourceId: String(active.id),
        sectionId: data.sectionId,
        arrayPath: data.arrayPath,
        index: data.index,
      });
      document.body.classList.add('is-dragging-element');
    } else {
      // Default to section
      startDrag({
        type: 'section',
        sourceId: String(active.id),
        sectionId: String(active.id),
      });
    }
  }, [setDragging, startDrag]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    const currentDragContext = useEditorStore.getState().dragContext;
    
    // Only track drop target for block drags
    if (currentDragContext?.type === 'block' && over) {
      const overData = over.data.current as any;
      if (overData?.type === 'drop-zone') {
        setDropTargetIndex(overData.index);
      } else if (overData?.type === 'section' || overData?.type === DRAG_TYPES.SECTION) {
        // Dropped on a section - calculate insert position
        const sections = pageData?.sections || [];
        const sectionIndex = sections.findIndex(s => s.id === over.id);
        if (sectionIndex !== -1) {
          setDropTargetIndex(sectionIndex);
        }
      }
    }
  }, [pageData]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    // Capture context before clearing
    const currentDragContext = useEditorStore.getState().dragContext;
    
    // Reset local state
    setActiveDragId(null);
    setDropTargetIndex(null);
    setDragging(false);
    document.body.classList.remove('is-dragging-block', 'is-dragging-element');
    
    if (!currentDragContext) {
      endDrag();
      return;
    }
    
    console.log('[ReactPageEditor] Drag end:', {
      type: currentDragContext.type,
      over: over?.id,
      dropTargetIndex,
    });
    
    // Handle BLOCK drops from library to canvas
    if (currentDragContext.type === 'block' && currentDragContext.blockType) {
      if (over) {
        const overData = over.data.current as any;
        let insertIndex = pageData?.sections?.length ?? 0;
        
        if (overData?.type === 'drop-zone') {
          insertIndex = overData.index;
        } else if (overData?.type === 'section' || overData?.type === DRAG_TYPES.SECTION) {
          const sections = pageData?.sections || [];
          const sectionIndex = sections.findIndex(s => s.id === over.id);
          if (sectionIndex !== -1) {
            insertIndex = sectionIndex + 1; // Insert after the hovered section
          }
        } else if (overData?.type === 'canvas-empty') {
          insertIndex = 0;
        }
        
        console.log('[ReactPageEditor] Creating section from block drop:', {
          blockType: currentDragContext.blockType,
          insertIndex,
        });
        
        addSection(currentDragContext.blockType as any, insertIndex);
        
        const definition = getSectionDefinition(currentDragContext.blockType as any);
        toast.success(`${definition?.displayName || 'Section'} added`);
      }
      
      endDrag();
      return;
    }
    
    // For non-block drags, we need to handle them inline since EditorCanvas
    // no longer has its own DndContext
    if (!over) {
      endDrag();
      return;
    }
    
    const activeData = active.data.current as any;
    const overData = over.data.current as any;
    
    // Handle SECTION reordering
    if (currentDragContext.type === 'section') {
      if (active.id !== over.id && pageData) {
        const oldIndex = pageData.sections.findIndex(s => s.id === active.id);
        const newIndex = pageData.sections.findIndex(s => s.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          useEditorStore.getState().reorderSections(oldIndex, newIndex);
        }
      }
      endDrag();
      return;
    }
    
    // Handle COLUMN reordering
    if (currentDragContext.type === 'column') {
      if (active.id !== over.id && currentDragContext.sectionId) {
        const sourceIndex = activeData?.index ?? 0;
        const destIndex = overData?.index ?? 0;
        useEditorStore.getState().reorderColumn(currentDragContext.sectionId, sourceIndex, destIndex);
      }
      endDrag();
      return;
    }
    
    // Handle WIDGET reordering/moving
    if (currentDragContext.type === 'widget') {
      const sourceColumnId = currentDragContext.columnId!;
      const sourceIndex = currentDragContext.index ?? 0;
      
      if (overData?.type === DRAG_TYPES.COLUMN) {
        const destColumnId = overData.columnId;
        if (sourceColumnId === destColumnId) {
          useEditorStore.getState().reorderWidgetInColumn(
            currentDragContext.sectionId,
            sourceColumnId,
            sourceIndex,
            0
          );
        } else {
          useEditorStore.getState().moveWidgetBetweenColumns(
            currentDragContext.sectionId,
            sourceColumnId,
            sourceIndex,
            destColumnId,
            0
          );
        }
      } else if (overData?.type === DRAG_TYPES.WIDGET) {
        const destColumnId = overData.columnId;
        const destIndex = overData.index;
        if (sourceColumnId === destColumnId) {
          useEditorStore.getState().reorderWidgetInColumn(
            currentDragContext.sectionId,
            sourceColumnId,
            sourceIndex,
            destIndex
          );
        } else {
          useEditorStore.getState().moveWidgetBetweenColumns(
            currentDragContext.sectionId,
            sourceColumnId,
            sourceIndex,
            destColumnId,
            destIndex
          );
        }
      }
      endDrag();
      return;
    }
    
    // Handle legacy ELEMENT reordering
    if (currentDragContext.type === 'element') {
      if (overData?.type === 'item' || overData?.type === 'element') {
        const isSameSection = currentDragContext.sectionId === overData.sectionId;
        const isSameArray = currentDragContext.arrayPath === overData.arrayPath;
        
        if (isSameSection && isSameArray && currentDragContext.arrayPath && currentDragContext.index !== undefined) {
          useEditorStore.getState().reorderArrayItem(
            currentDragContext.sectionId,
            currentDragContext.arrayPath,
            currentDragContext.index,
            overData.index
          );
        } else if (currentDragContext.arrayPath && currentDragContext.index !== undefined) {
          useEditorStore.getState().moveArrayItemBetweenSections(
            currentDragContext.sectionId,
            currentDragContext.arrayPath,
            currentDragContext.index,
            overData.sectionId,
            overData.arrayPath,
            overData.index
          );
        }
      } else if (overData?.type === 'container') {
        const isSameSection = currentDragContext.sectionId === overData.sectionId;
        const isSameArray = currentDragContext.arrayPath === overData.arrayPath;
        
        if ((!isSameSection || !isSameArray) && currentDragContext.arrayPath && currentDragContext.index !== undefined) {
          useEditorStore.getState().moveArrayItemBetweenSections(
            currentDragContext.sectionId,
            currentDragContext.arrayPath,
            currentDragContext.index,
            overData.sectionId,
            overData.arrayPath,
            0
          );
        }
      }
    }
    
    endDrag();
  }, [pageData, dropTargetIndex, addSection, endDrag, setDragging]);

  const handleDragCancel = useCallback(() => {
    setActiveDragId(null);
    setDropTargetIndex(null);
    setDragging(false);
    document.body.classList.remove('is-dragging-block', 'is-dragging-element');
    
    // Only call endDrag if we were actually dragging (prevents clearing inline-editing mode)
    const currentDragContext = useEditorStore.getState().dragContext;
    if (currentDragContext) {
      endDrag();
    }
  }, [setDragging, endDrag]);

  // Get info for drag overlay
  const getBlockDragOverlay = () => {
    if (dragContext?.type !== 'block' || !dragContext.blockType) return null;
    
    const definition = getSectionDefinition(dragContext.blockType as any);
    if (!definition) return null;
    
    const Icon = definition.icon;
    
    return (
      <div className={cn(
        'bg-background/95 backdrop-blur-sm shadow-2xl rounded-xl p-4',
        'border-2 border-primary',
        'flex items-center gap-3 min-w-[200px]',
        'animate-in zoom-in-95 duration-150'
      )}>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">{definition.displayName}</p>
          <p className="text-xs text-muted-foreground">Drop to insert section</p>
        </div>
      </div>
    );
  };

  return (
    <DndContext
      sensors={activeSensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div className="h-screen flex flex-col bg-background">
        {/* Top Toolbar */}
        <EditorToolbar
          pageTitle={pageTitle}
          pageUrl={pageUrl}
          onClose={onClose}
          onPreview={handlePreview}
        />

        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
          {/* Left Panel - Sections / Blocks */}
          <ResizablePanel 
            ref={leftPanelRef}
            defaultSize={18} 
            minSize={12} 
            maxSize={25}
            collapsible
            collapsedSize={0}
            onCollapse={() => setLeftCollapsed(true)}
            onExpand={() => setLeftCollapsed(false)}
          >
            <LeftPanel 
              activeTab={leftTab} 
              onTabChange={setLeftTab} 
              onCollapse={() => leftPanelRef.current?.collapse()}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Center - Canvas */}
          <ResizablePanel defaultSize={54} minSize={30} className="relative">
            <EditorCanvas isDraggingBlock={dragContext?.type === 'block'} />
            
            {/* Floating expand buttons when panels are collapsed */}
            {leftCollapsed && (
              <Button
                variant="outline"
                size="sm"
                className="absolute left-2 top-2 z-50 h-8 shadow-md"
                onClick={() => leftPanelRef.current?.expand()}
              >
                <Layers className="h-4 w-4 mr-1" />
                Sections
              </Button>
            )}
            {rightCollapsed && (
              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-2 z-50 h-8 shadow-md"
                onClick={() => rightPanelRef.current?.expand()}
              >
                Settings
                <Languages className="h-4 w-4 ml-1" />
              </Button>
            )}
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Settings / Translations */}
          <ResizablePanel 
            ref={rightPanelRef}
            defaultSize={28} 
            minSize={18} 
            maxSize={40}
            collapsible
            collapsedSize={0}
            onCollapse={() => setRightCollapsed(true)}
            onExpand={() => setRightCollapsed(false)}
          >
            <RightPanel 
              activeTab={rightTab} 
              onTabChange={setRightTab} 
              pageId={pageId}
              pageUrl={pageUrl}
              onCollapse={() => rightPanelRef.current?.collapse()}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Global Drag Overlay */}
      <DragOverlay 
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
      >
        {dragContext?.type === 'block' && getBlockDragOverlay()}
      </DragOverlay>
    </DndContext>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ReactPageEditor({
  pageId,
  pageTitle,
  pageUrl,
  initialPageData,
  onSave,
  onClose,
  onUnsavedChange,
}: ReactPageEditorProps) {
  // Get current language from I18n context for translation preview
  const { currentLanguage } = useI18n();
  
  return (
    <EditorProvider
      pageId={pageId}
      pageUrl={pageUrl}
      initialPageData={initialPageData}
      onSave={onSave}
      onUnsavedChange={onUnsavedChange}
    >
      <TranslationEngineProvider 
        pageId={pageId} 
        pageUrl={pageUrl}
        targetLanguageCode={currentLanguage?.code || 'en'}
      >
        <EditorContent
          pageId={pageId}
          pageTitle={pageTitle}
          pageUrl={pageUrl}
          onClose={onClose}
        />
      </TranslationEngineProvider>
    </EditorProvider>
  );
}

export default ReactPageEditor;
