/**
 * ShadowPresetPicker
 * 
 * Simple shadow preset selector with visual previews.
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ShadowPreset } from '@/types/elementSettings';

interface ShadowPresetPickerProps {
  value: ShadowPreset | undefined;
  onChange: (value: ShadowPreset) => void;
  label?: string;
  className?: string;
}

const shadowOptions: { value: ShadowPreset; label: string; preview: string }[] = [
  { value: 'none', label: 'None', preview: 'shadow-none' },
  { value: 'sm', label: 'SM', preview: 'shadow-sm' },
  { value: 'md', label: 'MD', preview: 'shadow-md' },
  { value: 'lg', label: 'LG', preview: 'shadow-lg' },
  { value: 'xl', label: 'XL', preview: 'shadow-xl' },
  { value: '2xl', label: '2XL', preview: 'shadow-2xl' },
];

export function ShadowPresetPicker({
  value,
  onChange,
  label,
  className,
}: ShadowPresetPickerProps) {
  const currentValue = value || 'none';
  
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className="text-xs font-medium">{label}</Label>
      )}
      
      <div className="grid grid-cols-6 gap-2">
        {shadowOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded border transition-all',
              currentValue === option.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
            onClick={() => onChange(option.value)}
          >
            <div 
              className={cn(
                'w-6 h-6 rounded bg-card',
                option.preview
              )}
            />
            <span className="text-[10px] text-muted-foreground">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ShadowPresetPicker;
