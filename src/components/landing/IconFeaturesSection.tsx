/**
 * Icon Features Section
 * Simple, minimal icon + title + description grid
 * 
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { IconFeaturesSectionData, IconFeatureItem } from '@/types/newSectionTypes';
import { EditableElement } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { ElementPosition } from '@/types/reactEditor';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

// Use centralized icon map for all icons
const iconMap: Record<string, LucideIcon> = ICON_MAP;

interface IconFeatureItemWithPosition extends IconFeatureItem {
  position?: ElementPosition;
}

interface IconFeaturesSectionProps {
  data?: IconFeaturesSectionData & { features?: IconFeatureItemWithPosition[] };
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultData: IconFeaturesSectionData & { features: IconFeatureItemWithPosition[] } = {
  badge: 'WHAT WE OFFER',
  title: 'Everything You Need',
  subtitle: 'Comprehensive hosting features for every project',
  columns: 3,
  features: [
    { icon: '⚡', title: 'Fast Performance', description: 'Lightning-fast servers with NVMe SSD storage' },
    { icon: '🔒', title: 'Security First', description: 'Free SSL, DDoS protection, and daily backups' },
    { icon: '🌐', title: 'Global CDN', description: 'Content delivery from 200+ global locations' },
    { icon: '📊', title: 'Analytics', description: 'Real-time traffic and performance insights' },
    { icon: '🔧', title: 'Easy Setup', description: 'One-click installs for popular applications' },
    { icon: '🎧', title: '24/7 Support', description: 'Expert help available around the clock' },
  ],
};

const IconFeaturesSection: React.FC<IconFeaturesSectionProps> = ({ data = defaultData, sectionId, isEditing = false, styleOverrides, layoutProps }) => {
  // Use layoutProps for grid configuration, fallback to data.columns
  const columns = layoutProps?.columns ?? data.columns ?? 3;
  const gridColsClass = getGridColsClass(columns, 'md');
  const gapClass = getGapClass(layoutProps?.gap);
  
  const features = (data.features || []) as IconFeatureItemWithPosition[];
  
  // Use centralized DnD hook - automatically gets config from SectionDndProvider
  const { getItemProps, SortableWrapper } = useArrayItems('features', features);

  return (
    <SectionContainer 
      variant="muted" 
      padding="lg" 
      data-section="icon-features"
      className="bg-muted/50"
      styleOverrides={styleOverrides}
    >
      <SectionHeader
        sectionId={sectionId}
        badge={data.badge}
        title={data.title || ''}
        subtitle={data.subtitle}
        subtitleClassName="max-w-2xl"
      />

      {/* Features Grid - SortableWrapper handles DnD context automatically */}
      {features.length > 0 && (
        <SortableWrapper>
          <div className={`grid ${gapClass} ${gridColsClass} relative`}>
            {features.map((feature, index) => (
              <SortableItem
                key={`${sectionId}-features-${index}`}
                {...getItemProps(index)}
              >
                <div className="bg-card rounded-2xl p-8 text-center hover:shadow-lg transition-shadow border border-border h-full">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-primary/10">
                    {iconMap[feature.icon] ? (
                      React.createElement(iconMap[feature.icon], { className: 'w-8 h-8 text-primary' })
                    ) : (
                      <span className="text-3xl">{feature.icon}</span>
                    )}
                  </div>
                  <EditableElement
                    path={`features.${index}.title`}
                    sectionId={sectionId}
                    as="h3"
                    className="text-xl font-bold text-foreground mb-3"
                  >
                    <RichTextRenderer content={feature.title} />
                  </EditableElement>
                  <EditableElement
                    path={`features.${index}.description`}
                    sectionId={sectionId}
                    as="p"
                    className="text-muted-foreground"
                  >
                    <RichTextRenderer content={feature.description || ''} />
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

export default IconFeaturesSection;
