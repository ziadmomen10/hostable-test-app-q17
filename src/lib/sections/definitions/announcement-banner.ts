/**
 * Announcement Banner Section Definition
 */

import { Bell } from 'lucide-react';
import AnnouncementBannerSection from '@/components/landing/AnnouncementBannerSection';
import AnnouncementBannerSettingsContent from '@/components/admin/sections/AnnouncementBannerSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultAnnouncementBannerProps = {
  text: '🎉 Special offer! Get 50% off your first month',
  linkText: 'Learn more',
  linkUrl: '#',
  dismissible: true,
};

registerSection({
  type: 'announcement-banner',
  displayName: 'Announcement Banner',
  icon: Bell,
  category: 'layout',
  component: AnnouncementBannerSection,
  settingsComponent: createSettingsWrapper(AnnouncementBannerSettingsContent),
  defaultProps: defaultAnnouncementBannerProps,
  description: 'Top banner for announcements',
  pageGroup: 'General',
  pageGroupOrder: 10,
  translatableProps: ['text', 'linkText'],
  usesDataWrapper: true,
});
