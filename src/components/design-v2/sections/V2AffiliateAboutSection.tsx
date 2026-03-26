import React from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { Card } from '@/components/ui/card';

interface AffiliateAboutCard {
  id: string;
  icon: string;
  taglineIcon?: string;
  image: string;
  tagline: string;
  title: string;
  description: string;
}

interface V2AffiliateAboutSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    cards?: AffiliateAboutCard[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2AffiliateAboutSection: React.FC<V2AffiliateAboutSectionProps> = ({ data, sectionId }) => {
  const title = data?.title ?? '';
  const subtitle = data?.subtitle ?? '';

  const { items: cards, getItemProps, SortableWrapper } = useArrayItems<AffiliateAboutCard>(
    'cards',
    data?.cards ?? []
  );

  return (
    <section className="w-full relative bg-colors-neutral-25">
      <div className="w-full max-w-[1920px] mx-auto py-16 md:py-[120px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[240px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] w-full">
          {/* Left Column: Header + Cards 0 and 2 */}
          <div className="flex flex-col items-start gap-[128px] w-full">
            {/* Header */}
            {(title || subtitle) && (
              <header className="flex flex-col items-start gap-4 w-full">
                {title && (
                  <EditableElement 
                    as="h2" 
                    sectionId={sectionId} 
                    path="title" 
                    className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)]"
                  >
                    {title}
                  </EditableElement>
                )}

                {subtitle && (
                  <EditableElement 
                    as="p" 
                    sectionId={sectionId} 
                    path="subtitle" 
                    className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] whitespace-pre-line"
                  >
                    {subtitle}
                  </EditableElement>
                )}
              </header>
            )}

            {/* Left Column Cards - Cards at index 0 and 2 */}
            <SortableWrapper>
              <div className="flex flex-col gap-[120px] w-full">
                {cards.filter((_, idx) => idx === 0 || idx === 2).map((card, arrayIndex) => {
                  const originalIndex = arrayIndex === 0 ? 0 : 2;
                  return (
                    <Card
                      key={card.id}
                      {...getItemProps(originalIndex)}
                      role="article"
                      className="flex flex-col items-start rounded-3xl border-0 shadow-none bg-transparent"
                    >
                      {/* Card Image */}
                      {card.image && (
                        <div className="w-full aspect-[69/40] overflow-hidden rounded-2xl">
                          <img 
                            className="w-full h-full object-cover" 
                            alt="" 
                            src={card.image} 
                            dir="ltr"
                            aria-hidden="true"
                          />
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="flex flex-col items-start gap-4 w-full mt-10 px-10">
                        {/* Sub-heading + Heading group */}
                        <div className="flex flex-col gap-2 w-full">
                          {/* Tagline with Icon */}
                          <div className="flex items-center gap-2">
                            {card.taglineIcon && (
                              <img src={card.taglineIcon} alt="" className="w-4 h-4 shrink-0" aria-hidden="true" />
                            )}
                            <EditableInline 
                              sectionId={sectionId} 
                              path={`cards.${originalIndex}.tagline`} 
                              className="font-body-regular font-bold text-colors-primary-800 text-base tracking-[var(--body-regular-letter-spacing)] leading-[1.75]"
                            >
                              {card.tagline}
                            </EditableInline>
                          </div>

                          {/* Title with Icon */}
                          <div className="flex items-start gap-3 w-full">
                            {card.icon && (
                              <img className="w-6 h-6 mt-1 shrink-0" alt="" src={card.icon} aria-hidden="true" />
                            )}
                            <EditableElement 
                              as="h3" 
                              sectionId={sectionId} 
                              path={`cards.${originalIndex}.title`} 
                              className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[32px] tracking-[var(--heading-h4-letter-spacing)] leading-[1.26]"
                            >
                              {card.title}
                            </EditableElement>
                          </div>
                        </div>

                        {/* Description */}
                        <EditableElement 
                          as="p" 
                          sectionId={sectionId} 
                          path={`cards.${originalIndex}.description`} 
                          className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]"
                        >
                          {card.description}
                        </EditableElement>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </SortableWrapper>
          </div>

          {/* Right Column: Cards 1 and 3 */}
          <div className="flex flex-col gap-[120px]">
            {cards.filter((_, idx) => idx === 1 || idx === 3).map((card, arrayIndex) => {
              const originalIndex = arrayIndex === 0 ? 1 : 3;
              return (
                <Card
                  key={card.id}
                  {...getItemProps(originalIndex)}
                  role="article"
                  className="flex flex-col items-start rounded-3xl border-0 shadow-none bg-transparent"
                >
                  {/* Card Image */}
                  {card.image && (
                    <div className="w-full aspect-[69/40] overflow-hidden rounded-2xl">
                      <img 
                        className="w-full h-full object-cover" 
                        alt="" 
                        src={card.image} 
                        dir="ltr"
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="flex flex-col items-start gap-4 w-full mt-10 px-10">
                    {/* Sub-heading + Heading group */}
                    <div className="flex flex-col gap-2 w-full">
                      {/* Tagline with Icon */}
                      <div className="flex items-center gap-2">
                        {card.taglineIcon && (
                          <img src={card.taglineIcon} alt="" className="w-4 h-4 shrink-0" aria-hidden="true" />
                        )}
                        <EditableInline 
                          sectionId={sectionId} 
                          path={`cards.${originalIndex}.tagline`} 
                          className="font-body-regular font-bold text-colors-primary-800 text-base tracking-[var(--body-regular-letter-spacing)] leading-[1.75]"
                        >
                          {card.tagline}
                        </EditableInline>
                      </div>

                      {/* Title with Icon */}
                      <div className="flex items-start gap-3 w-full">
                        {card.icon && (
                          <img className="w-6 h-6 mt-1 shrink-0" alt="" src={card.icon} aria-hidden="true" />
                        )}
                        <EditableElement 
                          as="h3" 
                          sectionId={sectionId} 
                          path={`cards.${originalIndex}.title`} 
                          className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[32px] tracking-[var(--heading-h4-letter-spacing)] leading-[1.26]"
                        >
                          {card.title}
                        </EditableElement>
                      </div>
                    </div>

                    {/* Description */}
                    <EditableElement 
                      as="p" 
                      sectionId={sectionId} 
                      path={`cards.${originalIndex}.description`} 
                      className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]"
                    >
                      {card.description}
                    </EditableElement>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default V2AffiliateAboutSection;
