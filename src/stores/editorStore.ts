/**
 * Editor Store (Zustand)
 * 
 * SINGLE SOURCE OF TRUTH for all editor state. Composed from domain-specific slices:
 * 
 * - documentSlice: Section CRUD, element updates, translation keys
 * - gridSlice: Elementor-style grid operations (columns, widgets)
 * - historySlice: Undo/redo history management
 * - selectionSlice: Selection model, hover state
 * - uiSlice: Device mode, tabs, drag/resize modes
 * - statusSlice: Loading, saving, autosave status
 * 
 * Phase 7 Migration: Actions are now implemented in slices, this file composes them.
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import type { SectionInstance } from '@/types/reactEditor';
import type { EditorStoreState, EditorStoreActions } from './editor/types';
import { initialState } from './editor/initialState';
// Import directly from slice files to avoid circular dependency via barrel export
import { createDocumentSlice } from './editor/slices/documentSlice';
import { createGridSlice } from './editor/slices/gridSlice';
import { createHistorySlice } from './editor/slices/historySlice';
import { createSelectionSlice } from './editor/slices/selectionSlice';
import { createUISlice } from './editor/slices/uiSlice';
import { createStatusSlice } from './editor/slices/statusSlice';

// ============================================================================
// Store - Composed from Slices
// ============================================================================

export const useEditorStore = create<EditorStoreState & EditorStoreActions>()(
  devtools(
    subscribeWithSelector((...a) => ({
      ...initialState,
      ...createDocumentSlice(...a),
      ...createGridSlice(...a),
      ...createHistorySlice(...a),
      ...createSelectionSlice(...a),
      ...createUISlice(...a),
      ...createStatusSlice(...a),
    })),
    { name: 'editor-store' }
  )
);

// ============================================================================
// Type Re-exports (Backward Compatibility)
// ============================================================================

export type {
  SelectionType,
  ElementSelection,
  HoveredElement,
  EditorMode,
  DragContext,
  ResizeContext,
  DropTarget,
  EditorStoreState,
  EditorStoreActions,
} from './editor/types';

// ============================================================================
// Selector Hooks
// ============================================================================

// Core state selectors
export const usePageData = () => useEditorStore(state => state.pageData);
export const useSelection = () => useEditorStore(state => state.selection);
export const useSelectedSectionId = () => useEditorStore(state => state.selectedSectionId);
export const useHoveredElement = () => useEditorStore(state => state.hoveredElement);
export const useEditorMode = () => useEditorStore(state => state.editorMode);
export const useDragContext = () => useEditorStore(state => state.dragContext);
export const useResizeContext = () => useEditorStore(state => state.resizeContext);
export const useDropTarget = () => useEditorStore(state => state.dropTarget);

// UI state selectors
export const useDeviceMode = () => useEditorStore(state => state.deviceMode);
export const useActiveTab = () => useEditorStore(state => state.activeTab);
export const useIsDragging = () => useEditorStore(state => state.editorMode === 'dragging');
export const useIsResizing = () => useEditorStore(state => state.editorMode === 'resizing');

// Status selectors
export const useIsLoading = () => useEditorStore(state => state.isLoading);
export const useIsSaving = () => useEditorStore(state => state.isSaving);
export const useHasUnsavedChanges = () => useEditorStore(state => state.hasUnsavedChanges);
export const useAutosaveStatus = () => useEditorStore(state => state.autosaveStatus);
export const useLastSavedAt = () => useEditorStore(state => state.lastSavedAt);

// History selectors
export const useHistory = () => useEditorStore(state => state.history);
export const useHistoryIndex = () => useEditorStore(state => state.historyIndex);
export const useCanUndo = () => useEditorStore(state => state.historyIndex > 0);
export const useCanRedo = () => useEditorStore(state => state.historyIndex < state.history.length - 1);

// Get section by ID - fetches fresh data from store
export const useSectionById = (sectionId: string) => {
  return useEditorStore(
    state => state.pageData?.sections.find(s => s.id === sectionId) || null
  );
};

// Get selected section object - GUARANTEED REACTIVE
// Uses primitive-trigger pattern: subscribe to primitives, then read fresh data
export const useSelectedSection = () => {
  // Subscribe to sectionId and version (primitives = guaranteed re-render)
  const sectionId = useEditorStore(state => state.selection.sectionId);
  const version = useEditorStore(state => 
    state.selection.sectionId ? state.sectionVersions[state.selection.sectionId] || 0 : 0
  );
  
  // Read fresh section from store snapshot on every render
  if (!sectionId) return null;
  return useEditorStore.getState().pageData?.sections.find(s => s.id === sectionId) || null;
};

// Get selected section WITH version - GUARANTEED REACTIVE for SettingsPanel
export function useSelectedSectionWithVersion() {
  // Subscribe to sectionId and version (primitives = guaranteed re-render)
  const sectionId = useEditorStore(state => state.selection.sectionId);
  const version = useEditorStore(state => 
    state.selection.sectionId ? state.sectionVersions[state.selection.sectionId] || 0 : 0
  );
  
  // Read fresh section from store snapshot
  if (!sectionId) return { section: null, version: 0 };
  const section = useEditorStore.getState().pageData?.sections.find(s => s.id === sectionId) || null;
  return { section, version };
}

// Get selected element value
export function getNestedValueFromProps(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

export const useSelectedElementValue = () => {
  const section = useSelectedSection();
  const selection = useEditorStore(state => state.selection);
  if (!section || !selection.elementPath) return null;
  return getNestedValueFromProps(section.props, selection.elementPath);
};

// Get selected column object - ATOMIC read
export const useSelectedColumn = () => {
  return useEditorStore(
    useShallow((state) => {
      if (!state.pageData || state.selection.type !== 'column' || !state.selection.sectionId || !state.selection.columnId) {
        return null;
      }
      const section = state.pageData.sections.find(s => s.id === state.selection.sectionId);
      if (!section?.grid) return null;
      return section.grid.columns.find(c => c.id === state.selection.columnId) || null;
    })
  );
};

// Get selected column index - ATOMIC read
export const useSelectedColumnIndex = () => {
  return useEditorStore(
    useShallow((state) => {
      if (!state.pageData || state.selection.type !== 'column' || !state.selection.sectionId || !state.selection.columnId) {
        return -1;
      }
      const section = state.pageData.sections.find(s => s.id === state.selection.sectionId);
      if (!section?.grid) return -1;
      return section.grid.columns.findIndex(c => c.id === state.selection.columnId);
    })
  );
};

// ============================================================================
// Section Version Selector (for canvas re-renders)
// ============================================================================

/**
 * Get the version number for a section.
 * Increments every time section props change, used to force React re-renders.
 */
