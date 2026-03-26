import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { DocVersionBadge } from './DocVersionBadge';

type BadgeType = 'new' | 'updated' | 'deprecated' | 'beta' | 'stable' | 'experimental';

interface DocArticleHeaderProps {
  title: string;
  description?: string;
  category?: string;
  categoryHref?: string;
  lastUpdated?: string;
  readingTime?: number;
  tags?: string[];
  badges?: { type: BadgeType; label?: string }[];
  className?: string;
}

export const DocArticleHeader: React.FC<DocArticleHeaderProps> = ({
  title,
  description,
  category,
  categoryHref,
  lastUpdated,
  readingTime,
  tags,
  badges = [],
  className,
}) => {
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("mb-12 pb-8 border-b border-border", className)}
    >
      {/* Category Badge */}
      {category && (
        <div className="mb-4">
          {categoryHref ? (
            <a
              href={categoryHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {category}
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {category}
            </span>
          )}
        </div>
      )}

      {/* Title with Badges */}
      <div className="flex flex-wrap items-start gap-3 mb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          {title}
        </h1>
        {badges.map((badge, index) => (
          <DocVersionBadge
            key={index}
            type={badge.type}
            version={badge.label}
            size="md"
            className="mt-2"
          />
        ))}
      </div>

      {/* Description - Lead paragraph style */}
      {description && (
        <p className="text-lg md:text-xl text-muted-foreground/85 mb-6 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}

      {/* Metadata Bar */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {formattedDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Updated {formattedDate}</span>
          </div>
        )}
        
        {readingTime && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        )}
        
        {tags && tags.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Tag className="h-4 w-4" />
            <div className="flex gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default DocArticleHeader;
