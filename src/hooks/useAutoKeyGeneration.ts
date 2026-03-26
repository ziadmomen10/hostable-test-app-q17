/**
 * useAutoKeyGeneration Hook
 * 
 * Automatically generates translation keys for all translatable props in all sections.
 * Keys are generated on page load and when sections are added/updated.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SectionInstance } from '@/types/reactEditor';
import { getSectionDefinition } from '@/lib/sectionDefinitions';
import { generateTranslationKey, getPageSlugFromUrl } from '@/lib/translationKeyGenerator';
import { toast } from 'sonner';
import { useEditorStore } from '@/stores/editorStore';
import { getSectionPropsContainer } from '@/lib/sectionUtils';

// ============================================================================
// Types
// ============================================================================

interface TranslatableProp {
  sectionId: string;
  sectionType: string;
  sectionIndex: number;
  propPath: string;
  sourceText: string;
  generatedKey: string;
  context?: string;
}

interface UseAutoKeyGenerationOptions {
  pageId: string;
  pageUrl: string;
  sections: SectionInstance[];
  /** Original sections (before translation resolution) - used for extracting source text */
  originalSections?: SectionInstance[];
  enabled?: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get any nested value from object (for checking arrays, objects, etc.)
 * Used by expandWildcardPaths to retrieve arrays for expansion
 */
function getNestedAny(obj: Record<string, any>, path: string): any {
  const parts = path.split('.');
  let current: any = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (part === '*') return undefined; // Wildcard means we need to expand
    current = current[part];
  }
  
  return current;
}

/**
 * Derive a human-readable context hint from the property path
 * to help AI make better translation decisions
 */
function getContextFromPropPath(propPath: string, sectionType: string): string {
  const parts = propPath.toLowerCase();
  
  // Button/CTA context
  if (parts.includes('button') || parts.includes('cta') || parts.includes('action')) {
    return 'button text';
  }
  
  // Heading context
  if (parts.includes('title') || parts.includes('heading') || parts.includes('badge')) {
    return 'heading';
  }
  
  // Description context
  if (parts.includes('description') || parts.includes('subtitle') || parts.includes('text')) {
    return 'description';
  }
  
  // Price/value context
  if (parts.includes('price') || parts.includes('value') || parts.includes('amount')) {
    return 'price or value';
  }
  
  // Label context
  if (parts.includes('label') || parts.includes('name')) {
    return 'label';
  }
  
  // Question/Answer context (FAQ)
  if (parts.includes('question')) return 'FAQ question';
  if (parts.includes('answer')) return 'FAQ answer';
  
  // Testimonial context
  if (parts.includes('role') || parts.includes('position')) {
    return 'job title or role';
  }
  
  // Default: use section type
  return `${sectionType} content`;
}

/**
 * Get nested STRING value from object (for getting translatable text)
 */
function getNestedString(obj: Record<string, any>, path: string): string | null {
  const value = getNestedAny(obj, path);
  return typeof value === 'string' ? value : null;
}

/**
 * Expand wildcard paths (e.g., "features.*.title") into concrete paths
 * based on actual array data
 */
function expandWildcardPaths(
  props: Record<string, any>,
  translatableProps: string[]
): string[] {
  const expandedPaths: string[] = [];
  
  // Skip logging in production - these fire on every render cycle
  
  if (!props || typeof props !== 'object') {
    console.warn('[expandWildcardPaths] Props is empty or invalid:', props);
    return translatableProps.filter(p => !p.includes('.*'));
  }
  
  for (const propPath of translatableProps) {
    if (propPath.includes('.*')) {
      // Use indexOf to correctly split: 'features.*.title' -> arrayPath='features', propertyPath='title'
      const wildcardIndex = propPath.indexOf('.*');
      const arrayPath = propPath.substring(0, wildcardIndex);
      const afterWildcard = propPath.substring(wildcardIndex + 2); // Skip '.*'
      // Remove leading dot if present (e.g., '.title' -> 'title')
      const propertyPath = afterWildcard.startsWith('.') 
        ? afterWildcard.substring(1) 
        : afterWildcard;
      
      // Get the array from props - use getNestedAny to get the actual array
      const array = getNestedAny(props, arrayPath);
      
      // Array lookup for wildcard expansion
      
      if (Array.isArray(array) && array.length > 0) {
        for (let i = 0; i < array.length; i++) {
          if (propertyPath) {
            const nestedPath = `${arrayPath}.${i}.${propertyPath}`;
            // Recursively expand if there are more wildcards
            if (propertyPath.includes('.*')) {
              const subPaths = expandWildcardPaths(props, [nestedPath]);
              expandedPaths.push(...subPaths);
            } else {
              expandedPaths.push(nestedPath);
            }
          } else {
            expandedPaths.push(`${arrayPath}.${i}`);
          }
        }
      } else {
        console.warn(`[AutoKeyGen] Expected array at '${arrayPath}' but got:`, typeof array, array);
      }
    } else {
      expandedPaths.push(propPath);
    }
  }
  
  
  return expandedPaths;
}

