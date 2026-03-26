/**
 * useScoreHistory
 * 
 * Hook for tracking SEO score trends over time.
 * Records daily snapshots and provides trend data for visualization.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, differenceInDays, parseISO } from 'date-fns';
import { seoQueryKeys } from './queryKeys';

export interface ScoreSnapshot {
  id: string;
  page_id: string;
  language_code: string;
  seo_score: number;
  aeo_score: number;
  geo_score: number;
  combined_score: number;
  issues_count: number;
  snapshot_date: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ScoreTrend {
  date: string;
  seo: number;
  aeo: number;
  geo: number;
  combined: number;
}

export interface ScoreChange {
  seo: number;
  aeo: number;
  geo: number;
  combined: number;
  direction: 'up' | 'down' | 'stable';
}

export function useScoreHistory(pageId: string, languageCode: string = 'en', days: number = 30) {
  const queryClient = useQueryClient();

  // Fetch score history - Gap A1: Use centralized query keys
  const { data: history, isLoading, error } = useQuery({
    queryKey: seoQueryKeys.scoreHistory(pageId, languageCode, days),
    queryFn: async () => {
      const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('seo_score_history')
        .select('*')
        .eq('page_id', pageId)
        .eq('language_code', languageCode)
        .gte('snapshot_date', startDate)
        .order('snapshot_date', { ascending: true });

      if (error) throw error;
      return (data || []) as ScoreSnapshot[];
    },
    enabled: !!pageId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Record a new snapshot
  const recordSnapshotMutation = useMutation({
    mutationFn: async (scores: {
      seoScore: number;
      aeoScore: number;
      geoScore: number;
      issuesCount?: number;
      metadata?: Record<string, any>;
    }) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const combinedScore = Math.round((scores.seoScore * 0.5) + (scores.aeoScore * 0.25) + (scores.geoScore * 0.25));

      // Upsert to handle same-day updates
      const { data, error } = await supabase
        .from('seo_score_history')
        .upsert({
          page_id: pageId,
          language_code: languageCode,
          seo_score: scores.seoScore,
          aeo_score: scores.aeoScore,
          geo_score: scores.geoScore,
          combined_score: combinedScore,
          issues_count: scores.issuesCount || 0,
          snapshot_date: today,
          metadata: scores.metadata || {},
        }, {
          onConflict: 'page_id,language_code,snapshot_date',
        })
        .select()
        .single();

      if (error) throw error;
      return data as ScoreSnapshot;
    },
    onSuccess: () => {
      // Gap A1: Invalidate with centralized key (use days=30 as default, will invalidate all related)
      queryClient.invalidateQueries({ queryKey: ['seo-score-history', pageId, languageCode] });
    },
  });

  // Transform history to trend data for charts
  const trendData: ScoreTrend[] = (history || []).map(snapshot => ({
    date: format(parseISO(snapshot.snapshot_date), 'MMM d'),
    seo: snapshot.seo_score,
    aeo: snapshot.aeo_score,
    geo: snapshot.geo_score,
    combined: snapshot.combined_score,
  }));

  // Calculate score changes
  const calculateChange = (): ScoreChange => {
    if (!history || history.length < 2) {
      return { seo: 0, aeo: 0, geo: 0, combined: 0, direction: 'stable' };
    }

    const latest = history[history.length - 1];
    const previous = history[history.length - 2];

    const seoChange = latest.seo_score - previous.seo_score;
    const aeoChange = latest.aeo_score - previous.aeo_score;
    const geoChange = latest.geo_score - previous.geo_score;
    const combinedChange = latest.combined_score - previous.combined_score;

    let direction: 'up' | 'down' | 'stable' = 'stable';
    if (combinedChange > 2) direction = 'up';
    else if (combinedChange < -2) direction = 'down';

    return {
      seo: seoChange,
      aeo: aeoChange,
      geo: geoChange,
      combined: combinedChange,
      direction,
    };
  };

  // Get latest snapshot
  const latestSnapshot = history && history.length > 0 ? history[history.length - 1] : null;

  // Check if we need to record today's snapshot
  const needsSnapshot = (): boolean => {
    if (!latestSnapshot) return true;
    const lastDate = parseISO(latestSnapshot.snapshot_date);
    return differenceInDays(new Date(), lastDate) >= 1;
  };

  // Get average scores over period
  const getAverages = () => {
    if (!history || history.length === 0) {
      return { seo: 0, aeo: 0, geo: 0, combined: 0 };
    }

    const sum = history.reduce((acc, s) => ({
      seo: acc.seo + s.seo_score,
      aeo: acc.aeo + s.aeo_score,
      geo: acc.geo + s.geo_score,
      combined: acc.combined + s.combined_score,
    }), { seo: 0, aeo: 0, geo: 0, combined: 0 });

    const count = history.length;
    return {
      seo: Math.round(sum.seo / count),
      aeo: Math.round(sum.aeo / count),
      geo: Math.round(sum.geo / count),
      combined: Math.round(sum.combined / count),
    };
  };

  return {
    history: history || [],
    trendData,
    latestSnapshot,
    change: calculateChange(),
    averages: getAverages(),
    needsSnapshot: needsSnapshot(),
    isLoading,
    error,
    recordSnapshot: recordSnapshotMutation.mutate,
    isRecording: recordSnapshotMutation.isPending,
  };
}
