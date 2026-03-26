/**
 * AnswerBoxOptimizer
 * 
 * Generates content optimized for featured snippets and answer boxes.
 * Supports paragraph, list, table, and definition formats.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { 
  MessageSquare, 
  ChevronDown, 
  Loader2,
  Copy,
  List,
  Table2,
  FileText,
  BookOpen,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSEOAITools, type AnswerBoxResult } from '../hooks/useSEOAITools';
import type { PageData } from '@/hooks/queries/usePageData';
import type { useSEOFormState } from '../hooks/useSEOFormState';

interface AnswerBoxOptimizerProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  focusKeyword?: string;
  formState?: ReturnType<typeof useSEOFormState>;
}

export function AnswerBoxOptimizer({ pageId, pageData, languageCode, focusKeyword, formState }: AnswerBoxOptimizerProps) {
  const [result, setResult] = useState<AnswerBoxResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('paragraph');

  const aiTools = useSEOAITools({
    pageId,
    languageCode,
    content: pageData.content || '',
    pageTitle: pageData.page_title,
    pageUrl: pageData.page_url,
    focusKeyword,
  });

  const handleOptimize = async () => {
    const data = await aiTools.optimizeAnswerBox();
    if (data) {
      setResult(data);
      setActiveTab(data.recommendedFormat);
      setIsOpen(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const applyToMetaDescription = (text: string) => {
    if (formState) {
      formState.updateField('metaDescription', text);
      toast.success('Applied to meta description - remember to save!');
    }
  };

  return (
    <div className="space-y-1.5">
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-1.5 h-6 text-[10px]"
        onClick={handleOptimize}
        disabled={aiTools.isLoading.optimize_answer_box}
      >
        {aiTools.isLoading.optimize_answer_box ? (
          <Loader2 className="h-2.5 w-2.5 animate-spin" />
        ) : (
          <MessageSquare className="h-2.5 w-2.5" />
        )}
        Answer Box Optimizer
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
                <Star className="h-2.5 w-2.5" />
                Featured Snippets
                <Badge variant="outline" className="text-[8px] h-4 capitalize">
                  {result.recommendedFormat}
                </Badge>
              </span>
              <ChevronDown className={cn(
                "h-3 w-3 transition-transform duration-200",
                isOpen && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-1.5 space-y-2 animate-accordion-down">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 h-6">
                <TabsTrigger value="paragraph" className="text-[8px] gap-0.5 h-5 px-1">
                  <FileText className="h-2.5 w-2.5" />
                  <span className="hidden sm:inline">Para</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="text-[8px] gap-0.5 h-5 px-1">
                  <List className="h-2.5 w-2.5" />
                  <span className="hidden sm:inline">List</span>
                </TabsTrigger>
                <TabsTrigger value="table" className="text-[8px] gap-0.5 h-5 px-1">
                  <Table2 className="h-2.5 w-2.5" />
                  <span className="hidden sm:inline">Table</span>
                </TabsTrigger>
                <TabsTrigger value="definition" className="text-[8px] gap-0.5 h-5 px-1">
                  <BookOpen className="h-2.5 w-2.5" />
                  <span className="hidden sm:inline">Def</span>
                </TabsTrigger>
              </TabsList>

              {/* Paragraph Format */}
              <TabsContent value="paragraph" className="mt-1.5 space-y-1">
                <div className="p-2 rounded border bg-muted/20 space-y-1">
                  <p className="text-[9px] font-medium">{result.paragraphFormat.question}</p>
                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                    {result.paragraphFormat.answer}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-5 text-[8px]"
                    onClick={() => copyToClipboard(result.paragraphFormat.answer)}
                  >
                    <Copy className="h-2 w-2 mr-0.5" />
                    Copy
                  </Button>
                  {formState && (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 h-5 text-[8px]"
                      onClick={() => applyToMetaDescription(result.paragraphFormat.answer)}
                    >
                      Apply to Meta
                    </Button>
                  )}
                </div>
              </TabsContent>

              {/* List Format */}
              <TabsContent value="list" className="mt-1.5 space-y-1">
                <div className="p-2 rounded border bg-muted/20 space-y-1">
                  <p className="text-[9px] font-medium">{result.listFormat.question}</p>
                  <ol className={cn(
                    "text-[9px] text-muted-foreground space-y-0.5 pl-4",
                    result.listFormat.listType === 'ordered' ? 'list-decimal' : 'list-disc'
                  )}>
                    {result.listFormat.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ol>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-5 text-[8px]"
                  onClick={() => copyToClipboard(result.listFormat.items.join('\n'))}
                >
                  <Copy className="h-2 w-2 mr-0.5" />
                  Copy List
                </Button>
              </TabsContent>

              {/* Table Format */}
              <TabsContent value="table" className="mt-1.5 space-y-1">
                {result.tableFormat ? (
                  <>
                    <div className="p-2 rounded border bg-muted/20 space-y-1 overflow-x-auto">
                      <p className="text-[9px] font-medium">{result.tableFormat.question}</p>
                      <table className="w-full text-[8px]">
                        <thead>
                          <tr className="border-b">
                            {result.tableFormat.headers.map((header, index) => (
                              <th key={index} className="p-1 text-left font-medium">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.tableFormat.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b last:border-0">
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="p-1">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-5 text-[8px]"
                      onClick={() => copyToClipboard(
                        result.tableFormat?.headers.join('\t') + '\n' +
                        result.tableFormat?.rows.map(r => r.join('\t')).join('\n')
                      )}
                    >
                      <Copy className="h-2 w-2 mr-0.5" />
                      Copy Table
                    </Button>
                  </>
                ) : (
                  <p className="text-[9px] text-muted-foreground text-center py-2">
                    No table format available
                  </p>
                )}
              </TabsContent>

              {/* Definition Format */}
              <TabsContent value="definition" className="mt-1.5 space-y-1">
                {result.definitionFormat ? (
                  <>
                    <div className="p-2 rounded border bg-muted/20 space-y-1">
                      <p className="text-[9px] font-medium">{result.definitionFormat.term}</p>
                      <p className="text-[9px] text-muted-foreground leading-relaxed">
                        {result.definitionFormat.definition}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-5 text-[8px]"
                      onClick={() => copyToClipboard(
                        `${result.definitionFormat?.term}: ${result.definitionFormat?.definition}`
                      )}
                    >
                      <Copy className="h-2 w-2 mr-0.5" />
                      Copy Definition
                    </Button>
                  </>
                ) : (
                  <p className="text-[9px] text-muted-foreground text-center py-2">
                    No definition format available
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
