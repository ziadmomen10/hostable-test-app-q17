/**
 * Legacy Translation Queries
 * 
 * Namespace-based translation queries for Header/Footer components.
 * For the new page builder, use useTranslationEngine instead.
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Translation {
  id: string;
  language_id: string;
  namespace: string | null;
  key: string;
  value: string | null;
  status: string | null;
  language_code?: string;
}

export const translationKeys = {
  all: ['translations'] as const,
  byNamespace: (namespace: string) => [...translationKeys.all, 'namespace', namespace] as const,
  byPage: (pageUrl: string) => [...translationKeys.all, 'page', pageUrl] as const,
  pageTranslations: (pageId: string) => [...translationKeys.all, 'page-translations', pageId] as const,
};

const getNamespaceFromUrl = (pageUrl: string): string => {
  if (!pageUrl) return 'page';
  if (pageUrl === '/' || pageUrl === '/home') return 'homepage';
  return pageUrl.replace(/^\//, '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'page';
};

/**
 * Fetch translations by namespace (used by Header/Footer)
 */
export const useTranslationsByNamespace = (namespace: string | undefined) => {
  return useQuery({
    queryKey: translationKeys.byNamespace(namespace || ''),
    queryFn: async () => {
      if (!namespace) return [];
      
      const { data, error } = await supabase
        .from('translations')
        .select(`
          id,
          language_id,
          namespace,
          key,
          value,
          status,
          languages!inner(code, name)
        `)
        .eq('namespace', namespace);
      
      if (error) throw error;
      
      return (data || []).map(t => ({
        ...t,
        language_code: (t.languages as any)?.code || '',
      })) as Translation[];
    },
    enabled: !!namespace,
    staleTime: 60 * 1000,
  });
};

/**
 * Fetch translations for a page and common namespaces (header, footer, common)
 */
export const usePageTranslationsQuery = (pageUrl: string | undefined) => {
  const namespace = useMemo(() => {
    if (!pageUrl) return null;
    return getNamespaceFromUrl(pageUrl);
  }, [pageUrl]);

  const namespacesToFetch = useMemo(() => {
    if (!namespace) return [];
    return [namespace, 'header', 'footer', 'common'];
  }, [namespace]);

  return useQuery({
    queryKey: translationKeys.byPage(pageUrl || ''),
    queryFn: async () => {
      if (!namespacesToFetch.length) return [];
      
      const { data: translationsData, error } = await supabase
        .from('translations')
        .select(`
          id,
          language_id,
          namespace,
          key,
          value,
          status
        `)
        .in('namespace', namespacesToFetch);

      if (error) throw error;

      const { data: languagesData } = await supabase
        .from('languages')
        .select('id, code, name')
        .eq('is_active', true);

      const languageMap = (languagesData || []).reduce((acc, lang) => {
        acc[lang.id] = lang.code;
        return acc;
      }, {} as Record<string, string>);

      return (translationsData || []).map(t => ({
        ...t,
        language_code: languageMap[t.language_id] || '',
      })) as Translation[];
    },
    enabled: !!pageUrl && namespacesToFetch.length > 0,
    staleTime: 60 * 1000,
  });
};
