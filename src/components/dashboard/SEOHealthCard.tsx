import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Search, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SEOHealthData {
  avgSeo: number;
  avgAeo: number;
  avgGeo: number;
  totalPages: number;
}

export interface SEOTrendPoint {
  week: string;
  score: number;
}

interface SEOIssue {
  count: number;
  label: string;
}

interface SEOHealthCardProps {
  data: SEOHealthData;
  loading?: boolean;
  uncoveredPages?: number;
  trend?: SEOTrendPoint[];
  issues?: SEOIssue[];
}

const SEOHealthCard: React.FC<SEOHealthCardProps> = ({ data, loading, uncoveredPages = 0, trend, issues }) => {
  const navigate = useNavigate();
  const combined = data.totalPages > 0
    ? Math.round(data.avgSeo * 0.5 + data.avgAeo * 0.25 + data.avgGeo * 0.25)
    : 0;

  const scoreColor = combined >= 80 ? 'dark:text-emerald-300 text-emerald-600' : combined >= 60 ? 'dark:text-sky-300 text-sky-600' : combined >= 40 ? 'dark:text-amber-200 text-amber-600' : 'dark:text-red-300 text-red-600';
  const scoreLabel = combined >= 80 ? 'Excellent' : combined >= 60 ? 'Good' : combined >= 40 ? 'Fair' : 'Needs Work';

  const scores = [
    { label: 'SEO', value: Math.round(data.avgSeo), color: 'bg-blue-500' },
    { label: 'AEO', value: Math.round(data.avgAeo), color: 'bg-violet-500' },
    { label: 'GEO', value: Math.round(data.avgGeo), color: 'bg-emerald-500' },
  ];

  if (loading) {
    return (
      <Card className="h-full dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" /> SEO Health
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
            <Search className="h-4 w-4 text-primary" /> SEO Health
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => navigate('/a93jf02kd92ms71x8qp4/seo')}>
            Details <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex items-center justify-center">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke={combined >= 80 ? 'hsl(160, 55%, 55%)' : combined >= 60 ? 'hsl(200, 70%, 60%)' : combined >= 40 ? 'hsl(45, 70%, 65%)' : 'hsl(0, 60%, 60%)'}
                strokeWidth="3"
                strokeDasharray={`${(combined / 100) * 88} 88`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <div className={`text-lg font-bold ${scoreColor}`}>{combined}</div>
            </div>
          </div>
          <div className="flex-1">
            <div className={`text-sm font-semibold ${scoreColor}`}>{scoreLabel}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Combined score across {data.totalPages} page{data.totalPages !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Trend Sparkline */}
        {trend && trend.length > 1 && (
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-1">4-week trend</div>
            <div className="h-[40px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {uncoveredPages > 0 && (
          <div className="flex items-center gap-2 text-xs dark:text-amber-200 text-amber-700 dark:bg-amber-950/50 bg-amber-50 border dark:border-amber-800/30 border-amber-200 rounded-md px-3 py-2 mb-1">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>{uncoveredPages} page{uncoveredPages !== 1 ? 's' : ''} have no SEO data</span>
          </div>
        )}

        <div className="space-y-2.5">
          {scores.map(s => (
            <div key={s.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-medium text-foreground">{s.value}/100</span>
              </div>
              <Progress value={s.value} className="h-1.5" indicatorClassName={s.color} />
            </div>
          ))}
        </div>

        {/* Actionable SEO Issues */}
        {issues && (
          <div className="mt-4 pt-3 border-t border-border">
            {issues.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                No SEO issues detected
              </div>
            ) : (
              <div className="space-y-1.5">
                {issues.map((issue, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" strokeWidth={1.75} />
                    <span><span className="font-semibold text-foreground">{issue.count}</span> {issue.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SEOHealthCard;
