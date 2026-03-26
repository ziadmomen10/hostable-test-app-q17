/**
 * ScoreTrendChart
 * 
 * Displays SEO score trends over time using Recharts.
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ChevronDown,
  BarChart3,
  Loader2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useScoreHistory, type ScoreTrend } from '../hooks/useScoreHistory';

interface ScoreTrendChartProps {
  pageId: string;
  languageCode: string;
  currentScores?: {
    seo: number;
    aeo: number;
    geo: number;
    issuesCount?: number;
  };
}

const periodOptions = [
  { value: 7, label: '7d' },
  { value: 30, label: '30d' },
  { value: 90, label: '90d' },
];

export function ScoreTrendChart({ pageId, languageCode, currentScores }: ScoreTrendChartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [days, setDays] = useState(30);

  const { 
    trendData, 
    change, 
    averages, 
    needsSnapshot,
    isLoading, 
    recordSnapshot,
    isRecording,
  } = useScoreHistory(pageId, languageCode, days);

  // Record snapshot when we have current scores and need one
  // Gap L5: Guard against empty pageId to prevent 400 errors
  React.useEffect(() => {
    if (!pageId || pageId.length < 10) return; // Guard against empty/invalid pageId
    
    if (currentScores && needsSnapshot && !isRecording) {
      recordSnapshot({
        seoScore: currentScores.seo,
        aeoScore: currentScores.aeo,
        geoScore: currentScores.geo,
        issuesCount: currentScores.issuesCount,
      });
    }
  }, [pageId, currentScores, needsSnapshot, isRecording]);

  const TrendIcon = change.direction === 'up' 
    ? TrendingUp 
    : change.direction === 'down' 
      ? TrendingDown 
      : Minus;

  const trendColor = change.direction === 'up'
    ? 'text-green-600'
    : change.direction === 'down'
      ? 'text-red-600'
      : 'text-muted-foreground';

  if (!pageId) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between h-7 px-2 text-xs"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-1.5">
            <BarChart3 className="h-3 w-3" />
            Score Trends
            {trendData.length > 0 && (
              <span className={cn("flex items-center gap-0.5", trendColor)}>
                <TrendIcon className="h-3 w-3" />
                <span className="text-[9px]">
                  {change.combined > 0 ? '+' : ''}{change.combined}
                </span>
              </span>
            )}
          </span>
          <ChevronDown className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-2 animate-accordion-down">
        <div className="space-y-2">
          {/* Period Selector */}
          <div className="flex items-center gap-1">
            {periodOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={days === opt.value ? 'default' : 'outline'}
                size="sm"
                className="h-5 px-2 text-[9px]"
                onClick={() => setDays(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* No Data State */}
          {!isLoading && trendData.length < 2 && (
            <div className="text-center py-4 text-[10px] text-muted-foreground">
              <BarChart3 className="h-4 w-4 mx-auto mb-1 opacity-50" />
              Not enough data yet. Check back later!
            </div>
          )}

          {/* Chart */}
          {!isLoading && trendData.length >= 2 && (
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: 10, 
                      padding: '4px 8px',
                      borderRadius: 6,
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="seo" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={1.5}
                    dot={false}
                    name="SEO"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="aeo" 
                    stroke="hsl(210, 90%, 50%)" 
                    strokeWidth={1.5}
                    dot={false}
                    name="AEO"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="geo" 
                    stroke="hsl(150, 70%, 45%)" 
                    strokeWidth={1.5}
                    dot={false}
                    name="GEO"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Averages */}
          {!isLoading && trendData.length >= 2 && (
            <div className="flex items-center justify-around py-1 px-2 rounded-md bg-muted/30 text-[9px]">
              <div className="text-center">
                <p className="text-muted-foreground">Avg SEO</p>
                <p className="font-medium">{averages.seo}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Avg AEO</p>
                <p className="font-medium">{averages.aeo}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Avg GEO</p>
                <p className="font-medium">{averages.geo}</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center gap-3 text-[9px]">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              SEO
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'hsl(210, 90%, 50%)' }} />
              AEO
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'hsl(150, 70%, 45%)' }} />
              GEO
            </span>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
