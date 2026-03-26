/**
 * SectionStyleSettings
 * 
 * Comprehensive section-level styling controls including:
 * - Layout (columns, gap, alignment) - saves to section.props
 * - Background (solid, gradient, image, transparent)
 * - Padding & Margin (responsive)
 * - Container width
 * - Z-index
 * - Device visibility
 * - Border & Shadow
 */

import React, { useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ChevronDown, 
  Monitor, 
  Tablet, 
  Smartphone,
  Image as ImageIcon,
  Palette,
  Layers,
  Eye,
  EyeOff,
  LayoutGrid,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { 
  ColorPickerPopover, 
  ResponsiveSpacingInput,
  BorderSettings,
  ShadowPresetPicker,
} from './shared';
import type { 
  SectionStyleProps, 
  BackgroundStyle, 
  GradientStyle,
  ShadowPreset,
} from '@/types/elementSettings';
import type { ColumnCount, SpacingPreset, ContentAlignment } from '@/types/sectionSettings';

interface LayoutProps {
  columns?: ColumnCount;
  gap?: SpacingPreset;
  contentAlignment?: ContentAlignment;
}

interface SectionStyleSettingsProps {
  sectionId: string;
  style: SectionStyleProps | undefined;
  layoutProps?: LayoutProps;
  onChange: (style: SectionStyleProps) => void;
  onLayoutChange?: (layoutProps: Partial<LayoutProps>) => void;
}

const containerWidthOptions = [
  { value: 'narrow', label: 'Narrow (768px)' },
  { value: 'default', label: 'Default (1280px)' },
  { value: 'wide', label: 'Wide (1440px)' },
  { value: 'full', label: 'Full Width' },
];

const backgroundTypeOptions = [
  { value: 'transparent', label: 'Transparent' },
  { value: 'solid', label: 'Solid Color' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'image', label: 'Image' },
];

const columnOptions = [
  { value: '1', label: '1 Column' },
  { value: '2', label: '2 Columns' },
  { value: '3', label: '3 Columns' },
  { value: '4', label: '4 Columns' },
];

const gapOptions = [
  { value: 'none', label: 'None' },
  { value: 'small', label: 'Small' },
  { value: 'default', label: 'Default' },
  { value: 'large', label: 'Large' },
  { value: 'xlarge', label: 'Extra Large' },
];

const alignmentOptions = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight },
];

