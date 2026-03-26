/**
 * Translation Key Generator
 * 
 * Generates deterministic, hierarchical translation keys based on:
 * - Page slug
 * - Section type and index
 * - Property path
 */

import { KeyGenerationOptions } from '@/types/translationEngine';

// ============================================================================
// Key Generation
// ============================================================================

/**
 * Generates a deterministic translation key using STABLE section IDs.
 * 
 * NEW FORMAT (stable): {scope}.{pageSlug}.{sectionId_short}.{propPath}
 * - Uses first 8 chars of section UUID for uniqueness and readability
 * - Keys remain stable when sections are reordered
 * 
 * OLD FORMAT (deprecated): {scope}.{pageSlug}.{sectionType}_{sectionIndex}.{propPath}
 * - Used section index which changes on reorder, breaking translations
 * 
 * Examples (new format):
 * - page.home.a1b2c3d4.title
 * - page.vps_hosting.e5f6g7h8.features_0_title
 * - common.button.get_started
 */
export function generateTranslationKey(options: KeyGenerationOptions): string {
  const { pageSlug, sectionId, propPath, scope = 'page' } = options;
  
  // Normalize the page slug
  const normalizedSlug = normalizeSlug(pageSlug);
  
  // Use first 8 chars of section ID for stable, readable keys
  const shortSectionId = normalizeSectionId(sectionId);
  
  // Normalize the prop path (convert array indices to underscore notation)
  const normalizedPropPath = normalizePropPath(propPath);
  
  // Build the key
  if (scope === 'common' || scope === 'header' || scope === 'footer') {
    return `${scope}.${normalizedPropPath}`;
  }
  
  return `${scope}.${normalizedSlug}.${shortSectionId}.${normalizedPropPath}`;
}

/**
 * Parses a translation key into its components.
 * Supports both new (sectionId) and legacy (sectionType_index) formats.
 */
export function parseTranslationKey(key: string): {
  scope: string;
  pageSlug?: string;
  sectionId?: string;
  /** @deprecated - only present for legacy keys */
  sectionType?: string;
  /** @deprecated - only present for legacy keys */
  sectionIndex?: number;
  propPath: string;
  isLegacyFormat?: boolean;
} | null {
  const parts = key.split('.');
  
  if (parts.length < 2) return null;
  
  const scope = parts[0];
  
  // Global keys (common, header, footer)
  if (['common', 'header', 'footer'].includes(scope)) {
    return {
      scope,
      propPath: parts.slice(1).join('.'),
    };
  }
  
  // Page keys
  if (scope === 'page' && parts.length >= 4) {
    const pageSlug = parts[1];
    const sectionPart = parts[2];
    
    // Check for legacy format: sectionType_index (e.g., "hero_0", "pricing_2")
    const legacyMatch = sectionPart.match(/^(.+)_(\d+)$/);
    
    if (legacyMatch) {
      // Legacy format with section type and index
      return {
        scope,
        pageSlug,
        sectionType: legacyMatch[1],
        sectionIndex: parseInt(legacyMatch[2], 10),
        propPath: parts.slice(3).join('.'),
        isLegacyFormat: true,
      };
    }
    
    // New format: sectionId (8 char hex string)
    return {
      scope,
      pageSlug,
      sectionId: sectionPart,
      propPath: parts.slice(3).join('.'),
      isLegacyFormat: false,
    };
  }
  
  return null;
}

/**
 * Validates a translation key format
 */
export function isValidTranslationKey(key: string): boolean {
  // Must match: lowercase letters, numbers, underscores, dots
  // Must start with a letter
  // No consecutive dots
  const pattern = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/;
  return pattern.test(key);
}

/**
 * Gets the namespace from a translation key
 */
export function getKeyNamespace(key: string): string {
  const parts = key.split('.');
  if (parts.length >= 2 && parts[0] === 'page') {
    return parts[1]; // page slug as namespace
  }
  return parts[0]; // scope as namespace for global keys
}

// ============================================================================
// Normalization Helpers
// ============================================================================

function normalizeSlug(slug: string): string {
  // Remove leading/trailing slashes
  let normalized = slug.replace(/^\/+|\/+$/g, '');
  
  // Convert to lowercase and replace special chars with underscores
  normalized = normalized.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  
  // Handle root path
  if (!normalized) {
    normalized = 'home';
  }
  
  return normalized;
}

function normalizeSectionType(sectionType: string): string {
  // Convert PascalCase or camelCase to snake_case
  return sectionType
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/-/g, '_');
}

/**
 * Normalize section ID to a short, readable format.
 * Uses the RANDOM SUFFIX (last part) for guaranteed uniqueness.
 * 
 * Handles section IDs in format:
 * - Timestamp-based: "section-1769198229628-mq5vtgpv0" → "mq5vtgpv" (uses random suffix)
 * - UUID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" → "a1b2c3d4"
 * 
 * IMPORTANT: Previously used timestamp portion which caused collisions when
 * sections were created close together (same timestamp prefix).
 */
function normalizeSectionId(sectionId: string): string {
  if (!sectionId) {
    console.warn('[translationKeyGenerator] Missing sectionId, using fallback');
    return 'unknown';
  }
  
  // Section ID format: "section-{timestamp}-{randomId}"
  // E.g.: "section-1769198229628-mq5vtgpv0"
  // We want the random suffix "mq5vtgpv0" for uniqueness (NOT the timestamp!)
  if (sectionId.startsWith('section-')) {
    const parts = sectionId.split('-');
    // parts = ["section", "1769198229628", "mq5vtgpv0"]
    if (parts.length >= 3) {
      // Use the random suffix (last part) - guaranteed unique per section
      return parts[parts.length - 1].toLowerCase().substring(0, 8);
    }
    // Fallback: skip "section-" and take what remains
    return sectionId.substring(8).replace(/-/g, '').substring(0, 8).toLowerCase();
  }
  
  // For UUID format: take first 8 chars after removing dashes
  return sectionId.replace(/-/g, '').substring(0, 8).toLowerCase();
}

function normalizePropPath(propPath: string): string {
  // Convert array indices from [0] to _0
  return propPath
    .replace(/\[(\d+)\]/g, '_$1')
    .replace(/\./g, '_')
    .toLowerCase();
}

// ============================================================================
// Bulk Key Generation
// ============================================================================

/**
 * Generates translation keys for all translatable props in a section.
 * Uses stable section ID instead of volatile section index.
 */
export function generateKeysForSection(
  pageSlug: string,
  sectionType: string,
  sectionId: string,
  translatableProps: string[]
): Record<string, string> {
  const keyMap: Record<string, string> = {};
  
  for (const propPath of translatableProps) {
    const key = generateTranslationKey({
      pageSlug,
      sectionType,
      sectionId,
      propPath,
    });
    keyMap[propPath] = key;
  }
  
  return keyMap;
}

/**
 * Extracts page slug from page URL
 */
export function getPageSlugFromUrl(pageUrl: string): string {
  // Remove leading/trailing slashes
  let slug = pageUrl.replace(/^\/+|\/+$/g, '');
  
  // Handle root path
  if (!slug) {
    return 'home';
  }
  
  // Replace slashes with underscores for nested paths
  return slug.replace(/\//g, '_');
}
