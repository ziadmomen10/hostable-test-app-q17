// Centralized API wrapper for all backend calls
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse, RequestConfig, FunctionResponse, UserProfile, AdminConfig } from './types';

// Default configuration
const DEFAULT_CONFIG: RequestConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
};

// Logging utility
const logRequest = (method: string, endpoint: string, data?: any) => {
  console.log(`[API] ${method} ${endpoint}`, data ? { data } : '');
};

const logResponse = (method: string, endpoint: string, response: any) => {
  console.log(`[API] ${method} ${endpoint} response:`, response);
};

const logError = (method: string, endpoint: string, error: any) => {
  console.error(`[API] ${method} ${endpoint} error:`, error);
};

// Retry utility
const retry = async <T>(
  fn: () => Promise<T>,
  config: RequestConfig = DEFAULT_CONFIG
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i < (config.maxRetries || 3); i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < (config.maxRetries || 3) - 1) {
        await new Promise(resolve => setTimeout(resolve, config.retryDelay || 1000));
      }
    }
  }
  
  throw lastError;
};

// Database API wrappers
export const db = {
  // Profiles
  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      logRequest('GET', 'profiles', { userId });
      
      const result = await retry(async () => {
        const response = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        return response;
      });
      
      logResponse('GET', 'profiles', result);
      
      if (result.error) {
        return { success: false, error: result.error.message };
      }
      
      return { success: true, data: result.data };
    } catch (error: any) {
      logError('GET', 'profiles', error);
      return { success: false, error: error.message || 'Failed to get profile' };
    }
  },

  async createProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<UserProfile>> {
    try {
      logRequest('POST', 'profiles', profile);
      
      const result = await retry(async () => {
        const response = await supabase
          .from('profiles')
          .insert(profile)
          .select()
          .single();
        return response;
      });
      
      logResponse('POST', 'profiles', result);
      
      if (result.error) {
        return { success: false, error: result.error.message };
      }
      
      return { success: true, data: result.data };
    } catch (error: any) {
      logError('POST', 'profiles', error);
      return { success: false, error: error.message || 'Failed to create profile' };
    }
  },

  // Admin config
  async getAdminConfig(key: string): Promise<ApiResponse<AdminConfig>> {
    try {
      logRequest('GET', 'admin_config', { key });
      
      const result = await retry(async () => {
        const response = await supabase
          .from('admin_config')
          .select('*')
          .eq('key', key)
          .single();
        return response;
      });
      
      logResponse('GET', 'admin_config', result);
      
      if (result.error) {
        return { success: false, error: result.error.message };
      }
      
      return { success: true, data: result.data };
    } catch (error: any) {
      logError('GET', 'admin_config', error);
      return { success: false, error: error.message || 'Failed to get admin config' };
    }
  },
};

// Auth API wrappers
export const auth = {
  async signIn(emailOrUsername: string, password: string): Promise<ApiResponse<{ user: any; session: any }>> {
    try {
      // Map username to email for admin
      const email = emailOrUsername === 'admin' ? 'admin@hostonce.com' : emailOrUsername;
      
      logRequest('POST', 'auth/signin', { originalInput: emailOrUsername, email });
      
      const result = await retry(() =>
        supabase.auth.signInWithPassword({ email, password })
      );
      
      logResponse('POST', 'auth/signin', { success: !result.error });
      
      if (result.error) {
        return { success: false, error: result.error.message };
      }
      
      return { success: true, data: { user: result.data.user, session: result.data.session } };
    } catch (error: any) {
      logError('POST', 'auth/signin', error);
      return { success: false, error: error.message || 'Failed to sign in' };
    }
  },

  async signUp(email: string, password: string): Promise<ApiResponse<{ user: any; session: any }>> {
    try {
      logRequest('POST', 'auth/signup', { email });
      
      const redirectUrl = `${window.location.origin}/`;
      
      const result = await retry(() =>
        supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        })
      );
      
      logResponse('POST', 'auth/signup', { success: !result.error });
      
      if (result.error) {
        return { success: false, error: result.error.message };
      }
      
      return { success: true, data: { user: result.data.user, session: result.data.session } };
    } catch (error: any) {
      logError('POST', 'auth/signup', error);
      return { success: false, error: error.message || 'Failed to sign up' };
    }
  },

  async signOut(): Promise<ApiResponse<void>> {
    try {
      logRequest('POST', 'auth/signout', {});
      
      const result = await retry(() => supabase.auth.signOut());
      
      logResponse('POST', 'auth/signout', { success: !result.error });
      
      if (result.error) {
        return { success: false, error: result.error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      logError('POST', 'auth/signout', error);
      return { success: false, error: error.message || 'Failed to sign out' };
    }
  },

  async getSession(): Promise<ApiResponse<any>> {
    try {
      const result = await supabase.auth.getSession();
      
      if (result.error) {
        return { success: false, error: result.error.message };
      }
      
      return { success: true, data: result.data.session };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to get session' };
    }
  },
};

// Functions API wrapper
export const functions = {
  async invoke<T = any>(
    functionName: string,
    payload?: any,
    config?: RequestConfig
  ): Promise<FunctionResponse<T>> {
    try {
      logRequest('POST', `functions/${functionName}`, payload);
      
      const result = await retry(() =>
        supabase.functions.invoke(functionName, {
          body: payload,
        }),
        config
      );
      
      logResponse('POST', `functions/${functionName}`, result);
      
      return {
        data: result.data,
        error: result.error?.message || null,
      };
    } catch (error: any) {
      logError('POST', `functions/${functionName}`, error);
      return {
        data: null,
        error: error.message || 'Function invocation failed',
      };
    }
  },
};

// Centralized API object
export const api = {
  db,
  auth,
  functions,
};