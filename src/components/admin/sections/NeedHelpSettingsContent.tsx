/**
 * NeedHelpSettingsContent Component
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Headphones } from 'lucide-react';
import { NeedHelpSectionData, SupportOption } from '@/types/pageEditor';
import { SectionHeaderFields, IconPicker, getIconComponent, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface NeedHelpSettingsContentProps {
  data: NeedHelpSectionData;
  onChange: (data: NeedHelpSectionData) => void;
}

const NeedHelpSettingsContent: React.FC<NeedHelpSettingsContentProps> = ({ data, onChange }) => {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);
  const handleOptionsChange = useCallback((options: SupportOption[]) => updateArray('options', options), [updateArray]);
  const createNewOption = useCallback((): SupportOption => ({ icon: 'MessageCircle', title: 'New Option', description: 'Describe this support option...', buttonText: 'Contact', buttonLink: '#' }), []);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields title={data.title} subtitle={data.subtitle} onTitleChange={(v) => updateField('title', v)} onSubtitleChange={(v) => updateField('subtitle', v)} titleLabel="Section Title" subtitleLabel="Section Subtitle" titlePlaceholder="Need Help?" subtitlePlaceholder="Our support team is here to help..." />
      <ItemListEditor items={data.options} onItemsChange={handleOptionsChange} createNewItem={createNewOption} getItemTitle={(option) => option.title || 'Untitled Option'} getItemIcon={(option) => { const IconComponent = getIconComponent(option.icon || 'MessageCircle'); return <IconComponent className="h-3 w-3 text-primary" />; }} addItemLabel="Add Support Option" emptyMessage="No support options. Add one to get started." emptyStateIcon={<Headphones className="h-10 w-10 text-muted-foreground/50 mb-2" />} minItems={1} maxItems={6} showDuplicateButton confirmDelete renderItem={(option, index, onUpdate) => (
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3"><div><Label className="text-xs">Icon</Label><IconPicker value={option.icon || 'MessageCircle'} onChange={(v) => onUpdate({ icon: v })} /></div><div><Label className="text-xs">Title</Label><DebouncedInput value={option.title} onChange={(value) => onUpdate({ title: value })} placeholder="Option title" className="h-9" debounceMs={300} /></div></div>
          <div><Label className="text-xs">Description</Label><DebouncedInput value={option.description} onChange={(value) => onUpdate({ description: value })} placeholder="Support option description..." multiline rows={2} className="resize-none" debounceMs={300} /></div>
          <div className="grid grid-cols-2 gap-3"><div><Label className="text-xs">Button Text</Label><DebouncedInput value={option.buttonText} onChange={(value) => onUpdate({ buttonText: value })} placeholder="Contact" className="h-8" debounceMs={300} /></div><div><Label className="text-xs">Button Link</Label><DebouncedInput value={option.buttonLink} onChange={(value) => onUpdate({ buttonLink: value })} placeholder="https://..." className="h-8" debounceMs={300} /></div></div>
        </div>
      )} />
    </div>
  );
};

export default NeedHelpSettingsContent;
