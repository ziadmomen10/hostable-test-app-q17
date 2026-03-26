import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface V2CareerHeroSectionProps {
  data?: {
    badge?: string;
    title?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2CareerHeroSection: React.FC<V2CareerHeroSectionProps> = ({ data, sectionId }) => {
  const badge = data?.badge ?? 'Career at Hostonce';
  const title = data?.title ?? 'Join Our Innovative Team and Help Shape the Future of Web Hosting';
  const buttonText = data?.buttonText ?? 'Explore Job Openings';
  const buttonLink = data?.buttonLink ?? '#';

  return (
    <section
      className="w-full relative bg-colors-neutral-25 overflow-hidden"
      aria-labelledby="v2-career-hero-heading"
    >
      <div className="w-full max-w-[1920px] mx-auto relative min-h-[600px] md:min-h-[800px] lg:min-h-[1000px]">
        {/* Decorative image collage — desktop only */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[722px] hidden xl:block" dir="ltr">
          <img
            className="absolute inset-0 w-full h-full object-contain"
            alt=""
            src="https://c.animaapp.com/AjvvoAr5/img/background.svg"
            aria-hidden="true"
          />
          <img
            className="absolute inset-0 w-full h-full object-contain"
            alt=""
            src="https://c.animaapp.com/AjvvoAr5/img/pattern.png"
            aria-hidden="true"
          />
          <div className="absolute w-full h-full top-10 left-0">
            <img className="absolute top-[95px] left-[15%] w-[65%] h-auto" alt="" src="https://c.animaapp.com/AjvvoAr5/img/background-1.png" aria-hidden="true" />
            <img className="absolute -top-[120px] left-0 w-[44%] h-auto" alt="" src="https://c.animaapp.com/AjvvoAr5/img/image@2x.png" aria-hidden="true" />
            <img className="absolute -top-10 left-0 w-[85%] h-auto" alt="" src="https://c.animaapp.com/AjvvoAr5/img/image-1.png" aria-hidden="true" />
            <img className="absolute -top-40 right-0 w-[44%] h-auto" alt="" src="https://c.animaapp.com/AjvvoAr5/img/image-2@2x.png" aria-hidden="true" />
            <img className="absolute top-[82px] left-0 w-[61%] h-auto" alt="" src="https://c.animaapp.com/AjvvoAr5/img/image-3.png" aria-hidden="true" />

            {/* Floating badge */}
            <div className="absolute bottom-[48px] right-[10%] w-[327px] h-[74px] shadow-[0px_0px_80px_#00000029]">
              <div className="absolute inset-0 bg-colors-neutral-25 rounded-3xl backdrop-blur-[20px]" />
              <div className="inline-flex items-center justify-center gap-2.5 px-3 absolute top-[23px] left-[237px] rounded-[99px] bg-[linear-gradient(101deg,rgba(119,160,32,1)_0%,rgba(49,183,232,1)_100%)]">
                <span className="font-body-regular-m text-colors-neutral-25 whitespace-nowrap text-sm">Hiring</span>
              </div>
              <div className="absolute top-[21px] left-[157px] font-normal text-colors-neutral-800 text-2xl leading-[32.2px] whitespace-nowrap">Career</div>
              <img className="absolute top-5 left-5 w-[129px] h-8" alt="Logo" src="https://c.animaapp.com/AjvvoAr5/img/logo.svg" />
            </div>
          </div>
        </div>

        {/* Hero content — centered */}
        <div className="relative z-10 flex flex-col items-center gap-5 pt-[100px] md:pt-[160px] px-4 sm:px-6 md:px-12 max-w-[760px] mx-auto text-center">
          <div className="flex flex-col items-center gap-3 w-full">
            <EditableInline sectionId={sectionId} path="badge" className="font-body-small-m font-[number:var(--body-small-m-font-weight)] text-colors-primary-800 text-[length:var(--body-small-m-font-size)] tracking-[var(--body-small-m-letter-spacing)] leading-[var(--body-small-m-line-height)]">
              {badge}
            </EditableInline>

            <EditableElement
              as="h1"
              id="v2-career-hero-heading"
              sectionId={sectionId}
              path="title"
              className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)]"
            >
              {title}
            </EditableElement>
          </div>

          <a
            href={buttonLink}
            className="inline-flex items-center justify-center gap-2 py-5 px-8 bg-[#c9f355] rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            <EditableInline sectionId={sectionId} path="buttonText" className="font-body-regular-b font-[number:var(--body-regular-b-font-weight)] text-colors-secondary-900 text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)] whitespace-nowrap">
              {buttonText}
            </EditableInline>
            <img className="w-5 h-5" alt="" src="https://c.animaapp.com/AjvvoAr5/img/icon-6.svg" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default V2CareerHeroSection;
