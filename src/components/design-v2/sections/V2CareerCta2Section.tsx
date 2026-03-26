import { useState } from "react";

export const V2CareerCta2Section = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleButtonClick = () => {
    console.log("Claim Discount button clicked");
  };

  return (
    <section
      className="flex flex-col w-full max-w-[1920px] mx-auto items-center gap-[var(--spacing-20x)] pt-[var(--spacing-30x)] pb-[var(--spacing-30x)] px-40 relative bg-colors-primary-700 overflow-hidden"
      data-model-id="4281:652044"
      aria-labelledby="cta-heading"
    >
      <div
        className="absolute top-[-92px] left-[-1119px] w-[4093px] h-[2271px]"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-[2174px] w-[1919px] h-[1919px] rounded-[959.5px] blur-[80px] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)] opacity-50" />

        <div className="absolute top-[352px] left-0 w-[1919px] h-[1919px] rounded-[959.5px] blur-[60px] bg-[linear-gradient(183deg,rgba(236,244,210,1)_0%,rgba(236,244,210,0)_100%)] opacity-50" />
      </div>

      <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col w-[680px] items-start gap-[var(--spacing-4x)] relative">
          <div className="flex flex-col items-start gap-[var(--spacing-2x)] relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto]">
              <img
                className="relative w-6 h-6"
                alt=""
                src="https://c.animaapp.com/2X7idWIf/img/icon.svg"
                aria-hidden="true"
              />

              <span className="relative w-fit mt-[-1.00px] [font-family:'Satoshi-Bold',Helvetica] font-bold text-colors-neutral-25 text-base tracking-[0.64px] leading-7 whitespace-nowrap">
                POWERED BY AI
              </span>
            </div>

            <h2
              id="cta-heading"
              className="relative self-stretch font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-25 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)] [font-style:var(--heading-h2-font-style)]"
            >
              Elevate Your Business
              <br />
              with HostOnce
            </h2>
          </div>

          <p className="relative self-stretch font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-25 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] [font-style:var(--body-regular-font-style)]">
            Stop building. Start launching. HostOnce combines smart AI
            generation with lightning-fast hosting for instant results and zero
            downtime.
          </p>
        </div>

        <button
          className="all-[unset] box-border inline-flex items-center justify-center gap-[var(--spacing-2x)] pt-[var(--spacing-5x)] pr-[var(--spacing-8x)] pb-[var(--spacing-5x)] pl-[var(--spacing-8x)] relative flex-[0_0_auto] bg-colors-neutral-800 rounded-2xl overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 focus:outline-2 focus:outline-offset-2 focus:outline-colors-neutral-25"
          onClick={handleButtonClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Claim discount and see pricing plans"
        >
          <span className="relative w-fit mt-[-1.00px] font-body-regular-b font-[number:var(--body-regular-b-font-weight)] text-colors-neutral-25 text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)] whitespace-nowrap [font-style:var(--body-regular-b-font-style)]">
            Claim Discount, See Plans
          </span>

          <img
            className="relative w-5 h-5"
            alt=""
            src="https://c.animaapp.com/2X7idWIf/img/icon-1.svg"
            aria-hidden="true"
          />
        </button>
      </div>

      <img
        className="absolute top-0 left-[calc(50.00%_-_391px)] w-[783px] h-[468px]"
        alt=""
        src="https://c.animaapp.com/2X7idWIf/img/vector.svg"
        aria-hidden="true"
      />
    </section>
  );
};
