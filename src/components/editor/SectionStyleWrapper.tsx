/**
 * SectionStyleWrapper
 * 
 * Optional wrapper that applies section-level layout styles.
 * This is ADDITIVE - sections that don't use it continue to work unchanged.
 * 
 * Currently applies:
 * - contentAlignment from layoutProps
 * 
 * Note: Most section styles (background, padding, shadow) are handled by
 * SectionContainer. This wrapper handles layout-specific styles that need
 * to apply to content within the section.
 * 
 * Part of Phase 2: Refactor Section Architecture
 */

import React from 'react';
import type { SectionStyleProps } from '@/types/elementSettings';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import { cn } from '@/lib/utils';

interface SectionStyleWrapperProps {
  children: React.ReactNode;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
  className?: string;
}

export function SectionStyleWrapper({
  children,
  styleOverrides,
  layoutProps,
  className,
}: SectionStyleWrapperProps) {
  // Apply container-level styles that aren't handled by SectionContainer
  const wrapperStyle: React.CSSProperties = {};
  
  // Apply text alignment from layoutProps
  if (layoutProps?.contentAlignment) {
    wrapperStyle.textAlign = layoutProps.contentAlignment;
  }
  
  // If no styles to apply, render children directly (zero overhead)
  const hasStyles = Object.keys(wrapperStyle).length > 0;
  
  if (!hasStyles && !className) {
    return <>{children}</>;
  }
  
  return (
    <div 
      className={cn('section-style-wrapper', className)}
      style={wrapperStyle}
    >
      {children}
    </div>
  );
}

export default SectionStyleWrapper;
