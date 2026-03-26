/**
 * Regional Geo-Preferences Utilities
 * Smart fallback logic for currency and language detection
 */

/**
 * Regional currency fallback chains
 * When detected currency isn't active, try these in order by language
 */
export const REGIONAL_CURRENCY_FALLBACKS: Record<string, string[]> = {
  // Middle East / Arabic
  'ar': ['AED', 'SAR', 'EGP', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD'],
  
  // Europe
  'de': ['EUR', 'CHF'],
  'fr': ['EUR', 'CHF', 'CAD'],
  'es': ['EUR', 'MXN'],
  'it': ['EUR'],
  'pt': ['EUR', 'BRL'],
  'nl': ['EUR'],
  
  // Asia
  'zh': ['CNY', 'HKD', 'TWD', 'SGD'],
  'ja': ['JPY'],
  'ko': ['KRW'],
  'hi': ['INR'],
  'th': ['THB'],
  'vi': ['VND'],
  'id': ['IDR'],
  
  // Americas
  'en': ['USD', 'CAD', 'GBP', 'AUD', 'NZD'],
  
  // Slavic
  'ru': ['RUB'],
  'uk': ['UAH'],
  'pl': ['PLN', 'EUR'],
  
  // Others
  'tr': ['TRY', 'EUR'],
  'fa': ['IRR', 'AED'],
  'he': ['ILS'],
  'sv': ['SEK', 'EUR'],
  'no': ['NOK', 'EUR'],
  'da': ['DKK', 'EUR'],
  'fi': ['EUR'],
};

/**
 * Regional language fallback chains
 * When detected language isn't active, try these in order
 */
export const REGIONAL_LANGUAGE_FALLBACKS: Record<string, string[]> = {
  // Arabic dialects → Standard Arabic → English
  'ar': ['ar', 'en'],
  
  // Germanic
  'de': ['de', 'en'],
  'nl': ['nl', 'de', 'en'],
  'sv': ['sv', 'en'],
  'no': ['no', 'en'],
  'da': ['da', 'en'],
  
  // Romance
  'fr': ['fr', 'en'],
  'es': ['es', 'en'],
  'pt': ['pt', 'es', 'en'],
  'it': ['it', 'en'],
  
  // Asian
  'zh': ['zh', 'en'],
  'ja': ['ja', 'en'],
  'ko': ['ko', 'en'],
  
  // Default
  'en': ['en'],
};

export interface ActiveCurrency {
  code: string;
  is_active?: boolean;
}

export interface ActiveLanguage {
  code: string;
  is_active?: boolean;
}

/**
 * Find the best available currency based on preference and regional fallbacks
 * 
 * Priority:
 * 1. Exact match with preferred currency
 * 2. Regional fallbacks based on language
 * 3. USD as global fallback
 * 4. First available currency
 */
export function findBestCurrency(
  preferredCurrency: string,
  languageCode: string,
  activeCurrencies: ActiveCurrency[]
): { currency: string; fallbackUsed: boolean; fallbackReason?: string } {
  const activeCodes = new Set(activeCurrencies.map(c => c.code));
  
  // 1. Try exact match
  if (activeCodes.has(preferredCurrency)) {
    return { 
      currency: preferredCurrency, 
      fallbackUsed: false 
    };
  }
  
  // 2. Try regional fallbacks for the language
  const fallbacks = REGIONAL_CURRENCY_FALLBACKS[languageCode] || [];
  for (const fallback of fallbacks) {
    if (activeCodes.has(fallback)) {
      return { 
        currency: fallback, 
        fallbackUsed: true, 
        fallbackReason: `${preferredCurrency} not active, using regional ${fallback}` 
      };
    }
  }
  
  // 3. Try USD as global fallback
  if (activeCodes.has('USD')) {
    return { 
      currency: 'USD', 
      fallbackUsed: true, 
      fallbackReason: `${preferredCurrency} not active, using USD` 
    };
  }
  
  // 4. Return first available
  const firstAvailable = activeCurrencies[0]?.code || 'USD';
  return { 
    currency: firstAvailable, 
    fallbackUsed: true, 
    fallbackReason: `${preferredCurrency} not active, using first available ${firstAvailable}` 
  };
}

/**
 * Find the best available language based on preference and regional fallbacks
 * 
 * Priority:
 * 1. Exact match with preferred language
 * 2. Regional fallbacks
 * 3. English as global fallback
 * 4. First available language
 */
export function findBestLanguage(
  preferredLanguage: string,
  activeLanguages: ActiveLanguage[]
): { language: string; fallbackUsed: boolean; fallbackReason?: string } {
  const activeCodes = new Set(activeLanguages.map(l => l.code));
  
  // 1. Try exact match
  if (activeCodes.has(preferredLanguage)) {
    return { 
      language: preferredLanguage, 
      fallbackUsed: false 
    };
  }
  
  // 2. Try regional fallbacks
  const fallbacks = REGIONAL_LANGUAGE_FALLBACKS[preferredLanguage] || [];
  for (const fallback of fallbacks) {
    if (activeCodes.has(fallback)) {
      return { 
        language: fallback, 
        fallbackUsed: true, 
        fallbackReason: `${preferredLanguage} not active, using ${fallback}` 
      };
    }
  }
  
  // 3. Try English as global fallback
  if (activeCodes.has('en')) {
    return { 
      language: 'en', 
      fallbackUsed: true, 
      fallbackReason: `${preferredLanguage} not active, using English` 
    };
  }
  
  // 4. Return first available
  const firstAvailable = activeLanguages[0]?.code || 'en';
  return { 
    language: firstAvailable, 
    fallbackUsed: true, 
    fallbackReason: `${preferredLanguage} not active, using first available ${firstAvailable}` 
  };
}

/**
 * Check if a specific currency is active in the list
 */
export function isCurrencyActive(currencyCode: string, activeCurrencies: ActiveCurrency[]): boolean {
  return activeCurrencies.some(c => c.code === currencyCode);
}

/**
 * Check if a specific language is active in the list
 */
export function isLanguageActive(languageCode: string, activeLanguages: ActiveLanguage[]): boolean {
  return activeLanguages.some(l => l.code === languageCode);
}
