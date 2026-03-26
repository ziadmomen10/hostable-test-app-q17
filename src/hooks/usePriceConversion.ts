import { useCurrency } from '@/contexts/CurrencyContext';

interface UsePriceConversionOptions {
  decimals?: number;
}

interface UsePriceConversionReturn {
  convert: (priceUSD: number) => number;
  format: (priceUSD: number) => string;
  formatWithCode: (priceUSD: number) => string;
  symbol: string;
  code: string;
  rate: number;
  isLoading: boolean;
}

/**
 * Hook for converting and formatting prices in the user's local currency
 * All prices are stored in USD and converted at display time
 */
export const usePriceConversion = (
  options: UsePriceConversionOptions = {}
): UsePriceConversionReturn => {
  const { decimals = 2 } = options;
  const { currentCurrency, convertPrice, formatPrice, isLoading } = useCurrency();

  const convert = (priceUSD: number): number => {
    return convertPrice(priceUSD, decimals);
  };

  const format = (priceUSD: number): string => {
    return formatPrice(priceUSD, { decimals, showSymbol: true, showCode: false });
  };

  const formatWithCode = (priceUSD: number): string => {
    return formatPrice(priceUSD, { decimals, showSymbol: true, showCode: true });
  };

  return {
    convert,
    format,
    formatWithCode,
    symbol: currentCurrency?.symbol || '$',
    code: currentCurrency?.code || 'USD',
    rate: currentCurrency?.exchange_rate || 1,
    isLoading,
  };
};

export default usePriceConversion;