/**
 * Extract all translatable props from a section with their current values.
 * Handles both regular sections and sections with `usesDataWrapper: true`.
 * 
 * NOTE: sectionIndex is kept for display purposes only - keys now use section.id
 */
function extractTranslatableProps(
  section: SectionInstance,
  sectionIndex: number,
  pageSlug: string
): TranslatableProp[] {
  const definition = getSectionDefinition(section.type);
  if (!definition?.translatableProps) {
    return [];
  }
  
  // CRITICAL FIX: Use getSectionPropsContainer to handle usesDataWrapper sections
  // For sections with usesDataWrapper: true, props are in section.props.data
  const sectionProps = getSectionPropsContainer(section);
  
  const props: TranslatableProp[] = [];
  
  // Expand wildcards to get concrete paths
  const expandedPaths = expandWildcardPaths(sectionProps, definition.translatableProps);
  
  for (const propPath of expandedPaths) {
    const sourceText = getNestedString(sectionProps, propPath);
    if (!sourceText || typeof sourceText !== 'string' || sourceText.trim() === '') {
      continue;
    }
    
    // Use section.id (stable UUID) instead of sectionIndex (volatile)
    const generatedKey = generateTranslationKey({
      pageSlug,
      sectionType: section.type,
      sectionId: section.id,
      propPath,
    });
    
    props.push({
      sectionId: section.id,
      sectionType: section.type,
      sectionIndex,
      propPath,
      sourceText,
      generatedKey,
      context: getContextFromPropPath(propPath, section.type),
    });
  }
  
  return props;
}

// ============================================================================
// Hook
// ============================================================================

