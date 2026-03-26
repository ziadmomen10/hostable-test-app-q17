/**
 * MetaPanel
 * 
 * Compact meta editor with tighter spacing and inline SERP preview.
 * Removed redundant progress bars, reduced spacing to space-y-2.
 * Fixed OG image upload with file picker integration.
 * Enhanced with secondary keywords support.
 */

import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, Image as ImageIcon, Sparkles, Wand2, ChevronDown, Upload, X } from 'lucide-react';
import { AIResultModal } from '../AIResultModal';
import { useSEOAITools, type MetaSuggestion, type KeywordSuggestion } from '../hooks/useSEOAITools';
import { useSEOHistory } from '../hooks/useSEOHistory';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { PageData } from '@/hooks/queries/usePageData';
import type { useSEOFormState } from '../hooks/useSEOFormState';

interface MetaPanelProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  formState: ReturnType<typeof useSEOFormState>;
}

export function MetaPanel({ pageId, pageData, languageCode, formState }: MetaPanelProps) {
  const { formData, updateField, updateFields, isLoading } = formState;
  const [modalOpen, setModalOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<MetaSuggestion | null>(null);
  const [ogOpen, setOgOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { logChange } = useSEOHistory({ pageId, languageCode, limit: 1 });

  const aiTools = useSEOAITools({
    pageId,
    languageCode,
    content: pageData.content || '',
    pageTitle: pageData.page_title,
    pageUrl: pageData.page_url,
    focusKeyword: formData.focusKeyword,
  });

  const titleLength = formData.metaTitle.length;
  const descLength = formData.metaDescription.length;
  const titleStatus = titleLength >= 30 && titleLength <= 60 ? 'good' : titleLength > 0 ? 'warning' : 'error';
  const descStatus = descLength >= 120 && descLength <= 160 ? 'good' : descLength > 0 ? 'warning' : 'error';

  const handleGenerateMeta = async () => {
    const result = await aiTools.generateMeta();
    if (result) {
      setCurrentResult(result);
      setModalOpen(true);
    }
  };

  // Gap F1: Apply meta with undo toast
  const handleApplyMeta = (result: MetaSuggestion) => {
    const oldTitle = formData.metaTitle;
    const oldDesc = formData.metaDescription;
    
    updateFields({
      metaTitle: result.title,
      metaDescription: result.description,
    });
    
    // Log AI-generated changes to history with error handling
    if (result.title !== oldTitle) {
      try {
        logChange({
          page_id: pageId,
          language_code: languageCode,
          change_type: 'ai_generated',
          field_name: 'meta_title',
          old_value: oldTitle || null,
          new_value: result.title,
          changed_by: null,
        });
      } catch (error) {
        console.warn('Failed to log meta_title history:', error);
      }
    }
    
    if (result.description !== oldDesc) {
      try {
        logChange({
          page_id: pageId,
          language_code: languageCode,
          change_type: 'ai_generated',
          field_name: 'meta_description',
          old_value: oldDesc || null,
          new_value: result.description,
          changed_by: null,
        });
      } catch (error) {
        console.warn('Failed to log meta_description history:', error);
      }
    }

    // Gap F1: Show undo toast with 10-second duration
    toast.success('AI meta applied - remember to save!', {
      duration: 10000,
      action: {
        label: 'Undo',
        onClick: () => {
          updateFields({
            metaTitle: oldTitle,
            metaDescription: oldDesc,
          });
          toast.info('Meta changes reverted');
        },
      },
    });
    setModalOpen(false);
  };

  // Gap F1: Suggest keywords with undo toast
  const handleSuggestKeywords = async () => {
    const result = await aiTools.suggestKeywords();
    if (result) {
      const oldKeyword = formData.focusKeyword;
      const oldSecondary = formData.secondaryKeywords;
      
      // Apply primary keyword
      if (result.primaryKeyword) {
        updateField('focusKeyword', result.primaryKeyword.keyword);
        
        // Log the AI-generated change with error handling
        try {
          logChange({
            page_id: pageId,
            language_code: languageCode,
            change_type: 'ai_generated',
            field_name: 'focus_keyword',
            old_value: oldKeyword || null,
            new_value: result.primaryKeyword.keyword,
            changed_by: null,
          });
        } catch (error) {
          console.warn('Failed to log focus_keyword history:', error);
        }
      }
      
      // Apply secondary keywords
      if (result.secondaryKeywords?.length) {
        const secondaryKws = result.secondaryKeywords.map(kw => kw.keyword);
        updateField('secondaryKeywords', secondaryKws);
        
        // Log the AI-generated change with error handling
        try {
          logChange({
            page_id: pageId,
            language_code: languageCode,
            change_type: 'ai_generated',
            field_name: 'secondary_keywords',
            old_value: JSON.stringify(oldSecondary),
            new_value: JSON.stringify(secondaryKws),
            changed_by: null,
          });
        } catch (error) {
          console.warn('Failed to log secondary_keywords history:', error);
        }
      }

      // Gap F1: Show undo toast with 10-second duration
      toast.success(`Applied ${result.secondaryKeywords?.length || 0} keywords - remember to save!`, {
        duration: 10000,
        action: {
          label: 'Undo',
          onClick: () => {
            updateField('focusKeyword', oldKeyword);
            updateField('secondaryKeywords', oldSecondary);
            toast.info('Keywords change reverted');
          },
        },
      });
    }
  };

  const handleRemoveSecondaryKeyword = (index: number) => {
    const updated = formData.secondaryKeywords.filter((_, i) => i !== index);
    updateField('secondaryKeywords', updated);
  };

  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `og-${pageId}-${Date.now()}.${fileExt}`;
      const filePath = `seo/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('page-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('page-assets')
        .getPublicUrl(filePath);

      updateField('ogImageUrl', publicUrl);
      toast.success('OG image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Mini SERP Preview */}
      <div className="p-2 bg-muted/20 rounded-md border border-dashed text-xs space-y-0.5">
        <p className="text-[10px] text-muted-foreground mb-1">Live Preview</p>
        <p className="text-blue-600 dark:text-blue-400 font-medium truncate">
          {formData.metaTitle || 'Your Title Here'}
        </p>
        <p className="text-green-700 dark:text-green-500 text-[11px] truncate">
          {window.location.origin}{pageData.page_url}
        </p>
        <p className="text-muted-foreground line-clamp-2 leading-snug">
          {formData.metaDescription || 'Your description will appear here...'}
        </p>
      </div>

      {/* Meta Title */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Meta Title</Label>
          <div className="flex items-center gap-1">
            <CharCounter current={titleLength} max={60} status={titleStatus} />
            <Button 
              variant="ghost" 
              size="sm"
              className="h-5 w-5 p-0"
              onClick={handleGenerateMeta}
              disabled={aiTools.isLoading.generate_meta}
            >
              {aiTools.isLoading.generate_meta ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3 text-primary" />
              )}
            </Button>
          </div>
        </div>
        <Input
          value={formData.metaTitle}
          onChange={(e) => updateField('metaTitle', e.target.value)}
          placeholder="Page title..."
          className="h-8 text-sm"
        />
      </div>

      {/* Meta Description */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Meta Description</Label>
          <CharCounter current={descLength} max={160} status={descStatus} />
        </div>
        <Textarea
          value={formData.metaDescription}
          onChange={(e) => updateField('metaDescription', e.target.value)}
          placeholder="Page description..."
          rows={2}
          className="text-sm resize-none min-h-[52px]"
        />
      </div>

      {/* Focus Keyword */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Focus Keyword</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 px-1.5 text-[10px]"
            onClick={handleSuggestKeywords}
            disabled={aiTools.isLoading.suggest_keywords}
          >
            {aiTools.isLoading.suggest_keywords ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <><Wand2 className="h-3 w-3 mr-0.5" />Suggest</>
            )}
          </Button>
        </div>
        <Input
          value={formData.focusKeyword}
          onChange={(e) => updateField('focusKeyword', e.target.value)}
          placeholder="Main keyword..."
          className="h-8 text-sm"
        />
      </div>

      {/* Secondary Keywords */}
      {formData.secondaryKeywords.length > 0 && (
        <div className="space-y-1">
          <Label className="text-xs">Secondary Keywords</Label>
          <div className="flex flex-wrap gap-1">
            {formData.secondaryKeywords.map((kw, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-[10px] pr-1 gap-0.5"
              >
                {kw}
                <button
                  onClick={() => handleRemoveSecondaryKeyword(index)}
                  className="ml-0.5 hover:text-destructive"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible Open Graph */}
      <Collapsible open={ogOpen} onOpenChange={setOgOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-7 text-xs"
          >
            <span>Open Graph Settings</span>
            <ChevronDown className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              ogOpen && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2 animate-accordion-down">
          <div className="space-y-1">
            <Label className="text-xs">OG Title</Label>
            <Input
              value={formData.ogTitle}
              onChange={(e) => updateField('ogTitle', e.target.value)}
              placeholder={formData.metaTitle || 'Same as meta title'}
              className="h-7 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">OG Description</Label>
            <Textarea
              value={formData.ogDescription}
              onChange={(e) => updateField('ogDescription', e.target.value)}
              placeholder={formData.metaDescription || 'Same as meta description'}
              rows={2}
              className="text-xs resize-none min-h-[44px]"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">OG Image URL</Label>
            <div className="flex gap-1">
              <Input
                value={formData.ogImageUrl}
                onChange={(e) => updateField('ogImageUrl', e.target.value)}
                placeholder="https://..."
                className="flex-1 h-7 text-xs"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleOgImageUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 w-7 p-0"
                onClick={handleImageButtonClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Upload className="h-3 w-3" />
                )}
              </Button>
            </div>
            {formData.ogImageUrl && (
              <img 
                src={formData.ogImageUrl} 
                alt="OG Preview" 
                className="w-full h-16 object-cover rounded border"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <AIResultModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type="meta"
        result={currentResult}
        onApply={handleApplyMeta}
      />
    </div>
  );
}

function CharCounter({ current, max, status }: { current: number; max: number; status: string }) {
  const color = status === 'good' ? 'text-green-500' : status === 'warning' ? 'text-yellow-500' : 'text-red-500';
  return <span className={cn("text-[10px] tabular-nums font-medium", color)}>{current}/{max}</span>;
}
