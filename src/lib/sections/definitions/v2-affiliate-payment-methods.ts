import { CreditCard } from 'lucide-react';
import { V2AffiliatePaymentMethodsSection } from '@/components/design-v2/sections/V2AffiliatePaymentMethodsSection';
import V2AffiliatePaymentMethodsSettingsContent from '@/components/admin/sections/V2AffiliatePaymentMethodsSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-affiliate-payment-methods',
  displayName: 'V2 Affiliate Payment Methods',
  icon: CreditCard,
  category: 'layout',
  component: V2AffiliatePaymentMethodsSection,
  settingsComponent: createSettingsWrapper(V2AffiliatePaymentMethodsSettingsContent),
  defaultProps: {
    badge: 'PAYMENT METHODS',
    title: 'Flexible Payments.\nGlobal Reach.',
    subtitle: 'Every Guide is trained and excited to work with you, whether you need help with a password\nreset or you\'re looking for a team to build your complete web presence.',
    methods: [
      { 
        id: crypto.randomUUID(), 
        icon: '/lovable-uploads/payment/icon-paypal.png', 
        title: 'PayPal', 
        description: 'Fast, reliable, and globally recognized.' 
      },
      { 
        id: crypto.randomUUID(), 
        icon: '/lovable-uploads/payment/icon-payoneer.png', 
        title: 'Payoneer', 
        description: 'Optimized for international partners.' 
      },
      { 
        id: crypto.randomUUID(), 
        icon: '/lovable-uploads/payment/icon-global-bank-transfers.png', 
        title: 'Global Bank Transfers', 
        description: 'Secure SWIFT or ACH transfers.' 
      },
      { 
        id: crypto.randomUUID(), 
        icon: '/lovable-uploads/payment/icon-crypto-currency.png', 
        title: 'Crypto Currency', 
        description: 'Private and borderless.' 
      },
    ],
  },
  description: 'Display supported payment methods for affiliate commissions in a grid layout.',
  usesDataWrapper: true,
  pageGroup: 'V2 Affiliate Partner Program',
  pageGroupOrder: 2,
  translatableProps: ['badge', 'title', 'subtitle', 'methods.*.title', 'methods.*.description'],
  dndArrays: [{ path: 'methods', strategy: 'grid' }],
});
