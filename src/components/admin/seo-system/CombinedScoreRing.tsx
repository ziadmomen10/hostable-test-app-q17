/**
 * CombinedScoreRing
 * 
 * Ultra-compact horizontal score display with animated ring on left, bars on right.
 * Optimized for space-constrained left panel - saves ~100px vertical space.
 * 
 * Uses unified score weights from useSEOAnalysis for consistency.
 */

import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Search, MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Unified weights - same as the overall score calculation standard
// SEO: 50%, AEO: 25%, GEO: 25%
const OVERALL_WEIGHTS = {
  seo: 0.5,
  aeo: 0.25,
  geo: 0.25,
};

interface CombinedScoreRingProps {
  seoScore: number;
  aeoScore: number;
  geoScore: number;
  isLoading?: boolean;
}

const getIndicatorClass = (score: number): string => {
  if (score >= 80) return 'bg-emerald-600 dark:bg-emerald-500';
  if (score >= 60) return 'bg-amber-500 dark:bg-yellow-500';
  return 'bg-red-500 dark:bg-red-400';
};

const getTextColorClass = (score: number): string => {
  if (score >= 80) return 'text-emerald-700 dark:text-emerald-400';
  if (score >= 60) return 'text-amber-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const getStrokeColor = (score: number): string => {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  return '#ef4444';
};

export function CombinedScoreRing({ seoScore, aeoScore, geoScore, isLoading }: CombinedScoreRingProps) {
  // Use unified weights for overall score calculation
  const overallScore = Math.round(
    seoScore * OVERALL_WEIGHTS.seo + 
    aeoScore * OVERALL_WEIGHTS.aeo + 
    geoScore * OVERALL_WEIGHTS.geo
  );
  
  // Animated score for entrance effect
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setAnimatedScore(overallScore), 100);
      return () => clearTimeout(timer);
    }
  }, [overallScore, isLoading]);
  
  // Compact ring: 56px
  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 animate-pulse">
        <div className="w-14 h-14 rounded-full bg-muted shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 border">
      {/* Compact Circular Gauge on Left */}
      <div className="relative shrink-0">
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress circle with animation */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getStrokeColor(overallScore)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
            style={{
              filter: overallScore >= 80 ? 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))' : 'none'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-lg font-bold", getTextColorClass(overallScore))}>
            {animatedScore}
          </span>
        </div>
      </div>

      {/* Compact Score Bars on Right */}
      <div className="flex-1 space-y-1.5 min-w-0">
        <CompactScoreBar icon={Search} label="SEO" score={seoScore} />
        <CompactScoreBar icon={MessageSquare} label="AEO" score={aeoScore} />
        <CompactScoreBar icon={Sparkles} label="GEO" score={geoScore} />
      </div>
    </div>
  );
}

interface CompactScoreBarProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  score: number;
}

function CompactScoreBar({ icon: Icon, label, score }: CompactScoreBarProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={cn("h-3 w-3 shrink-0", getTextColorClass(score))} />
      <span className="text-[10px] font-medium w-6 text-muted-foreground">{label}</span>
      <Progress 
        value={score} 
        className="flex-1 h-1.5"
        indicatorClassName={getIndicatorClass(score)}
      />
      <span className={cn("text-[10px] font-bold tabular-nums w-5 text-right", getTextColorClass(score))}>
        {score}
      </span>
    </div>
  );
}