export function SectionStyleSettings({
  sectionId,
  style,
  layoutProps,
  onChange,
  onLayoutChange,
}: SectionStyleSettingsProps) {
  const currentStyle = style || {};
  const currentLayout = layoutProps || {};
  
  // Helper to update nested style properties
  const updateStyle = useCallback(<K extends keyof SectionStyleProps>(
    key: K,
    value: SectionStyleProps[K]
  ) => {
    onChange({ ...currentStyle, [key]: value });
  }, [currentStyle, onChange]);
  
  // Background handlers
  const handleBackgroundTypeChange = useCallback((type: BackgroundStyle['type']) => {
    const newBackground: BackgroundStyle = { type };
    if (type === 'solid') {
      newBackground.color = 'hsl(var(--background))';
    } else if (type === 'gradient') {
      newBackground.gradient = { start: 'hsl(var(--primary))', end: 'hsl(var(--secondary))', angle: 135 };
    }
    updateStyle('background', newBackground);
  }, [updateStyle]);
  
  const handleBackgroundColorChange = useCallback((color: string) => {
    updateStyle('background', { ...currentStyle.background, type: 'solid', color });
  }, [currentStyle.background, updateStyle]);
  
  const handleGradientChange = useCallback((gradient: Partial<GradientStyle>) => {
    updateStyle('background', {
      ...currentStyle.background,
      type: 'gradient',
      gradient: { ...currentStyle.background?.gradient, ...gradient } as GradientStyle,
    });
  }, [currentStyle.background, updateStyle]);
  
  const handleBackgroundImageChange = useCallback((url: string) => {
    updateStyle('background', {
      ...currentStyle.background,
      type: 'image',
      image: { ...currentStyle.background?.image, url },
    });
  }, [currentStyle.background, updateStyle]);
  
  // Layout handlers
  const handleLayoutChange = useCallback(<K extends keyof LayoutProps>(
    key: K,
    value: LayoutProps[K]
  ) => {
    if (onLayoutChange) {
      onLayoutChange({ [key]: value });
    }
  }, [onLayoutChange]);

  return (
    <div className="space-y-4 p-3">
      {/* Layout Section - saves to section.props */}
      {onLayoutChange && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-primary" />
              Grid Layout
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-3">
            {/* Columns */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Columns</Label>
              <Select
                value={String(currentLayout.columns || 2)}
                onValueChange={(v) => handleLayoutChange('columns', parseInt(v) as ColumnCount)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columnOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Gap */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Item Spacing</Label>
              <Select
                value={currentLayout.gap || 'default'}
                onValueChange={(v) => handleLayoutChange('gap', v as SpacingPreset)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gapOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Content Alignment */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Content Alignment</Label>
              <div className="flex gap-1">
                {alignmentOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={currentLayout.contentAlignment === opt.value ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 h-8"
                    onClick={() => handleLayoutChange('contentAlignment', opt.value as ContentAlignment)}
                  >
                    <opt.icon className="h-3.5 w-3.5" />
                  </Button>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Background Section */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            Background
          </div>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3">
          {/* Background Type */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <Select
              value={currentStyle.background?.type || 'transparent'}
              onValueChange={(v) => handleBackgroundTypeChange(v as BackgroundStyle['type'])}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {backgroundTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Solid Color */}
          {currentStyle.background?.type === 'solid' && (
            <ColorPickerPopover
              label="Color"
              value={currentStyle.background.color || ''}
              onChange={handleBackgroundColorChange}
            />
          )}
          
          {/* Gradient */}
          {currentStyle.background?.type === 'gradient' && (
            <div className="space-y-3">
              <ColorPickerPopover
                label="Start Color"
                value={currentStyle.background.gradient?.start || ''}
                onChange={(color) => handleGradientChange({ start: color })}
              />
              <ColorPickerPopover
                label="End Color"
                value={currentStyle.background.gradient?.end || ''}
                onChange={(color) => handleGradientChange({ end: color })}
              />
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Angle: {currentStyle.background.gradient?.angle || 135}°</Label>
                <Slider
                  value={[currentStyle.background.gradient?.angle || 135]}
                  onValueChange={([angle]) => handleGradientChange({ angle })}
                  min={0}
                  max={360}
                  step={15}
                />
              </div>
            </div>
          )}
          
          {/* Image */}
          {currentStyle.background?.type === 'image' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Image URL</Label>
                <Input
                  type="url"
                  value={currentStyle.background.image?.url || ''}
                  onChange={(e) => handleBackgroundImageChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="h-8 text-xs"
                />
              </div>
              
              {/* Overlay */}
              <ColorPickerPopover
                label="Overlay Color"
                value={currentStyle.background.image?.overlay?.color || 'transparent'}
                onChange={(color) => updateStyle('background', {
                  ...currentStyle.background,
                  type: 'image',
                  image: {
                    ...currentStyle.background?.image,
                    overlay: { color, opacity: currentStyle.background?.image?.overlay?.opacity || 0.5 },
                  },
                })}
              />
              
              {currentStyle.background.image?.overlay?.color && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Overlay Opacity: {Math.round((currentStyle.background.image?.overlay?.opacity || 0.5) * 100)}%
                  </Label>
                  <Slider
                    value={[(currentStyle.background.image?.overlay?.opacity || 0.5) * 100]}
                    onValueChange={([opacity]) => updateStyle('background', {
                      ...currentStyle.background,
                      type: 'image',
                      image: {
                        ...currentStyle.background?.image,
                        overlay: { 
                          ...currentStyle.background?.image?.overlay,
                          color: currentStyle.background?.image?.overlay?.color || 'hsl(0 0% 0%)',
                          opacity: opacity / 100,
                        },
                      },
                    })}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
      
      {/* Spacing Section */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Spacing
          </div>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-4">
          <ResponsiveSpacingInput
            label="Padding"
            value={currentStyle.padding}
            onChange={(padding) => updateStyle('padding', padding)}
          />
          
          <ResponsiveSpacingInput
            label="Margin"
            value={currentStyle.margin}
            onChange={(margin) => updateStyle('margin', margin)}
          />
        </CollapsibleContent>
      </Collapsible>
      
      {/* Layout Section */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" />
            Layout
          </div>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3">
          {/* Container Width */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Container Width</Label>
            <Select
              value={currentStyle.containerWidth || 'default'}
              onValueChange={(v) => updateStyle('containerWidth', v as SectionStyleProps['containerWidth'])}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {containerWidthOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Z-Index */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Z-Index</Label>
            <Input
              type="number"
              value={currentStyle.zIndex || ''}
              onChange={(e) => updateStyle('zIndex', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Auto"
              className="h-8 text-xs"
              min={0}
              max={100}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Border & Shadow Section */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Border & Shadow
          </div>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-4">
          <BorderSettings
            label="Border"
            value={currentStyle.border}
            onChange={(border) => updateStyle('border', border)}
          />
          
          <ShadowPresetPicker
            label="Shadow"
            value={currentStyle.shadow}
            onChange={(shadow) => updateStyle('shadow', shadow)}
          />
        </CollapsibleContent>
      </Collapsible>
      
      {/* Visibility Section */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            Device Visibility
          </div>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3">
          <p className="text-xs text-muted-foreground mb-2">
            Hide this section on specific devices
          </p>
          
          {/* Desktop */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs">Desktop</Label>
            </div>
            <Switch
              checked={!currentStyle.hideOn?.desktop}
              onCheckedChange={(checked) => updateStyle('hideOn', {
                ...currentStyle.hideOn,
                desktop: !checked,
              })}
              className="scale-75"
            />
          </div>
          
          {/* Tablet */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tablet className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs">Tablet</Label>
            </div>
            <Switch
              checked={!currentStyle.hideOn?.tablet}
              onCheckedChange={(checked) => updateStyle('hideOn', {
                ...currentStyle.hideOn,
                tablet: !checked,
              })}
              className="scale-75"
            />
          </div>
          
          {/* Mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs">Mobile</Label>
            </div>
            <Switch
              checked={!currentStyle.hideOn?.mobile}
              onCheckedChange={(checked) => updateStyle('hideOn', {
                ...currentStyle.hideOn,
                mobile: !checked,
              })}
              className="scale-75"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default SectionStyleSettings;
