/**
 * Icon Settings Component
 * 
 * Settings panel for icon elements with controls for:
 * - Icon selection from Lucide library
 * - Size and color
 * - Background shape and color
 * - Link configuration
 */

import React, { useMemo, useCallback } from 'react';
import { useEditorStore, useSelectedElementValue } from '@/stores/editorStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ChevronDown, Sparkles, Circle, Square, RectangleHorizontal, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColorPickerPopover } from './shared/ColorPickerPopover';
import { LinkSettings } from './shared/LinkSettings';
import { IconPicker } from '@/components/admin/sections/shared/IconPicker';
import { getIconComponent } from '@/components/admin/sections/shared/iconConstants';
import type { IconElementProps, IconBackground } from '@/types/elementSettings';

interface IconSettingsProps {
  sectionId: string;
  elementPath: string;
  onClose?: () => void;
}

const SIZE_PRESETS = [16, 20, 24, 32, 40, 48, 64];

const BACKGROUND_SHAPES: { value: IconBackground['shape']; label: string; icon: React.ReactNode }[] = [
  { value: 'none', label: 'None', icon: <X className="h-4 w-4" /> },
  { value: 'circle', label: 'Circle', icon: <Circle className="h-4 w-4" /> },
  { value: 'square', label: 'Square', icon: <Square className="h-4 w-4" /> },
  { value: 'rounded', label: 'Rounded', icon: <RectangleHorizontal className="h-4 w-4" /> },
];

export function IconSettings({ sectionId, elementPath, onClose }: IconSettingsProps) {
  const rawValue = useSelectedElementValue();
  const updateElementValue = useEditorStore(s => s.updateElementValue);
  const clearSelection = useEditorStore(s => s.clearSelection);

  // Parse the icon props from the raw value
  const iconProps: IconElementProps = useMemo(() => {
    if (typeof rawValue === 'string') {
      return { name: rawValue };
    }
    if (typeof rawValue === 'object' && rawValue !== null) {
      return rawValue as IconElementProps;
    }
    return { name: 'Star' };
  }, [rawValue]);

  // Update a specific property
  const updateProp = useCallback(<K extends keyof IconElementProps>(
    key: K, 
    value: IconElementProps[K]
  ) => {
    const newProps = { ...iconProps, [key]: value };
    updateElementValue(sectionId, elementPath, newProps);
  }, [iconProps, sectionId, elementPath, updateElementValue]);

  // Update background property
  const updateBackground = useCallback(<K extends keyof IconBackground>(
    key: K, 
    value: IconBackground[K]
  ) => {
    const newBackground: IconBackground = { 
      ...iconProps.background, 
      shape: iconProps.background?.shape || 'none',
      [key]: value 
    };
    updateProp('background', newBackground);
  }, [iconProps.background, updateProp]);

  // Handle link changes
  const handleLinkChange = useCallback((link: { url: string; newTab?: boolean } | undefined) => {
    updateProp('link', link);
  }, [updateProp]);

  const handleClose = () => {
    if (onClose) onClose();
    else clearSelection();
  };

  // Render the current icon
  const renderIcon = () => {
    const IconComponent = getIconComponent(iconProps.name);
    return <IconComponent style={{ width: iconProps.size || 24, height: iconProps.size || 24, color: iconProps.color }} />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Icon Settings</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {/* Live Preview */}
        <div className="p-3 border-b bg-muted/20">
          <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
          <div className="flex justify-center p-6 rounded-md bg-background border">
            <div 
              className={cn(
                'flex items-center justify-center transition-all',
                iconProps.background?.shape === 'circle' && 'rounded-full',
                iconProps.background?.shape === 'square' && 'rounded-none',
                iconProps.background?.shape === 'rounded' && 'rounded-lg',
              )}
              style={{
                backgroundColor: iconProps.background?.shape !== 'none' ? (iconProps.background?.color || 'hsl(var(--muted))') : undefined,
                padding: iconProps.background?.shape !== 'none' ? (iconProps.background?.size || 12) : 0,
              }}
            >
              {renderIcon()}
            </div>
          </div>
        </div>

        <Tabs defaultValue="icon" className="w-full">
          <TabsList className="grid grid-cols-3 h-9 mx-2 mt-2">
            <TabsTrigger value="icon" className="text-xs">Icon</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
            <TabsTrigger value="link" className="text-xs">Link</TabsTrigger>
          </TabsList>

          {/* Icon Tab */}
          <TabsContent value="icon" className="p-3 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Select Icon</Label>
              <IconPicker
                value={iconProps.name}
                onChange={(name) => updateProp('name', name)}
              />
            </div>
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="p-3 space-y-4">
            {/* Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Size</Label>
                <span className="text-xs text-muted-foreground">{iconProps.size || 24}px</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {SIZE_PRESETS.map(size => (
                  <Button
                    key={size}
                    variant={iconProps.size === size ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => updateProp('size', size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
              <Slider
                value={[iconProps.size || 24]}
                onValueChange={([v]) => updateProp('size', v)}
                min={12}
                max={96}
                step={1}
                className="mt-2"
              />
            </div>

            {/* Color */}
            <div className="space-y-1.5">
              <Label className="text-xs">Color</Label>
              <ColorPickerPopover
                value={iconProps.color || ''}
                onChange={(v) => updateProp('color', v)}
              />
            </div>

            {/* Hover Color */}
            <div className="space-y-1.5">
              <Label className="text-xs">Hover Color</Label>
              <ColorPickerPopover
                value={iconProps.hoverColor || ''}
                onChange={(v) => updateProp('hoverColor', v)}
              />
            </div>

            {/* Background */}
            <Collapsible defaultOpen={iconProps.background?.shape !== 'none'}>
              <CollapsibleTrigger className="flex items-center gap-2 w-full py-1.5 text-xs font-medium hover:text-foreground text-muted-foreground">
                <Circle className="h-3.5 w-3.5" />
                <span>Background</span>
                <ChevronDown className="h-3.5 w-3.5 ml-auto transition-transform [[data-state=open]>&]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 space-y-3">
                {/* Shape */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Shape</Label>
                  <ToggleGroup 
                    type="single" 
                    value={iconProps.background?.shape || 'none'}
                    onValueChange={(v) => v && updateBackground('shape', v as IconBackground['shape'])}
                    className="justify-start"
                  >
                    {BACKGROUND_SHAPES.map(shape => (
                      <ToggleGroupItem 
                        key={shape.value} 
                        value={shape.value} 
                        className="h-8 w-8 p-0"
                        title={shape.label}
                      >
                        {shape.icon}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                {iconProps.background?.shape && iconProps.background.shape !== 'none' && (
                  <>
                    {/* Background Color */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Background Color</Label>
                      <ColorPickerPopover
                        value={iconProps.background?.color || ''}
                        onChange={(v) => updateBackground('color', v)}
                      />
                    </div>

                    {/* Background Size (Padding) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Padding</Label>
                        <span className="text-xs text-muted-foreground">{iconProps.background?.size || 12}px</span>
                      </div>
                      <Slider
                        value={[iconProps.background?.size || 12]}
                        onValueChange={([v]) => updateBackground('size', v)}
                        min={4}
                        max={32}
                        step={1}
                      />
                    </div>
                  </>
                )}
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>

          {/* Link Tab */}
          <TabsContent value="link" className="p-3 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Make Clickable</Label>
              <p className="text-[10px] text-muted-foreground mb-2">
                Add a link to make this icon clickable
              </p>
              <LinkSettings
                value={iconProps.link}
                onChange={handleLinkChange}
              />
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}

export default IconSettings;
