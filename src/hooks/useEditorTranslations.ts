/**
 * useEditorTranslations Hook
 * 
 * Handles translation key binding and resolution for the React-native editor.
 * Maps section props to translation keys and resolves translated content.
 * 
 * Uses the new translation_keys system via TranslationEngine context.
 * Uses the centralized translationResolver for consistent key resolution.
 */

import { useCallback, useMemo } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { useEditorStore, usePageData } from '@/stores/editorStore';
import { useOptionalTranslationEngine } from '@/contexts/TranslationEngineContext';
import { SectionInstance, TranslationKeyMap } from '@/types/reactEditor';
import { getSectionDefinition } from '@/lib/sectionDefinitions';
import { 
  resolveTranslationKey as resolveKey, 
  setNestedValue, 
  deepClone 
} from '@/lib/translationResolver';

// ============================================================================
// Types
// ============================================================================

export interface TranslationCoverageStats {
  totalTranslatableProps: number;
  propsWithKeys: number;
  propsWithTranslations: number;
  coveragePercentage: number;
}

export interface ResolvedProps {
  props: Record<string, any>;
  hasTranslations: boolean;
}

interface UseEditorTranslationsOptions {
  pageUrl?: string;
  pageId?: string;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useEditorTranslations(options: UseEditorTranslationsOptions = {}) {
  const { currentLanguage, messages } = useI18n();
  const pageData = usePageData();
  const { 
    setTranslationKey: storeSetTranslationKey, 
    removeTranslationKey: storeRemoveTranslationKey 
  } = useEditorStore();
  
  // Use the translation engine for the new system
  const engine = useOptionalTranslationEngine();

  // Build a lookup map from translations - prioritize engine translations
  const translationLookup = useMemo(() => {
    const lookup: Record<string, Record<string, string>> = {};
    
    // If we have engine translations, use those (new system)
    if (engine?.translationLookup) {
      const langCode = currentLanguage?.code || 'en';
      lookup[langCode] = { ...engine.translationLookup };
    }
    
    return lookup;
  }, [engine?.translationLookup, currentLanguage?.code]);

  // Get the current language's translations - merge all sources
  const currentTranslations = useMemo(() => {
    const langCode = currentLanguage?.code || 'en';
    // Merge: messages (global) < engine lookup (page-specific)
    return { 
      ...messages, 
      ...(translationLookup[langCode] || {}),
      ...(engine?.translationLookup || {})
    };
  }, [currentLanguage?.code, messages, translationLookup, engine?.translationLookup]);

  /**
   * Resolve a single translation key to its value
   * Uses centralized resolver with engine lookup fallback
   */
  const resolveTranslationKey = useCallback((key: string): string | null => {
    // 1. First check engine's direct lookup (new system - takes priority)
    if (engine?.translationLookup?.[key]) {
      return engine.translationLookup[key];
    }
    
    // 2. Use centralized resolver for messages
    const resolved = resolveKey(key, messages);
    if (resolved) {
      return resolved;
    }
    
    // 3. Final fallback to merged translations
    return currentTranslations[key] || null;
  }, [messages, currentTranslations, engine?.translationLookup]);

  /**
   * Resolve translated props for a section
   * Returns the original props with translated values where translation keys exist
   */
  const resolveTranslatedProps = useCallback((section: SectionInstance): ResolvedProps => {
    const translationKeys = section.translationKeys || {};
    
    // CRITICAL: Deep copy props to ensure React detects changes
    const resolvedProps = deepClone(section.props || {});
    let hasTranslations = false;

    // Process each translation key binding
    Object.entries(translationKeys).forEach(([propPath, translationKey]) => {
      const translatedValue = resolveTranslationKey(translationKey);
      if (translatedValue) {
        hasTranslations = true;
        // Handle nested prop paths (e.g., "features.0.title")
        setNestedValue(resolvedProps, propPath, translatedValue);
      }
    });

    return { props: resolvedProps, hasTranslations };
  }, [resolveTranslationKey]);

  /**
   * Set a translation key for a section prop
   */
  const setTranslationKey = useCallback((
    sectionId: string,
    propPath: string,
    translationKey: string
  ) => {
    storeSetTranslationKey(sectionId, propPath, translationKey);
  }, [storeSetTranslationKey]);

  /**
   * Remove a translation key from a section prop
   */
  const removeTranslationKey = useCallback((
    sectionId: string,
    propPath: string
  ) => {
    storeRemoveTranslationKey(sectionId, propPath);
  }, [storeRemoveTranslationKey]);

  /**
   * Get all translation keys for a section
   */
  const getSectionTranslationKeys = useCallback((sectionId: string): TranslationKeyMap => {
    const section = pageData?.sections.find(s => s.id === sectionId);
    return section?.translationKeys || {};
  }, [pageData?.sections]);

  /**
   * Check if a prop has a translation key bound
   */
  const hasTranslationKey = useCallback((
    sectionId: string,
    propPath: string
  ): boolean => {
    const keys = getSectionTranslationKeys(sectionId);
    return propPath in keys;
  }, [getSectionTranslationKeys]);

  /**
   * Get the translation key for a specific prop
   */
  const getTranslationKey = useCallback((
    sectionId: string,
    propPath: string
  ): string | null => {
    const keys = getSectionTranslationKeys(sectionId);
    return keys[propPath] || null;
  }, [getSectionTranslationKeys]);

  /**
   * Calculate translation coverage for a section
   */
  const getSectionCoverageStats = useCallback((section: SectionInstance): TranslationCoverageStats => {
    const definition = getSectionDefinition(section.type);
    const translatableProps = definition?.translatableProps || [];
    const translationKeys = section.translationKeys || {};

    const totalTranslatableProps = translatableProps.length;
    const propsWithKeys = Object.keys(translationKeys).length;
    
    // Count how many of those keys have actual translations
    let propsWithTranslations = 0;
    Object.values(translationKeys).forEach(key => {
      if (resolveTranslationKey(key)) {
        propsWithTranslations++;
      }
    });

    const coveragePercentage = totalTranslatableProps > 0
      ? Math.round((propsWithKeys / totalTranslatableProps) * 100)
      : 100;

    return {
      totalTranslatableProps,
      propsWithKeys,
      propsWithTranslations,
      coveragePercentage,
    };
  }, [resolveTranslationKey]);

  /**
   * Calculate overall page translation coverage
   */
  const getPageCoverageStats = useCallback((): TranslationCoverageStats => {
    if (!pageData?.sections) {
      return {
        totalTranslatableProps: 0,
        propsWithKeys: 0,
        propsWithTranslations: 0,
        coveragePercentage: 100,
      };
    }

    let totalTranslatableProps = 0;
    let propsWithKeys = 0;
    let propsWithTranslations = 0;

    pageData.sections.forEach(section => {
      const stats = getSectionCoverageStats(section);
      totalTranslatableProps += stats.totalTranslatableProps;
      propsWithKeys += stats.propsWithKeys;
      propsWithTranslations += stats.propsWithTranslations;
    });

    const coveragePercentage = totalTranslatableProps > 0
      ? Math.round((propsWithKeys / totalTranslatableProps) * 100)
      : 100;

    return {
      totalTranslatableProps,
      propsWithKeys,
      propsWithTranslations,
      coveragePercentage,
    };
  }, [pageData?.sections, getSectionCoverageStats]);

  /**
   * Generate a suggested translation key based on section type and prop path
   */
  const generateSuggestedKey = useCallback((
    sectionType: string,
    propPath: string,
    namespace?: string
  ): string => {
    const ns = namespace || sectionType;
    const cleanPath = propPath.replace(/\./g, '_').replace(/\[(\d+)\]/g, '_$1');
    return `${ns}.${cleanPath}`;
  }, []);

  return {
    // State
    currentLanguage,
    translations: currentTranslations,
    
    // Resolution
    resolveTranslationKey,
    resolveTranslatedProps,
    
    // Key management
    setTranslationKey,
    removeTranslationKey,
    getSectionTranslationKeys,
    hasTranslationKey,
    getTranslationKey,
    
    // Coverage
    getSectionCoverageStats,
    getPageCoverageStats,
    
    // Utilities
    generateSuggestedKey,
  };
}

// Re-export getNestedValue for backward compatibility
export { getNestedValue } from '@/lib/translationResolver';

export default useEditorTranslations;
