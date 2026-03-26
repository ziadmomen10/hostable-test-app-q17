/**
 * HreflangManager
 * 
 * Configure multi-language alternate links for international SEO.
 * Compact design with language chips and URL inputs.
 * 
 * Gap 1.3: Uses useRef for initialization to prevent infinite loops
 * Gap 2.3: Adds warning that changes are session-only (not persisted)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Globe, 
  Plus, 
  X, 
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface HreflangManagerProps {
  pageUrl: string;
  currentLanguage: string;
  className?: string;
}

interface HreflangEntry {
  lang: string;
  langName: string;
  url: string;
  isDefault?: boolean;
}

export function HreflangManager({ pageUrl, currentLanguage, className }: HreflangManagerProps) {
  const [entries, setEntries] = useState<HreflangEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Gap 1.3: Use ref to track initialization and prevent infinite loops
  const initializedRef = useRef(false);

  // Fetch available languages
  const { data: languages } = useQuery({
    queryKey: ['languages-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('languages')
        .select('code, name, is_default')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Gap 1.3: Initialize entries from languages with ref pattern
  useEffect(() => {
    if (languages && languages.length > 0 && !initializedRef.current) {
      initializedRef.current = true;
      const defaultEntries = languages.map(lang => ({
        lang: lang.code,
        langName: lang.name,
        url: pageUrl.replace(/^\//, `/${lang.code}/`),
        isDefault: lang.is_default,
      }));
      setEntries(defaultEntries);
    }
  }, [languages, pageUrl]);

  const updateEntry = (lang: string, url: string) => {
    setEntries(prev => prev.map(e => 
      e.lang === lang ? { ...e, url } : e
    ));
  };

  const addLanguage = (lang: { code: string; name: string }) => {
    if (entries.find(e => e.lang === lang.code)) return;
    setEntries(prev => [...prev, {
      lang: lang.code,
      langName: lang.name,
      url: pageUrl.replace(/^\//, `/${lang.code}/`),
    }]);
  };

  const removeEntry = (lang: string) => {
    if (lang === currentLanguage) return; // Can't remove current
    setEntries(prev => prev.filter(e => e.lang !== lang));
  };

  // Generate hreflang HTML
  const generateHTML = () => {
    const baseUrl = window.location.origin;
    const lines = entries.map(e => {
      const fullUrl = e.url.startsWith('http') ? e.url : `${baseUrl}${e.url}`;
      return `<link rel="alternate" hreflang="${e.lang}" href="${fullUrl}" />`;
    });
    
    // Add x-default
    const defaultEntry = entries.find(e => e.isDefault) || entries[0];
    if (defaultEntry) {
      const fullUrl = defaultEntry.url.startsWith('http') 
        ? defaultEntry.url 
        : `${window.location.origin}${defaultEntry.url}`;
      lines.push(`<link rel="alternate" hreflang="x-default" href="${fullUrl}" />`);
    }
    
    return lines.join('\n');
  };

  const copyHTML = () => {
    navigator.clipboard.writeText(generateHTML());
    setCopied(true);
    toast.success('Hreflang tags copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const unusedLanguages = languages?.filter(
    l => !entries.find(e => e.lang === l.code)
  ) || [];

  return (
    <div className={cn("space-y-1.5", className)}>
      {/* Stats Row */}
      <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
        <Badge variant="secondary" className="h-5 gap-1">
          <Globe className="h-2.5 w-2.5" />
          {entries.length} languages
        </Badge>
        {entries.length >= 2 ? (
          <Badge variant="outline" className="h-5 gap-1 text-green-600 border-green-500/50">
            <CheckCircle2 className="h-2.5 w-2.5" />
            Multi-language ready
          </Badge>
        ) : (
          <Badge variant="outline" className="h-5 gap-1 text-yellow-600 border-yellow-500/50">
            <AlertTriangle className="h-2.5 w-2.5" />
            Add more languages
          </Badge>
        )}
      </div>

      {/* Language Entries */}
      <ScrollArea className="max-h-[100px]">
        <div className="space-y-1 pr-1">
          {entries.map((entry) => (
            <div key={entry.lang} className="flex items-center gap-1 text-[9px]">
              <Badge 
                variant="outline" 
                className={cn(
                  "h-4 px-1 shrink-0",
                  entry.lang === currentLanguage && "border-primary bg-primary/5"
                )}
              >
                {entry.lang}
              </Badge>
              <Input
                value={entry.url}
                onChange={(e) => updateEntry(entry.lang, e.target.value)}
                placeholder={`/${entry.lang}/page-url`}
                className="h-5 text-[9px] flex-1"
              />
              {entry.isDefault && (
                <Badge variant="secondary" className="h-4 text-[7px] px-1 shrink-0">
                  default
                </Badge>
              )}
              {entry.lang !== currentLanguage && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 shrink-0"
                  onClick={() => removeEntry(entry.lang)}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Add Language */}
      {unusedLanguages.length > 0 && (
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-between h-5 text-[9px] px-1 text-muted-foreground"
            >
              <span className="flex items-center gap-1">
                <Plus className="h-2.5 w-2.5" />
                Add language ({unusedLanguages.length} available)
              </span>
              <ChevronDown className={cn(
                "h-2.5 w-2.5 transition-transform",
                detailsOpen && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-0.5">
            <div className="flex flex-wrap gap-0.5">
              {unusedLanguages.map((lang) => (
                <Button
                  key={lang.code}
                  variant="outline"
                  size="sm"
                  className="h-5 text-[8px] px-1.5"
                  onClick={() => addLanguage(lang)}
                >
                  <Plus className="h-2 w-2 mr-0.5" />
                  {lang.code}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Copy HTML Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full h-6 text-[10px] gap-1"
        onClick={copyHTML}
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            Copy Hreflang Tags
          </>
        )}
      </Button>

      {/* Gap 2.3: Session-only warning */}
      <div className="flex items-center gap-1 p-1.5 rounded bg-yellow-500/10 border border-yellow-500/20">
        <Info className="h-3 w-3 text-yellow-600 shrink-0" />
        <span className="text-[8px] text-yellow-700 dark:text-yellow-400">
          Changes are session-only. Copy tags before leaving.
        </span>
      </div>
    </div>
  );
}
