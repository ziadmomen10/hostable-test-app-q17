/**
 * History Slice
 * 
 * Handles undo/redo functionality for the editor.
 */

import { StateCreator } from 'zustand';
import { logger } from '@/lib/logger';
import type { EditorStoreState, HistoryActions, HistoryState } from '../types';

// ============================================================================
// Types
// ============================================================================

export type { HistoryState, HistoryActions } from '../types';

// Combined store type for cross-slice access
type CombinedStore = EditorStoreState & HistoryActions;

// ============================================================================
// Constants
// ============================================================================

const MAX_HISTORY_SIZE = 50;

// ============================================================================
// Initial State
// ============================================================================

export const initialHistoryState: HistoryState = {
  history: [],
  historyIndex: -1,
};

// ============================================================================
// Slice Creator
// ============================================================================

export const createHistorySlice: StateCreator<
  CombinedStore,
  [['zustand/devtools', never], ['zustand/subscribeWithSelector', never]],
  [],
  HistoryActions
> = (set, get) => ({
  pushHistory: () => {
    const { pageData, history, historyIndex } = get();
    if (!pageData) return;

    // Truncate any future states if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    
    // Add current state as deep clone
    newHistory.push(JSON.parse(JSON.stringify(pageData)));

    // Limit history size
    if (newHistory.length > MAX_HISTORY_SIZE) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex, sectionVersions } = get();
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const previousState = JSON.parse(JSON.stringify(history[newIndex]));

    // Increment versions for all sections to force re-render
    const newVersions = { ...sectionVersions };
    previousState.sections.forEach((s: any) => {
      newVersions[s.id] = (newVersions[s.id] || 0) + 1;
    });

    logger.editor.debug('undo:', { from: historyIndex, to: newIndex });

    set({
      pageData: previousState,
      historyIndex: newIndex,
      sectionVersions: newVersions,
      hasUnsavedChanges: true,
    });
  },

  redo: () => {
    const { history, historyIndex, sectionVersions } = get();
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const nextState = JSON.parse(JSON.stringify(history[newIndex]));

    // Increment versions for all sections to force re-render
    const newVersions = { ...sectionVersions };
    nextState.sections.forEach((s: any) => {
      newVersions[s.id] = (newVersions[s.id] || 0) + 1;
    });

    logger.editor.debug('redo:', { from: historyIndex, to: newIndex });

    set({
      pageData: nextState,
      historyIndex: newIndex,
      sectionVersions: newVersions,
      hasUnsavedChanges: true,
    });
  },
});
