/**
 * Awards Section
 * Display trust badges, certifications, and awards
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { Award } from 'lucide-react';
import { AwardsSectionData, AwardItem } from '@/types/newSectionTypes';
import { EditableElement } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

interface AwardsSectionProps {
  data?: AwardsSectionData;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultData: AwardsSectionData = {
  badge: 'RECOGNITION',
  title: 'Award-Winning Hosting',
  subtitle: 'Trusted by industry experts and recognized for excellence',
  awards: [
    { 
      image: '/placeholder.svg', 
      name: 'Best Web Host', 
      year: '2024',
      description: 'Top-rated hosting provider'
    },
    { 
      image: '/placeholder.svg', 
      name: 'ISO 27001', 
      year: 'Certified',
      description: 'Information security certified'
    },
    { 
      image: '/placeholder.svg', 
      name: 'SOC 2 Type II', 
      year: 'Compliant',
      description: 'Enterprise security standards'
    },
    { 
      image: '/placeholder.svg', 
      name: 'Green Hosting', 
      year: '2024',
      description: '100% renewable energy'
    },
    { 
      image: '/placeholder.svg', 
      name: 'Customer Choice', 
      year: '2024',
      description: '4.9/5 customer rating'
    },
    { 
      image: '/placeholder.svg', 
      name: 'PCI DSS', 
      year: 'Compliant',
      description: 'Payment security certified'
    },
  ],
};

const AwardsSection: React.FC<AwardsSectionProps> = ({ data = defaultData, sectionId, isEditing = false, styleOverrides, layoutProps }) => {
  const awards = data.awards || [];
  
  // Use layoutProps for grid configuration (default to 6 for awards)
  const columns = layoutProps?.columns ?? 4;
  const gridColsClass = getGridColsClass(columns, 'md');
  const gapClass = getGapClass(layoutProps?.gap);
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('awards', awards);

  return (
    <SectionContainer 
      variant="light" 
      padding="lg" 
      data-section="awards"
      styleOverrides={styleOverrides}
    >
      <SectionHeader
        sectionId={sectionId}
        badge={data.badge}
        title={data.title || ''}
        subtitle={data.subtitle}
        subtitleClassName="max-w-2xl"
      />

      {/* Awards Grid - SortableWrapper handles DnD context automatically */}
      <SortableWrapper>
        <div className={`grid grid-cols-2 ${gridColsClass} ${gapClass}`}>
          {awards.map((award, index) => (
            <SortableItem
              key={`${sectionId}-awards-${index}`}
              {...getItemProps(index)}
              className="h-full"
            >
              <div className="bg-muted/50 rounded-2xl p-6 text-center hover:shadow-lg hover:bg-card transition-all border border-transparent hover:border-border group h-full">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden bg-card shadow-sm flex items-center justify-center">
                  {award.image && award.image !== '/placeholder.svg' ? (
                    <img 
                      src={award.image} 
                      alt={award.name}
                      className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <Award className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <EditableElement
                  path={`awards.${index}.name`}
                  sectionId={sectionId}
                  as="h3"
                  className="font-bold text-foreground text-sm mb-1"
                >
                  <RichTextRenderer content={award.name} />
                </EditableElement>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium mb-2 bg-primary/10 text-primary">
                  {award.year}
                </span>
                {award.description && (
                  <EditableElement
                    path={`awards.${index}.description`}
                    sectionId={sectionId}
                    as="p"
                    className="text-xs text-muted-foreground"
                  >
                    <RichTextRenderer content={award.description} />
                  </EditableElement>
                )}
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
};

export default AwardsSection;
