import { Handshake } from 'lucide-react';
import PartnersSection from '@/components/landing/PartnersSection';
import PartnersSettingsContent from '@/components/admin/sections/PartnersSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultProps = {
  badge: 'PARTNERSHIPS',
  title: 'Our Trusted Partners',
  subtitle: 'We collaborate with industry leaders to deliver exceptional solutions',
  partners: [
    { 
      id: crypto.randomUUID(), 
      logo: '/placeholder.svg', 
      name: 'TechCorp', 
      description: 'Leading cloud infrastructure provider',
      website: 'https://example.com'
    },
    { 
      id: crypto.randomUUID(), 
      logo: '/placeholder.svg', 
      name: 'DataFlow', 
      description: 'Enterprise data management solutions',
      website: 'https://example.com'
    },
    { 
      id: crypto.randomUUID(), 
      logo: '/placeholder.svg', 
      name: 'SecureNet', 
      description: 'Cybersecurity and compliance experts',
      website: 'https://example.com'
    },
    { 
      id: crypto.randomUUID(), 
      logo: '/placeholder.svg', 
      name: 'CloudScale', 
      description: 'Scalable hosting and CDN services',
      website: 'https://example.com'
    },
  ],
};

registerSection({
  type: 'partners',
  displayName: 'Partners',
  icon: Handshake,
  category: 'content',
  component: PartnersSection,
  settingsComponent: createSettingsWrapper(PartnersSettingsContent),
  defaultProps,
  description: 'Showcase your business partners with logos and descriptions',
  pageGroup: 'Career Page',
  pageGroupOrder: 3,
  
  // Translation keys - use .* for array item properties
  translatableProps: [
    'badge', 
    'title', 
    'subtitle',
    'partners.*.name', 
    'partners.*.description',
  ],
  
  // Enable data wrapper for proper props handling
  usesDataWrapper: true,
  
  // Define DnD arrays with strategy
  dndArrays: [{ path: 'partners', strategy: 'grid' }],
});
