import React from 'react';
import Marquee from 'react-fast-marquee';
import { LogoCarouselData } from '@/types/pageEditor';

const variants = {
  dark: {
    background: 'hsl(150, 20%, 12%)',
    borderColor: 'hsl(150, 15%, 20%)',
  },
  light: {
    background: 'hsl(150, 20%, 97%)',
    borderColor: 'hsl(150, 15%, 88%)',
  },
};

interface LogoCarouselRendererProps {
  data: LogoCarouselData;
  className?: string;
}

export const LogoCarouselRenderer: React.FC<LogoCarouselRendererProps> = ({
  data,
  className = '',
}) => {
  const colors = variants[data.variant];
  
  // Use custom colors if provided, otherwise use variant defaults
  const backgroundColor = data.customBackground || colors.background;
  const borderColor = data.customBorder || colors.borderColor;
  const opacity = data.logoOpacity / 100;

  // Use default logos if none provided
  const logos = data.logos.length > 0 ? data.logos : [
    { src: '/placeholder.svg', alt: 'Company 1' },
    { src: '/placeholder.svg', alt: 'Company 2' },
    { src: '/placeholder.svg', alt: 'Company 3' },
    { src: '/placeholder.svg', alt: 'Company 4' },
  ];

  return (
    <section
      className={`py-8 overflow-hidden border-y ${className}`}
      style={{
        background: backgroundColor,
        borderColor: borderColor,
      }}
      data-section="logo-carousel"
      data-component="LogoCarousel"
      data-variant={data.variant}
      data-speed={data.speed}
      data-pause-on-hover={data.pauseOnHover}
      data-custom-bg={data.customBackground || ''}
      data-custom-border={data.customBorder || ''}
      data-logo-opacity={data.logoOpacity}
    >
      <Marquee
        speed={data.speed}
        pauseOnHover={data.pauseOnHover}
        gradient={true}
        gradientColor={backgroundColor}
        gradientWidth={80}
        autoFill={true}
      >
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo.src}
            alt={logo.alt}
            className="h-10 w-auto mx-6"
            style={{ opacity }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        ))}
      </Marquee>
    </section>
  );
};

export default LogoCarouselRenderer;
