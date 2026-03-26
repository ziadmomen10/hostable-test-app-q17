import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { Badge } from '@/components/ui/badge';

interface V2AffiliateCallToActionSectionProps {
  data?: {
    badgeIcon?: string;
    badgeText?: string;
    titleLine1?: string;
    titleLine2?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2AffiliateCallToActionSection: React.FC<V2AffiliateCallToActionSectionProps> = ({ data, sectionId }) => {
  const badgeIcon = data?.badgeIcon ?? '/lovable-uploads/CallToAction/Icon-Ai.png';
  const badgeText = data?.badgeText ?? 'POWERED BY AI';
  const titleLine1 = data?.titleLine1 ?? 'Elevate Your Business';
  const titleLine2 = data?.titleLine2 ?? 'with HostOnce';
  const subtitle = data?.subtitle ?? 'Stop building. Start launching. HostOnce combines smart AI generation with lightning-fast hosting for instant results and zero downtime.';
  const buttonText = data?.buttonText ?? 'Claim Discount, See Plans';
  const buttonLink = data?.buttonLink ?? '#';

  return (
    <section
      className="w-full relative bg-[#77a020]"
      aria-labelledby="v2-affiliate-call-to-action-heading"
      style={{
        backgroundImage: 'url(/lovable-uploads/CallToAction/section-calltoaction.png)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="relative z-10 w-full max-w-[1920px] mx-auto py-10 md:py-16 lg:py-[120px] px-4 sm:px-6 md:px-12 lg:px-[160px]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12">
          {/* Left Column: Badge + Content */}
          <div className="flex flex-col gap-4 md:max-w-[680px]">
            {/* Sub-heading + Heading group */}
            <div className="flex flex-col gap-2">
              {/* Badge - Top Left */}
              <Badge className="inline-flex items-center gap-[10px] self-start border-0 bg-transparent hover:bg-transparent px-0">
                {badgeIcon && (
                  <img className="w-6 h-6" alt="" src={badgeIcon} aria-hidden="true" />
                )}
                <EditableInline
                  sectionId={sectionId}
                  path="badgeText"
                  className="font-[Satoshi] text-[16px] font-bold leading-[175%] tracking-[0.64px] text-[#f9fcf5] whitespace-nowrap"
                >
                  {badgeText}
                </EditableInline>
              </Badge>

              {/* Heading */}
              <h2
                id="v2-affiliate-call-to-action-heading"
                className="font-[Satoshi] text-[48px] font-medium leading-[126%] text-white"
              >
                <EditableInline sectionId={sectionId} path="titleLine1">{titleLine1}</EditableInline>
                <br />
                <EditableInline sectionId={sectionId} path="titleLine2">{titleLine2}</EditableInline>
              </h2>
            </div>

            {/* Subtitle */}
            <EditableElement
              as="p"
              sectionId={sectionId}
              path="subtitle"
              className="font-[Satoshi] text-[16px] font-normal leading-[175%] text-white w-full"
            >
              {subtitle}
            </EditableElement>

            {/* Mobile Call to Action Section - Only on mobile */}
            <div className="flex flex-col gap-4 md:hidden mt-4">
              <p className="text-white text-sm font-normal">
                Select what you need to launch your brand
              </p>

              <div className="grid grid-cols-2 gap-3">
                {/* Domain Button */}
                <a
                  href="#"
                  className="flex items-center justify-between gap-2 py-3 px-4 bg-[#262626] rounded-xl cursor-pointer transition-transform duration-200 hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      alt=""
                      src="/lovable-uploads/CallToAction/Icon-domain.png"
                      aria-hidden="true"
                    />
                    <span className="text-white text-sm font-medium whitespace-nowrap">Domain</span>
                  </div>
                  <img
                    className="w-4 h-4"
                    alt=""
                    src="/lovable-uploads/CallToAction/Icon-RightArrow.png"
                    aria-hidden="true"
                  />
                </a>

                {/* Business Email Button */}
                <a
                  href="#"
                  className="flex items-center justify-between gap-2 py-3 px-4 bg-[#262626] rounded-xl cursor-pointer transition-transform duration-200 hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      alt=""
                      src="/lovable-uploads/CallToAction/Icon-BusinessEmail.png"
                      aria-hidden="true"
                    />
                    <span className="text-white text-sm font-medium whitespace-nowrap">Business Email</span>
                  </div>
                  <img
                    className="w-4 h-4"
                    alt=""
                    src="/lovable-uploads/CallToAction/Icon-RightArrow.png"
                    aria-hidden="true"
                  />
                </a>

                {/* Hosting Button */}
                <a
                  href="#"
                  className="flex items-center justify-between gap-2 py-3 px-4 bg-[#262626] rounded-xl cursor-pointer transition-transform duration-200 hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      alt=""
                      src="/lovable-uploads/CallToAction/Icon-Hosting.png"
                      aria-hidden="true"
                    />
                    <span className="text-white text-sm font-medium whitespace-nowrap">Hosting</span>
                  </div>
                  <img
                    className="w-4 h-4"
                    alt=""
                    src="/lovable-uploads/CallToAction/Icon-RightArrow.png"
                    aria-hidden="true"
                  />
                </a>

                {/* Website Builder Button */}
                <a
                  href="#"
                  className="flex items-center justify-between gap-2 py-3 px-4 bg-[#262626] rounded-xl cursor-pointer transition-transform duration-200 hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      alt=""
                      src="/lovable-uploads/CallToAction/Icon-WebsiteBuilder.png"
                      aria-hidden="true"
                    />
                    <span className="text-white text-sm font-medium whitespace-nowrap">Website Builder</span>
                  </div>
                  <img
                    className="w-4 h-4"
                    alt=""
                    src="/lovable-uploads/CallToAction/Icon-RightArrow.png"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Desktop Button - Hidden on mobile */}
          <div className="hidden md:flex md:items-center shrink-0">
            <a
              href={buttonLink}
              className="inline-flex items-center justify-center gap-2 py-5 px-8 bg-[#262626] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              <EditableInline
                sectionId={sectionId}
                path="buttonText"
                className="font-[Satoshi] text-[16px] font-bold leading-[175%] text-white whitespace-nowrap"
              >
                {buttonText}
              </EditableInline>
              <div className="bg-[#caf355] rounded-[10px] w-5 h-5 p-[5px] flex items-center justify-center shrink-0">
                <img
                  className="w-full h-full"
                  alt=""
                  src="/lovable-uploads/CallToAction/Icon-RightArrow.png"
                  aria-hidden="true"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V2AffiliateCallToActionSection;
