import React from 'react';

const ROLE_BG: Record<string, string> = {
  admin: 'bg-red-500/20 text-red-400',
  seo_manager: 'bg-blue-500/20 text-blue-400',
  content_writer: 'bg-green-500/20 text-green-400',
  manager: 'bg-purple-500/20 text-purple-400',
};

interface UserAvatarProps {
  username: string | null;
  role?: string;
  size?: 'sm' | 'md';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ username, role, size = 'sm' }) => {
  const initials = (username || 'U').slice(0, 2).toUpperCase();
  const bg = ROLE_BG[role || ''] || 'bg-muted text-muted-foreground';
  const sizeClass = size === 'md' ? 'w-12 h-12 text-lg' : 'w-8 h-8 text-xs';

  return (
    <div className={`${sizeClass} rounded-full ${bg} flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
};

export default UserAvatar;
