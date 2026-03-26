/**
 * WhyChooseSettingsContent Component
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Award } from 'lucide-react';
import { WhyChooseSectionData, ReasonItem } from '@/types/pageEditor';
import { SectionHeaderFields, IconPicker, getIconComponent, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface WhyChooseSettingsContentProps {
  data: WhyChooseSectionData;
  onChange: (data: WhyChooseSectionData) => void;
}

const WhyChooseSettingsContent: React.FC<WhyChooseSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  const handleReasonsChange = useCallback((reasons: ReasonItem[]) => {
    updateArray('reasons', reasons);
  }, [updateArray]);

  const getItemIcon = useCallback((item: ReasonItem) => {
    const IconComponent = getIconComponent(item.icon || 'Star');
    return <IconComponent className="h-4 w-4 text-primary" />;
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
      />

      <ItemListEditor
        items={data.reasons}
        onItemsChange={handleReasonsChange}
        createNewItem={() => ({
          icon: 'Star',
          title: 'New Reason',
          description: 'Describe why to choose...',
        })}
        getItemTitle={(item) => item.title || 'Untitled Reason'}
        getItemIcon={getItemIcon}
        addItemLabel="Add Reason"
        emptyMessage="No reasons yet. Add compelling reasons for customers to choose you."
        emptyStateIcon={<Award className="h-10 w-10 text-muted-foreground/50 mb-2" />}
        maxItems={12}
        minItems={0}
        showDuplicateButton
        renderItem={(item, index, onUpdate) => (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Icon</Label>
                <IconPicker
                  value={item.icon || 'Star'}
                  onChange={(v) => onUpdate({ icon: v })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Title</Label>
                <DebouncedInput
                  value={item.title}
                  onChange={(value) => onUpdate({ title: value })}
                  placeholder="Reason title"
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
                placeholder="Why choose us..."
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

export default WhyChooseSettingsContent;
