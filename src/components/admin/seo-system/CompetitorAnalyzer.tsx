/**
 * CompetitorAnalyzer
 * 
 * Compact competitor page analysis using Firecrawl.
 * Displays side-by-side SEO metric comparison.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Globe, 
  Loader2, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Type,
  FileText,
  Heading1,
  Heading2,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { PageData } from '@/hooks/queries/usePageData';

interface CompetitorAnalyzerProps {
  pageData: PageData;
  className?: string;
}

interface CompetitorData {
  url: string;
  title: string;
  description: string;
  wordCount: number;
  h1Count: number;
  h2Count: number;
  linkCount: number;
  imageCount: number;
}

export function CompetitorAnalyzer({ pageData, className }: CompetitorAnalyzerProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [competitor, setCompetitor] = useState<CompetitorData | null>(null);

  const analyze = async () => {
    if (!url.trim()) {
      toast.error('Enter a competitor URL');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
        body: { 
          url: url.trim(),
          options: { formats: ['markdown', 'html'] }
        }
      });

      // Gap 2.2: Handle missing edge function gracefully
      if (error) {
        const errorMsg = error.message || '';
        if (errorMsg.includes('not found') || errorMsg.includes('404') || errorMsg.includes('FunctionNotFound')) {
          throw new Error('Competitor analysis requires Firecrawl integration. Contact support to enable this feature.');
        }
        throw error;
      }
      if (!data?.success) throw new Error(data?.error || 'Failed to scrape');

      // Extract metrics from scraped content
      const html = data.data?.html || '';
      const markdown = data.data?.markdown || '';
      const metadata = data.data?.metadata || {};

      const wordCount = markdown.split(/\s+/).filter((w: string) => w.length > 0).length;
      const h1Count = (html.match(/<h1/gi) || []).length;
      const h2Count = (html.match(/<h2/gi) || []).length;
      const linkCount = (html.match(/<a\s/gi) || []).length;
      const imageCount = (html.match(/<img/gi) || []).length;

      setCompetitor({
        url: url.trim(),
        title: metadata.title || '',
        description: metadata.description || '',
        wordCount,
        h1Count,
        h2Count,
        linkCount,
        imageCount,
      });

      toast.success('Competitor analyzed');
    } catch (err) {
      toast.error('Analysis failed: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate our page metrics
  const ourMetrics = React.useMemo(() => {
    const content = pageData.content || '';
    let textContent = '';
    try {
      const parsed = JSON.parse(content);
      textContent = extractText(parsed);
    } catch {
      textContent = content;
    }

    return {
      title: pageData.page_title || '',
      description: pageData.page_description || '',
      wordCount: textContent.split(/\s+/).filter(w => w.length > 0).length,
      h1Count: (content.match(/"type"\s*:\s*"h1"/gi) || []).length,
      h2Count: (content.match(/"type"\s*:\s*"h2"/gi) || []).length,
      linkCount: (content.match(/"href"\s*:|"link"\s*:/gi) || []).length,
      imageCount: (content.match(/"imageUrl"\s*:|"image"\s*:/gi) || []).length,
    };
  }, [pageData]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* URL Input */}
      <div className="flex gap-1">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://competitor.com/page"
          className="h-6 text-[10px]"
          onKeyDown={(e) => e.key === 'Enter' && analyze()}
        />
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-[10px] shrink-0"
          onClick={analyze}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Globe className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Comparison Results */}
      {competitor && (
        <div className="space-y-2">
          {/* Title Comparison */}
          <ComparisonRow
            label="Title"
            icon={FileText}
            ourValue={`${ourMetrics.title.length}c`}
            theirValue={`${competitor.title.length}c`}
            ourStatus={ourMetrics.title.length >= 30 && ourMetrics.title.length <= 60 ? 'good' : 'warning'}
            theirStatus={competitor.title.length >= 30 && competitor.title.length <= 60 ? 'good' : 'warning'}
          />

          {/* Word Count */}
          <ComparisonRow
            label="Words"
            icon={Type}
            ourValue={`${ourMetrics.wordCount}`}
            theirValue={`${competitor.wordCount}`}
            ourStatus={ourMetrics.wordCount >= 300 ? 'good' : 'warning'}
            theirStatus={competitor.wordCount >= 300 ? 'good' : 'warning'}
            comparison={ourMetrics.wordCount >= competitor.wordCount ? 'win' : 'lose'}
          />

          {/* H1 Count */}
          <ComparisonRow
            label="H1"
            icon={Heading1}
            ourValue={String(ourMetrics.h1Count)}
            theirValue={String(competitor.h1Count)}
            ourStatus={ourMetrics.h1Count === 1 ? 'good' : 'error'}
            theirStatus={competitor.h1Count === 1 ? 'good' : 'error'}
          />

          {/* H2 Count */}
          <ComparisonRow
            label="H2"
            icon={Heading2}
            ourValue={String(ourMetrics.h2Count)}
            theirValue={String(competitor.h2Count)}
            ourStatus={ourMetrics.h2Count >= 2 ? 'good' : 'warning'}
            theirStatus={competitor.h2Count >= 2 ? 'good' : 'warning'}
            comparison={ourMetrics.h2Count >= competitor.h2Count ? 'win' : 'lose'}
          />

          {/* Links */}
          <ComparisonRow
            label="Links"
            icon={LinkIcon}
            ourValue={String(ourMetrics.linkCount)}
            theirValue={String(competitor.linkCount)}
            ourStatus={ourMetrics.linkCount >= 2 ? 'good' : 'warning'}
            theirStatus={competitor.linkCount >= 2 ? 'good' : 'warning'}
          />
        </div>
      )}

      {!competitor && !isLoading && (
        <p className="text-[9px] text-muted-foreground text-center py-2">
          Enter a competitor URL to compare SEO metrics
        </p>
      )}
    </div>
  );
}

interface ComparisonRowProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ourValue: string;
  theirValue: string;
  ourStatus: 'good' | 'warning' | 'error';
  theirStatus: 'good' | 'warning' | 'error';
  comparison?: 'win' | 'lose' | 'tie';
}

function ComparisonRow({ 
  label, 
  icon: Icon, 
  ourValue, 
  theirValue, 
  ourStatus, 
  theirStatus,
  comparison 
}: ComparisonRowProps) {
  const statusColors = {
    good: 'text-green-600 bg-green-500/10 border-green-200/50',
    warning: 'text-yellow-600 bg-yellow-500/10 border-yellow-200/50',
    error: 'text-red-600 bg-red-500/10 border-red-200/50',
  };

  return (
    <div className="flex items-center gap-1 text-[9px]">
      <Icon className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
      <span className="w-10 text-muted-foreground">{label}</span>
      
      {/* Our Value */}
      <Badge variant="outline" className={cn("h-4 text-[8px] px-1", statusColors[ourStatus])}>
        You: {ourValue}
      </Badge>
      
      <span className="text-muted-foreground">vs</span>
      
      {/* Their Value */}
      <Badge variant="outline" className={cn("h-4 text-[8px] px-1", statusColors[theirStatus])}>
        Them: {theirValue}
      </Badge>

      {/* Win/Lose Indicator */}
      {comparison === 'win' && <CheckCircle2 className="h-2.5 w-2.5 text-green-500 shrink-0" />}
      {comparison === 'lose' && <AlertTriangle className="h-2.5 w-2.5 text-yellow-500 shrink-0" />}
    </div>
  );
}

function extractText(obj: any): string {
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(extractText).join(' ');
  if (obj && typeof obj === 'object') {
    return Object.values(obj).map(extractText).join(' ');
  }
  return '';
}
