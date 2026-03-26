import React, { useState } from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface Faq2Item {
  id: string;
  question: string;
  answer?: string;
}

interface V2CareerFaq2SectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    contactText?: string;
    contactLabel?: string;
    contactImage?: string;
    faqs?: Faq2Item[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2CareerFaq2Section: React.FC<V2CareerFaq2SectionProps> = ({ data, sectionId }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const title = data?.title ?? 'Frequently Asked\nQuestions';
  const subtitle = data?.subtitle ?? 'Get clear answers about our career openings.';
  const contactText = data?.contactText ?? 'Still got questions?';
  const contactLabel = data?.contactLabel ?? 'Reach Out to Us';
  const contactImage = data?.contactImage ?? 'https://c.animaapp.com/kkRHn6VJ/img/main-1@2x.png';

  const { items: faqs, getItemProps, SortableWrapper } = useArrayItems<Faq2Item>(
    'faqs',
    data?.faqs ?? []
  );

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full relative bg-colors-neutral-25">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-10 pt-[60px] pb-[120px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[240px]">
        {/* Left: title + contact card */}
        <div className="w-full lg:w-[560px] flex flex-col items-start gap-10 shrink-0">
          <div className="flex flex-col items-start gap-2 w-full">
            <EditableElement as="h2" sectionId={sectionId} path="title" className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)] whitespace-pre-line">
              {title}
            </EditableElement>

            <EditableInline sectionId={sectionId} path="subtitle" className="font-body-large font-[number:var(--body-large-font-weight)] text-colors-neutral-600 text-[length:var(--body-large-font-size)] tracking-[var(--body-large-letter-spacing)] leading-[var(--body-large-line-height)]">
              {subtitle}
            </EditableInline>
          </div>

          {/* Contact card */}
          <a
            href="#contact"
            className="flex h-[104px] items-center justify-between px-6 py-4 w-full bg-colors-translucent-dark-2 rounded-3xl hover:bg-colors-translucent-dark-4 transition-colors cursor-pointer"
          >
            <div className="inline-flex items-center gap-6">
              <div className="relative w-[76px] h-[76px] rounded-[99px] overflow-hidden border-colors-translucent-light-24">
                <div className="absolute top-0 left-0 w-[72px] h-[100px] bg-[#c9f355]" />
                <img className="absolute top-0 left-0 w-[72px] h-[72px] aspect-[1] object-cover" alt="Customer support" src={contactImage} />
              </div>
              <div className="flex flex-col">
                <EditableInline sectionId={sectionId} path="contactText" className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]">
                  {contactText}
                </EditableInline>
                <EditableInline sectionId={sectionId} path="contactLabel" className="font-body-extra-large-m font-[number:var(--body-extra-large-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-extra-large-m-font-size)] tracking-[var(--body-extra-large-m-letter-spacing)] leading-[var(--body-extra-large-m-line-height)]">
                  {contactLabel}
                </EditableInline>
              </div>
            </div>
            <img className="w-5 h-[21px]" alt="" src="https://c.animaapp.com/kkRHn6VJ/img/icon-53.svg" aria-hidden="true" />
          </a>
        </div>

        {/* Right: FAQ items */}
        <SortableWrapper>
          <div className="flex flex-col items-start gap-[var(--spacing-2x)] w-full lg:max-w-[820px]">
            {faqs.map((item, index) => (
              <div key={item.id} {...getItemProps(index)}>
                <button
                  className="flex flex-col items-start gap-2 pt-4 pr-5 pb-4 pl-5 w-full rounded-2xl hover:bg-colors-translucent-dark-2 transition-colors cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <div className="flex items-center justify-between w-full">
                    <EditableInline sectionId={sectionId} path={`faqs.${index}.question`} className="font-body-extra-large-b font-[number:var(--body-extra-large-b-font-weight)] text-colors-neutral-800 text-[length:var(--body-extra-large-b-font-size)] tracking-[var(--body-extra-large-b-letter-spacing)] leading-[var(--body-extra-large-b-line-height)]">
                      {item.question}
                    </EditableInline>
                    <img className="w-5 h-5" alt="" src="https://c.animaapp.com/kkRHn6VJ/img/icon-62.svg" aria-hidden="true" />
                  </div>
                </button>

                {index < faqs.length - 1 && (
                  <div className="bg-colors-translucent-dark-8 w-full h-px" role="separator" />
                )}
              </div>
            ))}
          </div>
        </SortableWrapper>
      </div>
    </section>
  );
};

export default V2CareerFaq2Section;
