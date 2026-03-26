/**
 * AEOPanel
 * 
 * Compact AEO tools with p-1 checklist items, h-6 triggers,
 * and tighter spacing throughout.
 * 
 * Optimized for narrow right panel (~320-420px).
 * Enhanced with form state integration and history logging.
 */

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { AIResultModal, type AIResultType } from '../AIResultModal';
import { useSEOAITools, type FAQResult, type VoiceOptimization } from '../hooks/useSEOAITools';
import { AnswerBoxOptimizer } from '../features';
import { useSEOHistory } from '../hooks/useSEOHistory';
import { toast } from 'sonner';
import { 
  Mic, 
  HelpCircle, 
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PageData } from '@/hooks/queries/usePageData';
import type { useSEOFormState } from '../hooks/useSEOFormState';

interface AEOPanelProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  formState: ReturnType<typeof useSEOFormState>;
}

export function AEOPanel({ pageId, pageData, languageCode, formState }: AEOPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<AIResultType>('faq');
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);

  const queryClient = useQueryClient();
  const { logChange } = useSEOHistory({ pageId, languageCode, limit: 1 });

  // Gap C1: Removed redundant useQuery - formState.formData already has this data

  // Use formState's live keyword instead of stale seoData
  const aiTools = useSEOAITools({
    pageId,
    languageCode,
    content: pageData.content || '',
    pageTitle: pageData.page_title,
    pageUrl: pageData.page_url,
    focusKeyword: formState.formData.focusKeyword,
  });

  const content = pageData.content || '';
  const hasQuestions = /\?/.test(content);
  // Gap L3: Use formState for real-time checklist updates
  const hasFAQ = formState.formData.structuredData.includes('FAQPage');
  const hasLists = content.includes('<ul>') || content.includes('<ol>') || content.includes('"items"');
  const hasConversational = /how to|what is|why|when|where|who/i.test(content);

  const checks = [
    { label: 'Question content', passed: hasQuestions },
    { label: 'FAQ Schema', passed: hasFAQ },
    { label: 'List content', passed: hasLists },
    { label: 'Conversational', passed: hasConversational },
  ];

  const passedCount = checks.filter(c => c.passed).length;

  const handleGenerateFAQ = async () => {
    const result = await aiTools.generateFAQ();
    if (result) {
      setCurrentResult(result);
      setModalType('faq');
      setModalOpen(true);
    }
  };

  const handleOptimizeVoice = async () => {
    const result = await aiTools.optimizeVoice();
    if (result) {
      setCurrentResult(result);
      setModalType('voice');
      setModalOpen(true);
    }
  };

  // Gap F1: Apply FAQ schema with undo toast
  const handleApplyFAQ = async (result: FAQResult) => {
    if (!result.schema) {
      toast.error('No schema to apply');
      return;
    }
    
    try {
      // Get current structured data from form state
      const currentSchemaStr = formState.formData.structuredData;
      let currentSchema = null;
      
      if (currentSchemaStr.trim()) {
        try {
          currentSchema = JSON.parse(currentSchemaStr);
        } catch {
          currentSchema = null;
        }
      }

      // Merge with new FAQ schema
      const newSchema = Array.isArray(currentSchema) 
        ? [...currentSchema, result.schema]
        : currentSchema 
          ? [currentSchema, result.schema]
          : result.schema;

      const newSchemaStr = JSON.stringify(newSchema, null, 2);

      // Update form state (not direct DB)
      formState.updateField('structuredData', newSchemaStr);

      // Log the AI-generated change with error handling
      try {
        logChange({
          page_id: pageId,
          language_code: languageCode,
          change_type: 'ai_generated',
          field_name: 'structured_data',
          old_value: currentSchemaStr || null,
          new_value: newSchemaStr,
          changed_by: null,
        });
      } catch (error) {
        console.warn('Failed to log structured_data history:', error);
      }
      
      // Gap F1: Show undo toast with 10-second duration
      toast.success('FAQ schema added - remember to save!', {
        duration: 10000,
        action: {
          label: 'Undo',
          onClick: () => {
            formState.updateField('structuredData', currentSchemaStr);
            toast.info('FAQ schema change reverted');
          },
        },
      });
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to apply FAQ schema:', error);
      toast.error('Failed to apply FAQ schema');
    }
  };

  // Gap F1: Apply voice optimization with undo toast
  const handleApplyVoice = async (result: VoiceOptimization) => {
    if (!result.featuredSnippet?.answer) {
      toast.error('No featured snippet to apply');
      return;
    }

    try {
      const oldDescription = formState.formData.metaDescription;
      const newDescription = result.featuredSnippet.answer;

      // Update meta description with the featured snippet answer
      formState.updateField('metaDescription', newDescription);

      // Log the AI-generated change with error handling
      try {
        logChange({
          page_id: pageId,
          language_code: languageCode,
          change_type: 'ai_generated',
          field_name: 'meta_description',
          old_value: oldDescription || null,
          new_value: newDescription,
          changed_by: null,
        });
      } catch (error) {
        console.warn('Failed to log meta_description history:', error);
      }

      // Gap F1: Show undo toast with 10-second duration
      toast.success('Featured snippet applied - remember to save!', {
        duration: 10000,
        action: {
          label: 'Undo',
          onClick: () => {
            formState.updateField('metaDescription', oldDescription);
            toast.info('Meta description change reverted');
          },
        },
      });
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to apply voice optimization:', error);
      toast.error('Failed to apply voice optimization');
    }
  };

  // Determine which apply handler to use based on modal type
  const getApplyHandler = () => {
    if (modalType === 'faq') return handleApplyFAQ;
    if (modalType === 'voice') return handleApplyVoice;
    return undefined;
  };

  return (
    <div className="space-y-1.5">
      {/* Collapsible Checklist with status in trigger */}
      <Collapsible open={checklistOpen} onOpenChange={setChecklistOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
          >
            <span className="flex items-center gap-1.5">
              Checklist
              <span className={cn(
                "font-bold",
                passedCount >= 3 ? "text-green-500" : passedCount >= 2 ? "text-yellow-500" : "text-red-500"
              )}>
                ({passedCount}/{checks.length})
              </span>
            </span>
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform duration-200",
              checklistOpen && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1 animate-accordion-down">
          <div className="space-y-0.5">
            {checks.map((check, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-center gap-1.5 p-1 rounded text-[10px]",
                  check.passed ? 'bg-green-500/5' : 'bg-yellow-500/5'
                )}
              >
                {check.passed ? (
                  <CheckCircle2 className="h-2.5 w-2.5 text-green-500 shrink-0" />
                ) : (
                  <AlertTriangle className="h-2.5 w-2.5 text-yellow-500 shrink-0" />
                )}
                <span className={check.passed ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Compact AI Tools */}
      <div className="space-y-0.5">
        <CompactToolButton
          icon={HelpCircle}
          label="Generate FAQ Schema"
          onClick={handleGenerateFAQ}
          isLoading={aiTools.isLoading.generate_faq}
        />
        <CompactToolButton
          icon={Mic}
          label="Voice Search Optimizer"
          onClick={handleOptimizeVoice}
          isLoading={aiTools.isLoading.optimize_voice}
        />
        {/* Gap 3.1: Removed duplicate Featured Snippet Builder - same functionality as Voice Search Optimizer */}
      </div>

      <AIResultModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type={modalType}
        result={currentResult}
        onApply={getApplyHandler()}
      />

      {/* Phase 2: Answer Box Optimizer */}
      <Separator className="my-2" />
      <p className="text-[9px] font-medium text-muted-foreground mb-1">Featured Snippet Optimization</p>
      
      <AnswerBoxOptimizer 
        pageId={pageId}
        pageData={pageData}
        languageCode={languageCode}
        focusKeyword={formState.formData.focusKeyword || undefined}
        formState={formState}
      />
    </div>
  );
}

interface CompactToolButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  isLoading?: boolean;
}

function CompactToolButton({ icon: Icon, label, onClick, isLoading }: CompactToolButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start gap-1.5 h-6 text-[10px]"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-2.5 w-2.5 animate-spin" />
      ) : (
        <Icon className="h-2.5 w-2.5" />
      )}
      <span>{label}</span>
    </Button>
  );
}
