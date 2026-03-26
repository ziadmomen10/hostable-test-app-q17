import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { pageKeys } from './usePageData';

interface UsePageRealtimeOptions {
  enabled?: boolean;
  onUpdate?: (payload: any) => void;
}

export const usePageRealtime = (
  pageId: string | undefined,
  options: UsePageRealtimeOptions = {}
) => {
  const { enabled = true, onUpdate } = options;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!pageId || !enabled) return;

    console.log('Setting up real-time subscription for page:', pageId);

    const channel = supabase
      .channel(`page-updates-${pageId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pages',
          filter: `id=eq.${pageId}`,
        },
        (payload) => {
          console.log('Page updated via real-time:', payload);
          
          // Invalidate the query to refetch fresh data
          queryClient.invalidateQueries({ queryKey: pageKeys.detail(pageId) });
          
          // Call optional callback
          onUpdate?.(payload);
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Unsubscribing from page updates:', pageId);
      supabase.removeChannel(channel);
    };
  }, [pageId, enabled, queryClient, onUpdate]);
};

export const usePagesListRealtime = (options: UsePageRealtimeOptions = {}) => {
  const { enabled = true, onUpdate } = options;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel('pages-list-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pages',
        },
        (payload) => {
          console.log('Pages list updated:', payload.eventType);
          
          // Invalidate the pages list query
          queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
          
          // If it's an update, also invalidate the specific page
          if (payload.eventType === 'UPDATE' && payload.new) {
            const pageId = (payload.new as any).id;
            if (pageId) {
              queryClient.invalidateQueries({ queryKey: pageKeys.detail(pageId) });
            }
          }
          
          onUpdate?.(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, queryClient, onUpdate]);
};
