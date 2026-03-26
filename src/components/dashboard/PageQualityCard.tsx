import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export interface PageQualityData {
  excellent: number; // 80+
  good: number;      // 60-79
  fair: number;      // 40-59
  needsWork: number; // <40
  uncovered?: number; // pages with no SEO data
}

interface PageQualityCardProps {
  data: PageQualityData;
  loading?: boolean;
}

const tiers = [
  { key: 'excellent' as const, label: 'Excellent (80+)', color: 'bg-emerald-500', textColor: 'dark:text-emerald-300 text-emerald-600' },
  { key: 'good' as const, label: 'Good (60-79)', color: 'bg-sky-500', textColor: 'dark:text-sky-300 text-sky-600' },
  { key: 'fair' as const, label: 'Fair (40-59)', color: 'bg-amber-500', textColor: 'dark:text-amber-200 text-amber-600' },
  { key: 'needsWork' as const, label: 'Needs Work (<40)', color: 'bg-red-400', textColor: 'dark:text-red-300 text-red-600' },
  { key: 'uncovered' as const, label: 'No SEO Data', color: 'bg-muted-foreground/30', textColor: 'text-muted-foreground' },
];

const PageQualityCard: React.FC<PageQualityCardProps> = ({ data, loading }) => {
  const qualityData = { ...data, uncovered: data.uncovered ?? 0 };
  const total = qualityData.excellent + qualityData.good + qualityData.fair + qualityData.needsWork + qualityData.uncovered;

  if (loading) {
    return (
      <Card className="h-full dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Page Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm dark:hover:bg-white/[0.06] hover:bg-slate-50 dark:hover:border-white/[0.12] hover:border-slate-300 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Page Quality Distribution
          </CardTitle>
          <span className="text-xs text-muted-foreground">{total} page{total !== 1 ? 's' : ''}</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stacked bar */}
        {total > 0 ? (
          <>
            <div className="flex h-6 rounded-full overflow-hidden mb-4">
              {tiers.map(tier => {
                const count = qualityData[tier.key];
                if (count === 0) return null;
                const pct = (count / total) * 100;
                return (
                  <div
                    key={tier.key}
                    className={`${tier.color} flex items-center justify-center text-[10px] font-bold text-white transition-all`}
                    style={{ width: `${pct}%`, minWidth: count > 0 ? '20px' : '0' }}
                    title={`${tier.label}: ${count}`}
                  >
                    {pct >= 15 ? count : ''}
                  </div>
                );
              })}
            </div>
            <div className="space-y-2">
              {tiers.filter(tier => qualityData[tier.key] > 0).map(tier => (
                <div key={tier.key} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${tier.color}`} />
                    <span className="text-muted-foreground">{tier.label}</span>
                  </div>
                  <span className={`font-semibold ${tier.textColor}`}>{qualityData[tier.key]}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground py-6 text-center">No SEO data available yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PageQualityCard;
