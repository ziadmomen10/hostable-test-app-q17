import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  X, 
  Save, 
  Loader2, 
  Globe, 
  Languages, 
  Key, 
  Sparkles, 
  Wand2, 
  Copy, 
  Bot, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Language {
  id: string;
  code: string;
  name: string;
  native_name?: string;
  direction?: string;
  is_active?: boolean;
}

interface PageTranslationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  namespace: string;
  elementKey: string;
  elementType: string;
  defaultContent: string;
  languages: Language[];
  onTranslationSaved: (translationKey: string, translations: Record<string, string>) => void;
  onKeyAssigned?: (component: any, key: string) => void;
  component?: any;
  tagName?: string;
  section?: string;
}

type TranslationSource = 'none' | 'ai' | 'human';

interface TranslationState {
  value: string;
  source: TranslationSource;
  isNew: boolean;
}

const PageTranslationPanel: React.FC<PageTranslationPanelProps> = ({
  isOpen,
  onClose,
  pageId,
  namespace,
  elementKey,
  elementType,
  defaultContent,
  languages,
  onTranslationSaved,
  onKeyAssigned,
  component,
  tagName,
  section,
}) => {
  const [translations, setTranslations] = useState<Record<string, TranslationState>>({});
  const [translationKey, setTranslationKey] = useState<string>('');
  const [suggestedKey, setSuggestedKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoTranslating, setAutoTranslating] = useState(false);
  const [existingKey, setExistingKey] = useState<string | null>(null);
  

  // Format key for display: section.tag.descriptor -> Section → <tag> → Descriptor
  const formatKeyForDisplay = (key: string): string => {
    const parts = key.split('.');
    if (parts.length < 2) return key;
    
    const section = parts[0].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const tag = parts[1] ? `<${parts[1]}>` : '';
    const rest = parts.slice(2).join(' ').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    return [section, tag, rest].filter(Boolean).join(' → ');
  };

  // Generate a suggested key
  const generateSuggestedKey = (content: string, type: string, tag?: string, sectionName?: string): string => {
    const cleanContent = content
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 3)
      .join('_');
    
    let descriptor = 'text';
    const tagLower = tag?.toLowerCase() || '';
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagLower)) {
      descriptor = 'title';
    } else if (tagLower === 'p') {
      descriptor = 'description';
    } else if (tagLower === 'button') {
      descriptor = 'button';
    } else if (tagLower === 'a') {
      descriptor = 'link';
    } else if (tagLower === 'span' || tagLower === 'label') {
      descriptor = 'label';
    } else if (tagLower === 'li') {
      descriptor = 'item';
    }
    
    const sectionPart = sectionName || 'section';
    const tagPart = tagLower || 'text';
    
    return `${sectionPart}.${tagPart}.${descriptor}_${cleanContent}`.substring(0, 50);
  };

  // Check if element already has a data-i18n-key attribute
  useEffect(() => {
    if (!isOpen || !component) return;
    
    const existingI18nKey = component.getAttributes()?.['data-i18n-key'];
    if (existingI18nKey) {
      setExistingKey(existingI18nKey);
      setTranslationKey(existingI18nKey);
    } else {
      setExistingKey(null);
      const suggested = generateSuggestedKey(defaultContent, elementType, tagName, section);
      setSuggestedKey(suggested);
      setTranslationKey(suggested);
    }
  }, [isOpen, component, defaultContent, elementType, tagName, section]);

  // Fetch existing translations
  useEffect(() => {
    if (!isOpen || !translationKey) return;
    
    const fetchTranslations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('translations')
          .select('*, languages!inner(code)')
          .eq('namespace', namespace)
          .eq('key', translationKey);
        
        if (error) throw error;
        
        const translationMap: Record<string, TranslationState> = {};
        
        // Set default English content
        const englishLang = languages.find(l => l.code === 'en');
        if (englishLang) {
          translationMap['en'] = { 
            value: defaultContent, 
            source: 'human',
            isNew: true 
          };
        }
        
        // Populate existing translations
        if (data && data.length > 0) {
          data.forEach((t: any) => {
            const langCode = t.languages?.code;
            if (langCode && t.value) {
              translationMap[langCode] = {
                value: t.value,
                source: t.status === 'ai_generated' ? 'ai' : 'human',
                isNew: false
              };
            }
          });
        }
        
        setTranslations(translationMap);
      } catch (error) {
        console.error('Error fetching translations:', error);
        setTranslations({ en: { value: defaultContent, source: 'human', isNew: true } });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTranslations();
  }, [isOpen, translationKey, namespace, defaultContent, languages]);

  // Handle AI auto-translate
  const handleAutoTranslate = async () => {
    const englishContent = translations['en']?.value || defaultContent;
    
    if (!englishContent.trim()) {
      toast.error("No content to translate", {
        description: "Please enter English content first"
      });
      return;
    }

    const targetLanguages = languages
      .filter(l => l.code !== 'en' && l.is_active !== false)
      .map(l => ({ code: l.code, name: l.name }));

    if (targetLanguages.length === 0) {
      toast.error("No target languages", {
        description: "No other languages are configured for translation"
      });
      return;
    }

    setAutoTranslating(true);
    
    try {
      const response = await supabase.functions.invoke('ai-translate', {
        body: {
          sourceText: englishContent,
          sourceLanguage: 'English',
          targetLanguages
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Translation failed');
      }

      const data = response.data;
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.translations) {
        setTranslations(prev => {
          const updated = { ...prev };
          Object.entries(data.translations).forEach(([langCode, value]) => {
            updated[langCode] = {
              value: value as string,
              source: 'ai',
              isNew: !prev[langCode] || prev[langCode].isNew
            };
          });
          return updated;
        });
        
        toast.success("AI translations generated", {
          description: `Translated to ${Object.keys(data.translations).length} languages. Review before saving.`
        });
      }
    } catch (error) {
      console.error('Auto-translate error:', error);
      toast.error("Translation failed", {
        description: error instanceof Error ? error.message : "Failed to auto-translate"
      });
    } finally {
      setAutoTranslating(false);
    }
  };

  // Copy English content to a language
  const handleCopyFromEnglish = (langCode: string) => {
    const englishContent = translations['en']?.value || defaultContent;
    setTranslations(prev => ({
      ...prev,
      [langCode]: {
        value: englishContent,
        source: 'human',
        isNew: prev[langCode]?.isNew ?? true
      }
    }));
    toast.success("English content copied. Edit as needed.");
  };

  // Handle save
  const handleSave = async () => {
    if (!translationKey.trim()) {
      toast.error("Please enter a translation key");
      return;
    }

    setSaving(true);
    try {
      const upsertPromises = Object.entries(translations).map(async ([langCode, state]) => {
        const language = languages.find(l => l.code === langCode);
        if (!language || !state.value.trim()) return null;
        
        const { error } = await supabase
          .from('translations')
          .upsert({
            namespace: namespace,
            key: translationKey.trim(),
            language_id: language.id,
            value: state.value.trim(),
            status: state.source === 'ai' ? 'draft' : 'draft',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'namespace,key,language_id',
            ignoreDuplicates: false
          });
        
        if (error) {
          const { data: existing } = await supabase
            .from('translations')
            .select('id')
            .eq('namespace', namespace)
            .eq('key', translationKey.trim())
            .eq('language_id', language.id)
            .single();
          
          if (existing) {
            await supabase
              .from('translations')
              .update({ value: state.value.trim(), updated_at: new Date().toISOString() })
              .eq('id', existing.id);
          } else {
            await supabase
              .from('translations')
              .insert({
                namespace: namespace,
                key: translationKey.trim(),
                language_id: language.id,
                value: state.value.trim(),
              });
          }
        }
        
        return { langCode, content: state.value };
      });
      
      await Promise.all(upsertPromises.filter(Boolean));
      
      if (component && onKeyAssigned) {
        onKeyAssigned(component, translationKey.trim());
      }
      
      toast.success("Translations saved", {
        description: `Saved ${Object.keys(translations).filter(k => translations[k]?.value?.trim()).length} language versions`
      });
      
      const simpleTranslations = Object.fromEntries(
        Object.entries(translations).map(([k, v]) => [k, v.value])
      );
      onTranslationSaved(translationKey.trim(), simpleTranslations);
      onClose();
    } catch (error) {
      console.error('Error saving translations:', error);
      toast.error("Failed to save translations");
    } finally {
      setSaving(false);
    }
  };

  // Calculate completion stats
  const activeLanguages = languages.filter(l => l.is_active !== false);
  const translatedCount = Object.values(translations).filter(t => t?.value?.trim()).length;
  const completionPercentage = activeLanguages.length > 0 
    ? Math.round((translatedCount / activeLanguages.length) * 100) 
    : 0;

  // Sort languages
  const sortedLanguages = [...languages].sort((a, b) => {
    if (a.code === 'en') return -1;
    if (b.code === 'en') return 1;
    return a.name.localeCompare(b.name);
  });

  const useSuggestedKey = () => {
    setTranslationKey(suggestedKey);
  };

  // Character limit recommendations
  const getCharLimit = (): number | null => {
    const tagLower = tagName?.toLowerCase();
    if (tagLower === 'h1') return 60;
    if (['h2', 'h3'].includes(tagLower || '')) return 80;
    if (tagLower === 'button' || tagLower === 'a') return 25;
    return null;
  };

  const charLimit = getCharLimit();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[500px] bg-card border-l shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">Translate Element</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {tagName && <code className="bg-muted px-1 rounded">&lt;{tagName}&gt;</code>}
              {section && <><ArrowRight className="h-3 w-3" /><span className="text-primary">{section}</span></>}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Translation Key Section */}
      <div className="px-4 py-3 border-b bg-muted/30 space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5" />
            Translation Key
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">A unique identifier for this text. Format: section.tag.descriptor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          {existingKey ? (
            <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
              Updating existing key
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
              Creating new key
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={translationKey}
            onChange={(e) => setTranslationKey(e.target.value.replace(/[^a-z0-9_.]/gi, '_').toLowerCase())}
            placeholder="e.g., hero.h1.title_main"
            className="font-mono text-sm"
          />
          {!existingKey && suggestedKey && suggestedKey !== translationKey && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={useSuggestedKey}
              className="shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Auto
            </Button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <span className="opacity-60">Full key:</span>
          <code className="bg-background px-1.5 py-0.5 rounded font-medium">{namespace}.{translationKey || '...'}</code>
        </p>
        {translationKey && (
          <p className="text-[10px] text-primary flex items-center gap-1">
            <span className="opacity-60">Readable:</span>
            <span>{formatKeyForDisplay(translationKey)}</span>
          </p>
        )}
      </div>

      {/* Progress Banner */}
      <div className="px-4 py-2 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium">Translation Progress</span>
          <span className={`text-xs font-semibold ${
            completionPercentage >= 100 ? 'text-green-600' : 
            completionPercentage >= 50 ? 'text-yellow-600' : 'text-muted-foreground'
          }`}>
            {translatedCount} of {activeLanguages.length} languages
          </span>
        </div>
        <Progress value={completionPercentage} className="h-1.5" />
        {completionPercentage < 100 && (
          <p className="text-[10px] text-muted-foreground mt-1">
            {activeLanguages.length - translatedCount} languages remaining
          </p>
        )}
      </div>

      {/* AI Auto-Translate Section */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-blue-500" />
            <div>
              <span className="text-sm font-medium">AI Auto-Translate</span>
              <p className="text-[10px] text-muted-foreground">
                Translates English to all languages. Review before publishing.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAutoTranslate}
            disabled={autoTranslating || loading || !translations['en']?.value}
            className="gap-1.5"
          >
            {autoTranslating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Wand2 className="h-3.5 w-3.5" />
                Translate All
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Translation Fields */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Loading translations...</span>
            </div>
          ) : (
            sortedLanguages.filter(lang => lang.is_active !== false).map((lang) => {
              const isRTL = lang.direction === 'rtl';
              const state = translations[lang.code];
              const content = state?.value || '';
              const source = state?.source || 'none';
              const isEnglish = lang.code === 'en';
              const charCount = content.length;
              const isOverLimit = charLimit && charCount > charLimit;
              
              return (
                <div key={lang.id} className="space-y-1.5 group">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{lang.native_name || lang.name}</span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1 font-mono">
                        {lang.code.toUpperCase()}
                      </Badge>
                      {isRTL && (
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">RTL</Badge>
                      )}
                      {isEnglish && (
                        <Badge className="text-[10px] h-4 px-1 bg-primary/20 text-primary border-0">
                          Source
                        </Badge>
                      )}
                    </Label>
                    
                    {/* Status indicator */}
                    <div className="flex items-center gap-2">
                      {content ? (
                        source === 'ai' ? (
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-blue-50 border-blue-200 text-blue-600">
                            <Bot className="h-2.5 w-2.5 mr-0.5" />
                            AI Generated
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-green-50 border-green-200 text-green-600">
                            <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                            Saved
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-muted-foreground">
                          <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
                          Missing
                        </Badge>
                      )}
                      
                      {/* Char count */}
                      <span className={`text-[10px] ${isOverLimit ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                        {charCount}{charLimit && `/${charLimit}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    {elementType === 'heading' || elementType === 'link' || elementType === 'button' ? (
                      <Input
                        value={content}
                        onChange={(e) => setTranslations(prev => ({
                          ...prev,
                          [lang.code]: { 
                            value: e.target.value, 
                            source: 'human',
                            isNew: prev[lang.code]?.isNew ?? true
                          }
                        }))}
                        placeholder={`Enter ${lang.name} translation...`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className={`text-sm pr-8 ${isRTL ? 'text-right' : ''} ${isOverLimit ? 'border-red-300 focus:ring-red-500' : ''}`}
                      />
                    ) : (
                      <Textarea
                        value={content}
                        onChange={(e) => setTranslations(prev => ({
                          ...prev,
                          [lang.code]: { 
                            value: e.target.value, 
                            source: 'human',
                            isNew: prev[lang.code]?.isNew ?? true
                          }
                        }))}
                        placeholder={`Enter ${lang.name} translation...`}
                        rows={3}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className={`text-sm resize-none ${isRTL ? 'text-right' : ''}`}
                      />
                    )}
                    
                    {/* Copy from English button */}
                    {!isEnglish && !content && translations['en']?.value && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleCopyFromEnglish(lang.code)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Copy English content</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  {isOverLimit && (
                    <p className="text-[10px] text-red-500">
                      Exceeds recommended {charLimit} character limit for SEO
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
      
      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t bg-muted/30">
        <div className="flex items-center gap-2">
          {completionPercentage >= 100 ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          )}
          <span className="text-xs text-muted-foreground">
            {completionPercentage >= 100 
              ? 'All languages translated!' 
              : `${activeLanguages.length - translatedCount} languages remaining`
            }
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || !translationKey.trim()}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save Translations
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageTranslationPanel;
