/**
 * AnnouncementBannerSettingsContent - Content-only settings.
 */
import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AnnouncementBannerSectionData } from '@/types/newSectionTypes';

interface AnnouncementBannerSettingsContentProps { data: AnnouncementBannerSectionData; onChange: (data: AnnouncementBannerSectionData) => void; }

const AnnouncementBannerSettingsContent: React.FC<AnnouncementBannerSettingsContentProps> = ({ data, onChange }) => {
  const updateField = useCallback(<K extends keyof AnnouncementBannerSectionData>(field: K, value: AnnouncementBannerSectionData[K]) => onChange({ ...data, [field]: value }), [data, onChange]);

  return (
    <div className="space-y-4 p-3">
      <div className="space-y-2"><Label className="text-sm font-medium">Banner Text</Label><Input value={data.text} onChange={(e) => updateField('text', e.target.value)} placeholder="🎉 Special offer! Get 50% off..." className="h-9" /><p className="text-xs text-muted-foreground">Use emojis to make it eye-catching</p></div>
      <div className="space-y-2"><Label className="text-sm font-medium">Link Text</Label><Input value={data.linkText || ''} onChange={(e) => updateField('linkText', e.target.value)} placeholder="Learn More →" className="h-9" /></div>
      <div className="space-y-2"><Label className="text-sm font-medium">Link URL</Label><Input value={data.linkUrl || ''} onChange={(e) => updateField('linkUrl', e.target.value)} placeholder="#pricing" className="h-9" /></div>
      <div className="border-t pt-3 space-y-3">
        <div className="space-y-2"><Label className="text-sm font-medium">Background Color</Label><div className="flex gap-2"><Input value={data.backgroundColor || ''} onChange={(e) => updateField('backgroundColor', e.target.value)} placeholder="hsl(82, 77%, 55%)" className="h-9 flex-1" /><input type="color" value={data.backgroundColor?.startsWith('#') ? data.backgroundColor : '#a3e635'} onChange={(e) => updateField('backgroundColor', e.target.value)} className="h-9 w-12 rounded border cursor-pointer" /></div></div>
        <div className="space-y-2"><Label className="text-sm font-medium">Text Color</Label><div className="flex gap-2"><Input value={data.textColor || ''} onChange={(e) => updateField('textColor', e.target.value)} placeholder="hsl(150, 20%, 10%)" className="h-9 flex-1" /><input type="color" value={data.textColor?.startsWith('#') ? data.textColor : '#1a2e1a'} onChange={(e) => updateField('textColor', e.target.value)} className="h-9 w-12 rounded border cursor-pointer" /></div></div>
      </div>
      <div className="border-t pt-3"><div className="flex items-center justify-between"><div className="space-y-0.5"><Label className="text-sm">Allow Dismiss</Label><p className="text-xs text-muted-foreground">Show close button</p></div><Switch checked={data.dismissible} onCheckedChange={(checked) => updateField('dismissible', checked)} /></div></div>
    </div>
  );
};

export default AnnouncementBannerSettingsContent;