export function useAutoKeyGeneration({
  pageId,
  pageUrl,
  sections,
  originalSections,
  enabled = true,
}: UseAutoKeyGenerationOptions) {
  const queryClient = useQueryClient();
  const lastGeneratedRef = useRef<string>('');
  const isGeneratingRef = useRef(false);
  
  // Use original sections for source text extraction (to avoid translation contamination)
  // Fall back to sections if originalSections not provided
  const sectionsForSourceText = originalSections || sections;
  
  // Mutation for bulk key registration
  const registerKeysMutation = useMutation({
    mutationFn: async (translatableProps: TranslatableProp[]) => {
      console.log('[AutoKeyGen] Starting mutation with', translatableProps.length, 'props');
      
      if (translatableProps.length === 0) {
        console.warn('[AutoKeyGen] No translatable props to register');
        return { count: 0 };
      }
      
      // Filter out props without valid source text
      const validProps = translatableProps.filter(prop => 
        prop.sourceText && prop.sourceText.trim() !== ''
      );
      
      if (validProps.length === 0) {
        console.warn('[AutoKeyGen] All props have empty source text');
        return { count: 0 };
      }
      
      // CRITICAL: Deduplicate by generatedKey to prevent PostgreSQL 
      // "ON CONFLICT DO UPDATE cannot affect a row a second time" error
      const uniquePropsMap = new Map<string, TranslatableProp>();
      validProps.forEach(prop => {
        if (!uniquePropsMap.has(prop.generatedKey)) {
          uniquePropsMap.set(prop.generatedKey, prop);
        } else {
          console.warn('[AutoKeyGen] Duplicate key in mutation, keeping first:', prop.generatedKey);
        }
      });
      const finalProps = Array.from(uniquePropsMap.values());
      
      console.log('[AutoKeyGen] Final props after dedup:', finalProps.length, 
        `(removed ${validProps.length - finalProps.length} duplicates)`);
      
      // Get English language for source translations
      const { data: languages, error: langError } = await supabase
        .from('languages')
        .select('id, code')
        .eq('code', 'en')
        .single();
      
      if (langError) {
        console.error('[AutoKeyGen] Failed to fetch English language:', langError);
      }
      
      const englishLangId = languages?.id;
      console.log('[AutoKeyGen] English language ID:', englishLangId);
      
      // STALE DETECTION FIX: Fetch existing keys to avoid overwriting source_text
      const { data: existingKeyRecords } = await supabase
        .from('translation_keys')
        .select('key, section_id, prop_path')
        .eq('page_id', pageId)
        .eq('is_active', true);
      
      const existingKeySet = new Set(
        existingKeyRecords?.map(k => `${k.section_id}:${k.prop_path}`) || []
      );
      
      // Split into new keys vs existing keys
      const newProps = finalProps.filter(p => !existingKeySet.has(`${p.sectionId}:${p.propPath}`));
      const existingProps = finalProps.filter(p => existingKeySet.has(`${p.sectionId}:${p.propPath}`));
      
      console.log('[AutoKeyGen] New keys:', newProps.length, 'Existing keys:', existingProps.length);
      
      // NEW keys: upsert WITH source_text (initial binding)
      if (newProps.length > 0) {
        const newKeyRecords = newProps.map(prop => ({
          key: prop.generatedKey,
          source_text: prop.sourceText.trim(),
          source_language: 'en',
          context: prop.context,
          page_id: pageId,
          section_id: prop.sectionId,
          section_type: prop.sectionType,
          prop_path: prop.propPath,
          is_active: true,
        }));
        
        const { error: newKeysError } = await supabase
          .from('translation_keys')
          .upsert(newKeyRecords, { 
            onConflict: 'page_id,section_id,prop_path',
            ignoreDuplicates: false,
          });
        
        if (newKeysError) {
          console.error('[AutoKeyGen] New keys upsert failed:', newKeysError);
          throw new Error(`Failed to save new translation keys: ${newKeysError.message}`);
        }
      }
      
      // EXISTING keys: batch update metadata only (preserve source_text for stale detection)
      if (existingProps.length > 0) {
        const existingKeyRecordsToUpsert = existingProps.map(prop => ({
          key: prop.generatedKey,
          source_text: '', // placeholder - won't overwrite due to onConflict strategy
          source_language: 'en',
          context: prop.context,
          page_id: pageId,
          section_id: prop.sectionId,
          section_type: prop.sectionType,
          prop_path: prop.propPath,
          is_active: true,
        }));
        
        // Use raw SQL via RPC to update only metadata columns, preserving source_text
        // We update each record's metadata without touching source_text
        const updatePromises = [];
        const BATCH_SIZE = 20;
        for (let i = 0; i < existingProps.length; i += BATCH_SIZE) {
          const batch = existingProps.slice(i, i + BATCH_SIZE);
          const keys = batch.map(p => p.generatedKey);
          updatePromises.push(
            supabase
              .from('translation_keys')
              .update({
                is_active: true,
                updated_at: new Date().toISOString(),
              })
              .eq('page_id', pageId)
              .in('key', keys)
          );
        }
        
        const results = await Promise.all(updatePromises);
        const errors = results.filter(r => r.error);
        if (errors.length > 0) {
          console.warn('[AutoKeyGen] Some batch updates failed:', errors.length);
        }
      }
      
      console.log('[AutoKeyGen] Keys upserted successfully (source_text preserved for existing)');
      
      // Also create source language translations (only for NEW keys)
      if (englishLangId) {
        // New keys: create translation records with source_text and value
        if (newProps.length > 0) {
          const newTranslationRecords = newProps.map(prop => ({
            key: prop.generatedKey,
            language_id: englishLangId,
            value: prop.sourceText.trim(),
            status: 'reviewed',
            source_text: prop.sourceText.trim(),
            source_language: 'en',
            namespace: getPageSlugFromUrl(pageUrl),
          }));
          
          const { error: newTranslationError } = await supabase
            .from('translations')
            .upsert(newTranslationRecords, {
              onConflict: 'language_id,namespace,key',
              ignoreDuplicates: false,
            });
          
          if (newTranslationError) {
            console.error('[AutoKeyGen] Failed to save new source translations:', newTranslationError);
          } else {
            console.log('[AutoKeyGen] New source translations saved successfully');
          }
        }
        
        // Existing keys: skip - don't overwrite source_text or value
        // source_text will only be updated when user explicitly re-translates stale keys
        if (existingProps.length > 0) {
          console.log('[AutoKeyGen] Skipping', existingProps.length, 'existing translation records (preserving source_text for stale detection)');
        }
      }
      
      return { count: finalProps.length };
    },
    onSuccess: (data, translatableProps) => {
      // Deduplicate again for binding (since translatableProps is the original input)
      const uniqueMap = new Map<string, TranslatableProp>();
      translatableProps.forEach(prop => {
        if (!uniqueMap.has(prop.generatedKey)) {
          uniqueMap.set(prop.generatedKey, prop);
        }
      });
      const uniqueProps = Array.from(uniqueMap.values());
      
      console.log('[AutoKeyGen] Mutation succeeded, updating store with', uniqueProps.length, 'keys');
      
      // Invalidate translation queries (including panel queries for stale detection)
      queryClient.invalidateQueries({ queryKey: ['translation-keys', pageId] });
      queryClient.invalidateQueries({ queryKey: ['translation-coverage', pageId] });
      queryClient.invalidateQueries({ queryKey: ['translations-panel', pageId] });
      
      // CRITICAL: Update translationKeys in the editor store so they get saved to page content
      const { setTranslationKey, setHasUnsavedChanges } = useEditorStore.getState();
      uniqueProps.forEach(prop => {
        try {
          setTranslationKey(prop.sectionId, prop.propPath, prop.generatedKey);
        } catch (e) {
          console.error('[AutoKeyGen] Failed to bind key:', prop.generatedKey, 'to section:', prop.sectionId, e);
        }
      });
      
      console.log('[AutoKeyGen] Updated translationKeys on sections:', uniqueProps.length);
      
      // CRITICAL FIX: Mark dirty to trigger autosave so keys are persisted to page content
      // Note: setTranslationKey already sets hasUnsavedChanges but we ensure it here
      if (uniqueProps.length > 0) {
        setHasUnsavedChanges(true);
        console.log('[AutoKeyGen] Marked editor dirty to trigger autosave');
      }
    },
    onError: (error) => {
      console.error('[AutoKeyGen] Mutation failed with error:', error);
    },
  });

  // Generate keys for all sections
  const generateAllKeys = useCallback(async (force = false) => {
    // Allow force=true to bypass the enabled check (for manual "Keys" button)
    if ((!enabled && !force) || !pageId || sectionsForSourceText.length === 0) {
      console.log('[AutoKeyGen] generateAllKeys skipped:', { enabled, force, pageId, sectionsCount: sectionsForSourceText.length });
      return;
    }
    if (isGeneratingRef.current) {
      console.log('[AutoKeyGen] Already generating, skipping...');
      return;
    }
    
    const pageSlug = getPageSlugFromUrl(pageUrl);
    
    // Extract all translatable props from original sections (to get correct source text)
    const allProps: TranslatableProp[] = [];
    sectionsForSourceText.forEach((section, index) => {
      const sectionProps = extractTranslatableProps(section, index, pageSlug);
      allProps.push(...sectionProps);
    });
    
    
    
    if (allProps.length === 0) return;
    
    // CRITICAL: Deduplicate by generatedKey before checking fingerprint
    const uniquePropsMap = new Map<string, TranslatableProp>();
    allProps.forEach(prop => {
      if (!uniquePropsMap.has(prop.generatedKey)) {
        uniquePropsMap.set(prop.generatedKey, prop);
      }
    });
    const deduplicatedProps = Array.from(uniquePropsMap.values());
    
    
    
    // Create a fingerprint to avoid duplicate registrations (skip if force=true)
    const fingerprint = JSON.stringify(deduplicatedProps.map(p => `${p.generatedKey}:${p.sourceText}`).sort());
    if (!force && fingerprint === lastGeneratedRef.current) {
      console.log('[AutoKeyGen] Skipping - fingerprint unchanged');
      return;
    }
    
    isGeneratingRef.current = true;
    lastGeneratedRef.current = fingerprint;
    
    try {
      // CLEANUP: Deactivate orphan keys for sections no longer in the page
      const currentSectionIds = [...new Set(deduplicatedProps.map(p => p.sectionId))];
      
      if (currentSectionIds.length > 0) {
        console.log('[AutoKeyGen] Current section IDs:', currentSectionIds);
        
        // First, get all active keys for this page to find orphans
        const { data: existingKeys, error: fetchError } = await supabase
          .from('translation_keys')
          .select('id, section_id')
          .eq('page_id', pageId)
          .eq('is_active', true);
        
        if (fetchError) {
          console.warn('[AutoKeyGen] Failed to fetch existing keys:', fetchError);
        } else if (existingKeys && existingKeys.length > 0) {
          // Find orphan keys (section_id not in current sections)
          const orphanKeyIds = existingKeys
            .filter(k => k.section_id && !currentSectionIds.includes(k.section_id))
            .map(k => k.id);
          
          if (orphanKeyIds.length > 0) {
            console.log('[AutoKeyGen] Found', orphanKeyIds.length, 'orphan keys to deactivate');
            
            // Deactivate orphan keys by ID
            const { error: cleanupError } = await supabase
              .from('translation_keys')
              .update({ is_active: false, updated_at: new Date().toISOString() })
              .in('id', orphanKeyIds);
              
            if (cleanupError) {
              console.warn('[AutoKeyGen] Orphan cleanup warning:', cleanupError);
            } else {
              console.log('[AutoKeyGen] Deactivated', orphanKeyIds.length, 'orphan keys');
            }
          } else {
            console.log('[AutoKeyGen] No orphan keys found');
          }
        }
      }
      
      console.log('[AutoKeyGen] Calling mutateAsync with', deduplicatedProps.length, 'props');
      const result = await registerKeysMutation.mutateAsync(deduplicatedProps);
      console.log('[AutoKeyGen] mutateAsync completed:', result);
      toast.success(`Generated ${result.count} translation keys`);
    } catch (error) {
      console.error('[AutoKeyGen] generateAllKeys caught error:', error);
      // Re-throw so caller can handle it
      throw error;
    } finally {
      isGeneratingRef.current = false;
    }
  }, [enabled, pageId, pageUrl, sectionsForSourceText, registerKeysMutation]);

  // Generate keys for a single section (used when adding new sections)
  const generateKeysForSection = useCallback(async (
    section: SectionInstance,
    sectionIndex: number,
    force = false
  ) => {
    // Allow force=true to bypass the enabled check
    if ((!enabled && !force) || !pageId) return;
    
    // For new sections, use the section as-is since it's fresh from creation
    const pageSlug = getPageSlugFromUrl(pageUrl);
    const sectionProps = extractTranslatableProps(section, sectionIndex, pageSlug);
    
    if (sectionProps.length === 0) return;
    
    await registerKeysMutation.mutateAsync(sectionProps);
  }, [enabled, pageId, pageUrl, registerKeysMutation]);

  // Fetch existing translation keys from DB
  const { data: existingKeys } = useQuery({
    queryKey: ['translation-keys', pageId],
    queryFn: async () => {
      const { data } = await supabase
        .from('translation_keys')
        .select('key, section_id, prop_path')
        .eq('page_id', pageId)
        .eq('is_active', true);
      return data || [];
    },
    enabled: !!pageId && enabled,
    staleTime: 5000,
  });
  
  // Auto-bind existing keys to sections on page load
  useEffect(() => {
    if (!existingKeys || existingKeys.length === 0 || !sections || sections.length === 0) return;
    
    const { setTranslationKey, pageData } = useEditorStore.getState();
    if (!pageData?.sections) return;
    
    let bindCount = 0;
    
    existingKeys.forEach(keyRecord => {
      const section = pageData.sections.find(s => s.id === keyRecord.section_id);
      // Only bind if section exists and key not already bound
      if (section && !section.translationKeys?.[keyRecord.prop_path]) {
        setTranslationKey(keyRecord.section_id, keyRecord.prop_path, keyRecord.key);
        bindCount++;
      }
    });
    
    if (bindCount > 0) {
      console.log('[AutoKeyGen] Auto-bound', bindCount, 'existing keys to sections');
    }
  }, [existingKeys, sections]);
  
  // Auto-generate on mount and section changes
  useEffect(() => {
    if (enabled && sectionsForSourceText.length > 0) {
      // Debounce to avoid rapid re-registrations
      const timeout = setTimeout(() => {
        generateAllKeys();
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [enabled, sectionsForSourceText, generateAllKeys]);

  // Get all translatable props for display in UI
  // Uses original sections for source text to prevent translation contamination
  const getAllTranslatableProps = useCallback((): TranslatableProp[] => {
    const pageSlug = getPageSlugFromUrl(pageUrl);
    const allProps: TranslatableProp[] = [];
    
    sectionsForSourceText.forEach((section, index) => {
      const sectionProps = extractTranslatableProps(section, index, pageSlug);
      allProps.push(...sectionProps);
    });
    
    return allProps;
  }, [pageUrl, sectionsForSourceText]);

  return {
    generateAllKeys,
    generateKeysForSection,
    getAllTranslatableProps,
    isGenerating: registerKeysMutation.isPending,
  };
}

export default useAutoKeyGeneration;
