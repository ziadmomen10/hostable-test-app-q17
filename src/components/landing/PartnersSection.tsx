import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { ExternalLink } from 'lucide-react';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseSectionProps, BaseLayoutProps } from '@/types/baseSectionTypes';
import type { PartnersSectionData } from '@/types/newSectionTypes';

interface PartnersSectionProps extends BaseSectionProps {
  data: PartnersSectionData;
  layoutProps?: BaseLayoutProps;
}

const PartnersSection = ({ 
  data, 
  sectionId, 
  isEditing = false,
  styleOverrides,
  layoutProps
}: PartnersSectionProps) => {
  // Get DnD utilities for the partners array
  const { items, getItemProps, SortableWrapper } = useArrayItems(
    'partners', 
    data.partners || []
  );
  
  // Apply layout settings from Style tab
  const columns = layoutProps?.columns ?? 4;
  const gridColsClass = getGridColsClass(columns);
  const gapClass = getGapClass(layoutProps?.gap);
  
  return (
    <SectionContainer styleOverrides={styleOverrides}>
      {/* Use SectionHeader for consistent header rendering */}
      <SectionHeader 
        sectionId={sectionId}
        badge={data.badge} 
        title={data.title}
        subtitle={data.subtitle}
      />
      
      {/* Wrap sortable items in SortableWrapper */}
      <SortableWrapper>
        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} ${gapClass || 'gap-6'}`}>
          {items.map((partner, index) => (
            // SortableItem enables drag-and-drop
            <SortableItem 
              key={partner.id || index} 
              {...getItemProps(index)}
            >
              <div className="group p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                {/* Logo */}
                <div className="h-16 mb-4 flex items-center justify-center">
                  <img 
                    src={partner.logo || '/placeholder.svg'} 
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-semibold text-foreground mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {partner.description}
                  </p>
                  
                  {/* Website link (only show if not editing) */}
                  {partner.website && !isEditing && (
                    <a 
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Visit website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
};

export default PartnersSection;
