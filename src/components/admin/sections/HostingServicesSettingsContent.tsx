/**
 * HostingServicesSettingsContent Component
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Server } from 'lucide-react';
import { HostingServicesSectionData, ServiceItem } from '@/types/pageEditor';
import { SectionHeaderFields, IconPicker, getIconComponent, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface HostingServicesSettingsContentProps {
  data: HostingServicesSectionData;
  onChange: (data: HostingServicesSectionData) => void;
}

const HostingServicesSettingsContent: React.FC<HostingServicesSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  const handleServicesChange = useCallback((services: ServiceItem[]) => {
    updateArray('services', services);
  }, [updateArray]);

  const getItemIcon = useCallback((item: ServiceItem) => {
    const IconComponent = getIconComponent(item.icon || 'Globe');
    return <IconComponent className="h-4 w-4 text-primary" />;
  }, []);

  const getItemSubtitle = useCallback((item: ServiceItem) => {
    return item.price || '';
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

      <div className="border-t pt-4">
        <h4 className="font-medium text-sm mb-3">Services</h4>
        <ItemListEditor
          items={data.services}
          onItemsChange={handleServicesChange}
          createNewItem={() => ({
            icon: 'Globe',
            title: 'New Service',
            description: 'Service description...',
            price: 'From $9.99/month',
          })}
          getItemTitle={(item) => item.title || 'Untitled Service'}
          getItemSubtitle={getItemSubtitle}
          getItemIcon={getItemIcon}
          addItemLabel="Add Service"
          emptyMessage="No services yet. Add your hosting services."
          emptyStateIcon={<Server className="h-10 w-10 text-muted-foreground/50 mb-2" />}
          maxItems={12}
          minItems={0}
          showDuplicateButton
          renderItem={(item, index, onUpdate) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Icon</Label>
                  <IconPicker
                    value={item.icon || 'Globe'}
                    onChange={(v) => onUpdate({ icon: v })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder="Service title"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="Service description"
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Price</Label>
                <Input
                  value={item.price}
                  onChange={(e) => onUpdate({ price: e.target.value })}
                  placeholder="From $9.99/month"
                  className="h-8"
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default HostingServicesSettingsContent;
