/**
 * BorderSettings
 * 
 * Reusable border configuration component with width, color, style, and radius.
 */

import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ColorPickerPopover } from './ColorPickerPopover';
import type { BorderStyle } from '@/types/elementSettings';

interface BorderSettingsProps {
  value: BorderStyle | undefined;
  onChange: (value: BorderStyle) => void;
  label?: string;
  showRadius?: boolean;
  className?: string;
}

const borderStyles = [
  { value: 'none', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
];

const radiusPresets = [
  { value: '0', label: 'None' },
  { value: '4px', label: 'SM' },
  { value: '8px', label: 'MD' },
  { value: '12px', label: 'LG' },
  { value: '16px', label: 'XL' },
  { value: '9999px', label: 'Full' },
];

export function BorderSettings({
  value,
  onChange,
  label,
  showRadius = true,
  className,
}: BorderSettingsProps) {
  const currentBorder = value || { style: 'none', width: '0', color: 'transparent', radius: '0' };
  
  const handleChange = useCallback((field: keyof BorderStyle, newValue: string) => {
    onChange({ ...currentBorder, [field]: newValue });
  }, [currentBorder, onChange]);
  
  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <Label className="text-xs font-medium">{label}</Label>
      )}
      
      {/* Border Style */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Style</Label>
        <Select
          value={currentBorder.style || 'none'}
          onValueChange={(v) => handleChange('style', v)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {borderStyles.map((style) => (
              <SelectItem key={style.value} value={style.value} className="text-xs">
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Only show other options if style is not 'none' */}
      {currentBorder.style !== 'none' && (
        <>
          {/* Border Width */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Width</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[parseInt(currentBorder.width || '0')]}
                onValueChange={([v]) => handleChange('width', `${v}px`)}
                min={0}
                max={10}
                step={1}
                className="flex-1"
              />
              <Input
                type="text"
                value={currentBorder.width || '0'}
                onChange={(e) => handleChange('width', e.target.value)}
                className="w-16 h-7 text-xs text-center"
              />
            </div>
          </div>
          
          {/* Border Color */}
          <ColorPickerPopover
            label="Color"
            value={currentBorder.color || 'hsl(var(--border))'}
            onChange={(color) => handleChange('color', color)}
          />
        </>
      )}
      
      {/* Border Radius (always shown) */}
      {showRadius && (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Border Radius</Label>
          <div className="flex flex-wrap gap-1">
            {radiusPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={cn(
                  'h-7 px-2 text-xs rounded border transition-colors',
                  currentBorder.radius === preset.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-muted'
                )}
                onClick={() => handleChange('radius', preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <Input
            type="text"
            value={currentBorder.radius || '0'}
            onChange={(e) => handleChange('radius', e.target.value)}
            placeholder="Custom (e.g., 8px)"
            className="h-7 text-xs mt-1"
          />
        </div>
      )}
    </div>
  );
}

export default BorderSettings;
