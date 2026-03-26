/**
 * Why Choose Section
 * Reasons to choose with icons
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { Zap } from 'lucide-react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { ElementPosition } from '@/types/reactEditor';
import type { WhyChooseSectionProps, ReasonItem } from '@/types/sectionProps';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

// Use centralized icon map for all icons
const iconMap = ICON_MAP;

interface ReasonItemWithPosition extends ReasonItem {
  position?: ElementPosition;
}

const defaultReasons: ReasonItemWithPosition[] = [
  {
    icon: 'Zap',
    title: 'Lightning Fast',
    description: 'NVMe SSD storage and LiteSpeed servers for blazing performance.',
  },
  {
    icon: 'Shield',
    title: 'Secure & Protected',
    description: 'Free SSL, DDoS protection, and daily backups included.',
  },
  {
    icon: 'Clock',
    title: '99.9% Uptime',
    description: 'Guaranteed uptime with enterprise-grade infrastructure.',
  },
  {
    icon: 'HeadphonesIcon',
    title: '24/7 Expert Support',
    description: 'Real humans ready to help you anytime, day or night.',
  },
  {
    icon: 'Server',
    title: 'Easy Management',
    description: 'Intuitive control panel with one-click installations.',
  },
  {
    icon: 'Globe',
    title: 'Global CDN',
    description: 'Content delivery network for faster load times worldwide.',
  },
];

const WhyChooseSection = ({
  badge,
  title = 'Why Choose HostOnce',
  subtitle = 'We combine cutting-edge technology with exceptional support to deliver hosting that just works.',
  reasons = defaultReasons,
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}: WhyChooseSectionProps & {
  sectionId?: string; 
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}) => {
  const reasonItems = reasons as ReasonItemWithPosition[];
  
  // Use layoutProps for grid configuration
  const columns = layoutProps?.columns ?? 3;
  const gridColsClass = getGridColsClass(columns, 'md');
  const gapClass = getGapClass(layoutProps?.gap);
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('reasons', reasonItems);
  
  return (
    <SectionContainer variant="muted" padding="lg" className="bg-muted/50" styleOverrides={styleOverrides}>
      <SectionHeader
        sectionId={sectionId}
        badge={badge}
        title={title}
        subtitle={subtitle}
        alignment="center"
        size="md"
      />

      {/* Reasons Grid - SortableWrapper handles DnD context automatically */}
      <SortableWrapper>
        <div className={`grid ${gridColsClass} ${gapClass} relative`}>
          {reasonItems.map((reason, index) => {
            const IconComponent = iconMap[reason.icon] || Zap;
            
            return (
              <SortableItem
                key={`${sectionId}-reasons-${index}`}
                {...getItemProps(index)}
              >
                <div className="flex gap-4 p-6">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <EditableElement
                      path={`reasons.${index}.title`}
                      sectionId={sectionId}
                      as="h3"
                      className="text-lg font-semibold text-foreground mb-2"
                    >
                      <RichTextRenderer content={reason.title} />
                    </EditableElement>
                    <EditableElement
                      path={`reasons.${index}.description`}
                      sectionId={sectionId}
                      as="p"
                      className="text-muted-foreground text-sm"
                    >
                      <RichTextRenderer content={reason.description} />
                    </EditableElement>
                  </div>
                </div>
              </SortableItem>
            );
          })}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
};

export default WhyChooseSection;
