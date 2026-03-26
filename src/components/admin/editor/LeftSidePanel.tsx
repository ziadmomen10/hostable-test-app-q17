/**
 * LeftSidePanel Component
 * 
 * Left sidebar for the Visual Page Editor containing:
 * - Sections tab: List of page sections with visibility/delete controls
 * - Blocks tab: Block library and sections from other pages
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Layers,
  LayoutList,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  FileStack,
  Loader2,
} from 'lucide-react';


export interface SectionInfo {
  id: string;
  name: string;
  component: any;
  visible: boolean;
}

export interface ExtractedSection {
  pageId: string;
  pageTitle: string;
  sectionId: string;
  sectionName: string;
  content: string;
}

export interface LeftSidePanelProps {
  /** Currently active tab */
  activeTab: 'blocks' | 'sections';
  /** Tab change handler */
  onTabChange: (tab: 'blocks' | 'sections') => void;
  /** List of page sections */
  sections: SectionInfo[];
  /** Handler for section selection */
  onSectionSelect: (section: SectionInfo) => void;
  /** Handler for section visibility toggle */
  onSectionToggleVisibility: (section: SectionInfo) => void;
  /** Handler for section deletion */
  onSectionDelete: (section: SectionInfo) => void;
  /** Sections extracted from other pages */
  extractedSections: ExtractedSection[];
  /** Whether other pages are loading */
  loadingOtherPages: boolean;
  /** Handler for adding a section from another page */
  onAddExtractedSection: (section: ExtractedSection) => void;
}

export const LeftSidePanel: React.FC<LeftSidePanelProps> = React.memo(({
  activeTab,
  onTabChange,
  sections,
  onSectionSelect,
  onSectionToggleVisibility,
  onSectionDelete,
  extractedSections,
  loadingOtherPages,
  onAddExtractedSection,
}) => {
  return (
    <div className="w-72 h-full border-r bg-card flex flex-col min-h-0 overflow-hidden">
      {/* Tab Switcher */}
      <TabSwitcher activeTab={activeTab} onTabChange={onTabChange} />

      {/* Sections Panel */}
      <div className={`flex-1 min-h-0 overflow-auto ${activeTab === 'sections' ? '' : 'hidden'}`}>
        <SectionsPanel
          sections={sections}
          onSelect={onSectionSelect}
          onToggleVisibility={onSectionToggleVisibility}
          onDelete={onSectionDelete}
        />
      </div>

      {/* Blocks Panel */}
      <div className={`flex-1 min-h-0 overflow-auto ${activeTab === 'blocks' ? '' : 'hidden'}`}>
        {/* Block library container */}
        <div id="blocks-container" className="p-2" />
        
        {/* Sections From Other Pages */}
        <OtherPageSections
          sections={extractedSections}
          loading={loadingOtherPages}
          onAddSection={onAddExtractedSection}
        />
      </div>
    </div>
  );
});

LeftSidePanel.displayName = 'LeftSidePanel';

/**
 * Tab Switcher Sub-component
 */
