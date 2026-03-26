// Configuration management
export const config = {
  // Admin hash path - uses env var with fallback
  adminHashPath: import.meta.env.VITE_ADMIN_HASH_PATH ?? 'a93jf02kd92ms71x8qp4',
  
  // API configuration
  api: {
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 30000,
  },
  
  // Rate limiting
  rateLimiting: {
    maxRequestsPerMinute: 60,
    maxRequestsPerHour: 1000,
  },
  
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://hkfjyktrgcxkxzdxxatx.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZmp5a3RyZ2N4a3h6ZHh4YXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTU1OTAsImV4cCI6MjA2OTk3MTU5MH0.7l_j4sixljf5cbATgPn0JUyiMYn3HHDLAIDXX2PcJpI",
  },
};
