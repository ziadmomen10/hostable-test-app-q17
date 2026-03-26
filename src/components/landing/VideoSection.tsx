/**
 * Video Section Component
 * Displays an embedded video with optional overlay text and thumbnail
 */

import React, { useState } from 'react';
import { VideoSectionData } from '@/types/newSectionTypes';
import { Play } from 'lucide-react';
import { EditableElement } from '@/components/editor/EditableElement';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { SectionStyleProps } from '@/types/elementSettings';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

interface VideoSectionProps {
  data?: VideoSectionData;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultData: VideoSectionData = {
  badge: 'SEE IT IN ACTION',
  title: 'Watch How It Works',
  subtitle: 'Discover how easy it is to get started with our hosting platform',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  thumbnailUrl: '/placeholder.svg',
  overlayText: 'Click to play video',
  autoplay: false,
};

const VideoSection: React.FC<VideoSectionProps> = ({ 
  data = defaultData, 
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}) => {
  const [isPlaying, setIsPlaying] = useState(data.autoplay || false);

  const handlePlay = () => {
    if (!isEditing) {
      setIsPlaying(true);
    }
  };

  // Extract video ID for YouTube embeds
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}${data.autoplay ? '?autoplay=1' : ''}` : url;
  };

  return (
    <SectionContainer variant="muted" padding="lg" data-section="video" styleOverrides={styleOverrides}>
      {(data.title || data.subtitle || data.badge) && (
        <SectionHeader
          sectionId={sectionId}
          badge={data.badge}
          title={data.title || ''}
          subtitle={data.subtitle}
          subtitleClassName="max-w-2xl"
        />
      )}

      <div className={`max-w-4xl ${layoutProps?.contentAlignment === 'left' ? 'mr-auto' : layoutProps?.contentAlignment === 'right' ? 'ml-auto' : 'mx-auto'}`}>
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-muted">
          {!isPlaying && data.thumbnailUrl ? (
            <button
              onClick={handlePlay}
              className="relative w-full h-full group"
              disabled={isEditing}
            >
              <img
                src={data.thumbnailUrl}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
                </div>
              </div>
              {data.overlayText && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <EditableElement
                    path="overlayText"
                    sectionId={sectionId}
                    as="p"
                    className="text-white text-lg font-medium"
                  >
                    <RichTextRenderer content={data.overlayText} />
                  </EditableElement>
                </div>
              )}
            </button>
          ) : (
            <iframe
              src={getYouTubeEmbedUrl(data.videoUrl)}
              title="Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </SectionContainer>
  );
};

export default VideoSection;
