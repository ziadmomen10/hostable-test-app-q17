/**
 * Button Settings Component
 * 
 * Settings panel for button elements with controls for:
 * - Button text and link
 * - Variant and size
 * - Icon configuration
 * - Custom colors and hover states
 */

import React, { useMemo, useCallback } from 'react';
import { useEditorStore, useSelectedElementValue } from '@/stores/editorStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { X, ChevronDown, MousePointer, Palette, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColorPickerPopover } from './shared/ColorPickerPopover';
import { LinkSettings } from './shared/LinkSettings';
import { IconPicker } from '@/components/admin/sections/shared/IconPicker';
import type { ButtonElementProps, ButtonColors } from '@/types/elementSettings';

interface ButtonSettingsProps {
  sectionId: string;
  elementPath: string;
  onClose?: () => void;
}

const BUTTON_VARIANTS = [
  { value: 'default', label: 'Primary', className: 'bg-primary text-primary-foreground' },
  { value: 'secondary', label: 'Secondary', className: 'bg-secondary text-secondary-foreground' },
  { value: 'outline', label: 'Outline', className: 'border border-input bg-transparent' },
  { value: 'ghost', label: 'Ghost', className: 'bg-transparent hover:bg-accent' },
  { value: 'destructive', label: 'Destructive', className: 'bg-destructive text-destructive-foreground' },
  { value: 'link', label: 'Link', className: 'text-primary underline-offset-4' },
];

const BUTTON_SIZES = [
  { value: 'sm', label: 'Small' },
  { value: 'default', label: 'Default' },
  { value: 'lg', label: 'Large' },
  { value: 'icon', label: 'Icon Only' },
];

