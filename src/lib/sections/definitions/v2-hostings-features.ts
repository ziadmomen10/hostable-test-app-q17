import { Server } from 'lucide-react';
import { V2HostingsFeaturesSection } from '@/components/design-v2/sections/V2HostingsFeaturesSection';
import V2HostingsFeaturesSettingsContent from '@/components/admin/sections/V2HostingsFeaturesSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-hostings-features',
  displayName: 'V2 Hosting Features',
  icon: Server,
  category: 'layout',
  component: V2HostingsFeaturesSection,
  settingsComponent: createSettingsWrapper(V2HostingsFeaturesSettingsContent),
  defaultProps: {
    title: 'Hosting Options for Your Project',
    subtitle: '',
    hostings: [
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/CB75pelm/img/icon.svg', title: 'Shared Hosting', price: '$2.80', bestFor: 'NEW SITES & BUDGET', ratingBars: 2 },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/CB75pelm/img/icon-2.svg', title: 'VPS Hosting', price: '$2.80', bestFor: 'SCALE & CUSTOM SETUPS', ratingBars: 3 },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/CB75pelm/img/icon-4.svg', title: 'VDS Hosting', price: '$2.80', bestFor: 'GROWTH & MANAGED RESOURCES', ratingBars: 3 },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/CB75pelm/img/main@2x.png', title: 'WordPress Hosting', price: '$2.80', bestFor: 'GROWTH & MANAGED RESOURCES', ratingBars: 3 },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/CB75pelm/img/icon-7.svg', title: 'Game Hosting', price: '$2.80', bestFor: 'WP SPEED & SECURITY', ratingBars: 2 },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/CB75pelm/img/icon-9.svg', title: 'Email Hosting', price: '$2.80', bestFor: 'WP SPEED & SECURITY', ratingBars: 2 },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/CB75pelm/img/icon-11.svg', title: 'Dedicated Hosting', price: '$2.80', bestFor: 'WP SPEED & SECURITY', ratingBars: 4 },
    ],
  },
  description: 'Hosting options cards with pricing, rating bars, and promo banner.',
  usesDataWrapper: true,
  pageGroup: 'V2 Design',
  pageGroupOrder: 5,
  translatableProps: ['title', 'subtitle', 'hostings.*.title', 'hostings.*.bestFor'],
  dndArrays: [{ path: 'hostings', strategy: 'grid' }],
});
