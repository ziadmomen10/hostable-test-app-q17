import React from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface HostingFeatureItem {
  id: string;
  icon: string;
  title: string;
  price: string;
  bestFor: string;
  ratingBars: number;
  isWordPress?: boolean;
}

interface V2HostingsFeaturesSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    hostings?: HostingFeatureItem[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

const HostingCard = ({
  hosting,
  index,
  sectionId,
}: {
  hosting: HostingFeatureItem;
  index: number;
  sectionId?: string;
}) => {
  return (
    <article className="flex flex-col items-start justify-end gap-[var(--spacing-6x)] pt-[var(--spacing-8x)] pr-[var(--spacing-8x)] pb-[var(--spacing-8x)] pl-[var(--spacing-8x)] relative flex-1 grow bg-colors-neutral-25 rounded-3xl overflow-hidden shadow-[0px_0px_80px_#00000014]">
      {hosting.isWordPress ? (
        <div className="flex w-14 h-14 items-center justify-center gap-2.5 p-1.5 rounded-2xl border border-solid border-colors-translucent-dark-16">
          <img className="w-8 h-8 aspect-[1]" alt={hosting.title} src={hosting.icon} />
        </div>
      ) : (
        <img className="w-14 h-14" alt={hosting.title} src={hosting.icon} />
      )}

      <div className="flex flex-col items-start gap-[var(--spacing-2x)] w-full">
        <EditableInline sectionId={sectionId} path={`hostings.${index}.title`} className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] whitespace-nowrap">
          {hosting.title}
        </EditableInline>
      </div>

      <div className="inline-flex items-end gap-[var(--spacing-2x)]">
        <div className="inline-flex items-end py-[var(--spacing-x)] px-0">
          <span className="font-normal text-colors-brand-tertiary text-sm leading-[19.6px] whitespace-nowrap">From</span>
        </div>
        <div className="inline-flex items-end gap-[var(--spacing-x-duplicate)]">
          <span className="font-medium text-colors-brand-tertiary text-[28px] leading-[37.5px] whitespace-nowrap">{hosting.price}</span>
          <div className="flex flex-col w-6 items-start justify-end pb-[var(--spacing-x)] pt-0 px-0">
            <span className="opacity-75 font-normal text-colors-brand-tertiary text-sm leading-[19.6px] whitespace-nowrap">/mo</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-[var(--spacing-4x-duplicate)] w-full">
        <div className="inline-flex items-center justify-center gap-[var(--spacing-2x)]">
          <span className="font-bold text-colors-primary-700 text-xs tracking-[0.96px] leading-[20.4px] whitespace-nowrap">*BEST FOR</span>
          <div className="inline-flex items-center justify-center gap-[var(--spacing-half-x)] pt-[var(--spacing-x)] pr-[var(--spacing-2x)] pb-[var(--spacing-x)] pl-[var(--spacing-2x)] bg-colors-neutral-50 rounded-lg border border-solid border-colors-neutral-100">
            <img className="w-2.5 h-2.5" alt="" src="https://c.animaapp.com/CB75pelm/img/icon-12.svg" />
            <span className="font-body-extra-small-m font-[number:var(--body-extra-small-m-font-weight)] text-[#2020207a] text-[length:var(--body-extra-small-m-font-size)] tracking-[var(--body-extra-small-m-letter-spacing)] leading-[var(--body-extra-small-m-line-height)] whitespace-nowrap">
              {hosting.bestFor}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-[var(--spacing-half-x)] w-full" role="meter" aria-label={`Rating: ${hosting.ratingBars} out of 5`}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`relative flex-1 grow h-2 rounded-[99px] ${i < hosting.ratingBars ? 'bg-colors-primary-400' : 'bg-colors-primary-100'}`} />
          ))}
        </div>
      </div>
    </article>
  );
};

const BrowseAllCard = () => (
  <div className="flex flex-col items-center justify-center gap-6 p-8 relative flex-1 self-stretch grow bg-colors-neutral-25 rounded-3xl overflow-hidden shadow-[0px_0px_80px_#00000014]">
    <div className="flex flex-col items-start gap-[var(--spacing-half-x)] w-full">
      <h3 className="w-full font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] text-center tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)]">
        More Hostings Available
      </h3>
      <p className="w-full font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-500 text-[length:var(--body-regular-font-size)] text-center tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]">
        Browse all the hostings from below.
      </p>
    </div>
    <button className="inline-flex items-center justify-center gap-2 py-5 px-8 bg-colors-primary-500 rounded-2xl overflow-hidden">
      <span className="font-body-regular-b font-[number:var(--body-regular-b-font-weight)] text-[color:var(--colors-secondary-900)] text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)] whitespace-nowrap">Browse All</span>
      <img className="w-5 h-5" alt="" src="https://c.animaapp.com/CB75pelm/img/icon-13.svg" />
    </button>
  </div>
);

