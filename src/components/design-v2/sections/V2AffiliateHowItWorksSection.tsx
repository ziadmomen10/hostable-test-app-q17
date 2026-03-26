import React from 'react';
import { EditableElement } from '@/components/editor/EditableElement';
import type { V2AffiliateHowItWorksSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';
import { Card } from '@/components/ui/card';

interface V2AffiliateHowItWorksSectionProps {
    data?: V2AffiliateHowItWorksSectionData & BaseSectionData;
    sectionId?: string;
    isEditing?: boolean;
}

export const V2AffiliateHowItWorksSection: React.FC<V2AffiliateHowItWorksSectionProps> = ({
    data,
    sectionId,
}) => {
    const title = data?.title ?? 'How It Works';
    const subtitle =
        data?.subtitle ??
        'Everything you need to find, secure, and manage your perfect online address in five simple steps.';
    const fallbackSteps = [
        {
            id: '1',
            badge: 'STEP 01',
            title: 'Create an Account',
            description:
                'Sign up takes less than a minute. Get instant access to your affiliate dashboard and resources.',
            image: '/lovable-uploads/step-1.png',
        },
        {
            id: '2',
            badge: 'STEP 02',
            title: 'Share Your Link',
            description:
                'Sign up takes less than a minute. Get instant access to your affiliate dashboard and resources.',
            image: '/lovable-uploads/step-2.png',
        },
        {
            id: '3',
            badge: 'STEP 03',
            title: 'Get Paid',
            description:
                'Sign up takes less than a minute. Get instant access to your affiliate dashboard and resources.',
            image: '/lovable-uploads/step-3.png',
        },
    ];

    const steps = fallbackSteps.map((fallbackStep, index) => ({
        ...fallbackStep,
        ...data?.steps?.[index],
        image: fallbackStep.image,
    }));

    return (
        <section
            className="w-full relative bg-colors-neutral-800 overflow-hidden"
            aria-labelledby="v2-affiliate-how-it-works-heading"
        >
            <div className="relative z-10 w-full max-w-[1920px] mx-auto py-[var(--spacing-30x)] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[var(--spacing-60x)]">
                {/* Section Header */}
                <div className="flex flex-col gap-4 items-center text-center mb-[var(--spacing-15x)] max-w-[679px] mx-auto">
                    <EditableElement
                        as="h2"
                        id="v2-affiliate-how-it-works-heading"
                        sectionId={sectionId}
                        path="title"
                        className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-25 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)]"
                    >
                        {title}
                    </EditableElement>

                    <EditableElement
                        as="p"
                        sectionId={sectionId}
                        path="subtitle"
                        className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-translucent-light-64 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]"
                    >
                        {subtitle}
                    </EditableElement>
                </div>

                {/* Steps Grid */}
                <div className="flex flex-col lg:flex-row gap-[var(--spacing-10x)]">
                    {steps.map((step, index) => (
                        <Card key={step.id} className="relative group border-0 shadow-none bg-transparent p-0 flex-1">
                            {/* Highlight Border - visible on hover */}
                            <div
                                className="absolute -inset-5 border border-transparent group-hover:border-[rgba(255,255,255,0.16)] rounded-[32px] pointer-events-none transition-colors duration-300"
                                aria-hidden="true"
                            />

                            {/* Card Content */}
                            <div className="relative flex flex-col gap-[var(--spacing-8x)] items-center">
                                {/* Card Image */}
                                <div className="h-[453px] w-full overflow-hidden rounded-[24px]">
                                    <img
                                        src={step.image}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        aria-hidden="true"
                                    />
                                </div>

                                {/* Card Text Content */}
                                <div className="flex flex-col gap-[var(--spacing-5x)] items-start w-full px-[var(--spacing-8x)]">
                                    {/* Badge */}
                                    <EditableElement
                                        as="div"
                                        sectionId={sectionId}
                                        path={`steps.${index}.badge`}
                                        className="flex items-center justify-center px-[8px] py-[2px] rounded-[8px] text-colors-neutral-800 font-body-extra-small-b font-bold text-[12px] tracking-[0] leading-[1.7] w-fit bg-colors-neutral-50 border border-colors-neutral-100 group-hover:bg-colors-others-yellow-400 group-hover:border-colors-translucent-light-4 transition-colors duration-300"
                                    >
                                        {step.badge}
                                    </EditableElement>

                                    {/* Title & Description */}
                                    <div className="flex flex-col gap-[var(--spacing-5x)]">
                                        <EditableElement
                                            as="h3"
                                            sectionId={sectionId}
                                            path={`steps.${index}.title`}
                                            className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-25 text-[32px] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)]"
                                        >
                                            {step.title}
                                        </EditableElement>

                                        <EditableElement
                                            as="p"
                                            sectionId={sectionId}
                                            path={`steps.${index}.description`}
                                            className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-translucent-light-72 text-[15px] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]"
                                        >
                                            {step.description}
                                        </EditableElement>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
