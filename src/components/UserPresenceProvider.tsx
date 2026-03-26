import React from 'react';
import { useUserPresence } from '@/hooks/useUserPresence';

// This component just initializes the presence tracking
export const UserPresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize presence tracking
  useUserPresence();
  
  // Just return the children, the hook does all the work
  return <>{children}</>;
};

export default UserPresenceProvider;