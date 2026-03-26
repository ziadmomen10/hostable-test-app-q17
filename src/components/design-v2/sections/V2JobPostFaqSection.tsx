import React, { useState } from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface FaqItem {
  id: string;
  question: string;
  answer?: string;
}

interface V2JobPostFaqSectionProps {
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

export const V2JobPostFaqSection: React.FC<V2JobPostFaqSectionProps> = ({ data, sectionId }) => {
  const { items: faqs, getItemProps, SortableWrapper } = useArrayItems<FaqItem>(
    'faqs',
    data?.faqs ?? []
  );

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const title = data?.title ?? 'Frequently Asked\nQuestions';
  const subtitle = data?.subtitle ?? 'Get clear answers about our career openings.';
  const contactText = data?.contactText ?? 'Still got questions?';
  const contactLabel = data?.contactLabel ?? 'Reach Out to Us';
  const contactImage = data?.contactImage ?? 'https://c.animaapp.com/09apcVRN/img/main@2x.png';

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full relative bg-colors-neutral-25" aria-labelledby="v2-job-post-faq-heading">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-10 py-[80px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
        {/* Left: title + contact card */}
        <div className="w-full lg:w-[480px] xl:w-[560px] flex flex-col items-start gap-10 shrink-0">
          <div className="flex flex-col items-start gap-3 w-full">
            <EditableElement
              as="h2"
              id="v2-job-post-faq-heading"
              sectionId={sectionId}
              path="title"
              className="font-['Satoshi',Helvetica] font-medium text-colors-neutral-800 text-[40px] xl:text-[48px] tracking-[-0.02em] leading-[1.25] whitespace-pre-line"
            >
              {title}
            </EditableElement>

            <EditableInline
              sectionId={sectionId}
              path="subtitle"
              className="font-['Satoshi',Helvetica] font-normal text-colors-neutral-500 text-lg tracking-[0] leading-[1.6]"
            >
              {subtitle}
            </EditableInline>
          </div>

          {/* Contact card */}
          <a
            href="#contact"
            className="flex h-[104px] items-center justify-between px-6 py-4 w-full bg-colors-translucent-dark-2 rounded-3xl hover:bg-colors-translucent-dark-4 transition-colors cursor-pointer"
            aria-label="Still got questions? Reach out to us"
          >
            <div className="inline-flex items-center gap-5">
              <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-[#c9f355]" />
                <img
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Support representative"
                  src={contactImage}
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <EditableInline
                  sectionId={sectionId}
                  path="contactText"
                  className="font-['Satoshi',Helvetica] font-normal text-colors-neutral-500 text-base tracking-[0] leading-[1.5]"
                >
                  {contactText}
                </EditableInline>
                <EditableInline
                  sectionId={sectionId}
                  path="contactLabel"
                  className="font-['Satoshi',Helvetica] font-bold text-colors-neutral-800 text-xl tracking-[0] leading-[1.4]"
                >
                  {contactLabel}
                </EditableInline>
              </div>
            </div>
            <img className="w-5 h-5 shrink-0" alt="" src="https://c.animaapp.com/09apcVRN/img/icon.svg" aria-hidden="true" />
          </a>
        </div>

        {/* Right: FAQ items */}
        <SortableWrapper>
          <div className="flex flex-col items-start w-full lg:max-w-[820px]">
            {faqs.map((item, index) => (
              <div key={item.id} {...getItemProps(index)} className="w-full">
                <button
                  className="flex items-center justify-between w-full py-5 px-5 rounded-2xl hover:bg-colors-translucent-dark-2 transition-colors cursor-pointer text-left"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <EditableInline
                    sectionId={sectionId}
                    path={`faqs.${index}.question`}
                    className="font-['Satoshi',Helvetica] font-bold text-colors-neutral-800 text-lg tracking-[0] leading-[1.4]"
                  >
                    {item.question}
                  </EditableInline>
                  <img className="w-5 h-5 shrink-0 ml-4" alt="" src="https://c.animaapp.com/09apcVRN/img/icon-9.svg" aria-hidden="true" />
                </button>

                {openIndex === index && item.answer && (
                  <div id={`faq-answer-${item.id}`} className="px-5 pb-5">
                    <p className="font-['Satoshi',Helvetica] font-normal text-colors-neutral-600 text-base tracking-[0] leading-[1.7]">
                      {item.answer}
                    </p>
                  </div>
                )}

                {index < faqs.length - 1 && (
                  <div className="mx-5 h-px bg-colors-translucent-dark-8" role="separator" />
                )}
              </div>
            ))}
          </div>
        </SortableWrapper>
      </div>
    </section>
  );
};

export default V2JobPostFaqSection;
