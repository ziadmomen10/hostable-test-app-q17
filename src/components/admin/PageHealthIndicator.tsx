import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PageHealthIndicatorProps {
  pageId: string;
  pageUrl: string;
  compact?: boolean;
}

interface HealthData {
  seoScore: number;
  translationCoverage: number;
  hasContent: boolean;
  isActive: boolean;
  hasRecentChanges: boolean;
}

export const PageHealthIndicator: React.FC<PageHealthIndicatorProps> = ({
  pageId,
  pageUrl,
  compact = false
}) => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        // Fetch page data
        const { data: pageData } = await supabase
          .from('pages')
          .select('is_active, content, updated_at, overall_coverage')
          .eq('id', pageId)
          .single();

        // Fetch SEO score
        const { data: seoData } = await supabase
          .from('page_seo')
          .select('seo_score')
          .eq('page_id', pageId)
          .eq('language_code', 'en')
          .maybeSingle();

        // Calculate if has recent changes (within 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const hasRecentChanges = pageData?.updated_at 
          ? new Date(pageData.updated_at) > sevenDaysAgo 
          : false;

        setHealth({
          seoScore: (seoData as any)?.seo_score || 0,
          translationCoverage: Number(pageData?.overall_coverage) || 0,
          hasContent: !!pageData?.content && pageData.content.length > 100,
          isActive: pageData?.is_active ?? false,
          hasRecentChanges
        });
      } catch (error) {
        console.error('Error fetching page health:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [pageId]);

  if (loading || !health) {
    return compact ? null : (
      <Badge variant="outline" className="animate-pulse">
        <Activity className="h-3 w-3 mr-1" />
        Loading...
      </Badge>
    );
  }

  // Calculate overall health score
  const scores = [
    health.seoScore / 100 * 0.35,                    // SEO is 35% of health
    health.translationCoverage / 100 * 0.25,         // Translations 25%
    health.hasContent ? 0.2 : 0,                     // Content 20%
    health.isActive ? 0.1 : 0,                       // Active status 10%
    health.hasRecentChanges ? 0.1 : 0.05             // Recent updates 10%
  ];
  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) * 100);

  const getStatus = () => {
    if (overallScore >= 70) return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Healthy' };
    if (overallScore >= 40) return { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Needs Work' };
    return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Critical' };
  };

  const status = getStatus();
  const Icon = status.icon;

  const issues = [];
  if (health.seoScore < 60) issues.push('Low SEO score');
  if (health.translationCoverage < 50) issues.push('Missing translations');
  if (!health.hasContent) issues.push('No content');
  if (!health.isActive) issues.push('Page inactive');

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${status.bg}`}>
              <Icon className={`h-3.5 w-3.5 ${status.color}`} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px]">
            <div className="space-y-1">
              <p className="font-medium">{status.label} ({overallScore}%)</p>
              {issues.length > 0 && (
                <ul className="text-xs space-y-0.5">
                  {issues.map((issue, i) => (
                    <li key={i} className="text-muted-foreground">• {issue}</li>
                  ))}
                </ul>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${status.bg} border-0 cursor-help`}>
            <Icon className={`h-3 w-3 mr-1 ${status.color}`} />
            <span className={status.color}>{overallScore}%</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[250px]">
          <div className="space-y-2">
            <p className="font-medium">{status.label}</p>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>SEO Score</span>
                <span>{health.seoScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Translations</span>
                <span>{Math.round(health.translationCoverage)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Content</span>
                <span>{health.hasContent ? '✓' : '✗'}</span>
              </div>
              <div className="flex justify-between">
                <span>Active</span>
                <span>{health.isActive ? '✓' : '✗'}</span>
              </div>
            </div>
            {issues.length > 0 && (
              <div className="pt-1 border-t">
                <p className="text-xs font-medium text-red-500">Issues:</p>
                <ul className="text-xs text-muted-foreground">
                  {issues.map((issue, i) => (
                    <li key={i}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PageHealthIndicator;
