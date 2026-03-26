/**
 * React-Native Editor Exports
 * 
 * Central export file for the new React-native page builder components.
 */

// Main Editor
export { ReactPageEditor } from './ReactPageEditor';
export { default as ReactPageEditorDefault } from './ReactPageEditor';

// Provider & Context - useSaveContext is the minimal save-only context
// useEditorContext is DEPRECATED - use useEditorStore selectors instead
export { EditorProvider, useSaveContext, useEditorContext } from './EditorProvider';

// Canvas Components
export { EditorCanvas } from './EditorCanvas';
export { SectionWrapper } from './SectionWrapper';
export { EditorSectionRenderer } from './EditorSectionRenderer';
// Backward compatibility alias
export { EditorSectionRenderer as SectionRenderer } from './EditorSectionRenderer';

// Drag & Drop Components
export { SortableItem } from './SortableItem';

// Selection & Inline Editing Components
export { SelectionOverlay } from './SelectionOverlay';
export { FloatingToolbar } from './FloatingToolbar';
export { EditableText } from './EditableText';
export { ElementSettings } from './ElementSettings';
export { InlineEditor } from './InlineEditor';
export { EditableElement, EditableInline } from './EditableElement';

// Overlay System Components
export { SectionOverlay } from './SectionOverlay';

// Panel Components
export { BlockLibrary } from './BlockLibrary';
export { SectionList } from './SectionList';
export { SettingsPanel } from './SettingsPanel';
export { EditorToolbar } from './EditorToolbar';

// Translation Components
export { TranslationKeyPicker, TranslationStatusIndicator } from './TranslationKeyPicker';
export { TranslatableField, TranslatableInput } from './TranslatableField';

// SlateEditor — deprecated, no live callers in the component tree.
// Slate packages (slate, slate-react, slate-history) can be removed from package.json
// once this export is confirmed unused in all consuming projects.
export { SlateEditor, SlateFormattingToolbar } from './slate';

// TipTap Rich Text Editor Components (NEW - preferred)
// Now using SimpleRichEditor with native contenteditable
export { TiptapEditor, SimpleRichEditor, SimpleToolbar } from './tiptap';

// Re-export types
export type { PageData, SectionInstance, ReactEditorState, ReactEditorContextValue, ElementPosition } from '@/types/reactEditor';

// Re-export Zustand store (SINGLE SOURCE OF TRUTH)
export { 
  useEditorStore, 
  usePageData,
  useSelection, 
  useSelectedSection,
  useSelectedElementValue,
  useSelectedSectionId,
  useHoveredElement,
  useEditorMode,
  useDragContext,
  useResizeContext,
  useCanUndo,
  useCanRedo,
  useDeviceMode,
  useActiveTab,
  useIsLoading,
  useIsSaving,
  useHasUnsavedChanges,
  useAutosaveStatus,
  useLastSavedAt,
} from '@/stores/editorStore';

// Re-export element registry
export { 
  registerElement, 
  unregisterElement, 
  getElementById, 
  getElementBounds, 
  getAllElements,
  useElementRegistry,
} from '@/stores/elementRegistry';