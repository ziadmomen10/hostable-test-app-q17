import React from 'react';
import { SectionHeaderFields } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2CareerBenefits2SectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2CareerBenefits2SectionData & BaseSectionData;
  onChange: (data: V2CareerBenefits2SectionData & BaseSectionData) => void;
}

export function V2CareerBenefits2SettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateBenefit = (index: number, field: string, value: string) => {
    const benefits = [...(data.benefits || [])];
    benefits[index] = { ...benefits[index], [field]: value };
    updateField('benefits', benefits);
  };

  return (
    <div className="space-y-6 p-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Title</Label>
        <DebouncedInput value={data.title || ''} onChange={(v) => updateField('title', v)} className="h-8 text-xs" debounceMs={300} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Subtitle</Label>
        <Textarea value={data.subtitle || ''} onChange={(e) => updateField('subtitle', e.target.value)} className="text-xs min-h-[40px]" />
      </div>

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

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Benefits</h4>
        {(data.benefits || []).map((b, i) => (
          <div key={b.id || i} className="space-y-1.5 border-b pb-3">
            <Label className="text-xs">Title</Label>
            <DebouncedInput value={b.title || ''} onChange={(v) => updateBenefit(i, 'title', v)} className="h-8 text-xs" debounceMs={300} />
            <Label className="text-xs">Description</Label>
            <Textarea value={b.description || ''} onChange={(e) => updateBenefit(i, 'description', e.target.value)} className="text-xs min-h-[40px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default V2CareerBenefits2SettingsContent;
