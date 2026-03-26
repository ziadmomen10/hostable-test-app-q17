import React from 'react';
import { Briefcase } from 'lucide-react';
import { SectionHeaderFields, ItemListEditor } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2CareerOpeningsSectionData, V2CareerJobCategory, V2CareerJob } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2CareerOpeningsSectionData & BaseSectionData;
  onChange: (data: V2CareerOpeningsSectionData & BaseSectionData) => void;
}

export function V2CareerOpeningsSettingsContent({ data, onChange }: Props) {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  const updateCategory = (catIndex: number, updates: Partial<V2CareerJobCategory>) => {
    const categories = [...(data.categories || [])];
    categories[catIndex] = { ...categories[catIndex], ...updates };
    updateArray('categories', categories);
  };

  const updateJob = (catIndex: number, jobIndex: number, updates: Partial<V2CareerJob>) => {
    const categories = [...(data.categories || [])];
    const jobs = [...categories[catIndex].jobs];
    jobs[jobIndex] = { ...jobs[jobIndex], ...updates };
    categories[catIndex] = { ...categories[catIndex], jobs };
    updateArray('categories', categories);
  };

  const addJob = (catIndex: number) => {
    const categories = [...(data.categories || [])];
    const jobs = [...categories[catIndex].jobs, { id: Date.now(), title: 'New Position', description: 'Job description', location: 'Remote', type: 'Full Time' }];
    categories[catIndex] = { ...categories[catIndex], jobs };
    updateArray('categories', categories);
  };

  const removeJob = (catIndex: number, jobIndex: number) => {
    const categories = [...(data.categories || [])];
    const jobs = categories[catIndex].jobs.filter((_, i) => i !== jobIndex);
    categories[catIndex] = { ...categories[catIndex], jobs };
    updateArray('categories', categories);
  };

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        title={data.title}
        subtitle={data.subtitle}
        onTitleChange={(title) => updateField('title', title)}
        onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
      />

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Search</h4>
        <div className="space-y-1.5">
          <Label className="text-xs">Placeholder Text</Label>
          <DebouncedInput value={data.searchPlaceholder || ''} onChange={(v) => updateField('searchPlaceholder', v)} className="h-8 text-xs" debounceMs={300} />
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">Job Categories</h4>
        <ItemListEditor
          items={data.categories || []}
          onItemsChange={(categories) => updateArray('categories', categories)}
          createNewItem={() => ({ id: Date.now(), category: 'New Category', categoryIcon: '', jobs: [] })}
          getItemTitle={(item: V2CareerJobCategory) => `${item.category} (${item.jobs.length} jobs)`}
          getItemIcon={() => <Briefcase className="h-3 w-3 text-primary" />}
          minItems={1}
          maxItems={20}
          addItemLabel="Add Category"
          collapsible
          confirmDelete
          renderItem={(item: V2CareerJobCategory, catIndex: number, onUpdate: (u: Partial<V2CareerJobCategory>) => void) => (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Category Name</Label>
                <DebouncedInput value={item.category} onChange={(v) => onUpdate({ category: v })} className="h-8 text-xs" debounceMs={300} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Icon URL</Label>
                <DebouncedInput value={item.categoryIcon} onChange={(v) => onUpdate({ categoryIcon: v })} className="h-8 text-xs" debounceMs={300} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Jobs ({item.jobs.length})</Label>
                  <button onClick={() => addJob(catIndex)} className="text-xs text-primary hover:underline">+ Add Job</button>
                </div>
                {item.jobs.map((job, jobIndex) => (
                  <div key={job.id} className="p-2 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium truncate">{job.title}</span>
                      <button onClick={() => removeJob(catIndex, jobIndex)} className="text-xs text-destructive hover:underline">Remove</button>
                    </div>
                    <DebouncedInput value={job.title} onChange={(v) => updateJob(catIndex, jobIndex, { title: v })} placeholder="Job title" className="h-7 text-xs" debounceMs={300} />
                    <DebouncedInput value={job.description} onChange={(v) => updateJob(catIndex, jobIndex, { description: v })} placeholder="Description" className="h-7 text-xs" debounceMs={300} />
                    <div className="flex gap-2">
                      <DebouncedInput value={job.location} onChange={(v) => updateJob(catIndex, jobIndex, { location: v })} placeholder="Location" className="h-7 text-xs flex-1" debounceMs={300} />
                      <DebouncedInput value={job.type} onChange={(v) => updateJob(catIndex, jobIndex, { type: v })} placeholder="Type" className="h-7 text-xs flex-1" debounceMs={300} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default V2CareerOpeningsSettingsContent;
