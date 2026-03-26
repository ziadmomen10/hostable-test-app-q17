import React from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface BenefitItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface V2CareerBenefitsSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    benefits?: BenefitItem[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2CareerBenefitsSection: React.FC<V2CareerBenefitsSectionProps> = ({ data, sectionId }) => {
  const title = data?.title ?? 'Why Build Your Career at Hostonce?';
  const subtitle = data?.subtitle ?? "At Ultahost, you'll find purpose, progress, and a place where your career is just getting started.";
  const buttonText = data?.buttonText ?? 'Become an Affiliate';
  const buttonLink = data?.buttonLink ?? '#';

  const { items: benefits, getItemProps, SortableWrapper } = useArrayItems<BenefitItem>(
    'benefits',
    data?.benefits ?? []
  );

  return (
    <section
      className="w-full relative bg-colors-translucent-dark-2"
      aria-labelledby="v2-career-benefits-heading"
    >
      <div className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-16 py-16 md:py-[120px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
        {/* Left column: header + CTA */}
        <div className="flex flex-col items-start gap-10 lg:gap-14 w-full lg:max-w-[582px] shrink-0">
          <header className="flex flex-col items-start gap-4 w-full">
            <EditableElement
              as="h2"
              id="v2-career-benefits-heading"
              sectionId={sectionId}
              path="title"
              className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)]"
            >
              {title}
            </EditableElement>

            <EditableElement as="p" sectionId={sectionId} path="subtitle" className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-translucent-dark-64 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]">
              {subtitle}
            </EditableElement>
          </header>

          <a
            href={buttonLink}
            className="inline-flex items-center justify-center gap-2 py-5 px-8 bg-[#c9f355] rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            <EditableInline sectionId={sectionId} path="buttonText" className="font-body-regular-b font-[number:var(--body-regular-b-font-weight)] text-colors-secondary-900 text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)] whitespace-nowrap">
              {buttonText}
            </EditableInline>
            <img className="w-5 h-5" alt="" src="https://c.animaapp.com/I1qx8eSi/img/icon.svg" aria-hidden="true" />
          </a>
        </div>

        {/* Right column: 2x2 card grid */}
        <SortableWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 w-full lg:max-w-[618px]">
            {benefits.map((benefit, index) => (
              <article key={benefit.id} {...getItemProps(index)} className="flex flex-col items-start gap-6 md:gap-8 p-6 md:p-8 bg-colors-neutral-25 rounded-3xl shadow-[0px_0px_80px_#0000000a] h-full">
                <img className="w-14 h-14" alt="" src={benefit.icon} aria-hidden="true" />
                <div className="flex flex-col items-start gap-3 w-full">
                  <EditableInline sectionId={sectionId} path={`benefits.${index}.title`} className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)]">
                    {benefit.title}
                  </EditableInline>
                  <EditableElement as="p" sectionId={sectionId} path={`benefits.${index}.description`} className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]">
                    {benefit.description}
                  </EditableElement>
                </div>
              </article>
            ))}
          </div>
        </SortableWrapper>
      </div>
    </section>
  );
};

export default V2CareerBenefitsSection;
