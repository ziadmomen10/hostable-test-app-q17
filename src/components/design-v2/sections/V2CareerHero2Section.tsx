import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface V2CareerHero2SectionProps {
  data?: {
    badge?: string;
    title?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2CareerHero2Section: React.FC<V2CareerHero2SectionProps> = ({ data, sectionId }) => {
  const badge = data?.badge ?? 'Career at Hostonce';
  const title = data?.title ?? 'Join Our Innovative Team and Help Shape the Future of Web Hosting';
  const buttonText = data?.buttonText ?? 'Explore Job Openings';
  const buttonLink = data?.buttonLink ?? '#';

  return (
    <section
      className="w-full relative bg-colors-neutral-25 overflow-hidden"
      aria-labelledby="v2-career-hero2-heading"
    >
      <div className="w-full max-w-[1920px] mx-auto relative min-h-[600px] md:min-h-[800px] lg:min-h-[1000px]">
        {/* Decorative image collage — desktop only */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[722px] hidden xl:block" dir="ltr">
          <div className="absolute top-0 left-0 w-[1440px] h-[722px] bg-[url(https://c.animaapp.com/kkRHn6VJ/img/background.svg)] bg-[100%_100%]">
            <img className="absolute top-0 left-0 w-[1440px] h-[722px]" alt="" src="https://c.animaapp.com/kkRHn6VJ/img/pattern.png" aria-hidden="true" />

            <div className="absolute w-[1168px] h-[642px] top-10 left-[169px]">
              <img className="absolute top-[95px] left-[60px] w-[945px] h-[475px]" alt="" src="https://c.animaapp.com/kkRHn6VJ/img/background-1.png" aria-hidden="true" />
              <img className="absolute top-[-120px] -left-40 w-[640px] h-[540px]" alt="Team member working" src="https://c.animaapp.com/kkRHn6VJ/img/image@2x.png" />
              <img className="absolute -top-10 -left-20 w-[1222px] h-[762px]" alt="Office environment" src="https://c.animaapp.com/kkRHn6VJ/img/image-1.png" />
              <img className="absolute -top-40 left-[622px] w-[640px] h-[720px]" alt="Team collaboration" src="https://c.animaapp.com/kkRHn6VJ/img/image-2@2x.png" />
              <img className="absolute top-[82px] left-0 w-[883px] h-[680px]" alt="Workplace culture" src="https://c.animaapp.com/kkRHn6VJ/img/image-3.png" />

              {/* Floating badge card */}
              <div className="absolute top-[520px] left-[843px] w-[327px] h-[74px] shadow-[0px_0px_80px_#00000029]">
                <div className="absolute top-0 left-0 w-[325px] h-[74px] bg-colors-neutral-25 rounded-3xl backdrop-blur-[20px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(20px)_brightness(100%)]" />
                <span className="inline-flex items-center justify-center gap-2.5 pr-[var(--spacing-3x)] pl-[var(--spacing-3x)] py-0 absolute top-[23px] left-[237px] rounded-[99px] bg-[linear-gradient(101deg,rgba(119,160,32,1)_0%,rgba(49,183,232,1)_100%)] bg-colors-primary-700">
                  <span className="relative w-fit font-body-regular-m font-[number:var(--body-regular-m-font-weight)] text-colors-neutral-25 text-[length:var(--body-regular-m-font-size)] tracking-[var(--body-regular-m-letter-spacing)] leading-[var(--body-regular-m-line-height)] whitespace-nowrap [font-style:var(--body-regular-m-font-style)]">Hiring</span>
                </span>
                <span className="absolute top-[21px] left-[157px] [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-neutral-800 text-2xl tracking-[0] leading-[32.2px] whitespace-nowrap">Career</span>
                <img className="absolute top-5 left-5 w-[129px] h-8" alt="Hostonce" src="https://c.animaapp.com/kkRHn6VJ/img/logo-2.svg" />
              </div>
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
              id="v2-career-hero2-heading"
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
            <EditableInline sectionId={sectionId} path="buttonText" className="font-body-regular-b font-[number:var(--body-regular-b-font-weight)] text-[color:var(--colors-secondary-900)] text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)] whitespace-nowrap">
              {buttonText}
            </EditableInline>
            <img className="w-5 h-5" alt="" src="https://c.animaapp.com/kkRHn6VJ/img/icon-6.svg" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default V2CareerHero2Section;
