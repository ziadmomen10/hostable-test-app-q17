import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PageData {
  id: string;
  page_url: string;
  page_title: string;
  page_description: string | null;
  page_keywords: string | null;
  header_image_url: string | null;
  og_image_url: string | null;
  is_active: boolean;
  content: string | null;
  css_content: string | null;
  cloned_from_id: string | null;
  country: string | null;
  supported_languages: string[];
  show_price_switcher: boolean;
  default_currency: string | null;
  blog_tags: string | null;
  hidden_sections: string[];
}

export const pageKeys = {
  all: ['pages'] as const,
  lists: () => [...pageKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...pageKeys.lists(), filters] as const,
  details: () => [...pageKeys.all, 'detail'] as const,
  detail: (id: string) => [...pageKeys.details(), id] as const,
  byUrl: (url: string) => [...pageKeys.all, 'url', url] as const,
};

export const usePageDataById = (pageId: string | undefined) => {
  return useQuery({
    queryKey: pageKeys.detail(pageId || ''),
    queryFn: async () => {
      if (!pageId) throw new Error('Page ID required');
      
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .single();
      
      if (error) throw error;
      return data as PageData;
    },
    enabled: !!pageId,
    staleTime: 0, // Always fresh in editor context
  });
};

export const usePageDataByUrl = (pageUrl: string | undefined) => {
  return useQuery({
    queryKey: pageKeys.byUrl(pageUrl || ''),
    queryFn: async () => {
      if (!pageUrl) throw new Error('Page URL required');
      
      const pathWithSlash = pageUrl.startsWith('/') ? pageUrl : `/${pageUrl}`;
      const pathWithoutSlash = pageUrl.startsWith('/') ? pageUrl.substring(1) : pageUrl;
      
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .or(`page_url.eq.${pathWithSlash},page_url.eq.${pathWithoutSlash}`)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as PageData | null;
    },
    enabled: !!pageUrl,
    staleTime: 30 * 1000, // 30 seconds for public pages
  });
};

export const usePagesList = (filters?: { isActive?: boolean }) => {
  return useQuery({
    queryKey: pageKeys.list(filters || {}),
    queryFn: async () => {
      let query = supabase.from('pages').select('*');
      
      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PageData[];
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

export const usePrefetchPage = () => {
  const queryClient = useQueryClient();
  
  return (pageId: string) => {
    queryClient.prefetchQuery({
      queryKey: pageKeys.detail(pageId),
      queryFn: async () => {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('id', pageId)
          .single();
        
        if (error) throw error;
        return data as PageData;
      },
    });
  };
};
