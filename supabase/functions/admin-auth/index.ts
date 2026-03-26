// Admin authentication edge function with rate limiting and validation
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminAuthRequest {
  userId?: string;
  action?: string;
}

interface AdminAuthResponse {
  isAdmin?: boolean;
  error?: string;
  status?: string;
  service?: string;
  timestamp?: string;
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (identifier: string, maxRequests = 100, windowMs = 60000): boolean => {
  const now = Date.now();
  const key = identifier;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count += 1;
  return true;
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body for POST requests, default to empty object for GET
    let body: AdminAuthRequest = {};
    if (req.method === 'POST') {
      try {
        body = await req.json();
      } catch (e) {
        console.log('No JSON body provided, treating as health check');
      }
    }

    // Handle health check requests (for system status monitoring)
    if (req.method === 'GET' || body.action === 'health-check') {
      console.log('Health check request received');
      return new Response(
        JSON.stringify({ 
          status: 'healthy',
          service: 'admin-auth',
          timestamp: new Date().toISOString()
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // For admin authentication checks, we need proper auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'Missing authorization' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Set the auth for this request
    supabaseClient.auth.setSession({
      access_token: authHeader.replace('Bearer ', ''),
      refresh_token: '',
    });

    // Get user from the token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Invalid user token:', userError);
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'Invalid token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Rate limiting based on user ID
    if (!checkRateLimit(user.id, 100, 60000)) {
      console.warn(`Rate limit exceeded for user: ${user.id}`);
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'Rate limit exceeded' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Input validation for POST requests with userId
    if (body.userId) {
      if (typeof body.userId !== 'string') {
        console.error('Invalid request body:', body);
        return new Response(
          JSON.stringify({ isAdmin: false, error: 'Invalid request data' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Ensure user can only check their own admin status
      if (body.userId !== user.id) {
        console.error(`User ${user.id} attempted to check admin status for ${body.userId}`);
        return new Response(
          JSON.stringify({ isAdmin: false, error: 'Unauthorized' }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Check admin status from profiles table
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('roles')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'Profile not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const isAdmin = profile?.roles?.includes('admin') || false;

    console.log(`Admin check for user ${user.id}: ${isAdmin}`);

    const response: AdminAuthResponse = {
      isAdmin,
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error in admin-auth function:', error);
    return new Response(
      JSON.stringify({ isAdmin: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});