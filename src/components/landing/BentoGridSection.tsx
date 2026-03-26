/**
 * Bento Grid Section
 * Modern asymmetric feature cards layout
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { BentoGridSectionData, BentoGridItem } from '@/types/newSectionTypes';
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

interface BentoGridItemWithPosition extends BentoGridItem {
  position?: ElementPosition;
}

interface BentoGridSectionProps {
  data?: BentoGridSectionData & { items?: BentoGridItemWithPosition[] };
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultData: BentoGridSectionData & { items: BentoGridItemWithPosition[] } = {
  badge: 'WHY US',
  title: 'The Complete Hosting Solution',
  subtitle: 'Everything you need to succeed online',
  items: [
    { 
      title: 'Lightning Fast', 
      description: 'NVMe SSDs and optimized caching for blazing fast load times', 
      icon: '⚡', 
      size: 'large',
      span: 2
    },
    { 
      title: '99.9% Uptime', 
      description: 'Guaranteed reliability', 
      icon: '📈', 
      size: 'small',
      span: 1
    },
    { 
      title: 'Free SSL', 
      description: 'Secure your site', 
      icon: '🔒', 
      size: 'small',
      span: 1
    },
    { 
      title: 'Global CDN', 
      description: '200+ edge locations worldwide for fast content delivery', 
      icon: '🌍', 
      size: 'medium',
      span: 1
    },
    { 
      title: '24/7 Support', 
      description: 'Expert help when you need it most. Live chat, phone, and email support available around the clock.', 
      icon: '🎧', 
      size: 'large',
      span: 2
    },
    { 
      title: 'Daily Backups', 
      description: 'Automatic backups with one-click restore', 
      icon: '💾', 
      size: 'medium',
      span: 1
    },
  ],
};

const BentoGridSection: React.FC<BentoGridSectionProps> = ({ data = defaultData, sectionId, isEditing = false, styleOverrides, layoutProps }) => {
  const items = (data.items || []) as BentoGridItemWithPosition[];
  
  // Use layoutProps for grid configuration
  const columns = layoutProps?.columns ?? 3;
  const gridColsClass = getGridColsClass(columns, 'md');
  const gapClass = getGapClass(layoutProps?.gap ?? 'small');
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('items', items);
  
  return (
    <SectionContainer 
      variant="muted" 
      padding="lg" 
      data-section="bento-grid"
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

      {/* Bento Grid - SortableWrapper handles DnD context automatically */}
      <SortableWrapper>
        <div className={`grid ${gridColsClass} ${gapClass} auto-rows-fr relative`}>
          {items.map((item, index) => {
            const isLarge = item.size === 'large' || item.span === 2;
            
            return (
              <SortableItem
                key={`${sectionId}-items-${index}`}
                {...getItemProps(index)}
                className={isLarge ? 'md:col-span-2 lg:col-span-2' : ''}
              >
                <div
                  className={`
                    relative bg-card rounded-2xl p-6 border border-border 
                    hover:shadow-xl hover:border-primary/20 transition-all group overflow-hidden h-full
                    ${item.size === 'large' ? 'min-h-[200px]' : item.size === 'medium' ? 'min-h-[160px]' : 'min-h-[140px]'}
                  `}
                >
                  {/* Background decoration */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-primary/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Icon */}
                  <div 
                    className={`
                      ${item.size === 'large' ? 'w-16 h-16 text-4xl' : 'w-12 h-12 text-2xl'}
                      rounded-xl flex items-center justify-center mb-4 relative z-10 bg-primary/10
                    `}
                  >
                    {ICON_MAP[item.icon] ? (
                      React.createElement(ICON_MAP[item.icon], { 
                        className: item.size === 'large' ? 'w-8 h-8 text-primary' : 'w-6 h-6 text-primary',
                      })
                    ) : (
                      <span>{item.icon}</span>
                    )}
                  </div>

                  <div className="relative z-10">
                    <EditableElement
                      as="h3"
                      sectionId={sectionId}
                      path={`items.${index}.title`}
                      className={`font-bold text-foreground mb-2 ${item.size === 'large' ? 'text-xl' : 'text-lg'}`}
                      isEmpty={!item.title}
                      placeholder="Item title"
                    >
                      <RichTextRenderer content={item.title} />
                    </EditableElement>
                    <EditableElement
                      as="p"
                      sectionId={sectionId}
                      path={`items.${index}.description`}
                      className={`text-muted-foreground ${item.size === 'small' ? 'text-sm' : ''}`}
                      isEmpty={!item.description}
                      placeholder="Item description"
                    >
                      <RichTextRenderer content={item.description || ''} />
                    </EditableElement>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-primary-foreground">→</span>
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

export default BentoGridSection;
