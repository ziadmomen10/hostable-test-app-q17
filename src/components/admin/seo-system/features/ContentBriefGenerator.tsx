/**
 * ContentBriefGenerator
 * 
 * AI-powered content brief generator with heading structure,
 * questions, and semantic keywords.
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  ChevronDown, 
  Sparkles,
  Copy,
  Check,
  Loader2,
  Heading1,
  Heading2,
  Heading3,
  HelpCircle,
  Tag,
  Trash2
} from 'lucide-react';
import { useContentBrief, type HeadingItem, type QuestionItem, type SemanticKeyword } from '../hooks/useContentBrief';
import { toast } from 'sonner';

interface ContentBriefGeneratorProps {
  pageId: string;
  languageCode: string;
  pageContent?: string;
  pageTitle?: string;
  pageUrl?: string;
  focusKeyword?: string;
}

const intentColors: Record<string, string> = {
  informational: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  navigational: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  transactional: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  commercial: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const HeadingIcon = ({ level }: { level: string }) => {
  switch (level) {
    case 'h1': return <Heading1 className="h-3 w-3 text-primary" />;
    case 'h2': return <Heading2 className="h-3 w-3 text-muted-foreground" />;
    case 'h3': return <Heading3 className="h-3 w-3 text-muted-foreground/70" />;
    default: return null;
  }
};

export function ContentBriefGenerator({
  pageId,
  languageCode,
  pageContent,
  pageTitle,
  pageUrl,
  focusKeyword,
}: ContentBriefGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const {
    brief,
    isLoading,
    generateBrief,
    isGenerating,
    deleteBrief,
    isDeleting,
  } = useContentBrief(pageId, languageCode);

  const handleGenerate = () => {
    if (!pageContent) {
      toast.error('Page content is required to generate a brief');
      return;
    }
    generateBrief({
      content: pageContent,
      focusKeyword,
      pageTitle,
      pageUrl,
    });
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const copyHeadingOutline = () => {
    if (!brief?.heading_structure) return;
    const outline = brief.heading_structure
      .map(h => `${h.level === 'h1' ? '' : h.level === 'h2' ? '  ' : '    '}${h.text}`)
      .join('\n');
    copyToClipboard(outline, 'headings');
  };

  if (!pageId) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between h-7 px-2 text-xs"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            Content Brief
            {brief && (
              <Badge variant="outline" className="h-4 px-1 text-[9px]">
                Generated
              </Badge>
            )}
          </span>
          <ChevronDown className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-2 animate-accordion-down">
        <div className="space-y-2">
          {/* Generate Button */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-[10px] flex-1"
              onClick={handleGenerate}
              disabled={isGenerating || !pageContent}
            >
              {isGenerating ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              {brief ? 'Regenerate' : 'Generate'} Brief
            </Button>
            
            {brief && (
              <>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-[10px]"
                    >
                      View Full
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Content Brief</DialogTitle>
                    </DialogHeader>
                    <ContentBriefModal brief={brief} onCopy={copyToClipboard} copiedSection={copiedSection} />
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => deleteBrief()}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Brief Preview */}
          {brief && !isLoading && (
            <Card className="p-2 space-y-2">
              {/* Target Word Count */}
              {brief.target_word_count && (
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Target Words:</span>
                  <Badge variant="outline" className="h-4 px-1.5 text-[9px]">
                    {brief.target_word_count.toLocaleString()}
                  </Badge>
                </div>
              )}

              {/* Heading Preview */}
              {brief.heading_structure.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-medium text-muted-foreground">Headings</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={copyHeadingOutline}
                    >
                      {copiedSection === 'headings' ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="space-y-0.5">
                    {brief.heading_structure.slice(0, 4).map((heading, i) => (
                      <div key={i} className="flex items-center gap-1 text-[10px]">
                        <HeadingIcon level={heading.level} />
                        <span className="truncate">{heading.text}</span>
                      </div>
                    ))}
                    {brief.heading_structure.length > 4 && (
                      <p className="text-[9px] text-muted-foreground">
                        +{brief.heading_structure.length - 4} more
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Questions Preview */}
              {brief.questions_to_answer.length > 0 && (
                <div>
                  <span className="text-[9px] font-medium text-muted-foreground">Questions to Answer</span>
                  <div className="mt-1 space-y-0.5">
                    {brief.questions_to_answer.slice(0, 2).map((q, i) => (
                      <div key={i} className="flex items-start gap-1 text-[10px]">
                        <HelpCircle className="h-3 w-3 text-blue-500 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{q.question}</span>
                      </div>
                    ))}
                    {brief.questions_to_answer.length > 2 && (
                      <p className="text-[9px] text-muted-foreground">
                        +{brief.questions_to_answer.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Keywords Preview */}
              {brief.semantic_keywords.length > 0 && (
                <div>
                  <span className="text-[9px] font-medium text-muted-foreground">Keywords</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {brief.semantic_keywords.slice(0, 5).map((kw, i) => (
                      <Badge key={i} variant="outline" className="h-4 px-1 text-[8px]">
                        {kw.keyword}
                      </Badge>
                    ))}
                    {brief.semantic_keywords.length > 5 && (
                      <Badge variant="outline" className="h-4 px-1 text-[8px]">
                        +{brief.semantic_keywords.length - 5}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Full Modal View
function ContentBriefModal({ 
  brief, 
  onCopy,
  copiedSection 
}: { 
  brief: ReturnType<typeof useContentBrief>['brief'];
  onCopy: (text: string, section: string) => void;
  copiedSection: string | null;
}) {
  if (!brief) return null;

  return (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-4">
        {/* Target Word Count */}
        {brief.target_word_count && (
          <div>
            <h4 className="text-sm font-medium mb-1">Target Word Count</h4>
            <p className="text-2xl font-bold text-primary">{brief.target_word_count.toLocaleString()}</p>
          </div>
        )}

        {/* Heading Structure */}
        {brief.heading_structure.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Heading Structure</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  const outline = brief.heading_structure
                    .map(h => `${h.level === 'h1' ? '' : h.level === 'h2' ? '  ' : '    '}${h.text}`)
                    .join('\n');
                  onCopy(outline, 'modal-headings');
                }}
              >
                {copiedSection === 'modal-headings' ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                Copy
              </Button>
            </div>
            <div className="space-y-1 bg-muted/30 p-3 rounded-md">
              {brief.heading_structure.map((heading, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex items-center gap-2",
                    heading.level === 'h2' && "ml-4",
                    heading.level === 'h3' && "ml-8"
                  )}
                >
                  <HeadingIcon level={heading.level} />
                  <span className="text-sm">{heading.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Questions to Answer */}
        {brief.questions_to_answer.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Questions to Answer</h4>
            <div className="space-y-2">
              {brief.questions_to_answer.map((q, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-muted/30">
                  <HelpCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">{q.question}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={cn("text-[10px] h-4", intentColors[q.searchIntent])}>
                        {q.searchIntent}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] h-4">
                        {q.priority} priority
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Semantic Keywords */}
        {brief.semantic_keywords.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Semantic Keywords</h4>
            <div className="space-y-1">
              {brief.semantic_keywords.map((kw, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Tag className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">{kw.keyword}</span>
                  <Badge className={cn("text-[9px] h-4", intentColors[kw.searchIntent])}>
                    {kw.searchIntent}
                  </Badge>
                  <Badge variant="outline" className="text-[9px] h-4">
                    {kw.type}
                  </Badge>
                  <span className="text-muted-foreground text-xs ml-auto">{kw.usage}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
