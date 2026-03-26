/**
 * ResponsiveSpacingInput
 * 
 * Input component for padding/margin with support for:
 * - Individual side controls (top, right, bottom, left)
 * - Linked mode (all sides same value)
 * - Responsive values (desktop, tablet, mobile)
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Link, Unlink, Monitor, Tablet, Smartphone } from 'lucide-react';
import type { ResponsiveSpacing, SpacingValue } from '@/types/elementSettings';

interface ResponsiveSpacingInputProps {
  value: ResponsiveSpacing | undefined;
  onChange: (value: ResponsiveSpacing) => void;
  label?: string;
  className?: string;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const defaultSpacing: SpacingValue = {
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
};

export function ResponsiveSpacingInput({
  value,
  onChange,
  label,
  className,
}: ResponsiveSpacingInputProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [isLinked, setIsLinked] = useState(true);
  
  // Get current spacing for selected device
  const currentSpacing = useMemo(() => {
    if (!value) return defaultSpacing;
    if (deviceMode === 'desktop') return value.desktop || defaultSpacing;
    if (deviceMode === 'tablet') return value.tablet || value.desktop || defaultSpacing;
    return value.mobile || value.tablet || value.desktop || defaultSpacing;
  }, [value, deviceMode]);
  
  // Check if current device has override
  const hasOverride = useMemo(() => {
    if (!value) return false;
    if (deviceMode === 'tablet') return !!value.tablet;
    if (deviceMode === 'mobile') return !!value.mobile;
    return true;
  }, [value, deviceMode]);
  
  // Handle individual side change
  const handleSideChange = useCallback((side: keyof SpacingValue, newValue: string) => {
    const currentValue = value || { desktop: defaultSpacing };
    
    let newSpacing: SpacingValue;
    if (isLinked) {
      // Apply same value to all sides
      newSpacing = { top: newValue, right: newValue, bottom: newValue, left: newValue };
    } else {
      // Apply to single side
      newSpacing = { ...currentSpacing, [side]: newValue };
    }
    
    // Update the appropriate device level
    const newResponsive: ResponsiveSpacing = { ...currentValue };
    if (deviceMode === 'desktop') {
      newResponsive.desktop = newSpacing;
    } else if (deviceMode === 'tablet') {
      newResponsive.tablet = newSpacing;
    } else {
      newResponsive.mobile = newSpacing;
    }
    
    onChange(newResponsive);
  }, [value, currentSpacing, deviceMode, isLinked, onChange]);
  
  // Clear device override
  const handleClearOverride = useCallback(() => {
    if (!value) return;
    
    const newResponsive: ResponsiveSpacing = { ...value };
    if (deviceMode === 'tablet') {
      delete newResponsive.tablet;
    } else if (deviceMode === 'mobile') {
      delete newResponsive.mobile;
    }
    
    onChange(newResponsive);
  }, [value, deviceMode, onChange]);
  
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with label and device tabs */}
      <div className="flex items-center justify-between gap-2">
        {label && (
          <Label className="text-xs font-medium">{label}</Label>
        )}
        
        <div className="flex items-center gap-1">
          <Tabs value={deviceMode} onValueChange={(v) => setDeviceMode(v as DeviceMode)}>
            <TabsList className="h-7 p-0.5">
              <TabsTrigger value="desktop" className="h-6 w-6 p-0">
                <Monitor className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="tablet" className="h-6 w-6 p-0">
                <Tablet className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="mobile" className="h-6 w-6 p-0">
                <Smartphone className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Override indicator */}
      {deviceMode !== 'desktop' && hasOverride && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-primary">Custom {deviceMode} value</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1.5 text-xs"
            onClick={handleClearOverride}
          >
            Reset
          </Button>
        </div>
      )}
      
      {/* Spacing inputs */}
      <div className="relative">
        {/* Top */}
        <div className="flex justify-center mb-1">
          <Input
            type="text"
            value={currentSpacing.top}
            onChange={(e) => handleSideChange('top', e.target.value)}
            className="w-16 h-7 text-xs text-center"
            placeholder="0"
          />
        </div>
        
        {/* Middle row: Left, Link button, Right */}
        <div className="flex items-center justify-between gap-2">
          <Input
            type="text"
            value={currentSpacing.left}
            onChange={(e) => handleSideChange('left', e.target.value)}
            className="w-16 h-7 text-xs text-center"
            placeholder="0"
          />
          
          <Button
            variant={isLinked ? 'default' : 'outline'}
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setIsLinked(!isLinked)}
            title={isLinked ? 'Unlink sides' : 'Link all sides'}
          >
            {isLinked ? (
              <Link className="h-3 w-3" />
            ) : (
              <Unlink className="h-3 w-3" />
            )}
          </Button>
          
          <Input
            type="text"
            value={currentSpacing.right}
            onChange={(e) => handleSideChange('right', e.target.value)}
            className="w-16 h-7 text-xs text-center"
            placeholder="0"
          />
        </div>
        
        {/* Bottom */}
        <div className="flex justify-center mt-1">
          <Input
            type="text"
            value={currentSpacing.bottom}
            onChange={(e) => handleSideChange('bottom', e.target.value)}
            className="w-16 h-7 text-xs text-center"
            placeholder="0"
          />
        </div>
      </div>
      
      {/* Quick presets */}
      <div className="flex flex-wrap gap-1">
        {['0', '8px', '16px', '24px', '32px', '48px'].map((preset) => (
          <Button
            key={preset}
            variant="outline"
            size="sm"
            className="h-6 px-2 text-[10px]"
            onClick={() => {
              const newSpacing = { top: preset, right: preset, bottom: preset, left: preset };
              const newResponsive: ResponsiveSpacing = { ...value, desktop: value?.desktop || defaultSpacing };
              if (deviceMode === 'desktop') {
                newResponsive.desktop = newSpacing;
              } else if (deviceMode === 'tablet') {
                newResponsive.tablet = newSpacing;
              } else {
                newResponsive.mobile = newSpacing;
              }
              onChange(newResponsive);
            }}
          >
            {preset}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default ResponsiveSpacingInput;
