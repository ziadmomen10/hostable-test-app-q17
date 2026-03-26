// Hook for managing admin route protection
import { useState, useEffect } from 'react';
import { api } from '@/lib/api/wrapper';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/lib/config';

export const useAdminRoute = () => {
  const [adminPath, setAdminPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchAdminPath = async () => {
      try {
        // Use the configured admin hash path
        setAdminPath(config.adminHashPath);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch admin path:', error);
        setLoading(false);
      }
    };

    fetchAdminPath();
  }, [isAdmin]);

  const isValidAdminPath = (currentPath: string): boolean => {
    if (!adminPath) return false;
    // Allow nested admin paths (e.g., /a93jf02kd92ms71x8qp4/currencies)
    return currentPath.startsWith(`/${adminPath}`);
  };

  return {
    adminPath,
    loading,
    isValidAdminPath,
  };
};