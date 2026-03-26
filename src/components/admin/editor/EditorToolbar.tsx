/**
 * EditorToolbar Component
 * 
 * Top toolbar for the Visual Page Editor containing:
 * - Close button and page info
 * - Device mode switcher (desktop/tablet/mobile)
 * - Language selector and translation controls
 * - View code, preview, and save actions
 * - Autosave status indicator
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Save,
  Undo2,
  Redo2,
  Eye,
  X,
  Smartphone,
  Monitor,
  Tablet,
  Languages,
  Loader2,
  Code2,
  Globe,
  Key,
  PieChart,
  Keyboard,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SaveStatusIndicator } from './SaveStatusIndicator';
import type { SaveStatus } from '@/hooks/queries';

export interface CoverageStats {
  totalElements: number;
  elementsWithKeys: number;
  keysCoverage: number;
  languageCoverage: Array<{
    code: string;
    name: string;
    percentage: number;
    translated: number;
    total: number;
  }>;
}

export interface LanguageOption {
  id: string;
  code: string;
  name: string;
  native_name?: string;
  direction?: string;
}

export interface EditorToolbarProps {
  /** Current page URL being edited */
  pageUrl: string;
  /** Whether the editor is loading */
  isLoading: boolean;
  /** Whether the editor is ready */
  isReady: boolean;
  /** Whether save is in progress */
  isSaving: boolean;
  /** Autosave status */
  saveStatus?: SaveStatus;
  /** Close the editor */
  onClose: () => void;
  /** Save the page */
  onSave: () => void;
  /** Undo last action */
  onUndo: () => void;
  /** Redo last undone action */
  onRedo: () => void;
  /** Open preview in new tab */
  onPreview: () => void;
  /** Open code viewer */
  onViewCode: () => void;
  
  // Device mode
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  onDeviceModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  
  // Language
  currentLanguage: string;
  languages: LanguageOption[];
  onLanguageChange: (langCode: string) => void;
  
  // Batch translation
  isBatchTranslating: boolean;
  batchProgress: { current: number; total: number };
  onBatchTranslate: () => void;
  
  // Coverage
  coverageStats: CoverageStats | null;
  onRefreshCoverage: () => void;
  
  // Bulk keys
  onBulkAssignKeys: () => void;
  
  // Keyboard shortcuts
  onShowShortcuts?: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = React.memo(({
  pageUrl,
  isLoading,
  isReady,
  isSaving,
  saveStatus = 'idle',
  onClose,
  onSave,
  onUndo,
  onRedo,
  onPreview,
  onViewCode,
  deviceMode,
  onDeviceModeChange,
  currentLanguage,
  languages,
  onLanguageChange,
  isBatchTranslating,
  batchProgress,
  onBatchTranslate,
  coverageStats,
  onRefreshCoverage,
  onBulkAssignKeys,
  onShowShortcuts,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
      {/* Left Section - Close and Page Info */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4 mr-1" />
          Close
        </Button>
        <span className="text-sm text-muted-foreground">|</span>
        <span className="text-sm font-medium">{pageUrl}</span>
        {isLoading && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading editor...
          </span>
        )}
      </div>
      
      {/* Right Section - Controls */}
      <div className="flex items-center gap-2">
        {/* Device Switcher */}
        <DeviceModeSwitcher 
          mode={deviceMode} 
          onChange={onDeviceModeChange} 
        />
        
        <span className="text-sm text-muted-foreground">|</span>
        
        {/* Language Selector */}
        <LanguageSelector
          value={currentLanguage}
          languages={languages}
          onChange={onLanguageChange}
        />
        
        {/* Batch Translate Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBatchTranslate}
          disabled={!isReady || isBatchTranslating}
          className="gap-1.5"
        >
          {isBatchTranslating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">
                {batchProgress.current}/{batchProgress.total}
              </span>
            </>
          ) : (
            <>
              <Languages className="h-4 w-4" />
              Batch Translate
            </>
          )}
        </Button>
        
        {/* Translation Coverage Indicator */}
        <CoveragePopover
          stats={coverageStats}
          isReady={isReady}
          onRefresh={onRefreshCoverage}
        />
        
        {/* Bulk Assign Keys Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBulkAssignKeys}
          disabled={!isReady}
        >
          <Key className="h-4 w-4 mr-1" />
          Bulk Keys
        </Button>
        
        <span className="text-sm text-muted-foreground">|</span>
        
        {/* Autosave Status Indicator */}
        <SaveStatusIndicator status={saveStatus} className="mr-1" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onViewCode} disabled={!isReady}>
                <Code2 className="h-4 w-4 mr-1" />
                View Code
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Code <kbd className="ml-1.5 px-1 py-0.5 bg-muted rounded text-[10px] font-mono">⌘/</kbd></p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onPreview} disabled={!isReady}>
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview <kbd className="ml-1.5 px-1 py-0.5 bg-muted rounded text-[10px] font-mono">⌘P</kbd></p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onSave} disabled={isSaving || !isReady}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save <kbd className="ml-1.5 px-1 py-0.5 bg-muted rounded text-[10px] font-mono">⌘S</kbd></p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Keyboard Shortcuts Button */}
        {onShowShortcuts && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onShowShortcuts} className="h-8 w-8">
                  <Keyboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Keyboard Shortcuts <kbd className="ml-1.5 px-1 py-0.5 bg-muted rounded text-[10px] font-mono">?</kbd></p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
});