export const V2HostingsFeaturesSection: React.FC<V2HostingsFeaturesSectionProps> = ({ data, sectionId }) => {
  const title = data?.title ?? 'Hosting Options for Your Project';

  const { items: hostings, getItemProps, SortableWrapper } = useArrayItems<HostingFeatureItem>(
    'hostings',
    data?.hostings ?? []
  );

  const row1 = hostings.slice(0, 4);
  const row2 = hostings.slice(4, 7);

  return (
    <section className="w-full relative bg-[linear-gradient(0deg,rgba(245,245,245,1)_0%,rgba(245,245,245,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)] bg-colors-neutral-25">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col items-center justify-center gap-[var(--spacing-14x)] py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[160px]">
        <EditableElement as="h2" sectionId={sectionId} path="title" className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)]">
          {title}
        </EditableElement>

        <SortableWrapper>
          <div className="flex flex-col items-center justify-center gap-[var(--spacing-8x)] w-full max-w-[1600px]">
            <div className="flex flex-col items-start gap-[var(--spacing-8x)] w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[var(--spacing-8x)] w-full">
                {row1.map((hosting, index) => (
                  <div key={hosting.id} {...getItemProps(index)}>
                    <HostingCard hosting={hosting} index={index} sectionId={sectionId} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[var(--spacing-8x)] w-full">
                {row2.map((hosting, index) => (
                  <div key={hosting.id} {...getItemProps(index + 4)}>
                    <HostingCard hosting={hosting} index={index + 4} sectionId={sectionId} />
                  </div>
                ))}
                <BrowseAllCard />
              </div>
            </div>

            {/* Promo banner */}
            <aside className="relative w-full max-w-[1600px] h-[188px] bg-colors-neutral-800 rounded-3xl overflow-hidden border border-solid border-colors-translucent-dark-8">
              <div className="top-5 left-[834px] bg-[linear-gradient(165deg,rgba(98,140,22,1)_0%,rgba(98,140,22,1)_100%)] opacity-50 absolute w-[927px] h-[927px] rounded-[463.5px] blur-[60px] bg-colors-primary-800" />
              <div className="top-32 left-[-532px] bg-colors-primary-800 opacity-75 absolute w-[927px] h-[927px] rounded-[463.5px] blur-[60px]" />

              <div className="inline-flex items-center gap-[var(--spacing-half-x)] absolute top-[51px] left-[52px]">
                <img className="w-4 h-4" alt="" src="https://c.animaapp.com/CB75pelm/img/icon-14.svg" />
                <span className="font-body-regular-b font-[number:var(--body-regular-b-font-weight)] text-colors-primary-400 text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)] whitespace-nowrap">Hosting Fair</span>
              </div>

              <div className="inline-flex flex-col items-start gap-10 absolute top-[92px] left-[52px]">
                <p className="font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-colors-neutral-25 text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] whitespace-nowrap">
                  Up To <span>40% Discount</span>
                </p>
              </div>

              <div className="inline-flex items-center gap-[9px] absolute top-[92px] left-[392px]" role="timer" aria-label="Countdown timer">
                {['2H', '23M', '44S'].map((val, i) => (
                  <div key={i} className="flex w-12 items-center justify-center pt-[var(--spacing-2x)] pr-[var(--spacing-3x)] pb-[var(--spacing-2x)] pl-[var(--spacing-3x)] bg-colors-translucent-light-4 rounded-lg border border-solid border-colors-translucent-light-8">
                    <span className="font-body-small-b font-[number:var(--body-small-b-font-weight)] text-colors-neutral-25 text-[length:var(--body-small-b-font-size)] tracking-[var(--body-small-b-letter-spacing)] leading-[var(--body-small-b-line-height)] whitespace-nowrap">{val}</span>
                  </div>
                ))}
              </div>

              <div className="absolute top-5 left-[1016px] w-[563px] h-[598px] hidden xl:block">
                <img className="absolute top-0 left-1/2 -translate-x-1/2 w-[563px] h-[168px]" alt="" src="https://c.animaapp.com/CB75pelm/img/outer.png" />
                <img className="absolute -top-5 left-[-79px] w-[663px] h-[188px]" alt="" src="https://c.animaapp.com/CB75pelm/img/inner.png" />
              </div>

              {/* VPS Server Card */}
              <div className="absolute top-[calc(50.00%_-_57px)] left-[calc(50.00%_+_69px)] w-[241px] h-[114px] bg-[color:var(--colors-secondary-900)] rounded-2xl overflow-hidden shadow-[0px_0px_80px_#00000066] backdrop-blur-[20px] hidden xl:block before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-2xl before:[background:linear-gradient(180deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.02)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
                <div className="flex flex-col w-[116px] items-start gap-1 absolute top-5 left-5">
                  <img className="w-6 h-6" alt="" src="https://c.animaapp.com/CB75pelm/img/logo.svg" />
                  <div className="flex flex-col items-start w-full">
                    <span className="font-bold text-colors-neutral-25 text-sm leading-[24.4px] whitespace-nowrap">Mark&apos;s VPS Server</span>
                    <span className="font-body-extra-small font-[number:var(--body-extra-small-font-weight)] text-colors-translucent-light-64 text-[length:var(--body-extra-small-font-size)] tracking-[var(--body-extra-small-letter-spacing)] leading-[var(--body-extra-small-line-height)]">255.189.85.19</span>
                  </div>
                </div>
                <div className="inline-flex items-center justify-center gap-1 px-2 py-0.5 absolute top-12 left-[158px] bg-colors-translucent-light-24 rounded-[99px] shadow-[0px_0px_16px_#00000014]">
                  <div className="w-[3px] h-[3px] bg-colors-neutral-25 rounded-full aspect-[1]" />
                  <span className="font-bold text-colors-neutral-25 text-[10px] leading-[17.0px] whitespace-nowrap">ACTIVE</span>
                </div>
                <div className="absolute top-[-41px] left-[-72px] w-[927px] h-[927px] rounded-[463.5px] blur-md bg-[linear-gradient(195deg,rgba(172,204,84,1)_0%,rgba(172,204,84,0)_100%)] opacity-[0.24]" />
                <div className="absolute top-14 left-[-582px] w-[927px] h-[927px] rounded-[463.5px] blur bg-[linear-gradient(116deg,rgba(172,204,84,1)_0%,rgba(172,204,84,0)_100%)] opacity-[0.24] bg-colors-primary-400" />
              </div>
            </aside>
          </div>
        </SortableWrapper>
      </div>
    </section>
  );
};

export default V2HostingsFeaturesSection;
