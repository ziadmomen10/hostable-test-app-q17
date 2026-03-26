import React from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ReviewItem {
  id: string;
  text: string;
  authorName: string;
  partnerLabel?: string;
}

interface V2AffiliateReviewsSectionProps {
  data?: {
    title?: string;
    rightImage?: string;
    footerImage?: string;
    reviews?: ReviewItem[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2AffiliateReviewsSection: React.FC<V2AffiliateReviewsSectionProps> = ({ data, sectionId }) => {
  const title = data?.title ?? 'Hear It From Our Partners';
  const rightImage = data?.rightImage ?? '/lovable-uploads/reviews/Main.png';
  const mobileImage = '/lovable-uploads/reviews/Main-mobile.png';
  const footerImage = data?.footerImage ?? '/lovable-uploads/reviews/Trustpilot Reviews-footer.png';
  const footerImageMobile = '/lovable-uploads/reviews/Trustpilot Reviews-mobile.png';
  const starIcon = '/lovable-uploads/reviews/Icon-stars.png';
  const authorAvatar = '/lovable-uploads/reviews/icon-lauren.png';

  const { items: reviews, getItemProps, SortableWrapper } = useArrayItems<ReviewItem>(
    'reviews',
    data?.reviews ?? []
  );

  // Take first 2 reviews for left column
  const displayReviews = reviews.slice(0, 2);

  return (
    <section className="w-full relative bg-colors-translucent-dark-2" aria-labelledby="v2-affiliate-reviews-heading">
      <div className="w-full max-w-[1920px] mx-auto py-[60px] px-4 sm:px-6 lg:py-[120px] lg:px-[240px]">
        {/* Section Title */}
        {title && (
          <header >
            <EditableElement
              as="h2"
              id="v2-affiliate-reviews-heading"
              sectionId={sectionId}
              path="title"
              className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)] text-center"
            >
              {title}
            </EditableElement>
          </header>
        )}

        {/* Reviews Grid */}
        <div className="mt-[60px]">
        <SortableWrapper>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-20 items-center justify-center">
            {/* Mobile Image - Shows first on mobile, hidden on desktop */}
            <div className="flex flex-col lg:hidden mb-4 w-full">
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <img
                  src={mobileImage}
                  alt="Partner testimonial"
                  className="w-full h-full object-cover"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Left Column: Reviews */}
            <div className="flex flex-col gap-[40px] w-full lg:w-[620px] lg:h-[570px] flex-shrink-0">
              {displayReviews.map((review, arrayIndex) => {
                const originalIndex = reviews.findIndex(r => r.id === review.id);
                return (
                  <Card
                    key={review.id}
                    {...getItemProps(originalIndex)}
                    role="article"
                    className="flex flex-col gap-0 p-[24px] lg:p-[40px] bg-white rounded-[24px] shadow-[0px_0px_80px_#0000000a] w-full lg:w-[620px] lg:h-[265px] border-0"
                  >
                      {/* Star Rating */}
                      <div className="flex items-center">
                        <img
                          src={starIcon}
                          alt=""
                          className="h-4 w-auto"
                          aria-hidden="true"
                        />
                      </div>

                      {/* Review Text */}
                      <p className="font-[Satoshi] text-[20px] font-normal leading-[178%] text-[#262626] mt-[10px]">
                        <EditableInline
                          sectionId={sectionId}
                          path={`reviews.${originalIndex}.text`}
                        >
                          {review.text}
                        </EditableInline>
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center justify-between mt-auto pt-[24px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={authorAvatar}
                            alt=""
                            className="w-12 h-12 rounded-full object-cover"
                            aria-hidden="true"
                          />
                          <EditableInline
                            sectionId={sectionId}
                            path={`reviews.${originalIndex}.authorName`}
                            className="font-[Satoshi] text-[16px] font-bold leading-[175%] text-[#262626]"
                          >
                            {review.authorName}
                          </EditableInline>
                        </div>
                        <Badge className="flex items-center justify-center gap-2 bg-colors-translucent-dark-4 rounded-2xl px-4 py-2 lg:px-3 lg:py-1.5 border-0 hover:bg-colors-translucent-dark-4">
                          <img
                            src="/lovable-uploads/reviews/Logo-hostonce.png"
                            alt="hostonce"
                            className="h-3 lg:h-4 object-contain flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-xs lg:text-sm tracking-[var(--body-regular-letter-spacing)] leading-none whitespace-nowrap">
                            <EditableInline
                              sectionId={sectionId}
                              path={`reviews.${originalIndex}.partnerLabel`}
                            >
                              {review.partnerLabel ?? 'Partner'}
                            </EditableInline>
                          </span>
                        </Badge>
                      </div>
                  </Card>
                );
              })}
            </div>

            {/* Right Column: Image - Hidden on mobile, shows on desktop */}
            <div  className="hidden lg:block w-[740px] h-[570px] rounded-[24px] overflow-hidden flex-shrink-0">
              <img
                src={rightImage}
                alt="Partner testimonial"
                className="w-full h-full object-cover"
                dir="ltr"
                
              />
            </div>
          </div>
        </SortableWrapper>
        </div>

        {/* Footer Trustpilot Banner */}
        {footerImage && (
          <div className="mt-[60px] flex justify-center">
            {/* Mobile Footer */}
            <img
              src={footerImageMobile}
              alt="Customer reviews"
              className="w-full lg:hidden h-auto"
              dir="ltr"
            />
            {/* Desktop Footer */}
            <img
              src={footerImage}
              alt="Customer reviews"
              className="hidden lg:block max-w-full h-auto"
              dir="ltr"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default V2AffiliateReviewsSection;
