import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import LegalContentRenderer from '@/components/design-v2/legal/LegalContentRenderer';
import { useLegalSection } from '@/hooks/useLegalSection';
import type { LegalLayoutSectionData } from '@/types/newSectionTypes';

interface LegalLayoutSectionProps {
  data?: LegalLayoutSectionData;
  sectionId?: string;
  isEditing?: boolean;
}

export const LegalLayoutSection: React.FC<LegalLayoutSectionProps> = ({ data, sectionId }) => {
  const {
    items,
    activeSlug,
    activeItem,
    displayIndex,
    sections,
    defaultSubtitle,
    handleItemClick,
    getItemProps,
    SortableWrapper,
  } = useLegalSection(data, sectionId);

  return (
    <section className="w-full relative">
      {/* Dark Header Section - title embedded with the active item */}
      <div className="w-full bg-colors-neutral-800 text-white">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[240px] h-[220px] lg:h-[260px] flex flex-col items-center justify-center py-12 lg:py-16 overflow-hidden">
          <EditableElement
            as="h1"
            key={`header-${activeSlug}`}
            sectionId={sectionId}
            path={`items.${displayIndex}.title`}
            className="font-[Satoshi] text-[48px] font-medium leading-[126%] text-white text-center mb-4"
          >
            {activeItem?.title}
          </EditableElement>
          {(activeItem?.subtitle ?? defaultSubtitle) && (
            <EditableElement
              as="p"
              key={`subtitle-${activeSlug}`}
              sectionId={sectionId}
              path={`items.${displayIndex}.subtitle`}
              className={`text-sm lg:text-base text-gray-300 text-center mx-auto ${activeSlug === 'privacy-policy' ? 'max-w-5xl' : 'max-w-3xl'}`}
              placeholder={defaultSubtitle}
            >
              {activeItem?.subtitle ?? defaultSubtitle}
            </EditableElement>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full bg-colors-neutral-25">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[240px] py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Sidebar Navigation */}
            <aside className="w-full lg:w-1/4 lg:sticky lg:top-8 lg:self-start">
              <SortableWrapper>
                <nav className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <span className="px-6 pt-4 pb-2 text-sm font-semibold text-colors-neutral-800">General</span>
                  <div className="flex flex-col gap-1 p-2 pt-0">
                  {items.length > 0 ? items.map((item, index) => {
                    const isActive = item.slug === activeSlug;
                    const itemDndProps = getItemProps(index);
                    
                    return (
                      <button
                        key={item.id}
                        {...itemDndProps}
                        type="button"
                        onClickCapture={() => handleItemClick(item.slug)}
                        className={`
                          w-full text-left px-4 py-3 rounded-md transition-all duration-200 font-[Satoshi] text-[16px] font-normal leading-[175%] cursor-pointer
                          ${isActive 
                            ? 'bg-colors-primary-50 text-colors-primary-700 font-medium' 
                            : 'text-[#262626] hover:bg-gray-50'
                          }
                        `}
                      >
                        <EditableInline
                          sectionId={sectionId}
                          path={`items.${index}.label`}
                          className="block"
                        >
                          {item.label}
                        </EditableInline>
                      </button>
                    );
                  }) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No items yet. Add items in the settings panel.
                    </div>
                  )}                  </div>                </nav>
              </SortableWrapper>
            </aside>

            {/* Right Content Area */}
            <main className="flex-1 w-full lg:w-3/4">
              {activeItem ? (
                <article 
                  key={`article-${activeSlug}-${displayIndex}`}
                  className=""
                >
                  {sections && sections.length > 0 ? (
                    <LegalContentRenderer 
                      sections={sections}
                      sectionId={sectionId}
                      itemIndex={displayIndex}
                      boldNestedTitles={activeSlug === 'cookie-policy'}
                    />
                  ) : !activeItem.content && (
                    <p className="text-gray-500 italic">No content available. Add content in the settings panel.</p>
                  )}
                  {activeItem.content && (
                    <EditableElement
                      as="div"
                      sectionId={sectionId}
                      path={`items.${displayIndex}.content`}
                      className="text-base text-colors-neutral-600 leading-[1.75] whitespace-pre-wrap mt-6"
                    >
                      {activeItem.content}
                    </EditableElement>
                  )}
                </article>
              ) : (
                <div>
                  <p className="text-gray-500">No content available. Add items in the settings panel.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalLayoutSection;
