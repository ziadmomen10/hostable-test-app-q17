/**
 * Text Settings Component
 * 
 * Settings panel for text elements with controls for:
 * - Text content (plain or rich text)
 * - Typography (font size, weight, line height)
 * - Text styling (transform, alignment, color)
 * - Translation key management
 */

import React, { useMemo, useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useEditorStore, useSelectedElementValue, useSelection } from '@/stores/editorStore';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ChevronDown, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link2, Unlink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColorPickerPopover } from './shared/ColorPickerPopover';
import type { TextElementProps } from '@/types/elementSettings';

interface TextSettingsProps {
  sectionId: string;
  elementPath: string;
  onClose?: () => void;
}

const FONT_SIZES = [
  '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'
];

const LINE_HEIGHTS = [
  { value: '1', label: '1.0' },
  { value: '1.25', label: '1.25' },
  { value: '1.375', label: '1.375' },
  { value: '1.5', label: '1.5' },
  { value: '1.625', label: '1.625' },
  { value: '1.75', label: '1.75' },
  { value: '2', label: '2.0' },
];

const FONT_WEIGHTS = [
  { value: '400', label: 'Normal' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
];

const TEXT_TRANSFORMS = [
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'UPPER' },
  { value: 'lowercase', label: 'lower' },
  { value: 'capitalize', label: 'Title' },
];

