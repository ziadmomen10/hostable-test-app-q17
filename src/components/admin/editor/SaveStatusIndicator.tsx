/**
 * SaveStatusIndicator Component
 * 
 * Displays the current autosave status with appropriate icons and colors.
 * States: idle, saving, saved, error
 */

import React, { memo } from 'react';
import { Check, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SaveStatus } from '@/hooks/queries';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  className?: string;
}

const statusConfigs = {
  idle: { 
    icon: Cloud, 
    text: 'Ready', 
    color: 'text-muted-foreground',
    animate: false 
  },
  saving: { 
    icon: Loader2, 
    text: 'Saving...', 
    color: 'text-blue-500',
    animate: true 
  },
  saved: { 
    icon: Check, 
    text: 'Saved', 
    color: 'text-green-500',
    animate: false 
  },
  error: { 
    icon: CloudOff, 
    text: 'Save failed', 
    color: 'text-destructive',
    animate: false 
  },
} as const;

export const SaveStatusIndicator = memo<SaveStatusIndicatorProps>(({ status, className }) => {
  const config = statusConfigs[status];
  const Icon = config.icon;
  
  return (
    <div className={cn('flex items-center gap-1.5 text-xs', config.color, className)}>
      <Icon className={cn('h-3.5 w-3.5', config.animate && 'animate-spin')} />
      <span>{config.text}</span>
    </div>
  );
});

SaveStatusIndicator.displayName = 'SaveStatusIndicator';

export default SaveStatusIndicator;
