import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import maleAvatar from '@/assets/male-avatar.png';
import femaleAvatar from '@/assets/female-avatar.svg';

interface UserProfile {
  username: string;
  email: string | null;
  gender: 'male' | 'female';
  profile_picture_url: string | null;
  roles: string[];
}

export const useCurrentUserProfile = () => {
  const { user, userRoles } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    username: user?.user_metadata?.username || 'User',
    email: null,
    gender: 'male',
    profile_picture_url: null,
    roles: userRoles
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, email, gender, profile_picture_url, roles')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else if (data) {
          setProfile({
            username: data.username || user?.user_metadata?.username || 'User',
            email: data.email,
            gender: (data.gender as 'male' | 'female') || 'male',
            profile_picture_url: data.profile_picture_url,
            roles: data.roles || userRoles
          });
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, userRoles]);

  const getAvatarSrc = () => {
    if (profile.profile_picture_url) {
      return profile.profile_picture_url;
    }
    return profile.gender === 'female' ? femaleAvatar : maleAvatar;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const refreshProfile = () => {
    if (user?.id) {
      const fetchUserProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('username, email, gender, profile_picture_url, roles')
            .eq('user_id', user.id)
            .single();

          if (!error && data) {
            setProfile({
              username: data.username || user?.user_metadata?.username || 'User',
              email: data.email,
              gender: (data.gender as 'male' | 'female') || 'male',
              profile_picture_url: data.profile_picture_url,
              roles: data.roles || userRoles
            });
          }
        } catch (error) {
          console.error('Error refreshing profile:', error);
        }
      };
      fetchUserProfile();
    }
  };

  return {
    profile,
    loading,
    getAvatarSrc,
    getInitials,
    refreshProfile
  };
};