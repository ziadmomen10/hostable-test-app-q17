import React from 'react';
import { cn } from '@/lib/utils';

interface KbdProps {
  children?: React.ReactNode;
  keys?: string[];
  className?: string;
}

/**
 * Single keyboard key display
 */
export const Kbd: React.FC<KbdProps> = ({ children, keys, className }) => {
  // Map common key names to symbols
  const formatKey = (key: string): string => {
    const keyMap: Record<string, string> = {
      'cmd': '⌘',
      'command': '⌘',
      'ctrl': 'Ctrl',
      'control': 'Ctrl',
      'alt': 'Alt',
      'option': '⌥',
      'shift': '⇧',
      'enter': '↵',
      'return': '↵',
      'tab': '⇥',
      'escape': 'Esc',
      'esc': 'Esc',
      'backspace': '⌫',
      'delete': 'Del',
      'space': 'Space',
      'up': '↑',
      'down': '↓',
      'left': '←',
      'right': '→',
    };
    
    return keyMap[key.toLowerCase()] || key;
  };

  if (keys && keys.length > 0) {
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <kbd
              className={cn(
                "inline-flex items-center justify-center",
                "min-w-[1.75rem] h-6 px-1.5",
                "text-xs font-mono font-medium",
                "bg-muted border border-border rounded-md",
                "shadow-[0_1px_0_1px_hsl(var(--border))]",
                "text-muted-foreground"
              )}
            >
              {formatKey(key)}
            </kbd>
            {index < keys.length - 1 && (
              <span className="text-muted-foreground/50 text-xs mx-0.5">
                +
              </span>
            )}
          </React.Fragment>
        ))}
      </span>
    );
  }

  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-[1.75rem] h-6 px-1.5",
        "text-xs font-mono font-medium",
        "bg-muted border border-border rounded-md",
        "shadow-[0_1px_0_1px_hsl(var(--border))]",
        "text-muted-foreground",
        className
      )}
    >
      {children}
    </kbd>
  );
};

// Alternative export name for clarity
export const DocKeyboardShortcut = Kbd;

export default Kbd;
