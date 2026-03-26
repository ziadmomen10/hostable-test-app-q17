/**
 * CTA Section Definition
 */

import { Megaphone } from 'lucide-react';
import CTASection from '@/components/landing/CTASection';
import CTASettingsContent from '@/components/admin/sections/CTASettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultCTAProps = {
  badge: '🎉 Limited Time Offer',
  title: 'Elevate Your Business with HostOnce',
  subtitle: 'Join thousands of satisfied customers and experience the difference of truly reliable hosting.',
  benefits: [
    { text: 'Free Domain Name' },
    { text: 'Free SSL Certificate' },
    { text: '30-Day Money Back' },
  ],
  primaryButtonText: 'Get Started Now',
  primaryButtonUrl: '#pricing',
  secondaryButtonText: 'Contact Sales',
  secondaryButtonUrl: '#contact',
};

registerSection({
  type: 'cta',
  displayName: 'Call to Action',
  icon: Megaphone,
  category: 'content',
  component: CTASection,
  settingsComponent: createSettingsWrapper(CTASettingsContent),
  defaultProps: defaultCTAProps,
  description: 'A call-to-action section with buttons',
  pageGroup: 'General',
  pageGroupOrder: 6,
  translatableProps: ['badge', 'title', 'subtitle', 'primaryButtonText', 'secondaryButtonText', 'benefits.*.text'],
});
