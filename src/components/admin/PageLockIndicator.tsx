import React, { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, UserCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface PageLockIndicatorProps {
  pageId: string;
  currentUserId?: string;
  currentUsername?: string;
  onLockAcquired?: () => void;
  onLockDenied?: (lockedBy: string) => void;
}

interface LockState {
  isLocked: boolean;
  lockedByMe: boolean;
  lockedByUsername: string | null;
  lockedAt: string | null;
}

export const PageLockIndicator: React.FC<PageLockIndicatorProps> = ({
  pageId,
  currentUserId,
  currentUsername = 'Unknown User',
  onLockAcquired,
  onLockDenied
}) => {
  const [lockState, setLockState] = useState<LockState>({
    isLocked: false,
    lockedByMe: false,
    lockedByUsername: null,
    lockedAt: null
  });
  const [acquiring, setAcquiring] = useState(false);

  const checkLock = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from('page_locks')
        .select('*')
        .eq('page_id', pageId)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setLockState({
          isLocked: true,
          lockedByMe: data.locked_by === currentUserId,
          lockedByUsername: data.locked_by_username,
          lockedAt: data.locked_at
        });

        if (data.locked_by !== currentUserId) {
          onLockDenied?.(data.locked_by_username || 'Another user');
        }
      } else {
        setLockState({
          isLocked: false,
          lockedByMe: false,
          lockedByUsername: null,
          lockedAt: null
        });
      }
    } catch (error) {
      console.error('Error checking lock:', error);
    }
  }, [pageId, currentUserId, onLockDenied]);

  const acquireLock = async () => {
    if (!currentUserId) return;
    
    setAcquiring(true);
    try {
      const { data, error } = await supabase.rpc('acquire_page_lock', {
        p_page_id: pageId,
        p_user_id: currentUserId,
        p_username: currentUsername
      });

      if (error) throw error;

      const result = data?.[0];
      if (result?.success) {
        setLockState({
          isLocked: true,
          lockedByMe: true,
          lockedByUsername: currentUsername,
          lockedAt: new Date().toISOString()
        });
        onLockAcquired?.();
      } else {
        setLockState({
          isLocked: true,
          lockedByMe: false,
          lockedByUsername: result?.locked_by_username || 'Another user',
          lockedAt: result?.locked_at || null
        });
        onLockDenied?.(result?.locked_by_username || 'Another user');
      }
    } catch (error) {
      console.error('Error acquiring lock:', error);
    } finally {
      setAcquiring(false);
    }
  };

  const releaseLock = async () => {
    if (!currentUserId) return;

    try {
      await supabase.rpc('release_page_lock', {
        p_page_id: pageId,
        p_user_id: currentUserId
      });

      setLockState({
        isLocked: false,
        lockedByMe: false,
        lockedByUsername: null,
        lockedAt: null
      });
    } catch (error) {
      console.error('Error releasing lock:', error);
    }
  };

  // Refresh lock periodically
  useEffect(() => {
    if (lockState.lockedByMe) {
      const interval = setInterval(acquireLock, 3 * 60 * 1000); // Refresh every 3 minutes
      return () => clearInterval(interval);
    }
  }, [lockState.lockedByMe]);

  // Check lock on mount
  useEffect(() => {
    checkLock();
  }, [checkLock]);

  // Release lock on unmount
  useEffect(() => {
    return () => {
      if (lockState.lockedByMe) {
        releaseLock();
      }
    };
  }, [lockState.lockedByMe]);

  // Subscribe to lock changes
  useEffect(() => {
    const channel = supabase
      .channel(`page_lock_${pageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_locks',
          filter: `page_id=eq.${pageId}`
        },
        () => {
          checkLock();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pageId, checkLock]);

  if (!lockState.isLocked) {
    return (
      <Badge 
        variant="outline" 
        className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-pointer"
        onClick={acquireLock}
      >
        <Unlock className="h-3 w-3 mr-1" />
        Not locked
      </Badge>
    );
  }

  if (lockState.lockedByMe) {
    return (
      <Badge 
        variant="outline" 
        className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
      >
        <Lock className="h-3 w-3 mr-1" />
        Editing (you)
      </Badge>
    );
  }

  return (
    <Alert variant="destructive" className="py-2">
      <div className="flex items-center justify-between">
        <AlertDescription className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span>
            Locked by <strong>{lockState.lockedByUsername}</strong>
            {lockState.lockedAt && (
              <span className="text-xs ml-1">
                ({formatDistanceToNow(new Date(lockState.lockedAt), { addSuffix: true })})
              </span>
            )}
          </span>
        </AlertDescription>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={checkLock}
          disabled={acquiring}
        >
          <RefreshCw className={`h-4 w-4 ${acquiring ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </Alert>
  );
};

export default PageLockIndicator;
