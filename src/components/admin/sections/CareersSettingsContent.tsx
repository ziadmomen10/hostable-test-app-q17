/**
 * Careers Section Settings
 * Settings panel for managing job listings
 * 
 * Created following SECTION_DEVELOPER_GUIDE.md
 */

import React from 'react';
import { Briefcase } from 'lucide-react';
import { SectionHeaderFields, ItemListEditor } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { CareersSectionData, JobItem } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface CareersSettingsContentProps {
  data: CareersSectionData & BaseSectionData;
  onChange: (data: CareersSectionData & BaseSectionData) => void;
}

// ============================================
// JOB TYPE OPTIONS
// ============================================

const jobTypeOptions = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Internship', label: 'Internship' },
];

const columnOptions = [
  { value: '2', label: '2 Columns' },
  { value: '3', label: '3 Columns' },
  { value: '4', label: '4 Columns' },
];

// ============================================
// COMPONENT
// ============================================

export function CareersSettingsContent({ data, onChange }: CareersSettingsContentProps) {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      {/* ============================================ */}
      {/* SECTION HEADER */}
      {/* ============================================ */}
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(badge) => updateField('badge', badge)}
        onTitleChange={(title) => updateField('title', title)}
        onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
        showBadge={!!data.badge}
        onShowBadgeChange={(show) => updateField('badge', show ? "We're Hiring" : undefined)}
      />

      {/* ============================================ */}
      {/* LAYOUT OPTIONS */}
      {/* ============================================ */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Layout Options
        </h4>
        <div className="space-y-1.5">
          <Label className="text-xs">Columns</Label>
          <Select
            value={String(data.columns || 3)}
            onValueChange={(value) => updateField('columns', parseInt(value, 10) as 2 | 3 | 4)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {columnOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ============================================ */}
      {/* JOB LISTINGS */}
      {/* ============================================ */}
      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">
          Job Openings
        </h4>
        <ItemListEditor
          items={data.jobs || []}
          onItemsChange={(jobs) => updateArray('jobs', jobs)}
          
          // Factory function to create new items
          createNewItem={() => ({
            id: crypto.randomUUID(),
            title: 'New Position',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time',
            remote: true,
            description: 'We are looking for a talented individual to join our team.',
            applyUrl: '#',
          })}
          
          // Item display options
          getItemTitle={(item: JobItem) => item.title || 'Untitled Position'}
          getItemSubtitle={(item: JobItem) => `${item.department} • ${item.location}`}
          getItemIcon={() => <Briefcase className="h-3 w-3 text-primary" />}
          
          // Item constraints and features
          minItems={0}
          maxItems={20}
          addItemLabel="Add Job Opening"
          emptyMessage="No job openings yet. Add your first position!"
          emptyStateIcon={<Briefcase className="h-10 w-10 text-muted-foreground/50 mb-2" />}
          showDuplicateButton
          confirmDelete
          collapsible
          
          // Render function for each item's fields
          renderItem={(item: JobItem, index: number, onUpdate: (updates: Partial<JobItem>) => void) => (
            <div className="space-y-4">
              {/* Job Title */}
              <div className="space-y-1.5">
                <Label className="text-xs">Job Title</Label>
                <DebouncedInput
                  value={item.title}
                  onChange={(value) => onUpdate({ title: value })}
                  placeholder="e.g., Senior React Developer"
                  className="h-8 text-xs"
                  debounceMs={300}
                />
              </div>

              {/* Department & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Department</Label>
                  <DebouncedInput
                    value={item.department}
                    onChange={(value) => onUpdate({ department: value })}
                    placeholder="e.g., Engineering"
                    className="h-8 text-xs"
                    debounceMs={300}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Location</Label>
                  <DebouncedInput
                    value={item.location}
                    onChange={(value) => onUpdate({ location: value })}
                    placeholder="e.g., New York, NY"
                    className="h-8 text-xs"
                    debounceMs={300}
                  />
                </div>
              </div>

              {/* Type & Remote */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Employment Type</Label>
                  <Select
                    value={item.type}
                    onValueChange={(value) => onUpdate({ type: value })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-xs">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between pt-5">
                  <Label className="text-xs">Remote Work</Label>
                  <Switch
                    checked={item.remote}
                    onCheckedChange={(checked) => onUpdate({ remote: checked })}
                  />
                </div>
              </div>

              {/* Description with character count */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Description</Label>
                  <span className="text-xs text-muted-foreground">
                    {(item.description || '').length}/300
                  </span>
                </div>
                <DebouncedInput
                  value={item.description}
                  onChange={(value) => onUpdate({ description: value })}
                  placeholder="Brief job description..."
                  multiline
                  rows={3}
                  className="resize-none text-xs"
                  debounceMs={300}
                />
              </div>

              {/* Apply URL */}
              <div className="space-y-1.5">
                <Label className="text-xs">Apply URL</Label>
                <DebouncedInput
                  value={item.applyUrl}
                  onChange={(value) => onUpdate({ applyUrl: value })}
                  placeholder="https://..."
                  className="h-8 text-xs"
                  debounceMs={300}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default CareersSettingsContent;
