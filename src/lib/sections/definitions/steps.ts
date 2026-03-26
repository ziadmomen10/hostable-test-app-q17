/**
 * Steps Section Definition
 */

import { ListOrdered } from 'lucide-react';
import StepsSection from '@/components/landing/StepsSection';
import StepsSettingsContent from '@/components/admin/sections/StepsSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultStepsProps = {
  badge: 'HOW IT WORKS',
  title: 'Get Started in 3 Simple Steps',
  subtitle: 'From signup to live website in minutes, not hours.',
  layout: 'horizontal' as const,
  steps: [
    { number: 1, title: 'Choose Your Plan', description: 'Select the hosting plan that fits your needs and budget.', icon: '📋' },
    { number: 2, title: 'Setup Your Account', description: 'Quick registration with instant activation and one-click installs.', icon: '⚙️' },
    { number: 3, title: 'Launch Your Site', description: 'Deploy your website and go live with our easy-to-use tools.', icon: '🚀' },
  ],
};

registerSection({
  type: 'steps',
  displayName: 'Steps Section',
  icon: ListOrdered,
  category: 'content',
  component: StepsSection,
  settingsComponent: createSettingsWrapper(StepsSettingsContent),
  defaultProps: defaultStepsProps,
  description: 'How-it-works or process steps',
  pageGroup: 'General',
  pageGroupOrder: 14,
  translatableProps: ['badge', 'title', 'subtitle', 'steps.*.title', 'steps.*.description'],
  usesDataWrapper: true,
});
