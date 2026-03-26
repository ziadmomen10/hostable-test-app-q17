/**
 * V2 Business Suite Section Settings
 */
import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { SectionHeaderFields, ItemListEditor } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2BusinessSuiteSectionData, V2ServiceCard } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface V2BusinessSuiteSettingsContentProps {
  data: V2BusinessSuiteSectionData & BaseSectionData;
  onChange: (data: V2BusinessSuiteSectionData & BaseSectionData) => void;
}

export function V2BusinessSuiteSettingsContent({ data, onChange }: V2BusinessSuiteSettingsContentProps) {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        onBadgeChange={(badge) => updateField('badge', badge)}
        onTitleChange={(title) => updateField('title', title)}
        showBadge={!!data.badge}
        onShowBadgeChange={(show) => updateField('badge', show ? 'Business Suite' : undefined)}
      />

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">
          Service Cards
        </h4>
        <ItemListEditor
          items={data.cards || []}
          onItemsChange={(cards) => updateArray('cards', cards)}
          createNewItem={() => ({
            id: crypto.randomUUID(),
            title: 'New Service',
            price: '$0.00',
            logo: '',
            mainImage: '',
            frameIcon: '',
            bgGradient: 'bg-[linear-gradient(0deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%),linear-gradient(0deg,rgba(157,195,50,1)_0%,rgba(157,195,50,1)_100%)]',
          })}
          getItemTitle={(item: V2ServiceCard) => item.title || 'Untitled Card'}
          getItemIcon={() => <LayoutGrid className="h-3 w-3 text-primary" />}
          minItems={1}
          maxItems={8}
          addItemLabel="Add Service Card"
          collapsible
          confirmDelete
          renderItem={(item: V2ServiceCard, _index: number, onUpdate: (updates: Partial<V2ServiceCard>) => void) => (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Title</Label>
                <DebouncedInput
                  value={item.title}
                  onChange={(value) => onUpdate({ title: value })}
                  placeholder="e.g., Hosting"
                  className="h-8 text-xs"
                  debounceMs={300}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Price</Label>
                <DebouncedInput
                  value={item.price}
                  onChange={(value) => onUpdate({ price: value })}
                  placeholder="e.g., $2.80"
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

export default V2BusinessSuiteSettingsContent;
