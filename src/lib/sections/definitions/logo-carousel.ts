/**
 * Logo Carousel Section Definition
 */

import { Image } from 'lucide-react';
import LogoCarousel from '@/components/landing/LogoCarousel';
import LogoCarouselSettingsContent from '@/components/admin/sections/LogoCarouselSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultLogoCarouselProps = {
  variant: 'dark' as const,
  speed: 50,
  pauseOnHover: true,
  customBackground: '',
  customBorder: '',
  logoOpacity: 70,
  logos: [],
};

registerSection({
  type: 'logo-carousel',
  displayName: 'Logo Carousel',
  icon: Image,
  category: 'media',
  component: LogoCarousel,
  settingsComponent: createSettingsWrapper(LogoCarouselSettingsContent),
  defaultProps: defaultLogoCarouselProps,
  description: 'Animated logo carousel',
  pageGroup: 'General',
  pageGroupOrder: 8,
  translatableProps: ['logos.*.name', 'logos.*.alt'],
});
