import React from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface Value2Item {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface V2CareerValues2SectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    image?: string;
    values?: Value2Item[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2CareerValues2Section: React.FC<V2CareerValues2SectionProps> = ({ data, sectionId }) => {
  const badge = data?.badge ?? '4 PRINCIPLES';
  const title = data?.title ?? 'Our Core Values';
  const subtitle = data?.subtitle ?? "We don't just host data; we empower the people who build it. Our culture is built on a foundation of speed, security, and a relentless drive to simplify the digital world for our global community.";
  const image = data?.image ?? 'https://c.animaapp.com/kkRHn6VJ/img/sole.png';

  const { items: values, getItemProps, SortableWrapper } = useArrayItems<Value2Item>(
    'values',
    data?.values ?? []
  );

  return (
    <section className="w-full relative bg-colors-neutral-25" aria-labelledby="v2-career-values2-heading">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-[120px] py-10 md:py-16 lg:py-[120px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[240px]">
        {/* Left: decorative image */}
        <figure className="relative w-full lg:w-[640px] aspect-square rounded-[25px] overflow-hidden shrink-0">
          <img className="absolute inset-0 w-full h-full object-cover" alt="Team culture" src={image} />
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <img className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" src="https://c.animaapp.com/kkRHn6VJ/img/main.png" />
          </div>
        </figure>

        {/* Right: header + values grid */}
        <div className="flex flex-col items-start gap-8 md:gap-10 w-full lg:max-w-[680px]">
          <header className="flex flex-col items-start gap-5 w-full">
            <div className="flex flex-col items-start gap-5">
              <EditableInline sectionId={sectionId} path="badge" className="inline-flex items-center gap-2 py-0.5 px-4 bg-colors-primary-700 rounded-[99px] font-body-small-b font-[number:var(--body-small-b-font-weight)] text-colors-neutral-25 text-[length:var(--body-small-b-font-size)] tracking-[var(--body-small-b-letter-spacing)] leading-[var(--body-small-b-line-height)]">
                {badge}
              </EditableInline>

              <EditableElement
                as="h2"
                id="v2-career-values2-heading"
                sectionId={sectionId}
                path="title"
                className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-[color:var(--colors-secondary-900)] text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)]"
              >
                {title}
              </EditableElement>
            </div>

            <EditableElement as="p" sectionId={sectionId} path="subtitle" className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)]">
              {subtitle}
            </EditableElement>
          </header>

          <SortableWrapper>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 w-full">
              {values.map((value, index) => (
                <article key={value.id} {...getItemProps(index)} className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-3 w-full">
                    <img className="w-5 h-5" alt="" src={value.icon} aria-hidden="true" />
                    <EditableInline sectionId={sectionId} path={`values.${index}.title`} className="font-body-regular-m font-[number:var(--body-regular-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-regular-m-font-size)] tracking-[var(--body-regular-m-letter-spacing)] leading-[var(--body-regular-m-line-height)]">
                      {value.title}
                    </EditableInline>
                  </div>
                  <div className="pl-8">
                    <EditableElement as="p" sectionId={sectionId} path={`values.${index}.description`} className="font-body-small font-[number:var(--body-small-font-weight)] text-colors-neutral-600 text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)]">
                      {value.description}
                    </EditableElement>
                  </div>
                </article>
              ))}
            </div>
          </SortableWrapper>
        </div>
      </div>
    </section>
  );
};

export default V2CareerValues2Section;
