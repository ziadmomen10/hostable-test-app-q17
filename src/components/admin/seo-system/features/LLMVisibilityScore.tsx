/**
 * LLMVisibilityScore
 * 
 * Analyzes content for likelihood of being cited by AI engines.
 * Shows breakdown by category and improvement recommendations.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Brain, 
  ChevronDown, 
  Loader2,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSEOAITools, type LLMVisibilityResult } from '../hooks/useSEOAITools';
import type { PageData } from '@/hooks/queries/usePageData';

interface LLMVisibilityScoreProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  focusKeyword?: string;
}

export function LLMVisibilityScore({ pageId, pageData, languageCode, focusKeyword }: LLMVisibilityScoreProps) {
  const [result, setResult] = useState<LLMVisibilityResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const aiTools = useSEOAITools({
    pageId,
    languageCode,
    content: pageData.content || '',
    pageTitle: pageData.page_title,
    pageUrl: pageData.page_url,
    focusKeyword,
  });

  const handleAnalyze = async () => {
    const data = await aiTools.analyzeLLMVisibility();
    if (data) {
      setResult(data);
      setIsOpen(true);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const breakdownLabels = {
    factDensity: 'Fact Density',
    directAnswers: 'Direct Answers',
    authoritySignals: 'Authority Signals',
    structuredData: 'Structured Data',
    uniqueInsights: 'Unique Insights',
  };

  return (
    <div className="space-y-1.5">
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-1.5 h-6 text-[10px]"
        onClick={handleAnalyze}
        disabled={aiTools.isLoading.analyze_llm_visibility}
      >
        {aiTools.isLoading.analyze_llm_visibility ? (
          <Loader2 className="h-2.5 w-2.5 animate-spin" />
        ) : (
          <Brain className="h-2.5 w-2.5" />
        )}
        LLM Visibility Analyzer
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
                <TrendingUp className="h-2.5 w-2.5" />
                Visibility Score
                <Badge 
                  variant="outline" 
                  className={cn("text-[8px] h-4", getScoreColor(result.overallScore))}
                >
                  {result.overallScore}/100
                </Badge>
              </span>
              <ChevronDown className={cn(
                "h-3 w-3 transition-transform duration-200",
                isOpen && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-1.5 space-y-2 animate-accordion-down">
            {/* Overall Score */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-medium">Overall LLM Visibility</span>
                <span className={cn("text-[10px] font-bold", getScoreColor(result.overallScore))}>
                  {result.overallScore}%
                </span>
              </div>
              <Progress 
                value={result.overallScore} 
                className="h-2"
              />
            </div>

            {/* Breakdown */}
            <div className="space-y-1">
              <p className="text-[9px] font-medium flex items-center gap-1">
                <BarChart3 className="h-2.5 w-2.5" />
                Score Breakdown
              </p>
              <div className="space-y-1">
                {Object.entries(result.breakdown).map(([key, score]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-[8px] text-muted-foreground w-20 truncate">
                      {breakdownLabels[key as keyof typeof breakdownLabels]}
                    </span>
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", getScoreBg(score))}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className={cn("text-[8px] w-7 text-right", getScoreColor(score))}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div className="space-y-1">
                <p className="text-[9px] font-medium text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Strengths
                </p>
                <div className="space-y-0.5">
                  {result.strengths.slice(0, 2).map((strength, index) => (
                    <p key={index} className="text-[8px] text-muted-foreground pl-3">
                      • {strength}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <div className="space-y-1">
                <p className="text-[9px] font-medium text-yellow-600 flex items-center gap-1">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  Improvements
                </p>
                <div className="space-y-0.5">
                  {result.improvements.slice(0, 3).map((improvement, index) => (
                    <p key={index} className="text-[8px] text-muted-foreground pl-3">
                      • {improvement}
                    </p>
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
