/**
 * Data Center Section
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { DataCenterSectionData, DataCenterLocation } from '@/types/newSectionTypes';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

interface DataCenterSectionProps {
  data?: DataCenterSectionData;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultData: DataCenterSectionData = {
  badge: 'GLOBAL NETWORK',
  title: 'Data Centers Worldwide',
  subtitle: 'Choose a server location closest to your audience for the best performance',
  locations: [
    { city: 'New York', country: 'USA', flag: '🇺🇸', region: 'North America', latency: '<10ms' },
    { city: 'Los Angeles', country: 'USA', flag: '🇺🇸', region: 'North America', latency: '<15ms' },
    { city: 'London', country: 'UK', flag: '🇬🇧', region: 'Europe', latency: '<20ms' },
    { city: 'Frankfurt', country: 'Germany', flag: '🇩🇪', region: 'Europe', latency: '<15ms' },
    { city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', region: 'Europe', latency: '<12ms' },
    { city: 'Singapore', country: 'Singapore', flag: '🇸🇬', region: 'Asia Pacific', latency: '<25ms' },
    { city: 'Tokyo', country: 'Japan', flag: '🇯🇵', region: 'Asia Pacific', latency: '<20ms' },
    { city: 'Sydney', country: 'Australia', flag: '🇦🇺', region: 'Oceania', latency: '<30ms' },
  ],
};

const DataCenterSection: React.FC<DataCenterSectionProps> = ({ data = defaultData, sectionId, isEditing = false, styleOverrides, layoutProps }) => {
  const locations = data.locations || [];
  
  // Use layoutProps for grid configuration
  const columns = layoutProps?.columns ?? 4;
  const gridColsClass = getGridColsClass(columns, 'md');
  const gapClass = getGapClass(layoutProps?.gap);
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('locations', locations);

  return (
    <SectionContainer 
      variant="dark" 
      padding="lg"
      data-section="data-center"
      styleOverrides={styleOverrides}
    >
      <SectionHeader
        sectionId={sectionId}
        badge={data.badge}
        title={data.title || ''}
        subtitle={data.subtitle}
        dark
        subtitleClassName="max-w-2xl"
      />

      {/* Location Grid - SortableWrapper handles DnD context automatically */}
      <SortableWrapper>
        <div className={`grid ${gridColsClass} ${gapClass}`}>
          {locations.map((location, index) => (
            <SortableItem
              key={`${sectionId}-locations-${index}`}
              {...getItemProps(index)}
            >
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{location.flag}</div>
                  <div className="flex-1">
                    <EditableElement
                      path={`locations.${index}.city`}
                      sectionId={sectionId}
                      as="h3"
                      className="font-bold text-white group-hover:text-primary transition-colors"
                    >
                      <RichTextRenderer content={location.city} />
                    </EditableElement>
                    <EditableElement
                      path={`locations.${index}.country`}
                      sectionId={sectionId}
                      as="p"
                      className="text-sm text-white/60"
                    >
                      <RichTextRenderer content={location.country} />
                    </EditableElement>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <EditableInline
                        path={`locations.${index}.latency`}
                        sectionId={sectionId}
                        className="text-xs text-white/50"
                      >
                        {location.latency} latency
                      </EditableInline>
                    </div>
                  </div>
                </div>
                <EditableInline
                  path={`locations.${index}.region`}
                  sectionId={sectionId}
                  className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium bg-primary/20 text-primary"
                >
                  {location.region}
                </EditableInline>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>

      {/* Stats */}
      <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-white">{locations.length}+</div>
          <div className="text-sm text-white/50">Data Centers</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-white">200+</div>
          <div className="text-sm text-white/50">Edge Locations</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary">99.99%</div>
          <div className="text-sm text-white/50">Network Uptime</div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default DataCenterSection;
