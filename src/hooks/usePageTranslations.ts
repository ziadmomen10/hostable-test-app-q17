import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useI18n } from '@/contexts/I18nContext';

interface Translation {
  key: string;
  value: string;
}

/**
 * Hook to fetch and apply translations to HTML content based on current language
 */
export const usePageTranslations = (pageUrl: string, htmlContent: string | null) => {
  const { currentLanguage } = useI18n();
  const [translatedContent, setTranslatedContent] = useState<string | null>(htmlContent);
  const [isTranslating, setIsTranslating] = useState(false);

  // Get the language code from the Language object
  const languageCode = currentLanguage?.code || 'en';

  // Get namespace from page URL (same logic as VisualPageEditor)
  const getNamespace = useCallback((url: string) => {
    if (url === '/' || url === '/home') return 'homepage';
    const cleanUrl = url.replace(/^\//, '').replace(/[^a-zA-Z0-9]/g, '_');
    return cleanUrl || 'page';
  }, []);

  // Apply translations to HTML content
  const applyTranslations = useCallback((html: string, translations: Translation[]): string => {
    if (!translations.length) return html;

    // Create a translation map for quick lookup
    const translationMap = new Map<string, string>();
    translations.forEach(t => {
      if (t.key && t.value) {
        translationMap.set(t.key, t.value);
      }
    });

    // Parse HTML and replace text content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find all elements with data-i18n-key attribute
    const elements = doc.querySelectorAll('[data-i18n-key]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n-key');
      if (key && translationMap.has(key)) {
        const translatedText = translationMap.get(key)!;
        
        // Check if element has only text content (no child elements with their own translations)
        const hasTranslatableChildren = element.querySelector('[data-i18n-key]');
        if (!hasTranslatableChildren) {
          // Replace text content directly
          element.textContent = translatedText;
        } else {
          // Only replace direct text nodes, not child elements
          const childNodes = Array.from(element.childNodes);
          childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
              node.textContent = translatedText;
            }
          });
        }
      }
    });

    // Return the body innerHTML
    return doc.body.innerHTML;
  }, []);

  // Fetch translations and apply them
  useEffect(() => {
    const fetchAndApplyTranslations = async () => {
      if (!htmlContent || !pageUrl) {
        setTranslatedContent(htmlContent);
        return;
      }

      // For English, just use original content
      if (languageCode === 'en') {
        setTranslatedContent(htmlContent);
        return;
      }

      setIsTranslating(true);

      try {
        const namespace = getNamespace(pageUrl);
        
        // First, get the language ID for the current language
        const { data: langData, error: langError } = await supabase
          .from('languages')
          .select('id')
          .eq('code', languageCode)
          .single();

        if (langError || !langData) {
          console.error('Language not found:', languageCode);
          setTranslatedContent(htmlContent);
          setIsTranslating(false);
          return;
        }

        // Fetch translations for this namespace and language
        const { data: translations, error } = await supabase
          .from('translations')
          .select('key, value')
          .eq('namespace', namespace)
          .eq('language_id', langData.id);

        if (error) {
          console.error('Error fetching translations:', error);
          setTranslatedContent(htmlContent);
          setIsTranslating(false);
          return;
        }

        if (translations && translations.length > 0) {
          const translated = applyTranslations(htmlContent, translations as Translation[]);
          setTranslatedContent(translated);
        } else {
          // No translations found, use original content
          setTranslatedContent(htmlContent);
        }
      } catch (error) {
        console.error('Error applying translations:', error);
        setTranslatedContent(htmlContent);
      } finally {
        setIsTranslating(false);
      }
    };

    fetchAndApplyTranslations();
  }, [htmlContent, pageUrl, languageCode, getNamespace, applyTranslations]);

  return {
    translatedContent,
    isTranslating,
    currentLanguage: languageCode
  };
};
