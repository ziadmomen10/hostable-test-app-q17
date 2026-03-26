/**
 * TipTap Extensions Configuration
 * 
 * NOTE: All Tiptap runtime imports removed — the active editor (SimpleRichEditor)
 * uses native contenteditable and does not load any @tiptap/* packages at runtime.
 * This file is preserved for documentation reference. colorPalette is still used
 * by SimpleToolbar.tsx.
 */

export interface ExtensionConfig {
  multiline?: boolean;
  placeholder?: string;
}

// getExtensions is no longer called at runtime — preserved for reference only
export function getExtensions(_config: ExtensionConfig = {}): unknown[] {
  return [];
}

/**
 * Color palette for text and highlight colors
 * Uses semantic colors from design system
 */
export const colorPalette = {
  text: [
    { name: 'Default', value: null },
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
  ],
  highlight: [
    { name: 'None', value: null },
    { name: 'Yellow', value: '#fef08a' },
    { name: 'Green', value: '#bbf7d0' },
    { name: 'Blue', value: '#bfdbfe' },
    { name: 'Purple', value: '#e9d5ff' },
    { name: 'Pink', value: '#fbcfe8' },
    { name: 'Red', value: '#fecaca' },
    { name: 'Orange', value: '#fed7aa' },
  ],
};
