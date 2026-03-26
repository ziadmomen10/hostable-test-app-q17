/**
 * Features Section
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortableItem } from '@/components/editor/SortableItem';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { ElementPosition } from '@/types/reactEditor';
import type { FeaturesSectionProps, FeatureItem } from '@/types/sectionProps';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

// Use centralized icon map for all icons
const iconMap = ICON_MAP;

// Extended feature item with position
interface FeatureItemWithPosition extends FeatureItem {
  position?: ElementPosition;
}

// Default features - matches the visual design
const defaultFeatures: FeatureItemWithPosition[] = [
  {
    icon: 'Zap',
    title: 'The Fastest Way to Get Online',
    description: 'Our optimized infrastructure delivers 20x faster loading times compared to traditional hosting providers.',
    highlights: [
      { text: 'NVMe SSD Storage' },
      { text: 'LiteSpeed Web Server' },
      { text: 'Global CDN Included' }
    ]
  },
  {
    icon: 'Shield',
    title: 'Start Secure with Enterprise-level Protection',
    description: 'Every account comes with enterprise-grade security features to keep your website safe.',
    highlights: [
      { text: 'Free SSL Certificates' },
      { text: 'DDoS Protection' },
      { text: 'Daily Malware Scans' }
    ]
  }
];

const FeaturesSection = ({
  badge,
  title = 'Example Title Goes Here',
  subtitle = 'Everything you need to build, grow, and scale your online presence.',
  features = defaultFeatures,
  buttonText = 'Explore All Features',
  buttonUrl = '#features',
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}: FeaturesSectionProps & { 
  sectionId?: string; 
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}) => {
  const featureItems = features as FeatureItemWithPosition[];
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('features', featureItems);
  
  // Use layoutProps for grid configuration
  const columns = layoutProps?.columns ?? 2;
  const gridColsClass = getGridColsClass(columns);
  const gapClass = getGapClass(layoutProps?.gap);
  
  return (
    <SectionContainer variant="light" padding="lg" styleOverrides={styleOverrides}>
      <SectionHeader
        sectionId={sectionId}
        badge={badge}
        title={title}
        subtitle={subtitle}
        subtitleClassName="max-w-2xl"
      />

      {/* Features Grid - SortableWrapper handles DnD context automatically */}
      <SortableWrapper>
        <div className={`grid ${gridColsClass} ${gapClass} mb-16 relative`}>
          {featureItems.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Zap;
            
            return (
              <SortableItem
                key={`${sectionId}-features-${index}`}
                {...getItemProps(index)}
              >
                <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <EditableElement
                    as="h3"
                    sectionId={sectionId}
                    path={`features.${index}.title`}
                    className="text-xl font-bold text-foreground mb-3"
                  >
                    <RichTextRenderer content={feature.title} />
                  </EditableElement>
                  <EditableElement
                    as="p"
                    sectionId={sectionId}
                    path={`features.${index}.description`}
                    className="text-muted-foreground mb-6"
                  >
                    <RichTextRenderer content={feature.description} />
                  </EditableElement>
                  {feature.highlights && feature.highlights.length > 0 && (
                    <ul className="space-y-3">
                      {feature.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <EditableInline
                            sectionId={sectionId}
                            path={`features.${index}.highlights.${i}.text`}
                            className="text-foreground"
                          >
                            <RichTextRenderer content={highlight.text} />
                          </EditableInline>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </SortableItem>
            );
          })}
        </div>
      </SortableWrapper>

      {/* CTA */}
      <div className="text-center">
        <Button size="lg" className="bg-primary text-primary-foreground" asChild>
          <a href={buttonUrl}>
            <EditableInline
              sectionId={sectionId}
              path="buttonText"
            >
              <RichTextRenderer content={buttonText} />
            </EditableInline>
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </Button>
      </div>
    </SectionContainer>
  );
};

export default FeaturesSection;
