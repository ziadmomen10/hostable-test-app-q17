/**
 * TranslationKeyPicker Component
 * 
 * A popover-based picker for binding section props to translation keys.
 * Uses the new TranslationEngine for enterprise-grade key management.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Globe, 
  Link, 
  Unlink, 
  Search, 
  Plus, 
  Check, 
  AlertCircle,
  Languages,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOptionalTranslationEngine } from '@/contexts/TranslationEngineContext';
import { useEditorStore, usePageData } from '@/stores/editorStore';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

interface TranslationKeyPickerProps {
  sectionId: string;
  propPath: string;
  propLabel: string;
  currentValue?: string;
  sectionType?: string;
  sectionIndex?: number;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function TranslationKeyPicker({
  sectionId,
  propPath,
  propLabel,
  currentValue,
  sectionType,
  sectionIndex = 0,
  className,
}: TranslationKeyPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newKeyInput, setNewKeyInput] = useState('');
  const [showCreateNew, setShowCreateNew] = useState(false);

  const engine = useOptionalTranslationEngine();
  const pageData = usePageData();
  const { setTranslationKey, removeTranslationKey } = useEditorStore();

  // Get current binding from section's translationKeys
  const section = pageData?.sections.find(s => s.id === sectionId);
  const currentKey = section?.translationKeys?.[propPath];
  const isBound = !!currentKey;

  // Get translated value for current key
  const currentTranslatedValue = currentKey ? engine?.getTranslation(currentKey) : null;

  // Generate suggested key using stable section ID
  const suggestedKey = useMemo(() => {
    if (!engine || !sectionType) return `section.${propPath}`;
    return engine.generateKeyForProp(sectionType, sectionId, propPath);
  }, [engine, sectionType, sectionId, propPath]);

  // Get available translation keys (filter by search)
  const availableKeys = useMemo(() => {
    if (!engine?.translationKeys) return [];
    
    return engine.translationKeys
      .filter(k => {
        if (!searchQuery) return true;
        return k.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
               k.sourceText.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .slice(0, 50);
  }, [engine?.translationKeys, searchQuery]);

  // Handle binding a key
  const handleBindKey = useCallback(async (key: string) => {
    if (!engine || !section) return;

    try {
      // Register the key in the database
      await engine.registerKey({
        key,
        sourceText: currentValue || '',
        pageId: pageData?.id || '',
        sectionId,
        sectionType: sectionType || section.type,
        propPath,
      });

      // Update the section's translationKeys in the editor state
      setTranslationKey(sectionId, propPath, key);

      toast.success(`Bound to ${key}`);
      setOpen(false);
      setSearchQuery('');
      setShowCreateNew(false);
    } catch (error) {
      toast.error('Failed to bind translation key');
      console.error('Bind key error:', error);
    }
  }, [engine, section, sectionId, sectionType, propPath, currentValue, pageData, setTranslationKey]);

  // Handle unbinding
  const handleUnbind = useCallback(async () => {
    if (!section) return;

    removeTranslationKey(sectionId, propPath);

    toast.success('Unbound translation key');
    setOpen(false);
  }, [section, sectionId, propPath, removeTranslationKey]);

  // Handle creating new key
  const handleCreateNew = useCallback(() => {
    const keyToUse = newKeyInput.trim() || suggestedKey;
    if (keyToUse) {
      handleBindKey(keyToUse);
      setNewKeyInput('');
    }
  }, [newKeyInput, suggestedKey, handleBindKey]);

  // Handle AI translate
  const handleAITranslate = useCallback(async () => {
    if (!engine || !currentKey || !currentValue) return;

    try {
      const targetLanguages = engine.languages
        .filter(l => !l.is_default)
        .map(l => ({ code: l.code, name: l.name }));

      toast.info('Translating with AI...');
      await engine.translateKeys([currentKey], targetLanguages.map(l => l.code));
      toast.success('AI translation complete');
    } catch (error) {
      toast.error('AI translation failed');
    }
  }, [engine, currentKey, currentValue]);

  // If no translation engine, show a disabled state
  if (!engine) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-6 w-6 shrink-0 text-muted-foreground cursor-not-allowed', className)}
        disabled
        title="Translation engine not available"
      >
        <Globe className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-6 w-6 shrink-0',
            isBound ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            className
          )}
          title={isBound ? `Bound to: ${currentKey}` : 'Bind to translation key'}
        >
          {isBound ? (
            <Link className="h-3.5 w-3.5" />
          ) : (
            <Globe className="h-3.5 w-3.5" />
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">{propLabel}</span>
            </div>
            {isBound && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                onClick={handleUnbind}
              >
                <Unlink className="h-3 w-3 mr-1" />
                Unbind
              </Button>
            )}
          </div>
          
          {/* Current binding status */}
          {isBound && (
            <div className="mt-2 p-2 rounded-md bg-muted/50 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Link className="h-3 w-3 text-primary" />
                  <span className="font-mono text-primary truncate max-w-[180px]">{currentKey}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1.5 text-[10px]"
                  onClick={handleAITranslate}
                  disabled={engine.isTranslating}
                >
                  <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                  AI
                </Button>
              </div>
              {currentTranslatedValue ? (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="truncate">"{currentTranslatedValue}"</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>No translation found</span>
                </div>
              )}
            </div>
          )}
          
          {/* Current value preview */}
          {!isBound && currentValue && (
            <div className="mt-2 text-xs text-muted-foreground">
              <span>Source: </span>
              <span className="italic truncate block">"{currentValue}"</span>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search translation keys..."
              className="h-8 pl-7 text-xs"
            />
          </div>
        </div>

        {/* Key list */}
        <ScrollArea className="h-[200px]">
          <div className="p-2 space-y-1">
            {/* Quick bind with suggested key */}
            {!isBound && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start h-auto py-2 text-xs"
                onClick={() => handleBindKey(suggestedKey)}
              >
                <Plus className="h-3 w-3 mr-2 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Auto-generate key</div>
                  <div className="font-mono text-[10px] text-muted-foreground truncate">
                    {suggestedKey}
                  </div>
                </div>
              </Button>
            )}

            {/* Create new option */}
            {!showCreateNew ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setShowCreateNew(true)}
              >
                <Plus className="h-3 w-3 mr-2" />
                Custom key...
              </Button>
            ) : (
              <div className="p-2 border rounded-md space-y-2 bg-muted/30">
                <Label className="text-xs">Custom translation key:</Label>
                <Input
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                  placeholder={suggestedKey}
                  className="h-7 text-xs font-mono"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateNew();
                    if (e.key === 'Escape') setShowCreateNew(false);
                  }}
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    className="h-6 text-xs flex-1"
                    onClick={handleCreateNew}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Bind
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setShowCreateNew(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Divider */}
            {availableKeys.length > 0 && (
              <div className="flex items-center gap-2 py-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">Existing keys</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            {/* Existing keys */}
            {availableKeys.map((keyRecord) => {
              const isCurrentKey = keyRecord.key === currentKey;
              const translatedValue = engine.getTranslation(keyRecord.key);
              
              return (
                <button
                  key={keyRecord.id}
                  className={cn(
                    'w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    isCurrentKey && 'bg-primary/10 text-primary'
                  )}
                  onClick={() => handleBindKey(keyRecord.key)}
                >
                  <div className="font-mono text-xs truncate">{keyRecord.key}</div>
                  <div className="text-muted-foreground truncate text-[10px] mt-0.5">
                    {translatedValue || keyRecord.sourceText}
                  </div>
                </button>
              );
            })}

            {/* Empty state */}
            {availableKeys.length === 0 && !showCreateNew && (
              <div className="text-center py-4 text-xs text-muted-foreground">
                {searchQuery ? 'No keys match your search' : 'No existing translation keys'}
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// Translation Status Indicator (compact)
// ============================================================================

interface TranslationStatusIndicatorProps {
  sectionId: string;
  className?: string;
}

export function TranslationStatusIndicator({ sectionId, className }: TranslationStatusIndicatorProps) {
  const engine = useOptionalTranslationEngine();
  const pageData = usePageData();
  
  const section = pageData?.sections.find(s => s.id === sectionId);
  const keys = section?.translationKeys || {};
  const keyCount = Object.keys(keys).length;
  
  if (keyCount === 0 || !engine) {
    return null;
  }

  // Check how many have translations
  let translatedCount = 0;
  Object.values(keys).forEach(key => {
    if (typeof key === 'string' && engine.getTranslation(key)) {
      translatedCount++;
    }
  });

  const allTranslated = translatedCount === keyCount;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'text-[10px] h-5 gap-1',
        allTranslated ? 'text-green-600 border-green-200' : 'text-amber-600 border-amber-200',
        className
      )}
    >
      <Languages className="h-3 w-3" />
      {translatedCount}/{keyCount}
    </Badge>
  );
}

export default TranslationKeyPicker;
