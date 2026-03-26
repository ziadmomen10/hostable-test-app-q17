import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface V2AffiliateBenefitItem {
    text: string;
}

interface V2AffiliateHeroSectionProps {
    data?: {
        badge?: string;
        title?: string;
        subtitle?: string;
        benefits?: V2AffiliateBenefitItem[];
        buttonText?: string;
        buttonLink?: string;
        secondaryButtonText?: string;
        secondaryButtonLink?: string;
    };
    sectionId?: string;
    isEditing?: boolean;
}

export const V2AffiliateHeroSection: React.FC<V2AffiliateHeroSectionProps> = ({ data, sectionId }) => {
    const badge = data?.badge ?? 'Partner Program';
    const title = data?.title ?? 'Earn More by\nPromoting Hostonce';
    const subtitle = data?.subtitle ?? 'Join an affiliate program that values your partnership and empower your audience with reliable hosting solutions loved by millions.';
    const benefits = data?.benefits ?? [
        { text: 'Up to 60% Commission' },
        { text: 'No Approval Required' },
        { text: 'Monthly & Yearly Plan Commission' },
    ];
    const buttonText = data?.buttonText ?? 'Become an Affiliate';
    const buttonLink = data?.buttonLink ?? '#';
    const secondaryButtonText = data?.secondaryButtonText ?? 'Log In';
    const secondaryButtonLink = data?.secondaryButtonLink ?? '#';

    // Fixed image paths - not configurable
    const logoImage = '/lovable-uploads/Hero/Logo-Hostonce.png';
    const heroImage = '/lovable-uploads/Hero/affiliate-hero.png';
    const trustpilotImage = '/lovable-uploads/Hero/trustpilot-reviews.png';
    const trustpilotMobileImage = '/lovable-uploads/Hero/Trustpilot Reviews-mobile.png';

    return (
        <section
            className="w-full relative bg-colors-neutral-25 overflow-hidden"
            aria-labelledby="v2-affiliate-hero-heading"
        >
            <div className="relative z-10 w-full max-w-[1920px] mx-auto pt-16 md:pt-[110px] pb-[52px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:pl-[160px] 2xl:pr-0">
                {/* Main Grid: Text Left, Image Right */}
                <div className="grid md:grid-cols-2 xl:grid-cols-[622px_1fr] gap-8 xl:gap-0 items-center">
                    {/* Text Content - Left Column */}
                    <div className="flex flex-col items-start gap-8">
                        {/* Heading+Pricing: badge + title + subtitle */}
                        <div className="flex flex-col items-start gap-4">
                            {/* Badge+Heading: badge + title */}
                            <div className="flex flex-col items-start gap-2">
                                {/* Badge */}
                                {badge && (
                                    <div className="flex items-center gap-1 pl-1">
                                        <img src={logoImage} alt="hostonce" style={{ width: '65px', height: '16px', display: 'block' }} />
                                        <EditableElement
                                            as="span"
                                            sectionId={sectionId}
                                            path="badge"
                                            className="font-body-regular text-[12px] not-italic font-normal leading-[16px] tracking-[0] text-colors-neutral-800"
                                        >
                                            {badge}
                                        </EditableElement>
                                    </div>
                                )}

                                <EditableElement
                                    as="h1"
                                    id="v2-affiliate-hero-heading"
                                    sectionId={sectionId}
                                    path="title"
                                    className="font-heading-h2 text-[48px] not-italic font-[500] leading-[126%] tracking-[0] text-colors-neutral-800 whitespace-pre-line"
                                >
                                    {title}
                                </EditableElement>
                            </div>

                            <EditableElement
                                as="p"
                                sectionId={sectionId}
                                path="subtitle"
                                className="font-body-regular text-[16px] not-italic font-normal leading-[175%] tracking-[0] text-colors-neutral-600"
                            >
                                {subtitle}
                            </EditableElement>
                        </div>

                        {/* Benefits List */}
                        <div className="flex flex-col gap-5">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <rect width="20" height="20" rx="10" fill="#ACCC54" fillOpacity="0.16" />
                                        <path d="M7 10.0041L8.99448 12L13 8" stroke="#ACCC54" strokeOpacity="0.92" strokeLinecap="square" />
                                        <path d="M7 10.0041L8.99448 12L13 8" stroke="black" strokeOpacity="0.32" strokeLinecap="square" />
                                    </svg>
                                    <EditableElement
                                        as="span"
                                        sectionId={sectionId}
                                        path={`benefits.${index}.text`}
                                        className="font-body-regular text-[16px] not-italic font-[500] leading-[175%] tracking-[0] text-colors-neutral-800"
                                    >
                                        {benefit.text}
                                    </EditableElement>
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-4">
                            <a
                                href={buttonLink}
                                className="inline-flex items-center justify-center gap-2 py-5 px-8 bg-[#caf355] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105"
                            >
                                <EditableInline
                                    sectionId={sectionId}
                                    path="buttonText"
                                    className="font-body-regular text-[16px] not-italic font-bold leading-[175%] tracking-[0] text-colors-secondary-900 whitespace-nowrap"
                                >
                                    {buttonText}
                                </EditableInline>
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="10" className="fill-colors-secondary-900" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 8l4 4-4 4" stroke="#caf355" />
                                </svg>
                            </a>
                            <a
                                href={secondaryButtonLink}
                                className="inline-flex items-center justify-center gap-2 py-5 px-8 bg-transparent border border-colors-translucent-dark-16 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-colors-translucent-dark-56"
                            >
                                <EditableInline
                                    sectionId={sectionId}
                                    path="secondaryButtonText"
                                    className="font-body-regular text-[16px] not-italic font-bold leading-[175%] tracking-[0] text-colors-secondary-900 whitespace-nowrap"
                                >
                                    {secondaryButtonText}
                                </EditableInline>
                            </a>
                        </div>
                    </div>

                    {/* Hero Image - Right Column */}
                    <div className="flex items-center justify-center xl:justify-end">
                        <div className="relative w-full">
                            <img
                                src={heroImage}
                                alt="Affiliate Program Hero"
                                className="w-full h-auto"
                                dir="ltr"
                            />
                        </div>
                    </div>
                </div>

                {/* Trustpilot Reviews - Bottom Center */}
                <div className="flex justify-center">
                    <div className="inline-block">
                        <img
                            src={trustpilotImage}
                            alt="Trustpilot Reviews"
                            className="hidden md:block h-auto max-w-full"
                            dir="ltr"
                        />
                        <img
                            src={trustpilotMobileImage}
                            alt="Trustpilot Reviews"
                            className="block md:hidden h-auto max-w-full"
                            dir="ltr"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default V2AffiliateHeroSection;
