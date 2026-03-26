import React from "react";
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface ServiceCard {
  id: string;
  title: string;
  price: string;
  logo: string;
  mainImage: string;
  frameIcon: string;
  bgGradient: string;
}

interface V2BusinessSuiteSectionProps {
  data?: {
    badge?: string;
    title?: string;
    cards?: ServiceCard[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

const defaultCards: ServiceCard[] = [
    {
      id: "hosting",
      title: "Hosting",
      price: "$2.80",
      logo: "https://c.animaapp.com/dZ1UxMzX/img/logo.svg",
      mainImage: "https://c.animaapp.com/dZ1UxMzX/img/main@2x.png",
      frameIcon: "https://c.animaapp.com/dZ1UxMzX/img/frame.svg",
      bgGradient:
        "bg-[linear-gradient(0deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%),linear-gradient(0deg,rgba(157,195,50,1)_0%,rgba(157,195,50,1)_100%)]",
    },
    {
      id: "domains",
      title: "Domains",
      price: "$2.80",
      logo: "https://c.animaapp.com/dZ1UxMzX/img/logo-1.svg",
      mainImage: "https://c.animaapp.com/dZ1UxMzX/img/main-1.svg",
      frameIcon: "https://c.animaapp.com/dZ1UxMzX/img/frame-1.svg",
      bgGradient:
        "bg-[linear-gradient(0deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%),linear-gradient(0deg,rgba(0,182,122,1)_0%,rgba(0,182,122,1)_100%)]",
    },
    {
      id: "business-email",
      title: "Business Email",
      price: "$2.80",
      logo: "https://c.animaapp.com/dZ1UxMzX/img/logo-3.svg",
      mainImage: "",
      frameIcon: "https://c.animaapp.com/dZ1UxMzX/img/frame-2.svg",
      bgGradient:
        "bg-[linear-gradient(0deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%),linear-gradient(0deg,rgba(246,166,79,1)_0%,rgba(246,166,79,1)_100%)]",
    },
    {
      id: "website-builder",
      title: "Website Builder",
      price: "$2.80",
      logo: "https://c.animaapp.com/dZ1UxMzX/img/logo-4.svg",
      mainImage: "https://c.animaapp.com/dZ1UxMzX/img/main-2@2x.png",
      frameIcon: "https://c.animaapp.com/dZ1UxMzX/img/frame-3.svg",
      bgGradient:
        "bg-[linear-gradient(0deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%),linear-gradient(0deg,rgba(55,184,213,1)_0%,rgba(55,184,213,1)_100%)]",
    },
    {
      id: "wordpress",
      title: "WordPress",
      price: "$2.80",
      logo: "https://c.animaapp.com/dZ1UxMzX/img/main-3@2x.png",
      mainImage: "https://c.animaapp.com/dZ1UxMzX/img/main-4.svg",
      frameIcon: "https://c.animaapp.com/dZ1UxMzX/img/frame-4.svg",
      bgGradient:
        "bg-[linear-gradient(0deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%),linear-gradient(0deg,rgba(84,59,242,1)_0%,rgba(84,59,242,1)_100%)]",
    },
  ];

const aiActions = [
  { icon: "https://c.animaapp.com/dZ1UxMzX/img/icon-3.svg", label: "Summarize" },
  { icon: "https://c.animaapp.com/dZ1UxMzX/img/icon-4.svg", label: "Proofread" },
  { icon: "https://c.animaapp.com/dZ1UxMzX/img/icon-5.svg", label: "Write a Reply" },
  { icon: "/img/icon.png", label: "Rephrase" },
];

export const V2BusinessSuiteSection = ({ data, sectionId }: V2BusinessSuiteSectionProps): JSX.Element => {
  const serviceCards = data?.cards ?? defaultCards;
  // useArrayItems MUST be the first hook — required by ingestion checklist
  const { items: cards, SortableWrapper, getItemProps } = useArrayItems('cards', serviceCards);

  return (
    <section className="w-full bg-white py-[80px]">
      {/* Desktop Layout - Responsive container matching other V2 sections */}
      <div className="hidden xl:block w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
        <div
          className="flex flex-col w-full items-center justify-center gap-2.5 relative"
          data-model-id="4145:862"
        >
          {/* Wrapper for header + bordered container */}
          <div className="relative w-full">
            {/* Header - positioned outside overflow-hidden container */}
            <header className="absolute -top-4 left-7 z-10 w-[444px] h-[31px] flex justify-center bg-white">
              <div className="inline-flex w-[420.01px] h-[31px] ml-0 relative items-center gap-3">
                <div className="inline-flex h-[31px] items-center justify-center gap-1 px-1.5 py-0.5 relative flex-[0_0_auto] bg-colors-translucent-dark-2 rounded-lg border border-solid border-colors-translucent-dark-8">
                  <img
                    className="relative w-[20.01px] h-5 aspect-[1]"
                    alt="Business Suite logo"
                    src="https://c.animaapp.com/dZ1UxMzX/img/group-555@2x.png"
                  />
                  <p className="relative w-fit mt-[-1.00px] [font-family:'Satoshi-Bold',Helvetica] font-normal text-colors-neutral-800 text-xl tracking-[0] leading-[26.8px] whitespace-nowrap">
                    <span className="font-bold">Business</span>
                    <span className="[font-family:'Satoshi-Regular',Helvetica]">
                      Suite
                    </span>
                  </p>
                </div>
                <EditableInline
                  sectionId={sectionId}
                  path="title"
                  className="relative w-fit font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-800 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] whitespace-nowrap [font-style:var(--body-regular-font-style)]"
                >
                  {data?.title ?? 'Everything you need to grow online'}
                </EditableInline>
              </div>
            </header>
            
            {/* Bordered container with overflow-hidden for cards */}
            <div className="relative w-full min-h-[243px] lg:min-h-[248px] xl:min-h-[286px] 2xl:min-h-[330px] min-[1700px]:min-h-[400px] rounded-3xl border border-solid border-colors-translucent-dark-8 p-4 lg:p-6 xl:p-8 2xl:p-10 overflow-hidden">
              <SortableWrapper>
              <div className="flex flex-nowrap justify-center items-center gap-3 lg:gap-3 xl:gap-4 2xl:gap-5 min-[1700px]:gap-8">
              {cards.map((card, index) => (
                <SortableItem key={card.id} {...getItemProps(index)} className="flex-shrink-0">
                <div 
                  className="w-[150px] lg:w-[155px] xl:w-[190px] 2xl:w-[230px] min-[1700px]:w-[294px] h-[163px] lg:h-[168px] xl:h-[206px] 2xl:h-[250px] min-[1700px]:h-80"
                >
                  <article
                    dir="ltr"
                    className={`relative w-[294px] h-80 rounded-3xl overflow-hidden origin-top-left scale-[0.51] lg:scale-[0.527] xl:scale-[0.646] 2xl:scale-[0.782] min-[1700px]:scale-100 ${card.bgGradient}`}
                  >
                  <div className="absolute top-0 left-[-72px] w-[927px] h-[927px] rounded-[463.5px] blur-md bg-[linear-gradient(210deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)] opacity-[0.32]" />
                  <div className="absolute top-14 left-[-553px] w-[927px] h-[927px] rounded-[463.5px] blur bg-[linear-gradient(122deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)] opacity-[0.32]" />

                  {card.id === "hosting" && (
                    <>
                      <div className="inline-flex items-end gap-1 absolute top-16 left-[68px]">
                        <div className="inline-flex items-end pt-0 pb-px px-0 relative self-stretch flex-[0_0_auto]">
                          <div className="relative w-fit [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-light-80 text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
                            From
                          </div>
                        </div>
                        <div className="inline-flex items-end gap-1 relative flex-[0_0_auto]">
                          <EditableInline sectionId={sectionId} path={`cards.${index}.price`} className="relative w-fit mt-[-1.00px] [font-family:'Satoshi-Medium',Helvetica] font-medium text-colors-neutral-25 text-xl tracking-[0] leading-[26.8px] whitespace-nowrap">
                            {card.price}
                          </EditableInline>
                          <div className="flex flex-col w-6 items-end justify-end gap-2.5 pt-0 pb-px px-0 relative self-stretch">
                            <div className="relative w-fit opacity-75 [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-light-80 text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
                              /mo
                            </div>
                          </div>
                        </div>
                      </div>
                      <EditableElement as="h2" sectionId={sectionId} path={`cards.${index}.title`} className="absolute top-6 left-[68px] [font-family:'Satoshi-Bold',Helvetica] font-bold text-white text-2xl tracking-[0] leading-[32.2px] whitespace-nowrap">
                        {card.title}
                      </EditableElement>
                      <img
                        className="absolute top-6 left-6 w-8 h-8"
                        alt={`${card.title} logo`}
                        src={card.logo}
                      />
                      <img
                        className="absolute top-[82px] left-0 w-[294px] h-[238px] aspect-[1.12]"
                        alt={`${card.title} main visual`}
                        src={card.mainImage}
                      />
                      <img
                        className="absolute top-[59px] left-[233px] w-[35px] h-[35px]"
                        alt="Frame decoration"
                        src={card.frameIcon}
                      />
                      <div className="flex w-[106px] h-[79px] items-start justify-center gap-4 pt-3 pr-4 pb-3 pl-4 absolute top-[calc(50.00%_+_67px)] left-3.5 rounded-2xl overflow-hidden border-[none] shadow-[0px_0px_80px_#00000066] backdrop-blur-[20px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(20px)_brightness(100%)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.56)_100%)] bg-colors-translucent-light-56 border-colors-translucent-light-24 before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-2xl before:[background:linear-gradient(180deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.02)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
                        <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                          <div className="relative w-fit mt-[-1.00px] font-body-extra-small-m font-[number:var(--body-extra-small-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-extra-small-m-font-size)] tracking-[var(--body-extra-small-m-letter-spacing)] leading-[var(--body-extra-small-m-line-height)] whitespace-nowrap [font-style:var(--body-extra-small-m-font-style)]">
                            Uptime
                          </div>
                          <div className="relative w-fit [font-family:'Satoshi-Bold',Helvetica] font-bold text-colors-primary-900 text-lg tracking-[0] leading-[31.3px] whitespace-nowrap">
                            100%
                          </div>
                        </div>
                        <div className="flex w-12 h-1 items-start gap-1 relative mr-[-16.00px] rounded-[99px] rotate-[-90.00deg]">
                          <div className="relative flex-1 grow h-1 bg-colors-primary-900 rounded-[99px]" />
                          <div className="h-1 bg-colors-primary-700 rounded-[99px] relative flex-1 grow" />
                          <div className="h-1 bg-colors-primary-400 rounded-[99px] relative flex-1 grow" />
                        </div>
                      </div>
                    </>
                  )}

                  {card.id === "domains" && (
                    <>
                      <EditableElement as="h2" sectionId={sectionId} path={`cards.${index}.title`} className="absolute top-6 left-[68px] [font-family:'Satoshi-Bold',Helvetica] font-bold text-white text-2xl tracking-[0] leading-[32.2px] whitespace-nowrap">
                        {card.title}
                      </EditableElement>
                      <img
                        className="absolute top-6 left-6 w-8 h-8"
                        alt={`${card.title} logo`}
                        src={card.logo}
                      />
                      <img
                        className="absolute top-[74px] left-[243px] w-[19px] h-5"
                        alt="Frame decoration"
                        src={card.frameIcon}
                      />
                      <img
                        className="absolute top-[97px] left-0 w-[294px] h-[223px]"
                        alt={`${card.title} main visual`}
                        src={card.mainImage}
                      />
                      <div className="inline-flex flex-col items-start gap-3 pt-3 pr-4 pb-3 pl-4 absolute top-[258px] left-3.5 rounded-lg border-[none] shadow-[0px_0px_80px_#00000066] backdrop-blur-[20px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(20px)_brightness(100%)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.56)_100%)] bg-colors-translucent-light-56 border-colors-others-wordpress-0 before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-lg before:[background:linear-gradient(315deg,rgba(33,117,155,0)_0%,rgba(33,117,155,0.2)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
                        <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                          <img
                            className="relative w-5 h-5"
                            alt="Domain logo"
                            src="https://c.animaapp.com/dZ1UxMzX/img/logo-2.svg"
                          />
                          <div className="inline-flex items-center relative flex-[0_0_auto]">
                            <div className="relative w-fit mt-[-1.00px] font-body-extra-small-m font-[number:var(--body-extra-small-m-font-weight)] text-[color:var(--colors-secondary-900)] text-[length:var(--body-extra-small-m-font-size)] tracking-[var(--body-extra-small-m-letter-spacing)] leading-[var(--body-extra-small-m-line-height)] whitespace-nowrap [font-style:var(--body-extra-small-m-font-style)]">
                              www.fashiona.com
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="inline-flex items-end gap-1 absolute top-16 left-[68px]">
                        <div className="inline-flex items-end pt-0 pb-px px-0 relative self-stretch flex-[0_0_auto]">
                          <div className="relative w-fit [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-light-80 text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
                            From
                          </div>
                        </div>
                        <div className="inline-flex items-end gap-1 relative flex-[0_0_auto]">
                          <EditableInline sectionId={sectionId} path={`cards.${index}.price`} className="relative w-fit mt-[-1.00px] [font-family:'Satoshi-Medium',Helvetica] font-medium text-colors-neutral-25 text-xl tracking-[0] leading-[26.8px] whitespace-nowrap">
                            {card.price}
                          </EditableInline>
                          <div className="flex flex-col w-6 items-end justify-end gap-2.5 pt-0 pb-px px-0 relative self-stretch">
                            <div className="relative w-fit opacity-75 [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-light-80 text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
                              /mo
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {card.id === "business-email" && (
                    <>
                      <EditableElement as="h2" sectionId={sectionId} path={`cards.${index}.title`} className="absolute top-6 left-[68px] [font-family:'Satoshi-Bold',Helvetica] font-bold text-white text-2xl tracking-[0] leading-[32.2px] whitespace-nowrap">
                        {card.title}
                      </EditableElement>
                      <img
                        className="absolute top-6 left-6 w-8 h-8"
                        alt={`${card.title} logo`}
                        src={card.logo}
                      />
                      <img
                        className="absolute top-[74px] left-[243px] w-[19px] h-5"
                        alt="Frame decoration"
                        src={card.frameIcon}
                      />
                      <div className="absolute top-[136px] left-8 w-[369px] h-[361px] bg-colors-neutral-25 rounded-[15.51px] overflow-hidden shadow-[0px_0px_25.94px_#0000003d]">
                        <p className="absolute top-[26px] left-2.5 [font-family:'Satoshi-Medium',Helvetica] font-medium text-[color:var(--colors-secondary-900)] text-[11.6px] tracking-[0] leading-[20.4px] whitespace-nowrap">
                          Q4 Reports: Performance Summary and 2026 Kickoff
                        </p>
                        <div className="flex w-[26px] h-4 items-center justify-between px-[3.88px] py-[1.29px] absolute top-2 left-[73px] rounded-[5.17px] bg-[linear-gradient(135deg,rgba(172,204,84,1)_24%,rgba(255,161,78,1)_100%)] bg-colors-primary-400 border-colors-translucent-dark-16">
                          <img
                            className="relative w-[7.75px] h-[7.75px] aspect-[1]"
                            alt="AI indicator"
                            src="https://c.animaapp.com/dZ1UxMzX/img/vector.svg"
                          />
                          <div className="relative w-fit mt-[-0.68px] [font-family:'Satoshi-Regular',Helvetica] font-normal text-[color:var(--colors-secondary-900)] text-[7.8px] tracking-[0] leading-[13.2px] whitespace-nowrap">
                            AI
                          </div>
                        </div>
                        <div className="absolute top-2.5 left-[65px] w-px h-2.5 bg-colors-translucent-dark-8" />
                        <img
                          className="absolute top-2.5 left-2.5 w-[47px] h-2.5"
                          alt="Email icons"
                          src="https://c.animaapp.com/dZ1UxMzX/img/icons.svg"
                        />
                        <div className="absolute top-[52px] left-2.5 w-[365px] h-[388px]">
                          <div className="absolute top-px left-0 w-[348px] h-[278px] bg-colors-translucent-dark-2 rounded-[10.34px] border-[0.65px] border-solid border-colors-translucent-dark-4" />
                          <p className="absolute top-[132px] left-[42px] w-[321px] [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-neutral-800 text-[9px] tracking-[0] leading-[15.7px]">
                            Hi Team,
                            <br />
                            <br />I hope this email finds you well.
                            <br />
                            <br />
                            The Q4 performance reports and final year-end summaries
                            have been compiled and are now available in the shared
                            &quot;Q4 2025 Financials&quot; folder.
                            <br />
                            <br />
                            Overall, Q4 saw strong performance, particularly in the
                            [mention specific area, e.g., European market segment]
                            and significant growth in [mention specific metric,
                            e.g., user engagement]. We successfully executed the
                            launch of [mention product/initiative] which exceeded
                            its initial adoption goals by 15%.
                            <br />
                            <br />
                            However, we need to focus on addressing the challenges
                            observed in [mention area for improvement, e.g.,
                            reducing operational overhead] and increasing our market
                            share in [mention market, e.g., the APAC region].
                            Detailed analyses for each department are included in
                            the linked documents.
                          </p>
                          <div className="flex flex-col w-[313px] items-start p-[10.34px] absolute top-[52px] left-[42px] rounded-[10.34px] border-[0.65px] border-solid border-[#accc543d] bg-[linear-gradient(180deg,rgba(172,204,84,0.16)_0%,rgba(172,204,84,0.03)_100%)]">
                            <div className="flex items-center justify-center gap-[2.58px] relative self-stretch w-full flex-[0_0_auto]">
                              <img
                                className="relative w-[40.25px] h-[40.25px] mt-[-12.13px] mb-[-12.12px] ml-[-15.51px]"
                                alt="Summary icon"
                                src="https://c.animaapp.com/dZ1UxMzX/img/icon.svg"
                              />
                              <div className="relative flex-1 mt-[-0.65px] [font-family:'Satoshi-Medium',Helvetica] font-medium text-colors-neutral-800 text-[9px] tracking-[0] leading-[15.7px]">
                                Summary
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-[6.46px] pl-[15.51px] pr-0 py-0 relative self-stretch w-full flex-[0_0_auto]">
                              <p className="relative flex-1 mt-[-0.65px] [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-neutral-700 text-[9px] tracking-[0] leading-[15.7px]">
                                Focra is more than just a template – it&apos;s a
                                dedicated online home for photography studios,
                                creative rental spaces,
                              </p>
                            </div>
                          </div>
                          <div className="inline-flex items-center gap-[7.75px] absolute top-[13px] left-[13px]">
                            <img
                              className="relative w-[23.26px] h-[23.26px] object-cover"
                              alt="Sender avatar"
                              src="https://c.animaapp.com/dZ1UxMzX/img/image@2x.png"
                            />
                            <div className="flex flex-col w-[202.27px] items-start relative">
                              <div className="flex items-center gap-[2.58px] relative self-stretch w-full flex-[0_0_auto]">
                                <div className="relative w-fit mt-[-0.65px] [font-family:'Satoshi-Medium',Helvetica] font-medium text-[color:var(--colors-secondary-900)] text-[9px] tracking-[0] leading-[15.7px] whitespace-nowrap">
                                  Jake Gyllenhaal
                                </div>
                                <div className="relative w-fit mt-[-0.65px] mr-[-0.31px] [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-neutral-400 text-[9px] tracking-[0] leading-[15.7px] whitespace-nowrap">
                                  &lt;jake.gyllenhaal@mangoco.com&gt;
                                </div>
                              </div>
                              <div className="inline-flex items-center gap-[2.58px] relative flex-[0_0_auto] mt-[-2.58px]">
                                <div className="relative w-fit mt-[-0.65px] [font-family:'Satoshi-Medium',Helvetica] font-medium text-colors-neutral-400 text-[7.8px] tracking-[0] leading-[13.2px] whitespace-nowrap">
                                  to me
                                </div>
                                <img
                                  className="relative self-stretch flex-[0_0_auto]"
                                  alt="Dropdown icon"
                                  src="https://c.animaapp.com/dZ1UxMzX/img/icon-1.svg"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="inline-flex flex-col items-start gap-[8.03px] p-[16.07px] absolute top-[202px] left-[15px] rounded-[16.07px] border-[none] shadow-[0px_0px_53.56px_#00000052] backdrop-blur-[13.39px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(13.39px)_brightness(100%)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.56)_100%)] before:content-[''] before:absolute before:inset-0 before:p-[1.34px] before:rounded-[16.07px] before:[background:linear-gradient(180deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.02)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
                        <div className="flex flex-col items-start justify-center gap-[2.68px] relative self-stretch w-full flex-[0_0_auto]">
                          <img
                            className="relative w-[45.52px] h-[45.52px] mt-[-13.39px] ml-[-16.07px]"
                            alt="AI assistant icon"
                            src="https://c.animaapp.com/dZ1UxMzX/img/icon-2.svg"
                          />
                          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                            <div className="relative self-stretch mt-[-0.67px] [font-family:'Satoshi-Medium',Helvetica] font-medium text-colors-neutral-800 text-[10.7px] tracking-[0] leading-[18.7px]">
                              Hi Jake!
                            </div>
                            <p className="relative w-fit [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-dark-56 text-[8px] tracking-[0] leading-[13.7px] whitespace-nowrap">
                              How can I help you?
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap w-[127.87px] items-start gap-2 relative flex-[0_0_auto]">
                          {aiActions.map((action, idx) => (
                            <button
                              key={idx}
                              className="inline-flex items-center justify-center gap-[2.68px] px-[5.36px] py-[2.68px] relative flex-[0_0_auto] bg-colors-translucent-dark-4 rounded-[5.36px] border-[0.67px] border-solid border-colors-translucent-dark-8"
                              aria-label={action.label}
                            >
                              <img
                                className={`relative ${idx === 2 ? "w-[6.69px] h-[4.79px]" : idx === 3 ? "w-[6.69px] h-[6.69px] mt-[-1474.58px] ml-[-366.07px]" : "w-[6.69px] h-[6.69px]"}`}
                                alt={`${action.label} icon`}
                                src={action.icon}
                              />
                              <div className="relative w-fit mt-[-0.67px] [font-family:'Satoshi-Medium',Helvetica] font-medium text-colors-primary-900 text-[8px] tracking-[0] leading-[13.7px] whitespace-nowrap">
                                {action.label}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="inline-flex items-end gap-1 absolute top-16 left-[68px]">
                        <div className="inline-flex items-end pt-0 pb-px px-0 relative self-stretch flex-[0_0_auto]">
                          <div className="relative w-fit [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-light-80 text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
                            From
                          </div>
                        </div>
                        <div className="inline-flex items-end gap-1 relative flex-[0_0_auto]">
                          <EditableInline sectionId={sectionId} path={`cards.${index}.price`} className="relative w-fit mt-[-1.00px] [font-family:'Satoshi-Medium',Helvetica] font-medium text-colors-neutral-25 text-xl tracking-[0] leading-[26.8px] whitespace-nowrap">
                            {card.price}
                          </EditableInline>
                          <div className="flex flex-col w-6 items-end justify-end gap-2.5 pt-0 pb-px px-0 relative self-stretch">
                            <div className="relative w-fit opacity-75 [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-light-80 text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
                              /mo
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {card.id === "website-builder" && (
                    <>
                      <EditableElement as="h2" sectionId={sectionId} path={`cards.${index}.title`} className="absolute top-8 left-[76px] [font-family:'Satoshi-Bold',Helvetica] font-bold text-white text-2xl tracking-[0] leading-[32.2px] whitespace-nowrap">
                        {card.title}
                      </EditableElement>
                      <img
                        className="absolute top-8 left-8 w-8 h-8"
                        alt={`${card.title} logo`}
                        src={card.logo}
                      />
                      <img
                        className="absolute top-[74px] left-[243px] w-[19px] h-5"
                        alt="Frame decoration"
                        src={card.frameIcon}
                      />
                      <img
                        className="absolute top-[94px] left-0 w-[294px] h-[226px]"
                        alt="Website builder preview"
                        src="https://c.animaapp.com/dZ1UxMzX/img/image-1.svg"
                      />
                      <div className="inline-flex items-end gap-1 absolute top-[72px] left-[76px]">
                        <div className="inline-flex items-end pt-0 pb-px px-0 relative self-stretch flex-[0_0_auto]">
                          <div className="relative w-fit [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-light-80 text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
                            From
                          </div>
                        </div>
                        <div className="inline-flex items-end gap-1 relative flex-[0_0_auto]">
                          <EditableInline sectionId={sectionId} path={`cards.${index}.price`} className="relative w-fit mt-[-1.00px] [font-family:'Satoshi-Medium',Helvetica] font-medium text-colors-neutral-25 text-xl tracking-[0] leading-[26.8px] whitespace-nowrap">
                            {card.price}
                          </EditableInline>
                          <div className="flex flex-col w-6 items-end justify-end gap-2.5 pt-0 pb-px px-0 relative self-stretch">
                            <div className="relative w-fit opacity-75 [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-light-80 text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
                              /mo
                            </div>
                          </div>
                        </div>
                      </div>
                      <img
                        className="absolute top-[89px] left-0 w-[294px] h-[231px]"
                        alt={`${card.title} main visual`}
                        src={card.mainImage}
                      />
                      <div className="inline-flex flex-col items-start gap-[9.6px] p-[19.2px] absolute top-[201px] left-3.5 rounded-[9.6px] border-[none] shadow-[0px_0px_64px_#00000066] backdrop-blur-lg backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(16px)_brightness(100%)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.56)_100%)] before:content-[''] before:absolute before:inset-0 before:p-[1.6px] before:rounded-[9.6px] before:[background:linear-gradient(180deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.02)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
                        <div className="items-center gap-[3.2px] inline-flex flex-col justify-center relative flex-[0_0_auto]">
                          <img
                            className="relative w-[22.4px] h-[22.4px]"
                            alt="Building icon"
                            src="https://c.animaapp.com/dZ1UxMzX/img/icon-6.svg"
                          />
                          <div className="relative w-fit [font-family:'Satoshi-Bold',Helvetica] font-bold text-colors-neutral-800 text-[12.8px] tracking-[0] leading-[22.4px] whitespace-nowrap">
                            Building Your Site...
                          </div>
                          <img
                            className="absolute top-[-18px] left-[-19px] w-[74px] h-[74px]"
                            alt="Shadow effect"
                            src="https://c.animaapp.com/dZ1UxMzX/img/shadow@2x.png"
                          />
                        </div>
                        <div className="h-[4.8px] gap-2 rounded-[79.2px] flex flex-col items-start relative self-stretch w-full bg-colors-translucent-dark-8">
                          <div className="w-[62.4px] rounded-[79.2px] bg-[linear-gradient(90deg,rgba(119,160,32,1)_0%,rgba(55,184,213,1)_100%)] relative flex-1 grow bg-colors-primary-700" />
                        </div>
                      </div>
                    </>
                  )}

                  {card.id === "wordpress" && (
                    <>
                      <EditableElement as="h2" sectionId={sectionId} path={`cards.${index}.title`} className="absolute top-8 left-[76px] [font-family:'Satoshi-Bold',Helvetica] font-bold text-white text-2xl tracking-[0] leading-[32.2px] whitespace-nowrap">
                        {card.title}
                      </EditableElement>
                      <div className="flex w-8 h-8 items-center justify-center gap-2 p-[6.4px] absolute top-8 left-8 bg-colors-translucent-dark-8 rounded-[6.4px]">
                        <img
                          className="relative w-4 h-4 aspect-[1]"
                          alt="WordPress logo"
                          src={card.logo}
                        />
                      </div>
                      <img
                        className="absolute top-[74px] left-[243px] w-[19px] h-5"
                        alt="Frame decoration"
                        src={card.frameIcon}
                      />
                      <img
                        className="absolute top-[105px] right-[-66px] w-[293px] h-[215px]"
                        alt={`${card.title} main visual`}
                        src={card.mainImage}
                      />
                      <div className="inline-flex flex-col items-start gap-[9.54px] p-[19.09px] absolute top-[202px] left-3.5 rounded-[9.54px] border-[none] shadow-[0px_0px_23.98px_#00000052] backdrop-blur-[15.91px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(15.91px)_brightness(100%)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.56)_100%)] before:content-[''] before:absolute before:inset-0 before:p-[1.59px] before:rounded-[9.54px] before:[background:linear-gradient(180deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.02)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
                        <div className="items-start gap-[3.18px] inline-flex flex-col justify-center relative flex-[0_0_auto]">
                          <img
                            className="relative w-[56.21px] h-[56.26px] mt-[-17.00px] ml-[-16.96px]"
                            alt="Creating icon"
                            src="https://c.animaapp.com/dZ1UxMzX/img/icon-7.svg"
                          />
                          <div className="relative w-fit [font-family:'Satoshi-Medium',Helvetica] font-medium text-colors-neutral-800 text-[12.7px] tracking-[0] leading-[22.3px] whitespace-nowrap">
                            Creating Your Site...
                          </div>
                          <img
                            className="absolute top-[-33px] left-[-35px] w-[89px] h-[89px]"
                            alt="Shadow effect"
                            src="https://c.animaapp.com/dZ1UxMzX/img/shadow-1@2x.png"
                          />
                        </div>
                        <div className="h-[4.77px] gap-[7.95px] rounded-[78.74px] flex flex-col items-start relative self-stretch w-full bg-colors-translucent-dark-8">
                          <div className="w-[62.04px] rounded-[78.74px] bg-[linear-gradient(90deg,rgba(172,204,84,1)_0%,rgba(84,59,242,1)_100%)] relative flex-1 grow bg-colors-primary-400" />
                        </div>
                      </div>
                      <div className="inline-flex items-end gap-1 absolute top-[72px] left-[76px]">
                        <div className="inline-flex items-end pt-0 pb-px px-0 relative self-stretch flex-[0_0_auto]">
                          <div className="relative w-fit [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-light-80 text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
                            From
                          </div>
                        </div>
                        <div className="inline-flex items-end gap-1 relative flex-[0_0_auto]">
                          <EditableInline sectionId={sectionId} path={`cards.${index}.price`} className="relative w-fit mt-[-1.00px] [font-family:'Satoshi-Medium',Helvetica] font-medium text-colors-neutral-25 text-xl tracking-[0] leading-[26.8px] whitespace-nowrap">
                            {card.price}
                          </EditableInline>
                          <div className="flex flex-col w-6 items-end justify-end gap-2.5 pt-0 pb-px px-0 relative self-stretch">
                            <div className="relative w-fit opacity-75 [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-light-80 text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
                              /mo
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  </article>
                </div>
                </SortableItem>
              ))}
              </div>
              </SortableWrapper>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout - Responsive grid */}
      <div className="xl:hidden px-4 sm:px-6 md:px-8 lg:px-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="inline-flex items-center justify-center gap-1 px-1.5 py-0.5 bg-colors-translucent-dark-2 rounded-lg border border-solid border-colors-translucent-dark-8">
            <img
              className="w-5 h-5"
              alt="Business Suite logo"
              src="https://c.animaapp.com/dZ1UxMzX/img/group-555@2x.png"
            />
            <p className="[font-family:'Satoshi-Bold',Helvetica] font-normal text-colors-neutral-800 text-lg">
              <span className="font-bold">Business</span>
              <span className="[font-family:'Satoshi-Regular',Helvetica]">Suite</span>
            </p>
          </div>
          <EditableInline sectionId={sectionId} path="title" className="font-body-regular text-colors-neutral-800 text-sm sm:text-base">
            {data?.title ?? 'Everything you need to grow online'}
          </EditableInline>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {cards.map((card, index) => (
            <article
              key={card.id}
              dir="ltr"
              className={`relative w-full aspect-[4/3] rounded-3xl overflow-hidden ${card.bgGradient}`}
            >
              <div className="absolute top-0 left-[-72px] w-[927px] h-[927px] rounded-[463.5px] blur-md bg-[linear-gradient(210deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)] opacity-[0.32]" />
              <div className="absolute top-14 left-[-553px] w-[927px] h-[927px] rounded-[463.5px] blur bg-[linear-gradient(122deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)] opacity-[0.32]" />
              
              {/* Simplified card content for mobile */}
              <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <img
                  className="w-8 h-8"
                  alt={`${card.title} logo`}
                  src={card.logo}
                />
                <EditableElement
                  as="h2"
                  sectionId={sectionId}
                  path={`cards.${index}.title`}
                  className="[font-family:'Satoshi-Bold',Helvetica] font-bold text-white text-xl md:text-2xl"
                >
                  {card.title}
                </EditableElement>
              </div>
              
              <div className="absolute top-16 left-6 flex items-end gap-1 z-10">
                <span className="[font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-light-80 text-xs">
                  From
                </span>
                <EditableInline
                  sectionId={sectionId}
                  path={`cards.${index}.price`}
                  className="[font-family:'Satoshi-Medium',Helvetica] font-medium text-colors-neutral-25 text-lg"
                >
                  {card.price}
                </EditableInline>
                <span className="opacity-75 [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-translucent-light-80 text-xs">
                  /mo
                </span>
              </div>

              {card.mainImage && (
                <img
                  className="absolute bottom-0 right-0 w-3/5 h-auto object-contain"
                  alt={`${card.title} visual`}
                  src={card.mainImage}
                />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default V2BusinessSuiteSection;
