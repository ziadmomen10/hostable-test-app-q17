import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2JobPostGallerySectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2JobPostGallerySectionData & BaseSectionData;
  onChange: (data: V2JobPostGallerySectionData & BaseSectionData) => void;
}

export function V2JobPostGallerySettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateImage = (index: number, field: string, value: string) => {
    const images = [...(data.images || [])];
    images[index] = { ...images[index], [field]: value };
    updateField('images', images);
  };

  return (
    <div className="space-y-6 p-3">
      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Images</h4>
        {(data.images || []).map((img, i) => (
          <div key={img.id || i} className="space-y-1.5 border-b pb-3">
            <Label className="text-xs">Image URL</Label>
            <DebouncedInput value={img.src || ''} onChange={(v) => updateImage(i, 'src', v)} className="h-8 text-xs" debounceMs={300} />
            <Label className="text-xs">Alt Text</Label>
            <DebouncedInput value={img.alt || ''} onChange={(v) => updateImage(i, 'alt', v)} className="h-8 text-xs" debounceMs={300} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default V2JobPostGallerySettingsContent;
