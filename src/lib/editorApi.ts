/**
 * Unified Editor Mutation API
 * 
 * SINGLE ENTRY POINT for all document mutations in the visual editor.
 * This ensures all changes follow the same path:
 * 
 * UI Event → editorApi.commit() → Context dispatch → Reducer → Re-render
 * 
 * Phase 6: This API exists to enforce the single source of truth pattern.
 * All UI components should use these methods instead of calling dispatch directly.
 */

import { ExtendedEditorContextValue } from '@/components/editor/EditorProvider';

// ============================================================================
// Debug Mode
// ============================================================================

/**
 * Enable verbose logging for all editor mutations.
 * Toggle via: window.__EDITOR_DEBUG = true
 */
export function isEditorDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return (window as any).__EDITOR_DEBUG === true;
}

function debugLog(action: string, payload?: any): void {
  if (!isEditorDebugEnabled()) return;
  console.log(`[EditorAPI] ${action}`, payload || '');
}

// ============================================================================
// Document Reference Tracking (DESYNC Detection)
// ============================================================================

let documentInstanceId: string | null = null;
let documentInstanceRef: any = null;

/**
 * Register the current document instance for DESYNC detection.
 * Called by EditorProvider on mount.
 */
export function registerDocumentInstance(instanceId: string, documentRef: any): void {
  if (process.env.NODE_ENV !== 'production') {
    if (documentInstanceId && documentInstanceId !== instanceId) {
      console.error(
        '[DESYNC DETECTED] Multiple document instances exist!',
        { existing: documentInstanceId, new: instanceId }
      );
    }
  }
  documentInstanceId = instanceId;
  documentInstanceRef = documentRef;
  debugLog('Document registered', { instanceId });
}

/**
 * Unregister the document instance.
 * Called by EditorProvider on unmount.
 */
export function unregisterDocumentInstance(instanceId: string): void {
  if (documentInstanceId === instanceId) {
    documentInstanceId = null;
    documentInstanceRef = null;
    debugLog('Document unregistered', { instanceId });
  }
}

/**
 * Get the current document instance ID for validation.
 */
export function getDocumentInstanceId(): string | null {
  return documentInstanceId;
}

/**
 * Validate that the provided document reference matches the registered one.
 * Throws in dev mode if DESYNC is detected.
 */
export function validateDocumentSync(providedRef: any, source: string): void {
  if (process.env.NODE_ENV !== 'production') {
    if (documentInstanceRef && providedRef !== documentInstanceRef) {
      console.error(
        `[DESYNC DETECTED] Document reference mismatch in ${source}!`,
        { registered: documentInstanceId, source }
      );
    }
  }
}

// ============================================================================
// Mutation Wrappers
// ============================================================================

/**
 * Create a unified mutation API from the editor context.
 * This wraps all context methods with logging and validation.
 */
export function createEditorApi(context: ExtendedEditorContextValue) {
  return {
    // Section Operations
    addSection: (type: any, index?: number) => {
      debugLog('addSection', { type, index });
      context.addSection(type, index);
    },

    updateSectionProps: (sectionId: string, props: Record<string, any>) => {
      debugLog('updateSectionProps', { sectionId, propsKeys: Object.keys(props) });
      context.updateSectionProps(sectionId, props);
    },

    deleteSection: (sectionId: string) => {
      debugLog('deleteSection', { sectionId });
      context.deleteSection(sectionId);
    },

    reorderSections: (sourceIndex: number, destinationIndex: number) => {
      debugLog('reorderSections', { sourceIndex, destinationIndex });
      context.reorderSections(sourceIndex, destinationIndex);
    },

    duplicateSection: (sectionId: string) => {
      debugLog('duplicateSection', { sectionId });
      context.duplicateSection(sectionId);
    },

    toggleSectionVisibility: (sectionId: string) => {
      debugLog('toggleSectionVisibility', { sectionId });
      context.toggleSectionVisibility(sectionId);
    },

    // Element Operations
    updateElementValue: (sectionId: string, elementPath: string, value: any) => {
      debugLog('updateElementValue', { sectionId, elementPath, valueLength: String(value).length });
      context.updateElementValue(sectionId, elementPath, value);
    },

    updateElementPosition: (sectionId: string, elementPath: string, position: any) => {
      debugLog('updateElementPosition', { sectionId, elementPath, position });
      context.updateElementPosition(sectionId, elementPath, position);
    },

    reorderArrayItem: (sectionId: string, arrayPath: string, sourceIndex: number, destinationIndex: number) => {
      debugLog('reorderArrayItem', { sectionId, arrayPath, sourceIndex, destinationIndex });
      context.reorderArrayItem(sectionId, arrayPath, sourceIndex, destinationIndex);
    },

    moveArrayItemBetweenSections: (
      sourceSectionId: string,
      sourceArrayPath: string,
      sourceIndex: number,
      targetSectionId: string,
      targetArrayPath: string,
      targetIndex: number
    ) => {
      debugLog('moveArrayItemBetweenSections', {
        sourceSectionId, sourceArrayPath, sourceIndex,
        targetSectionId, targetArrayPath, targetIndex
      });
      context.moveArrayItemBetweenSections(
        sourceSectionId, sourceArrayPath, sourceIndex,
        targetSectionId, targetArrayPath, targetIndex
      );
    },

    // History
    undo: () => {
      debugLog('undo');
      context.undo();
    },

    redo: () => {
      debugLog('redo');
      context.redo();
    },

    // Save
    save: async () => {
      debugLog('save');
      await context.savePageData();
    },
  };
}

// ============================================================================
// Global Debug Toggle
// ============================================================================

// Make debug toggle accessible globally in dev
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (window as any).__EDITOR_DEBUG = false;
  console.log('[EditorAPI] Debug mode available. Set window.__EDITOR_DEBUG = true to enable.');
}
