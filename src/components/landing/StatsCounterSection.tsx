/**
 * Stats Counter Section
 * Displays key metrics with large numbers
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { StatsCounterSectionData, StatItem } from '@/types/newSectionTypes';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

interface StatsCounterSectionProps {
  data?: StatsCounterSectionData;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultData: StatsCounterSectionData = {
  badge: 'BY THE NUMBERS',
  title: 'Trusted by Thousands Worldwide',
  subtitle: 'Our commitment to excellence in hosting',
  stats: [
    { value: '99.9', suffix: '%', label: 'Uptime Guarantee', icon: '📈' },
    { value: '50', suffix: 'K+', label: 'Happy Customers', icon: '👥' },
    { value: '24', suffix: '/7', label: 'Expert Support', icon: '🎧' },
    { value: '15', suffix: '+', label: 'Data Centers', icon: '🌍' },
  ],
};

const StatsCounterSection: React.FC<StatsCounterSectionProps> = ({ data = defaultData, sectionId, isEditing = false, styleOverrides, layoutProps }) => {
  const stats = data.stats || [];
  
  // Use layoutProps for grid configuration
  const columns = layoutProps?.columns ?? 4;
  const gridColsClass = getGridColsClass(columns, 'lg');
  const gapClass = getGapClass(layoutProps?.gap);
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('stats', stats);
  
  return (
    <SectionContainer 
      variant="light" 
      padding="lg" 
      data-section="stats-counter"
      styleOverrides={styleOverrides}
    >
      <SectionHeader
        sectionId={sectionId}
        badge={data.badge}
        title={data.title || ''}
        subtitle={data.subtitle}
        subtitleClassName="max-w-2xl"
      />

      {/* Stats Grid - SortableWrapper handles DnD context automatically */}
      {stats.length > 0 && (
        <SortableWrapper>
          <div className={`grid grid-cols-2 ${gridColsClass} ${gapClass}`}>
            {stats.map((stat, index) => (
              <SortableItem
                key={`${sectionId}-stats-${index}`}
                {...getItemProps(index)}
              >
                <div className="text-center p-6 rounded-2xl bg-muted hover:shadow-lg transition-shadow">
                  {stat.icon && (
                    <div 
                      className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center bg-primary/20"
                    >
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    {stat.prefix && (
                      <EditableInline
                        path={`stats.${index}.prefix`}
                        sectionId={sectionId}
                        className="text-2xl font-bold text-muted-foreground"
                      >
                        <RichTextRenderer content={stat.prefix} />
                      </EditableInline>
                    )}
                    <EditableInline
                      path={`stats.${index}.value`}
                      sectionId={sectionId}
                      className="text-4xl lg:text-5xl font-bold text-primary"
                    >
                      <RichTextRenderer content={stat.value} />
                    </EditableInline>
                    {stat.suffix && (
                      <EditableInline
                        path={`stats.${index}.suffix`}
                        sectionId={sectionId}
                        className="text-2xl font-bold text-foreground"
                      >
                        <RichTextRenderer content={stat.suffix} />
                      </EditableInline>
                    )}
                  </div>
                  <EditableElement
                    path={`stats.${index}.label`}
                    sectionId={sectionId}
                    as="p"
                    className="text-muted-foreground font-medium"
                  >
                    <RichTextRenderer content={stat.label || ''} />
                  </EditableElement>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableWrapper>
      )}
    </SectionContainer>
  );
};

export default StatsCounterSection;
