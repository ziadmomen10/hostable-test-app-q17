import React from 'react';
import { SectionHeaderFields } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2CareerValues2SectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2CareerValues2SectionData & BaseSectionData;
  onChange: (data: V2CareerValues2SectionData & BaseSectionData) => void;
}

export function V2CareerValues2SettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateValue = (index: number, field: string, value: string) => {
    const values = [...(data.values || [])];
    values[index] = { ...values[index], [field]: value };
    updateField('values', values);
  };

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        onBadgeChange={(badge) => updateField('badge', badge)}
        onTitleChange={(title) => updateField('title', title)}
        showBadge={!!data.badge}
        onShowBadgeChange={(show) => updateField('badge', show ? '4 PRINCIPLES' : '')}
      />

      <div className="space-y-1.5">
        <Label className="text-xs">Subtitle</Label>
        <Textarea value={data.subtitle || ''} onChange={(e) => updateField('subtitle', e.target.value)} className="text-xs min-h-[60px]" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Image URL</Label>
        <DebouncedInput value={data.image || ''} onChange={(v) => updateField('image', v)} className="h-8 text-xs" debounceMs={300} />
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Values</h4>
        {(data.values || []).map((val, i) => (
          <div key={val.id || i} className="space-y-1.5 border-b pb-3">
            <Label className="text-xs">Title</Label>
            <DebouncedInput value={val.title || ''} onChange={(v) => updateValue(i, 'title', v)} className="h-8 text-xs" debounceMs={300} />
            <Label className="text-xs">Description</Label>
            <Textarea value={val.description || ''} onChange={(e) => updateValue(i, 'description', e.target.value)} className="text-xs min-h-[40px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default V2CareerValues2SettingsContent;
