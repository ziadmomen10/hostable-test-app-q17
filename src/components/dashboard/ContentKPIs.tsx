import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertTriangle, Globe, Clock, FileX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/dashboard/AnimatedCounter';

export interface ContentKPIsData {
  publishedPages: number;
  inactivePages: number;
  seoIssues: number;
  missingTranslations: number;
  updatedToday: number;
  loading: boolean;
}

const ContentKPIs: React.FC<{ data: ContentKPIsData }> = ({ data }) => {
  const navigate = useNavigate();

  const kpis = [
    {
      label: 'Published Pages',
      value: data.publishedPages,
      icon: FileText,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-500/15',
      path: '/a93jf02kd92ms71x8qp4/pages',
    },
    {
      label: 'Inactive Pages',
      value: data.inactivePages,
      icon: FileX,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/15',
      path: '/a93jf02kd92ms71x8qp4/pages',
    },
    {
      label: 'SEO Issues',
      value: data.seoIssues,
      icon: AlertTriangle,
      iconColor: 'text-destructive',
      iconBg: 'bg-destructive/15',
      path: '/a93jf02kd92ms71x8qp4/seo',
    },
    {
      label: 'Missing Translations',
      value: data.missingTranslations,
      icon: Globe,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/15',
      path: '/a93jf02kd92ms71x8qp4/pages',
    },
    {
      label: 'Updated Today',
      value: data.updatedToday,
      icon: Clock,
      iconColor: 'text-muted-foreground',
      iconBg: 'bg-muted',
      path: '/a93jf02kd92ms71x8qp4/pages',
    },
  ];

  if (data.loading) {
    return (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <Card key={i} className="dark:bg-white/[0.03] bg-card border-border rounded-2xl">
            <CardContent className="p-4 space-y-2">
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              <div className="h-8 w-14 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
          >
            <Card
              className="cursor-pointer dark:bg-white/[0.03] bg-card border-border rounded-2xl dark:hover:bg-white/[0.06] hover:bg-accent/50 transition-all duration-300"
              onClick={() => navigate(kpi.path)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
                  <div className={`rounded-lg p-1.5 ${kpi.iconBg}`}>
                    <Icon className={`h-4 w-4 ${kpi.iconColor}`} strokeWidth={1.75} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  <AnimatedCounter value={kpi.value} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ContentKPIs;
