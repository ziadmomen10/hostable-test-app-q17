/**
 * Editor Store Initial State
 * 
 * Default values for all store state slices.
 */

import { 
  ElementSelection, 
  EditorStoreState 
} from './types';

// ============================================================================
// Initial Selection
// ============================================================================

export const initialSelection: ElementSelection = {
  type: 'none',
  sectionId: null,
  columnId: null,
  elementPath: null,
  isInlineEditing: false,
};

// ============================================================================
// Initial State
// ============================================================================

export const initialState: EditorStoreState = {
  // Document
  pageId: null,
  pageData: null,
  originalPageData: null,
  sectionVersions: {},
  
  // History
  history: [],
  historyIndex: -1,
  
  // Selection
  selection: initialSelection,
  selectedSectionId: null,
  hoveredElement: null,
  
  // UI
  deviceMode: 'desktop',
  activeTab: 'sections',
  isDragging: false,
  editorMode: 'idle',
  dragContext: null,
  resizeContext: null,
  dropTarget: null,
  
  // Status
  isLoading: true,
  isSaving: false,
  hasUnsavedChanges: false,
  requiresImmediateSave: false,
  autosaveStatus: 'idle',
  lastSavedAt: null,
};
