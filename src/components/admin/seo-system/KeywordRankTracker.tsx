/**
 * KeywordRankTracker
 * 
 * Track SERP positions for focus keywords over time.
 * Compact design with trend indicators and sparkline.
 * 
 * Enhanced with manual position entry until SERP API is integrated.
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Plus,
  Loader2,
  Target,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface KeywordRankTrackerProps {
  pageId: string;
  focusKeyword?: string;
  className?: string;
}

interface KeywordRank {
  id: string;
  keyword: string;
  position: number | null;
  previous_position: number | null;
  search_engine: string;
  checked_at: string;
}

export function KeywordRankTracker({ pageId, focusKeyword, className }: KeywordRankTrackerProps) {
  const [newKeyword, setNewKeyword] = useState('');
  const queryClient = useQueryClient();

  // Fetch keyword ranks
  const { data: ranks, isLoading } = useQuery({
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

  // Add keyword mutation
  const addMutation = useMutation({
    mutationFn: async (keyword: string) => {
      const { error } = await supabase
        .from('seo_keyword_ranks')
        .insert({
          page_id: pageId,
          keyword,
          position: null,
          search_engine: 'google',
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyword-ranks', pageId] });
      setNewKeyword('');
      toast.success('Keyword added for tracking');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add keyword');
    },
  });

  // Update position mutation
  const updatePositionMutation = useMutation({
    mutationFn: async ({ keyword, position }: { keyword: string; position: number }) => {
      // Get current position for previous_position
      const { data: current } = await supabase
        .from('seo_keyword_ranks')
        .select('position')
        .eq('page_id', pageId)
        .eq('keyword', keyword)
        .order('checked_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Insert new rank record
      const { error } = await supabase.from('seo_keyword_ranks').insert({
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

  // Group by keyword (latest first)
  const groupedRanks = React.useMemo(() => {
    if (!ranks) return {};
    const grouped: Record<string, KeywordRank[]> = {};
    ranks.forEach(rank => {
      if (!grouped[rank.keyword]) {
        grouped[rank.keyword] = [];
      }
      grouped[rank.keyword].push(rank);
    });
    return grouped;
  }, [ranks]);

  const keywords = Object.keys(groupedRanks);
  const latestRanks = keywords.map(kw => groupedRanks[kw][0]);

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    addMutation.mutate(newKeyword.trim());
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-4", className)}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {/* Stats */}
      <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
        <Badge variant="secondary" className="h-5 gap-1">
          <Target className="h-2.5 w-2.5" />
          {keywords.length} keywords
        </Badge>
        {focusKeyword && !keywords.includes(focusKeyword) && (
          <Button
            variant="outline"
            size="sm"
            className="h-5 text-[8px] px-1.5 gap-0.5"
            onClick={() => addMutation.mutate(focusKeyword)}
            disabled={addMutation.isPending}
          >
            <Plus className="h-2 w-2" />
            Track "{focusKeyword}"
          </Button>
        )}
      </div>

      {/* Keyword List */}
      {latestRanks.length > 0 ? (
        <ScrollArea className="max-h-[120px]">
          <div className="space-y-1 pr-1">
            {latestRanks.map((rank) => (
              <KeywordRow 
                key={rank.keyword} 
                rank={rank} 
                history={groupedRanks[rank.keyword]}
                onUpdatePosition={(position) => {
                  updatePositionMutation.mutate({ keyword: rank.keyword, position });
                }}
                isUpdating={updatePositionMutation.isPending}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-2 text-muted-foreground">
          <Target className="h-5 w-5 mx-auto mb-1" />
          <p className="text-[10px]">No keywords tracked</p>
          <p className="text-[9px]">Add keywords to monitor rankings</p>
        </div>
      )}

      {/* Add Keyword */}
      <div className="flex gap-1">
        <Input
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="Add keyword to track"
          className="h-6 text-[10px] flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
        />
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={handleAddKeyword}
          disabled={addMutation.isPending || !newKeyword.trim()}
        >
          {addMutation.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Note about manual updates */}
      <p className="text-[8px] text-muted-foreground text-center">
        💡 Click position to manually update • Auto-sync coming soon
      </p>
    </div>
  );
}

// Keyword Row Component with inline position editing
interface KeywordRowProps {
  rank: KeywordRank;
  history: KeywordRank[];
  onUpdatePosition: (position: number) => void;
  isUpdating: boolean;
}

function KeywordRow({ rank, history, onUpdatePosition, isUpdating }: KeywordRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(rank.position || ''));

  const trend = getTrend(rank.position, rank.previous_position);
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground';

  const positionChange = rank.previous_position && rank.position 
    ? rank.previous_position - rank.position 
    : 0;

  const handleSave = () => {
    const newPosition = parseInt(editValue, 10);
    if (!isNaN(newPosition) && newPosition > 0 && newPosition <= 100) {
      onUpdatePosition(newPosition);
      setIsEditing(false);
    } else {
      toast.error('Position must be between 1 and 100');
    }
  };

  const handleCancel = () => {
    setEditValue(String(rank.position || ''));
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-1.5 p-1 rounded bg-muted/20 text-[9px]">
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{rank.keyword}</div>
        <div className="text-[8px] text-muted-foreground">
          {rank.search_engine} • {formatDate(rank.checked_at)}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {isEditing ? (
          <div className="flex items-center gap-0.5">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-5 w-10 text-[8px] text-center p-0.5"
              type="number"
              min={1}
              max={100}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
              ) : (
                <Check className="h-2.5 w-2.5 text-green-600" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={handleCancel}
            >
              <X className="h-2.5 w-2.5 text-red-600" />
            </Button>
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-1 gap-0.5 hover:bg-muted"
              >
                {rank.position ? (
                  <>
                    <Badge variant="outline" className="h-4 text-[8px] font-mono">
                      #{rank.position}
                    </Badge>
                    {positionChange !== 0 && (
                      <span className={cn("text-[8px] flex items-center", trendColor)}>
                        <TrendIcon className="h-2.5 w-2.5" />
                        {Math.abs(positionChange)}
                      </span>
                    )}
                  </>
                ) : (
                  <Badge variant="outline" className="h-4 text-[8px] text-muted-foreground">
                    —
                  </Badge>
                )}
                <Edit2 className="h-2 w-2 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium">Update Position</p>
                <div className="flex gap-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-6 w-16 text-[10px]"
                    type="number"
                    min={1}
                    max={100}
                    placeholder="1-100"
                  />
                  <Button
                    size="sm"
                    className="h-6 text-[10px]"
                    onClick={() => {
                      const newPosition = parseInt(editValue, 10);
                      if (!isNaN(newPosition) && newPosition > 0 && newPosition <= 100) {
                        onUpdatePosition(newPosition);
                      } else {
                        toast.error('Position must be between 1 and 100');
                      }
                    }}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
                  </Button>
                </div>
                {history.length > 1 && (
                  <div className="text-[8px] text-muted-foreground">
                    History: {history.slice(0, 5).map(h => h.position || '—').join(' → ')}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}

// Get trend direction
function getTrend(current: number | null, previous: number | null): 'up' | 'down' | 'stable' {
  if (!current || !previous) return 'stable';
  if (current < previous) return 'up'; // Lower position = better
  if (current > previous) return 'down';
  return 'stable';
}

// Format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 86400000) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
