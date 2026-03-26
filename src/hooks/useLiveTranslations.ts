/**
 * useLiveTranslations Hook
 * 
 * Provides translation resolution for live rendering of sections.
 * Uses I18n context messages and section translationKeys to resolve translated values.
 * 
 * FIXED: Properly waits for language loading and forces re-renders on language change.
 */

import { useCallback, useMemo } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { SectionInstance } from '@/types/reactEditor';
import { resolveTranslationKey, setNestedValue } from '@/lib/translationResolver';

// Deep clone utility
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as T;
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

interface UseLiveTranslationsResult {
  /**
   * Resolves translated props for a section based on its translationKeys map.
   * Returns original props if no translations are needed (default language or no keys).
   */
  resolveTranslatedProps: (section: SectionInstance) => Record<string, unknown>;
  
  /**
   * Current messages version - use as dependency to trigger re-renders when messages update.
   */
  messagesVersion: number;
  
  /**
   * Current language code for keying components.
   */
  currentLanguage: string;
  
  /**
   * Whether currently on the default language (no translation needed).
   */
  isDefaultLanguage: boolean;
  
  /**
   * Whether translations are still loading.
   */
  isLoading: boolean;
}

export function useLiveTranslations(): UseLiveTranslationsResult {
  const { messages, messagesVersion, currentLanguage, languages, isLoading } = useI18n();
  
  // Get the default language code
  const defaultLanguage = useMemo(() => {
    return languages.find(l => l.is_default)?.code || 'en';
  }, [languages]);
  
  const currentLangCode = currentLanguage?.code || null;
  
  // Only skip translation if we're definitively on the default language
  // If still loading or no current language, we should NOT skip (wait for resolution)
  const isDefaultLanguage = !isLoading && currentLangCode !== null && currentLangCode === defaultLanguage;
  
  // Enable debug logging for non-default languages
  const enableDebug = !isDefaultLanguage && currentLangCode !== null;

  const resolveTranslatedProps = useCallback((section: SectionInstance): Record<string, unknown> => {
    const resolvedProps = deepClone(section.props || {});
    const translationKeys = section.translationKeys || {};
    
    // Log resolution state for debugging
    if (enableDebug) {
      console.warn('[LiveTranslations] resolveTranslatedProps:', {
        sectionId: section.id?.slice(-12),
        sectionType: section.type,
        translationKeysCount: Object.keys(translationKeys).length,
        currentLangCode,
        isDefaultLanguage,
        isLoading,
        messagesCount: Object.keys(messages).length,
      });
    }
    
    // Skip translation if:
    // 1. No translation keys bound to this section
    // 2. We're on the default language (use source values)
    // NOTE: Removed isLoading check - let resolution happen with available messages
    // Loading state is handled by the component (shows skeleton)
    if (Object.keys(translationKeys).length === 0 || isDefaultLanguage) {
      return resolvedProps;
    }
    
    // Prop paths that should NEVER be translated (numeric values for currency conversion)
    const numericPropPatterns = ['price', 'Price', 'originalPrice', 'discountedPrice', 'discount'];
    const isNumericProp = (propPath: string) => 
      numericPropPatterns.some(pattern => propPath.toLowerCase().includes(pattern.toLowerCase()));
    
    // Resolve each translation key
    for (const [propPath, translationKey] of Object.entries(translationKeys)) {
      if (!translationKey || typeof translationKey !== 'string') continue;
      
      // CRITICAL: Skip numeric props that shouldn't be translated
      // These are converted dynamically via PriceDisplay component
      if (isNumericProp(propPath)) {
        if (enableDebug) {
          console.log('[LiveTranslations] Skipping numeric prop:', propPath);
        }
        continue;
      }
      
      const translatedValue = resolveTranslationKey(translationKey, messages, enableDebug);
      
      if (translatedValue !== null) {
        setNestedValue(resolvedProps, propPath, translatedValue);
        if (enableDebug) {
          console.log('[LiveTranslations] Applied translation:', {
            propPath,
            key: translationKey.slice(-30),
            value: translatedValue.slice(0, 50),
          });
        }
      } else if (enableDebug) {
        console.warn('[LiveTranslations] Translation not found:', {
          propPath,
          key: translationKey,
        });
      }
    }
    
    return resolvedProps;
  }, [messages, isDefaultLanguage, currentLangCode, messagesVersion, isLoading, enableDebug]);

  return {
    resolveTranslatedProps,
    messagesVersion,
    currentLanguage: currentLangCode || defaultLanguage,
    isDefaultLanguage,
    isLoading,
  };
}

export default useLiveTranslations;
