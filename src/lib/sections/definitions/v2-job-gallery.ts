import { Image } from 'lucide-react';
import { V2JobGallerySection } from '@/components/design-v2/sections/V2JobGallerySection';
import V2JobGallerySettingsContent from '@/components/admin/sections/V2JobGallerySettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-job-gallery',
  displayName: 'V2 Job Gallery',
  icon: Image,
  category: 'layout',
  component: V2JobGallerySection,
  settingsComponent: createSettingsWrapper(V2JobGallerySettingsContent),
  defaultProps: {
    images: [
      { id: '1', src: 'https://c.animaapp.com/L22lErDL/img/1.png', alt: 'Gallery image 1' },
      { id: '2', src: 'https://c.animaapp.com/L22lErDL/img/2.png', alt: 'Gallery image 2' },
      { id: '3', src: 'https://c.animaapp.com/L22lErDL/img/2-1.png', alt: 'Gallery image 3' },
      { id: '4', src: 'https://c.animaapp.com/L22lErDL/img/1-1.png', alt: 'Gallery image 4' },
    ],
  },
  description: '2-row photo gallery with alternating wide/narrow images.',
  usesDataWrapper: true,
  pageGroup: 'V2 Job Detail',
  pageGroupOrder: 3,
  translatableProps: [],
  dndArrays: [],
});
