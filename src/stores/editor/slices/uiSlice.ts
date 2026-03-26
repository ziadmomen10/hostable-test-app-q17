/**
 * UI Slice
 * 
 * Handles UI state including device mode, tabs, and editor mode.
 */

import { StateCreator } from 'zustand';
import type { 
  EditorStoreState, 
  UIActions, 
  UIState,
  DragContext,
  ResizeContext,
  DropTarget,
  EditorMode 
} from '../types';

// ============================================================================
// Types
// ============================================================================

export type { 
  EditorMode, 
  DragContext, 
  ResizeContext, 
  DropTarget, 
  UIState, 
  UIActions 
} from '../types';

// Combined store type for cross-slice access
type CombinedStore = EditorStoreState & UIActions;

// ============================================================================
// Initial State
// ============================================================================

export const initialUIState: UIState = {
  deviceMode: 'desktop',
  activeTab: 'sections',
  isDragging: false,
  editorMode: 'idle',
  dragContext: null,
  resizeContext: null,
  dropTarget: null,
};

// ============================================================================
// Slice Creator
// ============================================================================

export const createUISlice: StateCreator<
  CombinedStore,
  [['zustand/devtools', never], ['zustand/subscribeWithSelector', never]],
  [],
  UIActions
> = (set, get) => ({
  setDeviceMode: (mode) => set({ deviceMode: mode }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setDragging: (isDragging) => set({ isDragging }),

  setEditorMode: (mode) => {
    const { editorMode, dragContext, resizeContext } = get();
    if (editorMode === mode) return;
    set({
      editorMode: mode,
      dragContext: mode === 'dragging' ? dragContext : null,
      resizeContext: mode === 'resizing' ? resizeContext : null,
    });
  },

  startDrag: (context) => set({
    editorMode: 'dragging',
    dragContext: context,
  }),

  endDrag: () => {
    const { editorMode } = get();
    // Preserve inline-editing mode - don't let drag cleanup interrupt it
    if (editorMode === 'inline-editing') {
      set({
        dragContext: null,
        dropTarget: null,
      });
    } else {
      set({
        editorMode: 'idle',
        dragContext: null,
        dropTarget: null,
      });
    }
  },

  setDropTarget: (target) => set({ dropTarget: target }),

  startResize: (context) => set({
    editorMode: 'resizing',
    resizeContext: context,
  }),

  endResize: () => set({
    editorMode: 'idle',
    resizeContext: null,
  }),
});