export function ButtonSettings({ sectionId, elementPath, onClose }: ButtonSettingsProps) {
  const rawValue = useSelectedElementValue();
  const updateElementValue = useEditorStore(s => s.updateElementValue);
  const clearSelection = useEditorStore(s => s.clearSelection);

  // Parse the button props from the raw value
  const buttonProps: ButtonElementProps = useMemo(() => {
    if (typeof rawValue === 'string') {
      return { text: rawValue };
    }
    if (typeof rawValue === 'object' && rawValue !== null) {
      return rawValue as ButtonElementProps;
    }
    return { text: '' };
  }, [rawValue]);

  // Update a specific property
  const updateProp = useCallback(<K extends keyof ButtonElementProps>(
    key: K, 
    value: ButtonElementProps[K]
  ) => {
    const newProps = { ...buttonProps, [key]: value };
    updateElementValue(sectionId, elementPath, newProps);
  }, [buttonProps, sectionId, elementPath, updateElementValue]);

  // Handle link changes
  const handleLinkChange = useCallback((link: { url: string; newTab?: boolean } | undefined) => {
    updateProp('link', link);
  }, [updateProp]);

  // Handle custom color changes
  const updateCustomColor = useCallback((key: keyof ButtonColors, value: string) => {
    const newColors = { ...buttonProps.customColors, [key]: value };
    updateProp('customColors', newColors);
  }, [buttonProps.customColors, updateProp]);

  // Handle hover color changes
  const updateHoverColor = useCallback((key: keyof ButtonColors, value: string) => {
    const newHover = { ...buttonProps.hover, [key]: value };
    updateProp('hover', newHover);
  }, [buttonProps.hover, updateProp]);

  const handleClose = () => {
    if (onClose) onClose();
    else clearSelection();
  };

  // Get current variant styling for preview
  const currentVariant = BUTTON_VARIANTS.find(v => v.value === buttonProps.variant) || BUTTON_VARIANTS[0];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <MousePointer className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Button Settings</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {/* Live Preview */}
        <div className="p-3 border-b bg-muted/20">
          <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
          <div className="flex justify-center p-4 rounded-md bg-background border">
            <Button
              variant={buttonProps.variant as any || 'default'}
              size={buttonProps.size as any || 'default'}
              className={cn(
                buttonProps.width === 'full' && 'w-full',
                buttonProps.borderRadius && `rounded-[${buttonProps.borderRadius}]`
              )}
              style={{
                backgroundColor: buttonProps.customColors?.background,
                color: buttonProps.customColors?.text,
                borderColor: buttonProps.customColors?.border,
              }}
              disabled={buttonProps.disabled}
            >
              {buttonProps.icon?.position === 'before' && buttonProps.icon.name && (
                <span className="mr-2">★</span>
              )}
              {buttonProps.text || 'Button'}
              {buttonProps.icon?.position === 'after' && buttonProps.icon.name && (
                <span className="ml-2">★</span>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid grid-cols-3 h-9 mx-2 mt-2">
            <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
            <TabsTrigger value="states" className="text-xs">States</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="p-3 space-y-4">
            {/* Button Text */}
            <div className="space-y-1.5">
              <Label className="text-xs">Button Text</Label>
              <Input
                value={buttonProps.text || ''}
                onChange={(e) => updateProp('text', e.target.value)}
                placeholder="Click me"
                className="h-8 text-sm"
              />
              <p className="text-[10px] text-muted-foreground text-right">
                {(buttonProps.text || '').length} characters
              </p>
            </div>

            {/* Link Settings */}
            <div className="space-y-1.5">
              <Label className="text-xs">Link</Label>
              <LinkSettings
                value={buttonProps.link}
                onChange={handleLinkChange}
              />
            </div>

            {/* Icon Configuration */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 w-full py-1.5 text-xs font-medium hover:text-foreground text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Icon</span>
                <ChevronDown className="h-3.5 w-3.5 ml-auto transition-transform [[data-state=open]>&]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 space-y-3">
                <IconPicker
                  value={buttonProps.icon?.name}
                  onChange={(name) => updateProp('icon', { ...buttonProps.icon, name, position: buttonProps.icon?.position || 'before' })}
                />
                
                {buttonProps.icon?.name && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Icon Position</Label>
                    <ToggleGroup 
                      type="single" 
                      value={buttonProps.icon?.position || 'before'}
                      onValueChange={(v) => v && updateProp('icon', { ...buttonProps.icon, name: buttonProps.icon?.name || '', position: v as 'before' | 'after' })}
                      className="justify-start"
                    >
                      <ToggleGroupItem value="before" className="text-xs h-8">Before Text</ToggleGroupItem>
                      <ToggleGroupItem value="after" className="text-xs h-8">After Text</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="p-3 space-y-4">
            {/* Variant */}
            <div className="space-y-2">
              <Label className="text-xs">Variant</Label>
              <div className="grid grid-cols-3 gap-2">
                {BUTTON_VARIANTS.map(variant => (
                  <button
                    key={variant.value}
                    onClick={() => updateProp('variant', variant.value as ButtonElementProps['variant'])}
                    className={cn(
                      'px-2 py-1.5 rounded-md text-xs font-medium transition-all',
                      variant.className,
                      buttonProps.variant === variant.value 
                        ? 'ring-2 ring-primary ring-offset-2' 
                        : 'opacity-70 hover:opacity-100'
                    )}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="space-y-1.5">
              <Label className="text-xs">Size</Label>
              <Select 
                value={buttonProps.size || 'default'} 
                onValueChange={(v) => updateProp('size', v as ButtonElementProps['size'])}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUTTON_SIZES.map(size => (
                    <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Width */}
            <div className="space-y-1.5">
              <Label className="text-xs">Width</Label>
              <ToggleGroup 
                type="single" 
                value={buttonProps.width || 'auto'}
                onValueChange={(v) => v && updateProp('width', v as 'auto' | 'full')}
                className="justify-start"
              >
                <ToggleGroupItem value="auto" className="text-xs h-8">Auto</ToggleGroupItem>
                <ToggleGroupItem value="full" className="text-xs h-8">Full Width</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Border Radius */}
            <div className="space-y-1.5">
              <Label className="text-xs">Border Radius</Label>
              <Input
                value={buttonProps.borderRadius || ''}
                onChange={(e) => updateProp('borderRadius', e.target.value)}
                placeholder="Use default"
                className="h-8 text-sm"
              />
            </div>

            {/* Custom Colors */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 w-full py-1.5 text-xs font-medium hover:text-foreground text-muted-foreground">
                <Palette className="h-3.5 w-3.5" />
                <span>Custom Colors</span>
                <ChevronDown className="h-3.5 w-3.5 ml-auto transition-transform [[data-state=open]>&]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Background</Label>
                  <ColorPickerPopover
                    value={buttonProps.customColors?.background || ''}
                    onChange={(v) => updateCustomColor('background', v)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Text</Label>
                  <ColorPickerPopover
                    value={buttonProps.customColors?.text || ''}
                    onChange={(v) => updateCustomColor('text', v)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Border</Label>
                  <ColorPickerPopover
                    value={buttonProps.customColors?.border || ''}
                    onChange={(v) => updateCustomColor('border', v)}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>

          {/* States Tab */}
          <TabsContent value="states" className="p-3 space-y-4">
            {/* Hover Colors */}
            <div className="space-y-3">
              <Label className="text-xs font-medium">Hover State</Label>
              <div className="space-y-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Background</Label>
                  <ColorPickerPopover
                    value={buttonProps.hover?.background || ''}
                    onChange={(v) => updateHoverColor('background', v)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Text</Label>
                  <ColorPickerPopover
                    value={buttonProps.hover?.text || ''}
                    onChange={(v) => updateHoverColor('text', v)}
                  />
                </div>
              </div>
            </div>

            {/* Disabled State */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs">Disabled</Label>
                <p className="text-[10px] text-muted-foreground">
                  Button appears inactive
                </p>
              </div>
              <Switch
                checked={buttonProps.disabled || false}
                onCheckedChange={(checked) => updateProp('disabled', checked)}
              />
            </div>

            {/* Loading State */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs">Loading</Label>
                <p className="text-[10px] text-muted-foreground">
                  Show loading spinner
                </p>
              </div>
              <Switch
                checked={buttonProps.loading || false}
                onCheckedChange={(checked) => updateProp('loading', checked)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}

export default ButtonSettings;
