/**
 * Element Settings Types
 * 
 * Comprehensive type definitions for element-level and section-level styling.
 * Used by the Settings Panel and rendering components.
 */

// ============================================================================
// Section Style Props
// ============================================================================

export interface SectionStyleProps {
  /** Background configuration */
  background?: BackgroundStyle;
  /** Padding with responsive values */
  padding?: ResponsiveSpacing;
  /** Margin with responsive values */
  margin?: ResponsiveSpacing;
  /** Container width preset */
  containerWidth?: 'narrow' | 'default' | 'wide' | 'full';
  /** Z-index for layering */
  zIndex?: number;
  /** Hide section on specific devices */
  hideOn?: DeviceVisibility;
  /** Border configuration */
  border?: BorderStyle;
  /** Box shadow preset */
  shadow?: ShadowPreset;
}

export interface BackgroundStyle {
  type: 'solid' | 'gradient' | 'image' | 'transparent';
  color?: string;
  gradient?: GradientStyle;
  image?: BackgroundImageStyle;
}

export interface GradientStyle {
  start: string;
  end: string;
  angle: number;
  type?: 'linear' | 'radial';
}

export interface BackgroundImageStyle {
  url: string;
  size?: 'cover' | 'contain' | 'auto';
  position?: string;
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  overlay?: {
    color: string;
    opacity: number;
  };
}

export interface ResponsiveSpacing {
  desktop: SpacingValue;
  tablet?: SpacingValue;
  mobile?: SpacingValue;
}

export interface SpacingValue {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export interface DeviceVisibility {
  desktop?: boolean;
  tablet?: boolean;
  mobile?: boolean;
}

export interface BorderStyle {
  width?: string;
  color?: string;
  style?: 'solid' | 'dashed' | 'dotted' | 'none';
  radius?: string;
}

export type ShadowPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// ============================================================================
// Image Element Props
// ============================================================================

export interface ImageElementProps {
  src: string;
  alt?: string;
  link?: LinkConfig;
  width?: string;
  height?: string;
  aspectRatio?: 'auto' | '1:1' | '4:3' | '16:9' | '3:2' | '2:3' | 'custom';
  customAspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  borderRadius?: string;
  border?: BorderStyle;
  shadow?: ShadowPreset;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'auto' | 'high' | 'low';
}

// ============================================================================
// Button Element Props
// ============================================================================

export interface ButtonElementProps {
  text: string;
  link?: LinkConfig;
  icon?: IconConfig;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  width?: 'auto' | 'full';
  borderRadius?: string;
  customColors?: ButtonColors;
  hover?: ButtonColors;
  disabled?: boolean;
  loading?: boolean;
}

export interface LinkConfig {
  url: string;
  newTab?: boolean;
}

export interface IconConfig {
  name: string;
  position?: 'before' | 'after';
  size?: number;
}

export interface ButtonColors {
  background?: string;
  text?: string;
  border?: string;
}

// ============================================================================
// Icon Element Props
// ============================================================================

export interface IconElementProps {
  name: string;
  size?: number;
  color?: string;
  background?: IconBackground;
  link?: LinkConfig;
  hoverColor?: string;
}

export interface IconBackground {
  shape: 'none' | 'circle' | 'square' | 'rounded';
  color?: string;
  size?: number;
}

// ============================================================================
// Text Element Props
// ============================================================================

export interface TextElementProps {
  content: string | object; // Can be plain text or rich text JSON
  fontSize?: ResponsiveValue<string>;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontWeight?: string;
  color?: string;
}

export interface ResponsiveValue<T> {
  desktop: T;
  tablet?: T;
  mobile?: T;
}

// ============================================================================
// Card Element Props
// ============================================================================

export interface CardElementProps {
  background?: BackgroundStyle;
  border?: BorderStyle;
  shadow?: ShadowPreset;
  padding?: SpacingValue;
  hoverEffect?: 'none' | 'lift' | 'glow' | 'scale' | 'border';
}

// ============================================================================
// Default Values
// ============================================================================

export const defaultSectionStyle: SectionStyleProps = {
  background: { type: 'transparent' },
  containerWidth: 'default',
  zIndex: undefined,
  hideOn: undefined,
};

export const defaultSpacing: SpacingValue = {
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
};

export const defaultImageProps: Partial<ImageElementProps> = {
  objectFit: 'cover',
  loading: 'lazy',
  aspectRatio: 'auto',
};

export const defaultButtonProps: Partial<ButtonElementProps> = {
  variant: 'default',
  size: 'default',
  width: 'auto',
};

// ============================================================================
// Shadow Presets CSS Values
// ============================================================================

export const shadowPresets: Record<ShadowPreset, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
};

// ============================================================================
// Type Guards
// ============================================================================

export function isSectionStyleProps(value: unknown): value is SectionStyleProps {
  return typeof value === 'object' && value !== null;
}

export function isBackgroundStyle(value: unknown): value is BackgroundStyle {
  if (typeof value !== 'object' || value === null) return false;
  const bg = value as BackgroundStyle;
  return ['solid', 'gradient', 'image', 'transparent'].includes(bg.type);
}
