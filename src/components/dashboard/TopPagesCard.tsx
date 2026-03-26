import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export interface PageScoreItem {
  pageId: string;
  title: string;
  url: string;
  seoScore: number;
}

interface TopPagesCardProps {
  topPages: PageScoreItem[];
  bottomPages: PageScoreItem[];
  loading?: boolean;
}

const scoreColor = (s: number) =>
  s >= 80 ? 'dark:bg-emerald-500/15 bg-emerald-50 dark:text-emerald-400 text-emerald-700 dark:border-emerald-500/30 border-emerald-200' :
  s >= 60 ? 'dark:bg-blue-500/15 bg-blue-50 dark:text-blue-400 text-blue-700 dark:border-blue-500/30 border-blue-200' :
  s >= 40 ? 'dark:bg-amber-500/15 bg-amber-50 dark:text-amber-400 text-amber-700 dark:border-amber-500/30 border-amber-200' :
  'dark:bg-red-500/15 bg-red-50 dark:text-red-400 text-red-700 dark:border-red-500/30 border-red-200';

const TopPagesCard: React.FC<TopPagesCardProps> = ({ topPages, bottomPages, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="h-full dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Page Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-6 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderList = (items: PageScoreItem[], icon: React.ElementType, label: string, emptyMsg: string) => {
    const Icon = icon;
    return (
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        {items.length > 0 ? (
          <div className="space-y-1.5">
            {items.map(page => (
              <button
                key={page.pageId}
                onClick={() => navigate(`/a93jf02kd92ms71x8qp4/seo?page=${page.pageId}`)}
                className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-muted/50 transition-colors group"
              >
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 font-bold ${scoreColor(page.seoScore)}`}>
                  {page.seoScore}
                </Badge>
                <span className="text-sm text-foreground truncate flex-1">{page.title}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-2">{emptyMsg}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm dark:hover:bg-white/[0.06] hover:bg-slate-50 dark:hover:border-white/[0.12] hover:border-slate-300 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Page Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderList(topPages, Trophy, 'Top Performers', 'No high-scoring pages yet')}
        {bottomPages.length > 0 && (
          <>
            <div className="border-t border-border/50" />
            {renderList(bottomPages, AlertTriangle, 'Needs Attention', '')}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TopPagesCard;
