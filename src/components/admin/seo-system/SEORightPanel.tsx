/**
 * SEORightPanel
 * 
 * Compact right sidebar with tab issue badges, keyboard shortcut hints,
 * minimized save footer, history logging, and autosave support.
 * 
 * Gap A2/A3/A4: Refactored to use extracted hooks (useSEOSave, useSEOAutosave, useSEOKeyboardShortcuts)
 * and wrapped panels with SEOPanelErrorBoundary for fault tolerance.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OverviewPanel } from './panels/OverviewPanel';
import { MetaPanel } from './panels/MetaPanel';
import { ContentPanel } from './panels/ContentPanel';
import { TechnicalPanel } from './panels/TechnicalPanel';
import { AEOPanel } from './panels/AEOPanel';
import { GEOPanel } from './panels/GEOPanel';
import { HistoryPanel } from './panels/HistoryPanel';
import { SEOPanelErrorBoundary } from './SEOPanelErrorBoundary';
import { useSEOSave } from './hooks/useSEOSave';
import { useSEOAutosave } from './hooks/useSEOAutosave';
import { useSEOKeyboardShortcuts } from './hooks/useSEOKeyboardShortcuts';
import { seoQueryKeys } from './hooks/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  ChevronRight, 
  LayoutDashboard, 
  FileText, 
  Type, 
  Settings2, 
  MessageSquare, 
  Sparkles,
  History,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { PageData } from '@/hooks/queries/usePageData';
import type { useSEOFormState } from './hooks/useSEOFormState';
import { useSEOAnalysis } from './hooks/useSEOAnalysis';

interface SEORightPanelProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  onCollapse: () => void;
  formState: ReturnType<typeof useSEOFormState>;
  externalActiveTab?: string | null;
  onExternalTabHandled?: () => void;
  onSaveComplete?: () => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'meta', label: 'Meta', icon: FileText },
  { id: 'content', label: 'Content', icon: Type },
  { id: 'technical', label: 'Tech', icon: Settings2 },
  { id: 'aeo', label: 'AEO', icon: MessageSquare },
  { id: 'geo', label: 'GEO', icon: Sparkles },
  { id: 'history', label: 'History', icon: History },
];

export function SEORightPanel({
  pageId,
  pageData,
  languageCode,
  onCollapse,
  formState,
  externalActiveTab,
  onExternalTabHandled,
  onSaveComplete,
}: SEORightPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Gap A1: Use centralized query keys
  // Gap 5.2: Get current computed scores for persistence on save
  const { seoScore, aeoScore, geoScore } = useSEOAnalysis(pageId, languageCode);

  // Handle external tab navigation from overlay
  useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(externalActiveTab);
      onExternalTabHandled?.();
    }
  }, [externalActiveTab, onExternalTabHandled]);

  // Gap A1: Fetch SEO data to calculate issues per tab using centralized keys
  const { data: seoData } = useQuery({
    queryKey: seoQueryKeys.pageSeo(pageId, languageCode),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_id', pageId)
        .eq('language_code', languageCode)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!pageId,
  });

  // Calculate issue counts per tab - using formState for live updates
  const tabIssues = useMemo(() => {
    const issues: Record<string, number> = {};
    
    // Meta issues - use formState for live updates
    const titleLen = (formState.formData.metaTitle || pageData.page_title || '').length;
    const descLen = (formState.formData.metaDescription || pageData.page_description || '').length;
    let metaCount = 0;
    if (titleLen === 0 || titleLen < 30 || titleLen > 60) metaCount++;
    if (descLen === 0 || descLen < 120 || descLen > 160) metaCount++;
    if (!formState.formData.focusKeyword) metaCount++;
    issues.meta = metaCount;

    // Content issues - simplified
    const content = pageData.content || '';
    let contentCount = 0;
    const h1Count = (content.match(/"type"\s*:\s*"h1"/gi) || []).length;
    if (h1Count !== 1) contentCount++;
    issues.content = contentCount;

    // Technical - check for valid JSON in structured data
    let technicalCount = 0;
    if (formState.formData.structuredData.trim()) {
      try {
        JSON.parse(formState.formData.structuredData);
      } catch {
        technicalCount++;
      }
    }
    issues.technical = technicalCount;

    // AEO issues - use formState structured data
    const structuredDataStr = formState.formData.structuredData;
    const hasFAQ = structuredDataStr.includes('FAQPage');
    issues.aeo = hasFAQ ? 0 : 1;

    // GEO issues
    const hasEntity = structuredDataStr.includes('Organization') || structuredDataStr.includes('Person');
    issues.geo = hasEntity ? 0 : 1;

    return issues;
  }, [formState.formData, pageData]);

  // Gap A2/A4: Use extracted save hook instead of inline mutation
  const { saveMutation, save } = useSEOSave({
    pageId,
    languageCode,
    formState,
    seoScore,
    aeoScore,
    geoScore,
    onSuccess: () => {
      setLastSaved(new Date());
      onSaveComplete?.();
    },
  });

  // Gap A2: Use extracted autosave hook
  const { autosaveError } = useSEOAutosave({
    isDirty: formState.isDirty,
    isPending: saveMutation.isPending,
    pageId,
    languageCode,
    saveMutation,
    delay: 30000,
  });

  // Gap A2: Use extracted keyboard shortcuts hook
  useSEOKeyboardShortcuts({
    tabs,
    onSave: save,
    onTabChange: setActiveTab,
  });

  return (
    <div className="h-full flex flex-col bg-background border-l">
      {/* Compact Header - 28px */}
      <div className="flex items-center justify-between px-2 py-1 border-b shrink-0 h-7">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={onCollapse}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Tools</span>
          {formState.isDirty && (
            <Badge variant="outline" className="text-[9px] py-0 h-4 px-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
              <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
              Unsaved
            </Badge>
          )}
          {autosaveError && (
            <Badge variant="outline" className="text-[9px] py-0 h-4 px-1 bg-red-500/10 text-red-600 border-red-500/30">
              <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
              Save Failed
            </Badge>
          )}
        </div>
      </div>

      {/* Horizontal Pill Tabs with Issue Badges - Gap 3.2: Arrow key navigation */}
      <div 
        className="flex gap-0.5 px-1 py-0.5 border-b bg-muted/30 overflow-x-auto scrollbar-hide shrink-0" 
        role="tablist"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const currentIndex = tabs.findIndex(t => t.id === activeTab);
            const nextIndex = e.key === 'ArrowRight' 
              ? (currentIndex + 1) % tabs.length 
              : (currentIndex - 1 + tabs.length) % tabs.length;
            setActiveTab(tabs[nextIndex].id);
            // Focus the new tab
            document.getElementById(`tab-${tabs[nextIndex].id}`)?.focus();
          }
        }}
      >
        {tabs.map((tab, index) => {
          const issueCount = tabIssues[tab.id] || 0;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium shrink-0 transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
              title={`${tab.label} (⌘${index + 1})`}
            >
              <tab.icon className="h-3 w-3" />
              <span>{tab.label}</span>
              {issueCount > 0 && !isActive && (
                <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                  {issueCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content - Gap A3: Wrap panels with error boundaries */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {activeTab === 'overview' && (
            <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview">
              <SEOPanelErrorBoundary panelName="Overview" onReset={() => setActiveTab('meta')}>
                <OverviewPanel pageId={pageId} pageData={pageData} languageCode={languageCode} formState={formState} />
              </SEOPanelErrorBoundary>
            </div>
          )}
          {activeTab === 'meta' && (
            <div id="panel-meta" role="tabpanel" aria-labelledby="tab-meta">
              <SEOPanelErrorBoundary panelName="Meta" onReset={() => setActiveTab('overview')}>
                <MetaPanel 
                  pageId={pageId} 
                  pageData={pageData} 
                  languageCode={languageCode}
                  formState={formState}
                />
              </SEOPanelErrorBoundary>
            </div>
          )}
          {activeTab === 'content' && (
            <div id="panel-content" role="tabpanel" aria-labelledby="tab-content">
              <SEOPanelErrorBoundary panelName="Content" onReset={() => setActiveTab('meta')}>
                <ContentPanel pageId={pageId} pageData={pageData} languageCode={languageCode} formState={formState} />
              </SEOPanelErrorBoundary>
            </div>
          )}
          {activeTab === 'technical' && (
            <div id="panel-technical" role="tabpanel" aria-labelledby="tab-technical">
              <SEOPanelErrorBoundary panelName="Technical" onReset={() => setActiveTab('meta')}>
                <TechnicalPanel 
                  pageId={pageId} 
                  pageData={pageData} 
                  languageCode={languageCode}
                  formState={formState}
                />
              </SEOPanelErrorBoundary>
            </div>
          )}
          {activeTab === 'aeo' && (
            <div id="panel-aeo" role="tabpanel" aria-labelledby="tab-aeo">
              <SEOPanelErrorBoundary panelName="AEO" onReset={() => setActiveTab('meta')}>
                <AEOPanel 
                  pageId={pageId} 
                  pageData={pageData} 
                  languageCode={languageCode}
                  formState={formState}
                />
              </SEOPanelErrorBoundary>
            </div>
          )}
          {activeTab === 'geo' && (
            <div id="panel-geo" role="tabpanel" aria-labelledby="tab-geo">
              <SEOPanelErrorBoundary panelName="GEO" onReset={() => setActiveTab('meta')}>
                <GEOPanel 
                  pageId={pageId} 
                  pageData={pageData} 
                  languageCode={languageCode}
                  formState={formState}
                />
              </SEOPanelErrorBoundary>
            </div>
          )}
          {activeTab === 'history' && (
            <div id="panel-history" role="tabpanel" aria-labelledby="tab-history">
              <SEOPanelErrorBoundary panelName="History" onReset={() => setActiveTab('meta')}>
                <HistoryPanel pageId={pageId} pageData={pageData} languageCode={languageCode} formState={formState} />
              </SEOPanelErrorBoundary>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Compact Save Footer - Gap 1.1 & 7.1: Add Discard button */}
      <div className="border-t bg-muted/10 p-1.5 shrink-0">
        <div className="flex items-center gap-2">
          {/* Discard button - only show when dirty */}
          {formState.isDirty && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-destructive"
              onClick={formState.reset}
            >
              Discard
            </Button>
          )}
          <Button 
            className="flex-1 h-7 text-xs" 
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !formState.isDirty || !pageId}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Save className="h-3 w-3 mr-1" />
            )}
            {formState.isDirty ? 'Save' : 'Saved'}
          </Button>
          <div className="text-[9px] text-muted-foreground text-right shrink-0">
            <div className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-muted rounded border text-[8px]">⌘S</kbd>
              {lastSaved && (
                <span>{formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
