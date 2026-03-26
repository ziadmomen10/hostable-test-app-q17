/**
 * EditorLoadingState Component
 * 
 * Loading states for various editor components.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface EditorLoadingStateProps {
  message?: string;
  className?: string;
}

export const EditorLoadingState: React.FC<EditorLoadingStateProps> = ({
  message = 'Loading editor...',
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center h-full min-h-[400px] gap-4', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export const ToolbarSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-2 border-b bg-background">
      <div className="flex items-center gap-1">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <div className="h-6 w-px bg-border mx-2" />
      <div className="flex items-center gap-1">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <div className="flex-1" />
      <Skeleton className="h-8 w-24 rounded" />
    </div>
  );
};

export const CanvasSkeleton: React.FC = () => {
  return (
    <div className="h-full w-full bg-muted/30 flex items-center justify-center">
      <div className="space-y-4 w-full max-w-3xl p-8">
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
};

export const SidePanelSkeleton: React.FC = () => {
  return (
    <div className="w-72 border-r bg-card p-4 space-y-4 h-full">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
      </div>
      <Skeleton className="h-6 w-24 mt-4" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-full rounded" />
        <Skeleton className="h-8 w-full rounded" />
        <Skeleton className="h-8 w-full rounded" />
        <Skeleton className="h-8 w-full rounded" />
      </div>
    </div>
  );
};

export default EditorLoadingState;
