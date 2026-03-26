/**
 * EditorProvider
 * 
 * THIN INITIALIZATION WRAPPER that:
 * 1. Initializes the Zustand store with page data
 * 2. Sets up autosave subscription via useAutosave service
 * 3. Provides backward-compatible context for gradual migration
 * 
 * Phase 1 Migration: All document state is now in Zustand store.
 * This provider delegates all operations to useEditorStore.
 * 
 * Phase 3: Autosave logic extracted to services/autosaveService.ts
 */

import React, { createContext, useContext, useCallback, useMemo, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { 
  useEditorStore,
  usePageData,
  useSelectedSection as useSelectedSectionFromStore,
  useSelectedElementValue as useSelectedElementValueFromStore,
} from '@/stores/editorStore';
import useAutoKeyGeneration from '@/hooks/useAutoKeyGeneration';
import { useAutosave } from '@/services/autosaveService';
import {
  PageData,
  AutosaveStatus,
  ReactEditorState,
} from '@/types/reactEditor';
import { SectionType } from '@/types/pageEditor';
import { registerDocumentInstance, unregisterDocumentInstance } from '@/lib/editorApi';

// ============================================================================
// Element Position Type
// ============================================================================

interface ElementPosition {
  offsetX?: number;
  offsetY?: number;
  width?: string;
  height?: string;
  rotation?: number;
}

// ============================================================================
// Legacy Context Interface (backward compatibility)
// ============================================================================

export interface ExtendedEditorContextValue {
  // Legacy state object (reads from Zustand)
  state: ReactEditorState;
  dispatch: React.Dispatch<any>; // Deprecated - use store actions instead
  
  // Section-level methods (delegate to store)
  selectSection: (sectionId: string | null) => void;
  updateSectionProps: (sectionId: string, props: Record<string, any>) => void;
  addSection: (type: SectionType, index?: number) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (sourceIndex: number, destinationIndex: number) => void;
  duplicateSection: (sectionId: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  
  // Element-level methods
  updateElementValue: (sectionId: string, elementPath: string, value: any) => void;
  updateElementPosition: (sectionId: string, elementPath: string, position: ElementPosition) => void;
  reorderArrayItem: (sectionId: string, arrayPath: string, sourceIndex: number, destinationIndex: number) => void;
  moveArrayItemBetweenSections: (sourceSectionId: string, sourceArrayPath: string, sourceIndex: number, targetSectionId: string, targetArrayPath: string, targetIndex: number) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Save
  savePageData: () => Promise<void>;
  
  // Status
  autosaveStatus: AutosaveStatus;
  lastSavedAt: string | null;
}

// ============================================================================
// Context
// ============================================================================

const EditorContext = createContext<ExtendedEditorContextValue | null>(null);

// Save Context - minimal context for save function only
interface SaveContextValue {
  savePageData: () => Promise<void>;
}
const SaveContext = createContext<SaveContextValue | null>(null);

export function useEditorContext(): ExtendedEditorContextValue {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
}

export function useSaveContext(): SaveContextValue {
  const context = useContext(SaveContext);
  if (!context) {
    // During HMR, context can become stale. Provide a safe fallback.
    console.warn('[useSaveContext] Context not available - returning noop. This may happen during HMR.');
    return {
      savePageData: async () => {
        console.warn('[useSaveContext] savePageData called without provider context');
      }
    };
  }
  return context;
}

// ============================================================================
// Selector Hooks (delegate to Zustand store)
// ============================================================================

export function useSelectedSection() {
  return useSelectedSectionFromStore();
}

export function useSelectedElementValue() {
  return useSelectedElementValueFromStore();
}

// ============================================================================
// Provider Props
// ============================================================================

interface EditorProviderProps {
  pageId: string;
  pageUrl: string;
  initialPageData?: PageData | null;
  onSave?: (pageData: PageData) => Promise<void>;
  onUnsavedChange?: (hasUnsaved: boolean) => void;
  children: React.ReactNode;
}

// ============================================================================
// Provider Component
// ============================================================================

export function EditorProvider({
  pageId,
  pageUrl,
  initialPageData,
  onSave,
  onUnsavedChange,
  children,
}: EditorProviderProps) {
  const instanceIdRef = useRef<string>(`editor-${pageId}-${Date.now()}`);
  const hasInitializedRef = useRef(false);
  
  console.log('[EditorProvider] Mounting with:', {
    pageId,
    instanceId: instanceIdRef.current,
    hasInitialData: !!initialPageData,
    sectionsCount: initialPageData?.sections?.length ?? 0,
  });

  // Get store actions
  const store = useEditorStore();
  
  // Use extracted autosave service
  const { saveNow } = useAutosave({ 
    pageId, 
    onSave,
    debounceMs: 2000,
  });
  
  // Auto-generate translation keys when editor loads and sections change
  useAutoKeyGeneration({
    pageId,
    pageUrl,
    sections: store.pageData?.sections || [],
    originalSections: store.originalPageData?.sections,
    enabled: !!store.pageData,
  });
  
  const { initializeEditor, pushHistory } = store;
  
  // Initialize store ONCE on mount only - prevents re-initialization from overwriting mutations
  useEffect(() => {
    if (!hasInitializedRef.current) {
      console.log('[EditorProvider] Initializing store (ONCE)', { pageId });
      initializeEditor(pageId, initialPageData || null);
      registerDocumentInstance(instanceIdRef.current, initialPageData);
      hasInitializedRef.current = true;
    }
    
    return () => {
      unregisterDocumentInstance(instanceIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - run once on mount only

  // Register document on pageData changes
  useEffect(() => {
    if (store.pageData) {
      registerDocumentInstance(instanceIdRef.current, store.pageData);
    }
  }, [store.pageData]);

  // History tracking
  const prevPageDataRef = useRef<string>('');
  
  useEffect(() => {
    if (!store.pageData) return;
    const currentSnapshot = JSON.stringify(store.pageData.sections);
    if (prevPageDataRef.current && prevPageDataRef.current !== currentSnapshot) {
      const timeout = setTimeout(() => {
        pushHistory();
      }, 500);
      return () => clearTimeout(timeout);
    }
    prevPageDataRef.current = currentSnapshot;
  }, [store.pageData?.sections, pushHistory]);

  // Initialize history
  useEffect(() => {
    if (initialPageData && store.history.length === 0) {
      pushHistory();
    }
  }, [initialPageData, store.history.length, pushHistory]);

  // Notify parent of unsaved changes
  const prevHasUnsavedRef = useRef<boolean>(false);
  useEffect(() => {
    if (store.hasUnsavedChanges !== prevHasUnsavedRef.current) {
      prevHasUnsavedRef.current = store.hasUnsavedChanges;
      onUnsavedChange?.(store.hasUnsavedChanges);
    }
  }, [store.hasUnsavedChanges, onUnsavedChange]);

  // Manual save function (wraps autosave service)
  const savePageData = useCallback(async () => {
    const success = await saveNow();
    if (success) {
      toast.success('Page saved successfully');
    } else {
      toast.error('Failed to save page. Check your permissions.');
    }
  }, [saveNow]);

  // Build legacy state object from Zustand
  const legacyState = useMemo<ReactEditorState>(() => ({
    pageData: store.pageData,
    selectedSectionId: store.selectedSectionId,
    deviceMode: store.deviceMode,
    isDragging: store.isDragging,
    activeTab: store.activeTab,
    isLoading: store.isLoading,
    isSaving: store.isSaving,
    hasUnsavedChanges: store.hasUnsavedChanges,
    autosaveStatus: store.autosaveStatus,
    lastSavedAt: store.lastSavedAt,
    history: store.history,
    historyIndex: store.historyIndex,
  }), [
    store.pageData,
    store.selectedSectionId,
    store.deviceMode,
    store.isDragging,
    store.activeTab,
    store.isLoading,
    store.isSaving,
    store.hasUnsavedChanges,
    store.autosaveStatus,
    store.lastSavedAt,
    store.history,
    store.historyIndex,
  ]);

  // Legacy dispatch (deprecated but kept for compatibility)
  const legacyDispatch = useCallback((action: any) => {
    console.warn('[EditorProvider] dispatch() is deprecated. Use store actions directly.');
    // Handle legacy actions by delegating to store
    switch (action.type) {
      case 'SET_DEVICE_MODE':
        store.setDeviceMode(action.payload);
        break;
      case 'SET_ACTIVE_TAB':
        store.setActiveTab(action.payload);
        break;
      case 'SET_DRAGGING':
        store.setDragging(action.payload);
        break;
      case 'SELECT_SECTION':
        store.selectSection(action.payload);
        break;
      case 'SET_TRANSLATION_KEY':
        store.setTranslationKey(action.payload.sectionId, action.payload.propPath, action.payload.translationKey);
        break;
      case 'REMOVE_TRANSLATION_KEY':
        store.removeTranslationKey(action.payload.sectionId, action.payload.propPath);
        break;
      default:
        console.warn('[EditorProvider] Unhandled legacy action:', action.type);
    }
  }, [store]);

  // Context value - delegates to store
  const contextValue = useMemo<ExtendedEditorContextValue>(() => ({
    state: legacyState,
    dispatch: legacyDispatch,
    
    // Section methods - delegate to store
    selectSection: store.selectSection,
    updateSectionProps: store.updateSectionProps,
    addSection: (type: SectionType, index?: number) => {
      store.addSection(type, index);
      toast.success(`${type} section added`);
    },
    deleteSection: (sectionId: string) => {
      store.deleteSection(sectionId);
      toast.success('Section deleted');
    },
    reorderSections: store.reorderSections,
    duplicateSection: (sectionId: string) => {
      store.duplicateSection(sectionId);
      toast.success('Section duplicated');
    },
    toggleSectionVisibility: store.toggleSectionVisibility,
    
    // Element methods - delegate to store
    updateElementValue: store.updateElementValue,
    updateElementPosition: store.updateElementPosition,
    reorderArrayItem: store.reorderArrayItem,
    moveArrayItemBetweenSections: store.moveArrayItemBetweenSections,
    
    // History
    undo: store.undo,
    redo: store.redo,
    canUndo: store.historyIndex > 0,
    canRedo: store.historyIndex < store.history.length - 1,
    
    // Save
    savePageData,
    
    // Status
    autosaveStatus: store.autosaveStatus,
    lastSavedAt: store.lastSavedAt,
  }), [
    legacyState,
    legacyDispatch,
    store,
    savePageData,
  ]);

  const saveContextValue = useMemo<SaveContextValue>(() => ({
    savePageData,
  }), [savePageData]);

  return (
    <EditorContext.Provider value={contextValue}>
      <SaveContext.Provider value={saveContextValue}>
        {children}
      </SaveContext.Provider>
    </EditorContext.Provider>
  );
}
