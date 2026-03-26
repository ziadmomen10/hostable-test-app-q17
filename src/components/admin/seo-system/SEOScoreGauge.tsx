/**
 * SEOScoreGauge
 * 
 * Animated circular gauge showing score with color coding.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SEOScoreGaugeProps {
  score: number;
  size?: number;
  isLoading?: boolean;
  showLabel?: boolean;
}

export function SEOScoreGauge({ 
  score, 
  size = 80, 
  isLoading = false,
  showLabel = false 
}: SEOScoreGaugeProps) {
  // Calculate stroke properties
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Determine color based on score
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 50) return '#eab308';
    return '#ef4444';
  };

  if (isLoading) {
    return (
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
            strokeLinecap="round"
            className="text-muted-foreground/30 animate-spin origin-center"
            style={{ animationDuration: '1.5s' }}
          />
        </svg>
        <span className="absolute text-xs text-muted-foreground">...</span>
      </div>
    );
  }

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className={cn(
        "absolute font-bold",
        getColor(score),
        size < 60 ? 'text-xs' : size < 100 ? 'text-sm' : 'text-lg'
      )}>
        {score}
      </span>
      {showLabel && (
        <span className="absolute bottom-0 text-[10px] text-muted-foreground">
          /100
        </span>
      )}
    </div>
  );
}
