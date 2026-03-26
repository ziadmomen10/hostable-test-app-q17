import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface V2CareerCta3SectionProps {
  data?: {
    badgeIcon?: string;
    badgeText?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2CareerCta3Section: React.FC<V2CareerCta3SectionProps> = ({ data, sectionId }) => {
  const badgeText = data?.badgeText ?? 'POWERED BY AI';
  const title = data?.title ?? 'Elevate Your Business\nwith HostOnce';
  const subtitle = data?.subtitle ?? 'Stop building. Start launching. HostOnce combines smart AI generation with lightning-fast hosting for instant results and zero downtime.';
  const buttonText = data?.buttonText ?? 'Claim Discount, See Plans';
  const buttonLink = data?.buttonLink ?? '#';

  return (
    <section
      className="w-full relative bg-colors-primary-700 overflow-hidden"
      aria-labelledby="v2-career-cta3-heading"
    >
      {/* Decorative blurs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 right-0 w-[1919px] h-[1919px] rounded-full blur-[80px] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)] opacity-50" />
        <div className="absolute top-[352px] -left-[500px] w-[1919px] h-[1919px] rounded-full blur-[60px] bg-[linear-gradient(183deg,rgba(236,244,210,1)_0%,rgba(236,244,210,0)_100%)] opacity-50" />
      </div>

      {/* Decorative vector */}
      <img
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[783px] h-[468px] hidden md:block"
        alt=""
        src="https://c.animaapp.com/kkRHn6VJ/img/vector-2.svg"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 py-16 md:py-[120px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[160px]">
        <div className="flex flex-col items-start gap-4 max-w-[680px]">
          <div className="flex flex-col items-start gap-2">
            <div className="inline-flex items-center gap-2.5">
              <img className="w-6 h-6" alt="" src="https://c.animaapp.com/kkRHn6VJ/img/icon-63.svg" aria-hidden="true" />
              <EditableInline sectionId={sectionId} path="badgeText" className="font-bold text-colors-neutral-25 text-base tracking-[0.64px] leading-7">
                {badgeText}
              </EditableInline>
            </div>

            <EditableElement
              as="h2"
              id="v2-career-cta3-heading"
              sectionId={sectionId}
              path="title"
              className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-25 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)] whitespace-pre-line"
            >
              {title}
            </EditableElement>
          </div>

          <EditableElement as="p" sectionId={sectionId} path="subtitle" className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-25 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]">
            {subtitle}
          </EditableElement>
        </div>

        <a
          href={buttonLink}
          className="inline-flex items-center justify-center gap-2 py-5 px-8 bg-colors-neutral-800 rounded-2xl overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 shrink-0"
        >
          <EditableInline sectionId={sectionId} path="buttonText" className="font-body-regular-b font-[number:var(--body-regular-b-font-weight)] text-colors-neutral-25 text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)] whitespace-nowrap">
            {buttonText}
          </EditableInline>
          <img className="w-5 h-5" alt="" src="https://c.animaapp.com/kkRHn6VJ/img/icon-64.svg" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
};

export default V2CareerCta3Section;
