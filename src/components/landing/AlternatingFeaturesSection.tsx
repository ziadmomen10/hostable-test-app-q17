/**
 * Alternating Features Section
 * Image + text blocks with alternating left/right layout
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { AlternatingFeaturesSectionData, AlternatingFeatureBlock } from '@/types/newSectionTypes';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { SectionStyleProps } from '@/types/elementSettings';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import { gapClasses } from '@/types/sectionSettings';

interface AlternatingFeaturesSectionProps {
  data?: AlternatingFeaturesSectionData;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultData: AlternatingFeaturesSectionData = {
  badge: 'FEATURES',
  title: 'Everything You Need to Succeed',
  blocks: [
    {
      title: 'Lightning Fast Performance',
      description: 'Experience blazing fast load times with our NVMe SSD storage and optimized server infrastructure. Your visitors will love the speed.',
      image: '/placeholder.svg',
      imagePosition: 'right',
      bullets: ['NVMe SSD Storage', 'HTTP/3 Support', 'Global CDN Included'],
      buttonText: 'Learn More',
      buttonLink: '#performance',
    },
    {
      title: 'Enterprise-Grade Security',
      description: 'Keep your website and data safe with our comprehensive security suite. Free SSL, DDoS protection, and automated backups included.',
      image: '/placeholder.svg',
      imagePosition: 'left',
      bullets: ['Free SSL Certificates', 'DDoS Protection', 'Daily Backups'],
      buttonText: 'Explore Security',
      buttonLink: '#security',
    },
    {
      title: '24/7 Expert Support',
      description: 'Our team of hosting experts is available around the clock to help you succeed. Get answers fast via chat, email, or phone.',
      image: '/placeholder.svg',
      imagePosition: 'right',
      bullets: ['Live Chat Support', 'Phone Support', 'Ticket System'],
      buttonText: 'Contact Us',
      buttonLink: '#support',
    },
  ],
};

const AlternatingFeaturesSection: React.FC<AlternatingFeaturesSectionProps> = ({ data = defaultData, sectionId, isEditing = false, styleOverrides, layoutProps }) => {
  const blocks = data.blocks || [];
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('blocks', blocks);

  return (
    <SectionContainer 
      variant="light" 
      padding="lg" 
      data-section="alternating-features"
      styleOverrides={styleOverrides}
    >
      {/* Optional Header */}
      {(data.badge || data.title) && (
        <SectionHeader
          sectionId={sectionId}
          badge={data.badge}
          title={data.title || ''}
        />
      )}

      {/* Feature Blocks - SortableWrapper handles DnD context automatically */}
      {blocks.length > 0 && (
        <SortableWrapper>
          <div className={gapClasses[layoutProps?.gap || 'large']}>
            {blocks.map((block, index) => {
              const isImageLeft = block.imagePosition === 'left';
              
              return (
                <SortableItem
                  key={`${sectionId}-blocks-${index}`}
                  {...getItemProps(index)}
                >
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${isImageLeft ? '' : 'lg:flex-row-reverse'}`}>
                    {/* Image */}
                    <div className={`${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <img 
                          src={block.image} 
                          alt={block.title}
                          className="w-full h-auto aspect-video object-cover"
                        />
                        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-primary to-transparent" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                      <EditableElement
                        path={`blocks.${index}.title`}
                        sectionId={sectionId}
                        as="h3"
                        className="text-2xl lg:text-3xl font-bold text-foreground mb-4"
                      >
                        <RichTextRenderer content={block.title} />
                      </EditableElement>
                      <EditableElement
                        path={`blocks.${index}.description`}
                        sectionId={sectionId}
                        as="p"
                        className="text-muted-foreground text-lg mb-6"
                      >
                        <RichTextRenderer content={block.description || ''} />
                      </EditableElement>

                      {/* Bullets */}
                      {block.bullets && block.bullets.length > 0 && (
                        <ul className="space-y-3 mb-8">
                          {block.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0 bg-primary text-primary-foreground">
                                ✓
                              </span>
                              <EditableInline
                                path={`blocks.${index}.bullets.${bulletIndex}`}
                                sectionId={sectionId}
                                className="text-foreground"
                              >
                                <RichTextRenderer content={bullet} />
                              </EditableInline>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* CTA Button */}
                      {block.buttonText && (
                        <a 
                          href={block.buttonLink || '#'}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:shadow-lg bg-primary text-primary-foreground"
                        >
                          <EditableInline
                            path={`blocks.${index}.buttonText`}
                            sectionId={sectionId}
                          >
                            <RichTextRenderer content={block.buttonText} />
                          </EditableInline>
                          {' →'}
                        </a>
                      )}
                    </div>
                  </div>
                </SortableItem>
              );
            })}
          </div>
        </SortableWrapper>
      )}
    </SectionContainer>
  );
};

export default AlternatingFeaturesSection;
