/**
 * TechnicalPanel
 * 
 * Compact technical SEO settings with h-6 tab triggers,
 * reduced textarea height, and tighter spacing.
 * 
 * Optimized for narrow right panel (~320-420px).
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  Code, 
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Wand2,
  Gauge,
  ChevronDown,
  Library,
  Languages,
  ArrowRightLeft,
  Network
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SchemaWizard } from '../SchemaWizard';
import { HreflangManager } from '../HreflangManager';
import { SchemaLibrary, InternationalSEOValidator, SmartRedirectManager, TopicClusterMapper } from '../features';
import type { PageData } from '@/hooks/queries/usePageData';
import type { useSEOFormState } from '../hooks/useSEOFormState';

interface TechnicalPanelProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  formState: ReturnType<typeof useSEOFormState>;
}

export function TechnicalPanel({ pageId, pageData, languageCode, formState }: TechnicalPanelProps) {
  const { formData, updateField, isLoading } = formState;
  const [schemaMode, setSchemaMode] = useState<'wizard' | 'raw'>('wizard');

  const { data: redirects } = useQuery({
    queryKey: ['page-redirects', pageData.page_url],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('redirects')
        .select('*')
        .eq('to_path', pageData.page_url)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!pageData.page_url,
  });

  const isValidJson = (str: string): boolean => {
    if (!str.trim()) return true;
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const jsonValid = isValidJson(formData.structuredData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-20">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Current URL (read-only) */}
      <div className="space-y-1">
        <Label className="text-[10px]">Current URL</Label>
        <div className="flex gap-1">
          <Input value={pageData.page_url} disabled className="flex-1 h-6 text-[10px] bg-muted" />
          <Button variant="outline" size="sm" className="h-6 w-6 p-0" asChild>
            <a href={pageData.page_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      {/* Canonical URL */}
      <div className="space-y-1">
        <Label className="text-[10px]">Canonical URL</Label>
        <Input
          value={formData.canonicalUrl}
          onChange={(e) => updateField('canonicalUrl', e.target.value)}
          placeholder="Leave empty for current URL"
          className="h-6 text-[10px]"
        />
      </div>

      {/* Compact Index Controls */}
      <div className="p-1.5 rounded-md border bg-muted/20 space-y-1.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium">No Index</p>
            <p className="text-[8px] text-muted-foreground">Hide from search</p>
          </div>
          <Switch 
            checked={formData.noIndex} 
            onCheckedChange={(checked) => updateField('noIndex', checked)}
            className="scale-75"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium">No Follow</p>
            <p className="text-[8px] text-muted-foreground">Don't follow links</p>
          </div>
          <Switch 
            checked={formData.noFollow} 
            onCheckedChange={(checked) => updateField('noFollow', checked)}
            className="scale-75"
          />
        </div>

        {(formData.noIndex || formData.noFollow) && (
          <div className="flex items-center gap-1 p-1 bg-yellow-500/10 rounded text-yellow-600 text-[9px]">
            <AlertTriangle className="h-2.5 w-2.5 shrink-0" />
            <span>
              {formData.noIndex && 'Hidden from search'}
              {formData.noIndex && formData.noFollow && ' • '}
              {formData.noFollow && 'Links not followed'}
            </span>
          </div>
        )}
      </div>

      {/* Structured Data Section */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] flex items-center gap-1">
            <Code className="h-3 w-3" />
            Structured Data
          </Label>
          {formData.structuredData && (
            jsonValid ? (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            ) : (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            )
          )}
        </div>

        {/* Schema Mode Tabs - Compact h-6 */}
        <Tabs value={schemaMode} onValueChange={(v) => setSchemaMode(v as 'wizard' | 'raw')}>
          <TabsList className="grid w-full grid-cols-2 h-6">
            <TabsTrigger value="wizard" className="text-[9px] gap-1 h-5 data-[state=active]:text-primary">
              <Wand2 className="h-2.5 w-2.5" />
              Wizard
            </TabsTrigger>
            <TabsTrigger value="raw" className="text-[9px] gap-1 h-5 data-[state=active]:text-primary">
              <Code className="h-2.5 w-2.5" />
              Raw
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wizard" className="mt-1.5">
            <SchemaWizard
              value={formData.structuredData}
              onChange={(json) => updateField('structuredData', json)}
              pageTitle={pageData.page_title}
              pageUrl={pageData.page_url}
            />
          </TabsContent>

          <TabsContent value="raw" className="mt-1.5">
            <Textarea
              value={formData.structuredData}
              onChange={(e) => updateField('structuredData', e.target.value)}
              placeholder={`{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${pageData.page_title}"
}`}
              className="font-mono text-[9px] min-h-[80px] resize-none"
            />
            {formData.structuredData && !jsonValid && (
              <p className="text-red-500 text-[9px] mt-0.5 flex items-center gap-1">
                <AlertTriangle className="h-2.5 w-2.5" />
                Invalid JSON format
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Core Web Vitals - External Link */}
      <div className="space-y-1 pt-2 border-t">
        <Label className="text-[10px] flex items-center gap-1">
          <Gauge className="h-3 w-3" />
          Core Web Vitals
        </Label>
        <div className="p-2 rounded border bg-muted/20 space-y-1">
          <p className="text-[9px] text-muted-foreground">
            Analyze your page performance using Google's free tool:
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full h-6 text-[9px]"
            asChild
          >
            <a 
              href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(window.location.origin + pageData.page_url)}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-2.5 w-2.5 mr-1" />
              Open PageSpeed Insights →
            </a>
          </Button>
        </div>
      </div>

      {/* Hreflang Manager */}
      <div className="space-y-1 pt-2 border-t">
        <Label className="text-[10px] flex items-center gap-1">
          <ExternalLink className="h-3 w-3" />
          Hreflang Tags
        </Label>
        <HreflangManager 
          pageUrl={pageData.page_url} 
          currentLanguage={languageCode}
        />
      </div>

      {/* Redirects (if any) */}
      {redirects && redirects.length > 0 && (
        <div className="space-y-1">
          <Label className="text-[10px]">Incoming Redirects</Label>
          <div className="space-y-0.5">
            {redirects.slice(0, 2).map((redirect) => (
              <div 
                key={redirect.id}
                className="flex items-center justify-between p-1 bg-muted/50 rounded text-[9px]"
              >
                <span className="font-mono truncate flex-1">{redirect.from_path}</span>
                <Badge variant="outline" className="text-[8px] h-4 ml-1">{redirect.redirect_type}</Badge>
              </div>
            ))}
            {redirects.length > 2 && (
              <p className="text-[9px] text-muted-foreground">+{redirects.length - 2} more</p>
            )}
          </div>
        </div>
      )}

      {/* Phase 2: Advanced Technical SEO Features */}
      <Separator className="my-2" />
      <p className="text-[9px] font-medium text-muted-foreground mb-1">Advanced Tools</p>

      {/* Schema Library */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
          >
            <span className="flex items-center gap-1.5">
              <Library className="h-2.5 w-2.5" />
              Schema Library
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 animate-accordion-down">
          <SchemaLibrary 
            pageData={pageData}
            formState={formState}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* International SEO Validator */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
          >
            <span className="flex items-center gap-1.5">
              <Languages className="h-2.5 w-2.5" />
              International SEO
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 animate-accordion-down">
          {/* Gap 4.3: Pass formState to InternationalSEOValidator */}
          <InternationalSEOValidator 
            pageId={pageId}
            pageData={pageData}
            currentLanguage={languageCode}
            formState={formState}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Smart Redirect Manager */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
          >
            <span className="flex items-center gap-1.5">
              <ArrowRightLeft className="h-2.5 w-2.5" />
              Redirect Manager
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 animate-accordion-down">
          <SmartRedirectManager pageData={pageData} />
        </CollapsibleContent>
      </Collapsible>

      {/* Topic Cluster Mapper */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
          >
            <span className="flex items-center gap-1.5">
              <Network className="h-2.5 w-2.5" />
              Topic Clusters
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 animate-accordion-down">
          {/* Gap 4.4: Pass showCurrentPageContext prop for context awareness */}
          <TopicClusterMapper pageId={pageId} pageData={pageData} showCurrentPageContext={true} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
