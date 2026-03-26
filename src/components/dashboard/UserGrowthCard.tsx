import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export interface DailySignup {
  date: string;
  label: string;
  count: number;
}

interface UserGrowthCardProps {
  data: DailySignup[];
  loading?: boolean;
  dateLabel?: string;
}

const UserGrowthCard: React.FC<UserGrowthCardProps> = ({ data, loading, dateLabel = 'last 30d' }) => {
  if (loading) {
    return (
      <Card className="h-full dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> User Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] bg-muted/30 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((s, d) => s + d.count, 0);
  const halfLen = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, halfLen).reduce((s, d) => s + d.count, 0);
  const secondHalf = data.slice(halfLen).reduce((s, d) => s + d.count, 0);
  const trending = secondHalf >= firstHalf;

  return (
    <Card className="h-full dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm dark:hover:bg-white/[0.06] hover:bg-slate-50 dark:hover:border-white/[0.12] hover:border-slate-300 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> User Growth
          </CardTitle>
          <div className="flex items-center gap-1.5 text-xs">
            {trending ? (
              <TrendingUp className="h-3.5 w-3.5 dark:text-emerald-400 text-emerald-600" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 dark:text-red-400 text-red-600" />
            )}
            <span className="font-medium text-foreground">{total} new</span>
            <span className="text-muted-foreground">{dateLabel}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [value, 'Signups']}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#userGrowthGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-8 text-center">No signup data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserGrowthCard;