EditorToolbar.displayName = 'EditorToolbar';

/**
 * Device Mode Switcher Sub-component
 */
interface DeviceModeSwitcherProps {
  mode: 'desktop' | 'tablet' | 'mobile';
  onChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

const DeviceModeSwitcher: React.FC<DeviceModeSwitcherProps> = ({ mode, onChange }) => (
  <div className="flex items-center border rounded-md">
    <Button
      variant={mode === 'desktop' ? 'secondary' : 'ghost'}
      size="sm"
      onClick={() => onChange('desktop')}
    >
      <Monitor className="h-4 w-4" />
    </Button>
    <Button
      variant={mode === 'tablet' ? 'secondary' : 'ghost'}
      size="sm"
      onClick={() => onChange('tablet')}
    >
      <Tablet className="h-4 w-4" />
    </Button>
    <Button
      variant={mode === 'mobile' ? 'secondary' : 'ghost'}
      size="sm"
      onClick={() => onChange('mobile')}
    >
      <Smartphone className="h-4 w-4" />
    </Button>
  </div>
);

/**
 * Language Selector Sub-component
 */
interface LanguageSelectorProps {
  value: string;
  languages: LanguageOption[];
  onChange: (langCode: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, languages, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-44 h-8">
      <Globe className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
      <SelectValue placeholder="Select language" />
    </SelectTrigger>
    <SelectContent className="bg-popover border shadow-lg z-[100]">
      {languages.map((lang) => (
        <SelectItem key={lang.id} value={lang.code}>
          <div className="flex items-center gap-2">
            <span>{lang.native_name || lang.name}</span>
            <Badge variant="outline" className="text-[10px] h-4 px-1">
              {lang.code.toUpperCase()}
            </Badge>
            {lang.direction === 'rtl' && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1">RTL</Badge>
            )}
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/**
 * Coverage Popover Sub-component
 */
interface CoveragePopoverProps {
  stats: CoverageStats | null;
  isReady: boolean;
  onRefresh: () => void;
}

const CoveragePopover: React.FC<CoveragePopoverProps> = ({ stats, isReady, onRefresh }) => {
  const coverage = stats?.keysCoverage ?? 0;
  const coverageColor = coverage >= 80 ? 'text-green-600' : coverage >= 50 ? 'text-yellow-600' : 'text-red-500';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1.5"
          disabled={!isReady || !stats}
        >
          <PieChart className="h-4 w-4" />
          <span className={`font-semibold ${coverageColor}`}>
            {coverage}%
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          {/* Key Coverage */}
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              Translation Key Coverage
            </h4>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Elements with keys</span>
              <span className="font-medium">
                {stats?.elementsWithKeys ?? 0} / {stats?.totalElements ?? 0}
              </span>
            </div>
            <Progress value={coverage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {coverage >= 100 
                ? '✓ All translatable elements have keys' 
                : `${(stats?.totalElements ?? 0) - (stats?.elementsWithKeys ?? 0)} elements need keys`
              }
            </p>
          </div>
          
          {/* Language Coverage */}
          <div className="border-t pt-3">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Language Coverage
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {stats?.languageCoverage.map(lang => {
                const langColor = lang.percentage >= 100 ? 'text-green-600' : 
                  lang.percentage >= 50 ? 'text-yellow-600' : 'text-muted-foreground';
                
                return (
                  <div key={lang.code} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] h-4 px-1 font-mono">
                          {lang.code.toUpperCase()}
                        </Badge>
                        <span className="truncate max-w-[120px]">{lang.name}</span>
                      </span>
                      <span className={`font-medium text-xs ${langColor}`}>
                        {lang.translated}/{lang.total} ({lang.percentage}%)
                      </span>
                    </div>
                    <Progress value={lang.percentage} className="h-1.5" />
                  </div>
                );
              })}
            </div>
            {(!stats?.languageCoverage.length) && (
              <p className="text-xs text-muted-foreground">No languages configured</p>
            )}
          </div>
          
          {/* Refresh Button */}
          <div className="border-t pt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={onRefresh}
            >
              Refresh Coverage
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EditorToolbar;
