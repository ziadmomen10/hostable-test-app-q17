import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2CareerGallerySectionData, V2CareerGalleryImage } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2CareerGallerySectionData & BaseSectionData;
  onChange: (data: V2CareerGallerySectionData & BaseSectionData) => void;
}

export function V2CareerGallerySettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateImage = (index: number, updates: Partial<V2CareerGalleryImage>) => {
    const images = [...(data.images || [])];
    images[index] = { ...images[index], ...updates };
    updateField('images', images);
  };

  return (
    <div className="space-y-6 p-3">
      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Gallery Images</h4>
      {(data.images || []).map((image, index) => (
        <div key={image.id} className="space-y-2 p-3 border rounded-lg">
          <p className="text-xs font-medium text-muted-foreground">Image {index + 1}</p>
          <div className="space-y-1.5">
            <Label className="text-xs">Image URL</Label>
            <DebouncedInput value={image.src} onChange={(v) => updateImage(index, { src: v })} className="h-8 text-xs" debounceMs={300} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Alt Text</Label>
            <DebouncedInput value={image.alt} onChange={(v) => updateImage(index, { alt: v })} className="h-8 text-xs" debounceMs={300} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default V2CareerGallerySettingsContent;