export function TextSettings({ sectionId, elementPath, onClose }: TextSettingsProps) {
  const rawValue = useSelectedElementValue();
  const selection = useSelection();
  const pageId = useEditorStore(s => s.pageId);
  const updateElementValue = useEditorStore(s => s.updateElementValue);
  const removeTranslationKey = useEditorStore(s => s.removeTranslationKey);
  const clearSelection = useEditorStore(s => s.clearSelection);
  const startInlineEdit = useEditorStore(s => s.startInlineEdit);
  
  // Get translation key from selection state
  const selectionTranslationKey = selection.type === 'element' ? selection.translationKey : undefined;
  
  // Fallback: lookup key from database if not in selection state
  const { data: dbTranslationKey } = useQuery({
    queryKey: ['translation-key-lookup', pageId, sectionId, elementPath],
    queryFn: async () => {
      if (!pageId || !sectionId || !elementPath) return null;
      const { data } = await supabase
        .from('translation_keys')
        .select('key')
        .eq('page_id', pageId)
        .eq('section_id', sectionId)
        .eq('prop_path', elementPath)
        .maybeSingle();
      return data?.key ?? null;
    },
    enabled: !selectionTranslationKey && !!pageId && !!sectionId && !!elementPath,
    staleTime: 30000,
  });
  
  // Use selection key or DB key
  const translationKey = selectionTranslationKey || dbTranslationKey;

  // State for custom font size input
  const [customFontSize, setCustomFontSize] = useState('');

  // Parse the text props from the raw value
  const textProps: TextElementProps = useMemo(() => {
    if (typeof rawValue === 'string') {
      return { content: rawValue };
    }
    if (typeof rawValue === 'object' && rawValue !== null) {
      // Check if it's rich text (TipTap JSON) or structured props
      if ('type' in rawValue && rawValue.type === 'doc') {
        return { content: rawValue };
      }
      return rawValue as TextElementProps;
    }
    return { content: '' };
  }, [rawValue]);

  // Get the text content as string for display
  const textContent = useMemo(() => {
    const content = textProps.content;
    if (typeof content === 'string') return content;
    if (typeof content === 'object' && content !== null) {
      // Try to extract text from TipTap JSON
      try {
        const extractText = (node: any): string => {
          if (typeof node === 'string') return node;
          if (node.text) return node.text;
          if (node.content) return node.content.map(extractText).join('');
          return '';
        };
        return extractText(content);
      } catch {
        return '[Rich Text]';
      }
    }
    return '';
  }, [textProps.content]);

  // Check if content is rich text
  const isRichText = useMemo(() => {
    const content = textProps.content;
    return typeof content === 'object' && content !== null && 'type' in content;
  }, [textProps.content]);

  // Update text content
  const updateContent = useCallback((value: string) => {
    if (isRichText) {
      // For rich text, we'd need to update the TipTap JSON structure
      // For now, just wrap in a simple doc structure
      const newContent = {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: value }] }]
      };
      updateElementValue(sectionId, elementPath, { ...textProps, content: newContent });
    } else {
      updateElementValue(sectionId, elementPath, value);
    }
  }, [isRichText, textProps, sectionId, elementPath, updateElementValue]);

  // Update a specific style property
  const updateProp = useCallback(<K extends keyof TextElementProps>(
    key: K, 
    value: TextElementProps[K]
  ) => {
    const newProps = { ...textProps, [key]: value };
    updateElementValue(sectionId, elementPath, newProps);
  }, [textProps, sectionId, elementPath, updateElementValue]);

  // Handle removing translation key
  const handleRemoveKey = useCallback(() => {
    // removeTranslationKey would need sectionId and elementPath - simplified for now
    console.log('Remove translation key:', sectionId, elementPath);
  }, [sectionId, elementPath]);

  // Handle inline edit
  const handleInlineEdit = useCallback(() => {
    startInlineEdit();
    if (onClose) onClose();
    else clearSelection();
  }, [startInlineEdit, onClose, clearSelection]);

  const handleClose = () => {
    if (onClose) onClose();
    else clearSelection();
  };

  // translationKey is now computed above with DB fallback

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Text Settings</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid grid-cols-2 h-9 mx-2 mt-2">
            <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">Typography</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="p-3 space-y-4">
            {/* Text Content */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Content</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={handleInlineEdit}
                >
                  Edit Inline
                </Button>
              </div>
              {textContent.length > 100 ? (
                <Textarea
                  value={textContent}
                  onChange={(e) => updateContent(e.target.value)}
                  placeholder="Enter text..."
                  className="min-h-[100px] text-sm resize-y"
                />
              ) : (
                <Input
                  value={textContent}
                  onChange={(e) => updateContent(e.target.value)}
                  placeholder="Enter text..."
                  className="h-8 text-sm"
                />
              )}
              <p className="text-[10px] text-muted-foreground text-right">
                {textContent.length} characters
              </p>
              {isRichText && (
                <p className="text-[10px] text-amber-500">
                  This is rich text. Use inline editing for full formatting.
                </p>
              )}
            </div>

            {/* Translation Key */}
            <Collapsible defaultOpen={!!translationKey}>
              <CollapsibleTrigger className="flex items-center gap-2 w-full py-1.5 text-xs font-medium hover:text-foreground text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                <span>Translation Key</span>
                <ChevronDown className="h-3.5 w-3.5 ml-auto transition-transform [[data-state=open]>&]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 space-y-2">
                {translationKey ? (
                  <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted">
                    <code className="text-xs font-mono truncate flex-1">{translationKey}</code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 shrink-0"
                      onClick={handleRemoveKey}
                    >
                      <Unlink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No translation key linked. Select from picker to link.
                  </p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="style" className="p-3 space-y-4">
            {/* Font Size */}
            <div className="space-y-1.5">
              <Label className="text-xs">Font Size</Label>
              <Select 
                value={textProps.fontSize?.desktop || ''} 
                onValueChange={(v) => updateProp('fontSize', { desktop: v })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={customFontSize}
                onChange={(e) => setCustomFontSize(e.target.value)}
                onBlur={() => {
                  if (customFontSize) {
                    updateProp('fontSize', { desktop: customFontSize });
                    setCustomFontSize('');
                  }
                }}
                placeholder="Custom size (e.g., 2rem)"
                className="h-8 text-sm"
              />
            </div>

            {/* Font Weight */}
            <div className="space-y-1.5">
              <Label className="text-xs">Font Weight</Label>
              <Select 
                value={textProps.fontWeight || ''} 
                onValueChange={(v) => updateProp('fontWeight', v)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_WEIGHTS.map(w => (
                    <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Line Height */}
            <div className="space-y-1.5">
              <Label className="text-xs">Line Height</Label>
              <Select 
                value={textProps.lineHeight || ''} 
                onValueChange={(v) => updateProp('lineHeight', v)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  {LINE_HEIGHTS.map(lh => (
                    <SelectItem key={lh.value} value={lh.value}>{lh.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Letter Spacing */}
            <div className="space-y-1.5">
              <Label className="text-xs">Letter Spacing</Label>
              <Input
                value={textProps.letterSpacing || ''}
                onChange={(e) => updateProp('letterSpacing', e.target.value)}
                placeholder="e.g., 0.05em or 1px"
                className="h-8 text-sm"
              />
            </div>

            {/* Text Transform */}
            <div className="space-y-1.5">
              <Label className="text-xs">Text Transform</Label>
              <ToggleGroup 
                type="single" 
                value={textProps.textTransform || 'none'}
                onValueChange={(v) => v && updateProp('textTransform', v as TextElementProps['textTransform'])}
                className="justify-start"
              >
                {TEXT_TRANSFORMS.map(t => (
                  <ToggleGroupItem key={t.value} value={t.value} className="text-xs h-8">
                    {t.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Text Alignment */}
            <div className="space-y-1.5">
              <Label className="text-xs">Text Alignment</Label>
              <ToggleGroup 
                type="single" 
                value={textProps.textAlign || 'left'}
                onValueChange={(v) => v && updateProp('textAlign', v as TextElementProps['textAlign'])}
                className="justify-start"
              >
                <ToggleGroupItem value="left" className="h-8 w-8 p-0">
                  <AlignLeft className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" className="h-8 w-8 p-0">
                  <AlignCenter className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" className="h-8 w-8 p-0">
                  <AlignRight className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="justify" className="h-8 w-8 p-0">
                  <AlignJustify className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Text Color */}
            <div className="space-y-1.5">
              <Label className="text-xs">Text Color</Label>
              <ColorPickerPopover
                value={textProps.color || ''}
                onChange={(v) => updateProp('color', v)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}

export default TextSettings;
