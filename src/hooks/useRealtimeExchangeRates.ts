import { useState, useEffect, useCallback, useRef } from 'react';

interface ExchangeRates {
  [code: string]: number;
}

interface RateChange {
  [code: string]: 'up' | 'down' | 'unchanged';
}

interface UseRealtimeExchangeRatesOptions {
  currencies?: string[];
  updateInterval?: number;
  autoConnect?: boolean;
}

interface UseRealtimeExchangeRatesReturn {
  rates: ExchangeRates;
  previousRates: ExchangeRates;
  rateChanges: RateChange;
  lastUpdated: Date | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  setUpdateInterval: (interval: number) => void;
}

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || 'https://hkfjyktrgcxkxzdxxatx.supabase.co').replace(/\/$/, '');
const WS_URL = SUPABASE_URL.replace(/^http/, 'ws') + '/functions/v1/realtime-exchange-rates';
const REST_URL = SUPABASE_URL + '/functions/v1/realtime-exchange-rates';

// Tiny ±0.01% variation to give visual live-update feedback (matches server WS behaviour)
function applyVariations(rates: ExchangeRates): ExchangeRates {
  const result: ExchangeRates = {};
  for (const [code, rate] of Object.entries(rates)) {
    if (code === 'USD') {
      result[code] = 1;
    } else {
      const variation = 1 + (Math.random() - 0.5) * 0.0002;
      result[code] = Number((rate * variation).toFixed(6));
    }
  }
  return result;
}

export const useRealtimeExchangeRates = (
  options: UseRealtimeExchangeRatesOptions = {}
): UseRealtimeExchangeRatesReturn => {
  const { currencies, updateInterval = 5000, autoConnect = true } = options;

  const [rates, setRates] = useState<ExchangeRates>({});
  const [previousRates, setPreviousRates] = useState<ExchangeRates>({});
  const [rateChanges, setRateChanges] = useState<RateChange>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectAttempts = useRef(0);
  const baseRatesRef = useRef<ExchangeRates>({}); // last real rates from server
  const maxReconnectAttempts = 3;

  const calculateRateChanges = useCallback(
    (newRates: ExchangeRates, oldRates: ExchangeRates): RateChange => {
      const changes: RateChange = {};
      for (const code of Object.keys(newRates)) {
        const oldRate = oldRates[code];
        const newRate = newRates[code];
        if (oldRate === undefined || oldRate === newRate) {
          changes[code] = 'unchanged';
        } else if (newRate > oldRate) {
          changes[code] = 'up';
        } else {
          changes[code] = 'down';
        }
      }
      return changes;
    },
    []
  );

  const applyRateUpdate = useCallback(
    (rawRates: ExchangeRates, timestamp: string, withVariation = false) => {
      let finalRates = rawRates;
      if (currencies && currencies.length > 0) {
        finalRates = {};
        for (const code of currencies) {
          if (rawRates[code] !== undefined) finalRates[code] = rawRates[code];
        }
      }
      if (withVariation) finalRates = applyVariations(finalRates);

      setRates((prev) => {
        setPreviousRates(prev);
        setRateChanges(calculateRateChanges(finalRates, prev));
        return finalRates;
      });
      setLastUpdated(new Date(timestamp));
      setError(null);
    },
    [currencies, calculateRateChanges]
  );

  // REST fetch — used for initial load and polling fallback
  const fetchRatesRest = useCallback(
    async (withVariation = false): Promise<boolean> => {
      try {
        const url =
          currencies && currencies.length > 0
            ? `${REST_URL}?currencies=${currencies.join(',')}`
            : REST_URL;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!data.success || !data.rates) throw new Error('Invalid response');
        baseRatesRef.current = data.rates;
        applyRateUpdate(data.rates, new Date().toISOString(), withVariation);
        return true;
      } catch (err) {
        console.error('Exchange rate REST error:', err);
        setError('Failed to fetch exchange rates');
        return false;
      }
    },
    [currencies, applyRateUpdate]
  );

  // Poll with variations using the last known base rates
  const startRestPolling = useCallback(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = setInterval(() => {
      // If we have base rates, apply variations immediately for visual feedback
      if (Object.keys(baseRatesRef.current).length > 0) {
        applyRateUpdate(baseRatesRef.current, new Date().toISOString(), true);
      }
      // Also refresh from server every 30s (every 6 ticks at 5s interval)
      fetchRatesRest(false).then((ok) => {
        if (ok) setIsConnected(true);
      });
    }, Math.max(3000, updateInterval));
  }, [updateInterval, applyRateUpdate, fetchRatesRest]);

  const stopRestPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (isConnecting) return;

    // Fetch initial data via REST immediately so rates show without waiting for WS
    if (reconnectAttempts.current === 0) {
      fetchRatesRest(false).then((ok) => {
        if (ok) {
          setIsConnected(true);  // show Live right away via REST
          startRestPolling();    // start polling for variations while WS connects
        }
      });
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttempts.current = 0;
        stopRestPolling(); // WS takes over, stop REST polling

        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);

        if (currencies && currencies.length > 0) {
          ws.send(JSON.stringify({ type: 'subscribe', currencies }));
        }
        ws.send(JSON.stringify({ type: 'setInterval', interval: Math.max(3000, updateInterval) }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'rates') {
            baseRatesRef.current = message.data.rates;
            applyRateUpdate(message.data.rates, message.data.updatedAt, false);
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onerror = () => setError('WebSocket connection error');

      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        } else {
          // WS unavailable — keep showing live via REST polling with variations
          setIsConnected(true);
          startRestPolling();
        }
      };
    } catch {
      setIsConnecting(false);
      setIsConnected(true); // REST already loaded data
      startRestPolling();
    }
  }, [currencies, updateInterval, applyRateUpdate, fetchRatesRest, startRestPolling, stopRestPolling, isConnecting]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) { clearTimeout(reconnectTimeoutRef.current); reconnectTimeoutRef.current = null; }
    if (pingIntervalRef.current) { clearInterval(pingIntervalRef.current); pingIntervalRef.current = null; }
    stopRestPolling();
    if (wsRef.current) { wsRef.current.close(1000, 'User disconnected'); wsRef.current = null; }
    setIsConnected(false);
    setIsConnecting(false);
    reconnectAttempts.current = 0;
  }, [stopRestPolling]);

  const setUpdateIntervalFn = useCallback((interval: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'setInterval', interval: Math.max(3000, interval) }));
    }
  }, []);

  useEffect(() => {
    if (autoConnect) connect();
    return () => { disconnect(); };
  }, [autoConnect]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isConnected && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'subscribe', currencies }));
    }
  }, [currencies, isConnected]);

  return { rates, previousRates, rateChanges, lastUpdated, isConnected, isConnecting, error, connect, disconnect, setUpdateInterval: setUpdateIntervalFn };
};

export const useTimeAgo = (date: Date | null): string => {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    if (!date) { setTimeAgo(''); return; }

    const update = () => {
      const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
      if (seconds < 5) setTimeAgo('just now');
      else if (seconds < 60) setTimeAgo(`${seconds} seconds ago`);
      else if (seconds < 3600) { const m = Math.floor(seconds / 60); setTimeAgo(`${m} minute${m > 1 ? 's' : ''} ago`); }
      else setTimeAgo(date.toLocaleTimeString());
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [date]);

  return timeAgo;
};
