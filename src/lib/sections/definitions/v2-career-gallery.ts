import { ImageIcon } from 'lucide-react';
import { V2CareerGallerySection } from '@/components/design-v2/sections/V2CareerGallerySection';
import V2CareerGallerySettingsContent from '@/components/admin/sections/V2CareerGallerySettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-gallery',
  displayName: 'V2 Career Gallery',
  icon: ImageIcon,
  category: 'media',
  component: V2CareerGallerySection,
  settingsComponent: createSettingsWrapper(V2CareerGallerySettingsContent),
  defaultProps: {
    images: [
      { id: 1, src: 'https://c.animaapp.com/mjke8DFm/img/1.png', alt: 'Gallery image 1' },
      { id: 2, src: 'https://c.animaapp.com/mjke8DFm/img/2.png', alt: 'Gallery image 2' },
      { id: 3, src: 'https://c.animaapp.com/mjke8DFm/img/2-1.png', alt: 'Gallery image 3' },
      { id: 4, src: 'https://c.animaapp.com/mjke8DFm/img/1-1.png', alt: 'Gallery image 4' },
    ],
  },
  description: 'V2 career page image gallery with alternating wide/narrow bento rows.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page',
  pageGroupOrder: 5,
  translatableProps: [],
  dndArrays: [], // Positional bento — not sortable
});
