import { Server } from 'lucide-react';
import { V2HostingOptionsSection } from '@/components/design-v2/sections/V2HostingOptionsSection';
import V2HostingOptionsSettingsContent from '@/components/admin/sections/V2HostingOptionsSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-hosting-options',
  displayName: 'V2 Hosting Options',
  icon: Server,
  category: 'commerce',
  component: V2HostingOptionsSection,
  settingsComponent: createSettingsWrapper(V2HostingOptionsSettingsContent),
  defaultProps: {
    title: 'Hosting Options for Your Project',
    showPromoBanner: true,
    hostingOptions: [
      { id: 1, icon: 'https://c.animaapp.com/CB75pelm/img/icon.svg', title: 'Shared Hosting', price: '$2.80', bestFor: 'NEW SITES & BUDGET', ratingBars: 2 },
      { id: 2, icon: 'https://c.animaapp.com/CB75pelm/img/icon-2.svg', title: 'VPS Hosting', price: '$2.80', bestFor: 'SCALE & CUSTOM SETUPS', ratingBars: 3 },
      { id: 3, icon: 'https://c.animaapp.com/CB75pelm/img/icon-4.svg', title: 'VDS Hosting', price: '$2.80', bestFor: 'GROWTH & MANAGED RESOURCES', ratingBars: 3 },
      { id: 4, icon: 'https://c.animaapp.com/CB75pelm/img/main@2x.png', title: 'WordPress Hosting', price: '$2.80', bestFor: 'GROWTH & MANAGED RESOURCES', ratingBars: 3, isWordPress: true },
      { id: 5, icon: 'https://c.animaapp.com/CB75pelm/img/icon-7.svg', title: 'Game Hosting', price: '$2.80', bestFor: 'WP SPEED & SECURITY', ratingBars: 2 },
      { id: 6, icon: 'https://c.animaapp.com/CB75pelm/img/icon-9.svg', title: 'Email Hosting', price: '$2.80', bestFor: 'WP SPEED & SECURITY', ratingBars: 2 },
      { id: 7, icon: 'https://c.animaapp.com/CB75pelm/img/icon-11.svg', title: 'Dedicated Hosting', price: '$2.80', bestFor: 'WP SPEED & SECURITY', ratingBars: 4 },
    ],
  },
  description: 'V2 design hosting options grid with promo banner.',
  usesDataWrapper: true,
  pageGroup: 'V2 Design',
  pageGroupOrder: 2,
  translatableProps: ['title', 'hostingOptions.*.title', 'hostingOptions.*.bestFor'],
  dndArrays: [{ path: 'hostingOptions', strategy: 'grid', handlePosition: 'top-left' }],
});
