/**
 * TeamMembersSection
 * 
 * Displays a grid of team member cards with photo, name, role, bio, and optional social links.
 * Supports 2, 3, or 4 column layouts with full style customization.
 */

import React from 'react';
import { Linkedin, Twitter, Github, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionContainer, SectionHeader } from './shared';
import { BaseSectionData, BaseSectionProps } from '@/types/baseSectionTypes';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// ============================================================================
// Types
// ============================================================================

export interface SocialLink {
  id: string;
  platform: 'linkedin' | 'twitter' | 'github' | 'website';
  url: string;
}

export interface TeamMember {
  id: string;
  photo: string;
  name: string;
  role: string;
  bio: string;
  socialLinks: SocialLink[];
}

export interface TeamMembersSectionData extends BaseSectionData {
  members: TeamMember[];
  showSocialLinks: boolean;
  columns?: 2 | 3 | 4;
}

export interface TeamMembersSectionProps extends BaseSectionProps {
  data: TeamMembersSectionData;
}

// ============================================================================
// Helper Components
// ============================================================================

const SocialIcon: React.FC<{ platform: SocialLink['platform']; className?: string }> = ({ 
  platform, 
  className 
}) => {
  const iconProps = { className: cn('w-4 h-4', className) };
  
  switch (platform) {
    case 'linkedin':
      return <Linkedin {...iconProps} />;
    case 'twitter':
      return <Twitter {...iconProps} />;
    case 'github':
      return <Github {...iconProps} />;
    case 'website':
      return <Globe {...iconProps} />;
    default:
      return <Globe {...iconProps} />;
  }
};

const TeamMemberCard: React.FC<{
  member: TeamMember;
  showSocialLinks: boolean;
}> = ({ member, showSocialLinks }) => {
  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="group bg-card rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg border border-border/50">
      {/* Photo */}
      <Avatar className="w-24 h-24 mx-auto mb-4 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
        <AvatarImage src={member.photo} alt={member.name} />
        <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Name */}
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {member.name}
      </h3>

      {/* Role */}
      <p className="text-sm font-medium text-primary mb-3">
        {member.role}
      </p>

      {/* Bio */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {member.bio}
      </p>

      {/* Social Links */}
      {showSocialLinks && member.socialLinks && member.socialLinks.length > 0 && (
        <div className="flex justify-center gap-3">
          {member.socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label={`${member.name}'s ${link.platform}`}
            >
              <SocialIcon platform={link.platform} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  data,
  isEditing = false,
  sectionId = '',
  styleOverrides,
  layoutProps,
}) => {
  const {
    title = 'Meet Our Team',
    subtitle = 'The talented people behind our success',
    members = [],
    showSocialLinks = true,
    columns = 3,
  } = data;

  // DnD support for editor mode
  const { SortableWrapper, getItemProps, items } = useArrayItems('members', members);

  // Grid column classes based on columns prop
  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  const gap = layoutProps?.gap ?? 'default';
  const gapClasses: Record<string, string> = {
    none: 'gap-0',
    small: 'gap-4',
    default: 'gap-6',
    large: 'gap-8',
    xlarge: 'gap-12',
  };

  return (
    <SectionContainer
      styleOverrides={styleOverrides}
    >
      {/* Header */}
      {(title || subtitle) && (
        <SectionHeader
          title={title}
          subtitle={subtitle}
          className="mb-12"
        />
      )}

      {/* Team Grid */}
      <SortableWrapper>
        <div className={cn('grid', gridColsClass, gapClasses[gap] || gapClasses.default)}>
          {items.map((member, index) => {
            if (isEditing) {
              const itemProps = getItemProps(index);
              return (
                <SortableItem
                  key={member.id || itemProps.id}
                  {...itemProps}
                >
                  <TeamMemberCard
                    member={member}
                    showSocialLinks={showSocialLinks}
                  />
                </SortableItem>
              );
            }

            return (
              <TeamMemberCard
                key={member.id}
                member={member}
                showSocialLinks={showSocialLinks}
              />
            );
          })}
        </div>
      </SortableWrapper>

      {/* Empty state for editor */}
      {items.length === 0 && isEditing && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No team members yet. Add some in the settings panel.</p>
        </div>
      )}
    </SectionContainer>
  );
};

export default TeamMembersSection;
