/**
 * useTranslationStatus Hook
 * 
 * Determines the translation status for any editable element based on:
 * - Whether it's bound to a translation key
 * - Whether a translation exists for the current language
 * - Whether the translation is stale (source text changed)
 * 
 * NOTE: This hook must NOT import from editorStore, sectionUtils, or sectionDefinitions
 * to avoid circular dependency issues (HeroSection → EditableElement → 
 * useTranslationStatus → editorStore → sectionDefinitions → HeroSection)
 * 
 * The pageData is received from EditorModeContext instead of editorStore.
 */

import { useMemo } from 'react';
import { useOptionalTranslationEngine } from '@/contexts/TranslationEngineContext';
import { useI18n } from '@/contexts/I18nContext';
import { useEditorModeContext } from '@/contexts/EditorModeContext';

export type TranslationStatusType = 'translated' | 'stale' | 'missing' | 'unbound';

export interface TranslationStatusResult {
  status: TranslationStatusType;
  tooltip: string;
}

/**
 * Gets a nested value from an object using a dot-separated path.
 * Handles array indices (e.g., "features.0.title").
 * Inline implementation to avoid circular dependencies.
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  if (!obj || !path) return undefined;
  
  const parts = path.split('.');
  let current: any = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  
  return current;
}

/**
 * Gets a string value from section props at the given path.
 * Handles both regular sections and sections with usesDataWrapper pattern.
 * Inline implementation to avoid circular dependencies with sectionDefinitions.
 */
function getSectionPropStringInline(section: any, path: string): string | null {
  if (!section?.props) return null;
  
  // Try direct path first
  let value = getNestedValue(section.props, path);
  
  // If not found and section has data wrapper, try under data
  if (value === undefined && section.props.data) {
    value = getNestedValue(section.props.data, path);
  }
  
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    // Handle TipTap JSON - extract plain text
    try {
      return JSON.stringify(value);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Get the translation status for a specific element.
 * Uses EditorModeContext for pageData to avoid circular dependencies.
 */
export function useTranslationStatus(
  sectionId: string | undefined, 
  path: string
): TranslationStatusResult | null {
  const { currentLanguage, languages } = useI18n();
  const { pageData } = useEditorModeContext();
  const engine = useOptionalTranslationEngine();
  
  return useMemo(() => {
    // Only show status if we have a sectionId and are not viewing default language
    if (!sectionId || !currentLanguage || !engine) return null;
    
    // Find the default language
    const defaultLang = languages.find(l => l.is_default);
    if (!defaultLang || currentLanguage.code === defaultLang.code) return null;
    
    // Get the section
    const section = pageData?.sections?.find((s: any) => s.id === sectionId);
    if (!section) return null;
    
    // Check if this prop has a bound translation key
    const boundKey = section.translationKeys?.[path];
    const keyRecord = engine.translationKeys.find(k => 
      k.key === boundKey || 
      (k.sectionId === sectionId && k.propPath === path)
    );
    
    const hasKey = !!boundKey || !!keyRecord;
    
    if (!hasKey) {
      return { 
        status: 'unbound', 
        tooltip: 'No translation key bound' 
      };
    }
    
    const keyToUse = boundKey || keyRecord?.key;
    if (!keyToUse) {
      return { 
        status: 'unbound', 
        tooltip: 'No translation key bound' 
      };
    }
    
    // Find the translation for current language
    const translation = engine.translations.find(t => t.key === keyToUse);
    
    if (!translation?.value) {
      return { 
        status: 'missing', 
        tooltip: `No translation for ${currentLanguage.code}` 
      };
    }
    
    // Check if stale (source text changed)
    // Prioritize keyRecord.sourceText (ground truth from key generation),
    // falling back to translation.sourceText for compatibility
    const currentSourceText = getSectionPropStringInline(section, path) || '';
    const storedSourceText = keyRecord?.sourceText || translation.sourceText || '';
    
    // Normalize for comparison
    const normalizedCurrent = currentSourceText.trim().replace(/\s+/g, ' ');
    const normalizedStored = storedSourceText.trim().replace(/\s+/g, ' ');
    
    if (storedSourceText && normalizedCurrent !== normalizedStored) {
      return { 
        status: 'stale', 
        tooltip: 'Source text changed - needs re-translation' 
      };
    }
    
    return { 
      status: 'translated', 
      tooltip: `Translated to ${currentLanguage.code}` 
    };
  }, [sectionId, path, currentLanguage, languages, pageData?.sections, engine?.translationKeys, engine?.translations]);
}

export default useTranslationStatus;
