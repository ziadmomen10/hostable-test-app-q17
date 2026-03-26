/**
 * React-Native Editor Types
 * 
 * Core type definitions for the new React-native page builder.
 * Replaces GrapesJS component model with pure React state.
 */

import { SectionType } from './pageEditor';
import type { SectionStyleProps } from './elementSettings';

// ============================================================================
// Page Data Model (JSON-based, single source of truth)
// ============================================================================

export interface PageData {
  id: string;
  version: number;
  sections: SectionInstance[];
  metadata: PageMetadata;
}

export interface PageMetadata {
  title: string;
  description?: string;
  keywords?: string;
  lastModified: string;
  author?: string;
}

/**
 * Translation key mapping for section props
 * Maps prop paths (e.g., "title", "features.0.description") to translation keys
 */
export type TranslationKeyMap = Record<string, string>;

export interface SectionInstance {
  id: string;
  type: SectionType;
  props: Record<string, any>;
  order: number;
  visible: boolean;
  /** Maps prop paths to translation keys for i18n support */
  translationKeys?: TranslationKeyMap;
  /** 
   * Explicit grid layout definition (Elementor-style).
   * If present, this is used for rendering. If absent, section is normalized at runtime.
   */
  grid?: import('./grid').SectionGrid;
  /**
   * Section-level styling overrides (background, padding, margin, etc.)
   * Applied on top of the section component's default styles.
   */
  style?: SectionStyleProps;
}

// ============================================================================
// Editor State
// ============================================================================

export type AutosaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export interface ReactEditorState {
  // Page data (single source of truth)
  pageData: PageData | null;
  
  // Selection
  selectedSectionId: string | null;
  
  // UI State
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  isDragging: boolean;
  activeTab: 'sections' | 'blocks';
  
  // Status
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  
  // Autosave
  autosaveStatus: AutosaveStatus;
  lastSavedAt: string | null;
  
  // History for undo/redo
  history: PageData[];
  historyIndex: number;
}

// ============================================================================
// Editor Actions
// ============================================================================

export type ReactEditorAction =
  // Page data actions
  | { type: 'SET_PAGE_DATA'; payload: PageData }
  | { type: 'ADD_SECTION'; payload: { section: SectionInstance; index?: number } }
  | { type: 'UPDATE_SECTION'; payload: { sectionId: string; props: Record<string, any> } }
  | { type: 'DELETE_SECTION'; payload: string }
  | { type: 'REORDER_SECTIONS'; payload: { sourceIndex: number; destinationIndex: number } }
  | { type: 'TOGGLE_SECTION_VISIBILITY'; payload: string }
  | { type: 'DUPLICATE_SECTION'; payload: string }
  
  // Translation actions
  | { type: 'SET_TRANSLATION_KEY'; payload: { sectionId: string; propPath: string; translationKey: string } }
  | { type: 'REMOVE_TRANSLATION_KEY'; payload: { sectionId: string; propPath: string } }
  
  // Selection actions
  | { type: 'SELECT_SECTION'; payload: string | null }
  
  // UI actions
  | { type: 'SET_DEVICE_MODE'; payload: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'SET_ACTIVE_TAB'; payload: 'sections' | 'blocks' }
  
  // Status actions
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'MARK_SAVED' }
  | { type: 'SET_AUTOSAVE_STATUS'; payload: AutosaveStatus }
  | { type: 'SET_LAST_SAVED'; payload: string }
  
  // History actions
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'PUSH_HISTORY' };

// ============================================================================
// Section Definition (Registry)
// ============================================================================

export interface SectionDefinition {
  type: SectionType;
  displayName: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'layout' | 'content' | 'commerce' | 'media' | 'interactive';
  
  // The actual React component to render
  component: React.ComponentType<any>;
  
  // Settings component for the right panel
  settingsComponent: React.ComponentType<{
    data: any;
    onChange: (data: any) => void;
    sectionId?: string;
  }>;
  
  // Default props for new sections
  defaultProps: Record<string, any>;
  
  // Thumbnail/preview for block library
  thumbnail?: string;
  description?: string;
  
  /** 
   * List of translatable prop paths for this section type
   * Used for translation coverage calculation and key suggestions
   * Examples: ['title', 'subtitle', 'features.*.title', 'features.*.description']
   */
  translatableProps?: string[];
  
  /**
   * Whether props should be wrapped in { data: props } when passed to component.
   * This is for sections that use the `data` prop pattern.
   * Default: false (props are spread directly)
   */
  usesDataWrapper?: boolean;
  
  /**
   * Drag-and-drop configuration for sortable arrays within this section.
   * If not provided, DnD will be auto-inferred from sectionDndConfig.ts registry.
   * 
   * Example:
   * dndArrays: [
   *   { path: 'items', strategy: 'grid' },
   *   { path: 'items.*.links', strategy: 'horizontal' }
   * ]
   */
  dndArrays?: Array<{
    path: string;
    strategy: 'grid' | 'vertical' | 'horizontal';
    handlePosition?: 'left' | 'top-left' | 'top-right';
  }>;
  /**
   * The page group this block belongs to in the Block Library accordion.
   * Sections without this field appear under the "General" fallback group.
   * Value is case-sensitive — must be identical across all sections in the same group.
   * Examples: 'Career Page', 'VPS Hosting', 'Game Hosting', 'Contact Page'
   */
  pageGroup?: string;
  /**
   * Controls display order within the page group (lower = first).
   * Sections without this field are sorted alphabetically within their group.
   */
  pageGroupOrder?: number;
}

// ============================================================================
// Element Position (Phase 2 - State-based positioning)
// ============================================================================

/** Element position and size data for free-form editing */
export interface ElementPosition {
  /** X offset from natural position in pixels */
  offsetX?: number;
  /** Y offset from natural position in pixels */
  offsetY?: number;
  /** Custom width (CSS value, e.g., "200px" or "50%") */
  width?: string;
  /** Custom height (CSS value) */
  height?: string;
  /** Rotation in degrees */
  rotation?: number;
}

// ============================================================================
// Drag & Drop Types
// ============================================================================

export interface DragItem {
  type: 'section' | 'new-block';
  sectionId?: string;
  sectionType?: SectionType;
  index?: number;
}

export interface DropResult {
  index: number;
}

// ============================================================================
// Editor Context
// ============================================================================

export interface ReactEditorContextValue {
  state: ReactEditorState;
  dispatch: React.Dispatch<ReactEditorAction>;
  
  // Convenience methods
  selectSection: (sectionId: string | null) => void;
  updateSectionProps: (sectionId: string, props: Record<string, any>) => void;
  addSection: (type: SectionType, index?: number) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (sourceIndex: number, destinationIndex: number) => void;
  duplicateSection: (sectionId: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Save
  savePageData: () => Promise<void>;
  
  // Autosave status (convenience accessors)
  autosaveStatus: AutosaveStatus;
  lastSavedAt: string | null;
}

// ============================================================================
// Initial State
// ============================================================================

export const initialReactEditorState: ReactEditorState = {
  pageData: null,
  selectedSectionId: null,
  deviceMode: 'desktop',
  isDragging: false,
  activeTab: 'sections',
  isLoading: true,
  isSaving: false,
  hasUnsavedChanges: false,
  autosaveStatus: 'idle',
  lastSavedAt: null,
  history: [],
  historyIndex: -1,
};
