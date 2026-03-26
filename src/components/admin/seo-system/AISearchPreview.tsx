/**
 * AISearchPreview
 * 
 * Simulates how content appears in AI assistants (ChatGPT, Perplexity, Google SGE).
 * Optimized for center panel with tighter padding and smaller snippets.
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Search, 
  Sparkles, 
  Link2, 
  CheckCircle2, 
  AlertCircle,
  Quote,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AISearchPreviewProps {
  title: string;
  description: string;
  content: string;
  url: string;
  geoScore: number;
}

type AIProvider = 'chatgpt' | 'perplexity' | 'sge';

export function AISearchPreview({ title, description, content, url, geoScore }: AISearchPreviewProps) {
  const [activeProvider, setActiveProvider] = useState<AIProvider>('chatgpt');
  
  // Extract citable content snippets
  const citableContent = useMemo(() => {
    return extractCitableContent(content, title);
  }, [content, title]);
  
  // Calculate citation likelihood based on GEO score
  const citationLikelihood = useMemo(() => {
    if (geoScore >= 80) return { level: 'HIGH', color: 'text-green-500', bgColor: 'bg-green-500/10' };
    if (geoScore >= 60) return { level: 'MEDIUM', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' };
    return { level: 'LOW', color: 'text-red-500', bgColor: 'bg-red-500/10' };
  }, [geoScore]);

  // Format domain
  const domain = useMemo(() => {
    try {
      const baseUrl = window.location.origin;
      const fullUrl = url.startsWith('/') ? baseUrl + url : url;
      return new URL(fullUrl).hostname.replace('www.', '');
    } catch {
      return 'example.com';
    }
  }, [url]);

  return (
    <div className="h-full flex flex-col bg-muted/20 p-3 overflow-auto">
      <Card className="max-w-3xl mx-auto w-full flex-1">
        <CardHeader className="pb-2 px-4 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Search Preview
            </CardTitle>
            <Badge 
              variant="outline" 
              className={cn("text-[10px]", citationLikelihood.color, citationLikelihood.bgColor)}
            >
              Citation: {citationLikelihood.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4">
          {/* AI Provider Tabs */}
          <Tabs value={activeProvider} onValueChange={(v) => setActiveProvider(v as AIProvider)}>
            <TabsList className="grid w-full grid-cols-3 h-8 mb-3">
              <TabsTrigger value="chatgpt" className="text-[10px] gap-1">
                <MessageSquare className="h-3 w-3" />
                ChatGPT
              </TabsTrigger>
              <TabsTrigger value="perplexity" className="text-[10px] gap-1">
                <Search className="h-3 w-3" />
                Perplexity
              </TabsTrigger>
              <TabsTrigger value="sge" className="text-[10px] gap-1">
                <Sparkles className="h-3 w-3" />
                Google SGE
              </TabsTrigger>
            </TabsList>

            {/* ChatGPT Citation Style */}
            <TabsContent value="chatgpt">
              <ChatGPTPreview 
                title={title}
                content={citableContent.primary}
                domain={domain}
                url={url}
              />
            </TabsContent>

            {/* Perplexity Citation Style */}
            <TabsContent value="perplexity">
              <PerplexityPreview 
                title={title}
                content={citableContent.primary}
                snippets={citableContent.snippets}
                domain={domain}
                url={url}
              />
            </TabsContent>

            {/* Google SGE Style */}
            <TabsContent value="sge">
              <SGEPreview 
                title={title}
                description={description}
                content={citableContent.primary}
                domain={domain}
                url={url}
              />
            </TabsContent>
          </Tabs>

          {/* Citable Content Analysis */}
          <div className="border-t pt-3">
            <h4 className="text-xs font-medium mb-2 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Citable Content
            </h4>
            <div className="space-y-1.5 max-h-[100px] overflow-auto">
              {citableContent.snippets.length > 0 ? (
                citableContent.snippets.map((snippet, i) => (
                  <div 
                    key={i}
                    className="flex items-start gap-1.5 p-1.5 rounded bg-muted/30 text-xs"
                  >
                    <Quote className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{snippet}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  <AlertCircle className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                  <p className="text-xs">No highly citable content found</p>
                </div>
              )}
            </div>
          </div>

          {/* GEO Optimization Status */}
          <div className="border-t pt-3">
            <h4 className="text-xs font-medium mb-2">AI Optimization</h4>
            <div className="grid grid-cols-2 gap-1.5">
              <StatusItem 
                label="Facts" 
                isOk={citableContent.hasStats} 
              />
              <StatusItem 
                label="Definitions" 
                isOk={citableContent.hasDefinitions} 
              />
              <StatusItem 
                label="Structure" 
                isOk={citableContent.hasLists} 
              />
              <StatusItem 
                label="Authority" 
                isOk={geoScore >= 60} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ChatGPT-style citation card
function ChatGPTPreview({ title, content, domain, url }: { 
  title: string; 
  content: string; 
  domain: string;
  url: string;
}) {
  return (
    <div className="space-y-2">
      <div className="p-3 bg-muted/30 rounded-lg border">
        <p className="text-xs leading-relaxed mb-2">
          Based on <span className="font-medium text-primary">{title}</span>:
        </p>
        <blockquote className="border-l-2 border-primary pl-2 py-0.5 text-xs text-muted-foreground italic">
          "{content.slice(0, 150)}..."
        </blockquote>
      </div>
      
      {/* Source Card */}
      <div className="flex items-center gap-2 p-2 bg-background rounded-lg border">
        <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
          <Link2 className="h-3 w-3 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{title}</p>
          <p className="text-[10px] text-muted-foreground">{domain}</p>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0">
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// Perplexity-style inline citations
function PerplexityPreview({ title, content, snippets, domain, url }: { 
  title: string; 
  content: string; 
  snippets: string[];
  domain: string;
  url: string;
}) {
  return (
    <div className="space-y-2">
      <div className="p-3 bg-background rounded-lg border">
        <p className="text-xs leading-relaxed">
          {content.slice(0, 120)}
          <sup className="text-primary font-bold cursor-pointer hover:underline">[1]</sup>
          {" "}supported by sources
          <sup className="text-primary font-bold cursor-pointer hover:underline">[1]</sup>.
        </p>
      </div>
      
      {/* Sources Section */}
      <div className="space-y-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Sources</p>
        <div className="flex items-center gap-2 p-1.5 rounded bg-muted/30">
          <div className="flex items-center justify-center h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
            1
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{title}</p>
            <p className="text-[10px] text-muted-foreground">{domain}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Google SGE-style expandable answer
function SGEPreview({ title, description, content, domain, url }: { 
  title: string;
  description: string;
  content: string; 
  domain: string;
  url: string;
}) {
  return (
    <div className="space-y-2">
      {/* AI-generated answer block */}
      <div className="p-3 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl border border-blue-200/50 dark:border-blue-500/20">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500/10">
            <Sparkles className="h-2.5 w-2.5 text-blue-500" />
            <span className="text-[9px] font-medium text-blue-600 dark:text-blue-400">AI Overview</span>
          </div>
        </div>
        <p className="text-xs leading-relaxed">
          {content.slice(0, 180)}...
        </p>
      </div>

      {/* Source chip */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 border text-xs">
          <div className="h-3.5 w-3.5 rounded-full bg-primary/10 flex items-center justify-center">
            <Link2 className="h-2 w-2 text-primary" />
          </div>
          <span className="font-medium truncate max-w-[150px]">{title}</span>
          <span className="text-muted-foreground text-[10px]">• {domain}</span>
        </div>
      </div>
    </div>
  );
}

// Compact status item
function StatusItem({ label, isOk }: { label: string; isOk: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 p-1.5 rounded text-xs",
      isOk ? 'bg-green-500/10' : 'bg-yellow-500/10'
    )}>
      {isOk ? (
        <CheckCircle2 className="h-3 w-3 text-green-500" />
      ) : (
        <AlertCircle className="h-3 w-3 text-yellow-500" />
      )}
      <span className="font-medium">{label}</span>
    </div>
  );
}

// Extract citable content from page
function extractCitableContent(content: string, pageTitle: string) {
  let textContent = '';
  try {
    const parsed = JSON.parse(content);
    textContent = extractText(parsed);
  } catch {
    textContent = content;
  }
  
  // Find fact-rich sentences (with numbers, dates, percentages)
  const factPattern = /[^.!?]*\d+[^.!?]*[.!?]/g;
  const factSentences = textContent.match(factPattern) || [];
  
  // Find definition-style sentences
  const definitionPattern = /[^.!?]*(?:is a|are|means|refers to|defined as)[^.!?]*[.!?]/gi;
  const definitions = textContent.match(definitionPattern) || [];
  
  // Find list items (looking for patterns in JSON structure)
  const hasLists = content.includes('"items"') || content.includes('"steps"') || 
                   content.includes('<ul>') || content.includes('<ol>');
  
  // Combine and dedupe
  const allSnippets = [...factSentences, ...definitions]
    .map(s => s.trim())
    .filter((s, i, arr) => s.length > 30 && s.length < 200 && arr.indexOf(s) === i)
    .slice(0, 3);
  
  // Primary content - first substantial paragraph
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const primary = sentences.slice(0, 2).join('. ').trim() + '.';

  return {
    primary: primary || pageTitle,
    snippets: allSnippets,
    hasStats: factSentences.length > 0,
    hasDefinitions: definitions.length > 0,
    hasLists,
  };
}

function extractText(obj: any): string {
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(extractText).join(' ');
  if (obj && typeof obj === 'object') {
    return Object.values(obj).map(extractText).join(' ');
  }
  return '';
}
