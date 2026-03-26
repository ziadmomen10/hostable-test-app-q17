import React from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface HostingOption {
  id: number;
  icon: string;
  title: string;
  price: string;
  bestFor: string;
  ratingBars: number;
  isWordPress?: boolean;
}

const hostingData: HostingOption[] = [
  {
    id: 1,
    icon: "https://c.animaapp.com/CB75pelm/img/icon.svg",
    title: "Shared Hosting",
    price: "$2.80",
    bestFor: "NEW SITES & BUDGET",
    ratingBars: 2,
  },
  {
    id: 2,
    icon: "https://c.animaapp.com/CB75pelm/img/icon-2.svg",
    title: "VPS Hosting",
    price: "$2.80",
    bestFor: "SCALE & CUSTOM SETUPS",
    ratingBars: 3,
  },
  {
    id: 3,
    icon: "https://c.animaapp.com/CB75pelm/img/icon-4.svg",
    title: "VDS Hosting",
    price: "$2.80",
    bestFor: "GROWTH & MANAGED RESOURCES",
    ratingBars: 3,
  },
  {
    id: 4,
    icon: "https://c.animaapp.com/CB75pelm/img/main@2x.png",
    title: "WordPress Hosting",
    price: "$2.80",
    bestFor: "GROWTH & MANAGED RESOURCES",
    ratingBars: 3,
    isWordPress: true,
  },
  {
    id: 5,
    icon: "https://c.animaapp.com/CB75pelm/img/icon-7.svg",
    title: "Game Hosting",
    price: "$2.80",
    bestFor: "WP SPEED & SECURITY",
    ratingBars: 2,
  },
  {
    id: 6,
    icon: "https://c.animaapp.com/CB75pelm/img/icon-9.svg",
    title: "Email Hosting",
    price: "$2.80",
    bestFor: "WP SPEED & SECURITY",
    ratingBars: 2,
  },
  {
    id: 7,
    icon: "https://c.animaapp.com/CB75pelm/img/icon-11.svg",
    title: "Dedicated Hosting",
    price: "$2.80",
    bestFor: "WP SPEED & SECURITY",
    ratingBars: 4,
  },
];

const HostingCard: React.FC<HostingOption & { sectionId?: string; itemIndex?: number }> = ({
  icon,
  title,
  price,
  bestFor,
  ratingBars,
  isWordPress,
  sectionId,
  itemIndex,
}) => {
  return (
    <article className="flex flex-col items-start justify-end gap-6 p-8 relative flex-1 w-full bg-colors-neutral-25 rounded-3xl overflow-hidden shadow-[0px_0px_80px_#00000014]">
      {isWordPress ? (
        <div className="flex w-14 h-14 items-center justify-center gap-2.5 p-1.5 relative rounded-2xl border border-solid border-colors-translucent-dark-16">
          <img className="relative w-8 h-8 aspect-square" alt={title} src={icon} />
        </div>
      ) : (
        <img className="relative w-14 h-14" alt={title} src={icon} />
      )}

      <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
        <EditableElement as="h3" sectionId={sectionId} path={`hostingOptions.${itemIndex}.title`} className="relative w-fit mt-[-1px] font-['Satoshi',sans-serif] font-medium text-colors-neutral-800 text-2xl tracking-[-0.02em] leading-[32.2px]">
          {title}
        </EditableElement>
      </div>

      <div className="inline-flex items-end gap-2 relative">
        <div className="inline-flex items-end py-1 px-0 relative self-stretch">
          <span className="relative w-fit font-['Satoshi',sans-serif] font-normal text-colors-neutral-800 text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
            From
          </span>
        </div>

        <div className="inline-flex items-end gap-1 relative">
          <span className="relative w-fit mt-[-1px] font-['Satoshi',sans-serif] font-medium text-colors-neutral-800 text-[28px] tracking-[0] leading-[37.5px] whitespace-nowrap">
            {price}
          </span>

          <div className="flex flex-col w-6 items-start justify-end gap-2.5 pb-1 pt-0 px-0 relative self-stretch">
            <span className="relative w-fit opacity-75 font-['Satoshi',sans-serif] font-normal text-colors-neutral-800 text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
              /mo
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
        <div className="inline-flex items-center justify-center gap-2 relative flex-wrap">
          <span className="relative w-fit font-['Satoshi',sans-serif] font-bold text-colors-primary-700 text-xs tracking-[0.96px] leading-[20.4px] whitespace-nowrap">
            *BEST FOR
          </span>

          <div className="inline-flex items-center justify-center gap-1 py-1 px-2 relative bg-colors-neutral-50 rounded-lg border border-solid border-colors-neutral-100">
            <img
              className="relative w-2.5 h-2.5"
              alt="Icon"
              src="https://c.animaapp.com/CB75pelm/img/icon-12.svg"
            />

            <EditableInline sectionId={sectionId} path={`hostingOptions.${itemIndex}.bestFor`} className="relative w-fit mt-[-1px] font-['Satoshi',sans-serif] font-medium text-[#2020207a] text-xs tracking-[0] leading-[16.8px] whitespace-nowrap">
              {bestFor}
            </EditableInline>
          </div>
        </div>

        <div
          className="flex items-start gap-1 relative self-stretch w-full"
          role="meter"
          aria-label={`Rating: ${ratingBars} out of 5`}
        >
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`relative flex-1 grow h-2 rounded-[99px] ${
                index < ratingBars
                  ? "bg-colors-primary-400"
                  : "bg-colors-primary-100"
              }`}
            />
          ))}
        </div>
      </div>
    </article>
  );
};

const BrowseAllCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 relative flex-1 w-full bg-colors-neutral-25 rounded-3xl overflow-hidden shadow-[0px_0px_80px_#00000014]">
      <div className="gap-1 flex flex-col items-start relative self-stretch w-full">
        <h3 className="relative self-stretch mt-[-1px] font-['Satoshi',sans-serif] font-bold text-colors-neutral-800 text-2xl text-center tracking-[-0.02em] leading-[32.2px]">
          More Hostings Available
        </h3>

        <p className="relative self-stretch font-['Satoshi',sans-serif] font-normal text-colors-neutral-500 text-base text-center tracking-[0] leading-[28px]">
          Browse all the hostings from below.
        </p>
      </div>

      <button className="inline-flex items-center justify-center gap-2 py-4 px-8 relative bg-colors-primary-500 hover:bg-colors-primary-700 transition-colors rounded-2xl overflow-hidden">
        <span className="relative w-fit mt-[-1px] font-['Satoshi',sans-serif] font-bold text-colors-secondary-900 text-base tracking-[0] leading-[22.4px] whitespace-nowrap">
          Browse All
        </span>

        <img
          className="relative w-5 h-5"
          alt="Arrow icon"
          src="https://c.animaapp.com/CB75pelm/img/icon-13.svg"
        />
      </button>
    </div>
  );
};

