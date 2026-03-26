import React, { useState } from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FaqItem {
  id: string;
  question: string;
  answer?: string;
}

interface V2AffiliateFaqSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    reachOutText?: string;
    reachOutLink?: string;
    honeyAIText?: string;
    honeyAILink?: string;
    faqs?: FaqItem[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2AffiliateFaqSection: React.FC<V2AffiliateFaqSectionProps> = ({
  data,
  sectionId,
  isEditing,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const title = data?.title ?? 'Frequently Asked Questions';
  const subtitle =
    data?.subtitle ?? 'Get clear answers about our virtual dedicated servers.';
  const reachOutText = data?.reachOutText ?? 'Still got questions?\nReach Out to Us';
  const reachOutLink = data?.reachOutLink ?? '#contact';
  const honeyAIText = data?.honeyAIText ?? 'Ask HoneyAI™';
  const honeyAILink = data?.honeyAILink ?? '#honey-ai';

  const { items: faqs, getItemProps, SortableWrapper } = useArrayItems<FaqItem>(
    'faqs',
    data?.faqs ?? []
  );

  const handleFaqToggle = (index: number) => {
    if (isEditing) return;
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className="w-full relative bg-colors-neutral-25"
      aria-labelledby="v2-affiliate-faq-heading"
    >
        <div className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16 py-10 md:py-16 lg:py-[120px] px-4 sm:px-6 md:px-12 lg:px-[240px]">
        {/* Header - order-1 on mobile, part of left column on desktop */}
        <div className="flex flex-col items-start gap-4 w-full lg:max-w-[560px] shrink-0 order-1">
          <EditableElement
            as="h2"
            id="v2-affiliate-faq-heading"
            sectionId={sectionId}
            path="title"
            className="font-[Satoshi] text-[48px] font-medium leading-[126%] text-[#262626]"
          >
            {title}
          </EditableElement>

          <EditableElement
            as="p"
            sectionId={sectionId}
            path="subtitle"
            className="font-[Satoshi] text-[18px] font-normal leading-[175%] text-[#555] text-center"
          >
            {subtitle}
          </EditableElement>

          {/* Action Links - hidden on mobile, shown on desktop within left column */}
          <div className="hidden lg:flex flex-col gap-4 w-full mt-6">
            {/* Reach Out link */}
            <Card className="border-0 shadow-none bg-transparent p-0">
              <a
                href="#contact" // for testing purposes
                className="flex items-center justify-between w-full p-4 md:p-6 bg-colors-translucent-dark-2 rounded-3xl hover:bg-colors-translucent-dark-8 transition-colors group"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-[#c9f355] shrink-0 flex items-center justify-center">
                    <img
                      className="w-full h-full object-cover"
                      alt="Support"
                      src="/lovable-uploads/FAQ/Image-1.png"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-[Satoshi] text-[16px] font-normal leading-[175%] text-[#555]">
                      {reachOutText.split('\n')[0]}
                    </span>
                    <span className="font-[Satoshi] text-[20px] font-medium leading-[178%] text-[#262626]">
                      {reachOutText.split('\n')[1]}
                    </span>
                  </div>
                </div>
                <img
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  alt=""
                  src="/lovable-uploads/FAQ/Icon-1.png"
                  aria-hidden="true"
                  dir="ltr"
                />
              </a>
            </Card>

            {/* Ask HoneyAI link */}
            <Card className="border-0 shadow-none bg-transparent p-0">
              <a
                href="#contact" // for testing purposes
                className="flex items-center justify-between w-full p-4 md:p-6 bg-colors-translucent-dark-2 rounded-3xl hover:bg-colors-translucent-dark-8 transition-colors group"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-[72px] h-[72px] rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      className="w-full h-full object-cover"
                      alt="HoneyAI"
                      src="/lovable-uploads/FAQ/Image-2.png"
                      aria-hidden="true"
                    />
                  </div>
                  <EditableElement
                    as="span"
                    sectionId={sectionId}
                    path="honeyAIText"
                    className="font-[Satoshi] text-[20px] font-medium leading-[178%] text-[#262626]"
                  >
                    {honeyAIText}
                  </EditableElement>
                </div>
                <img
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  alt=""
                  src="/lovable-uploads/FAQ/Icon-2.png"
                  aria-hidden="true"
                  dir="ltr"
                />
              </a>
            </Card>
          </div>
        </div>

        {/* Right: FAQ accordion - order-2 on mobile */}
        <SortableWrapper>
          <div className="flex flex-col w-full lg:max-w-[820px] gap-2 order-2">
            {faqs.map((faq, index) => {
              const isOpen = isEditing || openIndex === index;

              return (
                <div key={faq.id} {...getItemProps(index)}>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full py-4 px-5 rounded-2xl hover:bg-colors-translucent-dark-2 transition-colors cursor-pointer text-left"
                    onClick={() => handleFaqToggle(index)}
                    aria-expanded={isOpen}
                  >
                    <EditableInline
                      sectionId={sectionId}
                      path={`faqs.${index}.question`}
                      className="font-[Satoshi] text-[20px] font-medium leading-[178%] text-[#262626]"
                    >
                      {faq.question}
                    </EditableInline>

                    <ChevronDown
                      className={`w-5 h-5 text-colors-neutral-600 shrink-0 ml-4 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && faq.answer && (
                    <div className="px-5 pb-4 text-colors-neutral-600 font-body-regular">
                      <EditableElement
                        as="div"
                        sectionId={sectionId}
                        path={`faqs.${index}.answer`}
                        className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]"
                      >
                        {faq.answer}
                      </EditableElement>
                    </div>
                  )}

                  {index < faqs.length - 1 && (
                    <div className="w-full h-px bg-colors-translucent-dark-8" role="separator" />
                  )}
                </div>
              );
            })}
          </div>
        </SortableWrapper>

        {/* Action Links (Mobile only) - order-3, shown at bottom on mobile, hidden on desktop */}
        <div className="flex lg:hidden flex-col gap-4 w-full order-3">
          {/* Reach Out link */}
          <Card className="border-0 shadow-none bg-transparent p-0">
            <a
              href={reachOutLink}
              className="flex items-center justify-between w-full p-4 md:p-6 bg-colors-translucent-dark-2 rounded-3xl hover:bg-colors-translucent-dark-8 transition-colors group"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-[#c9f355] shrink-0 flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    alt="Support"
                    src="/lovable-uploads/FAQ/Image-1.png"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-[Satoshi] text-[16px] font-normal leading-[175%] text-[#555]">
                    {reachOutText.split('\n')[0]}
                  </span>
                  <span className="font-[Satoshi] text-[20px] font-medium leading-[178%] text-[#262626]">
                    {reachOutText.split('\n')[1]}
                  </span>
                </div>
              </div>
              <img
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                alt=""
                src="/lovable-uploads/FAQ/Icon-1.png"
                aria-hidden="true"
                dir="ltr"
              />
            </a>
          </Card>

          {/* Ask HoneyAI link */}
          <Card className="border-0 shadow-none bg-transparent p-0">
            <a
              href={honeyAILink}
              className="flex items-center justify-between w-full p-4 md:p-6 bg-colors-translucent-dark-2 rounded-3xl hover:bg-colors-translucent-dark-8 transition-colors group"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    alt="HoneyAI"
                    src="/lovable-uploads/FAQ/Image-2.png"
                    aria-hidden="true"
                  />
                </div>
                <EditableElement
                  as="span"
                  sectionId={sectionId}
                  path="honeyAIText"
                  className="font-[Satoshi] text-[20px] font-medium leading-[178%] text-[#262626]"
                >
                  {honeyAIText}
                </EditableElement>
              </div>
              <img
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                alt=""
                src="/lovable-uploads/FAQ/Icon-2.png"
                aria-hidden="true"
                dir="ltr"
              />
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default V2AffiliateFaqSection;