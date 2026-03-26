import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { config } from '@/lib/config';

// Types
export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number | null;
  is_active: boolean;
  is_default: boolean;
}

interface CurrencyContextType {
  currentCurrency: Currency | null;
  currencies: Currency[];
  exchangeRates: Record<string, number>;
  isLoading: boolean;
  setCurrency: (code: string) => void;
  convertPrice: (priceUSD: number, decimals?: number) => number;
  formatPrice: (priceUSD: number, options?: FormatPriceOptions) => string;
  setAutoDetectedCurrency: (code: string) => void;
}

interface FormatPriceOptions {
  decimals?: number;
  showSymbol?: boolean;
  showCode?: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const STORAGE_KEY = 'preferred-currency';
const AUTO_DETECT_KEY = 'geo-auto-detect';

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency | null>(null);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isManuallySet, setIsManuallySet] = useState(false);

  // Fetch active currencies from database
  const fetchCurrencies = async (): Promise<Currency[]> => {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('code');

      if (error) throw error;
      return (data || []) as Currency[];
    } catch (error) {
      console.error('Error fetching currencies:', error);
      return [];
    }
  };

  // Build exchange rates map
  const buildExchangeRates = (currencyList: Currency[]): Record<string, number> => {
    const rates: Record<string, number> = { USD: 1 };
    currencyList.forEach(currency => {
      if (currency.exchange_rate) {
        rates[currency.code] = currency.exchange_rate;
      }
    });
    return rates;
  };

  // Set currency by code (manual selection)
  const setCurrency = useCallback((code: string) => {
    const currency = currencies.find(c => c.code === code);
    if (currency) {
      setCurrentCurrency(currency);
      setIsManuallySet(true);
      localStorage.setItem(STORAGE_KEY, code);
      // Mark as manually set (consistent with Header and GeoLocationContext)
      localStorage.setItem('currency-manually-set', 'true');
    }
  }, [currencies]);

  // Set currency from auto-detection (only if not manually overridden)
  const setAutoDetectedCurrency = useCallback((code: string) => {
    // Skip if already set to this currency (prevents unnecessary re-renders)
    if (currentCurrency?.code === code) {
      return;
    }

    // Use the same flag that Header sets when user manually selects
    const hasManualCurrency = localStorage.getItem('currency-manually-set') === 'true';

    if (hasManualCurrency) {
      console.log('[Currency] Skipping auto-detection (manual preference exists)');
      return;
    }

    const currency = currencies.find(c => c.code === code);
    if (currency) {
      console.log('[Currency] Auto-setting currency to:', code);
      setCurrentCurrency(currency);
      // Don't save to localStorage for auto-detected values
    }
  }, [currencies, currentCurrency]);

  // Convert price from USD to current currency
  const convertPrice = useCallback((priceUSD: number, decimals = 2): number => {
    if (!currentCurrency || !currentCurrency.exchange_rate) {
      return priceUSD;
    }
    const converted = priceUSD * currentCurrency.exchange_rate;
    return Number(converted.toFixed(decimals));
  }, [currentCurrency]);

  // Format price with currency symbol
  const formatPrice = useCallback((priceUSD: number, options: FormatPriceOptions = {}): string => {
    const { decimals = 2, showSymbol = true, showCode = false } = options;
    
    const convertedPrice = convertPrice(priceUSD, decimals);
    const symbol = currentCurrency?.symbol || '$';
    const code = currentCurrency?.code || 'USD';

    // Format number with locale
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(convertedPrice);

    let result = '';
    if (showSymbol) {
      result = `${symbol}${formattedNumber}`;
    } else {
      result = formattedNumber;
    }

    if (showCode) {
      result += ` ${code}`;
    }

    return result;
  }, [convertPrice, currentCurrency]);

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      try {
        const availableCurrencies = await fetchCurrencies();
        setCurrencies(availableCurrencies);
        setExchangeRates(buildExchangeRates(availableCurrencies));

        if (availableCurrencies.length === 0) {
          console.warn('No active currencies found');
          setIsLoading(false);
          return;
        }

        // Check for stored preference — skip in admin to force USD
        const isAdmin = window.location.pathname.includes(config.adminHashPath);
        let targetCurrency: Currency | undefined;

        if (!isAdmin) {
          const storedCurrency = localStorage.getItem(STORAGE_KEY);
          if (storedCurrency) {
            targetCurrency = availableCurrencies.find(c => c.code === storedCurrency);
            if (targetCurrency) {
              setIsManuallySet(true);
            } else {
              console.log('[Currency] Stored preference inactive, clearing:', storedCurrency);
              localStorage.removeItem(STORAGE_KEY);
            }
          }
        }

        // Fallback to USD → default → first available
        if (!targetCurrency) {
          targetCurrency = availableCurrencies.find(c => c.code === 'USD') ||
                          availableCurrencies.find(c => c.is_default) ||
                          availableCurrencies[0];
        }

        if (targetCurrency) {
          setCurrentCurrency(targetCurrency);
        }
      } catch (error) {
        console.error('Error initializing currency context:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Keep a ref to currentCurrency so the realtime callback always reads the latest value
  // without triggering channel teardown/recreation on every currency change
  const currentCurrencyRef = useRef(currentCurrency);
  useEffect(() => {
    currentCurrencyRef.current = currentCurrency;
  }, [currentCurrency]);

  // Subscribe to real-time currency updates — runs ONCE, reads from ref
  useEffect(() => {
    const channel = supabase
      .channel('currency-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'currencies'
        },
        async () => {
          // Refresh currencies when changes are detected
          const updatedCurrencies = await fetchCurrencies();
          setCurrencies(updatedCurrencies);
          setExchangeRates(buildExchangeRates(updatedCurrencies));

          // Read current value from ref — avoids stale closure
          const activeCurrency = currentCurrencyRef.current;
          if (activeCurrency) {
            const updated = updatedCurrencies.find(c => c.code === activeCurrency.code);
            if (updated) {
              // Currency still active, update it
              setCurrentCurrency(updated);
            } else {
              // Currency was deactivated - fall back to USD or default
              console.log('[Currency] Current currency deactivated, falling back to USD');
              const fallback = updatedCurrencies.find(c => c.code === 'USD') ||
                              updatedCurrencies.find(c => c.is_default) ||
                              updatedCurrencies[0];
              if (fallback) {
                setCurrentCurrency(fallback);
                localStorage.removeItem(STORAGE_KEY); // Clear preference for inactive currency
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Empty array: subscribe once, never re-create channel on currency change

  const contextValue: CurrencyContextType = {
    currentCurrency,
    currencies,
    exchangeRates,
    isLoading,
    setCurrency,
    convertPrice,
    formatPrice,
    setAutoDetectedCurrency,
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Hook to use currency context
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
