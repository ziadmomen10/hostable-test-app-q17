import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, BookOpen, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface RelatedArticle {
  title: string;
  href: string;
  category?: string;
}

interface DocArticleFooterProps {
  lastUpdated?: string;
  tags?: string[];
  relatedArticles?: RelatedArticle[];
  className?: string;
}

export const DocArticleFooter: React.FC<DocArticleFooterProps> = ({
  lastUpdated,
  tags,
  relatedArticles,
  className,
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(helpful ? 'yes' : 'no');
    toast.success(
      helpful
        ? 'Thanks for your feedback! Glad this was helpful.'
        : 'Thanks for letting us know. We\'ll work to improve this article.',
      { duration: 3000 }
    );
  };

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <footer className={cn("mt-12 pt-8 border-t border-border space-y-8", className)}>
      {/* Feedback Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
        <span className="text-sm font-medium text-foreground">
          Was this article helpful?
        </span>
        <AnimatePresence mode="wait">
          {feedbackGiven ? (
            <motion.span
              key="thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-muted-foreground"
            >
              Thanks for your feedback!
            </motion.span>
          ) : (
            <motion.div
              key="buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedback(true)}
                className="gap-1.5"
              >
                <ThumbsUp className="h-4 w-4" />
                Yes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedback(false)}
                className="gap-1.5"
              >
                <ThumbsDown className="h-4 w-4" />
                No
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">Related Articles</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedArticles.map((article) => (
              <Link
                key={article.href}
                to={article.href}
                className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
              >
                <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="min-w-0">
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {article.title}
                  </span>
                  {article.category && (
                    <span className="text-xs text-muted-foreground">
                      {article.category}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Tags:</span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Last Updated */}
      {formattedDate && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Last updated: {formattedDate}</span>
        </div>
      )}
    </footer>
  );
};

export default DocArticleFooter;
