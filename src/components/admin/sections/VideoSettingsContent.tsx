/**
 * VideoSettingsContent - Content-only settings.
 */
import React from 'react';
import { VideoSectionData } from '@/types/newSectionTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { SectionHeaderFields } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface VideoSettingsContentProps { data: VideoSectionData; onChange: (data: VideoSectionData) => void; }

const VideoSettingsContent: React.FC<VideoSettingsContentProps> = ({ data, onChange }) => {
  const { updateField } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields badge={data.badge || ''} title={data.title || ''} subtitle={data.subtitle || ''} onBadgeChange={(badge) => updateField('badge', badge)} onTitleChange={(title) => updateField('title', title)} onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)} />
      <div className="border-t pt-4 space-y-3">
        <h4 className="font-medium text-sm mb-3">Video Settings</h4>
        <div><Label className="text-xs">Video URL</Label><Input value={data.videoUrl} onChange={(e) => updateField('videoUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." className="h-8 text-xs" /><p className="text-[10px] text-muted-foreground mt-1">Supports YouTube, Vimeo, or direct video URLs</p></div>
        <div><Label className="text-xs">Thumbnail URL (optional)</Label><Input value={data.thumbnailUrl || ''} onChange={(e) => updateField('thumbnailUrl', e.target.value)} placeholder="/images/video-thumbnail.jpg" className="h-8 text-xs" /></div>
        <div><Label className="text-xs">Overlay Text (optional)</Label><Textarea value={data.overlayText || ''} onChange={(e) => updateField('overlayText', e.target.value)} placeholder="Watch our 2-minute demo..." className="text-xs min-h-[60px] resize-none" /></div>
        <div className="flex items-center justify-between"><div><Label className="text-xs">Autoplay</Label><p className="text-[10px] text-muted-foreground">Start playing automatically</p></div><Switch checked={data.autoplay || false} onCheckedChange={(checked) => updateField('autoplay', checked)} /></div>
      </div>
    </div>
  );
};

export default VideoSettingsContent;
