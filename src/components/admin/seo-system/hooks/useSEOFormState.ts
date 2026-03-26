/**
 * useSEOFormState
 * 
 * Track unsaved changes across all SEO form panels.
 * Provides dirty detection and save coordination.
 * Enhanced with secondaryKeywords support and proper cache invalidation.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { seoQueryKeys } from './queryKeys';

export interface SEOFormData {
  // Meta
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  // Technical
  canonicalUrl: string;
  noIndex: boolean;
  noFollow: boolean;
  structuredData: string;
}

const defaultFormData: SEOFormData = {
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  secondaryKeywords: [],
  ogTitle: '',
  ogDescription: '',
  ogImageUrl: '',
  canonicalUrl: '',
  noIndex: false,
  noFollow: false,
  structuredData: '',
};

interface UseSEOFormStateOptions {
  pageId: string;
  languageCode: string;
  pageTitle?: string;
  pageDescription?: string;
  pageOgImage?: string;
}

export function useSEOFormState({ 
  pageId, 
  languageCode, 
  pageTitle = '', 
  pageDescription = '',
  pageOgImage = ''
}: UseSEOFormStateOptions) {
  const [formData, setFormData] = useState<SEOFormData>(defaultFormData);
  const [originalData, setOriginalData] = useState<SEOFormData>(defaultFormData);
  const [hasInitialized, setHasInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Fetch SEO data - creates record if missing for non-default language
  const { data: seoData, isLoading, refetch } = useQuery({
    queryKey: seoQueryKeys.pageSeo(pageId, languageCode),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_id', pageId)
        .eq('language_code', languageCode)
        .maybeSingle();
      
      if (error) throw error;
      
      // If no SEO record exists for this language, create one with defaults
      if (!data && languageCode !== 'en') {
        console.log('[useSEOFormState] Creating SEO record for language:', languageCode);
        const { data: newRecord, error: insertError } = await supabase
          .from('page_seo')
          .insert({
            page_id: pageId,
            language_code: languageCode,
            meta_title: pageTitle || '',
            meta_description: pageDescription || '',
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('[useSEOFormState] Failed to create SEO record:', insertError);
          return null;
        }
        return newRecord;
      }
      
      return data;
    },
    enabled: !!pageId && pageId !== '__placeholder__',
  });

  // Track loading transition state for UI indicators
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset form data and invalidate cache when page or language changes
  useEffect(() => {
    setIsTransitioning(true);
    setHasInitialized(false);
    setFormData(defaultFormData);
    setOriginalData(defaultFormData);
    // Invalidate stale cache to force refetch
    queryClient.invalidateQueries({ queryKey: seoQueryKeys.pageSeo(pageId, languageCode) });
  }, [pageId, languageCode, queryClient]);

  // Initialize form data when SEO data loads
  useEffect(() => {
    if (!seoData && !isLoading) {
      // Handle case where no data exists yet
      const newData: SEOFormData = {
        metaTitle: pageTitle,
        metaDescription: pageDescription,
        focusKeyword: '',
        secondaryKeywords: [],
        ogTitle: '',
        ogDescription: '',
        ogImageUrl: pageOgImage,
        canonicalUrl: '',
        noIndex: false,
        noFollow: false,
        structuredData: '',
      };
      setFormData(newData);
      setOriginalData(newData);
      setHasInitialized(true);
      setIsTransitioning(false);
      return;
    }

    if (seoData) {
      const newData: SEOFormData = {
        metaTitle: seoData.meta_title || pageTitle,
        metaDescription: seoData.meta_description || pageDescription,
        focusKeyword: seoData.focus_keyword || '',
        secondaryKeywords: seoData.secondary_keywords || [],
        ogTitle: seoData.og_title || '',
        ogDescription: seoData.og_description || '',
        ogImageUrl: seoData.og_image_url || pageOgImage,
        canonicalUrl: seoData.canonical_url || '',
        noIndex: seoData.no_index || false,
        noFollow: seoData.no_follow || false,
        structuredData: seoData.structured_data 
          ? JSON.stringify(seoData.structured_data, null, 2) 
          : '',
      };
      
      setFormData(newData);
      setOriginalData(newData);
      setHasInitialized(true);
      setIsTransitioning(false);
    }
  }, [seoData, isLoading, pageTitle, pageDescription, pageOgImage]);

  // Check if form is dirty
  const isDirty = useMemo(() => {
    if (!hasInitialized) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData, hasInitialized]);

  // Update individual field
  const updateField = useCallback(<K extends keyof SEOFormData>(
    field: K, 
    value: SEOFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update multiple fields at once
  const updateFields = useCallback((updates: Partial<SEOFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Mark as clean (after successful save)
  const markClean = useCallback(() => {
    setOriginalData(formData);
  }, [formData]);

  // Reset to original
  const reset = useCallback(() => {
    setFormData(originalData);
  }, [originalData]);

  // Get SEO record ID for updates
  const seoId = seoData?.id;

  return {
    formData,
    updateField,
    updateFields,
    isDirty,
    isLoading: isLoading || isTransitioning,
    hasInitialized,
    isTransitioning,
    markClean,
    reset,
    refetch,
    seoId,
    // Expose original data for history comparison
    originalData,
  };
}
