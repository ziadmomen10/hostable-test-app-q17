import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useUserPresence } from '@/hooks/useUserPresence';
import AnimatedCounter from '@/components/dashboard/AnimatedCounter';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  Globe, 
  Activity,
  Languages,
  Coins,
  ClipboardCheck
} from 'lucide-react';

export interface DashboardMetricsData {
  totalUsers: number;
  totalPages: number;
  totalLanguages: number;
  totalTranslations: number;
  onlineUsers: number;
  activeCurrencies: number;
  pendingSeoTasks: number;
  aiTranslatedCount: number;
  reviewedCount: number;
  loading: boolean;
  userLabel?: string;
  translationLabel?: string;
}

interface DashboardMetricsProps {
  metrics?: DashboardMetricsData;
}

const defaultMetrics: DashboardMetricsData = {
  totalUsers: 0, totalPages: 0, totalLanguages: 0, totalTranslations: 0,
  onlineUsers: 0, activeCurrencies: 0, pendingSeoTasks: 0,
  aiTranslatedCount: 0, reviewedCount: 0, loading: true,
};

const useInternalMetrics = (skip: boolean): DashboardMetricsData => {
  const { onlineCount } = useUserPresence();
  const [m, setM] = useState<DashboardMetricsData>(defaultMetrics);

  useEffect(() => {
    if (skip) return;
    const fetchData = async () => {
      try {
        const [u, p, l, t, ai, c, s] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('pages').select('*', { count: 'exact', head: true }),
          supabase.from('languages').select('*', { count: 'exact', head: true }),
          supabase.from('translations').select('*', { count: 'exact', head: true }),
          supabase.from('translations').select('*', { count: 'exact', head: true }).not('ai_provider', 'is', null),
          supabase.from('currencies').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('seo_tasks').select('*', { count: 'exact', head: true }).eq('is_completed', false),
        ]);
        const total = t.count ?? 0;
        const aiCount = ai.count ?? 0;
        setM({
          totalUsers: u.count ?? 0, totalPages: p.count ?? 0,
          totalLanguages: l.count ?? 0, totalTranslations: total,
          onlineUsers: onlineCount, activeCurrencies: c.count ?? 0,
          pendingSeoTasks: s.count ?? 0, aiTranslatedCount: aiCount,
          reviewedCount: total - aiCount, loading: false,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard metrics:', err);
        setM(prev => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, [skip]);

  useEffect(() => {
    if (skip) return;
    setM(prev => ({ ...prev, onlineUsers: onlineCount }));
  }, [onlineCount, skip]);

  return skip ? defaultMetrics : m;
};

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics: externalMetrics }) => {
  const internalMetrics = useInternalMetrics(!!externalMetrics);
  const metrics = externalMetrics ?? internalMetrics;
  const aiPercent = metrics.totalTranslations > 0
    ? ((metrics.aiTranslatedCount / metrics.totalTranslations) * 100).toFixed(1)
    : '0';
  const reviewedPercent = metrics.totalTranslations > 0
    ? ((metrics.reviewedCount / metrics.totalTranslations) * 100).toFixed(1)
    : '0';

  const userLabel = metrics.userLabel ?? 'registered';
  const translationLabel = metrics.translationLabel ?? 'total';

  const primaryMetrics = [
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      subtitle: `${metrics.totalUsers} ${userLabel}`,
      icon: Users,
      gradient: 'from-blue-500/10 to-blue-600/5',
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-500',
      glowColor: 'dark:shadow-blue-500/20 shadow-blue-500/10',
    },
    {
      title: 'Total Pages',
      value: metrics.totalPages,
      subtitle: `${metrics.totalPages} active pages`,
      icon: FileText,
      gradient: 'from-emerald-500/10 to-emerald-600/5',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-500',
      glowColor: 'dark:shadow-emerald-500/20 shadow-emerald-500/10',
    },
    {
      title: 'Active Languages',
      value: metrics.totalLanguages,
      subtitle: `${metrics.totalLanguages} configured`,
      icon: Globe,
      gradient: 'from-violet-500/10 to-violet-600/5',
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-500',
      glowColor: 'dark:shadow-violet-500/20 shadow-violet-500/10',
    },
    {
      title: 'Translations',
      value: metrics.totalTranslations,
      subtitle: `${aiPercent}% AI · ${reviewedPercent}% manual${translationLabel !== 'total' ? ` (${translationLabel})` : ''}`,
      icon: Languages,
      gradient: 'from-teal-500/10 to-teal-600/5',
      iconBg: 'bg-teal-500/15',
      iconColor: 'text-teal-400',
      glowColor: 'dark:shadow-teal-500/20 shadow-teal-500/10',
    },
  ];

  const secondaryMetrics = [
    {
      title: 'Online Now',
      value: metrics.onlineUsers,
      icon: Activity,
      iconColor: 'text-emerald-500',
      dotColor: 'bg-emerald-500',
      isLive: true,
    },
    {
      title: 'Active Currencies',
      value: metrics.activeCurrencies,
      icon: Coins,
      iconColor: 'text-blue-500',
      dotColor: 'bg-blue-500',
    },
    {
      title: 'Pending SEO Tasks',
      value: metrics.pendingSeoTasks,
      icon: ClipboardCheck,
      iconColor: 'text-rose-400',
      dotColor: metrics.pendingSeoTasks > 0 ? 'bg-rose-400' : 'bg-emerald-500',
    },
  ];

  const SkeletonValue = () => (
    <div className="h-9 w-20 bg-muted animate-pulse rounded" />
  );

  const SkeletonSubtitle = () => (
    <div className="h-3 w-28 bg-muted animate-pulse rounded mt-1" />
  );

  return (
    <div className="space-y-4">
      {/* Primary Metrics - 4 columns */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {primaryMetrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Card className={`relative overflow-hidden dark:bg-white/[0.03] bg-white backdrop-blur-xl dark:border-white/[0.08] border-slate-200 dark:shadow-xl shadow-sm ${metric.glowColor} dark:hover:bg-white/[0.06] hover:bg-slate-50 dark:hover:border-white/[0.12] hover:border-slate-300 dark:hover:shadow-2xl hover:shadow-md transition-all duration-300 rounded-2xl`}>
                {/* Gradient overlay */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${metric.gradient} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-60`} />
                <CardContent className="p-5 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                    <div className="relative">
                      <div className={`absolute inset-0 ${metric.iconBg} blur-lg rounded-full`} />
                      <div className={`relative rounded-xl p-2 ${metric.iconBg}`}>
                        <Icon className={`h-4 w-4 ${metric.iconColor}`} />
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {metrics.loading ? <SkeletonValue /> : <AnimatedCounter value={metric.value} />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {metrics.loading ? <SkeletonSubtitle /> : metric.subtitle}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Secondary Metrics - 3 columns */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {secondaryMetrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 + i * 0.06, duration: 0.35 }}
            >
              <Card className="dark:bg-white/[0.03] bg-white backdrop-blur-xl dark:border-white/[0.08] border-slate-200 dark:hover:bg-white/[0.06] hover:bg-slate-50 transition-all duration-300 rounded-2xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="relative">
                    <Icon className={`h-5 w-5 ${metric.iconColor} shrink-0`} />
                    <div className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${metric.dotColor} ${metric.isLive ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl font-bold text-foreground">
                      {metrics.loading ? '...' : <AnimatedCounter value={metric.value} />}
                    </span>
                    <span className="text-sm text-muted-foreground truncate">{metric.title}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardMetrics;
