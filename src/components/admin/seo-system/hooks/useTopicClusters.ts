/**
 * useTopicClusters
 * 
 * Hook for managing topic clusters and content relationships.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TopicCluster {
  id: string;
  cluster_name: string;
  cluster_description: string | null;
  pillar_page_id: string | null;
  color: string;
  created_at: string;
  updated_at: string;
  pages?: ClusterPage[];
  pillarPage?: { id: string; page_title: string; page_url: string } | null;
}

export interface ClusterPage {
  id: string;
  cluster_id: string;
  page_id: string;
  relationship_type: 'pillar' | 'cluster_content' | 'supporting';
  link_strength: number;
  created_at: string;
  page?: { id: string; page_title: string; page_url: string };
}

export function useTopicClusters() {
  const queryClient = useQueryClient();

  // Fetch all clusters with their pages
  const { data: clusters, isLoading, error } = useQuery({
    queryKey: ['topic-clusters'],
    queryFn: async () => {
      const { data: clustersData, error: clustersError } = await supabase
        .from('seo_topic_clusters')
        .select(`
          *,
          pillarPage:pages!seo_topic_clusters_pillar_page_id_fkey(id, page_title, page_url)
        `)
        .order('created_at', { ascending: false });

      if (clustersError) throw clustersError;

      // Fetch cluster pages for each cluster
      const clusterIds = (clustersData || []).map(c => c.id);
      
      if (clusterIds.length === 0) return [];

      const { data: clusterPagesData, error: pagesError } = await supabase
        .from('seo_cluster_pages')
        .select(`
          *,
          page:pages(id, page_title, page_url)
        `)
        .in('cluster_id', clusterIds);

      if (pagesError) throw pagesError;

      // Merge pages into clusters
      return (clustersData || []).map(cluster => ({
        ...cluster,
        pages: (clusterPagesData || []).filter(cp => cp.cluster_id === cluster.id),
      })) as TopicCluster[];
    },
    staleTime: 60 * 1000,
  });

  // Create new cluster
  const createClusterMutation = useMutation({
    mutationFn: async (input: { name: string; description?: string; pillarPageId?: string; color?: string }) => {
      const { data, error } = await supabase
        .from('seo_topic_clusters')
        .insert({
          cluster_name: input.name,
          cluster_description: input.description || null,
          pillar_page_id: input.pillarPageId || null,
          color: input.color || '#3b82f6',
        })
        .select()
        .single();

      if (error) throw error;
      return data as TopicCluster;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topic-clusters'] });
      toast.success('Topic cluster created');
    },
    onError: () => {
      toast.error('Failed to create cluster');
    },
  });

  // Update cluster
  const updateClusterMutation = useMutation({
    mutationFn: async (input: { id: string; name?: string; description?: string; pillarPageId?: string; color?: string }) => {
      const updates: Record<string, any> = {};
      if (input.name !== undefined) updates.cluster_name = input.name;
      if (input.description !== undefined) updates.cluster_description = input.description;
      if (input.pillarPageId !== undefined) updates.pillar_page_id = input.pillarPageId;
      if (input.color !== undefined) updates.color = input.color;

      const { data, error } = await supabase
        .from('seo_topic_clusters')
        .update(updates)
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw error;
      return data as TopicCluster;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topic-clusters'] });
      toast.success('Cluster updated');
    },
    onError: () => {
      toast.error('Failed to update cluster');
    },
  });

  // Delete cluster
  const deleteClusterMutation = useMutation({
    mutationFn: async (clusterId: string) => {
      const { error } = await supabase
        .from('seo_topic_clusters')
        .delete()
        .eq('id', clusterId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topic-clusters'] });
      toast.success('Cluster deleted');
    },
    onError: () => {
      toast.error('Failed to delete cluster');
    },
  });

  // Add page to cluster
  const addPageToClusterMutation = useMutation({
    mutationFn: async (input: { clusterId: string; pageId: string; relationshipType?: string }) => {
      const { data, error } = await supabase
        .from('seo_cluster_pages')
        .insert({
          cluster_id: input.clusterId,
          page_id: input.pageId,
          relationship_type: input.relationshipType || 'cluster_content',
        })
        .select()
        .single();

      if (error) throw error;
      return data as ClusterPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topic-clusters'] });
      toast.success('Page added to cluster');
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('Page is already in this cluster');
      } else {
        toast.error('Failed to add page');
      }
    },
  });

  // Remove page from cluster
  const removePageFromClusterMutation = useMutation({
    mutationFn: async (clusterPageId: string) => {
      const { error } = await supabase
        .from('seo_cluster_pages')
        .delete()
        .eq('id', clusterPageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topic-clusters'] });
      toast.success('Page removed from cluster');
    },
    onError: () => {
      toast.error('Failed to remove page');
    },
  });

  // AI suggest clusters based on content
  const suggestClustersMutation = useMutation({
    mutationFn: async (pages: Array<{ id: string; title: string; url: string; description?: string }>) => {
      // Gap 2.1: Updated to pass pages in context.pages for edge function
      const { data, error } = await supabase.functions.invoke('seo-ai-tools', {
        body: {
          action: 'suggest_topic_clusters',
          context: { pages },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      return data.clusters as Array<{
        name: string;
        description: string;
        pillarPageId?: string;
        pageIds: string[];
      }>;
    },
    onSuccess: () => {
      toast.success('Cluster suggestions generated');
    },
    onError: (error) => {
      console.error('[useTopicClusters] Suggestion error:', error);
      toast.error('Failed to generate suggestions');
    },
  });

  return {
    clusters: clusters || [],
    isLoading,
    error,
    createCluster: createClusterMutation.mutate,
    isCreating: createClusterMutation.isPending,
    updateCluster: updateClusterMutation.mutate,
    isUpdating: updateClusterMutation.isPending,
    deleteCluster: deleteClusterMutation.mutate,
    isDeleting: deleteClusterMutation.isPending,
    addPageToCluster: addPageToClusterMutation.mutate,
    isAddingPage: addPageToClusterMutation.isPending,
    removePageFromCluster: removePageFromClusterMutation.mutate,
    isRemovingPage: removePageFromClusterMutation.isPending,
    suggestClusters: suggestClustersMutation.mutateAsync,
    isSuggesting: suggestClustersMutation.isPending,
  };
}
