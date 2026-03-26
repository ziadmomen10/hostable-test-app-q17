/**
 * SEODashboard
 * 
 * Main dashboard with horizontal three-panel layout.
 * Enhanced with keyboard shortcuts, quick actions bar, animations,
 * preview refresh on save, and proper AI tools integration.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { SEOPagePreview } from './SEOPagePreview';
import { SERPPreview } from './SERPPreview';
import { SocialPreview } from './SocialPreview';
import { AISearchPreview } from './AISearchPreview';
import { PreviewModeSelector, type PreviewMode } from './PreviewModeSelector';
import { SEOLeftPanel } from './SEOLeftPanel';
import { SEORightPanel } from './SEORightPanel';
import { AIResultModal } from './AIResultModal';
import { useSEOAITools, type MetaSuggestion } from './hooks/useSEOAITools';

import { PanelLeft, PanelRight } from 'lucide-react';
import { useSEOFormState } from './hooks/useSEOFormState';
import type { PageData } from '@/hooks/queries/usePageData';

interface SEODashboardProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  pages: PageData[];
  onPageSelect: (pageId: string) => void;
  onLanguageChange: (lang: string) => void;
  seoScore: number;
  aeoScore: number;
  geoScore: number;
  scoresLoading?: boolean;
}

export function SEODashboard({ 
  pageId, 
  pageData, 
  languageCode,
  pages,
  onPageSelect,
  onLanguageChange,
  seoScore,
  aeoScore,
  geoScore,
  scoresLoading,
}: SEODashboardProps) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('page');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiMetaSuggestion, setAiMetaSuggestion] = useState<MetaSuggestion | null>(null);
  const [rightPanelActiveTab, setRightPanelActiveTab] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0); // For forcing preview refresh
  
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const queryClient = useQueryClient();

  // Unified form state management - only create when we have a valid pageId
  const formState = useSEOFormState({
    pageId: pageId || '__placeholder__',
    languageCode,
    pageTitle: pageData?.page_title || '',
    pageDescription: pageData?.page_description || '',
    pageOgImage: pageData?.og_image_url || '',
  });

  // AI Tools Hook
  const aiTools = useSEOAITools({
    pageId,
    languageCode,
    content: pageData.content || '',
    pageTitle: pageData.page_title,
    pageUrl: pageData.page_url,
    focusKeyword: formState.formData.focusKeyword,
  });

  const handleLeftCollapse = useCallback(() => {
    leftPanelRef.current?.collapse();
  }, []);

  const handleLeftExpand = useCallback(() => {
    leftPanelRef.current?.expand();
  }, []);

  const handleRightCollapse = useCallback(() => {
    rightPanelRef.current?.collapse();
  }, []);

  const handleRightExpand = useCallback(() => {
    rightPanelRef.current?.expand();
  }, []);

  const cyclePreviewMode = useCallback(() => {
    const modes: PreviewMode[] = ['page', 'serp', 'social', 'ai'];
    const currentIndex = modes.indexOf(previewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setPreviewMode(modes[nextIndex]);
  }, [previewMode]);

  // Implement toolbar handlers
  const handleAnalyze = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['seo-analysis', pageId, languageCode] });
    queryClient.invalidateQueries({ queryKey: ['page-seo', pageId, languageCode] });
    toast.success('Re-analyzing page SEO...');
  }, [queryClient, pageId, languageCode]);

  const handleGenerateAll = useCallback(async () => {
    const result = await aiTools.generateMeta();
    if (result) {
      setAiMetaSuggestion(result);
      setAiModalOpen(true);
    }
  }, [aiTools]);

  const handleApplyAiMeta = useCallback((suggestion: MetaSuggestion) => {
    formState.updateFields({
      metaTitle: suggestion.title,
      metaDescription: suggestion.description,
    });
    setAiModalOpen(false);
    toast.success('AI suggestions applied - remember to save!');
  }, [formState]);

  const handleOverlayNavigate = useCallback((target: { tab: string; section?: string }) => {
    if (rightCollapsed) {
      handleRightExpand();
    }
    setRightPanelActiveTab(target.tab);
  }, [rightCollapsed, handleRightExpand]);

  // Handle save complete - refresh preview
  const handleSaveComplete = useCallback(() => {
    // Force preview refresh by changing key
    setPreviewKey(prev => prev + 1);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      
      if (isMod) {
        switch (e.key) {
          case 'p':
            e.preventDefault();
            cyclePreviewMode();
            break;
          case '[':
            e.preventDefault();
            if (leftCollapsed) {
              handleLeftExpand();
            } else {
              handleLeftCollapse();
            }
            break;
          case ']':
            e.preventDefault();
            if (rightCollapsed) {
              handleRightExpand();
            } else {
              handleRightCollapse();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cyclePreviewMode, leftCollapsed, rightCollapsed, handleLeftExpand, handleLeftCollapse, handleRightExpand, handleRightCollapse]);

  // Get preview data from form state
  const previewTitle = formState.formData.metaTitle || pageData.page_title;
  const previewDescription = formState.formData.metaDescription || pageData.page_description || '';
  const previewOgTitle = formState.formData.ogTitle || previewTitle;
  const previewOgDescription = formState.formData.ogDescription || previewDescription;
  const previewOgImage = formState.formData.ogImageUrl || pageData.og_image_url || '';

  // Render center panel content based on preview mode
  const renderPreview = () => {
    switch (previewMode) {
      case 'serp':
        return (
          <SERPPreview
            title={previewTitle}
            description={previewDescription}
            url={pageData.page_url}
          />
        );
      case 'social':
        return (
          <SocialPreview
            title={previewOgTitle}
            description={previewOgDescription}
            imageUrl={previewOgImage}
            url={pageData.page_url}
          />
        );
      case 'ai':
        return (
          <AISearchPreview
            title={previewTitle}
            description={previewDescription}
            content={pageData.content || ''}
            url={pageData.page_url}
            geoScore={geoScore}
          />
        );
      default:
        return (
          <SEOPagePreview 
            key={`preview-${previewKey}-${languageCode}`}
            pageUrl={pageData.page_url} 
            pageTitle={pageData.page_title}
            pageId={pageId}
            pageData={pageData}
            languageCode={languageCode}
            focusKeyword={formState.formData.focusKeyword}
            previewKey={previewKey}
            onAnalyze={handleAnalyze}
            onGenerateAll={handleGenerateAll}
            onNavigate={handleOverlayNavigate}
            isAnalyzing={false}
            isGenerating={aiTools.isLoading.generate_meta}
            isDirty={formState.isDirty}
          />
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Navigation & Scores */}
        <ResizablePanel
          ref={leftPanelRef}
          defaultSize={18}
          minSize={15}
          maxSize={25}
          collapsible
          collapsedSize={0}
          onCollapse={() => setLeftCollapsed(true)}
          onExpand={() => setLeftCollapsed(false)}
        >
          <SEOLeftPanel
            pages={pages}
            selectedPageId={pageId}
            selectedLanguage={languageCode}
            selectedPageData={pageData}
            onPageSelect={onPageSelect}
            onLanguageChange={onLanguageChange}
            seoScore={seoScore}
            aeoScore={aeoScore}
            geoScore={geoScore}
            isLoading={scoresLoading}
            onCollapse={handleLeftCollapse}
            onAnalyze={handleAnalyze}
            onGenerateAll={handleGenerateAll}
            isAnalyzing={false}
            isGenerating={aiTools.isLoading.generate_meta}
            isDirty={formState.isDirty} // Gap 1.1: Pass isDirty for ExportPopover
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Center Panel - Page Preview with Mode Selector */}
        <ResizablePanel defaultSize={54} minSize={30} className="relative overflow-hidden">
          {/* Floating expand buttons when panels are collapsed */}
          {leftCollapsed && (
            <Button
              variant="outline"
              size="sm"
              className="absolute left-2 top-2 z-50 h-7 text-xs shadow-md bg-background"
              onClick={handleLeftExpand}
            >
              <PanelLeft className="h-3 w-3 mr-1" />
              Nav
            </Button>
          )}
          
          {rightCollapsed && (
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-2 z-50 h-7 text-xs shadow-md bg-background"
              onClick={handleRightExpand}
            >
              Tools
              <PanelRight className="h-3 w-3 ml-1" />
            </Button>
          )}

          {/* Preview Mode Selector - Centered at top */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 z-40">
            <PreviewModeSelector 
              mode={previewMode} 
              onChange={setPreviewMode} 
            />
          </div>

          {/* Preview Content - absolute positioned for seamless fill */}
          <div className="absolute inset-0">
            {renderPreview()}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - SEO Tools */}
        <ResizablePanel
          ref={rightPanelRef}
          defaultSize={28}
          minSize={20}
          maxSize={40}
          collapsible
          collapsedSize={0}
          onCollapse={() => setRightCollapsed(true)}
          onExpand={() => setRightCollapsed(false)}
        >
          <SEORightPanel
            pageId={pageId}
            pageData={pageData}
            languageCode={languageCode}
            onCollapse={handleRightCollapse}
            formState={formState}
            externalActiveTab={rightPanelActiveTab}
            onExternalTabHandled={() => setRightPanelActiveTab(null)}
            onSaveComplete={handleSaveComplete}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Optional Status Bar with keyboard hints (Gap 4.1 - show correct tab range) */}
      <div className="h-5 px-3 border-t bg-muted/20 flex items-center justify-between text-[9px] text-muted-foreground shrink-0">
        <div className="flex items-center gap-3">
          <span>⌘S Save</span>
          <span>⌘1-7 Tabs</span>
          <span>⌘P Preview</span>
          <span>⌘[ Nav</span>
          <span>⌘] Tools</span>
        </div>
        {pageId && (
          <div className="flex items-center gap-2">
            <span className="truncate max-w-[200px]">{pageData.page_title}</span>
            <span>•</span>
            <span>{languageCode.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* AI Meta Suggestion Modal */}
      <AIResultModal
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
        type="meta"
        result={aiMetaSuggestion}
        onApply={() => aiMetaSuggestion && handleApplyAiMeta(aiMetaSuggestion)}
      />
    </div>
  );
}
