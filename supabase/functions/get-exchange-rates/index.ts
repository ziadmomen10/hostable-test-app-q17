import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currencies } = await req.json();
    
    if (!currencies || !Array.isArray(currencies)) {
      console.log('Invalid request: currencies array required');
      return new Response(
        JSON.stringify({ error: 'currencies array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching exchange rates for: ${currencies.join(', ')}`);

    // Using exchangerate-api.com free tier (no API key required)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!response.ok) {
      console.error('Failed to fetch exchange rates:', response.statusText);
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    console.log('Exchange rates fetched successfully');

    // Filter to only requested currencies
    const rates: Record<string, number> = {};
    for (const currency of currencies) {
      if (data.rates[currency]) {
        rates[currency] = data.rates[currency];
      }
    }

    console.log(`Returning rates for ${Object.keys(rates).length} currencies`);

    return new Response(
      JSON.stringify({ 
        rates,
        base: 'USD',
        updated_at: data.date || new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-exchange-rates:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
