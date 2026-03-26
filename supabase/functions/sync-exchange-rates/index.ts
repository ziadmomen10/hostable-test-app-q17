import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fiat API sources with fallbacks
const FIAT_APIS = [
  'https://api.exchangerate-api.com/v4/latest/USD',
  'https://api.frankfurter.app/latest?from=USD',
  'https://open.er-api.com/v6/latest/USD',
];

// Crypto codes we support (stored in currencies table)
const CRYPTO_CODES = [
  'BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'USDC', 'ADA', 'DOGE', 'TRX',
  'TON', 'LINK', 'AVAX', 'DOT', 'DAI', 'LTC', 'BCH', 'UNI', 'ATOM', 'XMR',
  'XLM', 'APT', 'ARB', 'FTM', 'ALGO', 'SUI', 'ICP', 'FIL', 'VET', 'IMX',
  'AAVE', 'MKR', 'CRV', 'LDO', 'SNX', 'INJ', 'JUP', 'OKB', 'CRO', 'LEO',
  'WIF', 'GRT', 'FET', 'AXS', 'APE', 'ENS', 'CHZ', 'KCS', 'NEO', 'CFX',
  'ZIL', 'ETC'
];

// Fetch fiat rates from external APIs with fallback
async function fetchFiatRates(): Promise<Record<string, number> | null> {
  for (const apiUrl of FIAT_APIS) {
    try {
      console.log(`[Fiat] Trying API: ${apiUrl}`);
      const response = await fetch(apiUrl, {
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        console.warn(`[Fiat] API returned ${response.status}: ${apiUrl}`);
        continue;
      }

      const data = await response.json();
      const rates = data.rates || {};

      if (Object.keys(rates).length > 0) {
        console.log(`[Fiat] Successfully fetched ${Object.keys(rates).length} rates from ${apiUrl}`);
        return rates;
      }
    } catch (error) {
      console.warn(`[Fiat] Error fetching from ${apiUrl}:`, (error as Error).message);
    }
  }

  console.error('[Fiat] All API sources failed');
  return null;
}

// Fetch crypto rates from Binance API
async function fetchCryptoRates(codes: string[]): Promise<Record<string, number>> {
  const rates: Record<string, number> = {};

  // Binance API: fetch all ticker prices at once
  try {
    console.log('[Crypto] Fetching prices from Binance...');
    const response = await fetch('https://api.binance.com/api/v3/ticker/price');

    if (!response.ok) {
      throw new Error(`Binance API returned ${response.status}`);
    }

    const allPrices: Array<{ symbol: string; price: string }> = await response.json();

    // Create a map for quick lookup
    const priceMap = new Map<string, number>();
    for (const ticker of allPrices) {
      priceMap.set(ticker.symbol, parseFloat(ticker.price));
    }

    // Extract rates for our supported cryptos
    for (const code of codes) {
      const symbol = `${code}USDT`;

      if (priceMap.has(symbol)) {
        const priceInUSD = priceMap.get(symbol)!;
        // Invert: Binance gives "1 BTC = 42000 USD", we need "1 USD = 0.0000238 BTC"
        if (priceInUSD > 0) {
          rates[code] = 1 / priceInUSD;
        }
      } else if (code === 'USDT') {
        // USDT is pegged to USD
        rates['USDT'] = 1;
      } else if (code === 'USDC') {
        // USDC is also pegged to USD
        rates['USDC'] = 1;
      } else if (code === 'DAI') {
        // DAI is a stablecoin
        rates['DAI'] = 1;
      }
    }

    console.log(`[Crypto] Successfully fetched ${Object.keys(rates).length} rates from Binance`);
  } catch (error) {
    console.error('[Crypto] Error fetching from Binance:', (error as Error).message);
  }

  return rates;
}

// Update currencies in database
async function updateCurrencyRates(
  supabase: any,
  rates: Record<string, number>,
  currencyType: 'fiat' | 'crypto'
): Promise<{ updated: number; errors: string[] }> {
  const errors: string[] = [];
  let updated = 0;
  const now = new Date().toISOString();

  // Get all active currencies of the specified type from database
  const { data: currencies, error: fetchError } = await supabase
    .from('currencies')
    .select('id, code')
    .eq('is_active', true) as { data: Array<{ id: string; code: string }> | null; error: any };

  if (fetchError) {
    errors.push(`Failed to fetch currencies: ${fetchError.message}`);
    return { updated, errors };
  }

  // Filter currencies that have rates available
  const updates: Array<{ id: string; exchange_rate: number; rate_updated_at: string }> = [];

  for (const currency of currencies || []) {
    const code = currency.code;

    // Skip if this isn't the right type
    if (currencyType === 'fiat' && CRYPTO_CODES.includes(code)) continue;
    if (currencyType === 'crypto' && !CRYPTO_CODES.includes(code)) continue;

    // Check if we have a rate for this currency
    if (rates[code] !== undefined) {
      updates.push({
        id: currency.id,
        exchange_rate: rates[code],
        rate_updated_at: now,
      });
    }
  }

  // Batch update
  for (const update of updates) {
    const { error: updateError } = await supabase
      .from('currencies')
      .update({
        exchange_rate: update.exchange_rate,
        rate_updated_at: update.rate_updated_at,
      })
      .eq('id', update.id);

    if (updateError) {
      errors.push(`Failed to update ${update.id}: ${updateError.message}`);
    } else {
      updated++;
    }
  }

  return { updated, errors };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const syncType = url.searchParams.get('type') || 'both'; // 'fiat', 'crypto', or 'both'

    console.log(`[Sync] Starting exchange rate sync. Type: ${syncType}`);

    // Initialize Supabase client with service role for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results: {
      fiat?: { updated: number; errors: string[]; ratesCount: number };
      crypto?: { updated: number; errors: string[]; ratesCount: number };
    } = {};

    // Sync fiat rates
    if (syncType === 'fiat' || syncType === 'both') {
      console.log('[Sync] Fetching fiat rates...');
      const fiatRates = await fetchFiatRates();

      if (fiatRates) {
        // Add USD = 1 (base currency)
        fiatRates['USD'] = 1;

        const { updated, errors } = await updateCurrencyRates(supabase, fiatRates, 'fiat');
        results.fiat = {
          updated,
          errors,
          ratesCount: Object.keys(fiatRates).length,
        };
        console.log(`[Sync] Fiat sync complete: ${updated} currencies updated`);
      } else {
        results.fiat = { updated: 0, errors: ['All fiat API sources failed'], ratesCount: 0 };
      }
    }

    // Sync crypto rates
    if (syncType === 'crypto' || syncType === 'both') {
      console.log('[Sync] Fetching crypto rates...');
      const cryptoRates = await fetchCryptoRates(CRYPTO_CODES);

      if (Object.keys(cryptoRates).length > 0) {
        const { updated, errors } = await updateCurrencyRates(supabase, cryptoRates, 'crypto');
        results.crypto = {
          updated,
          errors,
          ratesCount: Object.keys(cryptoRates).length,
        };
        console.log(`[Sync] Crypto sync complete: ${updated} currencies updated`);
      } else {
        results.crypto = { updated: 0, errors: ['Failed to fetch crypto rates'], ratesCount: 0 };
      }
    }

    const response = {
      success: true,
      syncType,
      timestamp: new Date().toISOString(),
      results,
    };

    console.log('[Sync] Complete:', JSON.stringify(response));

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Sync] Fatal error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message || 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
