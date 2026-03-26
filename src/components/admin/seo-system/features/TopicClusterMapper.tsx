/**
 * TopicClusterMapper
 * 
 * Visual cluster mapping for pillar-cluster content relationships.
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Network, 
  ChevronDown, 
  Loader2,
  Plus,
  Trash2,
  Star,
  Link2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PageData } from '@/hooks/queries/usePageData';

interface TopicClusterMapperProps {
  pageId: string;
  pageData: PageData;
  /** When true, highlights current page context in cluster view */
  showCurrentPageContext?: boolean;
}

interface TopicCluster {
  id: string;
  cluster_name: string;
  cluster_description: string | null;
  color: string | null;
  pillar_page_id: string | null;
}

interface ClusterPage {
  id: string;
  cluster_id: string;
  page_id: string;
  relationship_type: string | null;
}

export function TopicClusterMapper({ pageId, pageData, showCurrentPageContext = true }: TopicClusterMapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClusterId, setSelectedClusterId] = useState<string>('');
  const [newClusterName, setNewClusterName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all clusters
  const { data: clusters, isLoading: loadingClusters } = useQuery({
    queryKey: ['seo-topic-clusters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_topic_clusters')
        .select('*')
        .order('cluster_name');
      if (error) throw error;
      return data as TopicCluster[];
    },
    enabled: isOpen,
  });

  // Fetch page's cluster memberships
  const { data: pageClusters } = useQuery({
    queryKey: ['seo-cluster-pages', pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_cluster_pages')
        .select(`
          *,
          cluster:seo_topic_clusters(*)
        `)
        .eq('page_id', pageId);
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!pageId,
  });

  // Check if page is a pillar for any cluster
  const isPillarFor = clusters?.filter(c => c.pillar_page_id === pageId) || [];

  // Create cluster mutation
  const createCluster = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('seo_topic_clusters')
        .insert({ cluster_name: name })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-topic-clusters'] });
      setNewClusterName('');
      setIsCreating(false);
      toast.success('Cluster created');
    },
    onError: (error) => {
      toast.error('Failed to create cluster');
      console.error(error);
    },
  });

  // Add page to cluster mutation
  const addToCluster = useMutation({
    mutationFn: async (clusterId: string) => {
      const { error } = await supabase
        .from('seo_cluster_pages')
        .insert({
          cluster_id: clusterId,
          page_id: pageId,
          relationship_type: 'cluster_content',
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-cluster-pages', pageId] });
      setSelectedClusterId('');
      toast.success('Added to cluster');
    },
    onError: (error) => {
      toast.error('Failed to add to cluster');
      console.error(error);
    },
  });

  // Remove from cluster mutation
  const removeFromCluster = useMutation({
    mutationFn: async (clusterPageId: string) => {
      const { error } = await supabase
        .from('seo_cluster_pages')
        .delete()
        .eq('id', clusterPageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-cluster-pages', pageId] });
      toast.success('Removed from cluster');
    },
    onError: (error) => {
      toast.error('Failed to remove from cluster');
      console.error(error);
    },
  });

  // Set as pillar mutation
  const setAsPillar = useMutation({
    mutationFn: async (clusterId: string) => {
      const { error } = await supabase
        .from('seo_topic_clusters')
        .update({ pillar_page_id: pageId })
        .eq('id', clusterId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-topic-clusters'] });
      toast.success('Set as pillar page');
    },
    onError: (error) => {
      toast.error('Failed to set as pillar');
      console.error(error);
    },
  });

  // Available clusters (not already a member)
  const memberClusterIds = new Set(pageClusters?.map(pc => pc.cluster_id) || []);
  const availableClusters = clusters?.filter(c => !memberClusterIds.has(c.id)) || [];

  // Gap 4.4: Check if this page is already in any cluster (context awareness)
  const isCurrentPageInCluster = pageClusters && pageClusters.length > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "w-full justify-between h-6 text-[10px]",
            // Gap 4.4: Highlight button when current page has cluster context
            showCurrentPageContext && isCurrentPageInCluster && "border-primary/50 bg-primary/5"
          )}
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-1.5">
            <Network className={cn(
              "h-2.5 w-2.5",
              showCurrentPageContext && isCurrentPageInCluster && "text-primary"
            )} />
            Topic Clusters
            {pageClusters && pageClusters.length > 0 && (
              <Badge variant="secondary" className="text-[8px] h-4">
                {pageClusters.length}
              </Badge>
            )}
            {isPillarFor.length > 0 && (
              <Badge variant="outline" className="text-[8px] h-4 border-yellow-500 text-yellow-600">
                <Star className="h-2 w-2 mr-0.5" />
                pillar
              </Badge>
            )}
          </span>
          <ChevronDown className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-1.5 space-y-2 animate-accordion-down">
        {loadingClusters ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Pillar Status */}
            {isPillarFor.length > 0 && (
              <div className="p-1.5 rounded border border-yellow-500/50 bg-yellow-500/10">
                <p className="text-[9px] font-medium text-yellow-700 flex items-center gap-1">
                  <Star className="h-2.5 w-2.5" />
                  Pillar page for:
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {isPillarFor.map(cluster => (
                    <Badge key={cluster.id} variant="secondary" className="text-[8px] h-4">
                      {cluster.cluster_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Gap 4.4: Show current page context indicator */}
            {showCurrentPageContext && !isCurrentPageInCluster && availableClusters.length > 0 && (
              <div className="p-1.5 rounded border border-blue-500/50 bg-blue-500/10">
                <p className="text-[9px] text-blue-700 flex items-center gap-1">
                  <Network className="h-2.5 w-2.5" />
                  This page is not in any cluster yet
                </p>
              </div>
            )}

            {/* Current Memberships */}
            {pageClusters && pageClusters.length > 0 && (
              <div className="space-y-1">
                <p className="text-[9px] font-medium flex items-center gap-1">
                  <Link2 className="h-2.5 w-2.5" />
                  Member of
                </p>
                <div className="space-y-0.5">
                  {pageClusters.map((pc: any) => (
                    <div 
                      key={pc.id}
                      className={cn(
                        "flex items-center justify-between p-1 rounded text-[9px]",
                        // Gap 4.4: Highlight current page's cluster membership
                        showCurrentPageContext ? "bg-primary/10 border border-primary/30" : "bg-muted/20"
                      )}
                    >
                      <span className="truncate">{pc.cluster?.cluster_name}</span>
                      <div className="flex items-center gap-1">
                        {pc.cluster?.pillar_page_id !== pageId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 px-1 text-[8px]"
                            onClick={() => setAsPillar.mutate(pc.cluster_id)}
                          >
                            <Star className="h-2 w-2 mr-0.5" />
                            Pillar
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                          onClick={() => removeFromCluster.mutate(pc.id)}
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cluster */}
            {availableClusters.length > 0 && (
              <div className="flex gap-1">
                <Select value={selectedClusterId} onValueChange={setSelectedClusterId}>
                  <SelectTrigger className="flex-1 h-6 text-[9px]">
                    <SelectValue placeholder="Select cluster..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClusters.map(cluster => (
                      <SelectItem key={cluster.id} value={cluster.id} className="text-[10px]">
                        {cluster.cluster_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="default"
                  size="sm"
                  className="h-6 px-2 text-[9px]"
                  onClick={() => selectedClusterId && addToCluster.mutate(selectedClusterId)}
                  disabled={!selectedClusterId || addToCluster.isPending}
                >
                  {addToCluster.isPending ? (
                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                  ) : (
                    <Plus className="h-2.5 w-2.5" />
                  )}
                </Button>
              </div>
            )}

            {/* Create New Cluster */}
            {isCreating ? (
              <div className="space-y-1">
                <Input
                  value={newClusterName}
                  onChange={(e) => setNewClusterName(e.target.value)}
                  placeholder="Cluster name..."
                  className="h-6 text-[10px]"
                />
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-5 text-[9px]"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 h-5 text-[9px]"
                    onClick={() => newClusterName && createCluster.mutate(newClusterName)}
                    disabled={!newClusterName || createCluster.isPending}
                  >
                    {createCluster.isPending ? (
                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    ) : (
                      'Create'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full h-5 text-[9px]"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="h-2.5 w-2.5 mr-0.5" />
                New Cluster
              </Button>
            )}
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
