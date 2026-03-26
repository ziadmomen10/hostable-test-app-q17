import React from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface HeroDetailItem {
  id: string;
  icon: string;
  label: string;
  value: string;
}

interface V2JobPostHeroSectionProps {
  data?: {
    title?: string;
    jobDetails?: HeroDetailItem[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2JobPostHeroSection: React.FC<V2JobPostHeroSectionProps> = ({ data, sectionId }) => {
  const { items: jobDetails, getItemProps, SortableWrapper } = useArrayItems<HeroDetailItem>(
    'jobDetails',
    data?.jobDetails ?? []
  );

  const title = data?.title ?? 'Business Development Manager';

  return (
    <section className="w-full relative bg-colors-translucent-dark-2" aria-label="Job posting hero section">
      {/* Job title + detail chips */}
      <div className="w-full max-w-[1920px] mx-auto flex flex-col items-center justify-center py-[100px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
        <div className="inline-flex flex-col items-center gap-[var(--spacing-8x)]">
          <EditableElement
            as="h1"
            sectionId={sectionId}
            path="title"
            className="relative w-fit mt-[-1.00px] font-['Satoshi',Helvetica] font-medium text-colors-neutral-800 text-[56px] md:text-[64px] text-center tracking-[-0.02em] leading-[1.15] whitespace-nowrap"
          >
            {title}
          </EditableElement>

          <SortableWrapper>
            <div className="inline-flex items-center gap-[var(--spacing-10x)] relative flex-[0_0_auto]">
              {jobDetails.map((detail, index) => (
                <div key={detail.id} className="inline-flex items-center gap-[var(--spacing-10x)]">
                  <article
                    {...getItemProps(index)}
                    className="inline-flex flex-col items-center gap-[var(--spacing-x)] relative flex-[0_0_auto] px-[var(--spacing-4x)] py-[var(--spacing-2x)]"
                  >
                    <div className="inline-flex items-center gap-[var(--spacing-2x)] relative flex-[0_0_auto]">
                      <img className="relative w-4 h-4 aspect-[1]" alt="" src={detail.icon} aria-hidden="true" />
                      <EditableInline
                        sectionId={sectionId}
                        path={`jobDetails.${index}.label`}
                        className="relative w-fit mt-[-1.00px] font-body-small-m font-[number:var(--body-small-m-font-weight)] text-colors-neutral-500 text-[length:var(--body-small-m-font-size)] tracking-[var(--body-small-m-letter-spacing)] leading-[var(--body-small-m-line-height)] whitespace-nowrap [font-style:var(--body-small-m-font-style)]"
                      >
                        {detail.label}
                      </EditableInline>
                    </div>
                    <EditableInline
                      sectionId={sectionId}
                      path={`jobDetails.${index}.value`}
                      className="relative w-fit font-['Satoshi',Helvetica] font-bold text-colors-neutral-800 text-lg tracking-[0] leading-[1.4] whitespace-nowrap"
                    >
                      {detail.value}
                    </EditableInline>
                  </article>
                  {index < jobDetails.length - 1 && (
                    <img className="relative w-px h-10 object-cover" alt="" src="https://c.animaapp.com/GP8l9Rh9/img/line-1.svg" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </SortableWrapper>
        </div>
      </div>
    </section>
  );
};

export default V2JobPostHeroSection;
