/**
 * useKeywordRanks
 * 
 * Hook to manage keyword rank tracking data.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface KeywordRank {
  id: string;
  page_id: string;
  keyword: string;
  position: number | null;
  previous_position: number | null;
  search_engine: string;
  checked_at: string;
  created_at: string;
}

export function useKeywordRanks(pageId: string) {
  const queryClient = useQueryClient();

  // Fetch all ranks for page
  const query = useQuery({
    queryKey: ['keyword-ranks', pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_keyword_ranks')
        .select('*')
        .eq('page_id', pageId)
        .order('checked_at', { ascending: false });
      
      if (error) throw error;
      return data as KeywordRank[];
    },
    enabled: !!pageId,
  });

  // Add new keyword
  const addKeyword = useMutation({
    mutationFn: async (keyword: string) => {
      const { data, error } = await supabase
        .from('seo_keyword_ranks')
        .insert({
          page_id: pageId,
          keyword,
          search_engine: 'google',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyword-ranks', pageId] });
      toast.success('Keyword added for tracking');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add keyword');
    },
  });

  // Update position
  const updatePosition = useMutation({
    mutationFn: async ({ keyword, position }: { keyword: string; position: number }) => {
      // Get current position to store as previous
      const current = query.data?.find(r => r.keyword === keyword);
      
      const { error } = await supabase
        .from('seo_keyword_ranks')
        .insert({
          page_id: pageId,
          keyword,
          position,
          previous_position: current?.position || null,
          search_engine: 'google',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyword-ranks', pageId] });
      toast.success('Position updated');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update position');
    },
  });

  // Delete keyword
  const deleteKeyword = useMutation({
    mutationFn: async (keyword: string) => {
      const { error } = await supabase
        .from('seo_keyword_ranks')
        .delete()
        .eq('page_id', pageId)
        .eq('keyword', keyword);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyword-ranks', pageId] });
      toast.success('Keyword removed');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to remove keyword');
    },
  });

  // Get latest position for each keyword
  const latestRanks = query.data?.reduce((acc, rank) => {
    if (!acc[rank.keyword] || new Date(rank.checked_at) > new Date(acc[rank.keyword].checked_at)) {
      acc[rank.keyword] = rank;
    }
    return acc;
  }, {} as Record<string, KeywordRank>) || {};

  return {
    ranks: query.data || [],
    latestRanks: Object.values(latestRanks),
    isLoading: query.isLoading,
    addKeyword,
    updatePosition,
    deleteKeyword,
  };
}
