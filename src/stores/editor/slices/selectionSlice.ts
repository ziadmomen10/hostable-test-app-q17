/**
 * Selection Slice
 * 
 * Handles selection and hover state for the editor.
 */

import { StateCreator } from 'zustand';
import type { 
  EditorStoreState, 
  SelectionActions, 
  SelectionState,
  ElementSelection 
} from '../types';

// ============================================================================
// Types
// ============================================================================

export type { 
  SelectionType, 
  ElementSelection, 
  HoveredElement, 
  SelectionState, 
  SelectionActions 
} from '../types';

// Combined store type for cross-slice access
type CombinedStore = EditorStoreState & SelectionActions;

// ============================================================================
// Initial State
// ============================================================================

export const initialSelection: ElementSelection = {
  type: 'none',
  sectionId: null,
  columnId: null,
  elementPath: null,
  isInlineEditing: false,
};

export const initialSelectionState: SelectionState = {
  selection: initialSelection,
  selectedSectionId: null,
  hoveredElement: null,
};

// ============================================================================
// Slice Creator
// ============================================================================

export const createSelectionSlice: StateCreator<
  CombinedStore,
  [['zustand/devtools', never], ['zustand/subscribeWithSelector', never]],
  [],
  SelectionActions
> = (set, get) => ({
  selectSection: (sectionId) => set({
    selectedSectionId: sectionId,
    selection: {
      type: sectionId ? 'section' : 'none',
      sectionId,
      columnId: null,
      elementPath: null,
      isInlineEditing: false,
    },
  }),

  selectColumn: (sectionId, columnId) => set({
    selectedSectionId: sectionId,
    selection: {
      type: 'column',
      sectionId,
      columnId,
      elementPath: null,
      isInlineEditing: false,
    },
  }),

  selectElement: (sectionId, elementPath) => {
    const { pageData } = get();
    const section = pageData?.sections.find((s) => s.id === sectionId);
    const translationKey = section?.translationKeys?.[elementPath];

    set({
      selectedSectionId: sectionId,
      selection: {
        type: 'element',
        sectionId,
        columnId: null,
        elementPath,
        isInlineEditing: false,
        translationKey,
      },
    });
  },

  clearSelection: () => set({
    selectedSectionId: null,
    selection: initialSelection,
  }),

  startInlineEdit: () => {
    const { selection } = get();
    if (selection.type === 'element' && selection.sectionId && selection.elementPath) {
      set({
        selection: { ...selection, isInlineEditing: true },
        editorMode: 'inline-editing',
      });
    }
  },

  stopInlineEdit: () => {
    const { selection } = get();
    if (selection.isInlineEditing) {
      set({
        selection: { ...selection, isInlineEditing: false },
        editorMode: 'idle',
      });
    }
  },

  setHoveredElement: (sectionId, elementPath) => {
    if (sectionId && elementPath) {
      set({ hoveredElement: { sectionId, elementPath } });
    } else {
      set({ hoveredElement: null });
    }
  },
});
