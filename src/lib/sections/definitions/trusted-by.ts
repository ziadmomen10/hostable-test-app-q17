/**
 * Trusted By Section Definition
 */

import { Shield } from 'lucide-react';
import TrustedBySection from '@/components/landing/TrustedBySection';
import TrustedBySettingsContent from '@/components/admin/sections/TrustedBySettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultTrustedByProps = {
  title: 'Trusted by leading companies worldwide',
  platforms: [
    { name: 'Google', rating: 4.8, reviewCount: '300+' },
    { name: 'Trustpilot', rating: 4.8, reviewCount: '1,000+' },
    { name: 'Reviews.io', rating: 4.8, reviewCount: '1,704' },
  ],
  companies: [
    { name: 'TechCrunch' },
    { name: 'Forbes' },
    { name: 'TechRadar' },
    { name: 'HubSpot' },
    { name: 'CyberNews' },
    { name: 'Website Planet' },
    { name: 'NP Digital' },
    { name: 'CNET' },
  ],
};

registerSection({
  type: 'trusted-by',
  displayName: 'Trusted By',
  icon: Shield,
  category: 'content',
  component: TrustedBySection,
  settingsComponent: createSettingsWrapper(TrustedBySettingsContent),
  defaultProps: defaultTrustedByProps,
  description: 'Show trust badges and company logos',
  pageGroup: 'General',
  pageGroupOrder: 7,
  translatableProps: ['title', 'platforms.*.name', 'companies.*.name'],
});
