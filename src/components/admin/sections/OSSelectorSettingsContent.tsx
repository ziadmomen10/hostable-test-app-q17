/**
 * OS Selector Settings Content
 * Fully controlled - derives from initialData, calls onDataChange directly.
 */

import React, { useState, useCallback } from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { OSSelectorSectionData, OSItem } from '@/types/newSectionTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionHeaderFields, IconPicker, getIconComponent } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface OSSelectorSettingsContentProps {
  data: OSSelectorSectionData;
  onChange: (data: OSSelectorSectionData) => void;
}

const OSSelectorSettingsContent: React.FC<OSSelectorSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateField, updateArray, dataRef } = useDataChangeHandlers(data, onChange);
  const [expandedItem, setExpandedItem] = useState<number | null>(0);

  const updateItem = useCallback((index: number, updates: Partial<OSItem>) => {
    const newItems = [...dataRef.current.items];
    newItems[index] = { ...newItems[index], ...updates };
    updateArray('items', newItems);
  }, [updateArray, dataRef]);

  const addItem = useCallback(() => {
    const newItem: OSItem = {
      icon: '🖥️',
      name: 'New OS',
      category: dataRef.current.categories[0] || 'Operating Systems',
      badge: '',
    };
    updateArray('items', [...dataRef.current.items, newItem]);
    setExpandedItem(dataRef.current.items.length);
  }, [updateArray, dataRef]);

  const removeItem = useCallback((index: number) => {
    const newItems = dataRef.current.items.filter((_, i) => i !== index);
    updateArray('items', newItems);
    if (expandedItem === index) setExpandedItem(null);
  }, [updateArray, dataRef, expandedItem]);

  const updateCategory = useCallback((index: number, value: string) => {
    const newCategories = [...dataRef.current.categories];
    newCategories[index] = value;
    updateArray('categories', newCategories);
  }, [updateArray, dataRef]);

  const addCategory = useCallback(() => {
    updateArray('categories', [...dataRef.current.categories, 'New Category']);
  }, [updateArray, dataRef]);

  const removeCategory = useCallback((index: number) => {
    const newCategories = dataRef.current.categories.filter((_, i) => i !== index);
    updateArray('categories', newCategories);
  }, [updateArray, dataRef]);

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-3">
        <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
        <TabsTrigger value="items" className="text-xs">Items</TabsTrigger>
        <TabsTrigger value="categories" className="text-xs">Categories</TabsTrigger>
      </TabsList>

      {/* Content Tab */}
      <TabsContent value="content" className="space-y-3 p-3">
        <SectionHeaderFields
          badge={data.badge || ''}
          title={data.title}
          subtitle={data.subtitle || ''}
          onBadgeChange={(badge) => updateField('badge', badge)}
          onTitleChange={(title) => updateField('title', title)}
          onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
        />
      </TabsContent>

      {/* Items Tab */}
      <TabsContent value="items" className="p-3">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-xs font-medium">OS Items ({data.items.length})</Label>
          <Button variant="ghost" size="sm" onClick={addItem} className="h-6 px-2 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>

        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {data.items.map((item, index) => (
            <Collapsible
              key={index}
              open={expandedItem === index}
              onOpenChange={(open) => setExpandedItem(open ? index : null)}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded cursor-pointer hover:bg-muted">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                    {(() => {
                      const IconComponent = getIconComponent(item.icon || 'Monitor');
                      return <IconComponent className="h-4 w-4 text-primary" />;
                    })()}
                    <span className="text-xs font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                    {expandedItem === index ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-2 space-y-2 border rounded-b bg-background">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px]">Icon</Label>
                    <IconPicker
                      value={item.icon || 'Monitor'}
                      onChange={(v) => updateItem(index, { icon: v })}
                    />
                  </div>
                  <div>
                    <Label className="text-[10px]">Name</Label>
                    <DebouncedInput
                      value={item.name}
                      onChange={(value) => updateItem(index, { name: value })}
                      className="h-7 text-xs"
                      debounceMs={300}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px]">Category</Label>
                    <Select
                      value={item.category}
                      onValueChange={(value) => updateItem(index, { category: value })}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {data.categories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-xs">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px]">Badge</Label>
                    <DebouncedInput
                      value={item.badge || ''}
                      onChange={(value) => updateItem(index, { badge: value })}
                      placeholder="Popular"
                      className="h-7 text-xs"
                      debounceMs={300}
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </TabsContent>

      {/* Categories Tab */}
      <TabsContent value="categories" className="p-3">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-xs font-medium">Categories ({data.categories.length})</Label>
          <Button variant="ghost" size="sm" onClick={addCategory} className="h-6 px-2 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>

        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {data.categories.map((cat, index) => (
            <div key={index} className="flex gap-2 items-center">
              <GripVertical className="h-3 w-3 text-muted-foreground" />
              <DebouncedInput
                value={cat}
                onChange={(value) => updateCategory(index, value)}
                className="h-8 text-xs flex-1"
                debounceMs={300}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCategory(index)}
                className="h-8 w-8 p-0 text-destructive"
                disabled={data.categories.length <= 1}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </TabsContent>

    </Tabs>
  );
};

export default OSSelectorSettingsContent;
