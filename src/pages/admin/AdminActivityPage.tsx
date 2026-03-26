import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, FileText, Languages, Package, User, Settings, 
  Search, Filter, RefreshCw, Clock, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';
import AdminSectionHeader from '@/components/admin/AdminSectionHeader';

interface ActivityLog {
  id: string;
  activity_type: string;
  title: string;
  description: string;
  entity_type: string;
  entity_id: string;
  user_email: string;
  metadata: any;
  created_at: string;
}

const activityTypeIcons: Record<string, React.ElementType> = {
  page_created: FileText,
  page_updated: FileText,
  page_deleted: FileText,
  page_restored: FileText,
  translation_created: Languages,
  translation_updated: Languages,
  seo_updated: Search,
  package_created: Package,
  package_updated: Package,
  user_login: User,
  settings_changed: Settings
};

const activityTypeColors: Record<string, string> = {
  page_created: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  page_updated: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  page_deleted: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  page_restored: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  translation_created: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  translation_updated: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  seo_updated: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  package_created: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  package_updated: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
};

const AdminActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 50;

  const fetchActivities = async (reset = false) => {
    setLoading(true);
    try {
      const currentPage = reset ? 0 : page;
      
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);

      if (typeFilter !== 'all') {
        query = query.eq('activity_type', typeFilter);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (reset) {
        setActivities((data || []) as ActivityLog[]);
        setPage(0);
      } else {
        setActivities(prev => [...prev, ...((data || []) as ActivityLog[])]);
      }
      
      setHasMore((data?.length || 0) === pageSize);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(true);
  }, [typeFilter]);

  const handleSearch = () => {
    fetchActivities(true);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
    fetchActivities();
  };

  const getIcon = (type: string) => {
    const Icon = activityTypeIcons[type] || Activity;
    return Icon;
  };

  const uniqueTypes = [...new Set(activities.map(a => a.activity_type))];

  return (
    <div className="space-y-6">
      <AdminSectionHeader 
        title="Activity Log"
      />

      {/* Filters */}
      <Card className="bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="pl-9 bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] bg-white/[0.04] border-white/[0.08]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="page_created">Page Created</SelectItem>
                <SelectItem value="page_updated">Page Updated</SelectItem>
                <SelectItem value="page_deleted">Page Deleted</SelectItem>
                <SelectItem value="page_restored">Page Restored</SelectItem>
                <SelectItem value="translation_created">Translation Created</SelectItem>
                <SelectItem value="translation_updated">Translation Updated</SelectItem>
                <SelectItem value="seo_updated">SEO Updated</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => fetchActivities(true)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card className="bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && activities.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No activity logs found</p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {activities.map(activity => {
                    const Icon = getIcon(activity.activity_type);
                    const colorClass = activityTypeColors[activity.activity_type] || 'bg-gray-100 text-gray-700';
                    
                    return (
                      <div 
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-white/[0.06] hover:bg-white/[0.05] transition-colors duration-200"
                      >
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {activity.description}
                              </p>
                            </div>
                            <Badge variant="outline" className="shrink-0 text-xs">
                              {activity.activity_type.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                            </span>
                            {activity.user_email && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {activity.user_email}
                              </span>
                            )}
                            {activity.entity_type && (
                              <span>
                                {activity.entity_type}: {activity.entity_id?.substring(0, 8)}...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              
              {hasMore && (
                <div className="flex justify-center pt-4 mt-4 border-t border-white/[0.08]">
                  <Button 
                    variant="outline" 
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminActivityPage;
