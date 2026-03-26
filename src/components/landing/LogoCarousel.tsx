import Marquee from "react-fast-marquee";
import { EditableElement } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { cn } from '@/lib/utils';
import type { SectionStyleProps } from '@/types/elementSettings';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import { gapClasses } from '@/types/sectionSettings';

interface LogoCarouselProps {
  logos?: { src: string; alt: string }[];
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
  variant?: "dark" | "light";
  customBackground?: string;
  customBorder?: string;
  logoOpacity?: number;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultLogos = [
  { src: "/placeholder.svg", alt: "Company 1" },
  { src: "/placeholder.svg", alt: "Company 2" },
  { src: "/placeholder.svg", alt: "Company 3" },
  { src: "/placeholder.svg", alt: "Company 4" },
  { src: "/placeholder.svg", alt: "Company 5" },
  { src: "/placeholder.svg", alt: "Company 6" },
  { src: "/placeholder.svg", alt: "Company 7" },
  { src: "/placeholder.svg", alt: "Company 8" },
];

export const LogoCarousel = ({
  logos = defaultLogos,
  speed = 50,
  pauseOnHover = true,
  className = "",
  variant = "dark",
  customBackground,
  customBorder,
  logoOpacity = 70,
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}: LogoCarouselProps) => {
  const opacity = logoOpacity / 100;
  
  const { SortableWrapper, getItemProps } = useArrayItems('logos', logos);

  // Use theme classes for variants instead of hardcoded HSL
  const variantClasses = {
    dark: 'bg-dark-bg-light border-dark-border',
    light: 'bg-muted border-border',
  };

  // For Marquee gradient, we need to compute the actual color
  // Use CSS custom property values
  const getGradientColor = () => {
    if (customBackground) return customBackground;
    // Return appropriate color for gradient fade effect
    return variant === 'dark' ? 'hsl(150, 20%, 12%)' : 'hsl(150, 20%, 97%)';
  };

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

  const sectionStyles = customBackground || customBorder ? {
    background: customBackground,
    borderColor: customBorder,
  } : Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined;

  // When editing, show a static grid with DnD instead of marquee
  if (isEditing) {
    return (
      <section
        className={cn(
          "py-8 overflow-hidden border-y",
          !customBackground && !customBorder && variantClasses[variant],
          className
        )}
        style={sectionStyles}
        data-section="logo-carousel"
      >
        <SortableWrapper>
          <div className={`flex flex-wrap justify-center items-center ${gapClasses[layoutProps?.gap || 'default']} px-4`}>
            {logos.map((logo, index) => (
              <SortableItem key={`${sectionId}-logos-${index}`} {...getItemProps(index)}>
                <EditableElement
                  sectionId={sectionId}
                  path={`logos.${index}.src`}
                  type="image"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-10 w-auto"
                    style={{ opacity }}
                  />
                </EditableElement>
              </SortableItem>
            ))}
          </div>
        </SortableWrapper>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "py-8 overflow-hidden border-y",
        !customBackground && !customBorder && variantClasses[variant],
        className
      )}
      style={sectionStyles}
      data-section="logo-carousel"
      data-component="LogoCarousel"
      data-variant={variant}
      data-speed={speed}
      data-pause-on-hover={pauseOnHover}
      data-custom-bg={customBackground || ''}
      data-custom-border={customBorder || ''}
      data-logo-opacity={logoOpacity}
    >
      <Marquee
        speed={speed}
        pauseOnHover={pauseOnHover}
        gradient={true}
        gradientColor={getGradientColor()}
        gradientWidth={80}
        autoFill={true}
      >
        {logos.map((logo, index) => (
          <EditableElement
            key={index}
            sectionId={sectionId}
            path={`logos.${index}.src`}
            type="image"
            className="mx-6"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-10 w-auto"
              style={{ opacity }}
            />
          </EditableElement>
        ))}
      </Marquee>
    </section>
  );
};

export default LogoCarousel;
