/**
 * Contact Settings Content
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { ContactSectionData, ContactChannel } from '@/types/newSectionTypes';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { MessageCircle, Phone, Mail, Ticket } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionHeaderFields, IconPicker, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface ContactSettingsContentProps {
  data: ContactSectionData;
  onChange: (data: ContactSectionData) => void;
}

const ContactSettingsContent: React.FC<ContactSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateFields, updateArray } = useDataChangeHandlers(data, onChange);

  const handleChannelsChange = useCallback((channels: ContactChannel[]) => {
    updateArray('channels', channels);
  }, [updateArray]);

  const createNewChannel = useCallback((): ContactChannel => ({
    icon: 'MessageCircle',
    type: 'chat',
    title: 'New Channel',
    description: 'Contact us through this channel',
    value: '',
    buttonText: 'Contact Us',
  }), []);

  const getChannelIcon = (channel: ContactChannel) => {
    switch (channel.type) {
      case 'phone': return <Phone className="h-3 w-3 text-green-500" />;
      case 'email': return <Mail className="h-3 w-3 text-blue-500" />;
      case 'ticket': return <Ticket className="h-3 w-3 text-purple-500" />;
      default: return <MessageCircle className="h-3 w-3 text-primary" />;
    }
  };

  return (
    <div className="space-y-4 p-3">
      <SectionHeaderFields
        badge={data.badge || ''}
        title={data.title}
        subtitle={data.subtitle || ''}
        onBadgeChange={(badge) => updateFields({ badge })}
        onTitleChange={(title) => updateFields({ title })}
        onSubtitleChange={(subtitle) => updateFields({ subtitle })}
      />

      <ItemListEditor
        items={data.channels}
        onItemsChange={handleChannelsChange}
        createNewItem={createNewChannel}
        getItemTitle={(channel) => channel.title || 'Untitled Channel'}
        getItemSubtitle={(channel) => channel.type}
        getItemIcon={getChannelIcon}
        addItemLabel="Add Channel"
        emptyMessage="No channels. Add one to get started."
        emptyStateIcon={<MessageCircle className="h-10 w-10 text-muted-foreground/50 mb-2" />}
        minItems={1}
        maxItems={8}
        showDuplicateButton
        confirmDelete
        renderItem={(channel, index, onUpdate) => (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px]">Icon</Label>
                <IconPicker
                  value={channel.icon}
                  onChange={(icon) => onUpdate({ icon })}
                />
              </div>
              <div>
                <Label className="text-[10px]">Type</Label>
                <Select
                  value={channel.type}
                  onValueChange={(value) => onUpdate({ type: value as 'chat' | 'phone' | 'email' | 'ticket' })}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chat" className="text-xs">Chat</SelectItem>
                    <SelectItem value="phone" className="text-xs">Phone</SelectItem>
                    <SelectItem value="email" className="text-xs">Email</SelectItem>
                    <SelectItem value="ticket" className="text-xs">Ticket</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-[10px]">Title</Label>
              <DebouncedInput
                value={channel.title}
                onChange={(value) => onUpdate({ title: value })}
                className="h-7 text-xs"
                debounceMs={300}
              />
            </div>
            <div>
              <Label className="text-[10px]">Description</Label>
              <DebouncedInput
                value={channel.description}
                onChange={(value) => onUpdate({ description: value })}
                className="h-7 text-xs"
                debounceMs={300}
              />
            </div>
            <div>
              <Label className="text-[10px]">Value (phone/email/etc)</Label>
              <DebouncedInput
                value={channel.value}
                onChange={(value) => onUpdate({ value: value })}
                placeholder="+1 (555) 123-4567"
                className="h-7 text-xs"
                debounceMs={300}
              />
            </div>
            <div>
              <Label className="text-[10px]">Button Text</Label>
              <DebouncedInput
                value={channel.buttonText}
                onChange={(value) => onUpdate({ buttonText: value })}
                className="h-7 text-xs"
                debounceMs={300}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default ContactSettingsContent;
