/**
 * Data Center Settings Content
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { DataCenterSectionData, DataCenterLocation } from '@/types/newSectionTypes';
import { SectionHeaderFields, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface DataCenterSettingsContentProps {
  data: DataCenterSectionData;
  onChange: (data: DataCenterSectionData) => void;
}

const DataCenterSettingsContent: React.FC<DataCenterSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateFields, updateArray } = useDataChangeHandlers(data, onChange);

  const handleLocationsChange = useCallback((locations: DataCenterLocation[]) => {
    updateArray('locations', locations);
  }, [updateArray]);

  const createNewLocation = useCallback((): DataCenterLocation => ({
    city: 'New City',
    country: 'Country',
    flag: '🏳️',
    region: 'Region',
    latency: '<20ms',
  }), []);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        badge={data.badge || ''}
        title={data.title}
        subtitle={data.subtitle || ''}
        onBadgeChange={(badge) => updateFields({ badge })}
        onTitleChange={(title) => updateFields({ title })}
        onSubtitleChange={(subtitle) => updateFields({ subtitle })}
      />

      <div className="border-t pt-4">
        <h4 className="font-medium text-sm mb-3">Data Center Locations</h4>
        <ItemListEditor
          items={data.locations}
          onItemsChange={handleLocationsChange}
          createNewItem={createNewLocation}
          getItemTitle={(location) => `${location.city}, ${location.country}`}
          getItemSubtitle={(location) => location.latency || ''}
          getItemIcon={(location) => (
            <span className="text-sm">{location.flag}</span>
          )}
          addItemLabel="Add Location"
          emptyMessage="No locations. Add data centers."
          emptyStateIcon={<MapPin className="h-10 w-10 text-muted-foreground/50 mb-2" />}
          minItems={1}
          maxItems={20}
          showDuplicateButton
          confirmDelete
          renderItem={(location, index, onUpdate) => (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-[10px]">Flag</Label>
                  <DebouncedInput
                    value={location.flag}
                    onChange={(value) => onUpdate({ flag: value })}
                    placeholder="🇺🇸"
                    className="h-7 text-xs"
                    debounceMs={300}
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-[10px]">City</Label>
                  <DebouncedInput
                    value={location.city}
                    onChange={(value) => onUpdate({ city: value })}
                    className="h-7 text-xs"
                    debounceMs={300}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px]">Country</Label>
                  <DebouncedInput
                    value={location.country}
                    onChange={(value) => onUpdate({ country: value })}
                    className="h-7 text-xs"
                    debounceMs={300}
                  />
                </div>
                <div>
                  <Label className="text-[10px]">Region</Label>
                  <DebouncedInput
                    value={location.region}
                    onChange={(value) => onUpdate({ region: value })}
                    className="h-7 text-xs"
                    debounceMs={300}
                  />
                </div>
              </div>
              <div>
                <Label className="text-[10px]">Latency</Label>
                <DebouncedInput
                  value={location.latency || ''}
                  onChange={(value) => onUpdate({ latency: value })}
                  placeholder="<20ms"
                  className="h-7 text-xs"
                  debounceMs={300}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default DataCenterSettingsContent;
