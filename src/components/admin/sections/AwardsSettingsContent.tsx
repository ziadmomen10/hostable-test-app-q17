/**
 * Awards Settings Content
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award } from 'lucide-react';
import { AwardsSectionData, AwardItem } from '@/types/newSectionTypes';
import { SectionHeaderFields, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface AwardsSettingsContentProps {
  data: AwardsSectionData;
  onChange: (data: AwardsSectionData) => void;
}

const AwardsSettingsContent: React.FC<AwardsSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateFields, updateArray } = useDataChangeHandlers(data, onChange);

  const handleAwardsChange = useCallback((awards: AwardItem[]) => {
    updateArray('awards', awards);
  }, [updateArray]);

  const createNewAward = useCallback((): AwardItem => ({
    image: '/placeholder.svg',
    name: 'New Award',
    year: '2024',
    description: 'Award description',
  }), []);

  return (
    <div className="space-y-4 p-3">
      <SectionHeaderFields
        badge={data.badge || ''}
        title={data.title}
        subtitle={data.subtitle || ''}
        onBadgeChange={(badge) => updateFields({ badge })}
        onTitleChange={(title) => updateFields({ title })}
        onSubtitleChange={(subtitle) => updateFields({ subtitle })}
      />

      <ItemListEditor
        items={data.awards}
        onItemsChange={handleAwardsChange}
        createNewItem={createNewAward}
        getItemTitle={(award) => award.name || 'Untitled Award'}
        getItemSubtitle={(award) => award.year || ''}
        getItemIcon={() => <Award className="h-3 w-3 text-yellow-500" />}
        addItemLabel="Add Award"
        emptyMessage="No awards. Add one to showcase."
        emptyStateIcon={<Award className="h-10 w-10 text-muted-foreground/50 mb-2" />}
        minItems={1}
        maxItems={12}
        showDuplicateButton
        confirmDelete
        renderItem={(award, index, onUpdate) => (
          <div className="space-y-3 pt-2">
            <div>
              <Label className="text-[10px]">Image URL</Label>
              <Input
                value={award.image}
                onChange={(e) => onUpdate({ image: e.target.value })}
                placeholder="/placeholder.svg"
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px]">Name</Label>
                <Input
                  value={award.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label className="text-[10px]">Year/Badge</Label>
                <Input
                  value={award.year || ''}
                  onChange={(e) => onUpdate({ year: e.target.value })}
                  placeholder="2024"
                  className="h-7 text-xs"
                />
              </div>
            </div>
            <div>
              <Label className="text-[10px]">Description</Label>
              <Input
                value={award.description || ''}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Award description"
                className="h-7 text-xs"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default AwardsSettingsContent;
