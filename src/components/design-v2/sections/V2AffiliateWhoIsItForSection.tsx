import React from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { Card } from '@/components/ui/card';

interface WhoIsItForItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface V2AffiliateWhoIsItForSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    items?: WhoIsItForItem[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2AffiliateWhoIsItForSection: React.FC<V2AffiliateWhoIsItForSectionProps> = ({ data, sectionId }) => {
  const title = data?.title ?? 'Who is Our Affiliate Program For?';
  const subtitle = data?.subtitle ?? 'Every Guide is trained and excited to work with you, whether you need help with a password reset or you\'re looking for a team to build your complete web presence.';
  const buttonText = data?.buttonText ?? 'Become an Affiliate';
  const buttonLink = data?.buttonLink ?? '#';

  const { items, getItemProps, SortableWrapper } = useArrayItems<WhoIsItForItem>(
    'items',
    data?.items ?? []
  );

  return (
    <section
      className="w-full relative bg-[#FFF]"
      aria-labelledby="v2-affiliate-who-is-it-for-heading"
    >
      <div className="w-full max-w-[1920px] mx-auto pt-[60px] pb-[120px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[240px]">
        {/* Header */}
        <header className="flex flex-col items-start gap-6 mb-[60px]">
          <EditableElement
            as="h2"
            id="v2-affiliate-who-is-it-for-heading"
            sectionId={sectionId}
            path="title"
            className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)]"
          >
            {title}
          </EditableElement>

          <EditableElement
            as="p"
            sectionId={sectionId}
            path="subtitle"
            className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-700 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] max-w-[700px]"
          >
            {subtitle}
          </EditableElement>

          <a
            href={buttonLink}
            className="inline-flex items-center justify-center gap-2 py-5 px-8 bg-[#CAF355] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <EditableInline
              sectionId={sectionId}
              path="buttonText"
              className="font-['Satoshi',sans-serif] font-bold text-[16px] leading-[175%] text-[#1A2617] whitespace-nowrap"
            >
              {buttonText}
            </EditableInline>
            <div >
              <img
                src="/lovable-uploads/WhoIsItFor/Icon.png"
                alt=""
                className="w-5.5 h-5.5"
                aria-hidden="true"
              />
            </div>
          </a>
        </header>

        {/* Items Grid */}
        <SortableWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-[40px] md:gap-y-8">
            {items.map((item, index) => (
              <Card
                key={item.id}
                {...getItemProps(index)}
                role="article"
                className="flex flex-col items-start gap-[32px] p-8 bg-[#FFF] rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-0"
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <img
                    className="w-full h-full object-contain"
                    alt=""
                    src={item.icon}
                    aria-hidden="true"
                    dir="ltr"
                  />
                </div>
                <div className="flex flex-col items-start gap-3 w-full">
                  <EditableInline
                    sectionId={sectionId}
                    path={`items.${index}.title`}
                    className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)]"
                  >
                    {item.title}
                  </EditableInline>
                  <EditableElement
                    as="p"
                    sectionId={sectionId}
                    path={`items.${index}.description`}
                    className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]"
                  >
                    {item.description}
                  </EditableElement>
                </div>
              </Card>
            ))}
          </div>
        </SortableWrapper>
      </div>
    </section>
  );
};

export default V2AffiliateWhoIsItForSection;
