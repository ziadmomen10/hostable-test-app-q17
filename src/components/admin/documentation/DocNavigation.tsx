import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocArticle } from '@/content/documentation';

interface DocNavigationProps {
  prev?: DocArticle;
  next?: DocArticle;
  className?: string;
}

export const DocNavigation: React.FC<DocNavigationProps> = ({
  prev,
  next,
  className,
}) => {
  if (!prev && !next) return null;

  return (
    <nav
      className={cn(
        "flex items-stretch gap-6 mt-16 pt-10 border-t-2 border-border",
        className
      )}
    >
      {prev ? (
        <Link
          to={`/a93jf02kd92ms71x8qp4/documentation/${prev.category}/${prev.slug}`}
          className="group flex-1 flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/50 transition-all"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-0.5">Previous</p>
            <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
              {prev.title}
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          to={`/a93jf02kd92ms71x8qp4/documentation/${next.category}/${next.slug}`}
          className="group flex-1 flex items-center justify-end gap-3 p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/50 transition-all text-right"
        >
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-0.5">Next</p>
            <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
              {next.title}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
};

export default DocNavigation;
