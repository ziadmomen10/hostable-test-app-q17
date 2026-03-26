import React from 'react';
import { Heart } from 'lucide-react';
import { SectionHeaderFields, ItemListEditor } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2CareerBenefitsSectionData, V2CareerBenefitItem } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2CareerBenefitsSectionData & BaseSectionData;
  onChange: (data: V2CareerBenefitsSectionData & BaseSectionData) => void;
}

export function V2CareerBenefitsSettingsContent({ data, onChange }: Props) {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        title={data.title}
        subtitle={data.subtitle}
        onTitleChange={(title) => updateField('title', title)}
        onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
      />

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Button</h4>
        <div className="space-y-1.5">
          <Label className="text-xs">Button Text</Label>
          <DebouncedInput value={data.buttonText || ''} onChange={(v) => updateField('buttonText', v)} className="h-8 text-xs" debounceMs={300} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Button Link</Label>
          <DebouncedInput value={data.buttonLink || ''} onChange={(v) => updateField('buttonLink', v)} className="h-8 text-xs" debounceMs={300} />
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">Benefit Cards</h4>
        <ItemListEditor
          items={data.benefits || []}
          onItemsChange={(benefits) => updateArray('benefits', benefits)}
          createNewItem={() => ({ id: Date.now(), icon: '', title: 'New Benefit', description: 'Describe this benefit.' })}
          getItemTitle={(item: V2CareerBenefitItem) => item.title || 'Untitled'}
          getItemIcon={() => <Heart className="h-3 w-3 text-primary" />}
          minItems={1}
          maxItems={8}
          addItemLabel="Add Benefit"
          collapsible
          confirmDelete
          renderItem={(item: V2CareerBenefitItem, _i: number, onUpdate: (u: Partial<V2CareerBenefitItem>) => void) => (
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

export default V2CareerBenefitsSettingsContent;
