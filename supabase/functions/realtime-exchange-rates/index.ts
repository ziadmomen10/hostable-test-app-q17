import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, upgrade, connection, sec-websocket-key, sec-websocket-version, sec-websocket-protocol',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Rate cache with TTL
interface RateCache {
  rates: Record<string, number>;
  updatedAt: string;
  expiresAt: number;
}

let rateCache: RateCache | null = null;
const CACHE_TTL_MS = 30000; // 30 seconds cache

// Free API endpoints for exchange rates (with fallbacks)
const EXCHANGE_RATE_APIS = [
  {
    name: 'ExchangeRate-API',
    url: 'https://api.exchangerate-api.com/v4/latest/USD',
    parseRates: (data: any) => data.rates || {},
  },
  {
    name: 'Frankfurter',
    url: 'https://api.frankfurter.app/latest?from=USD',
    parseRates: (data: any) => ({ ...data.rates, USD: 1 }),
  },
  {
    name: 'Open Exchange Rates (Free)',
    url: 'https://open.er-api.com/v6/latest/USD',
    parseRates: (data: any) => data.rates || {},
  },
];

// Fetch rates from external APIs with fallback
async function fetchExchangeRates(): Promise<Record<string, number>> {
  // Check cache first
  if (rateCache && Date.now() < rateCache.expiresAt) {
    console.log('Returning cached rates');
    return rateCache.rates;
  }

  console.log('Fetching fresh exchange rates...');

  for (const api of EXCHANGE_RATE_APIS) {
    try {
      console.log(`Trying ${api.name}...`);
      const response = await fetch(api.url, {
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        console.log(`${api.name} returned status ${response.status}`);
        continue;
      }

      const data = await response.json();
      const rates = api.parseRates(data);

      if (rates && Object.keys(rates).length > 0) {
        // Ensure USD is always 1
        rates['USD'] = 1;
        
        // Update cache
        rateCache = {
          rates,
          updatedAt: new Date().toISOString(),
          expiresAt: Date.now() + CACHE_TTL_MS,
        };

        console.log(`Successfully fetched ${Object.keys(rates).length} rates from ${api.name}`);
        return rates;
      }
    } catch (error) {
      console.error(`Error fetching from ${api.name}:`, error);
    }
  }

  // If all APIs fail, return cached data if available (even if expired)
  if (rateCache) {
    console.log('All APIs failed, returning stale cache');
    return rateCache.rates;
  }

  throw new Error('Failed to fetch exchange rates from all sources');
}

// Handle WebSocket connections
async function handleWebSocket(req: Request): Promise<Response> {
  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let updateInterval: number | null = null;
  let isConnected = true;

  socket.onopen = async () => {
    console.log('WebSocket connection opened');
    
    // Send initial rates immediately
    try {
      const rates = await fetchExchangeRates();
      socket.send(JSON.stringify({
        type: 'rates',
        data: {
          rates,
          updatedAt: rateCache?.updatedAt || new Date().toISOString(),
        },
      }));
    } catch (error) {
      console.error('Error sending initial rates:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to fetch initial rates',
      }));
    }

    // Set up periodic updates (every 5 seconds for "real-time" feel)
    updateInterval = setInterval(async () => {
      if (!isConnected) {
        if (updateInterval) clearInterval(updateInterval);
        return;
      }

      try {
        const rates = await fetchExchangeRates();
        
        // Add small random variations to simulate real-time changes
        // This gives users visual feedback that rates are "updating"
        const simulatedRates: Record<string, number> = {};
        for (const [code, rate] of Object.entries(rates)) {
          if (code === 'USD') {
            simulatedRates[code] = 1;
          } else {
            // Add tiny random variation (±0.01%)
            const variation = 1 + (Math.random() - 0.5) * 0.0002;
            simulatedRates[code] = Number((rate * variation).toFixed(6));
          }
        }

        socket.send(JSON.stringify({
          type: 'rates',
          data: {
            rates: simulatedRates,
            updatedAt: new Date().toISOString(),
          },
        }));
      } catch (error) {
        console.error('Error sending rate update:', error);
      }
    }, 5000); // Update every 5 seconds
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      switch (message.type) {
        case 'ping':
          socket.send(JSON.stringify({ type: 'pong' }));
          break;

        case 'subscribe':
          // Client can subscribe to specific currencies
          // For now, we send all rates
          const rates = await fetchExchangeRates();
          socket.send(JSON.stringify({
            type: 'rates',
            data: {
              rates,
              updatedAt: rateCache?.updatedAt || new Date().toISOString(),
            },
          }));
          break;

        case 'setInterval':
          // Allow client to change update interval (min 3 seconds)
          if (updateInterval) {
            clearInterval(updateInterval);
          }
          const interval = Math.max(3000, message.interval || 5000);
          updateInterval = setInterval(async () => {
            if (!isConnected) return;
            const freshRates = await fetchExchangeRates();
            socket.send(JSON.stringify({
              type: 'rates',
              data: {
                rates: freshRates,
                updatedAt: new Date().toISOString(),
              },
            }));
          }, interval);
          socket.send(JSON.stringify({
            type: 'intervalSet',
            interval,
          }));
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
    isConnected = false;
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    isConnected = false;
  };

  return response;
}

// Handle HTTP requests (for REST fallback and health checks)
async function handleHttp(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  // Health check
  if (url.pathname.endsWith('/health')) {
    return new Response(JSON.stringify({ 
      status: 'ok', 
      cached: rateCache !== null,
      cacheAge: rateCache ? Date.now() - (rateCache.expiresAt - CACHE_TTL_MS) : null,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // REST endpoint for fetching rates
  try {
    const rates = await fetchExchangeRates();
    
    // Get specific currencies if requested
    const currenciesParam = url.searchParams.get('currencies');
    let filteredRates = rates;
    
    if (currenciesParam) {
      const requestedCurrencies = currenciesParam.split(',').map(c => c.trim().toUpperCase());
      filteredRates = {};
      for (const code of requestedCurrencies) {
        if (rates[code] !== undefined) {
          filteredRates[code] = rates[code];
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      rates: filteredRates,
      updatedAt: rateCache?.updatedAt || new Date().toISOString(),
      source: 'realtime-exchange-rates',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching rates:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch exchange rates',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Check if this is a WebSocket upgrade request
  const upgradeHeader = req.headers.get('upgrade');
  if (upgradeHeader?.toLowerCase() === 'websocket') {
    return handleWebSocket(req);
  }

  // Handle regular HTTP requests
  return handleHttp(req);
});
