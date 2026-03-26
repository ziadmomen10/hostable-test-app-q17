import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getRecentlyUpdatedArticles } from '@/content/documentation';

interface DocRecentlyUpdatedProps {
  className?: string;
  count?: number;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return '1 month ago';
  return date.toLocaleDateString();
}

export const DocRecentlyUpdated: React.FC<DocRecentlyUpdatedProps> = ({ 
  className,
  count = 5 
}) => {
  const recentArticles = getRecentlyUpdatedArticles(count);

  if (recentArticles.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        Recently Updated
      </h3>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recentArticles.map((article) => (
          <Link
            key={`${article.category}-${article.slug}`}
            to={`/a93jf02kd92ms71x8qp4/documentation/${article.category}/${article.slug}`}
            className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                {article.title}
              </p>
              <Badge 
                variant="secondary" 
                className={cn(
                  "flex-shrink-0 text-xs",
                  article.category === 'user' 
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                    : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                )}
              >
                {article.category === 'user' ? 'User' : 'Dev'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {article.description}
            </p>
            <p className="text-xs text-muted-foreground/70">
              Updated {formatRelativeTime(article.lastUpdated)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
