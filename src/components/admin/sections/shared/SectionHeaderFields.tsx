/**
 * Reusable section header fields component.
 * Provides consistent badge, title, and subtitle inputs across all section settings.
 * Uses DebouncedInput for better typing performance.
 */

import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface SectionHeaderFieldsProps {
  badge?: string;
  title: string;
  subtitle?: string;
  onBadgeChange?: (value: string) => void;
  onTitleChange: (value: string) => void;
  onSubtitleChange?: (value: string) => void;
  showBadge?: boolean;
  onShowBadgeChange?: (show: boolean) => void;
  badgeLabel?: string;
  titleLabel?: string;
  subtitleLabel?: string;
  titlePlaceholder?: string;
  subtitlePlaceholder?: string;
  titleMaxLength?: number;
  subtitleMaxLength?: number;
  className?: string;
}

export const SectionHeaderFields: React.FC<SectionHeaderFieldsProps> = ({
  badge,
  title,
  subtitle,
  onBadgeChange,
  onTitleChange,
  onSubtitleChange,
  showBadge = true,
  onShowBadgeChange,
  badgeLabel = 'Badge',
  titleLabel = 'Title',
  subtitleLabel = 'Subtitle',
  titlePlaceholder = 'Enter section title',
  subtitlePlaceholder = 'Enter section description',
  titleMaxLength = 100,
  subtitleMaxLength = 300,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Badge field with optional toggle */}
      {onBadgeChange && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="section-badge" className="text-sm font-medium">
              {badgeLabel}
            </Label>
            {onShowBadgeChange && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Show badge</span>
                <Switch
                  checked={showBadge}
                  onCheckedChange={onShowBadgeChange}
                  className="scale-75"
                />
              </div>
            )}
          </div>
          <DebouncedInput
            id="section-badge"
            value={badge || ''}
            onChange={onBadgeChange}
            placeholder="e.g., New, Featured, Best Value"
            disabled={onShowBadgeChange && !showBadge}
            className="h-9"
          />
        </div>
      )}

      {/* Title field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="section-title" className="text-sm font-medium">
            {titleLabel}
          </Label>
          {titleMaxLength && (
            <span className="text-xs text-muted-foreground">
              {title.length}/{titleMaxLength}
            </span>
          )}
        </div>
        <DebouncedInput
          id="section-title"
          value={title}
          onChange={onTitleChange}
          placeholder={titlePlaceholder}
          maxLength={titleMaxLength}
          className="h-9"
        />
      </div>

      {/* Subtitle field */}
      {onSubtitleChange && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="section-subtitle" className="text-sm font-medium">
              {subtitleLabel}
            </Label>
            {subtitleMaxLength && (
              <span className="text-xs text-muted-foreground">
                {(subtitle || '').length}/{subtitleMaxLength}
              </span>
            )}
          </div>
          <DebouncedInput
            id="section-subtitle"
            value={subtitle || ''}
            onChange={onSubtitleChange}
            placeholder={subtitlePlaceholder}
            maxLength={subtitleMaxLength}
            multiline
            rows={3}
          />
        </div>
      )}
    </div>
  );
};
