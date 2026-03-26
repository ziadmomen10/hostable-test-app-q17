/**
 * CTAButtonSettings
 * 
 * Reusable CTA button configuration component.
 * Used by Hero, CTA, Features, and other sections with call-to-action buttons.
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DebouncedInput } from '@/components/ui/debounced-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

interface CTAButtonSettingsProps {
  /** Label for the button group (e.g., "Primary Button", "Secondary Button") */
  label: string;
  /** Button text */
  text: string;
  /** Button URL/link */
  url: string;
  /** Button variant style */
  variant?: ButtonVariant;
  /** Whether to show the visibility toggle */
  showToggle?: boolean;
  /** Whether the button is visible */
  isVisible?: boolean;
  /** Callback for text changes */
  onTextChange: (text: string) => void;
  /** Callback for URL changes */
  onUrlChange: (url: string) => void;
  /** Callback for variant changes */
  onVariantChange?: (variant: ButtonVariant) => void;
  /** Callback for visibility changes */
  onVisibilityChange?: (visible: boolean) => void;
  /** Text placeholder */
  textPlaceholder?: string;
  /** URL placeholder */
  urlPlaceholder?: string;
  /** Custom className */
  className?: string;
}

export function CTAButtonSettings({
  label,
  text,
  url,
  variant,
  showToggle = false,
  isVisible = true,
  onTextChange,
  onUrlChange,
  onVariantChange,
  onVisibilityChange,
  textPlaceholder = 'Button text',
  urlPlaceholder = '/link-url',
  className,
}: CTAButtonSettingsProps) {
  const isDisabled = showToggle && !isVisible;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with optional toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {showToggle && onVisibilityChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Show</span>
            <Switch
              checked={isVisible}
              onCheckedChange={onVisibilityChange}
              className="scale-75"
            />
          </div>
        )}
      </div>

      {/* Button Settings */}
      <div className={cn('space-y-3', isDisabled && 'opacity-50 pointer-events-none')}>
        {/* Button Text */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Text</Label>
          <DebouncedInput
            value={text}
            onChange={onTextChange}
            placeholder={textPlaceholder}
            className="h-9"
            disabled={isDisabled}
          />
        </div>

        {/* Button URL */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Link URL</Label>
          <DebouncedInput
            value={url}
            onChange={onUrlChange}
            placeholder={urlPlaceholder}
            className="h-9"
            disabled={isDisabled}
          />
        </div>

        {/* Button Variant */}
        {onVariantChange && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Style</Label>
            <Select
              value={variant || 'primary'}
              onValueChange={(value) => onVariantChange(value as ButtonVariant)}
              disabled={isDisabled}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary (Solid)</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}

export default CTAButtonSettings;
