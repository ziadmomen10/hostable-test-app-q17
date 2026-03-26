/**
 * GEOPanel
 * 
 * Compact GEO tools with h-5 entity inputs, p-1 checklist items,
 * and tighter spacing throughout.
 * 
 * Optimized for narrow right panel (~320-420px).
 * Enhanced with form state integration and history logging.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { AIResultModal, type AIResultType } from '../AIResultModal';
import { useSEOAITools, type EntitySchema, type EntityInput } from '../hooks/useSEOAITools';
import { useSEOHistory } from '../hooks/useSEOHistory';
import { AICitationOptimizer, LLMVisibilityScore } from '../features';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Building2, 
  BarChart3,
  Quote,
  CheckCircle2,
  AlertTriangle,
  Brain,
  ChevronDown,
  Loader2,
  Plus,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PageData } from '@/hooks/queries/usePageData';
import type { useSEOFormState } from '../hooks/useSEOFormState';

interface GEOPanelProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  formState: ReturnType<typeof useSEOFormState>;
}

export function GEOPanel({ pageId, pageData, languageCode, formState }: GEOPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<AIResultType>('entity');
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [entityOpen, setEntityOpen] = useState(false);
  
  const [entityType, setEntityType] = useState<'Organization' | 'Person'>('Organization');
  const [entityName, setEntityName] = useState('');
  const [socialLinks, setSocialLinks] = useState<string[]>(['']);

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
  // Gap L3: Use formState for real-time checklist updates
  const structuredDataStr = formState.formData.structuredData || '{}';
  
  const checks = [
    { label: 'Entity Schema', passed: structuredDataStr.includes('Organization') || structuredDataStr.includes('Person') },
    { label: 'Social Links', passed: structuredDataStr.includes('sameAs') },
    { label: 'Fact-rich', passed: /\d+%|\$\d+|\d{4}/g.test(content) },
    { label: 'Citation-worthy', passed: /according to|research|study|source/i.test(content) },
    { label: 'Brand Schema', passed: structuredDataStr.includes('brand') },
  ];

  const passedCount = checks.filter(c => c.passed).length;

  const handleBuildEntity = async () => {
    const entityData: EntityInput = {
      type: entityType,
      name: entityName || pageData.page_title,
      url: pageData.page_url,
      socialLinks: socialLinks.filter(l => l.trim()),
    };

    const result = await aiTools.buildEntity(entityData);
    if (result) {
      setCurrentResult(result);
      setModalType('entity');
      setModalOpen(true);
    }
  };

  const handleEnrichFacts = async () => {
    const result = await aiTools.enrichFacts();
    if (result) {
      setCurrentResult(result);
      setModalType('facts');
      setModalOpen(true);
    }
  };

  const handleSuggestKeywords = async () => {
    const result = await aiTools.suggestKeywords();
    if (result) {
      setCurrentResult(result);
      setModalType('keywords');
      setModalOpen(true);
    }
  };

  // Gap F1: Apply keywords with undo toast
  const handleApplyKeywords = async (result: { primaryKeyword?: { keyword: string }; secondaryKeywords?: { keyword: string }[] }) => {
    try {
      const oldFocusKeyword = formState.formData.focusKeyword;
      const oldSecondaryKeywords = formState.formData.secondaryKeywords;
      const updates: Partial<typeof formState.formData> = {};
      
      if (result.primaryKeyword?.keyword) {
        updates.focusKeyword = result.primaryKeyword.keyword;
        
        // Log the change with error handling
        try {
          logChange({
            page_id: pageId,
            language_code: languageCode,
            change_type: 'ai_generated',
            field_name: 'focus_keyword',
            old_value: oldFocusKeyword || null,
            new_value: result.primaryKeyword.keyword,
            changed_by: null,
          });
        } catch (error) {
          console.warn('Failed to log focus_keyword history:', error);
        }
      }
      
      if (result.secondaryKeywords?.length) {
        updates.secondaryKeywords = result.secondaryKeywords.map(kw => kw.keyword);
        
        // Log the change with error handling
        try {
          logChange({
            page_id: pageId,
            language_code: languageCode,
            change_type: 'ai_generated',
            field_name: 'secondary_keywords',
            old_value: JSON.stringify(oldSecondaryKeywords),
            new_value: JSON.stringify(updates.secondaryKeywords),
            changed_by: null,
          });
        } catch (error) {
          console.warn('Failed to log secondary_keywords history:', error);
        }
      }
      
      if (Object.keys(updates).length > 0) {
        formState.updateFields(updates);
        
        // Gap F1: Show undo toast with 10-second duration
        toast.success('Keywords applied - remember to save!', {
          duration: 10000,
          action: {
            label: 'Undo',
            onClick: () => {
              formState.updateFields({
                focusKeyword: oldFocusKeyword,
                secondaryKeywords: oldSecondaryKeywords,
              });
              toast.info('Keywords change reverted');
            },
          },
        });
      }
      
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to apply keywords:', error);
      toast.error('Failed to apply keywords');
    }
  };

  // Gap F1: Apply entity schema with undo toast
  const handleApplyEntity = async (result: EntitySchema) => {
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

      // Merge with new entity schema
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
      toast.success('Entity schema added - remember to save!', {
        duration: 10000,
        action: {
          label: 'Undo',
          onClick: () => {
            formState.updateField('structuredData', currentSchemaStr);
            toast.info('Entity schema change reverted');
          },
        },
      });
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to apply entity schema:', error);
      toast.error('Failed to apply entity schema');
    }
  };

  return (
    <div className="space-y-1.5">
      {/* Collapsible Checklist with status in trigger - Gap 5.1: aria-expanded */}
      <Collapsible open={checklistOpen} onOpenChange={setChecklistOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
            aria-expanded={checklistOpen}
          >
            <span className="flex items-center gap-1.5">
              AI Citability
              <span className={cn(
                "font-bold",
                passedCount >= 4 ? "text-green-500" : passedCount >= 2 ? "text-yellow-500" : "text-red-500"
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

      {/* Collapsible Entity Builder - Gap 5.1: aria-expanded */}
      <Collapsible open={entityOpen} onOpenChange={setEntityOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
            aria-expanded={entityOpen}
          >
            <span className="flex items-center gap-1.5">
              <Building2 className="h-2.5 w-2.5" />
              Entity Builder
            </span>
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform duration-200",
              entityOpen && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 space-y-1.5 animate-accordion-down">
          <div className="grid grid-cols-2 gap-0.5">
            <Button
              variant={entityType === 'Organization' ? 'default' : 'outline'}
              onClick={() => setEntityType('Organization')}
              className="h-5 text-[9px]"
            >
              <Building2 className="h-2.5 w-2.5 mr-0.5" />
              Org
            </Button>
            <Button
              variant={entityType === 'Person' ? 'default' : 'outline'}
              onClick={() => setEntityType('Person')}
              className="h-5 text-[9px]"
            >
              <Brain className="h-2.5 w-2.5 mr-0.5" />
              Person
            </Button>
          </div>

          <div className="space-y-0.5">
            <Label className="text-[9px]">Name</Label>
            <Input
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder={pageData.page_title}
              className="h-5 text-[10px]"
            />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <Label className="text-[9px]">Social Links</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0"
                onClick={() => setSocialLinks([...socialLinks, ''])}
              >
                <Plus className="h-2.5 w-2.5" />
              </Button>
            </div>
            {socialLinks.map((link, index) => (
              <div key={index} className="flex gap-0.5">
                <Input
                  value={link}
                  onChange={(e) => {
                    const updated = [...socialLinks];
                    updated[index] = e.target.value;
                    setSocialLinks(updated);
                  }}
                  placeholder="https://..."
                  className="h-5 text-[10px]"
                />
                {socialLinks.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 w-5 p-0"
                    onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== index))}
                  >
                    <X className="h-2.5 w-2.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button 
            className="w-full h-5 text-[9px]" 
            onClick={handleBuildEntity}
            disabled={aiTools.isLoading.build_entity}
          >
            {aiTools.isLoading.build_entity ? (
              <Loader2 className="h-2.5 w-2.5 mr-0.5 animate-spin" />
            ) : (
              <Sparkles className="h-2.5 w-2.5 mr-0.5" />
            )}
            Generate Schema
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Compact AI Tools */}
      <div className="space-y-0.5">
        <CompactToolButton
          icon={BarChart3}
          label="Fact Density Enricher"
          onClick={handleEnrichFacts}
          isLoading={aiTools.isLoading.enrich_facts}
        />
        <CompactToolButton
          icon={Quote}
          label="Keyword Intelligence"
          onClick={handleSuggestKeywords}
          isLoading={aiTools.isLoading.suggest_keywords}
        />
      </div>

      <AIResultModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type={modalType}
        result={currentResult}
        onApply={
          modalType === 'entity' ? handleApplyEntity : 
          modalType === 'keywords' ? handleApplyKeywords : 
          undefined
        }
      />

      {/* Phase 2: AI-Native GEO Features */}
      <Separator className="my-2" />
      <p className="text-[9px] font-medium text-muted-foreground mb-1">AI-Native Optimization</p>
      
      {/* Gap 1.3 & 1.4: Pass focusKeyword to AI components */}
      <AICitationOptimizer 
        pageId={pageId}
        pageData={pageData}
        languageCode={languageCode}
        focusKeyword={formState.formData.focusKeyword || undefined}
      />

      <LLMVisibilityScore 
        pageId={pageId}
        pageData={pageData}
        languageCode={languageCode}
        focusKeyword={formState.formData.focusKeyword || undefined}
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
