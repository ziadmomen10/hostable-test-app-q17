import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get('ALLOWED_ORIGIN') ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LinkCheckResult {
  url: string;
  status: number;
  statusText: string;
  isOk: boolean;
  isBroken: boolean;
  isAccessDenied: boolean;
  isRedirect: boolean;
  redirectCount: number;
  finalUrl: string;
}

// Browser-like user agent to avoid bot blocking
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      throw new Error("URLs array is required");
    }

    console.log("[seo-check-links] Checking", urls.length, "URLs");

    const results: LinkCheckResult[] = [];
    
    // Check each URL (limit to 20 to prevent timeout)
    const urlsToCheck = urls.slice(0, 20);
    
    for (const url of urlsToCheck) {
      try {
        const result = await checkUrl(url);
        results.push(result);
      } catch (error) {
        console.error(`[seo-check-links] Error checking ${url}:`, error);
        results.push({
          url,
          status: 0,
          statusText: error instanceof Error ? error.message : 'Unknown error',
          isOk: false,
          isBroken: true,
          isAccessDenied: false,
          isRedirect: false,
          redirectCount: 0,
          finalUrl: url,
        });
      }
    }

    const summary = {
      total: results.length,
      ok: results.filter(r => r.isOk).length,
      broken: results.filter(r => r.isBroken).length,
      accessDenied: results.filter(r => r.isAccessDenied).length,
      redirects: results.filter(r => r.isRedirect).length,
    };

    console.log("[seo-check-links] Completed:", summary);

    return new Response(JSON.stringify({ results, summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[seo-check-links] Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function checkUrl(url: string): Promise<LinkCheckResult> {
  // Normalize URL
  let fullUrl = url;
  if (url.startsWith('/')) {
    // Internal URL - can't check without base URL, mark as needs-check
    return {
      url,
      status: 0,
      statusText: 'Internal path - requires base URL',
      isOk: true, // Assume internal paths are OK
      isBroken: false,
      isAccessDenied: false,
      isRedirect: false,
      redirectCount: 0,
      finalUrl: url,
    };
  }

  if (!url.startsWith('http')) {
    fullUrl = `https://${url}`;
  }

  let redirectCount = 0;
  let currentUrl = fullUrl;
  let finalResponse: Response | null = null;

  // Follow redirects manually to count them
  const maxRedirects = 10;
  
  while (redirectCount < maxRedirects) {
    try {
      const response = await fetch(currentUrl, {
        method: 'HEAD',
        redirect: 'manual',
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });

      finalResponse = response;

      // Check for redirect
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (location) {
          redirectCount++;
          // Handle relative redirects
          if (location.startsWith('/')) {
            const urlObj = new URL(currentUrl);
            currentUrl = `${urlObj.origin}${location}`;
          } else if (!location.startsWith('http')) {
            currentUrl = `${currentUrl}/${location}`;
          } else {
            currentUrl = location;
          }
          continue;
        }
      }
      
      break;
    } catch (fetchError) {
      // Try GET if HEAD fails
      try {
        const response = await fetch(currentUrl, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent': USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          },
        });
        finalResponse = response;
        break;
      } catch {
        throw fetchError;
      }
    }
  }

  if (!finalResponse) {
    throw new Error('Failed to fetch URL');
  }

  const status = finalResponse.status;
  const isAccessDenied = status === 403;
  const isOk = status >= 200 && status < 400;
  // 403 is NOT considered broken - it's access denied (bot blocked)
  const isBroken = status >= 400 && status !== 403;
  const isRedirect = redirectCount > 0;

  return {
    url,
    status,
    statusText: isAccessDenied 
      ? 'Access Denied (site blocks bots)' 
      : finalResponse.statusText || getStatusText(status),
    isOk,
    isBroken,
    isAccessDenied,
    isRedirect,
    redirectCount,
    finalUrl: currentUrl,
  };
}

function getStatusText(status: number): string {
  const texts: Record<number, string> = {
    200: 'OK',
    301: 'Moved Permanently',
    302: 'Found',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Access Denied',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  };
  return texts[status] || 'Unknown';
}
