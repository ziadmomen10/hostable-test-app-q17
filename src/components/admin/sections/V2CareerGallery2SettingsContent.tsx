import React from 'react';
import { Label } from '@/components/ui/label';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2CareerGallery2SectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2CareerGallery2SectionData & BaseSectionData;
  onChange: (data: V2CareerGallery2SectionData & BaseSectionData) => void;
}

export function V2CareerGallery2SettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateImage = (index: number, field: string, value: string) => {
    const images = [...(data.images || [])];
    images[index] = { ...images[index], [field]: value };
    updateField('images', images);
  };

  return (
    <div className="space-y-6 p-3">
      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Gallery Images</h4>
      {(data.images || []).map((img, i) => (
        <div key={img.id || i} className="space-y-1.5 border-b pb-3">
          <Label className="text-xs">Image {i + 1} URL</Label>
          <DebouncedInput value={img.src || ''} onChange={(v) => updateImage(i, 'src', v)} className="h-8 text-xs" debounceMs={300} />
          <Label className="text-xs">Alt Text</Label>
          <DebouncedInput value={img.alt || ''} onChange={(v) => updateImage(i, 'alt', v)} className="h-8 text-xs" debounceMs={300} />
        </div>
      ))}
    </div>
  );
}

export default V2CareerGallery2SettingsContent;
