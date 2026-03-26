/**
 * Announcement Banner Section
 * Dismissible promotional banner at the top of a page
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AnnouncementBannerSectionData } from '@/types/newSectionTypes';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import type { SectionStyleProps } from '@/types/elementSettings';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

interface AnnouncementBannerSectionProps {
  data?: AnnouncementBannerSectionData;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultData: AnnouncementBannerSectionData = {
  text: '🎉 Special Offer: Get 50% off your first year of hosting!',
  linkText: 'Claim Now',
  linkUrl: '#pricing',
  backgroundColor: 'hsl(var(--primary))',
  textColor: 'hsl(var(--primary-foreground))',
  dismissible: true,
};

const AnnouncementBannerSection: React.FC<AnnouncementBannerSectionProps> = ({ 
  data = defaultData, 
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // In editor mode, never hide the banner
  if (isDismissed && !isEditing) {
    return null;
  }

  const bgColor = data.backgroundColor || 'hsl(var(--primary))';
  const txtColor = data.textColor || 'hsl(var(--primary-foreground))';
  
  // Apply content alignment from layoutProps
  const alignClass = layoutProps?.contentAlignment === 'left' 
    ? 'justify-start' 
    : layoutProps?.contentAlignment === 'right' 
      ? 'justify-end' 
      : 'justify-center';

  return (
    <section 
      className="relative py-3 px-4 min-h-[48px]"
      style={{ background: bgColor }}
      data-section="announcement-banner"
    >
      <div className={`container mx-auto flex items-center ${alignClass} gap-4`}>
        <p 
          className="text-sm font-medium text-center"
          style={{ color: txtColor }}
        >
          <EditableInline
            path="text"
            sectionId={sectionId}
            className="inline"
          >
            <RichTextRenderer content={data.text} />
          </EditableInline>
          {data.linkText && data.linkUrl && (
            <>
              {' '}
              <a 
                href={data.linkUrl}
                className="underline font-bold hover:no-underline transition-all"
                style={{ color: txtColor }}
              >
                <EditableInline
                  path="linkText"
                  sectionId={sectionId}
                  className="inline"
                >
                  <RichTextRenderer content={data.linkText} />
                </EditableInline>
                {' →'}
              </a>
            </>
          )}
        </p>

        {data.dismissible && !isEditing && (
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute right-4 p-1 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" style={{ color: txtColor }} />
          </button>
        )}
      </div>
    </section>
  );
};

export default AnnouncementBannerSection;
