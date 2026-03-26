/**
 * useReactEditorShortcuts
 * 
 * Keyboard shortcuts hook for the React-native page editor.
 * Works with React context (not GrapesJS).
 */

import { useEffect, useMemo, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface ShortcutDefinition {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  category: 'editing' | 'navigation' | 'view';
  action: string;
}

export interface UseReactEditorShortcutsOptions {
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onDeselect: () => void;
  onPreview?: () => void;
  onClose?: () => void;
  selectedSectionId: string | null;
  canUndo: boolean;
  canRedo: boolean;
  disabled?: boolean;
}

// ============================================================================
// Shortcut Definitions
// ============================================================================

export const SHORTCUTS: ShortcutDefinition[] = [
  // Editing
  { key: 's', ctrl: true, description: 'Save page', category: 'editing', action: 'save' },
  { key: 'z', ctrl: true, description: 'Undo', category: 'editing', action: 'undo' },
  { key: 'z', ctrl: true, shift: true, description: 'Redo', category: 'editing', action: 'redo' },
  { key: 'y', ctrl: true, description: 'Redo', category: 'editing', action: 'redo' },
  { key: 'd', ctrl: true, description: 'Duplicate section', category: 'editing', action: 'duplicate' },
  { key: 'Delete', description: 'Delete section', category: 'editing', action: 'delete' },
  { key: 'Backspace', description: 'Delete section', category: 'editing', action: 'delete' },
  
  // Navigation
  { key: 'Escape', description: 'Deselect / Close', category: 'navigation', action: 'deselect' },
  
  // View
  { key: 'p', ctrl: true, description: 'Preview page', category: 'view', action: 'preview' },
];

// ============================================================================
// Helpers
// ============================================================================

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

export function getShortcutDisplay(shortcut: ShortcutDefinition): string {
  const parts: string[] = [];
  
  if (shortcut.ctrl) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  
  // Format key display
  let keyDisplay = shortcut.key;
  if (keyDisplay === 'Delete') keyDisplay = 'Del';
  if (keyDisplay === 'Backspace') keyDisplay = '⌫';
  if (keyDisplay === 'Escape') keyDisplay = 'Esc';
  if (keyDisplay.length === 1) keyDisplay = keyDisplay.toUpperCase();
  
  parts.push(keyDisplay);
  
  return isMac ? parts.join('') : parts.join('+');
}

function isInputElement(element: Element | null): boolean {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    (element as HTMLElement).isContentEditable
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useReactEditorShortcuts(options: UseReactEditorShortcutsOptions) {
  const {
    onSave,
    onUndo,
    onRedo,
    onDelete,
    onDuplicate,
    onDeselect,
    onPreview,
    onClose,
    selectedSectionId,
    canUndo,
    canRedo,
    disabled = false,
  } = options;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (disabled) return;
    
    // Don't handle shortcuts when typing in input fields
    if (isInputElement(document.activeElement)) {
      // Allow Escape to blur inputs
      if (e.key === 'Escape') {
        (document.activeElement as HTMLElement)?.blur();
      }
      return;
    }

    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const key = e.key.toLowerCase();

    // Save: Ctrl+S
    if (ctrl && key === 's' && !shift) {
      e.preventDefault();
      onSave();
      return;
    }

    // Undo: Ctrl+Z (no shift)
    if (ctrl && key === 'z' && !shift) {
      e.preventDefault();
      if (canUndo) onUndo();
      return;
    }

    // Redo: Ctrl+Shift+Z or Ctrl+Y
    if ((ctrl && key === 'z' && shift) || (ctrl && key === 'y' && !shift)) {
      e.preventDefault();
      if (canRedo) onRedo();
      return;
    }

    // Duplicate: Ctrl+D
    if (ctrl && key === 'd' && !shift) {
      e.preventDefault();
      if (selectedSectionId) onDuplicate();
      return;
    }

    // Delete: Delete or Backspace (when section selected)
    if ((e.key === 'Delete' || e.key === 'Backspace') && !ctrl && !shift) {
      if (selectedSectionId) {
        e.preventDefault();
        onDelete();
      }
      return;
    }

    // Escape: Deselect or close
    if (e.key === 'Escape') {
      e.preventDefault();
      if (selectedSectionId) {
        onDeselect();
      } else if (onClose) {
        onClose();
      }
      return;
    }

    // Preview: Ctrl+P
    if (ctrl && key === 'p' && !shift && onPreview) {
      e.preventDefault();
      onPreview();
      return;
    }
  }, [
    disabled,
    onSave,
    onUndo,
    onRedo,
    onDelete,
    onDuplicate,
    onDeselect,
    onClose,
    onPreview,
    selectedSectionId,
    canUndo,
    canRedo,
  ]);

  // Attach event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Group shortcuts by category for UI display
  const shortcutsByCategory = useMemo(() => {
    return SHORTCUTS.reduce((acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    }, {} as Record<string, ShortcutDefinition[]>);
  }, []);

  return {
    shortcuts: SHORTCUTS,
    shortcutsByCategory,
    getShortcutDisplay,
  };
}

export default useReactEditorShortcuts;
