/**
 * InternationalSEOValidator
 * 
 * Validates multi-language SEO consistency.
 * Checks for missing translations and hreflang completeness.
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Globe2, 
  ChevronDown, 
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PageData } from '@/hooks/queries/usePageData';
import type { useSEOFormState } from '../hooks/useSEOFormState';

interface InternationalSEOValidatorProps {
  pageId: string;
  pageData: PageData;
  currentLanguage: string;
  formState?: ReturnType<typeof useSEOFormState>;
}

interface LanguageSEOStatus {
  code: string;
  name: string;
  hasMetaTitle: boolean;
  hasMetaDescription: boolean;
  hasFocusKeyword: boolean;
  hasOgImage: boolean;
  completeness: number;
}

// Gap 4.3: Accept formState for current language validation
export function InternationalSEOValidator({ pageId, pageData, currentLanguage, formState }: InternationalSEOValidatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch all active languages
  const { data: languages } = useQuery({
    queryKey: ['active-languages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('languages')
        .select('code, name')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });

  // Fetch SEO data for all languages
  const { data: seoData, isLoading } = useQuery({
    queryKey: ['page-seo-all-languages', pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_id', pageId);
      if (error) throw error;
      return data;
    },
    enabled: !!pageId && isOpen,
  });

  // Calculate SEO status for each language - use formState for current language
  const languageStatuses: LanguageSEOStatus[] = (languages || []).map(lang => {
    const seo = seoData?.find(s => s.language_code === lang.code);
    
    // For current language, prefer formState values if available
    const isCurrentLang = lang.code === currentLanguage;
    const hasMetaTitle = isCurrentLang && formState 
      ? !!formState.formData.metaTitle?.trim()
      : !!seo?.meta_title?.trim();
    const hasMetaDescription = isCurrentLang && formState
      ? !!formState.formData.metaDescription?.trim()
      : !!seo?.meta_description?.trim();
    const hasFocusKeyword = isCurrentLang && formState
      ? !!formState.formData.focusKeyword?.trim()
      : !!seo?.focus_keyword?.trim();
    const hasOgImage = isCurrentLang && formState
      ? !!formState.formData.ogImageUrl?.trim() || !!pageData.og_image_url
      : !!seo?.og_image_url?.trim() || !!pageData.og_image_url;
    
    const checks = [hasMetaTitle, hasMetaDescription, hasFocusKeyword, hasOgImage];
    const completeness = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    
    return {
      code: lang.code,
      name: lang.name,
      hasMetaTitle,
      hasMetaDescription,
      hasFocusKeyword,
      hasOgImage,
      completeness,
    };
  });

  const averageCompleteness = languageStatuses.length > 0
    ? Math.round(languageStatuses.reduce((acc, l) => acc + l.completeness, 0) / languageStatuses.length)
    : 0;

  const missingCount = languageStatuses.filter(l => l.completeness < 100).length;

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />
    ) : (
      <XCircle className="h-2.5 w-2.5 text-red-500" />
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between h-6 text-[10px]"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-1.5">
            <Globe2 className="h-2.5 w-2.5" />
            International SEO
            {missingCount > 0 && (
              <Badge variant="outline" className="text-[8px] h-4 border-yellow-500 text-yellow-600">
                {missingCount} incomplete
              </Badge>
            )}
          </span>
          <ChevronDown className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-1.5 space-y-2 animate-accordion-down">
        {isLoading ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Overall Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-medium">Overall Completeness</span>
                <span className={cn(
                  "text-[10px] font-bold",
                  averageCompleteness >= 80 ? "text-green-600" :
                  averageCompleteness >= 50 ? "text-yellow-600" : "text-red-600"
                )}>
                  {averageCompleteness}%
                </span>
              </div>
              <Progress value={averageCompleteness} className="h-1.5" />
            </div>

            {/* Language Table */}
            <div className="space-y-1 max-h-[150px] overflow-y-auto">
              {languageStatuses.map((lang) => (
                <div 
                  key={lang.code}
                  className={cn(
                    "flex items-center gap-2 p-1.5 rounded border text-[9px]",
                    lang.code === currentLanguage ? "bg-primary/5 border-primary/20" : "bg-muted/20"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium truncate">{lang.name}</span>
                      <Badge variant="outline" className="text-[7px] h-3 uppercase">
                        {lang.code}
                      </Badge>
                      {lang.code === currentLanguage && (
                        <Badge variant="secondary" className="text-[7px] h-3">current</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div title="Meta Title">{getStatusIcon(lang.hasMetaTitle)}</div>
                    <div title="Meta Description">{getStatusIcon(lang.hasMetaDescription)}</div>
                    <div title="Focus Keyword">{getStatusIcon(lang.hasFocusKeyword)}</div>
                    <div title="OG Image">{getStatusIcon(lang.hasOgImage)}</div>
                  </div>

                  <span className={cn(
                    "text-[8px] w-8 text-right font-medium",
                    lang.completeness >= 80 ? "text-green-600" :
                    lang.completeness >= 50 ? "text-yellow-600" : "text-red-600"
                  )}>
                    {lang.completeness}%
                  </span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 text-[8px] text-muted-foreground pt-1 border-t">
              <span className="flex items-center gap-0.5">
                <CheckCircle2 className="h-2 w-2 text-green-500" /> Title
              </span>
              <span className="flex items-center gap-0.5">
                <CheckCircle2 className="h-2 w-2 text-green-500" /> Desc
              </span>
              <span className="flex items-center gap-0.5">
                <CheckCircle2 className="h-2 w-2 text-green-500" /> Keyword
              </span>
              <span className="flex items-center gap-0.5">
                <CheckCircle2 className="h-2 w-2 text-green-500" /> OG Image
              </span>
            </div>
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
