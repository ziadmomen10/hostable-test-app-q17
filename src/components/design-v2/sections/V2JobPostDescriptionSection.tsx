import React from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface DescriptionItem {
  id: string;
  title: string;
  content: string;
  hasHighlight: boolean;
}

interface ContactDetailItem {
  id: string;
  icon: string;
  text: string;
}

interface V2JobPostDescriptionSectionProps {
  data?: {
    applyText?: string;
    shareText?: string;
    sections?: DescriptionItem[];
    contactItems?: ContactDetailItem[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

/** Render content: if it contains newlines, render as bullet list; otherwise as paragraphs */
const ContentRenderer: React.FC<{ content: string; className: string }> = ({ content, className }) => {
  const lines = content.split('\n').filter(Boolean);
  if (lines.length <= 1) {
    return <p className={className}>{content}</p>;
  }
  return (
    <ul className="flex flex-col gap-[var(--spacing-2x)] list-none p-0 m-0">
      {lines.map((line, i) => (
        <li key={i} className="flex items-start gap-[var(--spacing-2x)]">
          <span className="text-colors-neutral-600 mt-[2px] shrink-0">•</span>
          <span className={className}>{line.replace(/^[-•]\s*/, '')}</span>
        </li>
      ))}
    </ul>
  );
};

export const V2JobPostDescriptionSection: React.FC<V2JobPostDescriptionSectionProps> = ({ data, sectionId }) => {
  const { items: sections, getItemProps, SortableWrapper } = useArrayItems<DescriptionItem>(
    'sections',
    data?.sections ?? []
  );

  const applyText = data?.applyText ?? 'Apply Now';
  const shareText = data?.shareText ?? 'Share Job';
  const contactItems = data?.contactItems ?? [];

  return (
    <section className="w-full relative bg-colors-neutral-25">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col items-center gap-[var(--spacing-15x)] py-[80px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
        <SortableWrapper>
          <div className="flex flex-col items-start gap-[var(--spacing-15x)] w-full max-w-[960px]">
            {sections.map((section, index) => (
              <article
                key={section.id}
                {...getItemProps(index)}
                className="flex flex-col w-full items-start gap-[var(--spacing-4x)] relative flex-[0_0_auto]"
              >
                <EditableElement
                  as="h2"
                  sectionId={sectionId}
                  path={`sections.${index}.title`}
                  className="relative self-stretch mt-[-1.00px] font-['Satoshi',_Helvetica] font-bold text-colors-neutral-800 text-[20px] sm:text-[24px] tracking-[0] leading-[1.35]"
                >
                  {section.title}
                </EditableElement>

                {section.hasHighlight ? (
                  <div className="relative self-stretch flex rounded-lg overflow-hidden">
                    <div className="w-1 shrink-0 bg-colors-translucent-dark-8" />
                    <div className="flex-1 bg-colors-translucent-dark-2 py-[var(--spacing-4x)] pl-4 sm:pl-[var(--spacing-6x)] pr-3 sm:pr-[var(--spacing-5x)]">
                      <ContentRenderer
                        content={section.content}
                        className="font-['Satoshi',_Helvetica] font-normal text-colors-neutral-600 text-[16px] tracking-[0] leading-[1.75]"
                      />
                    </div>
                  </div>
                ) : (
                  <EditableElement
                    as="div"
                    sectionId={sectionId}
                    path={`sections.${index}.content`}
                    className="relative self-stretch font-['Satoshi',_Helvetica] font-normal text-colors-neutral-600 text-[16px] tracking-[0] leading-[1.75] whitespace-pre-line"
                  >
                    {section.content}
                  </EditableElement>
                )}
              </article>
            ))}
          </div>
        </SortableWrapper>

        <div className="flex flex-col items-stretch sm:items-center gap-[var(--spacing-5x)] relative flex-[0_0_auto] mt-[var(--spacing-10x)] w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-[var(--spacing-4x)] w-full sm:w-auto">
            <button
              className="all-[unset] box-border items-center justify-center gap-[var(--spacing-2x)] py-5 px-8 bg-[#c9f355] rounded-2xl overflow-hidden inline-flex relative flex-[0_0_auto] cursor-pointer hover:opacity-90 transition-opacity w-full sm:w-auto"
              type="button"
            >
              <EditableInline
                sectionId={sectionId}
                path="applyText"
                className="relative w-fit mt-[-1.00px] font-['Satoshi',_Helvetica] font-bold text-colors-neutral-800 text-base tracking-[0] leading-[1.1] whitespace-nowrap"
              >
                {applyText}
              </EditableInline>
              <img className="relative w-5 h-5" alt="" src="https://c.animaapp.com/LOY1mjyd/img/icon.svg" aria-hidden="true" />
            </button>

            <button
              className="all-[unset] box-border items-center justify-center gap-[var(--spacing-2x)] py-5 px-8 bg-colors-neutral-800 rounded-2xl overflow-hidden inline-flex relative flex-[0_0_auto] cursor-pointer hover:opacity-90 transition-opacity w-full sm:w-auto"
              type="button"
            >
              <EditableInline
                sectionId={sectionId}
                path="shareText"
                className="relative w-fit mt-[-1.00px] font-['Satoshi',_Helvetica] font-bold text-colors-neutral-25 text-base tracking-[0] leading-[1.1] whitespace-nowrap"
              >
                {shareText}
              </EditableInline>
              <img className="relative w-5 h-5" alt="" src="https://c.animaapp.com/LOY1mjyd/img/icon-1.svg" aria-hidden="true" />
            </button>
          </div>

          {contactItems.length > 0 && (
            <address className="flex flex-col sm:flex-row items-center gap-3 sm:gap-[var(--spacing-4x)] py-4 px-5 sm:py-5 sm:px-8 relative flex-[0_0_auto] bg-colors-translucent-dark-2 rounded-2xl not-italic w-full sm:w-auto">
              {contactItems.map((contact, index) => (
                <React.Fragment key={contact.id}>
                  {index > 0 && (
                    <img
                      className="relative w-px h-6 object-cover"
                      alt=""
                      src="https://c.animaapp.com/LOY1mjyd/img/line.svg"
                      aria-hidden="true"
                    />
                  )}
                  <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                    <img className="relative w-4 h-4" alt="" src={contact.icon} />
                    <EditableInline
                      sectionId={sectionId}
                      path={`contactItems.${index}.text`}
                      className="relative w-fit mt-[-1.00px] font-['Satoshi',_Helvetica] font-normal text-colors-neutral-800 text-sm tracking-[0] leading-[1.2]"
                    >
                      {contact.text}
                    </EditableInline>
                  </div>
                </React.Fragment>
              ))}
            </address>
          )}
        </div>
      </div>
    </section>
  );
};

export default V2JobPostDescriptionSection;
