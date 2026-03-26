import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';

export interface ContentFreshnessData {
  updatedToday: number;
  updatedThisWeek: number;
  updatedThisMonth: number;
  stale: number; // >30 days
  total: number;
}

interface ContentFreshnessCardProps {
  data: ContentFreshnessData;
  loading?: boolean;
}

const ContentFreshnessCard: React.FC<ContentFreshnessCardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="h-full dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" /> Content Freshness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const segments = [
    { label: 'Today', count: data.updatedToday, color: 'bg-emerald-500' },
    { label: 'This Week', count: data.updatedThisWeek, color: 'bg-blue-500' },
    { label: 'This Month', count: data.updatedThisMonth, color: 'bg-amber-500' },
    { label: 'Stale (30d+)', count: data.stale, color: 'bg-red-400' },
  ];

  return (
    <Card className="h-full dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm dark:hover:bg-white/[0.06] hover:bg-slate-50 dark:hover:border-white/[0.12] hover:border-slate-300 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" /> Content Freshness
          </CardTitle>
          <span className="text-xs text-muted-foreground">{data.total} pages</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Timeline bar */}
        {data.total > 0 ? (
          <>
            <div className="flex h-4 rounded-full overflow-hidden mb-4">
              {segments.map(seg => {
                if (seg.count === 0) return null;
                const pct = (seg.count / data.total) * 100;
                return (
                  <div
                    key={seg.label}
                    className={`${seg.color} transition-all`}
                    style={{ width: `${pct}%`, minWidth: seg.count > 0 ? '8px' : '0' }}
                    title={`${seg.label}: ${seg.count}`}
                  />
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {segments.map(seg => (
                <div key={seg.label} className="flex items-center gap-2 text-xs">
                  <div className={`h-2 w-2 rounded-full ${seg.color} shrink-0`} />
                  <span className="text-muted-foreground">{seg.label}</span>
                  <span className="font-semibold text-foreground ml-auto">{seg.count}</span>
                </div>
              ))}
            </div>
            {data.stale > 0 && (
              <div className="mt-3 p-2 rounded-md dark:bg-destructive/15 bg-red-50 border dark:border-destructive/25 border-red-200">
                <p className="text-xs dark:text-red-300 text-red-700 font-medium">
                  ⚠ {data.stale} page{data.stale !== 1 ? 's' : ''} not updated in 30+ days
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground py-6 text-center">No pages yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentFreshnessCard;
