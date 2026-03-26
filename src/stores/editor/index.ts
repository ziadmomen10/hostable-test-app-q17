/**
 * Editor Store - Barrel Export
 * 
 * Re-exports all types and utilities from the editor store module.
 * The main store implementation remains in editorStore.ts for now.
 * 
 * This structure allows incremental migration to slice-based architecture.
 */

// Types
export * from './types';

// Helpers
export * from './helpers';

// Initial State
export * from './initialState';

// Slices - export only the slice creators (types are already exported above)
export {
  createDocumentSlice,
  createGridSlice,
  createHistorySlice,
  createSelectionSlice,
  createUISlice,
  createStatusSlice,
} from './slices';
