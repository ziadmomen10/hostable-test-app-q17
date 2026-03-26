/**
 * Steps Section
 * Numbered step-by-step process guide with icons
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { StepsSectionData, StepItem } from '@/types/newSectionTypes';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';
import { useI18n } from '@/contexts/I18nContext';
import type { ElementPosition } from '@/types/reactEditor';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

interface StepItemWithPosition extends StepItem {
  position?: ElementPosition;
}

interface StepsSectionProps {
  data?: StepsSectionData & { steps?: StepItemWithPosition[] };
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultData: StepsSectionData & { steps: StepItemWithPosition[] } = {
  badge: 'HOW IT WORKS',
  title: 'Get Started in 3 Simple Steps',
  subtitle: 'From signup to live website in minutes',
  layout: 'horizontal',
  steps: [
    { 
      number: 1, 
      title: 'Choose Your Plan', 
      description: 'Select the hosting plan that fits your needs and budget',
      icon: '📋'
    },
    { 
      number: 2, 
      title: 'Setup Your Account', 
      description: 'Quick registration with instant account activation',
      icon: '⚙️'
    },
    { 
      number: 3, 
      title: 'Launch Your Site', 
      description: 'Deploy your website with our one-click installer',
      icon: '🚀'
    },
  ],
};

const StepsSection: React.FC<StepsSectionProps> = ({ data = defaultData, sectionId, isEditing = false, styleOverrides, layoutProps }) => {
  const isHorizontal = data.layout === 'horizontal';
  const steps = (data.steps || []) as StepItemWithPosition[];
  const gapClass = getGapClass(layoutProps?.gap);
  const { isRTL } = useI18n();
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('steps', steps);
  
  // Build inline styles from styleOverrides
  const inlineStyles: React.CSSProperties = {};
  if (styleOverrides?.background?.type === 'solid' && styleOverrides.background.color) {
    inlineStyles.backgroundColor = styleOverrides.background.color;
  } else if (styleOverrides?.background?.type === 'gradient' && styleOverrides.background.gradient) {
    const { start, end, angle } = styleOverrides.background.gradient;
    inlineStyles.background = `linear-gradient(${angle}deg, ${start}, ${end})`;
  }
  if (styleOverrides?.padding?.desktop) {
    inlineStyles.paddingTop = styleOverrides.padding.desktop.top;
    inlineStyles.paddingBottom = styleOverrides.padding.desktop.bottom;
  }

  return (
    <section 
      className="py-20 bg-gradient-to-br from-dark-bg to-dark-bg-light"
      data-section="steps"
      style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
    >
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-16 ${isRTL ? 'text-right' : 'text-center'}`}>
          {data.badge && (
            <EditableInline
              sectionId={sectionId}
              path="badge"
              type="text"
              className="text-sm font-semibold uppercase tracking-wider text-primary"
            >
              <RichTextRenderer content={data.badge} />
            </EditableInline>
          )}
          <EditableElement
            as="h2"
            sectionId={sectionId}
            path="title"
            type="text"
            className="text-3xl lg:text-4xl font-bold text-white mt-2"
            isEmpty={!data.title}
            placeholder="Section Title"
          >
            <RichTextRenderer content={data.title || ''} />
          </EditableElement>
          {data.subtitle && (
            <EditableElement
              as="p"
              sectionId={sectionId}
              path="subtitle"
              type="text"
              className={`text-white/70 mt-4 max-w-2xl ${isRTL ? 'mr-0' : 'mx-auto'}`}
              isEmpty={!data.subtitle}
              placeholder="Section subtitle"
            >
              <RichTextRenderer content={data.subtitle} />
            </EditableElement>
          )}
        </div>

        {/* Steps - SortableWrapper handles DnD context automatically */}
        {steps.length > 0 && (
          <SortableWrapper>
            <div 
              className={`relative ${isHorizontal 
                ? `flex flex-col lg:flex-row justify-between items-start ${gapClass || 'gap-8 lg:gap-4'}` 
                : `max-w-2xl ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'} ${gapClass || 'space-y-8'}`}`}
              style={isHorizontal && isRTL ? { direction: 'rtl' } : undefined}
            >
              {/* Connector line (horizontal layout) */}
              {isHorizontal && steps.length > 1 && (
                <div 
                  className={`hidden lg:block absolute top-10 h-0.5 z-0 ${isRTL ? 'bg-gradient-to-l right-[15%] left-[15%]' : 'bg-gradient-to-r left-[15%] right-[15%]'} from-primary to-primary/50`}
                />
              )}

              {steps.map((step, index) => (
                <SortableItem
                  key={`${sectionId}-steps-${index}`}
                  {...getItemProps(index)}
                  className={isHorizontal ? 'flex-1' : ''}
                >
                  <div 
                    className={`relative z-10 ${isHorizontal ? 'text-center' : 'flex gap-6'}`}
                    style={isRTL && !isHorizontal ? { flexDirection: 'row-reverse' } : undefined}
                  >
                    {/* Step number circle */}
                    <div 
                      className={`${isHorizontal ? 'mx-auto' : ''} w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shrink-0 bg-gradient-to-br from-primary to-primary/80 shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.4)]`}
                    >
                    {step.icon && ICON_MAP[step.icon] ? (
                        React.createElement(ICON_MAP[step.icon], { 
                          className: 'w-8 h-8 text-dark-bg'
                        })
                      ) : step.icon ? (
                        <span className="text-3xl">{step.icon}</span>
                      ) : (
                        <span className="text-2xl font-bold text-dark-bg">{step.number}</span>
                      )}
                    </div>

                    {/* Step content */}
                    <div className={isHorizontal ? '' : `pt-2 ${isRTL ? 'text-right' : ''}`}>
                      <div 
                        className="flex items-center gap-2 mb-2"
                        style={isHorizontal ? { justifyContent: 'center' } : undefined}
                      >
                        <span 
                          className="text-sm font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary"
                        >
                          Step {step.number}
                        </span>
                      </div>
                      <EditableElement
                        as="h3"
                        sectionId={sectionId}
                        path={`steps.${index}.title`}
                        type="text"
                        className="text-xl font-bold text-white mb-2"
                        isEmpty={!step.title}
                        placeholder="Step title"
                      >
                        <RichTextRenderer content={step.title || ''} />
                      </EditableElement>
                      <EditableElement
                        as="p"
                        sectionId={sectionId}
                        path={`steps.${index}.description`}
                        type="text"
                        className="text-white/60"
                        isEmpty={!step.description}
                        placeholder="Step description"
                      >
                        <RichTextRenderer content={step.description || ''} />
                      </EditableElement>
                    </div>

                    {/* Vertical connector line */}
                    {!isHorizontal && index < steps.length - 1 && (
                      <div 
                        className={`absolute top-24 w-0.5 h-full -z-10 bg-primary/30 ${isRTL ? 'right-10' : 'left-10'}`}
                      />
                    )}
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableWrapper>
        )}
      </div>
    </section>
  );
};

export default StepsSection;
