/**
 * Image Settings Component
 * 
 * Settings panel for image elements with controls for:
 * - Source URL and alt text
 * - Link configuration
 * - Dimensions and aspect ratio
 * - Object fit and position
 * - Border and shadow styling
 */

import React, { useMemo, useCallback } from 'react';
import { useEditorStore, useSelectedElementValue } from '@/stores/editorStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ChevronDown, Image, Upload, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BorderSettings } from './shared/BorderSettings';
import { ShadowPresetPicker } from './shared/ShadowPresetPicker';
import { LinkSettings } from './shared/LinkSettings';
import type { ImageElementProps, ShadowPreset, BorderStyle } from '@/types/elementSettings';

interface ImageSettingsProps {
  sectionId: string;
  elementPath: string;
  onClose?: () => void;
}

const ASPECT_RATIOS = [
  { value: 'auto', label: 'Auto' },
  { value: '1:1', label: '1:1 (Square)' },
  { value: '4:3', label: '4:3' },
  { value: '16:9', label: '16:9 (Widescreen)' },
  { value: '3:2', label: '3:2' },
  { value: '2:3', label: '2:3 (Portrait)' },
  { value: '21:9', label: '21:9 (Ultra-wide)' },
];

const OBJECT_FIT_OPTIONS = [
  { value: 'cover', label: 'Cover' },
  { value: 'contain', label: 'Contain' },
  { value: 'fill', label: 'Fill' },
  { value: 'none', label: 'None' },
  { value: 'scale-down', label: 'Scale Down' },
];

