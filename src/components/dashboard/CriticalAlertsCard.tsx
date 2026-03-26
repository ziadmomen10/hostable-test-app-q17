import React from 'react';
import { AlertTriangle, TrendingDown, Globe, FileText, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface AlertItem {
  id: string;
  type: 'seo_overdue' | 'zero_coverage' | 'low_seo' | 'stale_content';
  message: string;
  severity: 'critical' | 'warning';
  link?: string;
}

interface CriticalAlertsCardProps {
  alerts: AlertItem[];
  loading?: boolean;
}

const ALERT_ICONS: Record<string, React.ElementType> = {
  seo_overdue: Clock,
  zero_coverage: Globe,
  low_seo: TrendingDown,
  stale_content: FileText,
};

const CriticalAlertsCard: React.FC<CriticalAlertsCardProps> = ({ alerts, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/30 dark:bg-white/[0.03] bg-white backdrop-blur-xl p-3 animate-pulse">
        <div className="h-4 w-48 bg-muted rounded" />
      </div>
    );
  }

  if (alerts.length === 0) return null;

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border dark:border-white/[0.08] border-slate-200 dark:bg-white/[0.03] bg-white backdrop-blur-xl p-4 space-y-3 dark:shadow-xl shadow-sm"
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full" />
          <AlertTriangle className="h-4 w-4 dark:text-amber-300 text-amber-600 relative z-10" />
        </div>
        <span className="text-sm font-semibold text-foreground">
          {criticalCount > 0 && `${criticalCount} critical`}
          {criticalCount > 0 && warningCount > 0 && ' · '}
          {warningCount > 0 && `${warningCount} warning${warningCount > 1 ? 's' : ''}`}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {alerts.slice(0, 5).map((alert, i) => {
            const Icon = ALERT_ICONS[alert.type] ?? AlertTriangle;
            return (
              <motion.button
                key={alert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => alert.link && navigate(alert.link)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer backdrop-blur-sm border ${
                  alert.severity === 'critical'
                    ? 'dark:bg-red-950/60 dark:text-red-200 dark:border-red-800/40 bg-red-50 text-red-600 border-red-200/80 hover:bg-red-100'
                    : 'dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800/30 bg-amber-50 text-amber-600 border-amber-200/80 hover:bg-amber-100'
                }`}
              >
                <Icon className="h-3 w-3 shrink-0" />
                <span className="truncate max-w-[200px]">{alert.message}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CriticalAlertsCard;
