/**
 * Video Section Definition
 */

import { Video } from 'lucide-react';
import VideoSection from '@/components/landing/VideoSection';
import VideoSettingsContent from '@/components/admin/sections/VideoSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultVideoProps = {
  badge: 'VIDEO',
  title: 'See It In Action',
  subtitle: 'Watch how easy it is to get started with HostOnce.',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  thumbnailUrl: '/placeholder.svg',
};

registerSection({
  type: 'video',
  displayName: 'Video Section',
  icon: Video,
  category: 'media',
  component: VideoSection,
  settingsComponent: createSettingsWrapper(VideoSettingsContent),
  defaultProps: defaultVideoProps,
  description: 'Embedded video with optional overlay',
  pageGroup: 'General',
  pageGroupOrder: 15,
  translatableProps: ['title', 'subtitle', 'buttonText'],
  usesDataWrapper: true,
});
