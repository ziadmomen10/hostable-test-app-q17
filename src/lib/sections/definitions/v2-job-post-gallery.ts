import { Image } from 'lucide-react';
import { V2JobPostGallerySection } from '@/components/design-v2/sections/V2JobPostGallerySection';
import V2JobPostGallerySettingsContent from '@/components/admin/sections/V2JobPostGallerySettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-job-post-gallery',
  displayName: 'V2 Job Post Gallery',
  icon: Image,
  category: 'media',
  component: V2JobPostGallerySection,
  settingsComponent: createSettingsWrapper(V2JobPostGallerySettingsContent),
  defaultProps: {
    images: [
      { id: crypto.randomUUID(), src: 'https://c.animaapp.com/MHCiEJ26/img/1.png', alt: 'Testimonial image 1' },
      { id: crypto.randomUUID(), src: 'https://c.animaapp.com/MHCiEJ26/img/2.png', alt: 'Testimonial image 2' },
      { id: crypto.randomUUID(), src: 'https://c.animaapp.com/MHCiEJ26/img/2-1.png', alt: 'Testimonial image 3' },
      { id: crypto.randomUUID(), src: 'https://c.animaapp.com/MHCiEJ26/img/1-1.png', alt: 'Testimonial image 4' },
    ],
  },
  description: 'Job post gallery with 4 testimonial images in a 2-row alternating layout.',
  usesDataWrapper: true,
  pageGroup: 'V2 Job Post',
  pageGroupOrder: 3,
  translatableProps: ['images.*.alt'],
  dndArrays: [{ path: 'images', strategy: 'grid' }],
});
