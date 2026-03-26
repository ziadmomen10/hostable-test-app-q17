import React from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { Badge } from '@/components/ui/badge';

interface PaymentMethodItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface V2AffiliatePaymentMethodsSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    methods?: PaymentMethodItem[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2AffiliatePaymentMethodsSection: React.FC<V2AffiliatePaymentMethodsSectionProps> = ({ data, sectionId }) => {
  const badge = data?.badge ?? 'PAYMENT METHODS';
  const title = data?.title ?? 'Flexible Payments.\nGlobal Reach.';
  const subtitle = data?.subtitle ?? 'Every Guide is trained and excited to work with you, whether you need help with a password reset or you\'re looking for a team to build your complete web presence.';

  const { items: methods, getItemProps, SortableWrapper } = useArrayItems<PaymentMethodItem>(
    'methods',
    data?.methods ?? []
  );

  return (
    <section className="w-full relative bg-colors-neutral-25">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row items-center justify-between lg:justify-center gap-10 lg:gap-[80px] py-16 md:py-[120px] px-4 sm:px-6 md:px-12 lg:px-[240px] lg:pb-[60px]">
        {/* Right: Header Content - appears first on mobile, second on desktop */}
        <header className="flex flex-col items-start gap-4 w-full lg:max-w-[650px] order-1 lg:order-2">
          {badge && (
            <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-colors-primary-700 rounded-full border-0 hover:bg-colors-primary-700">
              <EditableInline 
                sectionId={sectionId} 
                path="badge" 
                className="font-['Satoshi'] text-[14px] font-bold leading-[174%] text-white uppercase"
              >
                {badge}
              </EditableInline>
            </Badge>
          )}

          <EditableElement 
            as="h2" 
            sectionId={sectionId} 
            path="title" 
            className="font-['Satoshi'] text-[48px] font-medium leading-[126%] text-colors-neutral-800 whitespace-pre-line"
          >
            {title}
          </EditableElement>

          <EditableElement 
            as="p" 
            sectionId={sectionId} 
            path="subtitle" 
            className="font-['Satoshi'] text-[16px] font-normal leading-[175%] text-colors-neutral-600"
          >
            {subtitle}
          </EditableElement>
        </header>

        {/* Left: Payment Methods Grid (2x2) - appears second on mobile, first on desktop */}
        <SortableWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-x-[40px] lg:gap-y-[80px] w-full lg:max-w-[540px] order-2 lg:order-1">
            {methods.map((method, index) => (
              <article
                key={method.id}
                {...getItemProps(index)}
                className="flex flex-col items-start gap-4 pb-6 border-b border-colors-neutral-200 last:border-b-0 md:border-b-0 md:pb-0 lg:w-[330px] lg:h-[136px]"
              >
                <div className="w-20 h-20 flex items-center justify-center rounded-xl p-2 -ml-2" dir="ltr">
                  <img 
                    className="w-full h-full object-contain"
                    alt="" 
                    src={method.icon || '/lovable-uploads/payment/icon-paypal.png'} 
                    aria-hidden="true"
                  />
                </div>
                
                <div className="flex flex-col items-start gap-2 w-full">
                  <EditableInline 
                    sectionId={sectionId} 
                    path={`methods.${index}.title`} 
                    className="font-['Satoshi'] text-[18px] font-medium leading-[175%] text-colors-neutral-800"
                  >
                    {method.title}
                  </EditableInline>
                  
                  <EditableElement 
                    as="p" 
                    sectionId={sectionId} 
                    path={`methods.${index}.description`} 
                    className="font-['Satoshi'] text-[16px] font-normal leading-[175%] text-colors-neutral-600"
                  >
                    {method.description}
                  </EditableElement>
                </div>
              </article>
            ))}
          </div>
        </SortableWrapper>
      </div>
    </section>
  );
};

export default V2AffiliatePaymentMethodsSection;
