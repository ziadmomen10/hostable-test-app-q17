/**
 * SEOOverlayScoreCard
 * 
 * Mini floating dashboard showing live SEO score and key metrics.
 */

import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  XCircle,
  Heading1,
  Image,
  Link2,
  Code2,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import type { SEOOverlayStats } from './types';

interface SEOOverlayScoreCardProps {
  stats: (SEOOverlayStats & { score: number; totalImages: number; totalLinks: number; totalHeadings: number }) | null;
  issueCounts: { critical: number; high: number; medium: number; low: number };
  className?: string;
}

interface MetricRowProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  status: 'ok' | 'warning' | 'error';
  detail?: string;
}

function MetricRow({ icon: Icon, label, value, status, detail }: MetricRowProps) {
  const statusColors = {
    ok: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };
  
  const StatusIcon = status === 'ok' ? CheckCircle2 : status === 'warning' ? AlertTriangle : XCircle;
  
  return (
    <div className="flex items-center justify-between py-0.5">
      <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </div>
      <div className={cn("flex items-center gap-1 text-[9px] font-medium", statusColors[status])}>
        <span>{value}</span>
        {detail && <span className="text-[8px] opacity-70">({detail})</span>}
        <StatusIcon className="h-2.5 w-2.5" />
      </div>
    </div>
  );
}

export function SEOOverlayScoreCard({ stats, issueCounts, className }: SEOOverlayScoreCardProps) {
  if (!stats) return null;
  
  const totalIssues = issueCounts.critical + issueCounts.high + issueCounts.medium + issueCounts.low;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className={cn(
      "bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3 w-56",
      className
    )}>
      {/* Score Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold">📊 Live Page Score</span>
        <span className={cn("text-sm font-bold", getScoreColor(stats.score))}>
          {stats.score}/100
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-3">
        <div 
          className={cn("h-full rounded-full transition-all", getProgressColor(stats.score))}
          style={{ width: `${stats.score}%` }}
        />
      </div>
      
      {/* Issue Summary */}
      {totalIssues > 0 && (
        <div className="flex items-center gap-2 mb-2 text-[9px]">
          {issueCounts.critical > 0 && (
            <span className="flex items-center gap-0.5 text-red-600">
              <AlertCircle className="h-3 w-3" />
              {issueCounts.critical}
            </span>
          )}
          {issueCounts.high > 0 && (
            <span className="flex items-center gap-0.5 text-orange-600">
              <AlertTriangle className="h-3 w-3" />
              {issueCounts.high}
            </span>
          )}
          {issueCounts.medium > 0 && (
            <span className="flex items-center gap-0.5 text-yellow-600">
              <AlertTriangle className="h-3 w-3" />
              {issueCounts.medium}
            </span>
          )}
          {issueCounts.low > 0 && (
            <span className="flex items-center gap-0.5 text-blue-600">
              ℹ {issueCounts.low}
            </span>
          )}
        </div>
      )}
      
      <div className="border-t pt-2 space-y-0.5">
        {/* Title */}
        <MetricRow
          icon={FileText}
          label="Title"
          value={stats.hasTitle ? `${stats.titleLength} chars` : 'Missing'}
          status={!stats.hasTitle ? 'error' : stats.titleLength >= 30 && stats.titleLength <= 60 ? 'ok' : 'warning'}
        />
        
        {/* H1 */}
        <MetricRow
          icon={Heading1}
          label="H1"
          value={stats.h1 === 1 ? 'Present' : stats.h1 === 0 ? 'Missing' : `${stats.h1} found`}
          status={stats.h1 === 1 ? 'ok' : 'error'}
          detail={stats.h1 > 1 ? 'duplicate!' : undefined}
        />
        
        {/* Images */}
        <MetricRow
          icon={Image}
          label="Images"
          value={stats.imgMissing === 0 ? 'All OK' : `${stats.imgMissing} missing alt`}
          status={stats.imgMissing === 0 ? 'ok' : 'warning'}
          detail={stats.totalImages > 0 ? `${stats.totalImages} total` : undefined}
        />
        
        {/* Links */}
        <MetricRow
          icon={Link2}
          label="Links"
          value={`${stats.internal}i / ${stats.external}e`}
          status={stats.internal > 0 ? 'ok' : 'warning'}
          detail={stats.emptyLinks > 0 ? `${stats.emptyLinks} empty` : undefined}
        />
        
        {/* Schema */}
        <MetricRow
          icon={Code2}
          label="Schema"
          value={stats.schema.length > 0 ? stats.schema.join(', ') : 'None'}
          status={stats.schema.length > 0 ? 'ok' : 'warning'}
        />
      </div>
      
      {/* Meta Status */}
      <div className="border-t mt-2 pt-2">
        <div className="flex flex-wrap gap-1">
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[8px] font-medium",
            stats.hasDescription ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {stats.hasDescription ? '✓' : '✗'} Desc
          </span>
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[8px] font-medium",
            stats.hasCanonical ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          )}>
            {stats.hasCanonical ? '✓' : '?'} Canon
          </span>
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[8px] font-medium",
            stats.hasOpenGraph ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          )}>
            {stats.hasOpenGraph ? '✓' : '?'} OG
          </span>
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[8px] font-medium",
            !stats.isNoindex ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {stats.isNoindex ? '⚠ Noindex' : '✓ Index'}
          </span>
        </div>
      </div>
    </div>
  );
}
