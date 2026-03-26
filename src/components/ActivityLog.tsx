import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import femaleAvatar from '@/assets/female-avatar.svg';
import maleAvatar from '@/assets/male-avatar.png';
import { 
  Activity, 
  UserPlus, 
  Edit, 
  Trash2, 
  Globe, 
  FileText,
  Package,
  Shield,
  Clock,
  Info
} from 'lucide-react';

type FilterTab = 'all' | 'users' | 'pages' | 'translations';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  username?: string;
  email?: string;
  userRole: string;
  profilePicture?: string;
  gender?: string;
  timestamp: Date;
}

const ICON_MAP: Record<string, React.ElementType> = {
  user_created: UserPlus,
  user_login: UserPlus,
  user_updated: Edit,
  profile_updated: Edit,
  user_deleted: Trash2,
  page_created: FileText,
  page_updated: FileText,
  page_deleted: FileText,
  translation_created: Globe,
  translation_updated: Globe,
  package_created: Package,
  package_updated: Package,
  admin_action: Shield,
};

const COLOR_MAP: Record<string, string> = {
  user_created: 'dark:text-emerald-400 text-emerald-600 dark:bg-emerald-500/10 bg-emerald-50',
  user_login: 'dark:text-emerald-400 text-emerald-600 dark:bg-emerald-500/10 bg-emerald-50',
  page_created: 'dark:text-blue-400 text-blue-600 dark:bg-blue-500/10 bg-blue-50',
  page_updated: 'dark:text-blue-400 text-blue-600 dark:bg-blue-500/10 bg-blue-50',
  page_deleted: 'dark:text-red-400 text-red-600 dark:bg-red-500/10 bg-red-50',
  translation_created: 'dark:text-violet-400 text-violet-600 dark:bg-violet-500/10 bg-violet-50',
  translation_updated: 'dark:text-violet-400 text-violet-600 dark:bg-violet-500/10 bg-violet-50',
  profile_updated: 'dark:text-blue-400 text-blue-600 dark:bg-blue-500/10 bg-blue-50',
  user_deleted: 'dark:text-red-400 text-red-600 dark:bg-red-500/10 bg-red-50',
  package_created: 'dark:text-amber-400 text-amber-600 dark:bg-amber-500/10 bg-amber-50',
  package_updated: 'dark:text-amber-400 text-amber-600 dark:bg-amber-500/10 bg-amber-50',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'dark:bg-emerald-500/15 bg-emerald-50 dark:text-emerald-300 text-emerald-700 border dark:border-emerald-500/20 border-emerald-200',
  manager: 'dark:bg-blue-500/15 bg-blue-50 dark:text-blue-300 text-blue-700 border dark:border-blue-500/20 border-blue-200',
  seo_manager: 'dark:bg-violet-500/15 bg-violet-50 dark:text-violet-300 text-violet-700 border dark:border-violet-500/20 border-violet-200',
  content_writer: 'dark:bg-amber-500/15 bg-amber-50 dark:text-amber-200 text-amber-700 border dark:border-amber-500/20 border-amber-200',
  user: 'dark:bg-slate-500/15 bg-slate-50 dark:text-slate-300 text-slate-700 border dark:border-slate-500/20 border-slate-200',
};

const formatRoleName = (role: string) =>
  role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const getDefaultAvatar = (gender?: string) =>
  gender === 'female' ? femaleAvatar : maleAvatar;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'users', label: 'Users' },
  { key: 'pages', label: 'Pages' },
  { key: 'translations', label: 'Translations' },
];

const FILTER_TYPES: Record<FilterTab, string[]> = {
  all: [],
  users: ['user_created', 'user_login', 'user_updated', 'user_deleted', 'profile_updated'],
  pages: ['page_created', 'page_updated', 'page_deleted'],
  translations: ['translation_created', 'translation_updated'],
};

const getDateGroup = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return 'Earlier';
};

