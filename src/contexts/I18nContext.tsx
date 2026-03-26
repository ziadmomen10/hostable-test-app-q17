import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntlProvider, MessageDescriptor, useIntl as useReactIntl } from 'react-intl';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { config } from '@/lib/config';
import { i18nFallbacks } from '@/lib/i18n-fallbacks';

// Types
interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string | null;
  is_default: boolean;
  is_active: boolean;
  direction: string;
  created_at: string;
  updated_at: string;
}

interface Translation {
  id: string;
  language_id: string;
  namespace: string;
  key: string;
  value: string | null;
  version: number;
}

interface TranslationBundle {
  [namespace: string]: {
    [key: string]: string;
  };
}

interface I18nContextType {
  currentLanguage: Language | null;
  languages: Language[];
  messages: Record<string, string>;
  messagesVersion: number; // Increments when messages update - use as dependency for reactivity
  isLoading: boolean;
  changeLanguage: (languageCode: string) => Promise<void>;
  refreshTranslations: () => Promise<void>;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
}

// Context
const I18nContext = createContext<I18nContextType | null>(null);

// Cache for translation bundles
const translationCache = new Map<string, { bundle: TranslationBundle; version: number; timestamp: number }>();
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute - reduced from 5 minutes for fresher data

// Export function to clear cache programmatically (useful when translations are saved in editor)
export function clearTranslationCache(languageId?: string): void {
  if (languageId) {
    translationCache.delete(languageId);
  } else {
    translationCache.clear();
  }
}

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [messagesVersion, setMessagesVersion] = useState(0); // Increments after messages update
  const [isLoading, setIsLoading] = useState(true);
  

  // Get stored language preference or default
  const getStoredLanguage = (): string | null => {
    return localStorage.getItem('preferred-language');
  };

  const setStoredLanguage = (languageCode: string): void => {
    localStorage.setItem('preferred-language', languageCode);
  };

  // Fetch available languages
  const fetchLanguages = async (): Promise<Language[]> => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  };

  // Fetch translations for a specific language with pagination
  // CRITICAL: Supabase defaults to 1000 rows - must paginate to get all translations
  const fetchTranslations = async (languageId: string): Promise<TranslationBundle> => {
    // Check cache first
    const cached = translationCache.get(languageId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('[I18nContext] Using cached translations:', cached.bundle ? Object.keys(cached.bundle).length : 0, 'namespaces');
      return cached.bundle;
    }

    try {
      // Fetch ALL translations with pagination to bypass 1000 row limit
      const allData: Array<{ namespace: string; key: string; value: string | null; version: number }> = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;
      
      while (hasMore) {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        
        const { data, error } = await supabase
          .from('translations')
          .select('namespace, key, value, version')
          .eq('language_id', languageId)
          .not('value', 'is', null)
          .range(from, to);

        if (error) throw error;
        
        if (data && data.length > 0) {
          allData.push(...data);
          hasMore = data.length === pageSize;
          page++;
        } else {
          hasMore = false;
        }
      }
      
      console.log('[I18nContext] Fetched total translations:', allData.length, 'for language:', languageId);

      const bundle: TranslationBundle = {};
      let maxVersion = 0;

      allData.forEach((translation: Translation) => {
        if (!bundle[translation.namespace]) {
          bundle[translation.namespace] = {};
        }
        bundle[translation.namespace][translation.key] = translation.value || '';
        maxVersion = Math.max(maxVersion, translation.version);
      });
      
      console.log('[I18nContext] Built bundle with namespaces:', Object.keys(bundle).slice(0, 10), '...');

      // Cache the bundle
      translationCache.set(languageId, {
        bundle,
        version: maxVersion,
        timestamp: Date.now()
      });

      return bundle;
    } catch (error) {
      console.error('Error fetching translations:', error);
      return {};
    }
  };

  // Convert bundle to flat messages for react-intl
  const flattenBundle = (bundle: TranslationBundle): Record<string, string> => {
    const flatMessages: Record<string, string> = {};
    
    Object.entries(bundle).forEach(([namespace, translations]) => {
      Object.entries(translations).forEach(([key, value]) => {
        flatMessages[`${namespace}.${key}`] = value;
      });
    });

    return flatMessages;
  };

  // Change language - accepts either a language code or a Language object
  // savePreference: when true (default), saves to localStorage. Set false during initialization
  // to prevent geo-detection from being blocked by the default language
  const changeLanguage = async (
    languageCodeOrObject: string | Language, 
    availableLanguages?: Language[],
    savePreference: boolean = true
  ): Promise<void> => {
    let targetLanguage: Language | undefined;
    
    if (typeof languageCodeOrObject === 'string') {
      // Search in provided languages array first (for initialization), then fall back to state
      const searchIn = availableLanguages || languages;
      targetLanguage = searchIn.find(lang => lang.code === languageCodeOrObject);
      if (!targetLanguage) {
        console.error(`Language ${languageCodeOrObject} not found`);
        return;
      }
    } else {
      targetLanguage = languageCodeOrObject;
    }

    // Clear cache for target language to ensure fresh data
    translationCache.delete(targetLanguage.id);
    
    setIsLoading(true);
    try {
      console.warn('[I18nContext] changeLanguage:', {
        targetCode: targetLanguage.code,
        isRTL: targetLanguage.direction === 'rtl',
        savePreference,
      });
      
      const bundle = await fetchTranslations(targetLanguage.id);
      const flatMessages = flattenBundle(bundle);
      
      console.warn('[I18nContext] Messages loaded:', {
        count: Object.keys(flatMessages).length,
        sampleKeys: Object.keys(flatMessages).slice(0, 3),
      });
      
      setCurrentLanguage(targetLanguage);
      // Spread to ensure new object reference for React reactivity
      setMessages({ ...flatMessages });
      setMessagesVersion(v => v + 1); // Increment AFTER messages are set
      
      // Only save to localStorage if this is a user-initiated change
      // This prevents the default language from blocking geo-detection
      if (savePreference) {
        setStoredLanguage(targetLanguage.code);
      }
      
      // Only set language attribute - RTL is handled at component level
      // to avoid affecting admin UI when editing RTL content
      document.documentElement.lang = targetLanguage.code;
    } catch (error) {
      console.error('Error changing language:', error);
      toast.error("Failed to load language. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh translations (useful for real-time updates)
  const refreshTranslations = async (): Promise<void> => {
    if (!currentLanguage) return;
    
    // Clear cache for current language
    translationCache.delete(currentLanguage.id);
    
    try {
      const bundle = await fetchTranslations(currentLanguage.id);
      const flatMessages = flattenBundle(bundle);
      setMessages(flatMessages);
      setMessagesVersion(v => v + 1); // Increment AFTER messages are set
    } catch (error) {
      console.error('Error refreshing translations:', error);
    }
  };

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      try {
        const availableLanguages = await fetchLanguages();
        setLanguages(availableLanguages);

        if (availableLanguages.length === 0) {
          console.warn('No active languages found');
          setIsLoading(false);
          return;
        }

        // Priority 1: Check URL for language override (used by SEO preview iframe)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        
        let targetLanguage: Language | null = null;
        
        if (urlLang) {
          targetLanguage = availableLanguages.find(lang => lang.code === urlLang) || null;
          if (targetLanguage) {
            console.log('[I18nContext] Using URL language parameter:', urlLang);
          }
        }

        // Priority 2: Stored preference — skip in admin to force default language
        const isAdmin = window.location.pathname.includes(config.adminHashPath);
        if (!targetLanguage && !isAdmin) {
          const storedLanguage = getStoredLanguage();
          if (storedLanguage) {
            targetLanguage = availableLanguages.find(lang => lang.code === storedLanguage) || null;
          }
        }

        // Priority 3: Fallback to default language
        if (!targetLanguage) {
          targetLanguage = availableLanguages.find(lang => lang.is_default) || availableLanguages[0];
        }

        if (targetLanguage) {
          // Pass the language object directly to avoid race condition with state
          // savePreference=false during init to allow geo-detection to work
          await changeLanguage(targetLanguage, availableLanguages, false);
        }
      } catch (error) {
        console.error('Error initializing i18n:', error);
        setIsLoading(false);
      }
    };

    initialize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up real-time updates for translations
  useEffect(() => {
    if (!currentLanguage) return;

    const channel = supabase
      .channel('translation-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'translations',
          filter: `language_id=eq.${currentLanguage.id}`
        },
        () => {
          // Refresh translations when changes are detected
          refreshTranslations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentLanguage]);

  const contextValue: I18nContextType = {
    currentLanguage,
    languages,
    messages,
    messagesVersion, // Include version for dependency tracking
    isLoading,
    changeLanguage,
    refreshTranslations,
    direction: (currentLanguage?.direction as 'ltr' | 'rtl') || 'ltr',
    isRTL: currentLanguage?.direction === 'rtl'
  };

  return (
    <I18nContext.Provider value={contextValue}>
      <IntlProvider
        locale={currentLanguage?.code || 'en'}
        messages={messages}
        defaultLocale="en"
        onError={() => {}} // Suppress missing translation warnings
      >
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
};

// Hook to use i18n context
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Enhanced useIntl hook with namespace support
export const useIntl = () => {
  const intl = useReactIntl();
  const { currentLanguage } = useI18n();

  const t = (key: string, values?: Record<string, any>) => {
    try {
      const result = intl.formatMessage({ id: key }, values);
      // If react-intl returns the key unchanged, the translation is missing — use static fallback
      if (result === key) {
        return i18nFallbacks[key] ?? key;
      }
      return result;
    } catch (error) {
      // Fallback: check static map, then return the key
      return i18nFallbacks[key] ?? key;
    }
  };

  const tn = (namespace: string, key: string, values?: Record<string, any>) => {
    return t(`${namespace}.${key}`, values);
  };

  return {
    ...intl,
    t,
    tn,
    currentLanguage,
    locale: currentLanguage?.code || 'en',
    isRTL: currentLanguage?.direction === 'rtl'
  };
};