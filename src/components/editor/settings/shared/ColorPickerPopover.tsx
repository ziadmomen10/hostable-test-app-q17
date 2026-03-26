/**
 * ColorPickerPopover
 * 
 * Reusable color picker with preset colors and custom input.
 * Uses HSL format for consistency with design system.
 */

import React, { useState, useCallback } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Paintbrush, Check } from 'lucide-react';

interface ColorPickerPopoverProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

// Preset colors using semantic tokens where possible
const presetColors = [
  // Primary variants
  { name: 'Primary', value: 'hsl(var(--primary))' },
  { name: 'Secondary', value: 'hsl(var(--secondary))' },
  { name: 'Accent', value: 'hsl(var(--accent))' },
  { name: 'Muted', value: 'hsl(var(--muted))' },
  
  // Neutral colors
  { name: 'Background', value: 'hsl(var(--background))' },
  { name: 'Foreground', value: 'hsl(var(--foreground))' },
  { name: 'Card', value: 'hsl(var(--card))' },
  { name: 'Border', value: 'hsl(var(--border))' },
  
  // Status colors
  { name: 'Success', value: 'hsl(142 76% 36%)' },
  { name: 'Warning', value: 'hsl(38 92% 50%)' },
  { name: 'Error', value: 'hsl(var(--destructive))' },
  
  // Basic colors
  { name: 'White', value: 'hsl(0 0% 100%)' },
  { name: 'Black', value: 'hsl(0 0% 0%)' },
  { name: 'Transparent', value: 'transparent' },
];

export function ColorPickerPopover({
  value,
  onChange,
  label,
  className,
  disabled = false,
}: ColorPickerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value || '');
  
  const handlePresetClick = useCallback((color: string) => {
    onChange(color);
    setCustomColor(color);
  }, [onChange]);
  
  const handleCustomChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
  }, []);
  
  const handleCustomSubmit = useCallback(() => {
    if (customColor) {
      onChange(customColor);
    }
  }, [customColor, onChange]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomSubmit();
    }
  }, [handleCustomSubmit]);
  
  // Get display color for the button
  const displayColor = value || 'transparent';
  const isTransparent = displayColor === 'transparent';
  
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <Label className="text-xs font-medium">{label}</Label>
      )}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 h-9"
            disabled={disabled}
          >
            <div 
              className={cn(
                'w-5 h-5 rounded border border-border shrink-0',
                isTransparent && 'bg-[repeating-conic-gradient(#ccc_0_25%,#fff_0_50%)] bg-[length:8px_8px]'
              )}
              style={{ 
                backgroundColor: isTransparent ? undefined : displayColor,
              }}
            />
            <span className="text-xs truncate flex-1 text-left">
              {value || 'Choose color'}
            </span>
            <Paintbrush className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-64 p-3" align="start">
          {/* Preset Colors Grid */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Preset Colors</Label>
            <div className="grid grid-cols-7 gap-1.5">
              {presetColors.map((preset) => {
                const isSelected = value === preset.value;
                const isPresetTransparent = preset.value === 'transparent';
                
                return (
                  <button
                    key={preset.name}
                    type="button"
                    className={cn(
                      'w-7 h-7 rounded border transition-all hover:scale-110',
                      isSelected ? 'ring-2 ring-primary ring-offset-1' : 'border-border',
                      isPresetTransparent && 'bg-[repeating-conic-gradient(#ccc_0_25%,#fff_0_50%)] bg-[length:6px_6px]'
                    )}
                    style={{ 
                      backgroundColor: isPresetTransparent ? undefined : preset.value,
                    }}
                    onClick={() => handlePresetClick(preset.value)}
                    title={preset.name}
                  >
                    {isSelected && (
                      <Check className={cn(
                        'h-3.5 w-3.5 mx-auto',
                        preset.name === 'White' || preset.name === 'Transparent' ? 'text-foreground' : 'text-white'
                      )} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Custom Color Input */}
          <div className="mt-3 pt-3 border-t space-y-2">
            <Label className="text-xs text-muted-foreground">Custom Color</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={customColor}
                onChange={handleCustomChange}
                onKeyDown={handleKeyDown}
                placeholder="hsl(210 100% 50%)"
                className="text-xs h-8 font-mono"
              />
              <Button 
                size="sm" 
                className="h-8 px-2"
                onClick={handleCustomSubmit}
              >
                Apply
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Use HSL, RGB, HEX, or CSS color names
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ColorPickerPopover;
