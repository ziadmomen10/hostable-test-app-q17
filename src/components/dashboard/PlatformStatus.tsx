import React, { useState, useEffect } from 'react';
import {
  Database,
  Shield,
  Wifi,
  Cloud,
  Lock,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useSystemStatus, type ServiceStatus } from '@/hooks/useSystemStatus';
import { Button } from '@/components/ui/button';

const KEY_SERVICES = ['database', 'auth', 'api', 'storage', 'realtime', 'edge-functions'];

const SERVICE_ICONS: Record<string, React.ElementType> = {
  database: Database,
  auth: Lock,
  api: Zap,
  storage: Cloud,
  realtime: Wifi,
  'edge-functions': Shield,
};

const statusColor = (s: ServiceStatus) => {
  switch (s) {
    case 'operational':
      return 'bg-emerald-500';
    case 'degraded':
      return 'bg-amber-500';
    case 'down':
      return 'bg-red-500';
    default:
      return 'bg-muted-foreground/40';
  }
};

const statusBorderColor = (s: ServiceStatus) => {
  switch (s) {
    case 'operational':
      return 'border-t-emerald-500';
    case 'degraded':
      return 'border-t-amber-500';
    case 'down':
      return 'border-t-red-500';
    default:
      return 'border-t-muted-foreground/40';
  }
};

const statusTextColor = (s: ServiceStatus) => {
  switch (s) {
    case 'operational':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'degraded':
      return 'text-amber-600 dark:text-amber-400';
    case 'down':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-muted-foreground';
  }
};

const statusIconBg = (s: ServiceStatus) => {
  switch (s) {
    case 'operational':
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
    case 'degraded':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
    case 'down':
      return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const statusLabel = (s: ServiceStatus) => {
  switch (s) {
    case 'operational':
      return 'Operational';
    case 'degraded':
      return 'Degraded';
    case 'down':
      return 'Down';
    default:
      return 'Checking';
  }
};

const overallBanner = (s: ServiceStatus) => {
  switch (s) {
    case 'operational':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        icon: CheckCircle2,
        label: 'All systems operational',
      };
    case 'degraded':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        text: 'text-amber-700 dark:text-amber-400',
        icon: AlertCircle,
        label: 'Some services degraded',
      };
    case 'down':
      return {
        bg: 'bg-red-50 dark:bg-red-950/30',
        text: 'text-red-700 dark:text-red-400',
        icon: XCircle,
        label: 'Service disruption detected',
      };
    default:
      return {
        bg: 'bg-muted',
        text: 'text-muted-foreground',
        icon: Loader2,
        label: 'Checking systems…',
      };
  }
};

const responseTimeColor = (ms: number) => {
  if (ms < 200) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30';
  if (ms < 1000) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30';
  return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30';
};

const responseTimeLabel = (ms: number) => {
  if (ms < 200) return 'Fast';
  if (ms < 1000) return 'Moderate';
  return 'Slow';
};

const PlatformStatus: React.FC = () => {
  const { services, overallStatus, isChecking, checkAllServices, lastUpdated } =
    useSystemStatus(true, 10000);

  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const displayed = services.filter((s) => KEY_SERVICES.includes(s.id));
  const banner = overallBanner(overallStatus);
  const BannerIcon = banner.icon;

  const ago = () => {
    const diff = Math.round((Date.now() - lastUpdated) / 1000);
    if (diff < 5) return 'just now';
    if (diff < 60) return `${diff}s ago`;
    return `${Math.floor(diff / 60)}m ago`;
  };

  return (
    <div className="space-y-3">
      {/* Overall banner */}
      <div
        className={`flex items-center justify-between gap-2 text-sm font-medium px-2.5 py-1.5 rounded-md ${banner.bg} ${banner.text}`}
      >
        <span className="flex items-center gap-1.5">
          <BannerIcon
            className={`h-4 w-4 ${overallStatus === 'checking' ? 'animate-spin' : ''}`}
            strokeWidth={1.75}
          />
          {banner.label}
        </span>
        <span className="text-[10px] opacity-70">{ago()}</span>
      </div>

      {/* Service grid */}
      <div className="grid grid-cols-3 gap-3">
        {displayed.map((svc) => {
          const Icon = SERVICE_ICONS[svc.id] ?? Zap;
          const checking = svc.status === 'checking';
          return (
            <div
              key={svc.id}
              className={`relative rounded-lg border border-border/50 bg-card p-4 border-t-2 ${statusBorderColor(svc.status)} transition-colors`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`rounded-full p-1.5 ${statusIconBg(svc.status)}`}>
                  <Icon
                    className="h-7 w-7"
                    strokeWidth={1.75}
                  />
                </span>
                <span className="relative flex h-3 w-3">
                  {checking && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-muted-foreground/40 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex h-3 w-3 rounded-full ${statusColor(svc.status)}`}
                  />
                </span>
              </div>
              <p className="text-sm font-medium text-foreground truncate">{svc.name}</p>
              {svc.responseTime != null ? (
                <div className="mt-1.5 inline-flex flex-col gap-0.5">
                  <p className={`text-base font-bold tabular-nums rounded-md px-2 py-0.5 inline-flex ${responseTimeColor(svc.responseTime)}`}>
                    {svc.responseTime}<span className="text-xs font-medium opacity-60 ml-0.5 self-center">ms</span>
                  </p>
                  <span className={`text-[10px] font-semibold px-1 ${svc.responseTime < 200 ? 'text-emerald-600 dark:text-emerald-400' : svc.responseTime < 1000 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                    {responseTimeLabel(svc.responseTime)}
                  </span>
                </div>
              ) : (
                <p className="text-base font-bold text-muted-foreground mt-1.5">--</p>
              )}
              <p className={`text-xs font-semibold mt-1.5 ${statusTextColor(svc.status)}`}>
                {statusLabel(svc.status)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Refresh button */}
      <div className="flex justify-end pt-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => checkAllServices()}
          disabled={isChecking}
        >
          <RefreshCw
            className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`}
            strokeWidth={1.75}
          />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default PlatformStatus;
