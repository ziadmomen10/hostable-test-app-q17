/**
 * AICitationOptimizer
 * 
 * AI-powered tool to optimize content for citation by AI assistants.
 * Generates quotable snippets and citability recommendations.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Copy, 
  ChevronDown, 
  Loader2,
  Quote,
  BarChart3,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSEOAITools, type AICitationResult } from '../hooks/useSEOAITools';
import type { PageData } from '@/hooks/queries/usePageData';

interface AICitationOptimizerProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  focusKeyword?: string;
}

export function AICitationOptimizer({ pageId, pageData, languageCode, focusKeyword }: AICitationOptimizerProps) {
  const [result, setResult] = useState<AICitationResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const aiTools = useSEOAITools({
    pageId,
    languageCode,
    content: pageData.content || '',
    pageTitle: pageData.page_title,
    pageUrl: pageData.page_url,
    focusKeyword,
  });

  const handleOptimize = async () => {
    const data = await aiTools.optimizeAICitation();
    if (data) {
      setResult(data);
      setIsOpen(true);
    }
  };

  const copySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    toast.success('Snippet copied to clipboard');
  };

  const getTypeColor = (type: string) => {
    const colors = {
      definition: 'bg-blue-500/10 text-blue-600 border-blue-200',
      statistic: 'bg-green-500/10 text-green-600 border-green-200',
      fact: 'bg-purple-500/10 text-purple-600 border-purple-200',
      quote: 'bg-amber-500/10 text-amber-600 border-amber-200',
      comparison: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
    };
    return colors[type as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-1.5">
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-1.5 h-6 text-[10px]"
        onClick={handleOptimize}
        disabled={aiTools.isLoading.optimize_ai_citation}
      >
        {aiTools.isLoading.optimize_ai_citation ? (
          <Loader2 className="h-2.5 w-2.5 animate-spin" />
        ) : (
          <Quote className="h-2.5 w-2.5" />
        )}
        AI Citation Optimizer
      </Button>

      {result && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between h-6 text-[10px]"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-2.5 w-2.5" />
                Citability Score
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[8px] h-4",
                    result.overallCitabilityScore >= 70 ? "border-green-500 text-green-600" :
                    result.overallCitabilityScore >= 40 ? "border-yellow-500 text-yellow-600" :
                    "border-red-500 text-red-600"
                  )}
                >
                  {result.overallCitabilityScore}/100
                </Badge>
              </span>
              <ChevronDown className={cn(
                "h-3 w-3 transition-transform duration-200",
                isOpen && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-1.5 space-y-2 animate-accordion-down">
            {/* Score Progress */}
            <div className="space-y-1">
              <Progress value={result.overallCitabilityScore} className="h-1.5" />
              <p className="text-[9px] text-muted-foreground">
                {result.overallCitabilityScore >= 70 ? 'Highly citable content' :
                 result.overallCitabilityScore >= 40 ? 'Moderately citable' :
                 'Needs improvement for AI citations'}
              </p>
            </div>

            {/* Citable Snippets */}
            {result.citableSnippets?.length > 0 && (
              <div className="space-y-1">
                <p className="text-[9px] font-medium flex items-center gap-1">
                  <Quote className="h-2.5 w-2.5" />
                  Citable Snippets ({result.citableSnippets.length})
                </p>
                <div className="space-y-1 max-h-[150px] overflow-y-auto">
                  {result.citableSnippets.map((item, index) => (
                    <div 
                      key={index}
                      className="p-1.5 rounded border bg-muted/20 space-y-1"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <Badge 
                          variant="outline" 
                          className={cn("text-[7px] h-3 capitalize", getTypeColor(item.type))}
                        >
                          {item.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] text-muted-foreground">{item.citabilityScore}%</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => copySnippet(item.snippet)}
                          >
                            <Copy className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-[9px] leading-tight">{item.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <div className="space-y-1">
                <p className="text-[9px] font-medium flex items-center gap-1">
                  <Lightbulb className="h-2.5 w-2.5" />
                  Recommendations
                </p>
                <div className="space-y-0.5">
                  {result.recommendations.slice(0, 3).map((rec, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-1 p-1 rounded bg-muted/20 text-[9px]"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5 text-primary shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
