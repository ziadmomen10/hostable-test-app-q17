import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { SectionStyleProps, shadowPresets } from '@/types/elementSettings';

export interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Background variant */
  variant?: 'light' | 'dark' | 'accent' | 'muted' | 'transparent';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Container width */
  containerWidth?: 'narrow' | 'default' | 'wide' | 'full';
  /** Section ID for anchor links */
  id?: string;
  /** Data attribute for section targeting */
  'data-section'?: string;
  /** Section type for styling */
  'data-section-type'?: string;
  /** Style overrides from section settings */
  styleOverrides?: SectionStyleProps;
}

const paddingClasses = {
  none: '',
  sm: 'py-8 lg:py-12',
  md: 'py-16 lg:py-20',
  lg: 'py-20 lg:py-24',
};

const variantClasses = {
  light: 'bg-background text-foreground',
  dark: 'bg-dark-bg text-white',
  accent: 'bg-primary/5 text-foreground',
  muted: 'bg-muted text-foreground',
  transparent: 'bg-transparent',
};

const containerWidthClasses = {
  narrow: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-container-wide',
  full: 'max-w-full',
};

const shadowClasses: Record<string, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
};

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className,
  variant = 'light',
  padding = 'md',
  containerWidth = 'default',
  id,
  'data-section': dataSection,
  'data-section-type': dataSectionType,
  styleOverrides,
}) => {
  // Compute inline styles from styleOverrides
  const inlineStyles = useMemo(() => {
    if (!styleOverrides) return {};
    
    const styles: React.CSSProperties = {};
    
    // Background
    if (styleOverrides.background) {
      const bg = styleOverrides.background;
      if (bg.type === 'solid' && bg.color) {
        styles.backgroundColor = bg.color;
      } else if (bg.type === 'gradient' && bg.gradient) {
        const { start, end, angle } = bg.gradient;
        styles.background = `linear-gradient(${angle}deg, ${start}, ${end})`;
      } else if (bg.type === 'image' && bg.image?.url) {
        styles.backgroundImage = `url(${bg.image.url})`;
        styles.backgroundSize = bg.image.size || 'cover';
        styles.backgroundPosition = bg.image.position || 'center';
        styles.backgroundRepeat = bg.image.repeat || 'no-repeat';
      }
    }
    
    // Padding (desktop only for now - responsive requires CSS vars)
    if (styleOverrides.padding?.desktop) {
      const p = styleOverrides.padding.desktop;
      styles.paddingTop = p.top;
      styles.paddingRight = p.right;
      styles.paddingBottom = p.bottom;
      styles.paddingLeft = p.left;
    }
    
    // Margin
    if (styleOverrides.margin?.desktop) {
      const m = styleOverrides.margin.desktop;
      styles.marginTop = m.top;
      styles.marginRight = m.right;
      styles.marginBottom = m.bottom;
      styles.marginLeft = m.left;
    }
    
    // Z-index
    if (styleOverrides.zIndex !== undefined) {
      styles.zIndex = styleOverrides.zIndex;
    }
    
    // Border
    if (styleOverrides.border) {
      const b = styleOverrides.border;
      if (b.width && b.style !== 'none') {
        styles.borderWidth = b.width;
        styles.borderStyle = b.style || 'solid';
        styles.borderColor = b.color || 'hsl(var(--border))';
      }
      if (b.radius) {
        styles.borderRadius = b.radius;
      }
    }
    
    return styles;
  }, [styleOverrides]);
  
  // Determine if we should skip default padding (when custom padding is set)
  const hasCustomPadding = styleOverrides?.padding?.desktop;
  const effectiveContainerWidth = styleOverrides?.containerWidth || containerWidth;
  const shadowClass = styleOverrides?.shadow ? shadowClasses[styleOverrides.shadow] : '';
  
  // Hide on device classes
  const visibilityClasses = useMemo(() => {
    if (!styleOverrides?.hideOn) return '';
    const { desktop, tablet, mobile } = styleOverrides.hideOn;
    const classes: string[] = [];
    if (desktop) classes.push('lg:hidden');
    if (tablet) classes.push('md:max-lg:hidden');
    if (mobile) classes.push('max-md:hidden');
    return classes.join(' ');
  }, [styleOverrides?.hideOn]);

  return (
    <section
      id={id}
      data-section={dataSection}
      data-section-type={dataSectionType}
      className={cn(
        !hasCustomPadding && paddingClasses[padding],
        !styleOverrides?.background && variantClasses[variant],
        shadowClass,
        visibilityClasses,
        className
      )}
      style={inlineStyles}
    >
      <div
        className={cn(
          'mx-auto px-4 md:px-6 lg:px-8',
          containerWidthClasses[effectiveContainerWidth]
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
