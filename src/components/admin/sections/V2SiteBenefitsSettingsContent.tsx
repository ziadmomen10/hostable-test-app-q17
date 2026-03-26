import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2SiteBenefitsSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2SiteBenefitsSectionData & BaseSectionData;
  onChange: (data: V2SiteBenefitsSectionData & BaseSectionData) => void;
}

export function V2SiteBenefitsSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const cardFields = [
    { key: 'card1', label: 'Card 1 (Security)' },
    { key: 'card2', label: 'Card 2 (AI Tools)' },
    { key: 'card3', label: 'Card 3 (Backups)' },
    { key: 'card4', label: 'Card 4 (Performance)' },
    { key: 'card5', label: 'Card 5 (Money-back)' },
  ];

  return (
    <div className="space-y-6 p-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Badge</Label>
        <DebouncedInput value={data.badge || ''} onChange={(v) => updateField('badge', v)} className="h-8 text-xs" debounceMs={300} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Title</Label>
        <DebouncedInput value={data.title || ''} onChange={(v) => updateField('title', v)} className="h-8 text-xs" debounceMs={300} />
      </div>

      {cardFields.map(({ key, label }) => (
        <div key={key} className="pt-4 border-t space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">{label}</h4>
          <div className="space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Textarea value={(data as any)[`${key}Title`] || ''} onChange={(e) => updateField(`${key}Title` as any, e.target.value)} className="text-xs min-h-[40px]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Subtitle</Label>
            <Textarea value={(data as any)[`${key}Subtitle`] || ''} onChange={(e) => updateField(`${key}Subtitle` as any, e.target.value)} className="text-xs min-h-[40px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default V2SiteBenefitsSettingsContent;
