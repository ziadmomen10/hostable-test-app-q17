/**
 * useContentDecay
 * 
 * Hook for detecting stale content that needs refreshing.
 * Tracks content freshness and generates refresh suggestions.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays, differenceInMonths, parseISO } from 'date-fns';
import { toast } from 'sonner';

export interface ContentFreshness {
  id: string;
  page_id: string;
  last_major_update: string | null;
  content_hash: string | null;
  word_count: number;
  freshness_score: number;
  decay_detected_at: string | null;
  refresh_suggestions: RefreshSuggestion[];
  checked_at: string;
}

export interface RefreshSuggestion {
  type: 'update-stats' | 'add-content' | 'revise-examples' | 'update-links' | 'refresh-images';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DecayStatus {
  isDecayed: boolean;
  freshnessScore: number;
  daysSinceUpdate: number;
  monthsSinceUpdate: number;
  severity: 'fresh' | 'aging' | 'stale' | 'critical';
  message: string;
}

// Calculate freshness score based on update date
function calculateFreshnessScore(lastUpdate: Date | null, wordCount: number): number {
  if (!lastUpdate) return 50; // Unknown age, medium score

  const now = new Date();
  const daysSince = differenceInDays(now, lastUpdate);
  
  // Base score from age (60% weight)
  let ageScore = 100;
  if (daysSince > 365) ageScore = 20; // Over 1 year
  else if (daysSince > 180) ageScore = 40; // Over 6 months
  else if (daysSince > 90) ageScore = 60; // Over 3 months
  else if (daysSince > 30) ageScore = 80; // Over 1 month
  
  // Content depth bonus (20% weight)
  let depthBonus = 0;
  if (wordCount > 2000) depthBonus = 20;
  else if (wordCount > 1000) depthBonus = 15;
  else if (wordCount > 500) depthBonus = 10;
  
  // Combine (max 100)
  return Math.min(100, Math.round(ageScore * 0.8 + depthBonus));
}

// Determine decay severity
function getDecaySeverity(daysSince: number): DecayStatus['severity'] {
  if (daysSince <= 30) return 'fresh';
  if (daysSince <= 90) return 'aging';
  if (daysSince <= 180) return 'stale';
  return 'critical';
}

export function useContentDecay(pageId: string) {
  const queryClient = useQueryClient();

  // Fetch freshness data
  const { data: freshness, isLoading, error } = useQuery({
    queryKey: ['content-freshness', pageId],
    queryFn: async () => {
      // First try to get existing freshness record
      const { data: existingData } = await supabase
        .from('seo_content_freshness')
        .select('*')
        .eq('page_id', pageId)
        .maybeSingle();

      if (existingData) {
        return {
          ...existingData,
          refresh_suggestions: (Array.isArray(existingData.refresh_suggestions) 
            ? existingData.refresh_suggestions 
            : []) as unknown as RefreshSuggestion[],
        } as ContentFreshness;
      }

      // If not exists, fetch page data and create initial record
      const { data: pageData } = await supabase
        .from('pages')
        .select('updated_at, content')
        .eq('id', pageId)
        .single();

      if (!pageData) return null;

      // Calculate initial freshness
      const contentText = extractTextFromContent(pageData.content || '');
      const wordCount = contentText.split(/\s+/).filter(Boolean).length;
      const lastUpdate = pageData.updated_at ? parseISO(pageData.updated_at) : null;
      const freshnessScore = calculateFreshnessScore(lastUpdate, wordCount);
      const isDecayed = freshnessScore < 50;

      // Create initial record using insert since upsert needs proper typing
      const { data: created, error: createError } = await supabase
        .from('seo_content_freshness')
        .insert({
          page_id: pageId,
          last_major_update: pageData.updated_at,
          content_hash: null,
          word_count: wordCount,
          freshness_score: freshnessScore,
          decay_detected_at: isDecayed ? new Date().toISOString() : null,
          refresh_suggestions: [],
        })
        .select()
        .single();

      if (createError) throw createError;
      return {
        ...created,
        refresh_suggestions: (Array.isArray(created.refresh_suggestions) 
          ? created.refresh_suggestions 
          : []) as unknown as RefreshSuggestion[],
      } as ContentFreshness;
    },
    enabled: !!pageId,
    staleTime: 5 * 60 * 1000,
  });

  // Check and update freshness
  const checkFreshnessMutation = useMutation({
    mutationFn: async () => {
      const { data: pageData } = await supabase
        .from('pages')
        .select('updated_at, content')
        .eq('id', pageId)
        .single();

      if (!pageData) throw new Error('Page not found');

      const contentText = extractTextFromContent(pageData.content || '');
      const wordCount = contentText.split(/\s+/).filter(Boolean).length;
      const lastUpdate = pageData.updated_at ? parseISO(pageData.updated_at) : null;
      const freshnessScore = calculateFreshnessScore(lastUpdate, wordCount);
      const isDecayed = freshnessScore < 50;

      const updateData = {
        page_id: pageId,
        last_major_update: pageData.updated_at,
        word_count: wordCount,
        freshness_score: freshnessScore,
        decay_detected_at: isDecayed ? new Date().toISOString() : null,
        checked_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('seo_content_freshness')
        .upsert(updateData, { onConflict: 'page_id' })
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        refresh_suggestions: (Array.isArray(data.refresh_suggestions) 
          ? data.refresh_suggestions 
          : []) as unknown as RefreshSuggestion[],
      } as ContentFreshness;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-freshness', pageId] });
    },
  });

  // Generate refresh suggestions via AI
  const generateSuggestionsMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase.functions.invoke('seo-ai-tools', {
        body: {
          action: 'generate_refresh_suggestions',
          pageId,
          content,
          context: {},
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Save suggestions to database
      const { error: updateError } = await supabase
        .from('seo_content_freshness')
        .update({
          refresh_suggestions: data.suggestions || [],
        })
        .eq('page_id', pageId);

      if (updateError) throw updateError;
      return data.suggestions as RefreshSuggestion[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-freshness', pageId] });
      toast.success('Refresh suggestions generated');
    },
    onError: (error) => {
      console.error('[useContentDecay] Suggestion error:', error);
      toast.error('Failed to generate suggestions');
    },
  });

  // Calculate decay status
  const getDecayStatus = (): DecayStatus => {
    if (!freshness) {
      return {
        isDecayed: false,
        freshnessScore: 0,
        daysSinceUpdate: 0,
        monthsSinceUpdate: 0,
        severity: 'fresh',
        message: 'Loading...',
      };
    }

    const lastUpdate = freshness.last_major_update 
      ? parseISO(freshness.last_major_update) 
      : null;
    
    const now = new Date();
    const daysSince = lastUpdate ? differenceInDays(now, lastUpdate) : 999;
    const monthsSince = lastUpdate ? differenceInMonths(now, lastUpdate) : 99;
    const severity = getDecaySeverity(daysSince);
    const isDecayed = freshness.freshness_score < 50;

    const messages: Record<DecayStatus['severity'], string> = {
      fresh: 'Content is up to date',
      aging: 'Consider reviewing for updates',
      stale: 'Content may need refreshing',
      critical: 'Content is significantly outdated',
    };

    return {
      isDecayed,
      freshnessScore: freshness.freshness_score,
      daysSinceUpdate: daysSince,
      monthsSinceUpdate: monthsSince,
      severity,
      message: messages[severity],
    };
  };

  return {
    freshness,
    decayStatus: getDecayStatus(),
    isLoading,
    error,
    checkFreshness: checkFreshnessMutation.mutate,
    isChecking: checkFreshnessMutation.isPending,
    generateSuggestions: generateSuggestionsMutation.mutate,
    isGeneratingSuggestions: generateSuggestionsMutation.isPending,
  };
}

// Simple text extraction helper
function extractTextFromContent(content: string): string {
  if (!content) return '';
  try {
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed).replace(/[{}\[\]":,]/g, ' ');
  } catch {
    return content.replace(/<[^>]*>/g, ' ');
  }
}
