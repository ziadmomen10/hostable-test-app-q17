import { LayoutGrid } from 'lucide-react';
import { V2BusinessSuiteSection } from '@/components/design-v2/sections/V2BusinessSuiteSection';
import V2BusinessSuiteSettingsContent from '@/components/admin/sections/V2BusinessSuiteSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-business-suite',
  displayName: 'V2 Business Suite',
  icon: LayoutGrid,
  category: 'content',
  component: V2BusinessSuiteSection,
  settingsComponent: createSettingsWrapper(V2BusinessSuiteSettingsContent),
  defaultProps: {
    badge: 'Business Suite',
    title: 'Everything you need to grow online',
    cards: [
      {
        id: 'hosting',
        title: 'Hosting',
        price: '$2.80',
        logo: 'https://c.animaapp.com/dZ1UxMzX/img/logo.svg',
        mainImage: 'https://c.animaapp.com/dZ1UxMzX/img/main@2x.png',
        frameIcon: 'https://c.animaapp.com/dZ1UxMzX/img/frame.svg',
        bgGradient: 'bg-[linear-gradient(0deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%),linear-gradient(0deg,rgba(157,195,50,1)_0%,rgba(157,195,50,1)_100%)]',
      },
      {
        id: 'domains',
        title: 'Domains',
        price: '$2.80',
        logo: 'https://c.animaapp.com/dZ1UxMzX/img/logo-1.svg',
        mainImage: 'https://c.animaapp.com/dZ1UxMzX/img/main-1.svg',
        frameIcon: 'https://c.animaapp.com/dZ1UxMzX/img/frame-1.svg',
        bgGradient: 'bg-[linear-gradient(0deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%),linear-gradient(0deg,rgba(0,182,122,1)_0%,rgba(0,182,122,1)_100%)]',
      },
      {
        id: 'business-email',
        title: 'Business Email',
        price: '$2.80',
        logo: 'https://c.animaapp.com/dZ1UxMzX/img/logo-3.svg',
        mainImage: '',
        frameIcon: 'https://c.animaapp.com/dZ1UxMzX/img/frame-2.svg',
        bgGradient: 'bg-[linear-gradient(0deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%),linear-gradient(0deg,rgba(246,166,79,1)_0%,rgba(246,166,79,1)_100%)]',
      },
      {
        id: 'website-builder',
        title: 'Website Builder',
        price: '$2.80',
        logo: 'https://c.animaapp.com/dZ1UxMzX/img/logo-4.svg',
        mainImage: 'https://c.animaapp.com/dZ1UxMzX/img/main-2@2x.png',
        frameIcon: 'https://c.animaapp.com/dZ1UxMzX/img/frame-3.svg',
        bgGradient: 'bg-[linear-gradient(0deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%),linear-gradient(0deg,rgba(55,184,213,1)_0%,rgba(55,184,213,1)_100%)]',
      },
      {
        id: 'wordpress',
        title: 'WordPress',
        price: '$2.80',
        logo: 'https://c.animaapp.com/dZ1UxMzX/img/main-3@2x.png',
        mainImage: 'https://c.animaapp.com/dZ1UxMzX/img/main-4.svg',
        frameIcon: 'https://c.animaapp.com/dZ1UxMzX/img/frame-4.svg',
        bgGradient: 'bg-[linear-gradient(0deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%),linear-gradient(0deg,rgba(84,59,242,1)_0%,rgba(84,59,242,1)_100%)]',
      },
    ],
  },
  description: 'V2 design business suite card row with 5 service categories.',
  usesDataWrapper: true,
  pageGroup: 'V2 Design',
  pageGroupOrder: 1,
  translatableProps: ['badge', 'title', 'cards.*.title', 'cards.*.price'],
  dndArrays: [{ path: 'cards', strategy: 'horizontal', handlePosition: 'top-left' }],
});
