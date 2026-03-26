/**
 * Translation Resolver
 * 
 * Single source of truth for translation key resolution logic.
 * Used by both useLiveTranslations (public pages) and useEditorTranslations (editor).
 * 
 * CRITICAL: Any changes here affect both editor preview and live site rendering.
 * Test thoroughly before modifying!
 */

import {
  getNestedValue as getNestedValueHelper,
  setNestedValueMutable,
  deepClone as deepCloneHelper,
} from '@/lib/utils/objectHelpers';

// ============================================================================
// Types
// ============================================================================

export interface TranslationMessages {
  [key: string]: string;
}

// ============================================================================
// Core Resolution Function
// ============================================================================

/**
 * Resolve a translation key to its translated value.
 * 
 * Resolution order:
 * 1. Direct lookup (key as-is)
 * 2. Namespace prefix lookup (for page.{slug}.* keys)
 * 3. Suffix match (any key ending with our key)
 * 
 * @param key - The translation key to resolve
 * @param messages - The messages dictionary from I18nContext
 * @param debug - Enable debug logging
 * @returns The translated value, or null if not found
 */
export function resolveTranslationKey(
  key: string,
  messages: TranslationMessages,
  debug = false
): string | null {
  const log = debug ? console.log : () => {};
  
  // ALWAYS log first resolution attempt for debugging (temporary)
  const messagesCount = Object.keys(messages).length;
  if (messagesCount > 0) {
    console.log('[TranslationResolver] Resolving:', key, '| Messages:', messagesCount);
  }
  
  // 1. Direct lookup (key as-is)
  if (messages[key]) {
    console.log('[TranslationResolver] ✓ Direct match:', key);
    return messages[key];
  }
  
  // 2. Namespace prefix lookup for page-scoped keys
  // Translation keys are stored as "page.{slug}.{section}.{prop}"
  // But messages may be stored as "{Namespace}.page.{slug}.{section}.{prop}"
  // where Namespace is the capitalized page slug
  if (key.startsWith('page.')) {
    const keyParts = key.split('.');
    if (keyParts.length >= 2) {
      const slugPart = keyParts[1]; // e.g., "test"
      const capitalizedSlug = slugPart.charAt(0).toUpperCase() + slugPart.slice(1);
      const namespacedKey = `${capitalizedSlug}.${key}`;
      if (messages[namespacedKey]) {
        console.log('[TranslationResolver] ✓ Namespace match:', namespacedKey);
        return messages[namespacedKey];
      } else {
        // Always log missing namespace keys for debugging
        const sampleKeys = Object.keys(messages).filter(k => k.includes(slugPart)).slice(0, 3);
        console.warn('[TranslationResolver] ✗ Namespace key not found:', namespacedKey, 
          '| Sample matching keys:', sampleKeys);
      }
    }
  }
  
  // 3. Suffix match - find any key ending with our key
  for (const [msgKey, msgValue] of Object.entries(messages)) {
    if (msgKey.endsWith(`.${key}`)) {
      console.log('[TranslationResolver] ✓ Suffix match:', msgKey);
      return msgValue;
    }
  }
  
  console.warn('[TranslationResolver] ✗ No match found for:', key);
  return null;
}

// ============================================================================
// Helper Functions (Re-exported for backward compatibility)
// ============================================================================

/**
 * Set a nested value in an object using dot notation path.
 * Handles both object properties and array indices.
 * 
 * @param obj - The object to modify (mutates in place)
 * @param path - Dot-notation path (e.g., "items.0.title")
 * @param value - Value to set
 * 
 * @example
 * const obj = { items: [{ title: 'Old' }] };
 * setNestedValue(obj, 'items.0.title', 'New');
 * // obj.items[0].title === 'New'
 * 
 * @deprecated Import from '@/lib/utils/objectHelpers' instead
 */
export function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  setNestedValueMutable(obj, path, value);
}

/**
 * Get a nested value from an object using dot notation path.
 * Returns undefined if path doesn't exist.
 * 
 * @param obj - The object to read from
 * @param path - Dot-notation path (e.g., "items.0.title")
 * @returns The value at the path, or undefined
 * 
 * @deprecated Import from '@/lib/utils/objectHelpers' instead
 */
export function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  return getNestedValueHelper(obj, path);
}

/**
 * Deep clone an object using JSON serialization.
 * Note: This won't preserve functions, dates, or other non-JSON types.
 * 
 * @deprecated Import from '@/lib/utils/objectHelpers' instead
 */
export function deepClone<T>(obj: T): T {
  return deepCloneHelper(obj);
}
