/**
 * EditorToolbar
 * 
 * Top toolbar for the React-native editor with device preview modes,
 * undo/redo, save, language switcher, and other actions.
 * 
 * Uses Zustand store directly for better performance.
 */

import React, { useCallback } from 'react';
import { 
  useEditorStore,
  useDeviceMode,
  useIsSaving,
  useHasUnsavedChanges,
  useAutosaveStatus,
  useLastSavedAt,
  useCanUndo,
  useCanRedo,
} from '@/stores/editorStore';
import { useSaveContext } from './EditorProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Monitor, 
  Tablet, 
  Smartphone,
  Undo2,
  Redo2,
  Save,
  Eye,
  X,
  Loader2,
  Check,
  Languages,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguages } from '@/hooks/queries/useLanguages';
import { useI18n } from '@/contexts/I18nContext';

// RTL language codes
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// ============================================================================
// Props
// ============================================================================

interface EditorToolbarProps {
  pageTitle: string;
  pageUrl: string;
  onClose: () => void;
  onPreview: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function EditorToolbar({
  pageTitle,
  pageUrl,
  onClose,
  onPreview,
}: EditorToolbarProps) {
  // Use Zustand selectors directly
  const deviceMode = useDeviceMode();
  const isSaving = useIsSaving();
  const hasUnsavedChanges = useHasUnsavedChanges();
  const autosaveStatus = useAutosaveStatus();
  const lastSavedAt = useLastSavedAt();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  
  // Get store actions directly
  const undo = useEditorStore(state => state.undo);
  const redo = useEditorStore(state => state.redo);
  const setDeviceMode = useEditorStore(state => state.setDeviceMode);
  
  // Get save function from context
  const { savePageData } = useSaveContext();
  
  // Language switching for translation preview
  const { data: languages = [] } = useLanguages();
  const { currentLanguage, changeLanguage } = useI18n();

  // Format relative time for autosave display
  const formatRelativeTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 5) return 'just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="h-14 border-b bg-card flex items-center justify-between px-4 shrink-0">
      {/* Left - Page Info & Close */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
          title="Close editor"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="border-l h-6 mx-1" />
        
        <div className="flex flex-col">
          <span className="font-medium text-sm">{pageTitle}</span>
          <span className="text-xs text-muted-foreground">{pageUrl}</span>
        </div>
      </div>

      {/* Center - Device Mode & Language */}
      <div className="flex items-center gap-3">
        {/* Device Mode Switcher */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={deviceMode === 'desktop' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setDeviceMode('desktop')}
            title="Desktop view"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={deviceMode === 'tablet' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setDeviceMode('tablet')}
            title="Tablet view"
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={deviceMode === 'mobile' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setDeviceMode('mobile')}
            title="Mobile view"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        {/* Language Switcher for Translation Preview */}
        {languages.length > 1 && (
          <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select
              value={currentLanguage?.code || 'en'}
              onValueChange={(code) => {
                changeLanguage(code);
              }}
            >
              <SelectTrigger className="h-7 w-[100px] border-0 bg-transparent text-xs">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="text-xs">
                    {lang.native_name || lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* RTL Indicator Badge */}
            {currentLanguage?.code && RTL_LANGUAGES.includes(currentLanguage.code) && (
              <Badge variant="outline" className="text-xs font-medium bg-primary/10 text-primary border-primary/20">
                RTL
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-l h-6 mx-1" />

        {/* Autosave Status */}
        <div className="min-w-[90px] text-right">
          {autosaveStatus === 'pending' && (
            <span className="text-xs text-muted-foreground">Unsaved</span>
          )}
          {autosaveStatus === 'saving' && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Autosaving...
            </span>
          )}
          {autosaveStatus === 'saved' && lastSavedAt && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              Saved {formatRelativeTime(lastSavedAt)}
            </span>
          )}
          {autosaveStatus === 'error' && (
            <span className="text-xs text-destructive flex items-center gap-1">
              Autosave failed
            </span>
          )}
        </div>

        {/* Preview */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
        >
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>

        {/* Save */}
        <Button
          variant={hasUnsavedChanges ? 'default' : 'secondary'}
          size="sm"
          onClick={savePageData}
          disabled={isSaving || !hasUnsavedChanges}
          className="min-w-[80px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Saving...
            </>
          ) : hasUnsavedChanges ? (
            <>
              <Save className="h-4 w-4 mr-1" />
              Save
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" />
              Saved
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default EditorToolbar;
