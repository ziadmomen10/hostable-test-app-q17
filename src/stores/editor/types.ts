/**
 * Editor Store Types
 * 
 * Centralized type definitions for the editor store.
 * All slices and the main store import from here.
 */

import { 
  PageData, 
  SectionInstance, 
  AutosaveStatus,
  ElementPosition,
} from '@/types/reactEditor';
import { SectionType } from '@/types/pageEditor';
import {
  SectionGrid,
  GridColumn,
  GridWidget,
  ResponsiveWidth,
} from '@/types/grid';

// ============================================================================
// Selection Types
// ============================================================================

export type SelectionType = 'none' | 'section' | 'column' | 'element';

export interface ElementSelection {
  type: SelectionType;
  sectionId: string | null;
  columnId: string | null;
  elementPath: string | null;
  isInlineEditing: boolean;
  translationKey?: string;
}

export interface HoveredElement {
  sectionId: string;
  elementPath: string;
}

// ============================================================================
// Editor Mode Types
// ============================================================================

export type EditorMode = 
  | 'idle'
  | 'selecting'
  | 'dragging'
  | 'resizing'
  | 'inline-editing';

export interface DragContext {
  type: 'section' | 'column' | 'widget' | 'element' | 'block';
  sourceId: string;
  sectionId: string;
  columnId?: string;
  widgetId?: string;
  arrayPath?: string;
  index?: number;
  /** For block drags from library - the section type to create */
  blockType?: string;
  /** Display name for drag overlay */
  blockDisplayName?: string;
}

export interface ResizeContext {
  sectionId: string;
  elementPath?: string;
  direction: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

export interface DropTarget {
  sectionId: string;
  arrayPath: string;
  index: number;
  position: 'before' | 'after';
}

// ============================================================================
// State Slices
// ============================================================================

// Document State
export interface DocumentState {
  pageId: string | null;
  pageData: PageData | null;
  originalPageData: PageData | null;
  sectionVersions: Record<string, number>;
}

// History State
export interface HistoryState {
  history: PageData[];
  historyIndex: number;
}

// Selection State
export interface SelectionState {
  selection: ElementSelection;
  selectedSectionId: string | null;
  hoveredElement: HoveredElement | null;
}

// UI State
export interface UIState {
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  activeTab: 'sections' | 'blocks';
  isDragging: boolean;
  editorMode: EditorMode;
  dragContext: DragContext | null;
  resizeContext: ResizeContext | null;
  dropTarget: DropTarget | null;
}

// Status State
export interface StatusState {
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  requiresImmediateSave: boolean;
  autosaveStatus: AutosaveStatus;
  lastSavedAt: string | null;
}

// ============================================================================
// Combined Store State
// ============================================================================

export interface EditorStoreState extends 
  DocumentState,
  HistoryState,
  SelectionState,
  UIState,
  StatusState {}

// ============================================================================
// Action Types
// ============================================================================

export interface DocumentActions {
  initializeEditor: (pageId: string, pageData: PageData | null) => void;
  resetEditor: () => void;
  setPageId: (pageId: string) => void;
  setPageData: (pageData: PageData | null) => void;
  addSection: (type: SectionType, index?: number) => void;
  updateSectionProps: (sectionId: string, props: Record<string, any>) => void;
  updateSectionStyle: (sectionId: string, style: import('@/types/elementSettings').SectionStyleProps) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (sourceIndex: number, destinationIndex: number) => void;
  duplicateSection: (sectionId: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  updateElementValue: (sectionId: string, elementPath: string, value: any) => void;
  updateElementPosition: (sectionId: string, elementPath: string, position: ElementPosition) => void;
  reorderArrayItem: (sectionId: string, arrayPath: string, sourceIndex: number, destinationIndex: number) => void;
  moveArrayItemBetweenSections: (
    sourceSectionId: string,
    sourceArrayPath: string,
    sourceIndex: number,
    targetSectionId: string,
    targetArrayPath: string,
    targetIndex: number
  ) => void;
  setTranslationKey: (sectionId: string, propPath: string, translationKey: string) => void;
  removeTranslationKey: (sectionId: string, propPath: string) => void;
}

export interface GridActions {
  setSectionGrid: (sectionId: string, grid: SectionGrid) => void;
  addColumn: (sectionId: string, column: GridColumn, index?: number) => void;
  removeColumn: (sectionId: string, columnId: string) => void;
  reorderColumn: (sectionId: string, sourceIndex: number, destIndex: number) => void;
  updateColumnWidth: (sectionId: string, columnId: string, width: ResponsiveWidth) => void;
  addWidgetToColumn: (sectionId: string, columnId: string, widget: GridWidget, index?: number) => void;
  removeWidget: (sectionId: string, columnId: string, widgetIndex: number) => void;
  reorderWidgetInColumn: (sectionId: string, columnId: string, sourceIndex: number, destIndex: number) => void;
  moveWidgetBetweenColumns: (sectionId: string, sourceColumnId: string, sourceIndex: number, destColumnId: string, destIndex: number) => void;
}

export interface HistoryActions {
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
}

export interface SelectionActions {
  selectSection: (sectionId: string | null) => void;
  selectColumn: (sectionId: string, columnId: string) => void;
  selectElement: (sectionId: string, elementPath: string) => void;
  clearSelection: () => void;
  startInlineEdit: () => void;
  stopInlineEdit: () => void;
  setHoveredElement: (sectionId: string | null, elementPath: string | null) => void;
}

export interface UIActions {
  setDeviceMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  setActiveTab: (tab: 'sections' | 'blocks') => void;
  setDragging: (isDragging: boolean) => void;
  setEditorMode: (mode: EditorMode) => void;
  startDrag: (context: DragContext) => void;
  endDrag: () => void;
  startResize: (context: ResizeContext) => void;
  endResize: () => void;
  setDropTarget: (target: DropTarget | null) => void;
}

export interface StatusActions {
  setLoading: (isLoading: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  setAutosaveStatus: (status: AutosaveStatus) => void;
  setLastSavedAt: (timestamp: string | null) => void;
  markSaved: () => void;
}

export interface EditorStoreActions extends 
  DocumentActions,
  GridActions,
  HistoryActions,
  SelectionActions,
  UIActions,
  StatusActions {}