const PromoBanner: React.FC = () => {
  return (
    <aside className="relative w-full min-h-[188px] bg-colors-neutral-800 rounded-3xl overflow-hidden border border-solid border-colors-translucent-dark-8 mt-8">
      {/* Green gradient blur #1 */}
      <div className="hidden lg:block absolute top-5 left-[834px] bg-colors-primary-800 opacity-50 w-[927px] h-[927px] rounded-[463.5px] blur-[60px] pointer-events-none" />
      
      {/* Green gradient blur #2 */}
      <div className="hidden lg:block absolute top-32 left-[-532px] bg-colors-primary-800 opacity-75 w-[927px] h-[927px] rounded-[463.5px] blur-[60px] pointer-events-none" />

      {/* Content container - responsive flex layout */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 p-6 lg:p-8 xl:pl-[52px]">
        {/* Left: Badge + Heading */}
        <div className="flex flex-col gap-2">
          {/* Hosting Fair badge */}
          <div className="inline-flex items-center gap-1">
            <img
              className="relative w-4 h-4"
              alt="Icon"
              src="https://c.animaapp.com/CB75pelm/img/icon-14.svg"
            />
            <span className="relative w-fit font-['Satoshi',sans-serif] font-bold text-colors-primary-400 text-base leading-[22.4px] whitespace-nowrap">
              Hosting Fair
            </span>
          </div>

          {/* Discount heading */}
          <p className="font-['Satoshi',sans-serif] font-bold text-colors-neutral-25 text-2xl md:text-[32px] leading-tight">
            <span>Up To </span>
            <span className="text-colors-primary-400">40% Discount</span>
          </p>
        </div>

        {/* Countdown timer */}
        <div
          className="inline-flex items-center gap-[9px]"
          role="timer"
          aria-label="Countdown timer"
        >
          <div className="flex w-12 items-center justify-center py-2 px-3 relative bg-colors-translucent-light-4 rounded-lg border border-solid border-colors-translucent-light-8">
            <span className="relative font-['Satoshi',sans-serif] font-bold text-colors-neutral-25 text-sm leading-[19.6px] whitespace-nowrap">
              2H
            </span>
          </div>
          <div className="flex w-12 items-center justify-center py-2 px-3 relative bg-colors-translucent-light-4 rounded-lg border border-solid border-colors-translucent-light-8">
            <span className="relative font-['Satoshi',sans-serif] font-bold text-colors-neutral-25 text-sm leading-[19.6px] whitespace-nowrap">
              23M
            </span>
          </div>
          <div className="flex w-12 items-center justify-center py-2 px-3 relative bg-colors-translucent-light-4 rounded-lg border border-solid border-colors-translucent-light-8">
            <span className="relative font-['Satoshi',sans-serif] font-bold text-colors-neutral-25 text-sm leading-[19.6px] whitespace-nowrap">
              44S
            </span>
          </div>
        </div>
      </div>

      {/* Decorative area with browser mockups */}
      <div className="hidden xl:block absolute top-0 right-0 w-[700px] h-[188px] pointer-events-none overflow-hidden">
        <img
          className="absolute top-5 left-0 w-[620px] h-auto"
          alt="Outer"
          src="https://c.animaapp.com/CB75pelm/img/outer.png"
        />
        <img
          className="absolute -top-2 -left-[60px] w-[720px] h-auto"
          alt="Inner"
          src="https://c.animaapp.com/CB75pelm/img/inner.png"
        />
      </div>

      {/* VPS Server Card - absolute positioned with gradient border */}
      <div className="hidden xl:block absolute top-[calc(50%-57px)] left-[calc(50%+69px)] w-[241px] h-[114px] rounded-2xl overflow-hidden shadow-[0px_0px_80px_#00000066] backdrop-blur-[20px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(20px)_brightness(100%)]" style={{ backgroundColor: 'rgba(26, 38, 23, 1)' }}>
        {/* Gradient border effect */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none z-[1]" 
          style={{ 
            padding: '1px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.02) 100%)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor'
          }} 
        />
        
        {/* Internal gradient glows - lower z-index */}
        <div className="absolute top-[-41px] left-[-72px] w-[927px] h-[927px] rounded-[463.5px] blur-md opacity-[0.24] pointer-events-none z-0" style={{ background: 'linear-gradient(195deg, rgba(172,204,84,1) 0%, rgba(172,204,84,0) 100%)' }} />
        <div className="absolute top-14 left-[-582px] w-[927px] h-[927px] rounded-[463.5px] blur opacity-[0.24] pointer-events-none z-0" style={{ background: 'linear-gradient(116deg, rgba(172,204,84,1) 0%, rgba(172,204,84,0) 100%)' }} />

        {/* Card content - higher z-index */}
        <div className="flex flex-col w-[116px] items-start gap-1 absolute top-5 left-5 z-10">
          <img
            className="relative w-6 h-6"
            alt="Logo"
            src="https://c.animaapp.com/CB75pelm/img/logo.svg"
          />
          <div className="h-[42px] flex flex-col items-start relative self-stretch w-full">
            <span className="relative w-fit mt-[-1px] mr-[-4px] font-['Satoshi',sans-serif] font-bold text-white text-sm tracking-[0] leading-[24.4px] whitespace-nowrap">
              Mark's VPS Server
            </span>
            <span className="relative self-stretch -mt-0.5 font-['Satoshi',sans-serif] text-white/60 text-xs leading-[16.8px]">
              255.189.85.19
            </span>
          </div>
        </div>

        {/* ACTIVE badge - higher z-index */}
        <div className="inline-flex items-center justify-center gap-1 px-2 py-0.5 absolute top-12 left-[158px] bg-white/25 rounded-[99px] shadow-[0px_0px_16px_#00000014] z-10">
          <div className="relative w-[3px] h-[3px] bg-white rounded-[1.5px]" />
          <span className="relative w-fit mt-[-1px] font-['Satoshi',sans-serif] font-bold text-white text-[10px] tracking-[0] leading-[17px] whitespace-nowrap">
            ACTIVE
          </span>
        </div>
      </div>
    </aside>
  );
};

interface V2HostingOptionsSectionProps {
  data?: {
    title?: string;
    hostingOptions?: HostingOption[];
    showPromoBanner?: boolean;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2HostingOptionsSection: React.FC<V2HostingOptionsSectionProps> = ({ data, sectionId }) => {
  const title = data?.title ?? 'Hosting Options for Your Project';
  const options = data?.hostingOptions ?? hostingData;
  const showBanner = data?.showPromoBanner !== false;
  const { items: hostingItems, SortableWrapper, getItemProps } = useArrayItems('hostingOptions', options);

  return (
    <section className="w-full bg-colors-neutral-50">
      <div className="flex flex-col w-full max-w-[1920px] mx-auto items-center justify-center gap-10 md:gap-14 py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
        <EditableElement as="h2" sectionId={sectionId} path="title" className="relative w-fit font-['Satoshi',sans-serif] font-medium text-colors-neutral-800 text-3xl md:text-4xl lg:text-[48px] text-center tracking-[-0.02em] leading-[126%]">
          {title}
        </EditableElement>

        <div className="flex flex-col w-full max-w-[1600px] items-center justify-center gap-8">
          <SortableWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6 w-full">
            {hostingItems.map((hosting, index) => (
              <SortableItem key={hosting.id} {...getItemProps(index)}>
                <HostingCard {...hosting} sectionId={sectionId} itemIndex={index} />
              </SortableItem>
            ))}
            <BrowseAllCard />
          </div>
          </SortableWrapper>

          {showBanner && <PromoBanner />}
        </div>
      </div>
    </section>
  );
};

export default V2HostingOptionsSection;
