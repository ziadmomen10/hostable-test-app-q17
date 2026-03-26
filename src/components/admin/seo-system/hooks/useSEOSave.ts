/**
 * useSEOSave
 * 
 * Extracted save mutation logic from SEORightPanel.
 * Handles validation, history logging, and cache invalidation.
 * 
 * Gap A2: SEORightPanel refactoring
 */

import { useCallback, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { seoQueryKeys } from './queryKeys';
import { useSEOHistory } from './useSEOHistory';
import type { SEOFormData, useSEOFormState } from './useSEOFormState';

// Field name mapping for history
const FIELD_MAP: Record<keyof SEOFormData, string> = {
  metaTitle: 'meta_title',
  metaDescription: 'meta_description',
  focusKeyword: 'focus_keyword',
  secondaryKeywords: 'secondary_keywords',
  ogTitle: 'og_title',
  ogDescription: 'og_description',
  ogImageUrl: 'og_image_url',
  canonicalUrl: 'canonical_url',
  noIndex: 'no_index',
  noFollow: 'no_follow',
  structuredData: 'structured_data',
};

interface UseSEOSaveOptions {
  pageId: string;
  languageCode: string;
  formState: ReturnType<typeof useSEOFormState>;
  seoScore: number;
  aeoScore: number;
  geoScore: number;
  onSuccess?: () => void;
}

export function useSEOSave({
  pageId,
  languageCode,
  formState,
  seoScore,
  aeoScore,
  geoScore,
  onSuccess,
}: UseSEOSaveOptions) {
  const queryClient = useQueryClient();
  const { logChange } = useSEOHistory({ pageId, languageCode, limit: 1 });
  
  // Gap L2: Track intended save context to prevent race conditions
  const saveContextRef = useRef({ pageId, languageCode });
  
  useEffect(() => {
    saveContextRef.current = { pageId, languageCode };
  }, [pageId, languageCode]);

  // Detect changed fields for history logging
  const detectChangedFields = useCallback((
    original: SEOFormData,
    current: SEOFormData
  ): { name: string; oldValue: string; newValue: string }[] => {
    const changes: { name: string; oldValue: string; newValue: string }[] = [];
    
    for (const [key, dbField] of Object.entries(FIELD_MAP)) {
      const formKey = key as keyof SEOFormData;
      const oldVal = original[formKey];
      const newVal = current[formKey];
      
      const oldStr = typeof oldVal === 'object' ? JSON.stringify(oldVal) : String(oldVal ?? '');
      const newStr = typeof newVal === 'object' ? JSON.stringify(newVal) : String(newVal ?? '');
      
      if (oldStr !== newStr) {
        changes.push({
          name: dbField,
          oldValue: oldStr,
          newValue: newStr,
        });
      }
    }
    
    return changes;
  }, []);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Guard against empty/invalid pageId (prevents UUID parse error)
      if (!pageId || pageId === '__placeholder__') {
        throw new Error('No page selected. Please select a page first.');
      }

      // Gap L2: Verify context hasn't changed during async operations
      if (saveContextRef.current.pageId !== pageId || 
          saveContextRef.current.languageCode !== languageCode) {
        throw new Error('Context changed during save - aborting to prevent data corruption');
      }

      // Guard against save during transition
      if (formState.isTransitioning) {
        throw new Error('Cannot save while switching page or language. Please wait.');
      }

      // Validate structured data JSON
      let parsedStructuredData = null;
      if (formState.formData.structuredData.trim()) {
        try {
          parsedStructuredData = JSON.parse(formState.formData.structuredData);
        } catch {
          throw new Error('Invalid JSON in structured data. Please check the Technical tab.');
        }
      }

      const seoRecord = {
        page_id: pageId,
        language_code: languageCode,
        meta_title: formState.formData.metaTitle,
        meta_description: formState.formData.metaDescription,
        focus_keyword: formState.formData.focusKeyword,
        secondary_keywords: formState.formData.secondaryKeywords,
        og_title: formState.formData.ogTitle,
        og_description: formState.formData.ogDescription,
        og_image_url: formState.formData.ogImageUrl,
        canonical_url: formState.formData.canonicalUrl || null,
        no_index: formState.formData.noIndex,
        no_follow: formState.formData.noFollow,
        structured_data: parsedStructuredData,
        seo_score: seoScore,
        aeo_score: aeoScore,
        geo_score: geoScore,
        updated_at: new Date().toISOString(),
      };

      const originalData = formState.originalData;

      if (formState.seoId) {
        const { error } = await supabase
          .from('page_seo')
          .update(seoRecord)
          .eq('id', formState.seoId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('page_seo')
          .insert(seoRecord);
        if (error) throw error;
      }

      return { originalData };
    },
    onSuccess: ({ originalData }) => {
      // Log changes to history
      const changedFields = detectChangedFields(originalData, formState.formData);
      changedFields.forEach((field) => {
        try {
          logChange({
            page_id: pageId,
            language_code: languageCode,
            change_type: 'update',
            field_name: field.name,
            old_value: field.oldValue,
            new_value: field.newValue,
            changed_by: null,
          });
        } catch (error) {
          console.error('Failed to log history:', error);
        }
      });

      formState.markClean();
      
      // Invalidate all related queries using centralized keys
      queryClient.invalidateQueries({ queryKey: seoQueryKeys.pageSeo(pageId, languageCode) });
      queryClient.invalidateQueries({ queryKey: seoQueryKeys.analysis(pageId, languageCode) });
      queryClient.invalidateQueries({ queryKey: seoQueryKeys.pageSeoLanguages(pageId) });
      queryClient.invalidateQueries({ queryKey: seoQueryKeys.history(pageId, languageCode) });
      
      toast.success(`SEO saved for ${languageCode.toUpperCase()}`);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Failed to save: ' + (error as Error).message);
    },
  });

  return {
    saveMutation,
    save: useCallback(() => {
      if (formState.isDirty) {
        saveMutation.mutate();
      }
    }, [formState.isDirty, saveMutation]),
  };
}
