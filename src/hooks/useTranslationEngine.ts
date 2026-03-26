/**
 * useTranslationEngine Hook
 * 
 * Core hook for managing translations with the new translation engine.
 * Handles key registry, translation values, AI translation, and coverage.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useI18n, clearTranslationCache } from '@/contexts/I18nContext';
import {
  TranslationKeyRecord,
  TranslationEntry,
  TranslationCoverage,
  TranslationStatus,
  AITranslationRequest,
  AITranslationResult,
  PageValidationResult,
  ValidationError,
  ValidationWarning,
} from '@/types/translationEngine';
import { generateTranslationKey, getPageSlugFromUrl } from '@/lib/translationKeyGenerator';

// ============================================================================
// Query Keys
// ============================================================================

const queryKeys = {
  translationKeys: (pageId: string) => ['translation-keys', pageId],
  translations: (pageId: string, languageCode: string) => ['translations', pageId, languageCode],
  coverage: (pageId: string) => ['translation-coverage', pageId],
  allLanguages: ['languages'],
};

// ============================================================================
// Hook
// ============================================================================

export function useTranslationEngine(pageId: string, pageUrl: string, targetLanguageCode?: string) {
  const queryClient = useQueryClient();
  const { currentLanguage, changeLanguage } = useI18n();
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Use targetLanguageCode if provided (for TranslationPanel), otherwise use I18n currentLanguage
  const effectiveLanguageCode = targetLanguageCode || (typeof currentLanguage === 'string' ? currentLanguage : (currentLanguage as any)?.code || 'en');

  // ========================================
  // Fetch Languages
  // ========================================
  
  const { data: languages = [] } = useQuery({
    queryKey: queryKeys.allLanguages,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // ========================================
  // Fetch Translation Keys for Page
  // ========================================
  
  const { data: translationKeys = [], isLoading: keysLoading } = useQuery({
    queryKey: queryKeys.translationKeys(pageId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translation_keys')
        .select('*')
        .eq('page_id', pageId)
        .eq('is_active', true);
      
      if (error) throw error;
      
      return data.map((row): TranslationKeyRecord => ({
        id: row.id,
        key: row.key,
        sourceText: row.source_text,
        sourceLanguage: row.source_language,
        context: row.context || undefined,
        pageId: row.page_id,
        sectionId: row.section_id || undefined,
        sectionType: row.section_type || undefined,
        propPath: row.prop_path || undefined,
        isActive: row.is_active ?? true,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));
    },
    enabled: !!pageId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // ========================================
  // Fetch Translations for Target Language
  // ========================================
  
  const { data: translations = [], isLoading: translationsLoading, refetch: refetchTranslations } = useQuery({
    queryKey: queryKeys.translations(pageId, effectiveLanguageCode),
    queryFn: async () => {
      console.log('[TranslationEngine] Fetching translations for:', effectiveLanguageCode);
      
      // Get language ID
      const lang = languages.find(l => l.code === effectiveLanguageCode);
      if (!lang) {
        console.log('[TranslationEngine] Language not found:', effectiveLanguageCode);
        return [];
      }
      
      // Get all keys for this page
      const keys = translationKeys.map(k => k.key);
      if (keys.length === 0) return [];
      
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .in('key', keys)
        .eq('language_id', lang.id);
      
      if (error) throw error;
      
      console.log('[TranslationEngine] Fetched', data?.length || 0, 'translations for', effectiveLanguageCode);
      
      return data.map((row): TranslationEntry => ({
        id: row.id,
        key: row.key,
        languageId: row.language_id,
        value: row.value,
        status: (row.status as TranslationStatus) || 'untranslated',
        sourceText: row.source_text || undefined,
        sourceLanguage: row.source_language || undefined,
        context: row.context || undefined,
        aiProvider: row.ai_provider || undefined,
        aiTranslatedAt: row.ai_translated_at ? new Date(row.ai_translated_at) : undefined,
        manuallyEditedAt: row.manually_edited_at ? new Date(row.manually_edited_at) : undefined,
        updatedAt: new Date(row.updated_at),
      }));
    },
    enabled: !!pageId && translationKeys.length > 0 && languages.length > 0,
    staleTime: 0, // Always refetch to ensure fresh data
    refetchOnWindowFocus: true,
  });

  // ========================================
  // Force Refetch When Language Changes
  // ========================================
  
  useEffect(() => {
    // When the effective language code changes, invalidate cache and refetch
    // This ensures the canvas shows translations in the selected language
    if (effectiveLanguageCode && languages.length > 0 && translationKeys.length > 0) {
      console.log('[TranslationEngine] Language changed to:', effectiveLanguageCode, '- invalidating and refetching');
      
      // Invalidate the old cache entries
      queryClient.invalidateQueries({
        queryKey: ['translations', pageId],
        refetchType: 'active',
      });
      
      // Force immediate refetch
      refetchTranslations();
    }
  }, [effectiveLanguageCode, languages.length, translationKeys.length, pageId, queryClient, refetchTranslations]);

  // ========================================
  // Fetch Coverage Stats
  // ========================================
  
  const { data: coverage = [], refetch: refetchCoverage } = useQuery({
    queryKey: queryKeys.coverage(pageId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translation_coverage_stats')
        .select('*')
        .eq('page_id', pageId);
      
      if (error) throw error;
      
      return data.map((row): TranslationCoverage => ({
        pageId: row.page_id,
        pageUrl: row.page_url,
        pageTitle: row.page_title,
        languageId: row.language_id,
        languageCode: row.language_code,
        languageName: row.language_name,
        totalKeys: Number(row.total_keys),
        translatedKeys: Number(row.translated_keys),
        untranslatedCount: Number(row.untranslated_count),
        aiTranslatedCount: Number(row.ai_translated_count),
        reviewedCount: Number(row.reviewed_count),
        editedCount: Number(row.edited_count),
        coveragePercentage: Number(row.coverage_percentage),
      }));
    },
    enabled: !!pageId,
    staleTime: 0,
  });

  // ========================================
  // Translation Lookup Map
  // ========================================
  
  const translationLookup = useMemo(() => {
    const lookup: Record<string, string> = {};
    for (const t of translations) {
      if (t.value) {
        lookup[t.key] = t.value;
      }
    }
    return lookup;
  }, [translations]);

  // ========================================
  // Register Translation Key
  // ========================================
  
  const registerKeyMutation = useMutation({
    mutationFn: async (params: {
      key: string;
      sourceText: string;
      pageId: string;
      sectionId: string;
      sectionType: string;
      propPath: string;
      context?: string;
    }) => {
      // Check if key already exists to avoid overwriting source_text
      const { data: existingKey } = await supabase
        .from('translation_keys')
        .select('id, source_text')
        .eq('key', params.key)
        .maybeSingle();
      
      if (existingKey) {
        // Key exists: update metadata but preserve source_text
        const { error } = await supabase
          .from('translation_keys')
          .update({
            page_id: params.pageId,
            section_id: params.sectionId,
            section_type: params.sectionType,
            prop_path: params.propPath,
            context: params.context,
            is_active: true,
          })
          .eq('key', params.key);
        
        if (error) throw error;
      } else {
        // Key is new: insert with source_text
        const { error } = await supabase
          .from('translation_keys')
          .upsert({
            key: params.key,
            source_text: params.sourceText,
            source_language: 'en',
            page_id: params.pageId,
            section_id: params.sectionId,
            section_type: params.sectionType,
            prop_path: params.propPath,
            context: params.context,
            is_active: true,
          }, {
            onConflict: 'key',
          });
        
        if (error) throw error;
      }
      
      // Also create the source language translation (only for new keys)
      const sourceLang = languages.find(l => l.code === 'en');
      if (sourceLang) {
        await supabase
          .from('translations')
          .upsert({
            key: params.key,
            language_id: sourceLang.id,
            value: params.sourceText,
            status: 'reviewed',
            source_text: params.sourceText,
            source_language: 'en',
            namespace: getPageSlugFromUrl(pageUrl),
          }, {
            onConflict: 'language_id,namespace,key',
            ignoreDuplicates: true,
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.translationKeys(pageId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.coverage(pageId) });
    },
  });

  // ========================================
  // Unregister Translation Key
  // ========================================
  
  const unregisterKeyMutation = useMutation({
    mutationFn: async (key: string) => {
      const { error } = await supabase
        .from('translation_keys')
        .update({ is_active: false })
        .eq('key', key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.translationKeys(pageId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.coverage(pageId) });
    },
  });

  // ========================================
  // Set Translation Value (with optimistic updates)
  // ========================================
  
  const setTranslationMutation = useMutation({
    mutationFn: async (params: {
      key: string;
      languageCode: string;
      value: string;
      status?: TranslationStatus;
    }) => {
      const lang = languages.find(l => l.code === params.languageCode);
      if (!lang) throw new Error(`Language ${params.languageCode} not found`);
      
      const keyRecord = translationKeys.find(k => k.key === params.key);
      
      // CRITICAL: Ensure sourceText is never undefined - fetch from DB if not in cache
      let sourceText = keyRecord?.sourceText;
      if (!sourceText) {
        const { data: keyData } = await supabase
          .from('translation_keys')
          .select('source_text')
          .eq('key', params.key)
          .single();
        sourceText = keyData?.source_text || params.value; // Fallback to the value itself
        console.warn(`[Translation] Source text not in cache for ${params.key}, fetched from DB: ${sourceText?.slice(0, 30)}`);
      }
      
      console.log('[Translation] Saving:', { key: params.key, lang: params.languageCode, value: params.value.slice(0, 50) });
      
      const { error } = await supabase
        .from('translations')
        .upsert({
          key: params.key,
          language_id: lang.id,
          value: params.value,
          status: params.status || 'edited',
          source_text: sourceText,
          source_language: 'en',
          namespace: getPageSlugFromUrl(pageUrl),
          manually_edited_at: params.status === 'edited' ? new Date().toISOString() : undefined,
        }, {
          onConflict: 'language_id,namespace,key',
          ignoreDuplicates: false,
        });
      
      if (error) {
        console.error('[Translation] Save failed:', error);
        throw error;
      }
      
      console.log('[Translation] Save successful');
      return { key: params.key, value: params.value, status: params.status || 'edited', languageCode: params.languageCode };
    },
    // Optimistic update for instant UI feedback - use params.languageCode not currentLangCode
    onMutate: async (params) => {
      const targetLangCode = params.languageCode;
      
      // Cancel outgoing refetches for the TARGET language
      await queryClient.cancelQueries({ queryKey: queryKeys.translations(pageId, targetLangCode) });
      
      // Snapshot previous value for the target language
      const previousTranslations = queryClient.getQueryData<TranslationEntry[]>(
        queryKeys.translations(pageId, targetLangCode)
      );
      
      // Optimistically update the cache for the TARGET language
      queryClient.setQueryData<TranslationEntry[]>(
        queryKeys.translations(pageId, targetLangCode),
        (old = []) => {
          const existing = old.find(t => t.key === params.key);
          if (existing) {
            return old.map(t => 
              t.key === params.key 
                ? { ...t, value: params.value, status: (params.status || 'edited') as TranslationStatus }
                : t
            );
          }
          // Add new entry
          const lang = languages.find(l => l.code === params.languageCode);
          return [...old, {
            id: `temp-${Date.now()}`,
            key: params.key,
            languageId: lang?.id || '',
            value: params.value,
            status: (params.status || 'edited') as TranslationStatus,
            updatedAt: new Date(),
          }];
        }
      );
      
      return { previousTranslations, targetLangCode };
    },
    onError: (err, params, context) => {
      console.error('[Translation] Error, rolling back:', err);
      // Rollback on error using the correct language
      if (context?.previousTranslations && context?.targetLangCode) {
        queryClient.setQueryData(
          queryKeys.translations(pageId, context.targetLangCode),
          context.previousTranslations
        );
      }
    },
    onSettled: (data, _error, _variables, _context) => {
      // Invalidate the correct language's query and coverage
      if (data?.languageCode) {
        queryClient.invalidateQueries({ queryKey: queryKeys.translations(pageId, data.languageCode) });
        
        // CRITICAL: Clear I18nContext cache so live pages get fresh data
        const lang = languages.find(l => l.code === data.languageCode);
        if (lang?.id) {
          clearTranslationCache(lang.id);
        }
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.coverage(pageId) });
    },
  });

  // ========================================
  // AI Translation
  // ========================================
  
  const translateWithAI = useCallback(async (request: AITranslationRequest): Promise<AITranslationResult> => {
    try {
      const response = await supabase.functions.invoke('ai-translate', {
        body: {
          sourceText: request.sourceText,
          sourceLanguage: request.sourceLanguage,
          targetLanguages: request.targetLanguages,
        },
      });
      
      if (response.error) {
        return { translations: {}, error: response.error.message };
      }
      
      return response.data as AITranslationResult;
    } catch (error) {
      return { 
        translations: {}, 
        error: error instanceof Error ? error.message : 'Translation failed' 
      };
    }
  }, []);

  // ========================================
  // Bulk Translate Keys (using batch API)
  // ========================================
  
  const translateKeys = useCallback(async (
    keysToTranslate: string[],
    targetLanguageCodes: string[],
    onProgress?: (completed: number, total: number) => void
  ) => {
    // =========================================================================
    // CRITICAL FIX: Always fetch fresh keys from database
    // Never rely on cache which might be empty or stale
    // =========================================================================
    
    console.log('[translateKeys] Starting translation:', {
      keysToTranslate: keysToTranslate.length,
      targetLanguageCodes,
    });
    
    if (keysToTranslate.length === 0) {
      console.warn('[translateKeys] No keys provided');
      return;
    }
    
    setIsTranslating(true);
    
    try {
      const targetLanguages = languages
        .filter(l => targetLanguageCodes.includes(l.code))
        .map(l => ({ code: l.code, name: l.name, id: l.id }));
      
      if (targetLanguages.length === 0) {
        console.error('[translateKeys] No valid target languages found');
        return;
      }
      
      console.log('[translateKeys] Target languages:', targetLanguages.map(l => l.code));
      
      // CRITICAL: ALWAYS fetch fresh keys from database - never rely on cache
      console.log('[translateKeys] Fetching fresh keys from database...');
      const { data: freshKeys, error: keysError } = await supabase
        .from('translation_keys')
        .select('key, source_text, context')
        .in('key', keysToTranslate)
        .eq('is_active', true);
      
      if (keysError) {
        console.error('[translateKeys] Failed to fetch keys:', keysError);
        throw new Error('Failed to fetch translation keys from database');
      }
      
      if (!freshKeys || freshKeys.length === 0) {
        console.error('[translateKeys] No keys found in database for:', keysToTranslate.slice(0, 5));
        throw new Error('No translation keys found in database');
      }
      
      console.log('[translateKeys] Fresh keys from DB:', freshKeys.length);
      
      // Build batch items from fresh database data
      const items = freshKeys
        .filter(k => k.source_text && k.source_text.trim() !== '')
        .map(k => ({
          key: k.key,
          sourceText: k.source_text,
          context: k.context,
        }));
      
      console.log('[translateKeys] Items to translate after filtering:', items.length);
      
      if (items.length === 0) {
        console.warn('[translateKeys] No valid items after filtering empty source text');
        return;
      }

      // Process in batches of 15
      const BATCH_SIZE = 15;
      const batches = [];
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        batches.push(items.slice(i, i + BATCH_SIZE));
      }

      let completed = 0;
      const namespace = getPageSlugFromUrl(pageUrl);
      const now = new Date().toISOString();

      for (const batch of batches) {
        // Use batch endpoint
        const response = await supabase.functions.invoke('ai-translate-batch', {
          body: {
            items: batch,
            sourceLanguage: 'en',
            targetLanguages: targetLanguages.map(l => ({ code: l.code, name: l.name })),
          },
        });

        if (response.error) {
          console.error('Batch translation failed:', response.error);
          continue;
        }

        const { results = {} } = response.data;

        // Save all translations in one batch upsert
        const records: any[] = [];
        for (const [key, translations] of Object.entries(results as Record<string, Record<string, string>>)) {
          // Use the items array which has fresh source_text from DB
          const itemRecord = items.find(i => i.key === key);
          for (const [langCode, value] of Object.entries(translations)) {
            const lang = targetLanguages.find(l => l.code === langCode);
            if (!lang || !value) continue;
            
            records.push({
              key,
              language_id: lang.id,
              value,
              status: 'ai_translated',
              source_text: itemRecord?.sourceText,
              source_language: 'en',
              namespace,
              ai_provider: 'lovable-ai',
              ai_translated_at: now,
            });
          }
        }

        if (records.length > 0) {
          const { error: upsertError } = await supabase
            .from('translations')
            .upsert(records, { onConflict: 'language_id,namespace,key', ignoreDuplicates: false });
          
          if (upsertError) {
            console.error('[Translation] Failed to save batch translations:', upsertError);
          } else {
            console.log('[Translation] Saved', records.length, 'translations successfully');
          }
        }

        completed += batch.length;
        onProgress?.(completed, items.length);
      }
      
      // Force immediate refetch for ALL target languages to update UI
      console.log('[Translation] Refetching translations for languages:', targetLanguageCodes);
      for (const langCode of targetLanguageCodes) {
        await queryClient.refetchQueries({ queryKey: queryKeys.translations(pageId, langCode) });
        
        // CRITICAL: Clear I18nContext cache for this language so live pages get fresh data
        const lang = languages.find(l => l.code === langCode);
        if (lang?.id) {
          clearTranslationCache(lang.id);
        }
      }
      await queryClient.refetchQueries({ queryKey: queryKeys.coverage(pageId) });
      
      console.log('[Translation] All refetch completed');
    } finally {
      setIsTranslating(false);
    }
  }, [languages, translationKeys, pageId, pageUrl, effectiveLanguageCode, queryClient]);

  // ========================================
  // Validate Page
  // ========================================
  
  const validatePage = useCallback(async (): Promise<PageValidationResult> => {
    const { data, error } = await supabase
      .rpc('validate_page_translations', { p_page_id: pageId });
    
    if (error) {
      return {
        isValid: false,
        errorCount: 1,
        warningCount: 0,
        errors: [{ type: 'missing_key', message: error.message }],
        warnings: [],
      };
    }
    
    const result = data?.[0];
    return {
      isValid: result?.is_valid ?? true,
      errorCount: result?.error_count ?? 0,
      warningCount: result?.warning_count ?? 0,
      errors: (result?.errors as unknown as ValidationError[]) ?? [],
      warnings: (result?.warnings as unknown as ValidationWarning[]) ?? [],
    };
  }, [pageId]);

  // ========================================
  // Get Translation for Key
  // ========================================
  
  const getTranslation = useCallback((key: string): string | null => {
    return translationLookup[key] || null;
  }, [translationLookup]);

  // ========================================
  // Resolve Translated Props for Section
  // ========================================
  
  const resolveTranslatedProps = useCallback((
    sectionProps: Record<string, any>,
    translationKeyMap: Record<string, string>
  ): { props: Record<string, any>; hasTranslations: boolean } => {
    if (!translationKeyMap || Object.keys(translationKeyMap).length === 0) {
      return { props: sectionProps, hasTranslations: false };
    }
    
    let hasTranslations = false;
    const resolvedProps = { ...sectionProps };
    
    for (const [propPath, key] of Object.entries(translationKeyMap)) {
      const translatedValue = getTranslation(key);
      if (translatedValue) {
        setNestedValue(resolvedProps, propPath, translatedValue);
        hasTranslations = true;
      }
    }
    
    return { props: resolvedProps, hasTranslations };
  }, [getTranslation]);

  // ========================================
  // Generate Key for Prop
  // ========================================
  
  const generateKeyForProp = useCallback((
    sectionType: string,
    sectionId: string,
    propPath: string
  ): string => {
    return generateTranslationKey({
      pageSlug: getPageSlugFromUrl(pageUrl),
      sectionType,
      sectionId,
      propPath,
    });
  }, [pageUrl]);

  // ========================================
  // Return Value
  // ========================================
  
  return {
    // State
    isLoading: keysLoading || translationsLoading,
    isTranslating,
    currentLanguage,
    languages,
    
    // Data
    translationKeys,
    translations,
    translationLookup,
    coverage,
    
    // Key Management
    registerKey: registerKeyMutation.mutateAsync,
    unregisterKey: unregisterKeyMutation.mutateAsync,
    generateKeyForProp,
    
    // Translation Values
    getTranslation,
    setTranslation: setTranslationMutation.mutateAsync,
    resolveTranslatedProps,
    
    // AI Translation
    translateWithAI,
    translateKeys,
    
    // Validation
    validatePage,
    
    // Language
    setCurrentLanguage: changeLanguage,
    
    // Refetch functions for forcing UI updates
    refetchTranslations,
    refetchCoverage,
  };
}

// ============================================================================
// Helpers
// ============================================================================

function setNestedValue(obj: Record<string, any>, path: string, value: any): void {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
    
    if (arrayMatch) {
      const [, arrayName, indexStr] = arrayMatch;
      const index = parseInt(indexStr, 10);
      if (!current[arrayName]) current[arrayName] = [];
      if (!current[arrayName][index]) current[arrayName][index] = {};
      current = current[arrayName][index];
    } else {
      if (!current[part]) current[part] = {};
      current = current[part];
    }
  }
  
  const lastPart = parts[parts.length - 1];
  const lastArrayMatch = lastPart.match(/^(.+)\[(\d+)\]$/);
  
  if (lastArrayMatch) {
    const [, arrayName, indexStr] = lastArrayMatch;
    const index = parseInt(indexStr, 10);
    if (!current[arrayName]) current[arrayName] = [];
    current[arrayName][index] = value;
  } else {
    current[lastPart] = value;
  }
}
