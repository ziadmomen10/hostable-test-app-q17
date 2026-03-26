import React, { useState } from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface V2JobFaqItem {
  id: string;
  question: string;
  answer?: string;
}

interface V2JobFaqSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    contactText?: string;
    contactLabel?: string;
    contactImage?: string;
    faqs?: V2JobFaqItem[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

const defaultFaqs: V2JobFaqItem[] = [
  { id: '1', question: 'How Can I Apply for a Job at Ultahost?' },
  { id: '2', question: 'Does Ultahost Offer Remote or Hybrid Positions?' },
  { id: '3', question: "What's the Recruitment Process Like at Ultahost?" },
  { id: '4', question: 'Can I Apply for Multiple Positions at Once?' },
  { id: '5', question: 'Does Ultahost Offer Internships or Entry-level Opportunities?' },
  { id: '6', question: 'What Makes Ultahost a Great Place to Work?' },
  { id: '7', question: 'How many people work at Ultahost in 2025?' },
  { id: '8', question: 'Is It Necessary to Have a Web Hosting Plan to Use Private Email?' },
  { id: '9', question: 'What Salary Range Can I Expect at Ultahost?' },
];

export const V2JobFaqSection: React.FC<V2JobFaqSectionProps> = ({ data, sectionId }) => {
  const { items: faqs, getItemProps, SortableWrapper } = useArrayItems<V2JobFaqItem>(
    'faqs',
    data?.faqs ?? defaultFaqs
  );

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const title = data?.title ?? 'Frequently Asked\nQuestions';
  const subtitle = data?.subtitle ?? 'Get clear answers about our career openings.';
  const contactText = data?.contactText ?? 'Still got questions?';
  const contactLabel = data?.contactLabel ?? 'Reach Out to Us';
  const contactImage = data?.contactImage ?? 'https://c.animaapp.com/L22lErDL/img/main@2x.png';

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full relative bg-colors-neutral-25">
      <div className="w-full max-w-[1920px] mx-auto flex items-start justify-between pt-[var(--spacing-15x)] pr-[var(--spacing-60x)] pb-[var(--spacing-30x)] pl-[var(--spacing-60x)]">
        <div className="flex flex-col w-[560px] items-start gap-[var(--spacing-10x)] relative">
          <header className="justify-center gap-[var(--spacing-8-duplicate)] self-stretch w-full flex-[0_0_auto] flex flex-col items-start relative">
            <EditableElement as="h2" sectionId={sectionId} path="title" className="relative self-stretch mt-[-1.00px] font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)] [font-style:var(--heading-h2-font-style)] whitespace-pre-line">
              {title}
            </EditableElement>

            <EditableInline sectionId={sectionId} path="subtitle" className="relative w-fit font-body-large font-[number:var(--body-large-font-weight)] text-colors-neutral-600 text-[length:var(--body-large-font-size)] text-center tracking-[var(--body-large-letter-spacing)] leading-[var(--body-large-line-height)] whitespace-nowrap [font-style:var(--body-large-font-style)]">
              {subtitle}
            </EditableInline>
          </header>

          <div className="flex flex-col items-start gap-[var(--spacing-6x)] relative self-stretch w-full flex-[0_0_auto]">
            <a
              href="#contact"
              className="flex h-[104px] items-center justify-between pt-[var(--spacing-4x)] pr-[var(--spacing-6x)] pb-[var(--spacing-4x)] pl-[var(--spacing-6x)] relative self-stretch w-full bg-colors-translucent-dark-2 rounded-3xl hover:bg-colors-translucent-dark-4 transition-colors cursor-pointer"
              aria-label="Reach out to us for more questions"
            >
              <div className="inline-flex items-center gap-[var(--spacing-6x)] relative flex-[0_0_auto]">
                <div className="relative w-[76px] h-[76px] mt-[-2.00px] mb-[-2.00px] ml-[-2.00px] rounded-[99px] overflow-hidden border-colors-translucent-light-24">
                  <div className="absolute top-0 left-0 w-[72px] h-[100px] bg-[#c9f355]" />
                  <img
                    className="absolute top-0 left-0 w-[72px] h-[72px] aspect-[1] object-cover"
                    alt="Support representative"
                    src={contactImage}
                  />
                </div>

                <div className="w-[147px] flex flex-col items-start relative">
                  <EditableInline sectionId={sectionId} path="contactText" className="relative self-stretch mt-[-1.00px] font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] [font-style:var(--body-regular-font-style)]">
                    {contactText}
                  </EditableInline>
                  <EditableInline sectionId={sectionId} path="contactLabel" className="relative self-stretch font-body-extra-large-m font-[number:var(--body-extra-large-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-extra-large-m-font-size)] tracking-[var(--body-extra-large-m-letter-spacing)] leading-[var(--body-extra-large-m-line-height)] [font-style:var(--body-extra-large-m-font-style)]">
                    {contactLabel}
                  </EditableInline>
                </div>
              </div>

              <img
                className="relative w-5 h-[21px]"
                alt=""
                src="https://c.animaapp.com/L22lErDL/img/icon-13.svg"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <SortableWrapper>
          <div className="flex flex-col w-[820px] items-start gap-[var(--spacing-2x)] relative">
            {faqs.map((item, index) => (
              <div key={item.id} {...getItemProps(index)}>
                <button
                  className="flex flex-col items-start gap-[var(--spacing-8)] pt-[var(--spacing-16)] pr-[var(--spacing-20)] pb-[var(--spacing-16)] pl-[var(--spacing-20)] relative self-stretch w-full flex-[0_0_auto] rounded-2xl hover:bg-colors-translucent-dark-2 transition-colors cursor-pointer text-left"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`job-faq-answer-${index}`}
                >
                  <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                    <EditableInline sectionId={sectionId} path={`faqs.${index}.question`} className="relative w-fit mt-[-1.00px] font-body-extra-large-b font-[number:var(--body-extra-large-b-font-weight)] text-colors-neutral-800 text-[length:var(--body-extra-large-b-font-size)] tracking-[var(--body-extra-large-b-letter-spacing)] leading-[var(--body-extra-large-b-line-height)] whitespace-nowrap [font-style:var(--body-extra-large-b-font-style)]">
                      {item.question}
                    </EditableInline>
                    <img
                      className="relative w-5 h-5"
                      alt=""
                      src="https://c.animaapp.com/L22lErDL/img/icon-22.svg"
                      aria-hidden="true"
                    />
                  </div>
                </button>

                {index < faqs.length - 1 && (
                  <div className="relative self-stretch w-full h-px bg-colors-translucent-dark-8" />
                )}
              </div>
            ))}
          </div>
        </SortableWrapper>
      </div>
    </section>
  );
};

export default V2JobFaqSection;
