/**
 * Bento Grid Settings Content
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { LayoutGrid } from 'lucide-react';
import { BentoGridSectionData, BentoGridItem } from '@/types/newSectionTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionHeaderFields, ItemListEditor, IconPicker, getIconComponent } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface BentoGridSettingsContentProps {
  data: BentoGridSectionData;
  onChange: (data: BentoGridSectionData) => void;
}

const BentoGridSettingsContent: React.FC<BentoGridSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateFields, updateArray } = useDataChangeHandlers(data, onChange);

  const handleItemsChange = useCallback((items: BentoGridItem[]) => {
    updateArray('items', items);
  }, [updateArray]);

  const createNewItem = useCallback((): BentoGridItem => ({
    title: 'New Feature',
    description: 'Feature description',
    icon: '⭐',
    size: 'small',
    span: 1,
  }), []);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        badge={data.badge || ''}
        title={data.title}
        subtitle={data.subtitle || ''}
        onBadgeChange={(badge) => updateFields({ badge })}
        onTitleChange={(title) => updateFields({ title })}
        onSubtitleChange={(subtitle) => updateFields({ subtitle })}
      />

      <div className="border-t pt-4">
        <h4 className="font-medium text-sm mb-3">Grid Items</h4>
        <ItemListEditor
          items={data.items}
          onItemsChange={handleItemsChange}
          createNewItem={createNewItem}
          getItemTitle={(item) => item.title || 'Untitled Item'}
          getItemSubtitle={(item) => `${item.size} • ${item.span || 1} col`}
          getItemIcon={(item) => {
            const IconComponent = getIconComponent(item.icon || 'Star');
            return <IconComponent className="h-4 w-4 text-primary" />;
          }}
          addItemLabel="Add Grid Item"
          emptyMessage="No items. Add one to get started."
          emptyStateIcon={<LayoutGrid className="h-10 w-10 text-muted-foreground/50 mb-2" />}
          minItems={1}
          maxItems={12}
          showDuplicateButton
          confirmDelete
          renderItem={(item, index, onUpdate) => (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px]">Icon</Label>
                  <IconPicker
                    value={item.icon || 'Star'}
                    onChange={(v) => onUpdate({ icon: v })}
                  />
                </div>
                <div>
                  <Label className="text-[10px]">Title</Label>
                  <DebouncedInput
                    value={item.title}
                    onChange={(value) => onUpdate({ title: value })}
                    className="h-7 text-xs"
                    debounceMs={300}
                  />
                </div>
              </div>
              <div>
                <Label className="text-[10px]">Description</Label>
                <DebouncedInput
                  value={item.description}
                  onChange={(value) => onUpdate({ description: value })}
                  multiline
                  rows={2}
                  className="min-h-[50px] text-xs resize-none"
                  debounceMs={300}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px]">Size</Label>
                  <Select
                    value={item.size}
                    onValueChange={(value) => onUpdate({ size: value as 'small' | 'medium' | 'large' })}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small" className="text-xs">Small</SelectItem>
                      <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                      <SelectItem value="large" className="text-xs">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[10px]">Column Span</Label>
                  <Select
                    value={String(item.span || 1)}
                    onValueChange={(value) => onUpdate({ span: parseInt(value) as 1 | 2 })}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1" className="text-xs">1 Column</SelectItem>
                      <SelectItem value="2" className="text-xs">2 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-[10px]">Image URL (optional)</Label>
                <DebouncedInput
                  value={item.image || ''}
                  onChange={(value) => onUpdate({ image: value })}
                  placeholder="/path/to/image.jpg"
                  className="h-7 text-xs"
                  debounceMs={300}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default BentoGridSettingsContent;
