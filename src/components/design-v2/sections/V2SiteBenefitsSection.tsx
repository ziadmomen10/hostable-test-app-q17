import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface AiToolCard {
  icon: string;
  text: string;
  icons: string;
  position: string;
  width: string;
  bgOpacity: string;
  textColor: string;
}

const aiToolCards: AiToolCard[] = [
  { icon: 'https://c.animaapp.com/dkLoZgXd/img/icon-1.svg', text: 'Update product description', icons: 'https://c.animaapp.com/dkLoZgXd/img/icons.svg', position: 'top-[54px] left-[calc(50.00%_-_108px)]', width: 'w-[375px]', bgOpacity: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_100%)]', textColor: 'text-colors-neutral-25' },
  { icon: 'https://c.animaapp.com/dkLoZgXd/img/icon-2.svg', text: 'Update product description', icons: 'https://c.animaapp.com/dkLoZgXd/img/icons-1.svg', position: 'top-[34px] left-[calc(50.00%_-_128px)]', width: 'w-[415px]', bgOpacity: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_100%)]', textColor: 'text-colors-neutral-25' },
  { icon: 'https://c.animaapp.com/dkLoZgXd/img/icon-3.svg', text: 'Update product description', icons: 'https://c.animaapp.com/dkLoZgXd/img/icons-2.svg', position: 'top-3.5 left-[calc(50.00%_-_148px)]', width: 'w-[455px]', bgOpacity: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.29)_100%)]', textColor: 'text-colors-neutral-800' },
];

interface V2SiteBenefitsSectionProps {
  data?: {
    badge?: string;
    title?: string;
    card1Title?: string;
    card1Subtitle?: string;
    card2Title?: string;
    card2Subtitle?: string;
    card3Title?: string;
    card3Subtitle?: string;
    card4Title?: string;
    card4Subtitle?: string;
    card5Title?: string;
    card5Subtitle?: string;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2SiteBenefitsSection: React.FC<V2SiteBenefitsSectionProps> = ({ data, sectionId }) => {
  const badge = data?.badge ?? 'BENEFITS';
  const title = data?.title ?? 'Host Once, and Never Worry Again';
  const card1Title = data?.card1Title ?? 'Enterprise-grade\nSecurity and Compliance';
  const card1Subtitle = data?.card1Subtitle ?? 'Your data is protected by firewalls, real-time malware scanning, and advanced DDoS defense.';
  const card2Title = data?.card2Title ?? 'AI-Powered Tools';
  const card2Subtitle = data?.card2Subtitle ?? 'Our AI assistant for one-click setup, maintenance, and optimization';
  const card3Title = data?.card3Title ?? 'Automatic Backups';
  const card3Subtitle = data?.card3Subtitle ?? '24/7 priority access to our expert support team.';
  const card4Title = data?.card4Title ?? 'Unbeatable Performance';
  const card4Subtitle = data?.card4Subtitle ?? 'We guarantee industry-leading speed and 99.9% uptime.';
  const card5Title = data?.card5Title ?? '30 Day Money-back Guarantee';
  const card5Subtitle = data?.card5Subtitle ?? 'We guarantee industry-leading speed and 99.9% uptime.';

  return (
    <section className="w-full relative bg-white" aria-labelledby="v2-site-benefits-heading">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col items-start gap-[var(--spacing-14x)] py-16 md:py-[120px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[240px]">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between w-full gap-6">
          <div className="flex flex-col w-full md:w-[436px] items-start">
            <EditableInline sectionId={sectionId} path="badge" className="font-bold text-[#628c16] text-base tracking-[0.64px] leading-7">
              {badge}
            </EditableInline>
            <EditableElement as="h2" id="v2-site-benefits-heading" sectionId={sectionId} path="title" className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)]">
              {title}
            </EditableElement>
          </div>
          <p className="w-full md:w-[560px] opacity-75 font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]">
            Stop building. Start launching. HostOnce combines smart AI generation with lightning-fast hosting for instant results and zero downtime.
          </p>
        </header>

        {/* Bento grid */}
        <div className="flex flex-wrap items-start gap-[40px_38px] w-full">
          {/* Card 1 — Enterprise Security (large) */}
          <article className="relative w-full xl:w-[881px] h-[400px] bg-[#accc5414] rounded-3xl border border-solid border-colors-translucent-light-16 backdrop-blur-md overflow-hidden">
            <img className="absolute w-[calc(100%_-_2px)] top-px left-px h-[398px]" alt="" src="https://c.animaapp.com/dkLoZgXd/img/background.png" role="presentation" />
            <div className="inline-flex flex-col items-start justify-center gap-2 absolute top-[100px] left-[76px]">
              <div className="inline-flex flex-col items-center justify-center gap-4">
                <img className="w-10 h-10" alt="" src="https://c.animaapp.com/dkLoZgXd/img/icon.svg" role="presentation" />
                <EditableElement as="h3" sectionId={sectionId} path="card1Title" className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] text-center tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] whitespace-pre-line">
                  {card1Title}
                </EditableElement>
              </div>
              <EditableElement as="p" sectionId={sectionId} path="card1Subtitle" className="font-body-small font-[number:var(--body-small-font-weight)] text-colors-neutral-600 text-[length:var(--body-small-font-size)] text-center tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)]">
                {card1Subtitle}
              </EditableElement>
            </div>
          </article>

