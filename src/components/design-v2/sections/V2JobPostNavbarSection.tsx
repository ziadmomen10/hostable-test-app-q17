import React, { useEffect, useState } from 'react';
import { EditableInline } from '@/components/editor/EditableElement';

interface V2JobPostNavbarSectionProps {
  data?: {
    bannerText?: string;
  };
  sectionId?: string;
  isEditing?: boolean;
}

const leftNavItems = [
  { label: 'Domain', hasDropdown: true },
  { label: 'Hosting', hasDropdown: true },
  { label: 'Web Builder', hasDropdown: true },
];
const rightNavItems = [{ label: 'Support', hasDropdown: true }];

export const V2JobPostNavbarSection: React.FC<V2JobPostNavbarSectionProps> = ({ data, sectionId }) => {
  const [countdown, setCountdown] = useState({ hours: '04', minutes: '50', seconds: '30' });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let h = parseInt(prev.hours);
        let m = parseInt(prev.minutes);
        let s = parseInt(prev.seconds);
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return {
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(s).padStart(2, '0'),
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bannerText = data?.bannerText ?? 'Get 40% Off All Hosting Services For A Limited Time!';

  return (
    <section className="w-full relative" aria-label="Site navigation and promo banner">
      {/* Promo banner */}
      <div className="w-full h-10 flex items-center justify-center gap-[var(--spacing-2x)] bg-colors-neutral-800">
        <img
          className="relative w-3.5 h-3.5"
          alt=""
          src="https://c.animaapp.com/GP8l9Rh9/img/icon-8.svg"
          aria-hidden="true"
        />
        <EditableInline
          sectionId={sectionId}
          path="bannerText"
          className="relative w-fit mt-[-1.00px] text-colors-neutral-25 text-[length:var(--body-small-m-font-size)] leading-[var(--body-small-m-line-height)] whitespace-nowrap font-body-small-m font-[number:var(--body-small-m-font-weight)] tracking-[var(--body-small-m-letter-spacing)] [font-style:var(--body-small-m-font-style)]"
        >
          {bannerText}
        </EditableInline>
        <div className="inline-flex items-center gap-[var(--spacing-half-x)]" role="timer" aria-label="Countdown timer">
          {[countdown.hours, countdown.minutes, countdown.seconds].map((val, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <div className="w-fit text-colors-gray-48-duplicate text-xs leading-[18px] whitespace-nowrap font-['Satoshi',Helvetica] font-medium tracking-[0]" aria-hidden="true">:</div>
              )}
              <div className="flex w-6 h-5 items-center justify-center gap-2.5 px-1 py-px relative bg-colors-translucent-light-8 rounded border border-solid border-colors-translucent-light-8">
                <div className="w-fit mt-[-1.00px] text-colors-neutral-25 text-xs leading-[18px] whitespace-nowrap font-['Satoshi',Helvetica] font-medium tracking-[0]">{val}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Nav header */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px] bg-colors-translucent-dark-2">
        <header className="flex h-[82px] items-center justify-between p-5 bg-transparent rounded-3xl border border-solid border-colors-translucent-dark-4">
          <img
            className="relative w-[168px] h-8 aspect-[5.25]"
            alt="Hostonce Logo"
            src="https://c.animaapp.com/GP8l9Rh9/img/logo.svg"
          />

          <nav className="hidden lg:inline-flex items-center gap-8" aria-label="Main navigation">
            {[...leftNavItems, ...rightNavItems].map((item, index) => (
              <button
                key={index}
                className="inline-flex items-center justify-center gap-1 relative flex-[0_0_auto]"
                type="button"
              >
                <span className="font-body-regular-m font-[number:var(--body-regular-m-font-weight)] text-colors-neutral-800 leading-[var(--body-regular-m-line-height)] relative w-fit mt-[-1.00px] text-[length:var(--body-regular-m-font-size)] tracking-[var(--body-regular-m-letter-spacing)] whitespace-nowrap [font-style:var(--body-regular-m-font-style)]">
                  {item.label}
                </span>
                {item.hasDropdown && (
                  <img className="relative w-3 h-3" alt="" src="https://c.animaapp.com/GP8l9Rh9/img/icon-7.svg" aria-hidden="true" />
                )}
              </button>
            ))}
          </nav>

          <div className="items-start gap-2.5 inline-flex relative flex-[0_0_auto]">
            <button className="all-[unset] box-border inline-flex items-center justify-center gap-[var(--spacing-half-x)] pt-[var(--spacing-3x)] pr-[var(--spacing-4x)] pb-[var(--spacing-3x)] pl-[var(--spacing-4x)] relative flex-[0_0_auto] bg-colors-translucent-dark-4 rounded-xl cursor-pointer" type="button">
              <img className="relative w-4 h-4" alt="" src="https://c.animaapp.com/GP8l9Rh9/img/icon-3.svg" aria-hidden="true" />
              <span className="font-['Satoshi',Helvetica] font-bold text-colors-neutral-800 leading-[17.6px] relative w-fit mt-[-1.00px] text-base tracking-[0] whitespace-nowrap">HoncyAI</span>
            </button>
            <button className="all-[unset] box-border inline-flex items-center justify-center gap-[var(--spacing-2x)] pt-[var(--spacing-3x)] pr-[var(--spacing-4x)] pb-[var(--spacing-3x)] pl-[var(--spacing-4x)] bg-colors-neutral-800 rounded-xl relative flex-[0_0_auto] cursor-pointer" type="button">
              <span className="font-['Satoshi',Helvetica] font-bold text-colors-neutral-25 leading-[17.6px] relative w-fit mt-[-1.00px] text-base tracking-[0] whitespace-nowrap">Account Login</span>
            </button>
          </div>
        </header>
      </div>
    </section>
  );
};

export default V2JobPostNavbarSection;
