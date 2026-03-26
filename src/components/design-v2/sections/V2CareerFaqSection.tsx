import React, { useState } from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer?: string;
}

interface V2CareerFaqSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    contactText?: string;
    contactLabel?: string;
    contactImage?: string;
    faqs?: FaqItem[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2CareerFaqSection: React.FC<V2CareerFaqSectionProps> = ({ data, sectionId }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const title = data?.title ?? 'Frequently Asked\nQuestions';
  const subtitle = data?.subtitle ?? 'Get clear answers about our career openings.';
  const contactText = data?.contactText ?? 'Still got questions?';
  const contactLabel = data?.contactLabel ?? 'Reach Out to Us';
  const contactImage = data?.contactImage ?? 'https://c.animaapp.com/gD1ZRAUQ/img/main@2x.png';

  const { items: faqs, getItemProps, SortableWrapper } = useArrayItems<FaqItem>(
    'faqs',
    data?.faqs ?? []
  );

  return (
    <section
      className="w-full relative bg-colors-neutral-25"
      aria-labelledby="v2-career-faq-heading"
    >
      <div className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16 py-10 md:py-16 lg:py-[120px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
        {/* Left: header + contact */}
        <div className="flex flex-col items-start gap-10 w-full lg:max-w-[560px] shrink-0">
          <div className="flex flex-col items-start gap-4 w-full">
            <EditableElement
              as="h2"
              id="v2-career-faq-heading"
              sectionId={sectionId}
              path="title"
              className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)] whitespace-pre-line"
            >
              {title}
            </EditableElement>

            <EditableElement as="p" sectionId={sectionId} path="subtitle" className="font-body-large font-[number:var(--body-large-font-weight)] text-colors-neutral-600 text-[length:var(--body-large-font-size)] tracking-[var(--body-large-letter-spacing)] leading-[var(--body-large-line-height)]">
              {subtitle}
            </EditableElement>
          </div>

          {/* Contact card */}
          <a href="#contact" className="flex items-center justify-between w-full p-4 md:p-6 bg-colors-translucent-dark-2 rounded-3xl hover:bg-colors-translucent-dark-8 transition-colors">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-[#c9f355] shrink-0">
                <img className="w-full h-full object-cover" alt="Support" src={contactImage} />
              </div>
              <div className="flex flex-col">
                <span className="font-body-regular text-colors-neutral-600">{contactText}</span>
                <span className="font-body-extra-large-m font-[number:var(--body-extra-large-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-extra-large-m-font-size)]">{contactLabel}</span>
              </div>
            </div>
            <img className="w-5 h-5" alt="" src="https://c.animaapp.com/gD1ZRAUQ/img/icon.svg" aria-hidden="true" />
          </a>
        </div>

        {/* Right: FAQ accordion */}
        <SortableWrapper>
          <div className="flex flex-col w-full lg:max-w-[820px] gap-2">
            {faqs.map((faq, index) => (
              <div key={index} {...getItemProps(index)}>
                <button
                  className="flex items-center justify-between w-full py-4 px-5 rounded-2xl hover:bg-colors-translucent-dark-2 transition-colors cursor-pointer text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
                >
                  <EditableInline sectionId={sectionId} path={`faqs.${index}.question`} className="font-body-extra-large-b font-[number:var(--body-extra-large-b-font-weight)] text-colors-neutral-800 text-[length:var(--body-extra-large-b-font-size)] tracking-[var(--body-extra-large-b-letter-spacing)] leading-[var(--body-extra-large-b-line-height)]">
                    {faq.question}
                  </EditableInline>
                  <ChevronDown className={`w-5 h-5 text-colors-neutral-600 transition-transform shrink-0 ml-4 ${openIndex === index ? 'rotate-180' : ''}`} />
                </button>
                {openIndex === index && faq.answer && (
                  <div className="px-5 pb-4 text-colors-neutral-600 font-body-regular">
                    {faq.answer}
                  </div>
                )}
                {index < faqs.length - 1 && (
                  <div className="w-full h-px bg-colors-translucent-dark-8" role="separator" />
                )}
              </div>
            ))}
          </div>
        </SortableWrapper>
      </div>
    </section>
  );
};

export default V2CareerFaqSection;
