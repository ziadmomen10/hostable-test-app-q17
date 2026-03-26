import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface V2BenefitCardData {
  id: string;
  title: string;
  description: string;
  icon: string;
  backgroundImage?: string;
  bgColor: string;
  size: 'large' | 'medium' | 'full';
}

interface V2BenefitsSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    benefits?: V2BenefitCardData[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2BenefitsSection: React.FC<V2BenefitsSectionProps> = ({ data, sectionId }) => {
  const badge = data?.badge ?? 'BENEFITS';
  const title = data?.title ?? 'Host Once, and Never Worry Again';
  const subtitle = data?.subtitle ?? 'Stop building. Start launching. HostOnce combines smart AI generation with lightning-fast hosting for instant results and zero downtime.';
  const aiToolCards = [
    {
      icon: "https://c.animaapp.com/dkLoZgXd/img/icon-1.svg",
      text: "Update product description",
      icons: "https://c.animaapp.com/dkLoZgXd/img/icons.svg",
      position: "top-[54px] left-[calc(50.00%_-_108px)]",
      width: "w-[375px]",
      bgOpacity: "bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_100%)]",
      textColor: "text-colors-neutral-25",
    },
    {
      icon: "https://c.animaapp.com/dkLoZgXd/img/icon-2.svg",
      text: "Update product description",
      icons: "https://c.animaapp.com/dkLoZgXd/img/icons-1.svg",
      position: "top-[34px] left-[calc(50.00%_-_128px)]",
      width: "w-[415px]",
      bgOpacity: "bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_100%)]",
      textColor: "text-colors-neutral-25",
    },
    {
      icon: "https://c.animaapp.com/dkLoZgXd/img/icon-3.svg",
      text: "Update product description",
      icons: "https://c.animaapp.com/dkLoZgXd/img/icons-2.svg",
      position: "top-3.5 left-[calc(50.00%_-_148px)]",
      width: "w-[455px]",
      bgOpacity: "bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.29)_100%)]",
      textColor: "text-colors-neutral-800",
    },
  ];

  return (
    <section
      className="w-full relative bg-white"
      data-model-id="4145:1963"
      aria-labelledby="benefits-heading"
    >
      <div className="flex flex-col w-full max-w-[1920px] mx-auto items-center gap-10 md:gap-14 py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col w-full md:w-[436px] items-start relative">
          <EditableInline sectionId={sectionId} path="badge" className="relative w-fit mt-[-1.00px] [font-family:'Satoshi-Bold',Helvetica] font-bold text-[#628c16] text-base tracking-[0.64px] leading-7">
            {badge}
          </EditableInline>

          <EditableElement
            as="h2"
            id="benefits-heading"
            sectionId={sectionId}
            path="title"
            className="relative self-stretch font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)] [font-style:var(--heading-h2-font-style)]"
          >
            {title}
          </EditableElement>
        </div>

        <EditableElement as="p" sectionId={sectionId} path="subtitle" className="relative w-full md:w-[560px] opacity-75 font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] [font-style:var(--body-regular-font-style)]">
          {subtitle}
        </EditableElement>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-x-[38px] lg:gap-y-[40px] w-full">
        <article className="relative lg:col-span-3 h-[300px] md:h-[350px] lg:h-[400px] bg-[#accc5414] rounded-3xl border border-solid border-colors-translucent-light-16 backdrop-blur-md backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(12px)_brightness(100%)]">
          <img
            className="absolute inset-0 w-full h-full object-cover object-center rounded-3xl"
            alt=""
            src="https://c.animaapp.com/dkLoZgXd/img/background.png"
            role="presentation"
          />

          <div className="inline-flex flex-col items-start justify-center gap-[var(--spacing-2x)] absolute top-1/2 -translate-y-1/2 left-6 md:left-10 lg:left-[76px] lg:top-[100px] lg:translate-y-0 w-[220px] md:w-[260px] lg:w-[280px] z-10">
            <div className="inline-flex flex-col items-center justify-center gap-[var(--spacing-4x-duplicate)] relative flex-[0_0_auto]">
              <img
                className="relative w-10 h-10"
                alt=""
                src="https://c.animaapp.com/dkLoZgXd/img/icon.svg"
                role="presentation"
              />

          <EditableElement as="h3" sectionId={sectionId} path="benefits.0.title" className="relative w-fit font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] text-center tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] [font-style:var(--heading-h4-font-style)]">
                 {data?.benefits?.[0]?.title ?? 'Enterprise-grade Security and Compliance'}
               </EditableElement>
             </div>

            <EditableElement as="p" sectionId={sectionId} path="benefits.0.description" className="relative self-stretch font-body-small font-[number:var(--body-small-font-weight)] text-colors-neutral-600 text-[length:var(--body-small-font-size)] text-center tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] [font-style:var(--body-small-font-style)]">
               {data?.benefits?.[0]?.description ?? 'Your data is protected by firewalls, real-time malware scanning, and advanced DDoS defense.'}
             </EditableElement>
          </div>
        </article>

        <article className="flex flex-col lg:col-span-2 h-[350px] lg:h-[399px] items-center justify-end gap-2.5 p-6 relative bg-[#eebe1f14] rounded-3xl overflow-hidden border border-solid border-[#0000000a] backdrop-blur-md backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(12px)_brightness(100%)]">
          <div className="hidden lg:block absolute top-14 left-[-565px] w-[1492px] h-[1095px]">
            <div className="absolute top-[154px] left-[565px] w-[927px] h-[927px] rounded-[463.5px] blur-lg bg-[linear-gradient(210deg,rgba(255,240,191,1)_0%,rgba(255,240,191,0)_100%)] opacity-60" />

            <div className="absolute top-[168px] left-0 w-[927px] h-[927px] rounded-[463.5px] blur-md bg-[linear-gradient(122deg,rgba(255,240,191,1)_0%,rgba(255,240,191,0)_100%)] opacity-60" />

            {aiToolCards.map((card, index) => (
              <div
                key={index}
                className={`flex flex-col ${card.width} h-20 items-start gap-[15px] p-2.5 absolute ${card.position} rounded-[15px] border-[none] shadow-[0px_0px_80px_#00000029] backdrop-blur-[20px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(20px)_brightness(100%)] ${card.bgOpacity} border-colors-translucent-light-24 before:content-[''] before:absolute before:inset-0 before:p-[2.5px] before:rounded-[15px] before:[background:linear-gradient(180deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.02)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none`}
              >
                <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                  <img
                    className="relative w-[76.19px] h-[76.24px] mt-[-25.12px] mb-[-25.12px] ml-[-28.10px]"
                    alt=""
                    src={card.icon}
                    role="presentation"
                  />

                  <div className="inline-flex items-center relative flex-[0_0_auto]">
                    <span
                      className={`relative w-fit mt-[-1.25px] [font-family:'Satoshi-Medium',Helvetica] font-medium ${card.textColor} text-[15px] tracking-[0] leading-[25.5px] whitespace-nowrap`}
                    >
                      {card.text}
                    </span>

                    <div
                      className={`relative w-[1.25px] h-[21.25px] ${card.textColor === "text-colors-neutral-25" ? "bg-colors-neutral-25" : "bg-colors-neutral-800"}`}
                    />
                  </div>
                </div>

                <img
                  className="relative flex-[0_0_auto]"
                  alt=""
                  src={card.icons}
                  role="presentation"
                />
              </div>
            ))}

            <img
              className="absolute top-[calc(50.00%_-_604px)] left-[calc(50.00%_+_138px)] w-[202px] h-[202px]"
              alt=""
              src="https://c.animaapp.com/dkLoZgXd/img/float.svg"
              role="presentation"
            />
          </div>

          {/* Mobile/tablet simplified AI decoration */}
          <div className="lg:hidden flex items-center justify-center gap-4 absolute top-[22%] left-1/2 -translate-x-1/2 opacity-60">
            {aiToolCards.map((card, index) => (
              <img
                key={index}
                className="w-12 h-12"
                alt=""
                src={card.icon}
                role="presentation"
              />
            ))}
          </div>


          <div className="flex w-full max-w-[409px] items-start relative flex-[0_0_auto] flex-col justify-center gap-[var(--spacing-2x)]">
            <div className="flex flex-col items-center justify-center gap-[var(--spacing-4x-duplicate)] relative self-stretch w-full flex-[0_0_auto]">
              <img
                className="relative w-10 h-10"
                alt=""
                src="https://c.animaapp.com/dkLoZgXd/img/icon-4.svg"
                role="presentation"
              />

              <EditableElement as="h3" sectionId={sectionId} path="benefits.1.title" className="relative w-fit font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] whitespace-nowrap [font-style:var(--heading-h4-font-style)]">
                 {data?.benefits?.[1]?.title ?? 'AI-Powered Tools'}
               </EditableElement>
             </div>

            <EditableElement as="p" sectionId={sectionId} path="benefits.1.description" className="relative self-stretch font-body-small font-[number:var(--body-small-font-weight)] text-colors-neutral-600 text-[length:var(--body-small-font-size)] text-center tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] [font-style:var(--body-small-font-style)]">
               {data?.benefits?.[1]?.description ?? 'Our AI assistant for one-click setup, maintenance, and optimization'}
             </EditableElement>
          </div>
        </article>

        <article className="flex flex-col lg:col-span-2 h-[350px] lg:h-[399px] items-center justify-end gap-2.5 p-6 relative bg-[#f6a64f14] rounded-3xl overflow-hidden border border-solid border-[#0000000a] backdrop-blur-md backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(12px)_brightness(100%)]">
          <img
            className="absolute inset-0 w-full h-full object-cover object-left-top"
            alt=""
            src="https://c.animaapp.com/dkLoZgXd/img/background-1.png"
            role="presentation"
          />

          <div className="flex w-full max-w-[409px] items-center relative flex-[0_0_auto] flex-col justify-center gap-[var(--spacing-2x)] z-10">
            <div className="flex flex-col items-center justify-center gap-[var(--spacing-4x-duplicate)] relative self-stretch w-full flex-[0_0_auto]">
              <img
                className="relative w-10 h-10"
                alt=""
                src="https://c.animaapp.com/dkLoZgXd/img/icon-5.svg"
                role="presentation"
              />

              <EditableElement as="h3" sectionId={sectionId} path="benefits.2.title" className="relative self-stretch font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] text-center tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] [font-style:var(--heading-h4-font-style)]">
                 {data?.benefits?.[2]?.title ?? 'Automatic Backups'}
               </EditableElement>
             </div>

            <EditableElement as="p" sectionId={sectionId} path="benefits.2.description" className="relative self-stretch font-body-small font-[number:var(--body-small-font-weight)] text-colors-neutral-600 text-[length:var(--body-small-font-size)] text-center tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] [font-style:var(--body-small-font-style)]">
               {data?.benefits?.[2]?.description ?? '24/7 priority access to our expert support team.'}
             </EditableElement>
          </div>
        </article>

        <article className="relative lg:col-span-3 h-[300px] md:h-[350px] lg:h-[400px] bg-[#00b67a0a] rounded-3xl border border-solid border-colors-translucent-light-16 backdrop-blur-md backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(12px)_brightness(100%)]">
          <img
            className="absolute inset-0 w-full h-full object-cover object-center md:object-left rounded-3xl"
            alt=""
            src="https://c.animaapp.com/dkLoZgXd/img/background-2.png"
            role="presentation"
          />

          <div className="inline-flex items-center absolute top-1/2 left-1/2 sm:left-auto sm:right-4 sm:translate-x-0 lg:right-auto lg:left-[60%] -translate-y-1/2 -translate-x-1/2 lg:translate-x-0 flex-col justify-center gap-[var(--spacing-2x)] w-[200px] sm:w-[220px] md:w-[260px] lg:w-[280px] z-10">
            <div className="inline-flex flex-col items-center justify-center gap-[var(--spacing-4x-duplicate)] relative flex-[0_0_auto]">
              <img
                className="relative w-10 h-10"
                alt=""
                src="https://c.animaapp.com/dkLoZgXd/img/icon-6.svg"
                role="presentation"
              />

              <EditableElement as="h3" sectionId={sectionId} path="benefits.3.title" className="relative w-fit font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] text-center tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] whitespace-nowrap [font-style:var(--heading-h4-font-style)]">
                 {data?.benefits?.[3]?.title ?? 'Unbeatable Performance'}
               </EditableElement>
             </div>

            <EditableElement as="p" sectionId={sectionId} path="benefits.3.description" className="relative self-stretch font-body-small font-[number:var(--body-small-font-weight)] text-colors-neutral-600 text-[length:var(--body-small-font-size)] text-center tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] [font-style:var(--body-small-font-style)]">
               {data?.benefits?.[3]?.description ?? 'We guarantee industry-leading speed and 99.9% uptime.'}
             </EditableElement>
          </div>
        </article>

        <article className="relative md:col-span-2 lg:col-span-5 h-[180px] lg:h-[201px] bg-[#21759b0a] rounded-3xl border border-solid border-colors-translucent-light-16 backdrop-blur-md backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(12px)_brightness(100%)]">
          <img
            className="absolute inset-0 w-full h-full object-cover object-center rounded-3xl"
            alt=""
            src="https://c.animaapp.com/dkLoZgXd/img/background-3.png"
            role="presentation"
          />

          <div className="inline-flex items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col justify-center gap-[var(--spacing-2x)] w-full max-w-[384px] px-4 z-10">
            <div className="inline-flex flex-col items-center justify-center gap-[var(--spacing-4x-duplicate)] relative flex-[0_0_auto]">
              <img
                className="relative w-10 h-10"
                alt=""
                src="https://c.animaapp.com/dkLoZgXd/img/icon-7.svg"
                role="presentation"
              />

              <EditableElement as="h3" sectionId={sectionId} path="benefits.4.title" className="relative w-fit font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] text-center tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] whitespace-nowrap [font-style:var(--heading-h4-font-style)]">
                 {data?.benefits?.[4]?.title ?? '30 Day Money-back Guarantee'}
               </EditableElement>
             </div>

            <EditableElement as="p" sectionId={sectionId} path="benefits.4.description" className="relative self-stretch font-body-small font-[number:var(--body-small-font-weight)] text-colors-neutral-600 text-[length:var(--body-small-font-size)] text-center tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] [font-style:var(--body-small-font-style)]">
               {data?.benefits?.[4]?.description ?? 'We guarantee industry-leading speed and 99.9% uptime.'}
             </EditableElement>
          </div>
        </article>
      </div>
      </div>
    </section>
  );
};

export default V2BenefitsSection;
