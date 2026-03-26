import { useState, useEffect, useRef, useCallback } from 'react';
import { CRYPTO_CURRENCIES } from '@/data/cryptoCurrencies';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws/!ticker@arr';

export interface CryptoPrice {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: number;
}

export interface PriceChange {
  direction: 'up' | 'down' | 'unchanged';
  previousPrice: number;
}

interface BinanceTicker {
  s: string;   // Symbol (BTCUSDT)
  c: string;   // Close price (current)
  P: string;   // Price change percent (24h)
  h: string;   // High price (24h)
  l: string;   // Low price (24h)
  v: string;   // Volume
}

interface UseCryptoRealtimePricesOptions {
  cryptoCodes: string[];
  autoConnect?: boolean;
}

interface UseCryptoRealtimePricesReturn {
  prices: Record<string, CryptoPrice>;
  priceChanges: Record<string, PriceChange>;
  lastUpdated: Date | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
}

// Map crypto codes to their Binance symbols
const getBinanceSymbols = (codes: string[]): Set<string> => {
  const symbols = new Set<string>();
  codes.forEach(code => {
    const crypto = CRYPTO_CURRENCIES.find(c => c.code === code);
    if (crypto) {
      symbols.add(crypto.binanceSymbol);
    }
  });
  return symbols;
};

// Map Binance symbol back to crypto code
const symbolToCode = (symbol: string): string | null => {
  const crypto = CRYPTO_CURRENCIES.find(c => c.binanceSymbol === symbol);
  return crypto?.code || null;
};

export const useCryptoRealtimePrices = ({
  cryptoCodes,
  autoConnect = true,
}: UseCryptoRealtimePricesOptions): UseCryptoRealtimePricesReturn => {
  const [prices, setPrices] = useState<Record<string, CryptoPrice>>({});
  const [priceChanges, setPriceChanges] = useState<Record<string, PriceChange>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const trackedSymbolsRef = useRef<Set<string>>(new Set());

  // Update tracked symbols when cryptoCodes change
  useEffect(() => {
    trackedSymbolsRef.current = getBinanceSymbols(cryptoCodes);
  }, [cryptoCodes]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[Binance WS] Already connected');
      return;
    }

    if (isConnecting) {
      console.log('[Binance WS] Connection already in progress');
      return;
    }

    setIsConnecting(true);
    console.log('[Binance WS] Connecting to Binance...');

    try {
      const ws = new WebSocket(BINANCE_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[Binance WS] Connected successfully');
        setIsConnected(true);
        setIsConnecting(false);
      };

      ws.onmessage = (event) => {
        try {
          const tickers: BinanceTicker[] = JSON.parse(event.data);
          const trackedSymbols = trackedSymbolsRef.current;

          // Filter only tracked cryptocurrencies
          const relevantTickers = tickers.filter(t => trackedSymbols.has(t.s));

          if (relevantTickers.length === 0) return;

          setPrices(prevPrices => {
            const newPrices = { ...prevPrices };
            const newChanges: Record<string, PriceChange> = {};

            relevantTickers.forEach(ticker => {
              const code = symbolToCode(ticker.s);
              if (!code) return;

              const newPrice = parseFloat(ticker.c);
              const prevPrice = prevPrices[code]?.price;

              // Determine price direction
              if (prevPrice !== undefined && prevPrice !== newPrice) {
                newChanges[code] = {
                  direction: newPrice > prevPrice ? 'up' : 'down',
                  previousPrice: prevPrice,
                };
              }

              newPrices[code] = {
                price: newPrice,
                change24h: parseFloat(ticker.P),
                high24h: parseFloat(ticker.h),
                low24h: parseFloat(ticker.l),
                volume: parseFloat(ticker.v),
              };
            });

            // Update price changes
            if (Object.keys(newChanges).length > 0) {
              setPriceChanges(prev => ({ ...prev, ...newChanges }));

              // Clear price change indicators after animation
              setTimeout(() => {
                setPriceChanges(prev => {
                  const updated = { ...prev };
                  Object.keys(newChanges).forEach(code => {
                    if (updated[code]) {
                      updated[code] = { ...updated[code], direction: 'unchanged' };
                    }
                  });
                  return updated;
                });
              }, 1000);
            }

            return newPrices;
          });

          setLastUpdated(new Date());
        } catch (error) {
          console.error('[Binance WS] Error parsing message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('[Binance WS] Disconnected:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);

        // Auto-reconnect after 3 seconds if not intentionally closed
        if (event.code !== 1000) {
          console.log('[Binance WS] Scheduling reconnect...');
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('[Binance WS] Error:', error);
        setIsConnecting(false);
      };
    } catch (error) {
      console.error('[Binance WS] Failed to create WebSocket:', error);
      setIsConnecting(false);
    }
  }, [isConnecting]);

  const disconnect = useCallback(() => {
    console.log('[Binance WS] Disconnecting...');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && cryptoCodes.length > 0) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, cryptoCodes.length > 0]); // Only depend on whether we have codes

  return {
    prices,
    priceChanges,
    lastUpdated,
    isConnected,
    isConnecting,
    connect,
    disconnect,
  };
};

// Custom hook for time ago display
export const useCryptoTimeAgo = (date: Date | null): string => {
  const [timeAgo, setTimeAgo] = useState<string>('Never');

  useEffect(() => {
    if (!date) {
      setTimeAgo('Never');
      return;
    }

    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
      if (seconds < 2) {
        setTimeAgo('Just now');
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else {
        const minutes = Math.floor(seconds / 60);
        setTimeAgo(`${minutes}m ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [date]);

  return timeAgo;
};
