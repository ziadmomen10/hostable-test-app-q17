/**
 * TranslationPanel Component
 * 
 * Panel for managing translations with:
 * - Auto-generated keys for all translatable props
 * - Per-element editing
 * - Status visibility
 * - AI translation triggers
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Languages, Sparkles, Check, Edit2, AlertCircle, ChevronDown, Globe, RefreshCw, Link2, Link2Off, Database, HelpCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useOptionalTranslationEngine } from '@/contexts/TranslationEngineContext';
import { useEditorStore, usePageData } from '@/stores/editorStore';
import { clearTranslationCache } from '@/contexts/I18nContext';
import useAutoKeyGeneration from '@/hooks/useAutoKeyGeneration';
import { TranslationStatus, TranslationKeyRecord, TranslationEntry } from '@/types/translationEngine';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getSectionPropString } from '@/lib/sectionUtils';

// ============================================================================
// Types
// ============================================================================

interface TranslationPanelProps {
  className?: string;
  pageId: string;
  pageUrl: string;
}

interface TranslatablePropDisplay {
  sectionId: string;
  sectionType: string;
  sectionIndex: number;
  propPath: string;
  sourceText: string;
  generatedKey: string;
  actualKey: string; // The actual key to use (bound key or key from translation_keys)
  hasKey: boolean;
  hasTranslation: boolean;
  translationStatus: TranslationStatus;
  currentTranslation: string | null;
  isStale: boolean; // Source text has changed since translation
}

// ============================================================================
// Status Badge Component
// ============================================================================

const STATUS_CONFIG: Record<TranslationStatus | 'unbound', { 
  label: string; 
  description: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive'; 
  icon: React.ElementType;
}> = {
  unbound: { label: 'Unbound', description: 'No translation key assigned', variant: 'outline', icon: Link2Off },
  untranslated: { label: 'Untranslated', description: 'Key exists but no translation yet', variant: 'destructive', icon: AlertCircle },
  ai_translated: { label: 'AI', description: 'AI-generated, not yet reviewed', variant: 'secondary', icon: Sparkles },
  reviewed: { label: 'Reviewed', description: 'Human-reviewed translation', variant: 'outline', icon: Check },
  edited: { label: 'Edited', description: 'Manually edited translation', variant: 'default', icon: Edit2 },
  stale: { label: 'Stale', description: 'Source text changed since translation', variant: 'destructive', icon: RefreshCw },
};

function StatusBadge({ status, hasKey }: { status: TranslationStatus; hasKey: boolean }) {
  const key = !hasKey ? 'unbound' : status;
  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.untranslated;
  const Icon = cfg.icon;
  
  return (
    <Badge 
      variant={cfg.variant} 
      className={cn("gap-1 text-[10px]", !hasKey && "border-dashed")}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </Badge>
  );
}

function StatusLegend() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 text-[10px] text-muted-foreground gap-1 px-1.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <HelpCircle className="w-3 h-3" />
        Status Legend
        <ChevronDown className={cn("w-3 h-3 transition-transform", !isOpen && "-rotate-90")} />
      </Button>
      {isOpen && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 px-1.5 pb-2">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div key={key} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Badge 
                  variant={cfg.variant} 
                  className={cn("gap-0.5 text-[9px] px-1 py-0 h-4", key === 'unbound' && "border-dashed")}
                >
                  <Icon className="w-2.5 h-2.5" />
                  {cfg.label}
                </Badge>
                <span className="truncate">{cfg.description}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Translation Row Component
// ============================================================================

interface TranslationRowProps {
  prop: TranslatablePropDisplay;
  onSave: (value: string) => void;
  onTranslateAI: () => void;
  onBindKey: () => void;
  isTranslating: boolean;
}

function TranslationRow({ 
  prop,
  onSave, 
  onTranslateAI,
  onBindKey,
  isTranslating 
}: TranslationRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(prop.currentTranslation || '');
  
  useEffect(() => {
    setEditValue(prop.currentTranslation || '');
  }, [prop.currentTranslation]);
  
  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditValue(prop.currentTranslation || '');
    setIsEditing(false);
  };
  
  return (
    <div className={cn(
      "border rounded-lg p-3 space-y-2",
      !prop.hasKey && "border-dashed opacity-80",
      prop.isStale && "border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded truncate min-w-0 flex-1">
            {prop.propPath}
          </code>
          <StatusBadge status={prop.translationStatus} hasKey={prop.hasKey} />
        </div>
        <div className="flex items-center gap-1">
          {!prop.hasKey ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBindKey}
              className="h-7 text-xs"
            >
              <Link2 className="w-3 h-3 mr-1" />
              Bind
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onTranslateAI}
              disabled={isTranslating}
              className="h-7 text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI
            </Button>
          )}
        </div>
      </div>
      
      {/* Source text */}
      <div className="text-xs text-muted-foreground break-words">
        <span className="font-medium">Source:</span> {prop.sourceText.slice(0, 100)}{prop.sourceText.length > 100 && '...'}
      </div>
      
      {/* Translation value (only show if key is bound) */}
      {prop.hasKey && (
        isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-sm min-h-[60px]"
              placeholder="Enter translation..."
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="h-7">Save</Button>
              <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7">Cancel</Button>
            </div>
          </div>
        ) : (
          <div 
            className={cn(
              "text-sm p-2 rounded cursor-pointer hover:bg-muted/50 transition-colors",
              !prop.currentTranslation && "text-muted-foreground italic"
            )}
            onClick={() => {
              setEditValue(prop.currentTranslation || '');
              setIsEditing(true);
            }}
          >
            {prop.currentTranslation || 'Click to add translation...'}
          </div>
        )
      )}
    </div>
  );
}

