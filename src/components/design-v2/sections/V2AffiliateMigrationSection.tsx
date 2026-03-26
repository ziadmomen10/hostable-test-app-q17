import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { Badge } from '@/components/ui/badge';

interface V2AffiliateMigrationSectionProps {
  data?: {
    badgeLogo?: string;
    badgeText?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2AffiliateMigrationSection: React.FC<V2AffiliateMigrationSectionProps> = ({ data, sectionId }) => {
  const badgeLogo = data?.badgeLogo ?? '/lovable-uploads/migration/Logo-hostonce.png';
  const badgeText = data?.badgeText ?? 'Partner Program';
  const title = data?.title ?? 'Start Earning Today';
  const subtitle = data?.subtitle ?? 'Join the HostOnce partnership program for free. Get your unique link, recommend the future of hosting, and earn up to 60% commission on every sale.';
  const buttonText = data?.buttonText ?? 'Become an Affiliate';
  const buttonLink = data?.buttonLink ?? '#';

  return (
    <section
      className="w-full relative bg-colors-neutral-25 overflow-hidden"
      aria-labelledby="v2-affiliate-migration-heading"
    >
      <div className="relative z-10 w-full max-w-[1920px] mx-auto py-[60px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[240px]">
        {/* Green content box */}
        <div className="relative bg-[#CAF355] rounded-3xl overflow-hidden flex flex-col items-center gap-[16px] py-[56px] px-[80px]">
          {/* Border decoration overlay */}
          <img
            src="/lovable-uploads/migration/Border.png"
            alt=""
            aria-hidden="true"
            className="hidden xl:block absolute left-1/2 -translate-x-1/2 bottom-0 w-[54.7%] h-auto pointer-events-none"
          />
          {/* Content above border overlay */}
          <div className="relative z-10 flex flex-col items-center gap-[16px]">
          {/* Badge */}
          <Badge className="flex items-center gap-2 border-0 bg-transparent hover:bg-transparent px-0">
            {badgeLogo && (
              <img className="w-[65px] h-4" alt="" src={badgeLogo} aria-hidden="true" />
            )}
            {/* Separator */}
            <div className="h-3 border-l border-colors-neutral-800 opacity-50" aria-hidden="true" />
            <EditableInline 
              sectionId={sectionId} 
              path="badgeText" 
              className="text-colors-neutral-800 text-[12px] font-normal leading-[1.7] whitespace-nowrap"
            >
              {badgeText}
            </EditableInline>
          </Badge>

          {/* Heading */}
          <EditableElement
            as="h2"
            id="v2-affiliate-migration-heading"
            sectionId={sectionId}
            path="title"
            className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[1.26] text-center"
          >
            {title}
          </EditableElement>

          {/* Paragraph */}
          <EditableElement 
            as="p" 
            sectionId={sectionId} 
            path="subtitle" 
            className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-700 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] text-center max-w-[600px]"
          >
            {subtitle}
          </EditableElement>

          {/* Button */}
          <a
            href={buttonLink}
            className="inline-flex items-center justify-center gap-2 py-5 px-8 bg-colors-neutral-800 rounded-[16px] overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 mt-[8px]"
          >
            <EditableInline 
              sectionId={sectionId} 
              path="buttonText" 
              className="font-body-regular font-bold text-[16px] leading-[1.75] text-colors-neutral-25 whitespace-nowrap"
            >
              {buttonText}
            </EditableInline>
              <img 
                alt="" 
                className="w-[20px] h-[20px] shrink-0" 
                src="/lovable-uploads/migration/Icon-right-arrow.png" 
                aria-hidden="true"
              />
          </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V2AffiliateMigrationSection;
