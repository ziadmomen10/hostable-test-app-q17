/**
 * IconFeaturesSettingsContent Component
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { IconFeaturesSectionData, IconFeatureItem } from '@/types/newSectionTypes';
import { SectionHeaderFields, IconPicker, getIconComponent, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface IconFeaturesSettingsContentProps {
  data: IconFeaturesSectionData;
  onChange: (data: IconFeaturesSectionData) => void;
}

const IconFeaturesSettingsContent: React.FC<IconFeaturesSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  const handleFeaturesChange = useCallback((features: IconFeatureItem[]) => {
    updateArray('features', features);
  }, [updateArray]);

  const getItemIcon = useCallback((item: IconFeatureItem) => {
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
        titlePlaceholder="What We Offer"
      />

      <ItemListEditor
        items={data.features}
        onItemsChange={handleFeaturesChange}
        createNewItem={() => ({
          icon: 'Star',
          title: 'New Feature',
          description: 'Feature description here',
        })}
        getItemTitle={(item) => item.title || 'Untitled Feature'}
        getItemIcon={getItemIcon}
        addItemLabel="Add Feature"
        emptyMessage="No features yet. Add features to showcase your offerings."
        emptyStateIcon={<Sparkles className="h-10 w-10 text-muted-foreground/50 mb-2" />}
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
                  placeholder="Feature title"
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
                placeholder="Feature description..."
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

export default IconFeaturesSettingsContent;
