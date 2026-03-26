import React, { useState, useEffect } from 'react';
import { Bell, Check, AlertTriangle, TrendingDown, Globe, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import type { AlertItem } from '@/components/dashboard/CriticalAlertsCard';

const ALERT_ICONS: Record<string, React.ElementType> = {
  seo_overdue: Clock,
  zero_coverage: Globe,
  low_seo: TrendingDown,
  stale_content: FileText,
};

interface NotificationCenterProps {
  alerts: AlertItem[];
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ alerts }) => {
  const navigate = useNavigate();
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('admin-notif-read') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('admin-notif-read', JSON.stringify(readIds));
  }, [readIds]);

  const unreadCount = alerts.filter(a => !readIds.includes(a.id)).length;

  const markAllRead = () => {
    setReadIds(alerts.map(a => a.id));
  };

  const handleClick = (alert: AlertItem) => {
    if (!readIds.includes(alert.id)) {
      setReadIds(prev => [...prev, alert.id]);
    }
    if (alert.link) navigate(alert.link);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/[0.06]">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl"
      >
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={markAllRead}>
              <Check className="h-3 w-3" /> Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            alerts.slice(0, 10).map(alert => {
              const Icon = ALERT_ICONS[alert.type] ?? AlertTriangle;
              const isRead = readIds.includes(alert.id);
              return (
                <button
                  key={alert.id}
                  onClick={() => handleClick(alert)}
                  className={`flex items-start gap-3 w-full p-3 text-left transition-colors hover:bg-muted/50 ${
                    isRead ? 'opacity-60' : ''
                  }`}
                >
                  <div className={`rounded-lg p-1.5 shrink-0 mt-0.5 ${
                    alert.severity === 'critical'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{alert.severity}</p>
                  </div>
                  {!isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
