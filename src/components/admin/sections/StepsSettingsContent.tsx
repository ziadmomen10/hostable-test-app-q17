/**
 * StepsSettingsContent Component
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { ListOrdered } from 'lucide-react';
import { StepsSectionData, StepItem } from '@/types/newSectionTypes';
import { SectionHeaderFields, IconPicker, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface StepsSettingsContentProps {
  data: StepsSectionData;
  onChange: (data: StepsSectionData) => void;
}

const StepsSettingsContent: React.FC<StepsSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  const handleStepsChange = useCallback((steps: StepItem[]) => {
    const renumberedSteps = steps.map((step, index) => ({
      ...step,
      number: index + 1,
    }));
    updateArray('steps', renumberedSteps);
  }, [updateArray]);

  const getItemIcon = useCallback((item: StepItem, index: number) => {
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
        {item.number || index + 1}
      </span>
    );
  }, []);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(v) => updateField('badge', v)}
        onTitleChange={(v) => updateField('title', v)}
        onSubtitleChange={(v) => updateField('subtitle', v)}
        badgeLabel="Badge Text"
        titleLabel="Section Title"
        subtitleLabel="Section Subtitle"
        titlePlaceholder="How It Works"
      />

      <ItemListEditor
        items={data.steps}
        onItemsChange={handleStepsChange}
        createNewItem={() => ({
          number: data.steps.length + 1,
          title: 'New Step',
          description: 'Step description here',
          icon: 'Rocket',
        })}
        getItemTitle={(item) => item.title || `Step ${item.number}`}
        getItemIcon={getItemIcon}
        addItemLabel="Add Step"
        emptyMessage="No steps yet. Add steps to show your process."
        emptyStateIcon={<ListOrdered className="h-10 w-10 text-muted-foreground/50 mb-2" />}
        maxItems={10}
        minItems={1}
        showDuplicateButton
        showItemIndex={false}
        renderItem={(item, index, onUpdate) => (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Icon</Label>
                <IconPicker
                  value={item.icon || 'Rocket'}
                  onChange={(v) => onUpdate({ icon: v })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Title</Label>
                <DebouncedInput
                  value={item.title}
                  onChange={(value) => onUpdate({ title: value })}
                  placeholder="Step title"
                  className="h-9"
                  debounceMs={300}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <DebouncedInput
                value={item.description}
                onChange={(value) => onUpdate({ description: value })}
                placeholder="Step description..."
                multiline
                rows={2}
                className="resize-none"
                debounceMs={300}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default StepsSettingsContent;
