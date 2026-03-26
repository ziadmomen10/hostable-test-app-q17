import React from 'react';
import { cn } from '@/lib/utils';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';

export interface SectionHeaderProps {
  sectionId?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  badgeClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  /** Dark mode for dark section backgrounds */
  dark?: boolean;
}

const alignmentClasses = {
  left: 'text-left',
  center: 'text-center mx-auto',
  right: 'text-right ml-auto',
};

const titleSizeClasses = {
  sm: 'text-2xl lg:text-3xl',
  md: 'text-3xl lg:text-4xl',
  lg: 'text-4xl lg:text-5xl',
};

const subtitleSizeClasses = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  sectionId,
  badge,
  title,
  subtitle,
  alignment = 'center',
  size = 'md',
  className,
  badgeClassName,
  titleClassName,
  subtitleClassName,
  dark = false,
}) => {
  return (
    <div className={cn('mb-12 lg:mb-16 max-w-3xl', alignmentClasses[alignment], className)}>
      {badge && (
        <EditableInline
          sectionId={sectionId}
          path="badge"
          className={cn(
            'inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full mb-4',
            dark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary',
            badgeClassName
          )}
        >
          <RichTextRenderer content={badge} />
        </EditableInline>
      )}
      
      <EditableElement
        as="h2"
        sectionId={sectionId}
        path="title"
        className={cn(
          'font-bold mb-4',
          titleSizeClasses[size],
          dark ? 'text-white' : 'text-foreground',
          titleClassName
        )}
      >
        <RichTextRenderer content={title} />
      </EditableElement>
      
      {subtitle && (
        <EditableElement
          as="p"
          sectionId={sectionId}
          path="subtitle"
          className={cn(
            subtitleSizeClasses[size],
            dark ? 'text-white/70' : 'text-muted-foreground',
            subtitleClassName
          )}
        >
          <RichTextRenderer content={subtitle} />
        </EditableElement>
      )}
    </div>
  );
};

export default SectionHeader;
