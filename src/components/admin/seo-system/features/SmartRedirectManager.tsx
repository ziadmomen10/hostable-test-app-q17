/**
 * SmartRedirectManager
 * 
 * Enhanced redirect management with chain detection and warnings.
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { 
  ArrowRightLeft, 
  ChevronDown, 
  Loader2,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Link2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PageData } from '@/hooks/queries/usePageData';

interface SmartRedirectManagerProps {
  pageData: PageData;
}

interface Redirect {
  id: string;
  from_path: string;
  to_path: string;
  redirect_type: number;
  is_active: boolean;
  hit_count: number;
}

export function SmartRedirectManager({ pageData }: SmartRedirectManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newFromPath, setNewFromPath] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  // Fetch redirects pointing TO this page
  const { data: incomingRedirects, isLoading: loadingIncoming } = useQuery({
    queryKey: ['redirects-to', pageData.page_url],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('redirects')
        .select('*')
        .eq('to_path', pageData.page_url)
        .eq('is_active', true);
      if (error) throw error;
      return data as Redirect[];
    },
    enabled: isOpen,
  });

  // Fetch redirects FROM this page (to detect chains)
  const { data: outgoingRedirects } = useQuery({
    queryKey: ['redirects-from', pageData.page_url],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('redirects')
        .select('*')
        .eq('from_path', pageData.page_url)
        .eq('is_active', true);
      if (error) throw error;
      return data as Redirect[];
    },
    enabled: isOpen,
  });

  // Check for redirect chains (A -> B -> C)
  const detectChains = () => {
    const chains: string[] = [];
    incomingRedirects?.forEach(redirect => {
      if (outgoingRedirects?.length) {
        chains.push(`${redirect.from_path} → ${pageData.page_url} → ${outgoingRedirects[0].to_path}`);
      }
    });
    return chains;
  };

  const chains = detectChains();

  // Create redirect mutation
  const createRedirect = useMutation({
    mutationFn: async (fromPath: string) => {
      const { error } = await supabase
        .from('redirects')
        .insert({
          from_path: fromPath,
          to_path: pageData.page_url,
          redirect_type: 301,
          is_active: true,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redirects-to', pageData.page_url] });
      setNewFromPath('');
      setIsCreating(false);
      toast.success('Redirect created');
    },
    onError: (error) => {
      toast.error('Failed to create redirect');
      console.error(error);
    },
  });

  // Delete redirect mutation
  const deleteRedirect = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('redirects')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redirects-to', pageData.page_url] });
      toast.success('Redirect deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete redirect');
      console.error(error);
    },
  });

  const handleCreate = () => {
    if (!newFromPath.trim()) {
      toast.error('Please enter a from path');
      return;
    }
    if (!newFromPath.startsWith('/')) {
      toast.error('Path must start with /');
      return;
    }
    if (newFromPath === pageData.page_url) {
      toast.error('Cannot redirect to same URL');
      return;
    }
    createRedirect.mutate(newFromPath);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between h-6 text-[10px]"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-1.5">
            <ArrowRightLeft className="h-2.5 w-2.5" />
            Redirects
            {incomingRedirects && incomingRedirects.length > 0 && (
              <Badge variant="secondary" className="text-[8px] h-4">
                {incomingRedirects.length}
              </Badge>
            )}
            {chains.length > 0 && (
              <Badge variant="outline" className="text-[8px] h-4 border-yellow-500 text-yellow-600">
                chain
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
        {loadingIncoming ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Chain Warning */}
            {chains.length > 0 && (
              <div className="p-1.5 rounded border border-yellow-500/50 bg-yellow-500/10 space-y-1">
                <p className="text-[9px] font-medium text-yellow-600 flex items-center gap-1">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  Redirect Chain Detected
                </p>
                {chains.map((chain, index) => (
                  <p key={index} className="text-[8px] text-yellow-700 font-mono">
                    {chain}
                  </p>
                ))}
                <p className="text-[8px] text-yellow-600">
                  Consider updating to direct redirects for better SEO.
                </p>
              </div>
            )}

            {/* Incoming Redirects */}
            <div className="space-y-1">
              <p className="text-[9px] font-medium flex items-center gap-1">
                <Link2 className="h-2.5 w-2.5" />
                Incoming Redirects
              </p>
              
              {incomingRedirects?.length ? (
                <div className="space-y-0.5 max-h-[100px] overflow-y-auto">
                  {incomingRedirects.map((redirect) => (
                    <div 
                      key={redirect.id}
                      className="flex items-center gap-1 p-1 rounded bg-muted/20 text-[9px]"
                    >
                      <span className="font-mono truncate flex-1">{redirect.from_path}</span>
                      <ArrowRight className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                      <Badge variant="outline" className="text-[7px] h-3">
                        {redirect.redirect_type}
                      </Badge>
                      <span className="text-[8px] text-muted-foreground">
                        {redirect.hit_count} hits
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                        onClick={() => deleteRedirect.mutate(redirect.id)}
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[9px] text-muted-foreground text-center py-1">
                  No incoming redirects
                </p>
              )}
            </div>

            {/* Create New Redirect */}
            {isCreating ? (
              <div className="space-y-1">
                <Input
                  value={newFromPath}
                  onChange={(e) => setNewFromPath(e.target.value)}
                  placeholder="/old-url"
                  className="h-6 text-[10px] font-mono"
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
                    onClick={handleCreate}
                    disabled={createRedirect.isPending}
                  >
                    {createRedirect.isPending ? (
                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    ) : (
                      'Add 301'
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
                Add Redirect
              </Button>
            )}
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
