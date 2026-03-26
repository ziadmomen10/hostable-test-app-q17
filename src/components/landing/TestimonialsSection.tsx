/**
 * Testimonials Section
 * Customer testimonials with ratings
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { ElementPosition } from '@/types/reactEditor';
import type { TestimonialsSectionProps, TestimonialItem } from '@/types/sectionProps';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

interface TestimonialItemWithPosition extends TestimonialItem {
  position?: ElementPosition;
}

const defaultTestimonials: TestimonialItemWithPosition[] = [
  {
    name: 'Sarah Johnson',
    role: 'E-commerce Owner',
    avatar: 'S',
    rating: 5,
    text: 'Switching to HostOnce was the best decision for my online store. Page loads are 3x faster and my sales have increased by 40%!',
  },
  {
    name: 'Michael Chen',
    role: 'Web Developer',
    avatar: 'M',
    rating: 5,
    text: 'The developer tools and SSH access make HostOnce perfect for my projects. Customer support is incredibly responsive too.',
  },
  {
    name: 'Emily Davis',
    role: 'Blogger',
    avatar: 'E',
    rating: 5,
    text: 'I was nervous about migrating my 5-year-old blog, but the team handled everything flawlessly. Zero downtime!',
  },
];

const TestimonialsSection = ({
  badge,
  title = "Don't Take Our Word For It",
  subtitle = 'See what our customers have to say about their experience with HostOnce.',
  testimonials = defaultTestimonials,
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}: TestimonialsSectionProps & { 
  sectionId?: string; 
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}) => {
  const testimonialItems = testimonials as TestimonialItemWithPosition[];
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('testimonials', testimonialItems);
  
  // Use layoutProps for grid configuration
  const columns = layoutProps?.columns ?? 3;
  const gridColsClass = getGridColsClass(columns);
  const gapClass = getGapClass(layoutProps?.gap);
  
  return (
    <SectionContainer variant="light" padding="lg" styleOverrides={styleOverrides}>
      <SectionHeader
        sectionId={sectionId}
        badge={badge}
        title={title}
        subtitle={subtitle}
        subtitleClassName="max-w-2xl"
      />

      {/* Testimonials Grid - SortableWrapper handles DnD context automatically */}
      <SortableWrapper>
        <div className={`grid ${gridColsClass} ${gapClass} relative`}>
          {testimonialItems.map((testimonial, index) => (
            <SortableItem
              key={`${sectionId}-testimonials-${index}`}
              {...getItemProps(index)}
            >
              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow h-full">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Text */}
                <EditableElement
                  as="p"
                  sectionId={sectionId}
                  path={`testimonials.${index}.text`}
                  className="text-foreground mb-6"
                  isEmpty={!testimonial.text}
                  placeholder="Testimonial text"
                >
                  <RichTextRenderer content={testimonial.text} />
                </EditableElement>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">
                      {testimonial.avatar || testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <EditableElement
                      as="p"
                      sectionId={sectionId}
                      path={`testimonials.${index}.name`}
                      className="font-semibold text-foreground"
                      isEmpty={!testimonial.name}
                      placeholder="Name"
                    >
                      <RichTextRenderer content={testimonial.name} />
                    </EditableElement>
                    <div className="text-sm text-muted-foreground">
                      <EditableInline
                        sectionId={sectionId}
                        path={`testimonials.${index}.role`}
                        isEmpty={!testimonial.role}
                        placeholder="Role"
                      >
                        <RichTextRenderer content={testimonial.role} />
                      </EditableInline>
                      {testimonial.company && (
                        <>
                          <span>, </span>
                          <EditableInline
                            sectionId={sectionId}
                            path={`testimonials.${index}.company`}
                          >
                            <RichTextRenderer content={testimonial.company} />
                          </EditableInline>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
};

export default TestimonialsSection;
