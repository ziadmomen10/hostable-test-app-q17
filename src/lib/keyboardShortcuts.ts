/**
 * Keyboard Shortcuts Configuration
 * 
 * Shared shortcut definitions and helper functions for the page editor.
 */

// ============================================================================
// Types
// ============================================================================

export interface ShortcutDefinition {
  key: string;
  modifiers?: ('ctrl' | 'shift' | 'alt' | 'meta')[];
  description: string;
  category: 'editing' | 'navigation' | 'view';
  action: string;
}

// ============================================================================
// Shortcut Definitions
// ============================================================================

export const SHORTCUTS: ShortcutDefinition[] = [
  // Editing
  {
    key: 's',
    modifiers: ['ctrl'],
    description: 'Save page',
    category: 'editing',
    action: 'save',
  },
  {
    key: 'z',
    modifiers: ['ctrl'],
    description: 'Undo',
    category: 'editing',
    action: 'undo',
  },
  {
    key: 'z',
    modifiers: ['ctrl', 'shift'],
    description: 'Redo',
    category: 'editing',
    action: 'redo',
  },
  {
    key: 'y',
    modifiers: ['ctrl'],
    description: 'Redo (alternative)',
    category: 'editing',
    action: 'redo',
  },
  {
    key: 'd',
    modifiers: ['ctrl'],
    description: 'Duplicate component',
    category: 'editing',
    action: 'duplicate',
  },
  {
    key: 'Delete',
    description: 'Delete selected component',
    category: 'editing',
    action: 'delete',
  },
  {
    key: 'Backspace',
    description: 'Delete selected component',
    category: 'editing',
    action: 'delete',
  },
  
  // Navigation
  {
    key: 'Escape',
    description: 'Deselect / Close panel',
    category: 'navigation',
    action: 'deselect',
  },
  
  // View
  {
    key: 'p',
    modifiers: ['ctrl'],
    description: 'Open preview',
    category: 'view',
    action: 'preview',
  },
  {
    key: '/',
    modifiers: ['ctrl'],
    description: 'Toggle code viewer',
    category: 'view',
    action: 'code',
  },
  {
    key: '?',
    description: 'Show keyboard shortcuts',
    category: 'view',
    action: 'shortcuts',
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if user is on Mac
 */
const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

/**
 * Get display string for a shortcut (e.g., "⌘S" or "Ctrl+S")
 */
export function getShortcutDisplay(shortcut: ShortcutDefinition): string {
  const parts: string[] = [];
  
  if (shortcut.modifiers?.includes('ctrl')) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.modifiers?.includes('shift')) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  if (shortcut.modifiers?.includes('alt')) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  
  // Format key
  let keyDisplay = shortcut.key;
  if (shortcut.key === 'Delete') keyDisplay = isMac ? '⌫' : 'Del';
  if (shortcut.key === 'Backspace') keyDisplay = isMac ? '⌫' : 'Backspace';
  if (shortcut.key === 'Escape') keyDisplay = 'Esc';
  if (shortcut.key === '/') keyDisplay = '/';
  if (shortcut.key === '?') keyDisplay = '?';
  if (shortcut.key.length === 1 && /[a-z]/.test(shortcut.key)) {
    keyDisplay = shortcut.key.toUpperCase();
  }
  
  parts.push(keyDisplay);
  
  return parts.join(isMac ? '' : '+');
}
