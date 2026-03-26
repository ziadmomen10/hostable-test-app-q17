/**
 * useSEOHistory
 * 
 * Hook for managing SEO change history with rollback capability.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { seoQueryKeys } from './queryKeys';

export interface SEOHistoryEntry {
  id: string;
  page_id: string;
  language_code: string;
  changed_by: string | null;
  change_type: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}

interface UseSEOHistoryOptions {
  pageId: string;
  languageCode: string;
  limit?: number;
}

export function useSEOHistory({ pageId, languageCode, limit = 20 }: UseSEOHistoryOptions) {
  const queryClient = useQueryClient();

  // Fetch history entries - Gap A1: Use centralized query keys
  const { data: history, isLoading, error } = useQuery({
    queryKey: seoQueryKeys.history(pageId, languageCode),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_history')
        .select('*')
        .eq('page_id', pageId)
        .eq('language_code', languageCode)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as SEOHistoryEntry[];
    },
    enabled: !!pageId,
  });

  // Log a change
  const logChange = useMutation({
    mutationFn: async (entry: Omit<SEOHistoryEntry, 'id' | 'created_at'>) => {
      const { error } = await supabase
        .from('seo_history')
        .insert(entry);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seoQueryKeys.history(pageId, languageCode) });
    },
  });

  // Rollback to a previous value
  // Accepts an optional onRollbackComplete callback to sync form state
  const rollback = useMutation({
    mutationFn: async ({ entry, onRollbackComplete }: { 
      entry: SEOHistoryEntry; 
      onRollbackComplete?: (fieldName: string, value: string) => void;
    }) => {
      if (!entry.field_name || entry.old_value === null) {
        throw new Error('Cannot rollback: no field or value');
      }

      // Update the page_seo record
      const { error } = await supabase
        .from('page_seo')
        .update({ [entry.field_name]: entry.old_value })
        .eq('page_id', pageId)
        .eq('language_code', languageCode);

      if (error) throw error;

      // Log the rollback as a new change
      await supabase.from('seo_history').insert({
        page_id: pageId,
        language_code: languageCode,
        change_type: 'rollback',
        field_name: entry.field_name,
        old_value: entry.new_value,
        new_value: entry.old_value,
      });

      return { entry, onRollbackComplete };
    },
    onSuccess: ({ entry, onRollbackComplete }) => {
      queryClient.invalidateQueries({ queryKey: seoQueryKeys.history(pageId, languageCode) });
      queryClient.invalidateQueries({ queryKey: seoQueryKeys.pageSeo(pageId, languageCode) });
      
      // Call the callback to sync form state with rolled back value
      if (onRollbackComplete && entry.field_name && entry.old_value !== null) {
        onRollbackComplete(entry.field_name, entry.old_value);
      }
      
      toast.success('Rolled back successfully');
    },
    onError: (error) => {
      toast.error('Rollback failed: ' + (error as Error).message);
    },
  });

  // Convenience wrapper that accepts just the entry (for backward compatibility)
  const rollbackEntry = (entry: SEOHistoryEntry, onRollbackComplete?: (fieldName: string, value: string) => void) => {
    rollback.mutate({ entry, onRollbackComplete });
  };

  return {
    history: history || [],
    isLoading,
    error,
    logChange: logChange.mutate,
    rollback: rollbackEntry,
    isRollingBack: rollback.isPending,
  };
}

// Helper to format field names for display
export function formatFieldName(fieldName: string): string {
  const fieldMap: Record<string, string> = {
    meta_title: 'Meta Title',
    meta_description: 'Meta Description',
    focus_keyword: 'Focus Keyword',
    og_title: 'OG Title',
    og_description: 'OG Description',
    og_image_url: 'OG Image',
    canonical_url: 'Canonical URL',
    no_index: 'No Index',
    no_follow: 'No Follow',
    structured_data: 'Structured Data',
  };
  return fieldMap[fieldName] || fieldName;
}

// Helper to format change type
export function formatChangeType(changeType: string): string {
  const typeMap: Record<string, string> = {
    update: 'Updated',
    create: 'Created',
    rollback: 'Rolled back',
    ai_generated: 'AI Generated',
  };
  return typeMap[changeType] || changeType;
}
