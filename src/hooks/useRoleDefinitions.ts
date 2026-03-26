import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RoleDefinition {
  id: string;
  role_key: string;
  label: string;
  description: string | null;
  grants_admin_access: boolean;
  is_active: boolean;
  sort_order: number;
}

// In-memory cache shared across hook instances
let cachedRoles: RoleDefinition[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

export const useRoleDefinitions = (activeOnly = true) => {
  const [roles, setRoles] = useState<RoleDefinition[]>(cachedRoles || []);
  const [loading, setLoading] = useState(!cachedRoles);

  useEffect(() => {
    const now = Date.now();
    if (cachedRoles && now - cacheTimestamp < CACHE_TTL) {
      const filtered = activeOnly ? cachedRoles.filter(r => r.is_active) : cachedRoles;
      setRoles(filtered);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('role_definitions')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;

        const allRoles = (data || []) as RoleDefinition[];
        cachedRoles = allRoles;
        cacheTimestamp = Date.now();

        setRoles(activeOnly ? allRoles.filter(r => r.is_active) : allRoles);
      } catch (err) {
        console.error('Error fetching role definitions:', err);
        // Fallback to hardcoded if table doesn't exist yet
        const fallback: RoleDefinition[] = [
          { id: '1', role_key: 'admin', label: 'Admin', description: null, grants_admin_access: true, is_active: true, sort_order: 1 },
          { id: '2', role_key: 'seo_manager', label: 'SEO Manager', description: null, grants_admin_access: true, is_active: true, sort_order: 2 },
          { id: '3', role_key: 'content_writer', label: 'Content Writer', description: null, grants_admin_access: true, is_active: true, sort_order: 3 },
          { id: '4', role_key: 'manager', label: 'Manager', description: null, grants_admin_access: true, is_active: true, sort_order: 4 },
          { id: '5', role_key: 'user', label: 'User', description: null, grants_admin_access: false, is_active: true, sort_order: 5 },
        ];
        setRoles(activeOnly ? fallback.filter(r => r.is_active) : fallback);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [activeOnly]);

  const adminRoleKeys = roles.filter(r => r.grants_admin_access).map(r => r.role_key);

  const invalidateCache = () => {
    cachedRoles = null;
    cacheTimestamp = 0;
  };

  return { roles, adminRoleKeys, loading, invalidateCache };
};
