/**
 * TeamMembersSettingsContent
 * 
 * Settings panel for the Team Members section.
 * Manages team member cards with photo, name, role, bio, and nested social links.
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionHeaderFields, ItemListEditor, ImageField } from './shared';
import { TeamMembersSectionData, TeamMember, SocialLink } from '@/components/landing/TeamMembersSection';

interface TeamMembersSettingsContentProps {
  data: TeamMembersSectionData;
  onUpdate: (updates: Partial<TeamMembersSectionData>) => void;
}

// ============================================================================
// Social Link Editor (Nested)
// ============================================================================

const SocialLinkEditor: React.FC<{
  links: SocialLink[];
  onLinksChange: (links: SocialLink[]) => void;
}> = ({ links, onLinksChange }) => {
  const createNewLink = (): SocialLink => ({
    id: crypto.randomUUID(),
    platform: 'linkedin',
    url: '',
  });

  return (
    <ItemListEditor
      items={links}
      onItemsChange={onLinksChange}
      createNewItem={createNewLink}
      addItemLabel="Add Social Link"
      renderItem={(link, _index, onLinkUpdate) => (
        <div className="flex gap-2 items-center">
          <Select
            value={link.platform}
            onValueChange={(value) => onLinkUpdate({ platform: value as SocialLink['platform'] })}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
              <SelectItem value="website">Website</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={link.url}
            onChange={(e) => onLinkUpdate({ url: e.target.value })}
            placeholder="https://..."
            className="flex-1"
          />
        </div>
      )}
    />
  );
};

// ============================================================================
// Main Settings Component
// ============================================================================

export const TeamMembersSettingsContent: React.FC<TeamMembersSettingsContentProps> = ({
  data,
  onUpdate,
}) => {
  const {
    title = 'Meet Our Team',
    subtitle = '',
    members = [],
    showSocialLinks = true,
    columns = 3,
  } = data;

  const createNewMember = (): TeamMember => ({
    id: crypto.randomUUID(),
    photo: '',
    name: 'New Member',
    role: 'Role',
    bio: 'Bio description here.',
    socialLinks: [],
  });

  return (
    <div className="space-y-6">
      {/* Section Header Fields */}
      <SectionHeaderFields
        title={title}
        subtitle={subtitle}
        onTitleChange={(value) => onUpdate({ title: value })}
        onSubtitleChange={(value) => onUpdate({ subtitle: value })}
      />

      {/* Layout Options */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-medium">Layout Options</h4>
        
        <div className="space-y-2">
          <Label className="text-xs">Columns</Label>
          <Select
            value={String(columns)}
            onValueChange={(value) => onUpdate({ columns: Number(value) as 2 | 3 | 4 })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Columns</SelectItem>
              <SelectItem value="3">3 Columns</SelectItem>
              <SelectItem value="4">4 Columns</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Social Links</Label>
          <Switch
            checked={showSocialLinks}
            onCheckedChange={(checked) => onUpdate({ showSocialLinks: checked })}
          />
        </div>
      </div>

      {/* Team Members List */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-medium">Team Members</h4>
        
        <ItemListEditor
          items={members}
          onItemsChange={(newMembers) => onUpdate({ members: newMembers })}
          createNewItem={createNewMember}
          addItemLabel="Add Team Member"
          renderItem={(member, _index, onMemberUpdate) => (
            <div className="space-y-4">
              {/* Photo */}
              <ImageField
                src={member.photo}
                onChange={(url) => onMemberUpdate({ photo: url })}
                label="Photo"
                placeholder="/placeholder.svg"
                previewSize="md"
              />

              {/* Name */}
              <div className="space-y-1.5">
                <Label className="text-xs">Name</Label>
                <Input
                  value={member.name}
                  onChange={(e) => onMemberUpdate({ name: e.target.value })}
                  placeholder="Full name"
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <Label className="text-xs">Role</Label>
                <Input
                  value={member.role}
                  onChange={(e) => onMemberUpdate({ role: e.target.value })}
                  placeholder="Job title"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <Label className="text-xs">Bio</Label>
                <Textarea
                  value={member.bio}
                  onChange={(e) => onMemberUpdate({ bio: e.target.value })}
                  placeholder="Short biography"
                  rows={3}
                />
              </div>

              {/* Social Links (Nested) */}
              <div className="space-y-2">
                <Label className="text-xs">Social Links</Label>
                <SocialLinkEditor
                  links={member.socialLinks || []}
                  onLinksChange={(links) => onMemberUpdate({ socialLinks: links })}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default TeamMembersSettingsContent;
