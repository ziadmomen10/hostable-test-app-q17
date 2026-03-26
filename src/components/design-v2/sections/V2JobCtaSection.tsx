import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface V2JobCtaSectionProps {
  data?: {
    badgeText?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2JobCtaSection: React.FC<V2JobCtaSectionProps> = ({ data, sectionId }) => {
  const badgeText = data?.badgeText ?? 'POWERED BY AI';
  const title = data?.title ?? 'Elevate Your Business\nwith HostOnce';
  const subtitle = data?.subtitle ?? 'Stop building. Start launching. HostOnce combines smart AI generation with lightning-fast hosting for instant results and zero downtime.';
  const buttonText = data?.buttonText ?? 'Claim Discount, See Plans';
  const buttonLink = data?.buttonLink ?? '#';

  return (
    <section
      className="w-full relative bg-colors-primary-700 overflow-hidden"
      aria-labelledby="job-cta-heading"
    >
      <div
        className="absolute top-[-92px] left-[-1119px] w-[4093px] h-[2271px]"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-[2174px] w-[1919px] h-[1919px] rounded-[959.5px] blur-[80px] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)] opacity-50" />
        <div className="absolute top-[352px] left-0 w-[1919px] h-[1919px] rounded-[959.5px] blur-[60px] bg-[linear-gradient(183deg,rgba(236,244,210,1)_0%,rgba(236,244,210,0)_100%)] opacity-50" />
      </div>

      <img
        className="absolute top-0 left-[calc(50.00%_-_391px)] w-[783px] h-[468px]"
        alt=""
        src="https://c.animaapp.com/L22lErDL/img/vector.svg"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1920px] mx-auto flex items-center justify-between pt-[var(--spacing-30x)] pb-[var(--spacing-30x)] px-[var(--spacing-60x)]">
        <div className="flex flex-col w-[680px] items-start gap-[var(--spacing-4x)] relative">
          <div className="flex flex-col items-start gap-[var(--spacing-2x)] relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex justify-center gap-2.5 items-center relative flex-[0_0_auto]">
              <img
                className="relative w-6 h-6"
                alt=""
                src="https://c.animaapp.com/L22lErDL/img/icon-23.svg"
                aria-hidden="true"
              />
              <EditableInline sectionId={sectionId} path="badgeText" className="relative w-fit mt-[-1.00px] [font-family:'Satoshi-Bold',Helvetica] font-bold text-colors-neutral-25 text-base tracking-[0.64px] leading-7 whitespace-nowrap">
                {badgeText}
              </EditableInline>
            </div>

            <EditableElement
              as="h2"
              id="job-cta-heading"
              sectionId={sectionId}
              path="title"
              className="relative self-stretch font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-25 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)] [font-style:var(--heading-h2-font-style)] whitespace-pre-line"
            >
              {title}
            </EditableElement>
          </div>

          <EditableElement as="p" sectionId={sectionId} path="subtitle" className="relative self-stretch font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-25 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] [font-style:var(--body-regular-font-style)]">
            {subtitle}
          </EditableElement>
        </div>

        <a
          href={buttonLink}
          className="all-[unset] box-border inline-flex items-center justify-center gap-[var(--spacing-2x)] pt-[var(--spacing-5x)] pr-[var(--spacing-8x)] pb-[var(--spacing-5x)] pl-[var(--spacing-8x)] relative flex-[0_0_auto] bg-colors-neutral-800 rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 focus:outline-2 focus:outline-offset-2 focus:outline-colors-neutral-25 transition-opacity"
          aria-label="Claim discount and see pricing plans"
        >
          <EditableInline sectionId={sectionId} path="buttonText" className="relative w-fit mt-[-1.00px] font-body-regular-b font-[number:var(--body-regular-b-font-weight)] text-colors-neutral-25 text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)] whitespace-nowrap [font-style:var(--body-regular-b-font-style)]">
            {buttonText}
          </EditableInline>
          <img
            className="relative w-5 h-5"
            alt=""
            src="https://c.animaapp.com/L22lErDL/img/icon-24.svg"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  );
};

export default V2JobCtaSection;
