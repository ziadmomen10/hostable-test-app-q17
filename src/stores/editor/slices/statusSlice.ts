/**
 * Status Slice
 * 
 * Handles loading, saving, and autosave status.
 */

import { StateCreator } from 'zustand';
import type { EditorStoreState, StatusActions, StatusState } from '../types';

// ============================================================================
// Types
// ============================================================================

export type { StatusState, StatusActions } from '../types';

// Combined store type for cross-slice access
type CombinedStore = EditorStoreState & StatusActions;

// ============================================================================
// Initial State
// ============================================================================

export const initialStatusState: StatusState = {
  isLoading: true,
  isSaving: false,
  hasUnsavedChanges: false,
  requiresImmediateSave: false,
  autosaveStatus: 'idle',
  lastSavedAt: null,
};

// ============================================================================
// Slice Creator
// ============================================================================

export const createStatusSlice: StateCreator<
  CombinedStore,
  [['zustand/devtools', never], ['zustand/subscribeWithSelector', never]],
  [],
  StatusActions
> = (set) => ({
  setLoading: (isLoading) => set({ isLoading }),
  setSaving: (isSaving) => set({ isSaving }),
  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
  setAutosaveStatus: (status) => set({ autosaveStatus: status }),
  setLastSavedAt: (timestamp) => set({ lastSavedAt: timestamp }),
  markSaved: () => set({
    hasUnsavedChanges: false,
    isSaving: false,
    autosaveStatus: 'saved',
    lastSavedAt: new Date().toISOString(),
  }),
});
