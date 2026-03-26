import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DocCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  articleCount?: number;
  className?: string;
  variant?: 'default' | 'featured';
}

export const DocCard: React.FC<DocCardProps> = ({
  title,
  description,
  icon: Icon,
  to,
  articleCount,
  className,
  variant = 'default',
}) => {
  return (
    <Link to={to} className="group block">
      <Card className={cn(
        "h-full transition-all duration-300 hover:shadow-lg",
        variant === 'featured' && "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent",
        "hover:border-primary/40",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-3 rounded-xl transition-colors",
              variant === 'featured'
                ? "bg-primary/10 group-hover:bg-primary/20"
                : "bg-muted group-hover:bg-primary/10"
            )}>
              <Icon className={cn(
                "h-6 w-6",
                variant === 'featured'
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-primary"
              )} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
              
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>

              {articleCount !== undefined && (
                <p className="text-xs text-muted-foreground mt-3">
                  {articleCount} article{articleCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Smaller variant for quick links
interface QuickLinkCardProps {
  title: string;
  to: string;
  icon?: LucideIcon;
}

export const QuickLinkCard: React.FC<QuickLinkCardProps> = ({
  title,
  to,
  icon: Icon,
}) => {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/40 transition-all"
    >
      {Icon && <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />}
      <span className="text-sm font-medium group-hover:text-primary transition-colors">
        {title}
      </span>
      <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
    </Link>
  );
};

export default DocCard;
