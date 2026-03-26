/**
 * Editor Store Slices - Barrel Export
 * 
 * Exports all slice creators, initial states, and their types.
 */

export { createDocumentSlice, initialDocumentState } from './documentSlice';
export type { DocumentState, DocumentActions } from './documentSlice';

export { createGridSlice } from './gridSlice';
export type { GridActions } from './gridSlice';

export { createHistorySlice, initialHistoryState } from './historySlice';
export type { HistoryState, HistoryActions } from './historySlice';

export { createSelectionSlice, initialSelection, initialSelectionState } from './selectionSlice';
export type { SelectionType, ElementSelection, HoveredElement, SelectionState, SelectionActions } from './selectionSlice';

export { createUISlice, initialUIState } from './uiSlice';
export type { EditorMode, DragContext, ResizeContext, DropTarget, UIState, UIActions } from './uiSlice';

export { createStatusSlice, initialStatusState } from './statusSlice';
export type { StatusState, StatusActions } from './statusSlice';
