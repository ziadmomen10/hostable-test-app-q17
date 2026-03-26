/**
 * SettingsPanel
 * 
 * Right panel that displays settings for the currently selected section, column, or element.
 * Dynamically renders the appropriate settings component based on selection type.
 * - Section selected: Shows section settings + grid settings
 * - Column selected: Shows column settings
 * - Element selected: Shows element settings
 * Includes translation coverage indicators and key binding support.
 * 
 * Uses Zustand store directly for better performance.
 */

import React, { useCallback, useMemo } from 'react';
import { 
  useEditorStore, 
  useSelection,
  usePageData,
  useSelectedSectionId,
  useIsSaving,
  useHasUnsavedChanges,
  useCanUndo,
  useCanRedo,
  useSelectedSectionWithVersion,
  useSelectedColumn,
  useSelectedColumnIndex,
} from '@/stores/editorStore';
import { useSaveContext } from './EditorProvider';
import { getSectionDefinition } from '@/lib/sectionDefinitions.tsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, X, Undo2, Redo2, Save, Loader2, Languages, Globe, Grid3X3, Columns, ChevronLeft, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditorTranslations } from '@/hooks/useEditorTranslations';
import { TranslationStatusIndicator } from './TranslationKeyPicker';
import ElementSettings from './ElementSettings';
import { GridSettingsPanel } from './grid/GridSettingsPanel';
import { ColumnSettingsPanel } from './grid/ColumnSettingsPanel';
import { SectionStyleSettings } from './settings/SectionStyleSettings';

// ============================================================================
// SettingsPanel Component
// ============================================================================

