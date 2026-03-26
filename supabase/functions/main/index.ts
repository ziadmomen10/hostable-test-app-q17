import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

const FUNCTIONS_PATH = '/home/deno/functions'

// Read env vars in the main isolate (which has access) and pass to workers.
// Edge-runtime sandboxes worker isolates so they only see SB_EXECUTION_ID.
// The main service runs outside the sandbox and can read Docker env vars.
const ENV_KEYS = [
  'OPENAI_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY',
  'AUTH_JWT_SECRET',
  'SUPABASE_PUBLIC_URL',
  'ALLOWED_ORIGIN',
]

const workerEnvPairs: [string, string][] = []
for (const key of ENV_KEYS) {
  const val = Deno.env.get(key)
  if (val) workerEnvPairs.push([key, val])
}

// AI translation functions need longer timeouts
const LONG_TIMEOUT_FUNCTIONS = new Set([
  'ai-translate',
  'ai-translate-batch',
  'seo-ai-tools',
  'analyze-competitor',
])

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const parts = url.pathname.split('/').filter(Boolean)
  const funcIndex = parts.indexOf('v1')
  const funcName = funcIndex !== -1 ? parts[funcIndex + 1] : parts[parts.length - 1]

  if (!funcName || funcName === '_shared') {
    return new Response(
      JSON.stringify({ error: 'Function name required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const timeoutMs = LONG_TIMEOUT_FUNCTIONS.has(funcName) ? 120_000 : 30_000
  const memMb = LONG_TIMEOUT_FUNCTIONS.has(funcName) ? 256 : 150

  try {
    const worker = await EdgeRuntime.userWorkers.create({
      servicePath: `${FUNCTIONS_PATH}/${funcName}`,
      memoryLimitMb: memMb,
      workerTimeoutMs: timeoutMs,
      envVars: workerEnvPairs,
    })
    return await worker.fetch(req)
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)
    console.error(`Function ${funcName} error:`, error)
    return new Response(
      JSON.stringify({ error: `Function '${funcName}' not found or failed`, detail: error }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
