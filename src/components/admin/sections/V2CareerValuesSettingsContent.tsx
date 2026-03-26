import React from 'react';
import { Compass } from 'lucide-react';
import { SectionHeaderFields, ItemListEditor } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2CareerValuesSectionData, V2CareerValueItem } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2CareerValuesSectionData & BaseSectionData;
  onChange: (data: V2CareerValuesSectionData & BaseSectionData) => void;
}

export function V2CareerValuesSettingsContent({ data, onChange }: Props) {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(badge) => updateField('badge', badge)}
        onTitleChange={(title) => updateField('title', title)}
        onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
        showBadge={!!data.badge}
        onShowBadgeChange={(show) => updateField('badge', show ? '4 PRINCIPLES' : '')}
      />

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Image</h4>
        <div className="space-y-1.5">
          <Label className="text-xs">Image URL</Label>
          <DebouncedInput value={data.image || ''} onChange={(v) => updateField('image', v)} className="h-8 text-xs" debounceMs={300} />
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">Values</h4>
        <ItemListEditor
          items={data.values || []}
          onItemsChange={(values) => updateArray('values', values)}
          createNewItem={() => ({ id: Date.now(), icon: '', title: 'New Value', description: 'Describe this value.' })}
          getItemTitle={(item: V2CareerValueItem) => item.title || 'Untitled'}
          getItemIcon={() => <Compass className="h-3 w-3 text-primary" />}
          minItems={1}
          maxItems={8}
          addItemLabel="Add Value"
          collapsible
          confirmDelete
          renderItem={(item: V2CareerValueItem, _i: number, onUpdate: (u: Partial<V2CareerValueItem>) => void) => (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Title</Label>
                <DebouncedInput value={item.title} onChange={(v) => onUpdate({ title: v })} className="h-8 text-xs" debounceMs={300} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <DebouncedInput value={item.description} onChange={(v) => onUpdate({ description: v })} multiline rows={2} className="resize-none text-xs" debounceMs={300} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Icon URL</Label>
                <DebouncedInput value={item.icon} onChange={(v) => onUpdate({ icon: v })} className="h-8 text-xs" debounceMs={300} />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default V2CareerValuesSettingsContent;
