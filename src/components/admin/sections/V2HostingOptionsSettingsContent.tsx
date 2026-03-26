/**
 * V2 Hosting Options Section Settings
 */
import React from 'react';
import { Server } from 'lucide-react';
import { SectionHeaderFields, ItemListEditor } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2HostingOptionsSectionData, V2HostingOption } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface V2HostingOptionsSettingsContentProps {
  data: V2HostingOptionsSectionData & BaseSectionData;
  onChange: (data: V2HostingOptionsSectionData & BaseSectionData) => void;
}

export function V2HostingOptionsSettingsContent({ data, onChange }: V2HostingOptionsSettingsContentProps) {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        title={data.title}
        onTitleChange={(title) => updateField('title', title)}
      />

      <div className="flex items-center justify-between pt-2 border-t">
        <Label className="text-xs font-medium">Show Promo Banner</Label>
        <Switch
          checked={!!data.showPromoBanner}
          onCheckedChange={(checked) => updateField('showPromoBanner', checked)}
        />
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">
          Hosting Options
        </h4>
        <ItemListEditor
          items={data.hostingOptions || []}
          onItemsChange={(options) => updateArray('hostingOptions', options)}
          createNewItem={() => ({
            id: Date.now(),
            icon: '',
            title: 'New Hosting',
            price: '$0.00',
            bestFor: 'NEW SITES',
            ratingBars: 3,
          })}
          getItemTitle={(item: V2HostingOption) => item.title || 'Untitled Option'}
          getItemSubtitle={(item: V2HostingOption) => item.bestFor}
          getItemIcon={() => <Server className="h-3 w-3 text-primary" />}
          minItems={1}
          maxItems={12}
          addItemLabel="Add Hosting Option"
          collapsible
          confirmDelete
          renderItem={(item: V2HostingOption, _index: number, onUpdate: (updates: Partial<V2HostingOption>) => void) => (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Title</Label>
                <DebouncedInput
                  value={item.title}
                  onChange={(value) => onUpdate({ title: value })}
                  placeholder="e.g., VPS Hosting"
                  className="h-8 text-xs"
                  debounceMs={300}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Price</Label>
                  <DebouncedInput
                    value={item.price}
                    onChange={(value) => onUpdate({ price: value })}
                    placeholder="$2.80"
                    className="h-8 text-xs"
                    debounceMs={300}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Rating (1–5)</Label>
                  <DebouncedInput
                    value={String(item.ratingBars)}
                    onChange={(value) => onUpdate({ ratingBars: Math.min(5, Math.max(1, parseInt(value) || 1)) })}
                    placeholder="3"
                    className="h-8 text-xs"
                    debounceMs={300}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Best For</Label>
                <DebouncedInput
                  value={item.bestFor}
                  onChange={(value) => onUpdate({ bestFor: value })}
                  placeholder="e.g., SCALE & CUSTOM SETUPS"
                  className="h-8 text-xs"
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

export default V2HostingOptionsSettingsContent;
