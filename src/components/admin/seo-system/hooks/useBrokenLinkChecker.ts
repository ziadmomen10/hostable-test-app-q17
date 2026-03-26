/**
 * useBrokenLinkChecker
 * 
 * Hook to validate links and detect 404s, redirect chains.
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LinkCheckResult {
  url: string;
  status: number;
  statusText: string;
  isOk: boolean;
  isBroken: boolean;
  isAccessDenied?: boolean;
  isRedirect: boolean;
  redirectCount?: number;
  finalUrl?: string;
}

export interface LinkCheckSummary {
  total: number;
  ok: number;
  broken: number;
  accessDenied: number;
  redirects: number;
  results: LinkCheckResult[];
}

export function useBrokenLinkChecker() {
  const [isChecking, setIsChecking] = useState(false);
  const [summary, setSummary] = useState<LinkCheckSummary | null>(null);

  const checkLinks = useCallback(async (urls: string[]): Promise<LinkCheckSummary | null> => {
    if (urls.length === 0) {
      toast.error('No links to check');
      return null;
    }

    setIsChecking(true);
    setSummary(null);

    try {
      const { data, error } = await supabase.functions.invoke('seo-check-links', {
        body: { urls: urls.slice(0, 20) }, // Limit to 20 links
      });

      // Gap 2.1: Handle missing edge function gracefully
      if (error) {
        const errorMessage = error.message || '';
        if (errorMessage.includes('not found') || errorMessage.includes('404') || errorMessage.includes('FunctionNotFound')) {
          throw new Error('Link checking feature not yet configured. The seo-check-links edge function needs to be created.');
        }
        throw error;
      }
      if (data?.error) throw new Error(data.error);

      const results: LinkCheckResult[] = data.results || [];
      
      const newSummary: LinkCheckSummary = {
        total: results.length,
        ok: results.filter(r => r.isOk).length,
        broken: results.filter(r => r.isBroken).length,
        accessDenied: results.filter(r => r.isAccessDenied).length,
        redirects: results.filter(r => r.isRedirect).length,
        results,
      };

      setSummary(newSummary);
      
      if (newSummary.broken > 0) {
        toast.warning(`Found ${newSummary.broken} broken link(s)`);
      } else {
        toast.success('All links are valid');
      }

      return newSummary;
    } catch (error) {
      console.error('Link check error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to check links');
      return null;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSummary(null);
  }, []);

  return {
    checkLinks,
    isChecking,
    summary,
    reset,
  };
}