export const useSectionVersion = (sectionId: string) =>
  useEditorStore(state => state.sectionVersions[sectionId] || 0);

/**
 * ATOMIC hook: Get section AND version together in one subscription.
 * This prevents race conditions where section and version update at different times.
 * Uses useShallow for efficient shallow comparison (Zustand v5 syntax).
 * 
 * NOTE: May have edge cases with complex nested objects - prefer useSectionByIdFresh for canvas.
 */
export function useSectionWithVersion(sectionId: string) {
  return useEditorStore(
    useShallow((state) => ({
      section: state.pageData?.sections.find(s => s.id === sectionId) || null,
      version: state.sectionVersions[sectionId] || 0,
    }))
  );
}

/**
 * GUARANTEED REACTIVE SECTION HOOK
 * 
 * Pattern: Version (primitive) triggers re-render → getState() reads fresh section
 * 
 * Why this works:
 * 1. Version is a primitive - Zustand ALWAYS re-renders when primitives change
 * 2. getState() reads from the store snapshot, not from a selector result
 * 3. Combined: version change → component re-renders → reads fresh section
 * 
 * Previous useShallow approach failed because it compared object references
 * and sometimes returned stale data due to React batching.
 */
export function useSectionByIdFresh(sectionId: string): { section: SectionInstance | null; version: number } {
  // Step 1: Subscribe to VERSION only (primitive = guaranteed re-render on change)
  const version = useEditorStore(state => state.sectionVersions[sectionId] || 0);
  
  // Step 2: On every render (triggered by version change), read FRESH section from store
  const section = useEditorStore.getState().pageData?.sections.find(s => s.id === sectionId) || null;
  
  return { section, version };
}
