/**
 * Legal Layout Section Definition
 */

import { Scale } from 'lucide-react';
import LegalLayoutSection from '@/components/design-v2/sections/LegalLayoutSection';
import LegalSettingsContent from '@/components/admin/sections/LegalSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultLegalProps = {
  subtitle: 'Kindly read these general terms and policies of the service agreement carefully, as it holds important information regarding your legal rights and remedies.',
  defaultActiveSlug: 'terms-and-conditions',
  items: [
    {
      id: crypto.randomUUID(),
      label: 'Terms and Conditions',
      title: 'General Terms And Conditions',
      slug: 'terms-and-conditions',
    },
    {
      id: crypto.randomUUID(),
      label: 'Privacy Policy',
      title: 'Privacy Policy',
      slug: 'privacy-policy',
    },
    {
      id: crypto.randomUUID(),
      label: 'Cookie Policy',
      title: 'UltaHost Cookie Policy',
      slug: 'cookie-policy',
    },
    {
      id: crypto.randomUUID(),
      label: 'Cancellation & Refunds Policy',
      title: 'Cancellation & Refunds Policy',
      slug: 'cancellation-refunds',
    },
  ],
};

registerSection({
  type: 'legal',
  displayName: 'Legal Layout',
  icon: Scale,
  category: 'content',
  component: LegalLayoutSection,
  settingsComponent: createSettingsWrapper(LegalSettingsContent),
  defaultProps: defaultLegalProps,
  description: 'Legal pages layout with sidebar navigation and content',
  usesDataWrapper: true,
  pageGroup: 'Legal',
  pageGroupOrder: 1,
  translatableProps: [
    'subtitle',
    'items.*.label',
    'items.*.title',
  ],
  dndArrays: [
    {
      path: 'items',
      strategy: 'vertical',
      handlePosition: 'left',
    },
  ],
});
