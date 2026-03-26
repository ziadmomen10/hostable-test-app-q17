// API Types and interfaces
import type { User, Session } from '@supabase/supabase-js';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  roles: string[];
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminConfig {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

// Function invoke response types
export interface FunctionResponse<T = any> {
  data: T;
  error: string | null;
}

// Rate limiting and retry configuration
export interface RequestConfig {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}