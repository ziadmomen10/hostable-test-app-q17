/**
 * SEOOverlayKeyboardHelp
 * 
 * Modal/popover showing available keyboard shortcuts for the overlay.
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SEOOverlayKeyboardHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS = [
  { category: 'Global', items: [
    { key: '⌘S', description: 'Save changes' },
    { key: '⌘1-7', description: 'Switch tabs' },
    { key: '⌘P', description: 'Cycle preview mode' },
    { key: '⌘[', description: 'Toggle left panel' },
    { key: '⌘]', description: 'Toggle right panel' },
  ]},
  { category: 'Overlay Toggle', items: [
    { key: 'O', description: 'Toggle overlay on/off' },
    { key: 'Esc', description: 'Close overlay' },
    { key: 'R', description: 'Re-scan overlay highlights' },
    { key: '⌘R', description: 'Re-analyze page scores' },
  ]},
  { category: 'Filters', items: [
    { key: '1', description: 'Toggle H1' },
    { key: '2', description: 'Toggle H2-H6' },
    { key: '3', description: 'Toggle Images' },
    { key: '4', description: 'Toggle Internal Links' },
    { key: '5', description: 'Toggle External Links' },
    { key: '6', description: 'Toggle Schema' },
    { key: '7', description: 'Toggle Meta Tags' },
    { key: '8', description: 'Toggle Accessibility' },
  ]},
  { category: 'Special', items: [
    { key: 'I', description: 'Toggle "Issues Only" mode' },
    { key: 'K', description: 'Toggle "Keyword Focus" mode' },
    { key: '?', description: 'Show this help' },
  ]},
];

export function SEOOverlayKeyboardHelp({ open, onOpenChange }: SEOOverlayKeyboardHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            SEO Overlay Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          {SHORTCUTS.map(group => (
            <div key={group.category}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.category}
              </h4>
              <div className="grid grid-cols-2 gap-1">
                {group.items.map(shortcut => (
                  <div 
                    key={shortcut.key}
                    className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/50"
                  >
                    <span className="text-xs text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <kbd className={cn(
                      "ml-2 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded",
                      "bg-background border shadow-sm"
                    )}>
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-[10px] text-muted-foreground text-center mt-4">
          Shortcuts work when the preview is focused
        </p>
      </DialogContent>
    </Dialog>
  );
}