          {/* Card 2 — AI Tools */}
          <article className="flex flex-col w-full xl:w-[521px] h-[399px] items-center justify-end gap-2.5 p-6 relative bg-[#eebe1f14] rounded-3xl overflow-hidden border border-solid border-[#0000000a] backdrop-blur-md">
            <div className="absolute top-14 left-[-565px] w-[1492px] h-[1095px]">
              <div className="absolute top-[154px] left-[565px] w-[927px] h-[927px] rounded-[463.5px] blur-lg bg-[linear-gradient(210deg,rgba(255,240,191,1)_0%,rgba(255,240,191,0)_100%)] opacity-60" />
              <div className="absolute top-[168px] left-0 w-[927px] h-[927px] rounded-[463.5px] blur-md bg-[linear-gradient(122deg,rgba(255,240,191,1)_0%,rgba(255,240,191,0)_100%)] opacity-60" />
              {aiToolCards.map((card, index) => (
                <div key={index} className={`flex flex-col ${card.width} h-20 items-start gap-[15px] p-2.5 absolute ${card.position} rounded-[15px] border-[none] shadow-[0px_0px_80px_#00000029] backdrop-blur-[20px] ${card.bgOpacity} border-colors-translucent-light-24 before:content-[''] before:absolute before:inset-0 before:p-[2.5px] before:rounded-[15px] before:[background:linear-gradient(180deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.02)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none`}>
                  <div className="flex items-center gap-2.5 w-full">
                    <img className="relative w-[76.19px] h-[76.24px] mt-[-25.12px] mb-[-25.12px] ml-[-28.10px]" alt="" src={card.icon} role="presentation" />
                    <div className="inline-flex items-center">
                      <span className={`font-medium ${card.textColor} text-[15px] leading-[25.5px] whitespace-nowrap`}>{card.text}</span>
                      <div className={`w-[1.25px] h-[21.25px] ${card.textColor === 'text-colors-neutral-25' ? 'bg-colors-neutral-25' : 'bg-colors-neutral-800'}`} />
                    </div>
                  </div>
                  <img className="relative" alt="" src={card.icons} role="presentation" />
                </div>
              ))}
              <img className="absolute top-[calc(50.00%_-_604px)] left-[calc(50.00%_+_138px)] w-[202px] h-[202px]" alt="" src="https://c.animaapp.com/dkLoZgXd/img/float.svg" role="presentation" />
            </div>
            <div className="flex w-[409px] flex-col items-center justify-center gap-2">
              <div className="flex flex-col items-center justify-center gap-4 w-full">
                <img className="w-10 h-10" alt="" src="https://c.animaapp.com/dkLoZgXd/img/icon-4.svg" role="presentation" />
                <EditableInline sectionId={sectionId} path="card2Title" className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] whitespace-nowrap">
                  {card2Title}
                </EditableInline>
              </div>
              <EditableElement as="p" sectionId={sectionId} path="card2Subtitle" className="font-body-small font-[number:var(--body-small-font-weight)] text-colors-neutral-600 text-[length:var(--body-small-font-size)] text-center tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)]">
                {card2Subtitle}
              </EditableElement>
            </div>
          </article>

          {/* Card 3 — Automatic Backups */}
          <article className="flex flex-col w-full xl:w-[521px] h-[399px] items-center justify-end gap-2.5 p-6 relative bg-[#f6a64f14] rounded-3xl overflow-hidden border border-solid border-[#0000000a] backdrop-blur-md">
            <img className="absolute top-0 left-0 w-full h-full" alt="" src="https://c.animaapp.com/dkLoZgXd/img/background-1.png" role="presentation" />
            <div className="flex w-[409px] flex-col items-center justify-center gap-2">
              <div className="flex flex-col items-center justify-center gap-4 w-full">
                <img className="w-10 h-10" alt="" src="https://c.animaapp.com/dkLoZgXd/img/icon-5.svg" role="presentation" />
                <EditableInline sectionId={sectionId} path="card3Title" className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] text-center tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)]">
                  {card3Title}
                </EditableInline>
              </div>
              <EditableElement as="p" sectionId={sectionId} path="card3Subtitle" className="font-body-small font-[number:var(--body-small-font-weight)] text-colors-neutral-600 text-[length:var(--body-small-font-size)] text-center tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)]">
                {card3Subtitle}
              </EditableElement>
            </div>
          </article>

          {/* Card 4 — Unbeatable Performance (large) */}
          <article className="relative w-full xl:w-[881px] h-[400px] bg-[#00b67a0a] rounded-3xl border border-solid border-colors-translucent-light-16 backdrop-blur-md overflow-hidden">
            <img className="absolute w-[calc(100%_-_2px)] top-px left-px h-[398px]" alt="" src="https://c.animaapp.com/dkLoZgXd/img/background-2.png" role="presentation" />
            <div className="inline-flex items-center absolute top-32 left-[534px] flex-col justify-center gap-2">
              <div className="inline-flex flex-col items-center justify-center gap-4">
                <img className="w-10 h-10" alt="" src="https://c.animaapp.com/dkLoZgXd/img/icon-6.svg" role="presentation" />
                <EditableInline sectionId={sectionId} path="card4Title" className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] text-center tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] whitespace-nowrap">
                  {card4Title}
                </EditableInline>
              </div>
              <EditableElement as="p" sectionId={sectionId} path="card4Subtitle" className="font-body-small font-[number:var(--body-small-font-weight)] text-colors-neutral-600 text-[length:var(--body-small-font-size)] text-center tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)]">
                {card4Subtitle}
              </EditableElement>
            </div>
          </article>

          {/* Card 5 — Money-back Guarantee (full width short) */}
          <article className="relative flex-1 min-w-full xl:min-w-0 h-[201px] bg-[#21759b0a] rounded-3xl border border-solid border-colors-translucent-light-16 backdrop-blur-md overflow-hidden">
            <img className="absolute w-[calc(100%_-_2px)] top-px left-px h-[200px]" alt="" src="https://c.animaapp.com/dkLoZgXd/img/background-3.png" role="presentation" />
            <div className="inline-flex items-center absolute top-[calc(50.00%_-_60px)] left-[calc(50.00%_-_192px)] flex-col justify-center gap-2">
              <div className="inline-flex flex-col items-center justify-center gap-4">
                <img className="w-10 h-10" alt="" src="https://c.animaapp.com/dkLoZgXd/img/icon-7.svg" role="presentation" />
                <EditableInline sectionId={sectionId} path="card5Title" className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] text-center tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] whitespace-nowrap">
                  {card5Title}
                </EditableInline>
              </div>
              <EditableElement as="p" sectionId={sectionId} path="card5Subtitle" className="font-body-small font-[number:var(--body-small-font-weight)] text-colors-neutral-600 text-[length:var(--body-small-font-size)] text-center tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)]">
                {card5Subtitle}
              </EditableElement>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default V2SiteBenefitsSection;
