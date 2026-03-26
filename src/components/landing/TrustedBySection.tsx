/**
 * Trusted By Section
 * Review platforms and company logos
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { Star } from 'lucide-react';
import type { TrustedBySectionProps, ReviewPlatform, TrustedCompany } from '@/types/sectionProps';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer } from '@/components/landing/shared';
import type { SectionStyleProps } from '@/types/elementSettings';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import { gapClasses } from '@/types/sectionSettings';

const defaultPlatforms: ReviewPlatform[] = [
  { name: 'Google', rating: 4.8, reviewCount: '300+', logo: '' },
  { name: 'Trustpilot', rating: 4.8, reviewCount: '1,000+', logo: '' },
  { name: 'Reviews.io', rating: 4.8, reviewCount: '1,704', logo: '' },
];

const defaultCompanies: TrustedCompany[] = [
  { name: 'TechCrunch' },
  { name: 'Forbes' },
  { name: 'TechRadar' },
  { name: 'HubSpot' },
  { name: 'CyberNews' },
  { name: 'Website Planet' },
  { name: 'NP Digital' },
  { name: 'CNET' },
];

// Platform color mapping using semantic colors where possible
const platformColors: Record<string, string> = {
  Google: 'bg-red-500',
  Trustpilot: 'bg-green-500',
  'Reviews.io': 'bg-orange-500',
};

const TrustedBySection = ({
  badge,
  title = 'Trusted by leading companies worldwide',
  platforms = defaultPlatforms,
  companies = defaultCompanies,
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}: TrustedBySectionProps & { 
  sectionId?: string; 
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}) => {
  // Use centralized DnD hooks for both arrays
  const platformsDnd = useArrayItems('platforms', platforms);
  const companiesDnd = useArrayItems('companies', companies);

  return (
    <SectionContainer variant="light" padding="sm" className="border-b border-border" styleOverrides={styleOverrides}>
      {/* Review Platforms */}
      {platforms && platforms.length > 0 && (
        <platformsDnd.SortableWrapper>
          <div className={`flex flex-wrap justify-center ${gapClasses[layoutProps?.gap || 'large']} mb-12`}>
            {platforms.map((platform, index) => (
              <SortableItem
                key={`${sectionId}-platforms-${index}`}
                {...platformsDnd.getItemProps(index)}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className={`w-8 h-8 ${platformColors[platform.name] || 'bg-primary'} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                      {platform.name.charAt(0)}
                    </div>
                    <EditableInline
                      path={`platforms.${index}.name`}
                      sectionId={sectionId}
                      className="font-semibold text-foreground"
                    >
                      <RichTextRenderer content={platform.name} />
                    </EditableInline>
                  </div>
                  <div className="flex justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <EditableElement
                    path={`platforms.${index}.rating`}
                    sectionId={sectionId}
                    as="p"
                    className="font-bold text-foreground"
                  >
                    {platform.rating}
                  </EditableElement>
                  <EditableElement
                    path={`platforms.${index}.reviewCount`}
                    sectionId={sectionId}
                    as="p"
                    className="text-xs text-muted-foreground"
                  >
                    {platform.reviewCount} reviews
                  </EditableElement>
                </div>
              </SortableItem>
            ))}
          </div>
        </platformsDnd.SortableWrapper>
      )}

      {/* Trusted Companies */}
      {companies && companies.length > 0 && (
        <div className="border-t border-border pt-8">
          <EditableElement
            path="title"
            sectionId={sectionId}
            as="p"
            className="text-center text-muted-foreground text-sm mb-6"
          >
            <RichTextRenderer content={title} />
          </EditableElement>
          <companiesDnd.SortableWrapper>
            <div className={`flex flex-wrap justify-center items-center ${gapClasses[layoutProps?.gap || 'large']} opacity-60`}>
              {companies.map((company, index) => (
                <SortableItem
                  key={`${sectionId}-companies-${index}`}
                  {...companiesDnd.getItemProps(index)}
                >
                  <EditableInline
                    path={`companies.${index}.name`}
                    sectionId={sectionId}
                    className="text-muted-foreground font-semibold text-lg"
                  >
                    <RichTextRenderer content={company.name} />
                  </EditableInline>
                </SortableItem>
              ))}
            </div>
          </companiesDnd.SortableWrapper>
        </div>
      )}
    </SectionContainer>
  );
};

export default TrustedBySection;
