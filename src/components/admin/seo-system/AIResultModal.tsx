/**
 * AIResultModal
 * 
 * Modal for displaying AI-generated results with apply/copy functionality.
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Copy, Sparkles, ChevronRight, ArrowRight, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Result Types
export type AIResultType = 
  | 'meta' 
  | 'faq' 
  | 'voice' 
  | 'entity' 
  | 'facts' 
  | 'keywords';

interface AIResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: AIResultType;
  result: any;
  onApply?: (result: any) => void;
  isStale?: boolean; // Gap S2: Indicator for cached/stale AI results
}

export function AIResultModal({ 
  open, 
  onOpenChange, 
  type, 
  result,
  onApply,
  isStale = false, // Gap S2: Default to false
}: AIResultModalProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleApply = () => {
    if (onApply) {
      onApply(result);
      // Note: Don't show toast here - let the calling component handle it
      // to avoid duplicate toasts (Gap 3.3 fix)
      onOpenChange(false);
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'meta':
        return <MetaResultContent result={result} onCopy={copyToClipboard} />;
      case 'faq':
        return <FAQResultContent result={result} onCopy={copyToClipboard} />;
      case 'voice':
        return <VoiceResultContent result={result} onCopy={copyToClipboard} />;
      case 'entity':
        return <EntityResultContent result={result} onCopy={copyToClipboard} />;
      case 'facts':
        // Facts are informational only - no apply action (Gap 2.1)
        return <FactsResultContent result={result} isInformational />;
      case 'keywords':
        return <KeywordsResultContent result={result} />;
      default:
        return <div className="text-muted-foreground">No results to display</div>;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'meta': return 'AI Meta Suggestions';
      case 'faq': return 'Generated FAQ Schema';
      case 'voice': return 'Voice Search Optimization';
      case 'entity': return 'Entity Authority Schema';
      case 'facts': return 'Fact Enrichment Suggestions';
      case 'keywords': return 'Keyword Suggestions';
      default: return 'AI Results';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'meta': return 'Review and apply AI-generated title and description';
      case 'faq': return 'FAQ questions with JSON-LD schema markup';
      case 'voice': return 'Optimizations for voice search and featured snippets';
      case 'entity': return 'Organization/Person schema for knowledge graph';
      case 'facts': return 'Add these facts to improve AI citability';
      case 'keywords': return 'Primary and secondary keyword suggestions';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        {/* Gap S2: Stale result indicator */}
        {isStale && (
          <div className="flex items-center gap-2 p-2 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm">
            <Clock className="h-4 w-4" />
            <span>Using cached result — AI service was unavailable</span>
          </div>
        )}

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 pb-4">
            {renderContent()}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {onApply && (
            <Button onClick={handleApply}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Apply Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Meta Result Content
function MetaResultContent({ result, onCopy }: { result: any; onCopy: (text: string) => void }) {
  if (!result) return null;
  
  return (
    <div className="space-y-4">
      <ResultCard 
        label="Meta Title"
        value={result.title}
        charCount={result.titleCharCount}
        optimalRange="30-60"
        onCopy={() => onCopy(result.title)}
      />
      <ResultCard 
        label="Meta Description"
        value={result.description}
        charCount={result.descriptionCharCount}
        optimalRange="120-160"
        onCopy={() => onCopy(result.description)}
      />
      {result.reasoning && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">AI Reasoning:</span> {result.reasoning}
          </p>
        </div>
      )}
    </div>
  );
}

// FAQ Result Content
function FAQResultContent({ result, onCopy }: { result: any; onCopy: (text: string) => void }) {
  if (!result?.faqs) return null;
  
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {result.faqs.map((faq: any, index: number) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm mb-2">{faq.question}</p>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onCopy(faq.question + '\n' + faq.answer)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {result.schema && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">JSON-LD Schema</p>
            <Button variant="ghost" size="sm" onClick={() => onCopy(JSON.stringify(result.schema, null, 2))}>
              <Copy className="h-4 w-4 mr-1" />
              Copy Schema
            </Button>
          </div>
          <pre className="p-3 bg-muted rounded-lg text-xs overflow-x-auto">
            {JSON.stringify(result.schema, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// Voice Result Content
function VoiceResultContent({ result, onCopy }: { result: any; onCopy: (text: string) => void }) {
  if (!result) return null;
  
  return (
    <div className="space-y-4">
      {result.featuredSnippet && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">Featured Snippet</Badge>
              <Badge variant="outline">{result.featuredSnippet.type}</Badge>
            </div>
            <p className="font-medium mb-2">{result.featuredSnippet.question}</p>
            <p className="text-sm text-muted-foreground">{result.featuredSnippet.answer}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2"
              onClick={() => onCopy(result.featuredSnippet.answer)}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy Answer
            </Button>
          </CardContent>
        </Card>
      )}

      {result.conversationalRewrites?.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Conversational Rewrites</p>
          {result.conversationalRewrites.map((rewrite: any, index: number) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <p className="text-sm line-through text-muted-foreground">{rewrite.original}</p>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-green-500" />
                      <p className="text-sm">{rewrite.rewritten}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Improvement: {rewrite.improvement}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {result.suggestedQuestions?.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Suggested Questions to Address</p>
          <div className="flex flex-wrap gap-2">
            {result.suggestedQuestions.map((q: string, index: number) => (
              <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => onCopy(q)}>
                {q}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Entity Result Content
function EntityResultContent({ result, onCopy }: { result: any; onCopy: (text: string) => void }) {
  if (!result) return null;
  
  return (
    <div className="space-y-4">
      {result.schema && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Entity Schema (JSON-LD)</p>
            <Button variant="ghost" size="sm" onClick={() => onCopy(JSON.stringify(result.schema, null, 2))}>
              <Copy className="h-4 w-4 mr-1" />
              Copy Schema
            </Button>
          </div>
          <pre className="p-3 bg-muted rounded-lg text-xs overflow-x-auto max-h-[200px]">
            {JSON.stringify(result.schema, null, 2)}
          </pre>
        </div>
      )}

      {result.suggestions?.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Suggestions</p>
          <ul className="space-y-1">
            {result.suggestions.map((s: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.missingElements?.length > 0 && (
        <div className="p-3 bg-yellow-500/10 rounded-lg">
          <p className="text-sm font-medium mb-2">Missing Elements</p>
          <ul className="space-y-1">
            {result.missingElements.map((e: string, index: number) => (
              <li key={index} className="text-sm text-muted-foreground">• {e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Facts Result Content - informational only (Gap 2.1)
function FactsResultContent({ result, isInformational }: { result: any; isInformational?: boolean }) {
  if (!result) return null;
  
  const impactColors = {
    high: 'bg-green-500/10 text-green-700 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    low: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
  };

  return (
    <div className="space-y-4">
      {/* Informational notice for facts (Gap 2.1) */}
      {isInformational && (
        <div className="flex items-center gap-2 p-2 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-lg text-sm">
          <span>ℹ️</span>
          <span>These suggestions are for reference. Manually add relevant facts to your content.</span>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <span className="text-sm">Current Fact Density:</span>
        <Badge variant={result.currentFactDensity === 'high' ? 'default' : 'secondary'}>
          {result.currentFactDensity}
        </Badge>
      </div>

      {result.suggestions?.length > 0 && (
        <div className="space-y-2">
          {result.suggestions.map((s: any, index: number) => (
            <Card key={index} className={impactColors[s.citabilityImpact as keyof typeof impactColors]}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px]">{s.type}</Badge>
                      <Badge variant="outline" className="text-[10px]">{s.citabilityImpact} impact</Badge>
                    </div>
                    <p className="text-sm">{s.suggestion}</p>
                    <p className="text-xs text-muted-foreground mt-1">Placement: {s.placement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {result.overallRecommendation && (
        <div className="p-3 bg-primary/5 rounded-lg">
          <p className="text-sm">{result.overallRecommendation}</p>
        </div>
      )}
    </div>
  );
}

// Keywords Result Content
function KeywordsResultContent({ result }: { result: any }) {
  if (!result) return null;
  
  return (
    <div className="space-y-4">
      {result.primaryKeyword && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge>Primary Keyword</Badge>
            </div>
            <p className="font-medium text-lg">{result.primaryKeyword.keyword}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.primaryKeyword.reasoning}</p>
          </CardContent>
        </Card>
      )}

      {result.secondaryKeywords?.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Secondary Keywords</p>
          <div className="grid gap-2">
            {result.secondaryKeywords.map((kw: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{kw.keyword}</span>
                  <Badge variant="outline" className="text-[10px]">{kw.type}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">{kw.usage}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.placementMatrix && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Keyword Placement Check</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(result.placementMatrix).map(([key, value]) => (
              <div 
                key={key}
                className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                  value ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}
              >
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <CheckCircle2 className={`h-4 w-4 ${value ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Shared Result Card
function ResultCard({ 
  label, 
  value, 
  charCount, 
  optimalRange,
  onCopy 
}: { 
  label: string; 
  value: string; 
  charCount?: number;
  optimalRange?: string;
  onCopy: () => void;
}) {
  const isOptimal = optimalRange && charCount ? 
    (() => {
      const [min, max] = optimalRange.split('-').map(Number);
      return charCount >= min && charCount <= max;
    })() : true;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{label}</span>
          <div className="flex items-center gap-2">
            {charCount !== undefined && (
              <Badge variant={isOptimal ? 'default' : 'secondary'}>
                {charCount} chars
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm bg-muted p-3 rounded-lg">{value}</p>
        {optimalRange && (
          <p className="text-xs text-muted-foreground mt-2">
            Optimal: {optimalRange} characters
          </p>
        )}
      </CardContent>
    </Card>
  );
}
