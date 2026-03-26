/**
 * PreviewModeSelector
 * 
 * Toggle between Page, SERP, Social, and AI preview modes.
 */

import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Monitor, Search, Share2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PreviewMode = 'page' | 'serp' | 'social' | 'ai';

interface PreviewModeSelectorProps {
  mode: PreviewMode;
  onChange: (mode: PreviewMode) => void;
  className?: string;
}

export function PreviewModeSelector({ mode, onChange, className }: PreviewModeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ToggleGroup 
        type="single" 
        value={mode} 
        onValueChange={(value) => value && onChange(value as PreviewMode)}
        className={cn("bg-background/80 backdrop-blur-sm rounded-lg border p-1", className)}
      >
        <ToggleGroupItem 
          value="page" 
          aria-label="Page preview"
          className="gap-1.5 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Monitor className="h-4 w-4" />
          <span className="text-xs font-medium">Page</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="serp" 
          aria-label="SERP preview"
          className="gap-1.5 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Search className="h-4 w-4" />
          <span className="text-xs font-medium">SERP</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="social" 
          aria-label="Social preview"
          className="gap-1.5 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-xs font-medium">Social</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="ai" 
          aria-label="AI Search preview"
          className="gap-1.5 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-medium">AI</span>
        </ToggleGroupItem>
      </ToggleGroup>
      {/* Gap 3.3: Keyboard shortcut hint */}
      <span className="text-[9px] text-muted-foreground">⌘P to cycle</span>
    </div>
  );
}
