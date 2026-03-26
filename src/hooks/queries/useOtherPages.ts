/**
 * useOtherPages Hook
 * 
 * React Query hook for fetching other pages and extracting their sections
 * for use in the Visual Page Editor's section import feature.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Types defined locally since editorState was removed
export interface OtherPage {
  id: string;
  page_url: string;
  page_title: string;
  content: string | null;
}

export interface ExtractedSection {
  pageId: string;
  pageTitle: string;
  sectionId: string;
  sectionName: string;
  content: string;
}

export const otherPagesKeys = {
  all: ['otherPages'] as const,
  forPage: (excludePageId: string) => [...otherPagesKeys.all, excludePageId] as const,
};

interface UseOtherPagesResult {
  pages: OtherPage[];
  sections: ExtractedSection[];
}

export function useOtherPages(excludePageId: string) {
  return useQuery({
    queryKey: otherPagesKeys.forPage(excludePageId),
    queryFn: async (): Promise<UseOtherPagesResult> => {
      const { data, error } = await supabase
        .from('pages')
        .select('id, page_url, page_title, content')
        .neq('id', excludePageId)
        .eq('is_active', true);

      if (error) throw error;

      const pages = (data || []) as OtherPage[];

      // Extract sections from all pages
      const allSections: ExtractedSection[] = [];
      const sectionRegex = /<section[^>]*data-section=["']([^"']+)["'][^>]*>([\s\S]*?)<\/section>/gi;

      pages.forEach(page => {
        if (page.content) {
          let match;
          // Reset regex lastIndex for each page
          sectionRegex.lastIndex = 0;
          while ((match = sectionRegex.exec(page.content)) !== null) {
            allSections.push({
              pageId: page.id,
              pageTitle: page.page_title,
              sectionId: match[1],
              sectionName: match[1]
                .replace(/-/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase()),
              content: match[0],
            });
          }
        }
      });

      return { pages, sections: allSections };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!excludePageId,
  });
}
