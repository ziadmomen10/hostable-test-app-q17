import React from 'react';
import { SectionHeaderFields } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import { ItemListEditor } from '@/components/admin/sections/shared/ItemListEditor';
import { Image } from 'lucide-react';
import type { V2AffiliateAboutSectionData, V2AffiliateAboutItem } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2AffiliateAboutSectionData & BaseSectionData;
  onChange: (data: V2AffiliateAboutSectionData & BaseSectionData) => void;
}

export function V2AffiliateAboutSettingsContent({ data, onChange }: Props) {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      {/* Section Header (Optional) */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Section Title (Optional)</Label>
          <DebouncedInput 
            value={data.title || ''} 
            onChange={(v) => updateField('title', v)} 
            placeholder="e.g., About Our Affiliate Program"
            className="h-8 text-xs" 
            debounceMs={300} 
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Section Subtitle (Optional)</Label>
          <DebouncedInput 
            value={data.subtitle || ''} 
            onChange={(v) => updateField('subtitle', v)} 
            placeholder="Brief description of the section"
            multiline
            rows={2}
            className="resize-none text-xs" 
            debounceMs={300} 
          />
        </div>
      </div>

      {/* Cards List */}
      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">
          About Cards
        </h4>
        <ItemListEditor
          items={data.cards || []}
          onItemsChange={(cards) => updateArray('cards', cards)}
          createNewItem={() => ({
            id: crypto.randomUUID(),
            image: '/lovable-uploads/affiliate-about/about-1.png',
            tagline: 'New Card',
            title: 'Card Title',
            description: 'Card description goes here.',
          })}
          getItemTitle={(item: V2AffiliateAboutItem) => item.title || 'Untitled Card'}
          getItemIcon={() => <Image className="h-3 w-3 text-primary" />}
          minItems={1}
          maxItems={8}
          addItemLabel="Add Card"
          collapsible
          confirmDelete
          renderItem={(item: V2AffiliateAboutItem, index: number, onUpdate: (updates: Partial<V2AffiliateAboutItem>) => void) => (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Image URL</Label>
                <DebouncedInput
                  value={item.image}
                  onChange={(value) => onUpdate({ image: value })}
                  placeholder="https://example.com/image.png"
                  className="h-8 text-xs"
                  debounceMs={300}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tagline</Label>
                <DebouncedInput
                  value={item.tagline}
                  onChange={(value) => onUpdate({ tagline: value })}
                  placeholder="e.g., FEATURE"
                  className="h-8 text-xs"
                  debounceMs={300}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Title</Label>
                <DebouncedInput
                  value={item.title}
                  onChange={(value) => onUpdate({ title: value })}
                  placeholder="Card title"
                  className="h-8 text-xs"
                  debounceMs={300}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <DebouncedInput
                  value={item.description}
                  onChange={(value) => onUpdate({ description: value })}
                  placeholder="Describe this card..."
                  multiline
                  rows={3}
                  className="resize-none text-xs"
                  debounceMs={300}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default V2AffiliateAboutSettingsContent;