export const ActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isFromProfiles, setIsFromProfiles] = useState(false);

  const fetchFromActivityLogs = useCallback(async (): Promise<ActivityItem[]> => {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) return [];

    return data.map(log => ({
      id: log.id,
      type: log.activity_type,
      title: log.title,
      description: log.description ?? '',
      email: log.user_email ?? undefined,
      userRole: 'System',
      timestamp: new Date(log.created_at),
    }));
  }, []);

  const fetchFromProfiles = useCallback(async (): Promise<ActivityItem[]> => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(10);

    if (error || !profiles) return [];

    const items: ActivityItem[] = [];

    profiles.forEach(profile => {
      const roles = profile.roles || ['user'];

      if (profile.last_login) {
        items.push({
          id: `login-${profile.id}`,
          type: 'user_login',
          title: 'User Login',
          description: `${profile.email} logged into the system`,
          username: profile.username || 'Unknown',
          email: profile.email ?? undefined,
          userRole: roles.map(formatRoleName).join(', '),
          profilePicture: profile.profile_picture_url ?? undefined,
          gender: profile.gender ?? undefined,
          timestamp: new Date(profile.last_login),
        });
      }

      items.push({
        id: `reg-${profile.id}`,
        type: 'user_created',
        title: 'New User Registration',
        description: 'A new user account was created',
        username: profile.username || 'Unknown',
        email: profile.email ?? undefined,
        userRole: roles.map(formatRoleName).join(', '),
        profilePicture: profile.profile_picture_url ?? undefined,
        gender: profile.gender ?? undefined,
        timestamp: new Date(profile.created_at),
      });
    });

    return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  }, []);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      let items = await fetchFromActivityLogs();
      if (items.length === 0) {
        items = await fetchFromProfiles();
        setIsFromProfiles(true);
      } else {
        setIsFromProfiles(false);
      }
      setActivities(items);
    } finally {
      setLoading(false);
    }
  }, [fetchFromActivityLogs, fetchFromProfiles]);

  useEffect(() => {
    fetchActivities();

    const channel = supabase
      .channel('activity-log-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, payload => {
        const log = payload.new as any;
        const newItem: ActivityItem = {
          id: log.id,
          type: log.activity_type,
          title: log.title,
          description: log.description ?? '',
          email: log.user_email ?? undefined,
          userRole: 'System',
          timestamp: new Date(log.created_at),
        };
        setActivities(prev => [newItem, ...prev].slice(0, 20));
        setIsFromProfiles(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchActivities]);

  const filtered = activeTab === 'all'
    ? activities
    : activities.filter(a => FILTER_TYPES[activeTab].includes(a.type));

  // Group by date
  const grouped = filtered.reduce<Record<string, ActivityItem[]>>((acc, item) => {
    const group = getDateGroup(item.timestamp);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
  const groupOrder = ['Today', 'Yesterday', 'Earlier'];

  if (loading) {
    return (
      <Card className="dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4" />
            Latest Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-9 w-9 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-white/[0.03] bg-white dark:border-white/[0.08] border-slate-200 rounded-2xl dark:shadow-xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4" />
            Latest Activities
          </CardTitle>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        {/* Filter tabs */}
        <div className="flex gap-1 mt-2 flex-wrap">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {/* Profiles fallback notice */}
        {isFromProfiles && (
          <div className="flex items-start gap-2 p-3 mb-3 rounded-lg bg-muted/50 border border-border/50">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Activity tracking is active. New page edits, translation changes, and user actions will appear here automatically. Showing recent user activity as a fallback.
            </p>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No activities found for this filter.</p>
            <p className="text-xs text-muted-foreground mt-1">Try selecting a different category above.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {groupOrder.map(groupName => {
              const items = grouped[groupName];
              if (!items || items.length === 0) return null;
              return (
                <div key={groupName}>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider py-2 px-1">
                    {groupName}
                  </div>
                  <div className="space-y-1">
                    {items.map(activity => {
                      const Icon = ICON_MAP[activity.type] ?? Activity;
                      const colorClass = COLOR_MAP[activity.type] ?? 'text-muted-foreground bg-muted';

                      return (
                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className={`rounded-full p-2 ${colorClass} shrink-0`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                              {activity.userRole && activity.userRole !== 'System' && (
                                activity.userRole.split(', ').map((role, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className={`text-[10px] px-1.5 py-0 ${ROLE_COLORS[role.toLowerCase().replace(/ /g, '_')] ?? 'bg-muted text-muted-foreground'}`}
                                  >
                                    {role}
                                  </Badge>
                                ))
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{activity.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {activity.profilePicture || activity.gender ? (
                                <Avatar className="h-4 w-4">
                                  <AvatarImage
                                    src={activity.profilePicture || getDefaultAvatar(activity.gender)}
                                    alt={activity.username || 'User'}
                                  />
                                  <AvatarFallback className="text-[8px]">
                                    {(activity.username || activity.email)?.charAt(0).toUpperCase() || '?'}
                                  </AvatarFallback>
                                </Avatar>
                              ) : null}
                              {activity.email && <span>{activity.email}</span>}
                              <span>•</span>
                              <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
