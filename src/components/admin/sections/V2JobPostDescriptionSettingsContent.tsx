import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2JobPostDescriptionSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2JobPostDescriptionSectionData & BaseSectionData;
  onChange: (data: V2JobPostDescriptionSectionData & BaseSectionData) => void;
}

export function V2JobPostDescriptionSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateSection = (index: number, field: string, value: string) => {
    const sections = [...(data.sections || [])];
    sections[index] = { ...sections[index], [field]: value };
    updateField('sections', sections);
  };

  return (
    <div className="space-y-6 p-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Apply Button Text</Label>
        <DebouncedInput value={data.applyText || ''} onChange={(v) => updateField('applyText', v)} className="h-8 text-xs" debounceMs={300} />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Share Button Text</Label>
        <DebouncedInput value={data.shareText || ''} onChange={(v) => updateField('shareText', v)} className="h-8 text-xs" debounceMs={300} />
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Sections</h4>
        {(data.sections || []).map((section, i) => (
          <div key={section.id || i} className="space-y-1.5 border-b pb-3">
            <Label className="text-xs">Title</Label>
            <DebouncedInput value={section.title || ''} onChange={(v) => updateSection(i, 'title', v)} className="h-8 text-xs" debounceMs={300} />
            <Label className="text-xs">Content</Label>
            <Textarea value={section.content || ''} onChange={(e) => updateSection(i, 'content', e.target.value)} className="text-xs min-h-[80px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default V2JobPostDescriptionSettingsContent;