const OBJECT_POSITION_OPTIONS = [
  { value: 'center', label: 'Center' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top left', label: 'Top Left' },
  { value: 'top right', label: 'Top Right' },
  { value: 'bottom left', label: 'Bottom Left' },
  { value: 'bottom right', label: 'Bottom Right' },
];

const BORDER_RADIUS_PRESETS = [0, 4, 8, 12, 16, 24, 9999];

export function ImageSettings({ sectionId, elementPath, onClose }: ImageSettingsProps) {
  const rawValue = useSelectedElementValue();
  const updateElementValue = useEditorStore(s => s.updateElementValue);
  const clearSelection = useEditorStore(s => s.clearSelection);

  // Parse the image props from the raw value
  const imageProps: ImageElementProps = useMemo(() => {
    if (typeof rawValue === 'string') {
      return { src: rawValue };
    }
    if (typeof rawValue === 'object' && rawValue !== null) {
      return rawValue as ImageElementProps;
    }
    return { src: '' };
  }, [rawValue]);

  // Update a specific property
  const updateProp = useCallback(<K extends keyof ImageElementProps>(
    key: K, 
    value: ImageElementProps[K]
  ) => {
    const newProps = { ...imageProps, [key]: value };
    updateElementValue(sectionId, elementPath, newProps);
  }, [imageProps, sectionId, elementPath, updateElementValue]);

  // Handle link changes
  const handleLinkChange = useCallback((link: { url: string; newTab?: boolean } | undefined) => {
    updateProp('link', link);
  }, [updateProp]);

  // Handle border changes
  const handleBorderChange = useCallback((border: BorderStyle) => {
    updateProp('border', border);
  }, [updateProp]);

  const handleClose = () => {
    if (onClose) onClose();
    else clearSelection();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Image Settings</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid grid-cols-3 h-9 mx-2 mt-2">
            <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="p-3 space-y-4">
            {/* Image Preview */}
            {imageProps.src && (
              <div className="rounded-md border overflow-hidden bg-muted/30">
                <img 
                  src={imageProps.src} 
                  alt={imageProps.alt || 'Preview'} 
                  className="w-full h-24 object-cover"
                />
              </div>
            )}

            {/* Source URL */}
            <div className="space-y-1.5">
              <Label className="text-xs">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  value={imageProps.src || ''}
                  onChange={(e) => updateProp('src', e.target.value)}
                  placeholder="https://..."
                  className="h-8 text-sm flex-1"
                />
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Alt Text */}
            <div className="space-y-1.5">
              <Label className="text-xs">Alt Text</Label>
              <Input
                value={imageProps.alt || ''}
                onChange={(e) => updateProp('alt', e.target.value)}
                placeholder="Describe the image..."
                className="h-8 text-sm"
              />
              <p className="text-[10px] text-muted-foreground">
                Important for accessibility and SEO
              </p>
            </div>

            {/* Link Settings */}
            <Collapsible defaultOpen={!!imageProps.link?.url}>
              <CollapsibleTrigger className="flex items-center gap-2 w-full py-1.5 text-xs font-medium hover:text-foreground text-muted-foreground">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Link</span>
                <ChevronDown className="h-3.5 w-3.5 ml-auto transition-transform [[data-state=open]>&]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <LinkSettings
                  value={imageProps.link}
                  onChange={handleLinkChange}
                />
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="p-3 space-y-4">
            {/* Dimensions */}
            <div className="space-y-3">
              <Label className="text-xs font-medium">Dimensions</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Width</Label>
                  <Input
                    value={imageProps.width || ''}
                    onChange={(e) => updateProp('width', e.target.value)}
                    placeholder="auto"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Height</Label>
                  <Input
                    value={imageProps.height || ''}
                    onChange={(e) => updateProp('height', e.target.value)}
                    placeholder="auto"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1.5">
              <Label className="text-xs">Aspect Ratio</Label>
              <Select 
                value={imageProps.aspectRatio || 'auto'} 
                onValueChange={(v) => updateProp('aspectRatio', v as ImageElementProps['aspectRatio'])}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIOS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Object Fit */}
            <div className="space-y-1.5">
              <Label className="text-xs">Object Fit</Label>
              <Select 
                value={imageProps.objectFit || 'cover'} 
                onValueChange={(v) => updateProp('objectFit', v as ImageElementProps['objectFit'])}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OBJECT_FIT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Object Position */}
            <div className="space-y-1.5">
              <Label className="text-xs">Object Position</Label>
              <Select 
                value={imageProps.objectPosition || 'center'} 
                onValueChange={(v) => updateProp('objectPosition', v)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OBJECT_POSITION_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Border Radius</Label>
                <span className="text-xs text-muted-foreground">
                  {imageProps.borderRadius || '0'}
                </span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {BORDER_RADIUS_PRESETS.map(preset => (
                  <Button
                    key={preset}
                    variant={imageProps.borderRadius === `${preset}px` ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => updateProp('borderRadius', preset === 9999 ? '9999px' : `${preset}px`)}
                  >
                    {preset === 9999 ? 'Full' : preset}
                  </Button>
                ))}
              </div>
              <Input
                value={imageProps.borderRadius || ''}
                onChange={(e) => updateProp('borderRadius', e.target.value)}
                placeholder="e.g., 8px or 50%"
                className="h-8 text-sm"
              />
            </div>

            {/* Border */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 w-full py-1.5 text-xs font-medium hover:text-foreground text-muted-foreground">
                <span>Border</span>
                <ChevronDown className="h-3.5 w-3.5 ml-auto transition-transform [[data-state=open]>&]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <BorderSettings
                  value={imageProps.border}
                  onChange={handleBorderChange}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* Shadow */}
            <div className="space-y-1.5">
              <Label className="text-xs">Shadow</Label>
              <ShadowPresetPicker
                value={(imageProps.shadow as ShadowPreset) || 'none'}
                onChange={(v) => updateProp('shadow', v)}
              />
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="p-3 space-y-4">
            {/* Lazy Loading */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs">Lazy Loading</Label>
                <p className="text-[10px] text-muted-foreground">
                  Load image when visible
                </p>
              </div>
              <Switch
                checked={imageProps.loading !== 'eager'}
                onCheckedChange={(checked) => updateProp('loading', checked ? 'lazy' : 'eager')}
              />
            </div>

            {/* Fetch Priority */}
            <div className="space-y-1.5">
              <Label className="text-xs">Loading Priority</Label>
              <Select 
                value={imageProps.fetchPriority || 'auto'} 
                onValueChange={(v) => updateProp('fetchPriority', v as ImageElementProps['fetchPriority'])}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="high">High (Above fold)</SelectItem>
                  <SelectItem value="low">Low (Below fold)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                Use "High" for hero images that should load first
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}

export default ImageSettings;
