/**
 * Team Members Section Definition
 */

import { Users } from 'lucide-react';
import TeamMembersSection from '@/components/landing/TeamMembersSection';
import TeamMembersSettingsContent from '@/components/admin/sections/TeamMembersSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultTeamMembersProps = {
  title: 'Meet Our Team',
  subtitle: 'The talented people behind our success',
  members: [
    {
      id: 'member-1',
      photo: '',
      name: 'John Doe',
      role: 'CEO & Founder',
      bio: 'Leading the company vision and strategy with 15+ years of experience in the tech industry.',
      socialLinks: [
        { id: 'sl-1', platform: 'linkedin' as const, url: 'https://linkedin.com' },
        { id: 'sl-2', platform: 'twitter' as const, url: 'https://twitter.com' },
      ],
    },
    {
      id: 'member-2',
      photo: '',
      name: 'Jane Smith',
      role: 'CTO',
      bio: 'Driving technology innovation and building scalable infrastructure for our products.',
      socialLinks: [
        { id: 'sl-3', platform: 'github' as const, url: 'https://github.com' },
        { id: 'sl-4', platform: 'linkedin' as const, url: 'https://linkedin.com' },
      ],
    },
    {
      id: 'member-3',
      photo: '',
      name: 'Mike Johnson',
      role: 'Head of Design',
      bio: 'Creating beautiful, intuitive experiences that delight our users.',
      socialLinks: [
        { id: 'sl-5', platform: 'website' as const, url: 'https://example.com' },
      ],
    },
  ],
  showSocialLinks: true,
  columns: 3,
};

registerSection({
  type: 'team-members',
  displayName: 'Team Members',
  icon: Users,
  category: 'content',
  component: TeamMembersSection,
  settingsComponent: createSettingsWrapper(TeamMembersSettingsContent),
  defaultProps: defaultTeamMembersProps,
  description: 'Team member profiles with photos, bios, and social links',
  pageGroup: 'Career Page',
  pageGroupOrder: 1,
  translatableProps: ['title', 'subtitle', 'members.*.name', 'members.*.role', 'members.*.bio'],
  usesDataWrapper: true,
  dndArrays: [
    { path: 'members', strategy: 'grid' },
  ],
});
