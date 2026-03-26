// Authentication context with RBAC support using proper Supabase Auth
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  rolesLoaded: boolean;
  isAdmin: boolean;
  userRoles: string[];
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata?: { username?: string; gender?: string }) => Promise<{ success: boolean; error?: string; user?: User }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [rolesLoaded, setRolesLoaded] = useState(false);

  // Fetch user roles from user_roles table
  const fetchUserRoles = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return roles?.map(r => r.role) || [];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  };

  const fetchAdminRoleKeys = async (): Promise<string[]> => {
    try {
      const { data, error } = await (supabase as any)
        .from('role_definitions')
        .select('role_key')
        .eq('grants_admin_access', true)
        .eq('is_active', true);
      if (error) throw error;
      return (data || []).map((r: any) => r.role_key);
    } catch {
      // Fallback if table doesn't exist yet
      return ['admin', 'seo_manager', 'content_writer', 'manager'];
    }
  };

  const refreshProfile = async () => {
    if (!user) {
      setIsAdmin(false);
      setUserRoles([]);
      return;
    }

    const roles = await fetchUserRoles(user.id);
    setUserRoles(roles);
    
    const adminRoleKeys = await fetchAdminRoleKeys();
    const hasAdminAccess = roles.some(role => adminRoleKeys.includes(role));
    setIsAdmin(hasAdminAccess);
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer role fetching to avoid deadlock
        if (session?.user) {
          setRolesLoaded(false);
          setTimeout(() => {
            Promise.all([
              fetchUserRoles(session.user.id),
              fetchAdminRoleKeys()
            ]).then(([roles, adminRoleKeys]) => {
              setUserRoles(roles);
              setIsAdmin(roles.some(role => adminRoleKeys.includes(role)));
              setRolesLoaded(true);
            });
          }, 0);
        } else {
          setIsAdmin(false);
          setUserRoles([]);
          setRolesLoaded(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        Promise.all([
          fetchUserRoles(session.user.id),
          fetchAdminRoleKeys()
        ]).then(([roles, adminRoleKeys]) => {
          setUserRoles(roles);
          setIsAdmin(roles.some(role => adminRoleKeys.includes(role)));
          setRolesLoaded(true);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting login');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Login failed. Please try again.' };
      }

      console.log('Login successful');

      // Update last_login in profiles
      try {
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('user_id', data.user.id);
      } catch (updateError) {
        console.error('Error updating last_login:', updateError);
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { username?: string; gender?: string }) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: metadata?.username || email.split('@')[0],
            gender: metadata?.gender || 'male',
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Signup failed. Please try again.' };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setUserRoles([]);
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    rolesLoaded,
    isAdmin,
    userRoles,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
