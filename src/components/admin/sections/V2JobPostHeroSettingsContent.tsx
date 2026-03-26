import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2JobPostHeroSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2JobPostHeroSectionData & BaseSectionData;
  onChange: (data: V2JobPostHeroSectionData & BaseSectionData) => void;
}

export function V2JobPostHeroSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateDetail = (index: number, field: string, value: string) => {
    const jobDetails = [...(data.jobDetails || [])];
    jobDetails[index] = { ...jobDetails[index], [field]: value };
    updateField('jobDetails', jobDetails);
  };

  return (
    <div className="space-y-6 p-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Job Title</Label>
        <DebouncedInput value={data.title || ''} onChange={(v) => updateField('title', v)} className="h-8 text-xs" debounceMs={300} />
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Job Details</h4>
        {(data.jobDetails || []).map((detail, i) => (
          <div key={detail.id || i} className="space-y-1.5 border-b pb-3">
            <Label className="text-xs">Label</Label>
            <DebouncedInput value={detail.label || ''} onChange={(v) => updateDetail(i, 'label', v)} className="h-8 text-xs" debounceMs={300} />
            <Label className="text-xs">Value</Label>
            <DebouncedInput value={detail.value || ''} onChange={(v) => updateDetail(i, 'value', v)} className="h-8 text-xs" debounceMs={300} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default V2JobPostHeroSettingsContent;
