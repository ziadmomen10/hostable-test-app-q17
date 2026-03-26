import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { pageKeys, PageData } from './usePageData';

interface UpdatePageParams {
  pageId: string;
  updates: Partial<PageData>;
}

export const useUpdatePage = (options?: { showToast?: boolean }) => {
  const queryClient = useQueryClient();
  const showToast = options?.showToast ?? true;

  return useMutation({
    mutationFn: async ({ pageId, updates }: UpdatePageParams) => {
      const { error } = await supabase
        .from('pages')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pageId);

      if (error) throw error;
      return { pageId, updates };
    },
    onMutate: async ({ pageId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: pageKeys.detail(pageId) });

      // Snapshot the previous value
      const previousPage = queryClient.getQueryData<PageData>(pageKeys.detail(pageId));

      // Optimistically update
      if (previousPage) {
        queryClient.setQueryData<PageData>(pageKeys.detail(pageId), {
          ...previousPage,
          ...updates,
        });
      }

      return { previousPage };
    },
    onError: (err, { pageId }, context) => {
      // Rollback on error
      if (context?.previousPage) {
        queryClient.setQueryData(pageKeys.detail(pageId), context.previousPage);
      }
      if (showToast) {
        toast.error('Failed to save page');
      }
      console.error('Page save error:', err);
    },
    onSuccess: (_, { pageId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
      
      // Also invalidate URL-based query if we have the page data
      const pageData = queryClient.getQueryData<PageData>(pageKeys.detail(pageId));
      if (pageData?.page_url) {
        queryClient.invalidateQueries({ queryKey: pageKeys.byUrl(pageData.page_url) });
      }
      
      if (showToast) {
        toast.success('Page saved successfully');
      }
    },
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pageData: Omit<PageData, 'id'>) => {
      const { data, error } = await supabase
        .from('pages')
        .insert(pageData)
        .select()
        .single();

      if (error) throw error;
      return data as PageData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
      toast.success('Page created successfully');
    },
    onError: (err) => {
      toast.error('Failed to create page');
      console.error('Page create error:', err);
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pageId: string) => {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
      return pageId;
    },
    onSuccess: (pageId) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
      queryClient.removeQueries({ queryKey: pageKeys.detail(pageId) });
      toast.success('Page deleted successfully');
    },
    onError: (err) => {
      toast.error('Failed to delete page');
      console.error('Page delete error:', err);
    },
  });
};
