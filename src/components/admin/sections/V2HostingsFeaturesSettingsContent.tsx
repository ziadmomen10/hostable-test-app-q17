import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2HostingsFeaturesSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2HostingsFeaturesSectionData & BaseSectionData;
  onChange: (data: V2HostingsFeaturesSectionData & BaseSectionData) => void;
}

export function V2HostingsFeaturesSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateHosting = (index: number, field: string, value: string | number) => {
    const hostings = [...(data.hostings || [])];
    hostings[index] = { ...hostings[index], [field]: value };
    updateField('hostings', hostings);
  };

  return (
    <div className="space-y-6 p-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Title</Label>
        <DebouncedInput value={data.title || ''} onChange={(v) => updateField('title', v)} className="h-8 text-xs" debounceMs={300} />
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Hosting Cards</h4>
        {(data.hostings || []).map((h, i) => (
          <div key={h.id || i} className="space-y-1.5 border-b pb-3">
            <Label className="text-xs">Title</Label>
            <DebouncedInput value={h.title || ''} onChange={(v) => updateHosting(i, 'title', v)} className="h-8 text-xs" debounceMs={300} />
            <Label className="text-xs">Price</Label>
            <DebouncedInput value={h.price || ''} onChange={(v) => updateHosting(i, 'price', v)} className="h-8 text-xs" debounceMs={300} />
            <Label className="text-xs">Best For</Label>
            <DebouncedInput value={h.bestFor || ''} onChange={(v) => updateHosting(i, 'bestFor', v)} className="h-8 text-xs" debounceMs={300} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default V2HostingsFeaturesSettingsContent;
