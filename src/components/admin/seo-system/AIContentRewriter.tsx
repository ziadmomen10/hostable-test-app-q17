/**
 * AIContentRewriter
 * 
 * Rewrite content for SEO, voice search, or AI citability.
 * Compact design with mode pills, textarea, and result display.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  Loader2, 
  Copy, 
  Check,
  Search,
  Mic,
  Bot,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIContentRewriterProps {
  pageId: string;
  languageCode: string;
  focusKeyword?: string;
  className?: string;
  onApplyToMeta?: (text: string) => void; // Gap 2.3 - callback to apply rewritten text to meta description
}

type RewriteMode = 'seo' | 'voice' | 'ai';

const MODES: { id: RewriteMode; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { id: 'seo', label: 'SEO', icon: Search, description: 'Optimize for search engines' },
  { id: 'voice', label: 'Voice', icon: Mic, description: 'Conversational for voice search' },
  { id: 'ai', label: 'AI Cite', icon: Bot, description: 'Fact-rich for AI citations' },
];

export function AIContentRewriter({ pageId, languageCode, focusKeyword, className, onApplyToMeta }: AIContentRewriterProps) {
  const [mode, setMode] = useState<RewriteMode>('seo');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      toast.error('Enter some text to rewrite');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('seo-ai-tools', {
        body: {
          action: 'rewrite_content',
          pageId,
          languageCode,
          content: inputText,
          context: {
            mode,
            focusKeyword,
          },
        },
      });

      // Gap 2.2: Handle missing edge function gracefully
      if (error) {
        const errorMessage = error.message || '';
        if (errorMessage.includes('not found') || errorMessage.includes('404') || errorMessage.includes('FunctionNotFound')) {
          throw new Error('AI rewriter feature not yet configured. Please contact support.');
        }
        throw error;
      }
      if (data?.error) throw new Error(data.error);

      setResult(data?.rewritten || data?.result || 'No result returned');
      toast.success('Content rewritten successfully');
    } catch (error) {
      console.error('Rewrite error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to rewrite content';
      // Provide user-friendly error for common issues
      if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        toast.error('AI rewriter feature not yet configured');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Gap 2.3 - Apply to meta description
  const applyToMeta = () => {
    if (!result || !onApplyToMeta) return;
    onApplyToMeta(result);
    setApplied(true);
    toast.success('Applied to meta description');
    setTimeout(() => setApplied(false), 2000);
  };

  const currentMode = MODES.find(m => m.id === mode)!;

  return (
    <div className={cn("space-y-1.5", className)}>
      {/* Mode Pills */}
      <div className="flex gap-1">
        {MODES.map((m) => {
          const Icon = m.icon;
          return (
            <Button
              key={m.id}
              variant={mode === m.id ? 'default' : 'outline'}
              size="sm"
              className="h-6 text-[9px] flex-1 gap-1"
              onClick={() => setMode(m.id)}
            >
              <Icon className="h-2.5 w-2.5" />
              {m.label}
            </Button>
          );
        })}
      </div>

      {/* Mode Description */}
      <p className="text-[9px] text-muted-foreground flex items-center gap-1">
        <currentMode.icon className="h-2.5 w-2.5" />
        {currentMode.description}
      </p>

      {/* Input Textarea */}
      <Textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste text to rewrite..."
        className="text-[10px] min-h-[60px] resize-none"
      />

      {/* Rewrite Button */}
      <Button
        size="sm"
        className="w-full h-6 text-[10px] gap-1"
        onClick={handleRewrite}
        disabled={isLoading || !inputText.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Rewriting...
          </>
        ) : (
          <>
            <Sparkles className="h-3 w-3" />
            Rewrite for {currentMode.label}
          </>
        )}
      </Button>

      {/* Result Display */}
      {result && (
        <div className="space-y-1 pt-1 border-t">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="h-4 text-[8px]">
              <ArrowRight className="h-2 w-2 mr-0.5" />
              Result
            </Badge>
            <div className="flex items-center gap-0.5">
              {onApplyToMeta && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 text-[9px] px-1 gap-0.5"
                  onClick={applyToMeta}
                >
                  {applied ? (
                    <>
                      <Check className="h-2.5 w-2.5 text-green-500" />
                      Applied
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-2.5 w-2.5" />
                      Apply
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 text-[9px] px-1 gap-0.5"
                onClick={copyResult}
              >
                {copied ? (
                  <>
                    <Check className="h-2.5 w-2.5 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-2.5 w-2.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          <ScrollArea className="max-h-[80px]">
            <div className="p-1.5 rounded bg-muted/30 text-[10px] leading-relaxed">
              {result}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Tips */}
      {!result && (
        <div className="text-[8px] text-muted-foreground space-y-0.5">
          <p>💡 Tips for each mode:</p>
          <p>• <strong>SEO</strong>: Adds keywords naturally, improves structure</p>
          <p>• <strong>Voice</strong>: Conversational, question-based, natural flow</p>
          <p>• <strong>AI Cite</strong>: Adds facts, stats, and citable statements</p>
        </div>
      )}
    </div>
  );
}
