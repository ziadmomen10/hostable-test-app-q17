import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface V2CareerTalentPool2SectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2CareerTalentPool2Section: React.FC<V2CareerTalentPool2SectionProps> = ({ data, sectionId }) => {
  const badge = data?.badge ?? "Can't Find Your Role?";
  const title = data?.title ?? 'Jump Into Our Talent Pool';
  const subtitle = data?.subtitle ?? "Can't see a role that fits your skills? We'd still love to hear from you. Send us your CV and tell us why you'd be a great addition to our team. Let's see where your ambition and talent might take you.";
  const buttonText = data?.buttonText ?? 'Submit CV';
  const buttonLink = data?.buttonLink ?? '#';

  return (
    <section className="w-full relative bg-colors-neutral-25">
      <div className="w-full max-w-[1920px] mx-auto py-10 md:py-[60px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[240px]">
        <div className="relative w-full h-[428px] bg-colors-neutral-800 rounded-3xl overflow-hidden">
          <img
            className="absolute top-0 left-0 w-full h-full object-cover"
            alt="Background image showing career opportunities"
            src="https://c.animaapp.com/kkRHn6VJ/img/image-4.png"
          />

          <div className="absolute top-1/2 -translate-y-1/2 left-10 md:left-20 max-w-[600px] flex flex-col items-start gap-5">
            <div className="flex flex-col items-start gap-2 w-full">
              <EditableInline sectionId={sectionId} path="badge" className="font-body-regular-b font-[number:var(--body-regular-b-font-weight)] text-[#c9f355] text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)]">
                {badge}
              </EditableInline>

              <EditableElement as="h2" sectionId={sectionId} path="title" className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-25 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)]">
                {title}
              </EditableElement>
            </div>

            <EditableElement as="p" sectionId={sectionId} path="subtitle" className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-translucent-light-72 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]">
              {subtitle}
            </EditableElement>

            <a
              href={buttonLink}
              className="inline-flex items-center justify-center gap-2 py-5 px-8 bg-[#c9f355] rounded-2xl overflow-hidden cursor-pointer hover:bg-[#b8e340] transition-colors"
            >
              <EditableInline sectionId={sectionId} path="buttonText" className="font-body-regular-b font-[number:var(--body-regular-b-font-weight)] text-[color:var(--colors-secondary-900)] text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)] whitespace-nowrap">
                {buttonText}
              </EditableInline>
              <img className="w-5 h-5" alt="" src="https://c.animaapp.com/kkRHn6VJ/img/icon-48.svg" aria-hidden="true" />
            </a>
          </div>

          {/* Floating badge card */}
          <div className="absolute top-[322px] left-[1083px] w-[327px] h-[74px] shadow-[0px_0px_80px_#00000029] hidden xl:block">
            <div className="absolute top-0 left-0 w-[325px] h-[74px] bg-colors-neutral-25 rounded-3xl backdrop-blur-[20px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(20px)_brightness(100%)]" />
            <span className="inline-flex items-center justify-center gap-2.5 pr-[var(--spacing-3x)] pl-[var(--spacing-3x)] py-0 absolute top-[23px] left-[237px] rounded-[99px] bg-[linear-gradient(101deg,rgba(119,160,32,1)_0%,rgba(49,183,232,1)_100%)] bg-colors-primary-700">
              <span className="relative w-fit font-body-regular-m font-[number:var(--body-regular-m-font-weight)] text-colors-neutral-25 text-[length:var(--body-regular-m-font-size)] tracking-[var(--body-regular-m-letter-spacing)] leading-[var(--body-regular-m-line-height)] whitespace-nowrap [font-style:var(--body-regular-m-font-style)]">Hiring</span>
            </span>
            <span className="absolute top-[21px] left-[157px] [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-neutral-800 text-2xl tracking-[0] leading-[32.2px] whitespace-nowrap">Career</span>
            <img className="absolute top-5 left-5 w-[129px] h-8" alt="Company logo" src="https://c.animaapp.com/kkRHn6VJ/img/logo-2.svg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default V2CareerTalentPool2Section;
