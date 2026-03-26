/**
 * SEOLanguageSelector
 * 
 * Compact language picker with flags and SEO coverage indicators.
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { seoQueryKeys } from './hooks/queryKeys';

interface SEOLanguageSelectorProps {
  pageId: string;
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
}

// Language flags mapping
const languageFlags: Record<string, string> = {
  en: '🇺🇸',
  ar: '🇸🇦',
  fr: '🇫🇷',
  de: '🇩🇪',
  es: '🇪🇸',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ko: '🇰🇷',
  pt: '🇧🇷',
  ru: '🇷🇺',
  it: '🇮🇹',
  nl: '🇳🇱',
  pl: '🇵🇱',
  tr: '🇹🇷',
  hi: '🇮🇳',
  th: '🇹🇭',
  vi: '🇻🇳',
  id: '🇮🇩',
  he: '🇮🇱',
  uk: '🇺🇦',
};

export function SEOLanguageSelector({ 
  pageId, 
  selectedLanguage, 
  onLanguageChange 
}: SEOLanguageSelectorProps) {
  // Fetch available languages
  const { data: languages } = useQuery({
    queryKey: ['languages-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('languages')
        .select('id, code, name, native_name, is_default')
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch which languages have SEO data for this page
  const { data: seoLanguages } = useQuery({
    queryKey: seoQueryKeys.pageSeoLanguages(pageId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_seo')
        .select('language_code')
        .eq('page_id', pageId);
      
      if (error) throw error;
      return data?.map(d => d.language_code) || [];
    },
    enabled: !!pageId,
  });

  if (!languages || languages.length === 0) {
    return null;
  }

  const getFlag = (code: string) => languageFlags[code] || '🌐';

  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-full h-8 bg-background px-2 text-xs">
        <SelectValue>
          <div className="flex items-center gap-1">
            <span>{getFlag(selectedLanguage)}</span>
            <span className="font-medium">{selectedLanguage.toUpperCase()}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-background z-50 min-w-[140px]">
        {languages.map((lang) => {
          const hasSeoData = seoLanguages?.includes(lang.code);
          
          return (
            <SelectItem key={lang.id} value={lang.code} className="text-xs">
              <div className="flex items-center gap-2 w-full">
                <span>{getFlag(lang.code)}</span>
                <span className="flex-1">{lang.code.toUpperCase()}</span>
                {hasSeoData && (
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                )}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
