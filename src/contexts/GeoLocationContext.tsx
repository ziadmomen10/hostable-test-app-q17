import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { getCountryMapping, DEFAULT_MAPPING } from '@/data/countryMappings';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { findBestCurrency, findBestLanguage } from '@/lib/geoPreferences';
import { supabase } from '@/integrations/supabase/client';
import { config } from '@/lib/config';

// Types
interface GeoLocation {
  countryCode: string;
  countryName: string;
  currency: string;
  languages: string;
  timezone: string;
}

interface GeoLocationContextType {
  location: GeoLocation | null;
  isLoading: boolean;
  error: string | null;
  isAutoDetected: boolean;
  isLanguageAutoDetected: boolean;
  isCurrencyAutoDetected: boolean;
  detectedLanguage: string | null;
  detectedCurrency: string | null;
  appliedLanguage: string | null;
  appliedCurrency: string | null;
  resetToAutoDetect: () => void;
}

const GeoLocationContext = createContext<GeoLocationContextType | null>(null);

const CACHE_KEY = 'detected-country';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface GeoLocationProviderProps {
  children: ReactNode;
}

// Inner provider that has access to I18n and Currency contexts
const GeoLocationProviderInner: React.FC<GeoLocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [isLanguageAutoDetected, setIsLanguageAutoDetected] = useState(false);
  const [isCurrencyAutoDetected, setIsCurrencyAutoDetected] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [detectedCurrency, setDetectedCurrency] = useState<string | null>(null);
  const [appliedLanguage, setAppliedLanguage] = useState<string | null>(null);
  const [appliedCurrency, setAppliedCurrency] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const { changeLanguage, languages } = useI18n();
  const { setAutoDetectedCurrency, currencies } = useCurrency();

  // Refs for stable callback references (prevents dependency loops)
  const currenciesRef = useRef(currencies);
  const languagesRef = useRef(languages);

  // Keep refs updated
  useEffect(() => {
    currenciesRef.current = currencies;
  }, [currencies]);

  useEffect(() => {
    languagesRef.current = languages;
  }, [languages]);

  // Fetch geolocation from IP
  const fetchGeoLocation = async (): Promise<GeoLocation | null> => {
    try {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            console.log('[GeoLocation] Using cached location:', data.countryCode);
            return data;
          }
        } catch {
          // Invalid cache, continue with fetch
        }
      }

      // Fetch from ipapi.co (free, no API key required)
      const response = await fetch('https://ipapi.co/json/', {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Geolocation API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Geolocation failed');
      }

      const geoLocation: GeoLocation = {
        countryCode: data.country_code || '',
        countryName: data.country_name || '',
        currency: data.currency || 'USD',
        languages: data.languages || 'en',
        timezone: data.timezone || 'UTC',
      };

      // Cache the result
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: geoLocation,
        timestamp: Date.now(),
      }));

      console.log('[GeoLocation] Detected location:', geoLocation.countryCode, geoLocation.countryName);
      return geoLocation;
    } catch (err) {
      console.error('[GeoLocation] Failed to detect location:', err);
      setError(err instanceof Error ? err.message : 'Failed to detect location');
      return null;
    }
  };

  // Apply detected settings with smart fallbacks
  // Uses refs to avoid dependency on currencies/languages arrays (prevents re-creation loop)
  const applyGeoSettings = useCallback(async (geo: GeoLocation) => {
    const mapping = getCountryMapping(geo.countryCode);
    const currentLanguages = languagesRef.current;
    const currentCurrencies = currenciesRef.current;
    
    // Store detected values (what the API returned)
    setDetectedLanguage(mapping.language);
    setDetectedCurrency(mapping.currency);

    // Check if user has MANUALLY set preferences
    const hasManualLanguage = localStorage.getItem('language-manually-set') === 'true';
    const hasManualCurrency = localStorage.getItem('currency-manually-set') === 'true';
    const autoDetectEnabled = localStorage.getItem('geo-auto-detect') !== 'false';

    console.log('[GeoLocation] Checking preferences:', {
      hasManualLanguage,
      hasManualCurrency,
      autoDetectEnabled,
      detectedLanguage: mapping.language,
      detectedCurrency: mapping.currency,
      activeLanguages: currentLanguages.map(l => l.code),
      activeCurrencies: currentCurrencies.map(c => c.code),
    });

    // Apply language if no manual preference
    if (!hasManualLanguage && autoDetectEnabled) {
      const languageResult = findBestLanguage(mapping.language, currentLanguages);
      
      if (languageResult.fallbackUsed) {
        console.log('[GeoLocation] Language fallback:', languageResult.fallbackReason);
      }
      
      const targetLanguage = currentLanguages.find(lang => lang.code === languageResult.language);
      if (targetLanguage) {
        console.log('[GeoLocation] Auto-setting language to:', languageResult.language);
        await changeLanguage(languageResult.language);
        setAppliedLanguage(languageResult.language);
        setIsLanguageAutoDetected(true);
        setIsAutoDetected(true);
      }
    } else {
      console.log('[GeoLocation] Skipping language auto-set (manual preference exists)');
    }

    // Apply currency if no manual preference
    if (!hasManualCurrency && autoDetectEnabled) {
      const currencyResult = findBestCurrency(mapping.currency, mapping.language, currentCurrencies);
      
      if (currencyResult.fallbackUsed) {
        console.log('[GeoLocation] Currency fallback:', currencyResult.fallbackReason);
      }
      
      const targetCurrency = currentCurrencies.find(c => c.code === currencyResult.currency);
      if (targetCurrency) {
        console.log('[GeoLocation] Auto-setting currency to:', currencyResult.currency);
        setAutoDetectedCurrency(currencyResult.currency);
        setAppliedCurrency(currencyResult.currency);
        setIsCurrencyAutoDetected(true);
        setIsAutoDetected(true);
      }
    } else {
      console.log('[GeoLocation] Skipping currency auto-set (manual preference exists)');
    }
  }, [changeLanguage, setAutoDetectedCurrency]); // Stable deps only - no arrays

  // Reset to auto-detect (clear manual preferences)
  const resetToAutoDetect = useCallback(() => {
    localStorage.removeItem('preferred-language');
    localStorage.removeItem('preferred-currency');
    localStorage.removeItem('language-manually-set');
    localStorage.removeItem('currency-manually-set');
    localStorage.setItem('geo-auto-detect', 'true');
    
    // Re-apply geo settings
    if (location) {
      applyGeoSettings(location);
    }
  }, [location, applyGeoSettings]);

  // Initialize - runs only once when languages and currencies are loaded
  useEffect(() => {
    const initialize = async () => {
      // Skip if already initialized
      if (hasInitialized) {
        return;
      }

      // Wait for languages and currencies to be loaded
      if (languages.length === 0 || currencies.length === 0) {
        return;
      }

      // Skip geo auto-detection in admin editor - always use defaults (English/USD)
      if (window.location.pathname.includes(config.adminHashPath)) {
        console.log('[GeoLocation] Admin editor detected, skipping auto-detection');
        setHasInitialized(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        const geo = await fetchGeoLocation();
        
        if (geo) {
          setLocation(geo);
          await applyGeoSettings(geo);
        }
        setHasInitialized(true);
      } catch (err) {
        console.error('[GeoLocation] Initialization error:', err);
        setError(err instanceof Error ? err.message : 'Initialization failed');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [languages.length, currencies.length, hasInitialized, applyGeoSettings]);

  // Subscribe to currency table changes for real-time updates
  useEffect(() => {
    if (!location || !detectedCurrency) return;

    const channel = supabase
      .channel('geo-currency-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'currencies'
        },
        async (payload) => {
          // Check if the detected currency was just activated
          if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedCurrency = payload.new as { code: string; is_active: boolean };
            
            // If the user's detected currency just became active, switch to it
            if (
              updatedCurrency.code === detectedCurrency &&
              updatedCurrency.is_active === true &&
              !localStorage.getItem('currency-manually-set')
            ) {
              console.log('[GeoLocation] Detected currency now active, switching to:', detectedCurrency);
              setAutoDetectedCurrency(detectedCurrency);
              setAppliedCurrency(detectedCurrency);
              setIsCurrencyAutoDetected(true);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [location, detectedCurrency, setAutoDetectedCurrency]);

  const contextValue: GeoLocationContextType = {
    location,
    isLoading,
    error,
    isAutoDetected,
    isLanguageAutoDetected,
    isCurrencyAutoDetected,
    detectedLanguage,
    detectedCurrency,
    appliedLanguage,
    appliedCurrency,
    resetToAutoDetect,
  };

  return (
    <GeoLocationContext.Provider value={contextValue}>
      {children}
    </GeoLocationContext.Provider>
  );
};

// Outer provider wrapper
export const GeoLocationProvider: React.FC<GeoLocationProviderProps> = ({ children }) => {
  return <GeoLocationProviderInner>{children}</GeoLocationProviderInner>;
};

// Hook to use geolocation context
export const useGeoLocation = () => {
  const context = useContext(GeoLocationContext);
  if (!context) {
    throw new Error('useGeoLocation must be used within a GeoLocationProvider');
  }
  return context;
};
