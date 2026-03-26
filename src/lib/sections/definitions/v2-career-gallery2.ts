import { Image } from 'lucide-react';
import { V2CareerGallery2Section } from '@/components/design-v2/sections/V2CareerGallery2Section';
import V2CareerGallery2SettingsContent from '@/components/admin/sections/V2CareerGallery2SettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-gallery2',
  displayName: 'V2 Career Gallery 2',
  icon: Image,
  category: 'layout',
  component: V2CareerGallery2Section,
  settingsComponent: createSettingsWrapper(V2CareerGallery2SettingsContent),
  defaultProps: {
    images: [
      { id: '1', src: 'https://c.animaapp.com/kkRHn6VJ/img/1.png', alt: 'Gallery image 1' },
      { id: '2', src: 'https://c.animaapp.com/kkRHn6VJ/img/2.png', alt: 'Gallery image 2' },
      { id: '3', src: 'https://c.animaapp.com/kkRHn6VJ/img/2-1.png', alt: 'Gallery image 3' },
      { id: '4', src: 'https://c.animaapp.com/kkRHn6VJ/img/1-1.png', alt: 'Gallery image 4' },
    ],
  },
  description: '2-row photo gallery with alternating wide/narrow images.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page 2',
  pageGroupOrder: 2,
  translatableProps: [],
  dndArrays: [],
});