export function SettingsPanel() {
  // Use Zustand store directly
  const pageData = usePageData();
  const selectedSectionId = useSelectedSectionId();
  const isSaving = useIsSaving();
  const hasUnsavedChanges = useHasUnsavedChanges();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  
  // CRITICAL: Atomic read of section AND version together
  // Prevents race conditions between separate selectors
  const { section: selectedSection, version: sectionVersion } = useSelectedSectionWithVersion();
  
  const selectedColumn = useSelectedColumn();
  const selectedColumnIndex = useSelectedColumnIndex();
  
  // Get store actions directly
  const updateSectionProps = useEditorStore(state => state.updateSectionProps);
  const updateSectionStyle = useEditorStore(state => state.updateSectionStyle);
  const selectSection = useEditorStore(state => state.selectSection);
  const undo = useEditorStore(state => state.undo);
  const redo = useEditorStore(state => state.redo);
  const clearSelection = useEditorStore(state => state.clearSelection);
  
  // Get save function from context
  const { savePageData } = useSaveContext();
  
  // Zustand selection for element-level
  const selection = useSelection();
  
  // Translation coverage
  const { getPageCoverageStats, getSectionCoverageStats } = useEditorTranslations();

  // Get section definition
  const definition = useMemo(() => {
    if (!selectedSection) return null;
    return getSectionDefinition(selectedSection.type);
  }, [selectedSection]);

  // Get section grid
  const sectionGrid = useMemo(() => {
    return selectedSection?.grid;
  }, [selectedSection]);

  // Get section translation coverage
  const sectionCoverage = useMemo(() => {
    if (!selectedSection) return null;
    return getSectionCoverageStats(selectedSection);
  }, [selectedSection, getSectionCoverageStats]);

  // Get page translation coverage  
  const pageCoverage = useMemo(() => {
    return getPageCoverageStats();
  }, [getPageCoverageStats]);

  // Handle props change from settings component
  const handlePropsChange = useCallback((newProps: Record<string, any>) => {
    console.log('[SettingsPanel] handlePropsChange:', { 
      selectedSectionId: selectedSectionId?.slice(-8), 
      propsKeys: Object.keys(newProps),
      sampleEntry: Object.entries(newProps)[0],
    });
    
    if (selectedSectionId) {
      updateSectionProps(selectedSectionId, newProps);
    } else {
      console.error('[SettingsPanel] handlePropsChange: No selectedSectionId!');
    }
  }, [selectedSectionId, updateSectionProps]);

  // Handle layout change from style settings (saves to section.props)
  const handleLayoutChange = useCallback((layoutUpdates: Record<string, any>) => {
    if (selectedSectionId) {
      updateSectionProps(selectedSectionId, layoutUpdates);
    }
  }, [selectedSectionId, updateSectionProps]);
  const handleStyleChange = useCallback((newStyle: import('@/types/elementSettings').SectionStyleProps) => {
    if (selectedSectionId) {
      updateSectionStyle(selectedSectionId, newStyle);
    }
  }, [selectedSectionId, updateSectionStyle]);

  // Close panel
  const handleClose = useCallback(() => {
    clearSelection();
    selectSection(null);
  }, [selectSection, clearSelection]);
  
  // Go back to section from column
  const handleBackToSection = useCallback(() => {
    if (selectedSectionId) {
      selectSection(selectedSectionId);
    }
  }, [selectedSectionId, selectSection]);

  // Determine what to show in the panel
  const showElementSettings = selection.type === 'element' && selection.elementPath;
  const showColumnSettings = selection.type === 'column' && selectedColumn;
  const showSectionSettings = !showElementSettings && !showColumnSettings && selectedSection && definition;

  return (
    <div className="w-full h-full bg-card flex flex-col min-w-0">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between shrink-0">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </h3>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={hasUnsavedChanges ? 'default' : 'ghost'}
            size="sm"
            className="h-7 px-2"
            onClick={savePageData}
            disabled={isSaving || !hasUnsavedChanges}
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span className="ml-1 text-xs">Save</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Element Settings (when element is selected) */}
        {showElementSettings && (
          <ElementSettings />
        )}
        
        {/* Column Settings (when column is selected) */}
        {showColumnSettings && selectedSectionId && sectionGrid && (
          <div>
            {/* Back to Section Button */}
            <div className="p-3 border-b bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 -ml-2"
                onClick={handleBackToSection}
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Back to Section
              </Button>
            </div>
            
            <div className="p-3">
              <ColumnSettingsPanel
                sectionId={selectedSectionId}
                column={selectedColumn}
                columnIndex={selectedColumnIndex}
                totalColumns={sectionGrid.columns.length}
              />
            </div>
          </div>
        )}
        
        {/* Section Settings (when section is selected but no column/element) */}
        {showSectionSettings && (
          <div>
            {/* Section Type Header */}
            <div className="p-3 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {definition.icon && (
                    <definition.icon className="h-4 w-4 text-primary" />
                  )}
                  <span className="font-medium text-sm">{definition.displayName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleClose}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              {/* Translation coverage for section */}
              {sectionCoverage && sectionCoverage.totalTranslatableProps > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <TranslationStatusIndicator sectionId={selectedSectionId!} />
                  <span className="text-[10px] text-muted-foreground">
                    {sectionCoverage.propsWithKeys} of {sectionCoverage.totalTranslatableProps} props linked
                  </span>
                </div>
              )}
            </div>

            {/* Tabbed Settings - Grid + Content + Style */}
            {sectionGrid ? (
              <Tabs defaultValue="grid" className="w-full">
                <TabsList className="grid grid-cols-3 h-9 mx-2 mt-2 w-[calc(100%-1rem)]">
                  <TabsTrigger value="grid" className="text-xs">
                    <Grid3X3 className="h-3 w-3 mr-1" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="content" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="style" className="text-xs">
                    <Palette className="h-3 w-3 mr-1" />
                    Style
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="grid" className="p-3 pt-0 mt-0">
                  <GridSettingsPanel
                    sectionId={selectedSectionId!}
                    grid={sectionGrid}
                  />
                </TabsContent>
                
                <TabsContent value="content" className="p-0 mt-0">
                  {/* Key based on section ID only - version removed to prevent remounting on each edit */}
                  {/* DebouncedInput handles local state sync; remounting on version causes focus loss */}
                  <definition.settingsComponent
                    key={`settings-${selectedSectionId}`}
                    data={selectedSection.props}
                    onChange={handlePropsChange}
                    sectionId={selectedSectionId!}
                  />
                </TabsContent>
                
                <TabsContent value="style" className="p-0 mt-0">
                  <SectionStyleSettings
                    sectionId={selectedSectionId!}
                    style={selectedSection.style}
                    layoutProps={{
                      columns: selectedSection.props?.columns,
                      gap: selectedSection.props?.gap,
                      contentAlignment: selectedSection.props?.contentAlignment,
                    }}
                    onChange={handleStyleChange}
                    onLayoutChange={handleLayoutChange}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid grid-cols-2 h-9 mx-2 mt-2 w-[calc(100%-1rem)]">
                  <TabsTrigger value="content" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="style" className="text-xs">
                    <Palette className="h-3 w-3 mr-1" />
                    Style
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="p-0 mt-0">
                  {/* Key based on section ID only - version removed to prevent remounting on each edit */}
                  <definition.settingsComponent
                    key={`settings-${selectedSectionId}`}
                    data={selectedSection.props}
                    onChange={handlePropsChange}
                    sectionId={selectedSectionId!}
                  />
                </TabsContent>
                
                <TabsContent value="style" className="p-0 mt-0">
                  <SectionStyleSettings
                    sectionId={selectedSectionId!}
                    style={selectedSection.style}
                    layoutProps={{
                      columns: selectedSection.props?.columns,
                      gap: selectedSection.props?.gap,
                      contentAlignment: selectedSection.props?.contentAlignment,
                    }}
                    onChange={handleStyleChange}
                    onLayoutChange={handleLayoutChange}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
        
        {/* Empty state */}
        {!showElementSettings && !showColumnSettings && !showSectionSettings && (
          <div className="p-6 text-center text-muted-foreground">
            <Settings className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No section selected</p>
            <p className="text-xs mt-1">
              Click on a section in the canvas to edit its settings
            </p>
          </div>
        )}
      </div>

      {/* Footer - Status */}
      <div className="p-2 border-t text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>
            {pageData ? `${pageData.sections.length} section${pageData.sections.length !== 1 ? 's' : ''}` : 'No page loaded'}
          </span>
          {hasUnsavedChanges && (
            <span className="text-amber-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Unsaved
            </span>
          )}
        </div>
        
        {/* Page translation coverage */}
        {pageCoverage.totalTranslatableProps > 0 && (
          <div className="mt-1.5 flex items-center gap-2">
            <Globe className="h-3 w-3 text-muted-foreground" />
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  'h-full transition-all',
                  pageCoverage.coveragePercentage === 100 ? 'bg-green-500' : 
                  pageCoverage.coveragePercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                )}
                style={{ width: `${pageCoverage.coveragePercentage}%` }}
              />
            </div>
            <span className="text-[10px]">{pageCoverage.coveragePercentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPanel;