interface TabSwitcherProps {
  activeTab: 'blocks' | 'sections';
  onTabChange: (tab: 'blocks' | 'sections') => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => (
  <div className="flex border-b">
    <button
      className={`flex-1 p-2 text-xs font-medium flex items-center justify-center gap-1 ${
        activeTab === 'sections' 
          ? 'bg-muted text-foreground border-b-2 border-primary' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
      onClick={() => onTabChange('sections')}
    >
      <LayoutList className="h-3 w-3" />
      Sections
    </button>
    <button
      className={`flex-1 p-2 text-xs font-medium flex items-center justify-center gap-1 ${
        activeTab === 'blocks' 
          ? 'bg-muted text-foreground border-b-2 border-primary' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
      onClick={() => onTabChange('blocks')}
    >
      <Layers className="h-3 w-3" />
      Blocks
    </button>
  </div>
);

/**
 * Sections Panel Sub-component
 */
interface SectionsPanelProps {
  sections: SectionInfo[];
  onSelect: (section: SectionInfo) => void;
  onToggleVisibility: (section: SectionInfo) => void;
  onDelete: (section: SectionInfo) => void;
}

const SectionsPanel: React.FC<SectionsPanelProps> = ({
  sections,
  onSelect,
  onToggleVisibility,
  onDelete,
}) => (
  <div className="p-2 space-y-1">
    {sections.length === 0 ? (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No sections detected. Add content with sections to manage them here.
      </div>
    ) : (
      sections.map((section, index) => (
        <SectionItem
          key={section.id}
          section={section}
          index={index}
          onSelect={onSelect}
          onToggleVisibility={onToggleVisibility}
          onDelete={onDelete}
        />
      ))
    )}
  </div>
);

/**
 * Section Item Sub-component
 */
interface SectionItemProps {
  section: SectionInfo;
  index: number;
  onSelect: (section: SectionInfo) => void;
  onToggleVisibility: (section: SectionInfo) => void;
  onDelete: (section: SectionInfo) => void;
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  index,
  onSelect,
  onToggleVisibility,
  onDelete,
}) => (
  <div
    className={`group flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
      section.visible ? 'bg-muted/50 hover:bg-muted' : 'bg-muted/20 opacity-60'
    }`}
    onClick={() => onSelect(section)}
  >
    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
    <span className="flex-1 text-sm truncate" title={section.name}>
      {index + 1}. {section.name}
    </span>
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility(section);
        }}
        title={section.visible ? 'Hide section' : 'Show section'}
      >
        {section.visible ? (
          <Eye className="h-3 w-3" />
        ) : (
          <EyeOff className="h-3 w-3" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-destructive hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(section);
        }}
        title="Delete section"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  </div>
);

/**
 * Other Page Sections Sub-component
 */
interface OtherPageSectionsProps {
  sections: ExtractedSection[];
  loading: boolean;
  onAddSection: (section: ExtractedSection) => void;
}

const OtherPageSections: React.FC<OtherPageSectionsProps> = ({
  sections,
  loading,
  onAddSection,
}) => (
  <div className="p-3 border-t mt-2 bg-muted/20">
    <h4 className="text-sm font-bold text-foreground uppercase tracking-wide px-1 py-2 mb-3 flex items-center gap-2 border-b border-border pb-2">
      <div className="w-1 h-4 bg-primary rounded-full" />
      <FileStack className="h-4 w-4 text-primary" />
      Other Page Sections
    </h4>
    <div className="space-y-2">
      {loading ? (
        <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading sections...
        </div>
      ) : sections.length === 0 ? (
        <div className="p-4 text-center text-xs text-muted-foreground bg-background rounded-lg border border-dashed">
          No sections found. Add <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">data-section</code> attribute to reuse sections.
        </div>
      ) : (
        sections.map((section) => (
          <ExtractedSectionItem
            key={`${section.pageId}-${section.sectionId}`}
            section={section}
            onAdd={onAddSection}
          />
        ))
      )}
    </div>
  </div>
);

/**
 * Extracted Section Item Sub-component
 */
interface ExtractedSectionItemProps {
  section: ExtractedSection;
  onAdd: (section: ExtractedSection) => void;
}

const ExtractedSectionItem: React.FC<ExtractedSectionItemProps> = ({ section, onAdd }) => (
  <div
    className="p-3 rounded-lg border bg-background hover:bg-primary/5 hover:border-primary cursor-grab transition-all duration-200 shadow-sm hover:shadow-md group"
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('text/html', section.content);
      e.dataTransfer.effectAllowed = 'copy';
    }}
    onClick={() => onAdd(section)}
  >
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
        <LayoutList className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-sm text-foreground block truncate">
          {section.sectionName}
        </span>
        <span className="text-xs text-muted-foreground">
          Seen in {section.pageTitle}
        </span>
      </div>
    </div>
  </div>
);

export default LeftSidePanel;
