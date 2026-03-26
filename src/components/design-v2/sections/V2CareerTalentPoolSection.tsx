import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface V2CareerTalentPoolSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundImage?: string;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2CareerTalentPoolSection: React.FC<V2CareerTalentPoolSectionProps> = ({ data, sectionId }) => {
  const badge = data?.badge ?? "Can't Find Your Role?";
  const title = data?.title ?? 'Jump Into Our Talent Pool';
  const subtitle = data?.subtitle ?? "Can't see a role that fits your skills? We'd still love to hear from you. Send us your CV and tell us why you'd be a great addition to our team.";
  const buttonText = data?.buttonText ?? 'Submit CV';
  const buttonLink = data?.buttonLink ?? '#';
  const backgroundImage = data?.backgroundImage ?? 'https://c.animaapp.com/IfGcrHC1/img/image.png';

  return (
    <section
      className="w-full relative bg-colors-neutral-25"
      aria-labelledby="v2-career-talent-pool-heading"
    >
      <div className="w-full max-w-[1920px] mx-auto py-10 md:py-[60px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
        <div className="relative w-full min-h-[350px] md:min-h-[428px] bg-colors-neutral-800 rounded-3xl overflow-hidden">
          {/* Background image */}
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt=""
            src={backgroundImage}
            role="presentation"
          />

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col items-start gap-5 p-6 md:p-10 lg:p-20 max-w-[600px]">
            <div className="flex flex-col items-start gap-2 w-full">
              <EditableInline sectionId={sectionId} path="badge" className="font-body-regular-b font-[number:var(--body-regular-b-font-weight)] text-[#c9f355] text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)]">
                {badge}
              </EditableInline>

              <EditableElement
                as="h2"
                id="v2-career-talent-pool-heading"
                sectionId={sectionId}
                path="title"
                className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-25 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)]"
              >
                {title}
              </EditableElement>
            </div>

            <EditableElement as="p" sectionId={sectionId} path="subtitle" className="font-body-regular font-[number:var(--body-regular-font-weight)] text-white text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]">
              {subtitle}
            </EditableElement>

            <a
              href={buttonLink}
              className="inline-flex items-center justify-center gap-2 py-5 px-8 bg-[#c9f355] rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              <EditableInline sectionId={sectionId} path="buttonText" className="font-body-regular-b font-[number:var(--body-regular-b-font-weight)] text-colors-secondary-900 text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)] whitespace-nowrap">
                {buttonText}
              </EditableInline>
              <img className="w-5 h-5" alt="" src="https://c.animaapp.com/IfGcrHC1/img/icon.svg" role="presentation" />
            </a>
          </div>

          {/* Floating badge */}
          <div className="absolute bottom-6 right-6 md:bottom-[106px] md:right-10 lg:right-[357px] hidden md:block" dir="ltr">
            <div className="relative w-[327px] h-[74px]">
              <div className="absolute inset-0 bg-colors-neutral-25 rounded-3xl backdrop-blur-[20px] shadow-[0px_0px_80px_#00000029]" />
              <div className="inline-flex items-center justify-center gap-2.5 px-3 absolute top-[23px] left-[237px] rounded-[99px] bg-[linear-gradient(101deg,rgba(119,160,32,1)_0%,rgba(49,183,232,1)_100%)]">
                <span className="font-body-regular-m font-[number:var(--body-regular-m-font-weight)] text-colors-neutral-25 text-[length:var(--body-regular-m-font-size)] tracking-[var(--body-regular-m-letter-spacing)] leading-[var(--body-regular-m-line-height)] whitespace-nowrap">
                  Hiring
                </span>
              </div>
              <div className="absolute top-[21px] left-[157px] font-normal text-colors-neutral-800 text-2xl leading-[32.2px] whitespace-nowrap">
                Career
              </div>
              <img className="absolute top-5 left-5 w-[129px] h-8" alt="Company logo" src="https://c.animaapp.com/IfGcrHC1/img/logo.svg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V2CareerTalentPoolSection;
