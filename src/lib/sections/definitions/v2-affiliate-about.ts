import { Info } from 'lucide-react';
import { V2AffiliateAboutSection } from '@/components/design-v2/sections/V2AffiliateAboutSection';
import V2AffiliateAboutSettingsContent from '@/components/admin/sections/V2AffiliateAboutSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-affiliate-about',
  displayName: 'V2 Affiliate About',
  icon: Info,
  category: 'content',
  component: V2AffiliateAboutSection,
  settingsComponent: createSettingsWrapper(V2AffiliateAboutSettingsContent),
  defaultProps: {
    title: "Why the World's Best Affiliates Choose HostOnce",
    subtitle: "Join an affiliate program built for your success. With industry-leading payouts and a product that\nsells itself, we provide everything you need to scale your earnings.",
    cards: [
      {
        id: crypto.randomUUID(),
        image: '/lovable-uploads/affiliate-about/about-1.png',
        taglineIcon: '/lovable-uploads/affiliate-about/Icon-1.png',
        tagline: 'PROMOTE A PRODUCT THAT STAYS SOLD',
        title: 'High Conversion, Low Churn',
        description: "We've built HostOnce from the ground up to maximize speed and reliability. Our high-converting landing pages turn your traffic into customers.",
      },
      {
        id: crypto.randomUUID(),
        image: '/lovable-uploads/affiliate-about/about-2.png',
        taglineIcon: '/lovable-uploads/affiliate-about/Icon-2.png',
        tagline: 'PROMOTE A PRODUCT THAT STAYS SOLD',
        title: 'Earn More As You Grow',
        description: 'Our tiered commission structure rewards your success—the more customers you refer, the higher your payout per sale.',
       
      },
      {
        id: crypto.randomUUID(),
        image: '/lovable-uploads/affiliate-about/about-3.png',
        taglineIcon: '/lovable-uploads/affiliate-about/Icon-3.png',
        tagline: 'DEDICATED PARTNER SUPPORT',
        title: 'Your Success is Our Priority',
        description: 'Access a full suite of professional marketing assets, real-time tracking tools, and a 90-day cookie window. Plus, our dedicated affiliate managers are always available.',
      },
      {
        id: crypto.randomUUID(),
        image: '/lovable-uploads/affiliate-about/about-4.png',
        taglineIcon: '/lovable-uploads/affiliate-about/Icon-4.png',
        tagline: 'RELIABLE, AUTOMATED PAYOUTS',
        title: 'Get Paid On Time, Every Time',
        description: 'Forget about manual requests or chasing invoices. Once you hit the minimum threshold, your earnings are sent directly to you with total transparency.',
      },
    ],
  },
  description: 'V2 Affiliate About section with 4 informational cards featuring images, taglines, titles, and descriptions.',
  usesDataWrapper: true,
  pageGroup: 'V2 Affiliate Partner Program',
  pageGroupOrder: 2,
  translatableProps: [
    'title',
    'subtitle',
    'cards.*.tagline',
    'cards.*.title',
    'cards.*.description',
  ],
  dndArrays: [{ path: 'cards', strategy: 'grid' }],
});
