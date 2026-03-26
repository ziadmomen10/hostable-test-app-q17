import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export interface WeeklyTranslation {
  week: string;
  label: string;
  count: number;
}

interface TranslationVelocityCardProps {
  data: WeeklyTranslation[];
  loading?: boolean;
}

const TranslationVelocityCard: React.FC<TranslationVelocityCardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="h-full dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Translation Velocity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const thisWeek = data[0]?.count ?? 0;
  const lastWeek = data[1]?.count ?? 0;
  const changePercent = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : thisWeek > 0 ? 100 : 0;
  const TrendIcon = changePercent > 0 ? TrendingUp : changePercent < 0 ? TrendingDown : Minus;
  const trendColor = changePercent > 0 ? 'dark:text-emerald-400 text-emerald-600' : changePercent < 0 ? 'dark:text-red-400 text-red-600' : 'text-muted-foreground';

  return (
    <Card className="h-full dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm dark:hover:bg-white/[0.06] hover:bg-slate-50 dark:hover:border-white/[0.12] hover:border-slate-300 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Translation Velocity
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-2xl font-bold text-foreground">{thisWeek.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">this week</span>
          {lastWeek > 0 && (
            <div className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
              <TrendIcon className="h-3 w-3" />
              {Math.abs(changePercent)}%
            </div>
          )}
        </div>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={[...data].reverse()}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
                formatter={(v: number) => [v.toLocaleString(), 'Translations']}
              />
              <Bar dataKey="count" fill="hsl(262, 83%, 58%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">No translation history data</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TranslationVelocityCard;
