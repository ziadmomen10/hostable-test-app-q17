/**
 * LinkSettings
 * 
 * Reusable link configuration with URL input and new tab toggle.
 */

import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import type { LinkConfig } from '@/types/elementSettings';

interface LinkSettingsProps {
  value: LinkConfig | undefined;
  onChange: (value: LinkConfig | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function LinkSettings({
  value,
  onChange,
  label = 'Link',
  placeholder = 'https://example.com',
  className,
}: LinkSettingsProps) {
  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (!url) {
      onChange(undefined);
    } else {
      onChange({ url, newTab: value?.newTab || false });
    }
  }, [value, onChange]);
  
  const handleNewTabChange = useCallback((checked: boolean) => {
    if (!value?.url) return;
    onChange({ ...value, newTab: checked });
  }, [value, onChange]);
  
  return (
    <div className={cn('space-y-3', className)}>
      {/* URL Input */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{label}</Label>
        <div className="relative">
          <Input
            type="url"
            value={value?.url || ''}
            onChange={handleUrlChange}
            placeholder={placeholder}
            className="text-xs h-8 pr-8"
          />
          {value?.url && (
            <a 
              href={value.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
      
      {/* New Tab Toggle */}
      {value?.url && (
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Open in new tab</Label>
          <Switch
            checked={value.newTab || false}
            onCheckedChange={handleNewTabChange}
            className="scale-75"
          />
        </div>
      )}
    </div>
  );
}

export default LinkSettings;
