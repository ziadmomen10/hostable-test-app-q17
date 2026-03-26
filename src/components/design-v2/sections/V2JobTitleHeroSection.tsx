import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface V2JobDetailItem {
  icon: string;
  label: string;
  value: string;
}

interface V2JobTitleHeroSectionProps {
  data?: {
    title?: string;
    jobDetails?: V2JobDetailItem[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

const defaultJobDetails: V2JobDetailItem[] = [
  { icon: 'https://c.animaapp.com/L22lErDL/img/icon.svg', label: 'Location', value: 'Remote' },
  { icon: 'https://c.animaapp.com/L22lErDL/img/icon-1.svg', label: 'Commitment', value: 'Full-time' },
  { icon: 'https://c.animaapp.com/L22lErDL/img/icon-2.svg', label: 'Department', value: 'Executive Leadership' },
];

export const V2JobTitleHeroSection: React.FC<V2JobTitleHeroSectionProps> = ({ data, sectionId }) => {
  const title = data?.title ?? 'Business Development Manager';
  const jobDetails = data?.jobDetails ?? defaultJobDetails;

  return (
    <section className="w-full relative bg-colors-translucent-dark-2">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col items-center justify-center py-[80px]">
        <div className="inline-flex flex-col items-center gap-[var(--spacing-6x)]">
          <EditableElement
            as="h1"
            sectionId={sectionId}
            path="title"
            className="relative w-fit mt-[-1.00px] font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] text-center tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)] whitespace-nowrap [font-style:var(--heading-h2-font-style)]"
          >
            {title}
          </EditableElement>

          <div className="inline-flex items-center gap-[var(--spacing-8x)] relative flex-[0_0_auto]">
            {jobDetails.map((detail, index) => (
              <div key={index} className="inline-flex items-center gap-[var(--spacing-8x)]">
                <article className="inline-flex flex-col items-center relative flex-[0_0_auto] bg-colors-translucent-light-4 rounded-lg">
                  <div className="inline-flex items-center gap-[var(--spacing-2x)] relative flex-[0_0_auto]">
                    <img className="relative w-3 h-3" alt="" src={detail.icon} />
                    <EditableInline sectionId={sectionId} path={`jobDetails.${index}.label`} className="relative w-fit mt-[-1.00px] font-body-small-m font-[number:var(--body-small-m-font-weight)] text-colors-neutral-600 text-[length:var(--body-small-m-font-size)] tracking-[var(--body-small-m-letter-spacing)] leading-[var(--body-small-m-line-height)] whitespace-nowrap [font-style:var(--body-small-m-font-style)]">
                      {detail.label}
                    </EditableInline>
                  </div>
                  <EditableInline
                    sectionId={sectionId}
                    path={`jobDetails.${index}.value`}
                    className={`relative ${index === 2 ? 'w-[228px]' : 'w-fit'} font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] ${index === 2 ? '' : 'whitespace-nowrap'} [font-style:var(--heading-h4-font-style)]`}
                  >
                    {detail.value}
                  </EditableInline>
                </article>
                {index < jobDetails.length - 1 && (
                  <img className="relative w-px h-8 object-cover" alt="" src="https://c.animaapp.com/L22lErDL/img/line-1.svg" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default V2JobTitleHeroSection;
