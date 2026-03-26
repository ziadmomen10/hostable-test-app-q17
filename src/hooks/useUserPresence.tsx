import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface UserPresence {
  user_id: string;
  email?: string;
  online_at: string;
}

export const useUserPresence = () => {
  const [onlineCount, setOnlineCount] = useState(0);
  const { user } = useAuth();
  // Single ref so both the subscription and visibility handler share the same channel object
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!user) return;

    // Create a single channel for this session
    const presenceChannel = supabase.channel('user-presence');
    channelRef.current = presenceChannel;

    // Track presence state changes
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presenceChannel.presenceState();
        logger.presence.debug('Presence sync:', presenceState);
        const userCount = Object.keys(presenceState).length;
        setOnlineCount(userCount);
        logger.presence.debug('Online users count:', userCount);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        logger.presence.debug('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        logger.presence.debug('User left:', key, leftPresences);
      });

    // Subscribe to the channel
    presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        logger.presence.info('Subscribed to presence channel');
        const userPresence: UserPresence = {
          user_id: user.id,
          email: user.email || 'anonymous',
          online_at: new Date().toISOString(),
        };
        const presenceTrackStatus = await presenceChannel.track(userPresence);
        logger.presence.debug('Presence track status:', presenceTrackStatus);
      }
    });

    // Visibility handler uses the same channel ref — no orphaned channels
    const handleVisibilityChange = async () => {
      if (!channelRef.current) return;
      if (document.hidden) {
        logger.presence.debug('Page hidden - untracking presence');
        await channelRef.current.untrack();
      } else {
        logger.presence.debug('Page visible - tracking presence');
        const userPresence: UserPresence = {
          user_id: user.id,
          email: user.email || 'anonymous',
          online_at: new Date().toISOString(),
        };
        await channelRef.current.track(userPresence);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup: remove both the event listener and the channel in one place
    return () => {
      logger.presence.debug('Cleaning up presence channel');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      presenceChannel.untrack();
      supabase.removeChannel(presenceChannel);
      channelRef.current = null;
    };
  }, [user]);

  return {
    onlineCount,
  };
};