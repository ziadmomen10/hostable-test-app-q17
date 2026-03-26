/**
 * OS Selector Section
 * Grid of operating systems/software icons with category tabs
 */

import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { OSSelectorSectionData } from '@/types/newSectionTypes';
import { SortableItem } from '@/components/editor/SortableItem';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

// Use centralized icon map for all icons
const iconMap: Record<string, LucideIcon> = ICON_MAP;

interface OSSelectorSectionProps {
  data?: OSSelectorSectionData;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultData: OSSelectorSectionData = {
  badge: 'ONE-CLICK INSTALL',
  title: 'Choose Your Operating System',
  subtitle: 'Deploy your favorite OS or application with just one click',
  categories: ['Operating Systems', 'Control Panels', 'Applications'],
  items: [
    { icon: '🐧', name: 'Ubuntu', category: 'Operating Systems', badge: 'Popular' },
    { icon: '🎩', name: 'CentOS', category: 'Operating Systems' },
    { icon: '🦎', name: 'Debian', category: 'Operating Systems' },
    { icon: '🪟', name: 'Windows Server', category: 'Operating Systems' },
    { icon: '🔵', name: 'Fedora', category: 'Operating Systems' },
    { icon: '🐉', name: 'AlmaLinux', category: 'Operating Systems' },
    { icon: '🎛️', name: 'cPanel', category: 'Control Panels', badge: 'Popular' },
    { icon: '🔧', name: 'Plesk', category: 'Control Panels' },
    { icon: '⚙️', name: 'DirectAdmin', category: 'Control Panels' },
    { icon: '🌐', name: 'WordPress', category: 'Applications', badge: 'Popular' },
    { icon: '🛒', name: 'WooCommerce', category: 'Applications' },
    { icon: '📝', name: 'Joomla', category: 'Applications' },
  ],
};

const OSSelectorSection: React.FC<OSSelectorSectionProps> = ({ 
  data = defaultData, 
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}) => {
  const [activeCategory, setActiveCategory] = useState(data.categories[0] || 'All');
  const items = data.items || [];
  
  // Use layoutProps for grid configuration
  const columns = layoutProps?.columns ?? 4;
  const gridColsClass = getGridColsClass(columns, 'md');
  const gapClass = getGapClass(layoutProps?.gap ?? 'small');
  
  const { SortableWrapper, getItemProps } = useArrayItems('items', items);

  // Filter items by category for display, but keep original indices for DnD
  const displayItems = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => activeCategory === 'All' || item.category === activeCategory);

  return (
    <SectionContainer 
      variant="light" 
      padding="lg"
      data-section="os-selector"
      styleOverrides={styleOverrides}
    >
      <SectionHeader
        sectionId={sectionId}
        badge={data.badge}
        title={data.title || ''}
        subtitle={data.subtitle}
        badgeClassName="text-sm font-semibold uppercase tracking-wider text-primary bg-transparent px-0 py-0"
        subtitleClassName="max-w-2xl"
      />

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {data.categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* OS Grid with SortableContext */}
      <SortableWrapper>
        <div className={`grid grid-cols-2 ${gridColsClass} ${gapClass}`}>
          {displayItems.map(({ item, index }) => (
            <SortableItem key={`${sectionId}-items-${index}`} {...getItemProps(index)}>
              <div className="relative bg-muted rounded-2xl p-6 text-center hover:shadow-lg hover:bg-background transition-all cursor-pointer border border-transparent hover:border-border group">
                {item.badge && (
                  <EditableInline
                    sectionId={sectionId}
                    path={`items.${index}.badge`}
                    className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground"
                  >
                    {item.badge}
                  </EditableInline>
                )}
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform bg-primary/10">
                  {iconMap[item.icon] ? (
                    React.createElement(iconMap[item.icon], { className: 'w-6 h-6 text-foreground' })
                  ) : (
                    item.icon
                  )}
                </div>
                <EditableInline
                  sectionId={sectionId}
                  path={`items.${index}.name`}
                  className="text-sm font-medium text-foreground"
                >
                  {item.name}
                </EditableInline>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
};

export default OSSelectorSection;