// ============================================================================
// Section Group Component
// ============================================================================

interface SectionGroupProps {
  sectionId: string;
  sectionType: string;
  sectionIndex: number;
  props: TranslatablePropDisplay[];
  onSave: (key: string, value: string) => void;
  onTranslateAI: (key: string) => void;
  onBindKey: (sectionId: string, propPath: string, key: string) => void;
  isTranslating: boolean;
}

function SectionGroup({
  sectionId,
  sectionType,
  sectionIndex,
  props,
  onSave,
  onTranslateAI,
  onBindKey,
  isTranslating,
}: SectionGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  const boundCount = props.filter(p => p.hasKey).length;
  const translatedCount = props.filter(p => p.hasTranslation && !p.isStale).length;
  const staleCount = props.filter(p => p.isStale).length;
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <ChevronDown className={cn("w-4 h-4 transition-transform shrink-0", !isOpen && "-rotate-90")} />
          <span className="font-medium capitalize truncate">{sectionType.replace(/-/g, ' ')}</span>
          <span className="text-xs text-muted-foreground shrink-0">#{sectionIndex + 1}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Badge variant="outline" className="text-[10px] px-1.5 whitespace-nowrap">
            {boundCount}/{props.length} bound
          </Badge>
          <Badge 
            variant={staleCount > 0 ? "destructive" : "secondary"} 
            className="text-[10px] px-1.5 whitespace-nowrap"
          >
            {translatedCount}/{props.length} trans
            {staleCount > 0 && ` (${staleCount} stale)`}
          </Badge>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 ml-6 mt-2">
        {props.map(prop => (
          <TranslationRow
            key={`${prop.sectionId}-${prop.propPath}`}
            prop={prop}
            onSave={(value) => onSave(prop.actualKey, value)}
            onTranslateAI={() => onTranslateAI(prop.actualKey)}
            onBindKey={() => onBindKey(prop.sectionId, prop.propPath, prop.actualKey)}
            isTranslating={isTranslating}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================================================
// Main Panel Component
// ============================================================================

export function TranslationPanel({ className, pageId, pageUrl }: TranslationPanelProps) {
  const engine = useOptionalTranslationEngine();
  const pageData = usePageData();
  const queryClient = useQueryClient();
  const { setTranslationKey, originalPageData } = useEditorStore();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Auto-key generation - EditorProvider handles auto-generation on mount/section changes
  // This hook is only used here for manual regeneration and getting translatable props
  // CRITICAL FIX: Ensure originalSections has a fallback to pageData.sections
  // This prevents displayProps from being empty when originalPageData is undefined
  const effectiveSections = pageData?.sections || [];
  const effectiveOriginalSections = originalPageData?.sections || effectiveSections;
  
  const { 
    generateAllKeys, 
    getAllTranslatableProps,
    isGenerating 
  } = useAutoKeyGeneration({
    pageId,
    pageUrl,
    sections: effectiveSections,
    originalSections: effectiveOriginalSections,
    enabled: false, // Disabled - EditorProvider handles auto-generation
  });
  
  // Initialize selected language
  useEffect(() => {
    if (engine?.languages?.length && !selectedLanguage) {
      const nonDefault = engine.languages.find(l => !l.is_default);
      setSelectedLanguage(nonDefault?.code || engine.languages[0]?.code || '');
    }
  }, [engine?.languages, selectedLanguage]);
  
  // ========================================
  // Fetch translations for SELECTED language (not global I18n language)
  // This is the key fix - we need translations for the dropdown selection
  // ========================================
  // ========================================
  // CRITICAL FIX: Query translations only for CURRENT section keys
  // This ensures UI counts match the database state correctly
  // ========================================
  const currentSectionIds = useMemo(() => effectiveSections.map(s => s.id), [effectiveSections]);
  
  const { data: selectedLangTranslations = [], refetch: refetchSelectedLangTranslations } = useQuery({
    queryKey: ['translations-panel', pageId, selectedLanguage, currentSectionIds],
    queryFn: async () => {
      if (!selectedLanguage || !engine?.languages.length) return [];
      if (currentSectionIds.length === 0) return [];
      
      const lang = engine.languages.find(l => l.code === selectedLanguage);
      if (!lang) return [];
      
      // CRITICAL FIX: Get keys only for current sections (not orphaned ones)
      const { data: currentKeys, error: keysError } = await supabase
        .from('translation_keys')
        .select('key')
        .eq('page_id', pageId)
        .eq('is_active', true)
        .in('section_id', currentSectionIds);
      
      if (keysError || !currentKeys || currentKeys.length === 0) {
        console.log('[TranslationPanel] No keys found for current sections');
        return [];
      }
      
      const keys = currentKeys.map(k => k.key);
      console.log('[TranslationPanel] Fetching translations for', keys.length, 'keys in', currentSectionIds.length, 'sections');
      
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .in('key', keys)
        .eq('language_id', lang.id);
      
      if (error) {
        console.error('[TranslationPanel] Error fetching translations:', error);
        return [];
      }
      
      console.log('[TranslationPanel] Found', data.length, 'translations for language', selectedLanguage);
      
      return data.map((row): TranslationEntry => ({
        id: row.id,
        key: row.key,
        languageId: row.language_id,
        value: row.value,
        status: (row.status as TranslationStatus) || 'untranslated',
        sourceText: row.source_text || undefined,
        sourceLanguage: row.source_language || undefined,
        context: row.context || undefined,
        aiProvider: row.ai_provider || undefined,
        aiTranslatedAt: row.ai_translated_at ? new Date(row.ai_translated_at) : undefined,
        manuallyEditedAt: row.manually_edited_at ? new Date(row.manually_edited_at) : undefined,
        updatedAt: new Date(row.updated_at),
      }));
    },
    enabled: !!pageId && !!selectedLanguage && currentSectionIds.length > 0 && !!engine?.languages.length,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
  
  // Build translation lookup from selected language translations
  const selectedLangLookup = useMemo(() => {
    const lookup: Record<string, string> = {};
    for (const t of selectedLangTranslations) {
      if (t.value) {
        lookup[t.key] = t.value;
      }
    }
    return lookup;
  }, [selectedLangTranslations]);
  
  // Build display props by combining auto-generated props with existing keys
  // Also detect stale translations (source text changed since translation)
  const displayProps = useMemo((): TranslatablePropDisplay[] => {
    const translatableProps = getAllTranslatableProps();
    const sections = effectiveSections;
    
    return translatableProps.map(prop => {
      // Check if this section has this key bound
      const section = sections.find(s => s.id === prop.sectionId);
      const boundKey = section?.translationKeys?.[prop.propPath];
      
      // Find the key record - could be bound, or could exist by generated key, or by section+path
      const keyRecord = engine?.translationKeys.find(k => 
        k.key === boundKey || 
        k.key === prop.generatedKey ||
        (k.sectionId === prop.sectionId && k.propPath === prop.propPath)
      );
      
      const hasKey = !!boundKey || !!keyRecord;
      
      // Determine the actual key to use for translation lookup
      const actualKey = boundKey || keyRecord?.key || prop.generatedKey;
      
      // Get translation data - USE selectedLangTranslations, not engine.translations
      const translation = selectedLangTranslations.find(t => t.key === actualKey);
      
      // CRITICAL FIX: Use getSectionPropString to handle usesDataWrapper sections
      // This correctly gets values from props.data.* for sections with usesDataWrapper: true
      const currentSourceText = section 
        ? getSectionPropString(section, prop.propPath) || prop.sourceText 
        : prop.sourceText;
      
      // Check if source text has changed (stale detection)
      // PRIORITY: Use keyRecord.sourceText as the ground truth (set during key generation)
      // This is more reliable than translation.sourceText which may not exist yet
      const storedSourceText = keyRecord?.sourceText || '';
      
      // Normalize both strings: trim whitespace and normalize line breaks for comparison
      const normalizedStoredSource = storedSourceText.trim().replace(/\s+/g, ' ');
      const normalizedCurrentSource = currentSourceText.trim().replace(/\s+/g, ' ');
      
      // Only mark as stale if:
      // 1. Has a key assigned
      // 2. Has a translated value (not untranslated)
      // 3. We have a stored source text to compare (not empty)
      // 4. The stored source genuinely differs from current content
      const isStale = hasKey && 
        !!translation?.value && 
        storedSourceText.trim() !== '' && 
        normalizedStoredSource !== normalizedCurrentSource;
      
      // Determine translation status - mark as stale if source changed
      let translationStatus: TranslationStatus = translation?.status || 'untranslated';
      if (isStale) {
        translationStatus = 'stale';
      }
      
      return {
        ...prop,
        sourceText: currentSourceText, // Use current source text for display
        hasKey,
        hasTranslation: !!translation?.value,
        translationStatus,
        currentTranslation: selectedLangLookup[actualKey] || null,
        isStale,
        // Store the actual key for use in handleTranslateAll
        actualKey, 
      };
    });
  }, [getAllTranslatableProps, pageData?.sections, engine?.translationKeys, selectedLangTranslations, selectedLangLookup]);
  
  // Group by section
  const propsBySection = useMemo(() => {
    const groups: Record<string, TranslatablePropDisplay[]> = {};
    
    for (const prop of displayProps) {
      // Apply search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !prop.propPath.toLowerCase().includes(search) &&
          !prop.sourceText.toLowerCase().includes(search) &&
          !prop.generatedKey.toLowerCase().includes(search)
        ) {
          continue;
        }
      }
      
      const key = `${prop.sectionId}-${prop.sectionIndex}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(prop);
    }
    
    return groups;
  }, [displayProps, searchTerm]);
  
  // Handle save translation
  const handleSave = async (key: string, value: string) => {
    if (!engine || !selectedLanguage) return;
    
    try {
      await engine.setTranslation({
        key,
        languageCode: selectedLanguage,
        value,
        status: 'edited',
      });
      // Clear translation cache so live pages get fresh translations
      const lang = engine.languages.find(l => l.code === selectedLanguage);
      if (lang) {
        clearTranslationCache(lang.id);
      }
      // Refetch our panel-specific translations to update UI
      await refetchSelectedLangTranslations();
      toast.success('Translation saved');
    } catch (error) {
      toast.error('Failed to save translation');
    }
  };
  
  // Handle AI translate single
  const handleTranslateAI = async (key: string) => {
    if (!engine || !selectedLanguage) return;
    
    try {
      await engine.translateKeys([key], [selectedLanguage]);
      // Clear translation cache so live pages get fresh translations
      const lang = engine.languages.find(l => l.code === selectedLanguage);
      if (lang) {
        clearTranslationCache(lang.id);
      }
      // Refetch our panel-specific translations to update UI
      await refetchSelectedLangTranslations();
      toast.success('AI translation complete');
    } catch (error) {
      toast.error('AI translation failed');
    }
  };
  
  // Handle bind key to section
  const handleBindKey = (sectionId: string, propPath: string, key: string) => {
    setTranslationKey(sectionId, propPath, key);
    toast.success('Translation key bound');
  };
  
  // Handle bulk operations
  const handleGenerateAll = async () => {
    const loadingToastId = toast.loading('Generating translation keys...');
    
    try {
      const allProps = getAllTranslatableProps();
      
      if (allProps.length === 0) {
        toast.warning('No translatable content found. Make sure sections have text content.', { id: loadingToastId });
        return;
      }
      
      await generateAllKeys(true); // Force regeneration
      
      // Force invalidate all translation queries
      await queryClient.invalidateQueries({ queryKey: ['translation-keys', pageId] });
      await queryClient.invalidateQueries({ queryKey: ['translations'] });
      
      // Refetch to update UI after key generation
      await refetchSelectedLangTranslations();
      console.log('[TranslationPanel] Refetch completed');
      
      toast.success(`Generated keys for ${allProps.length} translatable props`, { id: loadingToastId });
    } catch (error) {
      console.error('[TranslationPanel] Key generation failed:', error);
      const message = error instanceof Error 
        ? error.message 
        : (typeof error === 'object' ? JSON.stringify(error) : String(error));
      toast.error(`Key generation failed: ${message}`, { id: loadingToastId });
    }
  };
  
  const handleTranslateAll = async () => {
    // =========================================================================
    // CRITICAL FIX: Query only keys for CURRENT sections (not orphaned ones)
    // This ensures UI counts match what we translate
    // =========================================================================
    
    // Pre-flight checks with user feedback
    if (!engine) {
      toast.error('Translation engine not ready. Please wait...');
      return;
    }
    if (!selectedLanguage) {
      toast.error('Please select a target language');
      return;
    }
    
    const loadingToast = toast.loading('Preparing translation...');
    
    try {
      // Step 1: First generate all keys to ensure they exist in the database
      console.log('[TranslateAll] Step 1: Generating keys...');
      await generateAllKeys(true);
      
      // Small delay to ensure key generation completes
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Step 2: Get current section IDs from page data - CRITICAL FIX
      const currentSectionIds = effectiveSections.map(s => s.id);
      console.log('[TranslateAll] Current sections:', currentSectionIds.length);
      
      if (currentSectionIds.length === 0) {
        toast.error('No sections found in current page', { id: loadingToast });
        return;
      }
      
      // Step 3: Query translation keys ONLY for current sections (not orphaned ones)
      console.log('[TranslateAll] Step 3: Querying keys for current sections only...');
      const { data: allPageKeys, error: keysError } = await supabase
        .from('translation_keys')
        .select('key, source_text, context, section_id')
        .eq('page_id', pageId)
        .eq('is_active', true)
        .in('section_id', currentSectionIds);  // CRITICAL: Filter by current sections
      
      if (keysError) {
        console.error('[TranslateAll] Error fetching keys:', keysError);
        toast.error('Failed to fetch translation keys', { id: loadingToast });
        return;
      }
      
      if (!allPageKeys || allPageKeys.length === 0) {
        toast.info('No translation keys found for current sections', { id: loadingToast });
        return;
      }
      
      console.log('[TranslateAll] Found', allPageKeys.length, 'keys for current sections (vs displayProps:', displayProps.length, ')');
      
      // Step 4: Get language ID
      const lang = engine.languages.find(l => l.code === selectedLanguage);
      if (!lang) {
        toast.error(`Language "${selectedLanguage}" not found`, { id: loadingToast });
        return;
      }
      
      console.log('[TranslateAll] Target language:', lang.code, 'ID:', lang.id);
      
      // Step 5: Query existing translations for this language directly from database
      const allKeys = allPageKeys.map(k => k.key);
      const { data: existingTranslations, error: translationsError } = await supabase
        .from('translations')
        .select('key, value')
        .in('key', allKeys)
        .eq('language_id', lang.id);
      
      if (translationsError) {
        console.error('[TranslateAll] Error fetching translations:', translationsError);
      }
      
      // Build set of already translated keys (only those with non-empty values)
      const translatedKeySet = new Set(
        (existingTranslations || [])
          .filter(t => t.value && t.value.trim() !== '')
          .map(t => t.key)
      );
      
      // Remove stale keys from the "already translated" set so they get re-translated
      const staleKeySet = new Set(
        displayProps
          .filter(p => p.isStale && p.hasKey && p.actualKey)
          .map(p => p.actualKey)
      );
      for (const staleKey of staleKeySet) {
        translatedKeySet.delete(staleKey);
      }
      
      console.log('[TranslateAll] Already translated:', translatedKeySet.size, 'of', allPageKeys.length, '(excluded', staleKeySet.size, 'stale)');
      
      // Step 6: Find keys that need translation
      const keysToTranslate = allPageKeys
        .filter(k => !translatedKeySet.has(k.key))
        .filter(k => k.source_text && k.source_text.trim() !== '') // Skip empty source text
        .map(k => k.key);
      
      console.log('[TranslateAll] Keys needing translation:', keysToTranslate.length);
      
      if (keysToTranslate.length === 0) {
        toast.info('All content is already translated', { id: loadingToast });
        return;
      }
      
      // Step 7: Call translateKeys with the fresh keys from database
      toast.loading(`Translating ${keysToTranslate.length} items to ${lang.name}...`, { id: loadingToast });
      
      await engine.translateKeys(
        keysToTranslate, 
        [selectedLanguage],
        (completed, total) => {
          toast.loading(`Translating... ${completed}/${total}`, { id: loadingToast });
        }
      );
      
      // Step 8: Force cache invalidation after translation
      await new Promise(resolve => setTimeout(resolve, 300));
      // Clear translation cache so live pages get fresh translations
      clearTranslationCache(lang.id);
      await refetchSelectedLangTranslations();
      await queryClient.invalidateQueries({ queryKey: ['translation-keys', pageId] });
      await queryClient.invalidateQueries({ queryKey: ['translations-panel', pageId, selectedLanguage] });
      
      toast.success(`Translated ${keysToTranslate.length} items to ${lang.name}`, { id: loadingToast });
      
    } catch (error) {
      console.error('[TranslateAll] Failed:', error);
      toast.error('Translation failed: ' + (error instanceof Error ? error.message : 'Unknown error'), { id: loadingToast });
    }
  };
  
  // Handle re-translate stale items only
  const handleTranslateStaleOnly = async () => {
    if (!engine || !selectedLanguage) return;
    
    const sections = pageData?.sections || [];
    const stalePropsToTranslate = displayProps.filter(p => p.isStale && p.hasKey);
    
    if (stalePropsToTranslate.length === 0) {
      toast.info('No stale items to re-translate');
      return;
    }
    
    // Get the actual keys for stale items - use actualKey which is correctly computed
    const staleKeys = stalePropsToTranslate.map(p => p.actualKey);
    
    // Update source_text for stale keys in BOTH tables (translation_keys AND translations)
    console.log('[Translation] Updating source text for stale keys:', staleKeys.length);
    for (const prop of stalePropsToTranslate) {
      // 1. Update translation_keys table (ground truth for source text)
      await supabase
        .from('translation_keys')
        .update({ source_text: prop.sourceText, updated_at: new Date().toISOString() })
        .eq('key', prop.actualKey);
      
      // 2. Update source_text in ALL translation rows for this key (all languages),
      //    not just the selected language, so other languages also become non-stale
      await supabase
        .from('translations')
        .update({ source_text: prop.sourceText })
        .eq('key', prop.actualKey);
    }
    
    // Refetch translation keys to get updated source text
    await queryClient.refetchQueries({ queryKey: ['translation-keys', pageId] });
    
    // Small delay to ensure database is synced
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const toastId = toast.loading(`Re-translating ${staleKeys.length} stale items...`);
      
      await engine.translateKeys(
        staleKeys, 
        [selectedLanguage],
        (completed, total) => {
          toast.loading(`Re-translating... ${completed}/${total}`, { id: toastId });
        }
      );
      
      // Small delay before refetching to ensure all writes complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Clear translation cache so live pages get fresh translations
      const lang = engine.languages.find(l => l.code === selectedLanguage);
      if (lang) {
        clearTranslationCache(lang.id);
      }
      
      await refetchSelectedLangTranslations();
      await queryClient.refetchQueries({ queryKey: ['translation-keys', pageId] });
      
      // Invalidate panel query to force fresh data
      await queryClient.invalidateQueries({ 
        queryKey: ['translations-panel', pageId, selectedLanguage] 
      });
      
      toast.success(`Re-translated ${staleKeys.length} stale items`, { id: toastId });
    } catch (error) {
      toast.error('Re-translation failed');
    }
  };
  
  // =========================================================================
  // Handle sync keys from database
  // This fetches translation keys from the database and binds them to sections
  // that may not have them in their local state
  // =========================================================================
  const handleSyncKeysFromDB = async () => {
    const toastId = toast.loading('Syncing translation keys from database...');
    
    try {
      // Get current section IDs
      const currentSectionIds = effectiveSections.map(s => s.id);
      
      if (currentSectionIds.length === 0) {
        toast.info('No sections to sync', { id: toastId });
        return;
      }
      
      // Fetch all active keys from database for current sections
      const { data: dbKeys, error } = await supabase
        .from('translation_keys')
        .select('section_id, prop_path, key')
        .eq('page_id', pageId)
        .eq('is_active', true)
        .in('section_id', currentSectionIds);
      
      if (error) {
        throw new Error(`Failed to fetch keys: ${error.message}`);
      }
      
      if (!dbKeys || dbKeys.length === 0) {
        toast.info('No translation keys found in database. Click "Keys" to generate them.', { id: toastId });
        return;
      }
      
      console.log('[TranslationPanel] Syncing', dbKeys.length, 'keys from database');
      
      // Group keys by section
      const keysBySection = new Map<string, Record<string, string>>();
      dbKeys.forEach(k => {
        if (!keysBySection.has(k.section_id)) {
          keysBySection.set(k.section_id, {});
        }
        keysBySection.get(k.section_id)![k.prop_path] = k.key;
      });
      
      // Sync to sections that are missing keys
      let syncedCount = 0;
      effectiveSections.forEach(section => {
        const dbKeysForSection = keysBySection.get(section.id);
        if (dbKeysForSection) {
          Object.entries(dbKeysForSection).forEach(([propPath, key]) => {
            const existingKey = section.translationKeys?.[propPath];
            if (!existingKey || existingKey !== key) {
              setTranslationKey(section.id, propPath, key);
              syncedCount++;
            }
          });
        }
      });
      
      if (syncedCount > 0) {
        // Clear translation cache and refetch to update UI
        clearTranslationCache();
        await refetchSelectedLangTranslations();
        toast.success(`Synced ${syncedCount} translation keys to sections`, { id: toastId });
      } else {
        // Still clear cache and refresh to ensure UI is current
        clearTranslationCache();
        await refetchSelectedLangTranslations();
        toast.info('All keys already synced', { id: toastId });
      }
    } catch (error) {
      console.error('[TranslationPanel] Sync failed:', error);
      toast.error(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: toastId });
    }
  };
  
  if (!engine) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Translation engine not available</p>
      </div>
    );
  }
  
  // Get coverage for selected language
  const langCoverage = engine.coverage.find(c => c.languageCode === selectedLanguage);
  const totalProps = displayProps.length;
  const boundProps = displayProps.filter(p => p.hasKey).length;
  const translatedProps = displayProps.filter(p => p.hasTranslation && !p.isStale).length; // Exclude stale from "translated"
  const staleProps = displayProps.filter(p => p.isStale).length;
  const needsTranslation = displayProps.filter(p => p.hasKey && (!p.hasTranslation || p.isStale)).length;
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-3 border-b space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <Languages className="w-4 h-4" />
            <span className="font-medium text-sm">Translations</span>
          </div>
        <div className="flex gap-1 flex-wrap justify-end">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleSyncKeysFromDB}
              disabled={isGenerating}
              className="h-7 px-2"
              title="Sync keys from database to sections"
            >
              <Database className="w-3 h-3" />
              <span className="ml-1 hidden sm:inline">Sync</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleGenerateAll}
              disabled={isGenerating}
              className="h-7 px-2"
              title="Generate Keys"
            >
              <RefreshCw className={cn("w-3 h-3", isGenerating && "animate-spin")} />
              <span className="ml-1 hidden sm:inline">Keys</span>
            </Button>
            {staleProps > 0 && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleTranslateStaleOnly}
                disabled={engine.isTranslating || isGenerating}
                className="h-7 px-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                title="Re-translate Stale Items Only"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="ml-1">{staleProps}</span>
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={handleTranslateAll}
              disabled={engine.isTranslating || isGenerating}
              className="h-7 px-2"
              title="Translate All"
            >
              <Sparkles className="w-3 h-3" />
              <span className="ml-1 hidden sm:inline">Translate</span>
            </Button>
          </div>
        </div>
        
        {/* Language selector */}
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {engine.languages
              .filter(l => !l.is_default)
              .map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name} ({lang.code})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        
        {/* Coverage */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Keys Bound</span>
            <span>{boundProps}/{totalProps}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${totalProps > 0 ? (boundProps / totalProps) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Translated</span>
            <span className={staleProps > 0 ? "text-yellow-600" : ""}>
              {translatedProps}/{boundProps}
              {staleProps > 0 && ` (${staleProps} stale)`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all",
                  staleProps > 0 ? "bg-yellow-500" : "bg-primary"
                )}
                style={{ width: `${boundProps > 0 ? (translatedProps / boundProps) * 100 : 0}%` }}
              />
            </div>
          </div>
        {needsTranslation > 0 && (
            <div className="text-xs text-yellow-600 mt-1">
              {needsTranslation} element(s) need translation
            </div>
          )}
        </div>
        
        {/* Status Legend */}
        <StatusLegend />
        
        {/* Search */}
        <Input
          placeholder="Search translations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8"
        />
      </div>
      
      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {Object.keys(propsBySection).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Languages className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No translatable content found</p>
              <p className="text-xs mt-1">Add sections with text content to get started</p>
            </div>
          ) : (
            Object.entries(propsBySection).map(([key, props]) => {
              const first = props[0];
              return (
                <SectionGroup
                  key={key}
                  sectionId={first.sectionId}
                  sectionType={first.sectionType}
                  sectionIndex={first.sectionIndex}
                  props={props}
                  onSave={handleSave}
                  onTranslateAI={handleTranslateAI}
                  onBindKey={handleBindKey}
                  isTranslating={engine.isTranslating}
                />
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default TranslationPanel;
