import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2AffiliateWhoIsItForSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2AffiliateWhoIsItForSectionData & BaseSectionData;
  onChange: (data: V2AffiliateWhoIsItForSectionData & BaseSectionData) => void;
}

export function V2AffiliateWhoIsItForSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateItem = (index: number, field: string, value: string) => {
    const items = [...(data.items || [])];
    items[index] = { ...items[index], [field]: value };
    updateField('items', items);
  };

  return (
    <div className="space-y-6 p-3">
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Header
        </h4>
        <div className="space-y-1.5">
          <Label className="text-xs">Title</Label>
          <DebouncedInput
            value={data.title || ''}
            onChange={(value) => updateField('title', value)}
            placeholder="e.g., Who is Our Affiliate Program For?"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Subtitle</Label>
          <Textarea
            value={data.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="e.g., Every Guide is trained and excited..."
            className="text-xs min-h-[60px]"
          />
        </div>
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Button</h4>
        <div className="space-y-1.5">
          <Label className="text-xs">Button Text</Label>
          <DebouncedInput
            value={data.buttonText || ''}
            onChange={(value) => updateField('buttonText', value)}
            placeholder="e.g., Become an Affiliate"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Button Link</Label>
          <DebouncedInput
            value={data.buttonLink || ''}
            onChange={(value) => updateField('buttonLink', value)}
            placeholder="e.g., /affiliate"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Items
        </h4>
        {(data.items || []).map((item, index) => (
          <div key={item.id || index} className="space-y-1.5 border-b pb-3 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-semibold">Item {index + 1}</Label>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Icon URL</Label>
              <DebouncedInput
                value={item.icon || ''}
                onChange={(value) => updateItem(index, 'icon', value)}
                placeholder="/lovable-uploads/affiliate-who-is-it-for/icon.svg"
                className="h-8 text-xs"
                debounceMs={300}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Title</Label>
              <DebouncedInput
                value={item.title || ''}
                onChange={(value) => updateItem(index, 'title', value)}
                placeholder="e.g., Content Creators"
                className="h-8 text-xs"
                debounceMs={300}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={item.description || ''}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                placeholder="e.g., Bloggers, YouTubers, and influencers..."
                className="text-xs min-h-[60px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default V2AffiliateWhoIsItForSettingsContent;
