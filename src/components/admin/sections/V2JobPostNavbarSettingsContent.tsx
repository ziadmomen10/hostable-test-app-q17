import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2JobPostNavbarSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2JobPostNavbarSectionData & BaseSectionData;
  onChange: (data: V2JobPostNavbarSectionData & BaseSectionData) => void;
}

export function V2JobPostNavbarSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Banner Text</Label>
        <DebouncedInput value={data.bannerText || ''} onChange={(v) => updateField('bannerText', v)} className="h-8 text-xs" debounceMs={300} />
      </div>
    </div>
  );
}

export default V2JobPostNavbarSettingsContent;
