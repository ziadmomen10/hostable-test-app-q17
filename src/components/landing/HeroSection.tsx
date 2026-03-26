import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ArrowLeft, Globe, Server, Mail, HardDrive, Monitor, Laptop, CheckCircle } from 'lucide-react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { isRichTextJSON, extractPlainText } from '@/types/richText';
import { SectionContainer } from '@/components/landing/shared';
import { useI18n } from '@/contexts/I18nContext';
import type { ElementPosition } from '@/types/reactEditor';
import type { HeroSectionProps, HeroServiceItem } from '@/types/sectionProps';
import type { SectionStyleProps } from '@/types/elementSettings';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import { gapClasses } from '@/types/sectionSettings';

// Icon mapping for dynamic rendering
const iconMap: Record<string, React.ElementType> = {
  Laptop, Globe, Monitor, Mail, Server, HardDrive
};

interface HeroServiceItemWithPosition extends HeroServiceItem {
  position?: ElementPosition;
}

// Phase 4: Remove defaults - expose missing data in editor
const HeroSection = ({
  badge,
  title,
  highlightedText,
  subtitle,
  primaryButtonText,
  primaryButtonUrl,
  priceText,
  services,
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}: HeroSectionProps & { 
  sectionId?: string; 
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}) => {
  // Phase 4: Show editor placeholders for missing data instead of defaults
  const displayBadge = badge || (isEditing ? '[Click to edit badge]' : 'Powered by AI');
  const displayTitle = title || (isEditing ? '[Click to edit title]' : '20x Faster Web Hosting, Without Spending More');
  const displayHighlightedText = highlightedText || '20x Faster';
  const displaySubtitle = subtitle || (isEditing ? '[Click to edit subtitle]' : "Presenting Hostonce's super-fast yet affordable hosting.");
  const displayPrimaryButtonText = primaryButtonText || (isEditing ? '[Button text]' : 'See Plans & Pricing');
  const displayPrimaryButtonUrl = primaryButtonUrl || '#pricing';
  const displayPriceText = priceText || (isEditing ? '[Price]' : 'From $2.99/month');
  
  // Helper to get plain text for string operations (like includes)
  const getPlainText = (content: any): string => {
    if (typeof content === 'string') return content;
    if (isRichTextJSON(content)) return extractPlainText(content);
    return String(content || '');
  };
  
  const titlePlainText = getPlainText(displayTitle);
  
  // Use provided services or fallback for non-editor mode
  const serviceItems: HeroServiceItemWithPosition[] = services || (isEditing ? [] : [
    { icon: 'Laptop', label: 'AI Website Builder' },
    { icon: 'Globe', label: 'Domains' },
    { icon: 'Monitor', label: 'AI WordPress Builder and Hosting' },
    { icon: 'Mail', label: 'AI Powered Business Email' },
    { icon: 'Server', label: 'VPS Hosting' },
    { icon: 'HardDrive', label: 'Dedicated Hosting' },
    { icon: 'Server', label: 'VDS Hosting' },
  ]);
  
  const { SortableWrapper, getItemProps } = useArrayItems('services', serviceItems);
  const { isRTL } = useI18n();
  
  // RTL-aware arrow icon
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  
  return (
    <SectionContainer variant="dark" padding="none" className="relative overflow-hidden bg-dark-bg-light" styleOverrides={styleOverrides}>
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] ${isRTL ? 'left-0' : 'right-0'}`}></div>
        <div className={`absolute bottom-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] ${isRTL ? 'right-1/4' : 'left-1/4'}`}></div>
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className={`grid lg:grid-cols-2 gap-12 items-center min-h-[500px]`}>
          {/* Content - order changes for RTL */}
          <div className={`space-y-6 ${isRTL ? 'lg:order-2 text-right' : ''}`}>
            {/* Powered by AI Badge */}
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <Sparkles className="w-4 h-4 text-primary" />
              {isEditing && sectionId ? (
                <EditableInline
                  sectionId={sectionId}
                  path="badge"
                  className="text-primary text-sm font-medium"
                  isEmpty={!badge}
                  placeholder="[Click to edit badge]"
                >
                  <RichTextRenderer content={displayBadge} />
                </EditableInline>
              ) : (
                <span className="text-primary text-sm font-medium">
                  <RichTextRenderer content={displayBadge} />
                </span>
              )}
            </div>

            {/* Main Title - uses RichTextRenderer for formatted content */}
            <EditableElement
              as="h1"
              sectionId={sectionId}
              path="title"
              className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white"
              isEmpty={!title}
              placeholder="[Click to edit title]"
            >
              <RichTextRenderer content={displayTitle} />
            </EditableElement>

            {/* Subtitle */}
            <EditableElement
              as="p"
              sectionId={sectionId}
              path="subtitle"
              className="text-white/60 text-lg max-w-md"
              isEmpty={!subtitle}
              placeholder="[Click to edit subtitle]"
            >
              <RichTextRenderer content={displaySubtitle} />
            </EditableElement>

            {/* CTA Section */}
            <div className={`flex items-center gap-6 pt-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base rounded-full"
                asChild
              >
                {isEditing && sectionId ? (
                  <EditableElement
                    sectionId={sectionId}
                    path="primaryButtonText"
                    type="button"
                    isEmpty={!primaryButtonText}
                    placeholder="[Button text]"
                  >
                    <a href={displayPrimaryButtonUrl} className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {displayPrimaryButtonText}
                      <ArrowIcon className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                    </a>
                  </EditableElement>
                ) : (
                  <a href={displayPrimaryButtonUrl} className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {displayPrimaryButtonText}
                    <ArrowIcon className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </a>
                )}
              </Button>
              <div className="text-white/60">
                <span className="text-sm">*</span>
                {isEditing && sectionId ? (
                  <EditableInline
                    sectionId={sectionId}
                    path="priceText"
                    className="text-white text-2xl font-bold"
                    isEmpty={!priceText}
                    placeholder="[Price]"
                  >
                    <RichTextRenderer content={displayPriceText} />
                  </EditableInline>
                ) : (
                  <span className="text-white text-2xl font-bold">
                    <RichTextRenderer content={displayPriceText} />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Image Content - order changes for RTL */}
          <div className={`relative flex justify-center ${isRTL ? 'lg:order-1 lg:justify-start' : 'lg:justify-end'}`}>
            {/* Main Person Image with laptop mockup */}
            <div className="relative">
              {/* Browser window frame */}
              <div className="absolute top-0 right-8 w-[280px] h-[200px] bg-dark-card rounded-xl border border-dark-border-light overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-dark-bg border-b border-dark-border-light">
                  <div className="w-2.5 h-2.5 rounded-full bg-dark-border"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-dark-border"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-dark-border"></div>
                </div>
                <div className="p-4">
                  <div className="w-full h-3 bg-dark-border rounded mb-2"></div>
                  <div className="w-3/4 h-3 bg-dark-border rounded mb-4"></div>
                  <div className="w-full h-16 bg-dark-bg-light rounded"></div>
                </div>
              </div>

              {/* Person Image */}
              <img 
                src="/lovable-uploads/50dd7b41-18c0-4d53-9a51-4f9780b9d2c7.png" 
                alt="Professional using laptop" 
                className="w-full max-w-md mx-auto relative z-10"
              />

              {/* Floating Card - Uptime */}
              <div className="absolute top-4 right-0 bg-card rounded-xl p-3 shadow-2xl min-w-[100px]">
                <p className="text-muted-foreground text-xs mb-1">Uptime</p>
                <div className="flex items-center gap-2">
                  <span className="text-primary text-2xl font-bold">100%</span>
                  <div className="w-1 h-8 bg-primary rounded-full"></div>
                </div>
              </div>

              {/* Floating Card - Update product description */}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-card rounded-xl p-3 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-foreground" />
                  <span className="text-foreground text-sm font-medium">Update product description</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                </div>
              </div>

              {/* Floating Card - Site Speed */}
              <div className="absolute bottom-8 right-0 bg-card rounded-xl p-3 shadow-2xl min-w-[120px]">
                <p className="text-muted-foreground text-xs">Site Speed</p>
                <p className="text-muted-foreground text-[10px] mb-2">20s ago</p>
                <div className="relative">
                  <svg className="w-16 h-10" viewBox="0 0 100 50">
                    <path 
                      d="M 10 40 Q 30 35 50 30 T 90 15" 
                      fill="none" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-primary text-xl font-bold">99.84</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-20 left-20 text-primary/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="absolute bottom-32 right-20 text-primary/20">
                <div className="w-8 h-8 border-2 border-current rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Bar with SortableContext */}
      <EditableElement
        sectionId={sectionId}
        path="services"
        className="border-t border-dark-border bg-dark-bg"
        type="array-item"
      >
        <div className="container mx-auto px-4">
          <SortableWrapper>
            <div className={`flex items-center py-4 overflow-x-auto scrollbar-none relative ${gapClasses[layoutProps?.gap || 'default']}`}>
              <span className="text-muted-foreground text-sm whitespace-nowrap flex-shrink-0">hosting</span>
              {serviceItems.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Globe;
                return (
                  <SortableItem key={`${sectionId}-services-${index}`} {...getItemProps(index)}>
                    <div className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer whitespace-nowrap px-4">
                      <IconComponent className="w-4 h-4" />
                      {isEditing && sectionId ? (
                        <EditableInline
                          sectionId={sectionId}
                          path={`services.${index}.label`}
                          arrayPath="services"
                          index={index}
                          className="text-sm"
                          isEmpty={!service.label}
                          placeholder="[Label]"
                        >
                          <RichTextRenderer content={service.label} />
                        </EditableInline>
                      ) : (
                        <span className="text-sm">
                          <RichTextRenderer content={service.label} />
                        </span>
                      )}
                    </div>
                  </SortableItem>
                );
              })}
            </div>
          </SortableWrapper>
        </div>
      </EditableElement>
    </SectionContainer>
  );
};

export default HeroSection;
