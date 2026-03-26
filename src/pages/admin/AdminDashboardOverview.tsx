import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertTriangle, ChevronDown, CheckCircle2, Globe, ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActivityLog from '@/components/ActivityLog';
import CriticalAlertsCard, { type AlertItem } from '@/components/dashboard/CriticalAlertsCard';
import SEOHealthCard, { type SEOTrendPoint } from '@/components/dashboard/SEOHealthCard';
import PageQualityCard, { type PageQualityData } from '@/components/dashboard/PageQualityCard';
import ContentFreshnessCard, { type ContentFreshnessData } from '@/components/dashboard/ContentFreshnessCard';
import TranslationVelocityCard, { type WeeklyTranslation } from '@/components/dashboard/TranslationVelocityCard';
import TopPagesCard, { type PageScoreItem } from '@/components/dashboard/TopPagesCard';
import DashboardDateFilter, { type DateRange } from '@/components/dashboard/DashboardDateFilter';
import DashboardExportButton from '@/components/dashboard/DashboardExportButton';
import UserGrowthCard, { type DailySignup } from '@/components/dashboard/UserGrowthCard';
import ContentKPIs, { type ContentKPIsData } from '@/components/dashboard/ContentKPIs';
import ContentStatusTable, { type ContentPageRow } from '@/components/dashboard/ContentStatusTable';
import PlatformStatus from '@/components/dashboard/PlatformStatus';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import { supabase } from '@/integrations/supabase/client';
import { useUserPresence } from '@/hooks/useUserPresence';
import { formatDistanceToNow, differenceInHours, subDays, startOfDay, startOfWeek, subWeeks, format } from 'date-fns';

interface SystemHealth {
  dbResponseTime: number;
  lastRateSync: string | null;
  activeCurrencies: number;
  securityStatus: 'secure' | 'warning' | 'unknown';
  loading: boolean;
}

interface CoverageData {
  language_name: string;
  coverage_percentage: number;
}

interface SEOHealthData {
  avgSeo: number;
  avgAeo: number;
  avgGeo: number;
  totalPages: number;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const AdminDashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const { onlineCount } = useUserPresence();
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  // Content KPIs
  const [contentKPIs, setContentKPIs] = useState<ContentKPIsData>({
    publishedPages: 0, inactivePages: 0, seoIssues: 0, missingTranslations: 0, updatedToday: 0, loading: true,
  });

  // Content table
  const [contentPages, setContentPages] = useState<ContentPageRow[]>([]);

  // Health
  const [health, setHealth] = useState<SystemHealth>({ dbResponseTime: 0, lastRateSync: null, activeCurrencies: 0, securityStatus: 'unknown', loading: true });
  const [coverage, setCoverage] = useState<CoverageData[]>([]);
  const [avgCoverage, setAvgCoverage] = useState(0);

  // SEO & analytics
  const [seoHealth, setSeoHealth] = useState<SEOHealthData>({ avgSeo: 0, avgAeo: 0, avgGeo: 0, totalPages: 0 });
  const [pageQuality, setPageQuality] = useState<PageQualityData>({ excellent: 0, good: 0, fair: 0, needsWork: 0 });
  const [freshness, setFreshness] = useState<ContentFreshnessData>({ updatedToday: 0, updatedThisWeek: 0, updatedThisMonth: 0, stale: 0, total: 0 });
  const [velocity, setVelocity] = useState<WeeklyTranslation[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [topPages, setTopPages] = useState<PageScoreItem[]>([]);
  const [bottomPages, setBottomPages] = useState<PageScoreItem[]>([]);
  const [userGrowth, setUserGrowth] = useState<DailySignup[]>([]);
  const [seoTrend, setSeoTrend] = useState<SEOTrendPoint[]>([]);
  const [v3Loading, setV3Loading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // SEO issues breakdown
  const [seoIssuesDetail, setSeoIssuesDetail] = useState<{ label: string; count: number }[]>([]);

  // Greeting context
  const [greetingContext, setGreetingContext] = useState({ seoIssues: 0, missingLangs: 0, updatedToday: 0 });

  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const startTime = performance.now();

        const securityCheck = async (): Promise<'secure' | 'warning' | 'unknown'> => {
          if (window.location.hostname === 'localhost') return 'secure';
          if (window.location.protocol !== 'https:') return 'warning';
          try {
            const r = await fetch(window.location.origin, { method: 'HEAD' });
            const hasHSTS = !!r.headers.get('strict-transport-security');
            return hasHSTS ? 'secure' : 'warning';
          } catch { return 'unknown'; }
        };

        const now = new Date();
        const filterDate = dateRange === 'today' ? startOfDay(now)
          : dateRange === '7d' ? subDays(now, 7)
          : dateRange === '30d' ? subDays(now, 30) : null;

        const velocityWeeks = dateRange === 'today' ? 1 : dateRange === '7d' ? 2 : dateRange === 'all' ? 8 : 4;
        const growthDays = dateRange === 'today' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const seoTrendWeeks = dateRange === 'today' ? 1 : dateRange === '7d' ? 2 : dateRange === '30d' ? 4 : 12;
        const growthStart = subDays(now, growthDays);

        let usersQuery = supabase.from('profiles').select('*', { count: 'exact', head: true });
        let translationsQuery = supabase.from('translations').select('*', { count: 'exact', head: true });
        let aiTranslationsQuery = supabase.from('translations').select('*', { count: 'exact', head: true }).not('ai_provider', 'is', null);
        if (filterDate) {
          const filterISO = filterDate.toISOString();
          usersQuery = usersQuery.gte('created_at', filterISO);
          translationsQuery = translationsQuery.gte('created_at', filterISO);
          aiTranslationsQuery = aiTranslationsQuery.gte('created_at', filterISO).not('ai_provider', 'is', null);
        }

        const [
          usersResult, translationsResult, aiTranslatedResult,
          currenciesResult, seoTasksResult, coverageResult,
          pageSeoResult, allPagesResult, translationHistoryResult, zeroCoverageResult,
          userGrowthResult, seoTrendResult, secStatus,
        ] = await Promise.all([
          usersQuery,
          translationsQuery,
          aiTranslationsQuery,
          supabase.from('currencies').select('rate_updated_at, is_active'),
          supabase.from('seo_tasks').select('*', { count: 'exact', head: true }).eq('is_completed', false),
          supabase.from('translation_coverage_stats')
            .select('language_name, coverage_percentage')
            .order('coverage_percentage', { ascending: false })
            .limit(200),
          supabase.from('page_seo').select('seo_score, aeo_score, geo_score, page_id, meta_title, meta_description'),
          supabase.from('pages').select('id, page_title, page_url, updated_at, is_active'),
          supabase.from('translation_history').select('created_at').gte('created_at', subWeeks(now, velocityWeeks).toISOString()),
          supabase.from('translation_coverage_stats')
            .select('language_name, coverage_percentage')
            .eq('coverage_percentage', 0)
            .limit(10),
          supabase.from('profiles').select('created_at').gte('created_at', growthStart.toISOString()),
          supabase.from('seo_score_history')
            .select('combined_score, snapshot_date')
            .gte('snapshot_date', subWeeks(now, seoTrendWeeks).toISOString().split('T')[0])
            .order('snapshot_date', { ascending: true }),
          securityCheck(),
        ]);

        const endTime = performance.now();
        const dbTime = Math.round(endTime - startTime);

        const activeCurrenciesList = currenciesResult.data?.filter(c => c.is_active) ?? [];
        const activeCurrencies = activeCurrenciesList.length;
        const latestSync = currenciesResult.data?.map(c => c.rate_updated_at).filter(Boolean).sort().reverse()[0] ?? null;
        const pendingSeoTasks = seoTasksResult.count ?? 0;
        const allPages = allPagesResult.data ?? [];
        const todayStart = startOfDay(now);
        const publishedPages = allPages.filter(p => p.is_active).length;
        const inactivePages = allPages.filter(p => !p.is_active).length;
        const updatedToday = allPages.filter(p => new Date(p.updated_at) >= todayStart).length;

        // Missing translations count
        const coverageData = coverageResult.data ?? [];
        const allDeduped = Object.values(
          coverageData.reduce((acc, item) => {
            const name = item.language_name ?? 'Unknown';
            if (!acc[name]) acc[name] = { language_name: name, coverage_percentage: Number(item.coverage_percentage) || 0 };
            else acc[name].coverage_percentage = Math.max(acc[name].coverage_percentage, Number(item.coverage_percentage) || 0);
            return acc;
          }, {} as Record<string, CoverageData>)
        ).sort((a, b) => b.coverage_percentage - a.coverage_percentage);
        const missingTranslations = allDeduped.filter(l => l.coverage_percentage < 100).length;
        const avg = allDeduped.length > 0 ? allDeduped.reduce((s, d) => s + d.coverage_percentage, 0) / allDeduped.length : 0;

        setCoverage(allDeduped.slice(0, 8));
        setAvgCoverage(avg);

        // Content KPIs
        setContentKPIs({
          publishedPages, inactivePages, seoIssues: pendingSeoTasks,
          missingTranslations, updatedToday, loading: false,
        });

        // Greeting context
        const zeroCovLangs = zeroCoverageResult.data?.length ?? 0;
        setGreetingContext({ seoIssues: pendingSeoTasks, missingLangs: zeroCovLangs, updatedToday });

        // Health
        setHealth({ dbResponseTime: dbTime, lastRateSync: latestSync, activeCurrencies, securityStatus: secStatus, loading: false });

        // SEO issues detail
        const seoData = pageSeoResult.data ?? [];
        const totalPageCount = allPages.length;
        const pagesWithSeoIds = new Set(seoData.map(d => d.page_id));
        const missingSeoData = totalPageCount - pagesWithSeoIds.size;
        const missingMeta = seoData.filter(d => !d.meta_description || d.meta_description.trim() === '').length;
        const missingTitle = seoData.filter(d => !d.meta_title || d.meta_title.trim() === '').length;
        const issues: { label: string; count: number }[] = [];
        if (missingSeoData > 0) issues.push({ label: 'pages missing SEO data', count: missingSeoData });
        if (missingMeta > 0) issues.push({ label: 'pages missing meta description', count: missingMeta });
        if (missingTitle > 0) issues.push({ label: 'pages missing meta title', count: missingTitle });
        setSeoIssuesDetail(issues);

        // Content status table
        const pageRows: ContentPageRow[] = allPages
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 10)
          .map(p => {
            const bestSeo = seoData.filter(s => s.page_id === p.id);
            const maxScore = bestSeo.length > 0 ? Math.max(...bestSeo.map(s => s.seo_score ?? 0)) : null;
            return { id: p.id, title: p.page_title, url: p.page_url, isActive: p.is_active ?? true, seoScore: maxScore, updatedAt: p.updated_at };
          });
        setContentPages(pageRows);

        // SEO Health + Page Quality
        if (seoData.length > 0) {
          const byPageAvg = new Map<string, { seo: number; aeo: number; geo: number }>();
          seoData.forEach(d => {
            const existing = byPageAvg.get(d.page_id);
            if (!existing || (d.seo_score ?? 0) > existing.seo) {
              byPageAvg.set(d.page_id, { seo: d.seo_score ?? 0, aeo: d.aeo_score ?? 0, geo: d.geo_score ?? 0 });
            }
          });
          const uniquePages = Array.from(byPageAvg.values());
          const avgSeo = uniquePages.reduce((s, p) => s + p.seo, 0) / uniquePages.length;
          const avgAeo = uniquePages.reduce((s, p) => s + p.aeo, 0) / uniquePages.length;
          const avgGeo = uniquePages.reduce((s, p) => s + p.geo, 0) / uniquePages.length;
          setSeoHealth({ avgSeo, avgAeo, avgGeo, totalPages: byPageAvg.size });

          const byPage = new Map<string, number>();
          seoData.forEach(d => {
            const existing = byPage.get(d.page_id) ?? 0;
            byPage.set(d.page_id, Math.max(existing, d.seo_score ?? 0));
          });
          let excellent = 0, good = 0, fair = 0, needsWork = 0;
          byPage.forEach(score => {
            if (score >= 80) excellent++;
            else if (score >= 60) good++;
            else if (score >= 40) fair++;
            else needsWork++;
          });
          const uncovered = Math.max(0, totalPageCount - byPage.size);
          setPageQuality({ excellent, good, fair, needsWork, uncovered });

          const pagesWithScores: PageScoreItem[] = [];
          byPage.forEach((score, pageId) => {
            const page = allPages.find(p => p.id === pageId);
            if (page) pagesWithScores.push({ pageId, title: page.page_title, url: page.page_url, seoScore: score });
          });
          pagesWithScores.sort((a, b) => b.seoScore - a.seoScore);
          setTopPages(pagesWithScores.slice(0, 3));
          setBottomPages(pagesWithScores.filter(p => p.seoScore < 60).sort((a, b) => a.seoScore - b.seoScore).slice(0, 3));
        }

        // Content Freshness
        if (allPages.length > 0) {
          const weekStart = startOfWeek(now, { weekStartsOn: 1 });
          const monthStart = subDays(now, 30);
          const fDate = dateRange === 'today' ? todayStart : dateRange === '7d' ? subDays(now, 7) : dateRange === '30d' ? monthStart : new Date(0);
          let uToday = 0, uWeek = 0, uMonth = 0, stale = 0;
          allPages.forEach(p => {
            const d = new Date(p.updated_at);
            if (dateRange !== 'all' && d < fDate) { stale++; return; }
            if (d >= todayStart) uToday++;
            else if (d >= weekStart) uWeek++;
            else if (d >= monthStart) uMonth++;
            else stale++;
          });
          setFreshness({ updatedToday: uToday, updatedThisWeek: uWeek, updatedThisMonth: uMonth, stale, total: allPages.length });
        }

        // Translation Velocity
        if (translationHistoryResult.data) {
          const weekMap = new Map<string, number>();
          for (let i = 0; i < velocityWeeks; i++) {
            const ws = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
            weekMap.set(ws.toISOString(), 0);
          }
          translationHistoryResult.data.forEach(t => {
            const ws = startOfWeek(new Date(t.created_at), { weekStartsOn: 1 });
            const key = ws.toISOString();
            if (weekMap.has(key)) weekMap.set(key, (weekMap.get(key) ?? 0) + 1);
          });
          const weeks: WeeklyTranslation[] = Array.from(weekMap.entries())
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([week, count], i) => ({
              week, label: i === 0 ? 'This wk' : i === 1 ? 'Last wk' : format(new Date(week), 'MMM d'), count,
            }));
          setVelocity(weeks);
        }

        // User Growth
        if (userGrowthResult.data) {
          const dayMap = new Map<string, number>();
          for (let i = growthDays - 1; i >= 0; i--) {
            const day = format(subDays(now, i), 'yyyy-MM-dd');
            dayMap.set(day, 0);
          }
          userGrowthResult.data.forEach(p => {
            const day = format(new Date(p.created_at), 'yyyy-MM-dd');
            if (dayMap.has(day)) dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
          });
          setUserGrowth(Array.from(dayMap.entries()).map(([date, count]) => ({
            date, label: format(new Date(date), growthDays <= 7 ? 'EEE' : 'MMM d'), count,
          })));
        }

        // SEO Trend
        if (seoTrendResult.data && seoTrendResult.data.length > 0) {
          const weekScores = new Map<string, number[]>();
          seoTrendResult.data.forEach(d => {
            const ws = startOfWeek(new Date(d.snapshot_date), { weekStartsOn: 1 });
            const key = format(ws, 'MMM d');
            if (!weekScores.has(key)) weekScores.set(key, []);
            weekScores.get(key)!.push(d.combined_score ?? 0);
          });
          setSeoTrend(Array.from(weekScores.entries()).map(([week, scores]) => ({
            week, score: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
          })));
        }

        // Alerts
        const today = new Date().toISOString().split('T')[0];
        const newAlerts: AlertItem[] = [];
        if (pendingSeoTasks > 0) {
          newAlerts.push({
            id: `seo-pending-${today}`, type: 'seo_overdue', severity: pendingSeoTasks >= 5 ? 'critical' : 'warning',
            message: `${pendingSeoTasks} pending SEO task${pendingSeoTasks > 1 ? 's' : ''}`,
            link: '/a93jf02kd92ms71x8qp4/seo',
          });
        }
        if (zeroCovLangs > 0) {
          newAlerts.push({
            id: `zero-cov-${today}`, type: 'zero_coverage', severity: zeroCovLangs >= 5 ? 'critical' : 'warning',
            message: `${zeroCovLangs} language${zeroCovLangs > 1 ? 's' : ''} at 0% coverage`,
            link: '/a93jf02kd92ms71x8qp4/pages',
          });
        }
        const lowSeoPages = seoData.filter(p => (p.seo_score ?? 0) < 40).length;
        if (lowSeoPages > 0) {
          newAlerts.push({
            id: `low-seo-${today}`, type: 'low_seo', severity: 'warning',
            message: `${lowSeoPages} page${lowSeoPages > 1 ? 's' : ''} with low SEO score`,
            link: '/a93jf02kd92ms71x8qp4/seo',
          });
        }
        const stalePages = allPages.filter(p => new Date(p.updated_at) < subDays(new Date(), 30)).length;
        if (stalePages > 0) {
          newAlerts.push({
            id: `stale-${today}`, type: 'stale_content', severity: stalePages >= 3 ? 'critical' : 'warning',
            message: `${stalePages} stale page${stalePages > 1 ? 's' : ''} (30d+)`,
            link: '/a93jf02kd92ms71x8qp4/pages',
          });
        }
        setAlerts(newAlerts);
        window.dispatchEvent(new CustomEvent('dashboardAlerts', { detail: newAlerts }));
        setV3Loading(false);
        setDashboardError(null);
        retryCountRef.current = 0;
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
        setDashboardError('Some dashboard data failed to load.');
        setContentKPIs(prev => ({ ...prev, loading: false }));
        setV3Loading(false);
        if (retryCountRef.current < 3) {
          retryCountRef.current++;
          retryRef.current = setTimeout(fetchAll, 10000);
        }
      }
    };

    fetchAll();

    const debouncedFetch = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(fetchAll, 2000);
    };

    const channel = supabase
      .channel('dashboard-overview-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, debouncedFetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pages' }, debouncedFetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'languages' }, debouncedFetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'translations' }, debouncedFetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'currencies' }, debouncedFetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'seo_tasks' }, debouncedFetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'page_seo' }, debouncedFetch)
      .subscribe();

    const interval = setInterval(fetchAll, 60000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [dateRange]);

  // Low-coverage languages for translation status section
  const lowCoverageLangs = coverage.filter(l => l.coverage_percentage < 100).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Greeting + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">{getGreeting()}</h1>
          <p className="text-sm text-muted-foreground">
            {contentKPIs.loading ? 'Loading dashboard...' : (
              <>
                You have: <span className="font-semibold text-foreground">{greetingContext.seoIssues}</span> SEO issues to fix
                {greetingContext.missingLangs > 0 && <> · <span className="font-semibold text-foreground">{greetingContext.missingLangs}</span> languages missing translations</>}
                {greetingContext.updatedToday > 0 && <> · <span className="font-semibold text-foreground">{greetingContext.updatedToday}</span> pages updated today</>}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 border border-border/50 rounded-lg px-2 py-1.5 bg-muted/30">
          <DashboardDateFilter value={dateRange} onChange={setDateRange} />
          <div className="w-px h-6 bg-border/50" />
          <DashboardExportButton metrics={{
            totalUsers: 0, totalPages: contentKPIs.publishedPages + contentKPIs.inactivePages,
            totalLanguages: 0, totalTranslations: 0, onlineUsers: onlineCount,
            activeCurrencies: health.activeCurrencies, pendingSeoTasks: contentKPIs.seoIssues,
            aiTranslatedCount: 0, reviewedCount: 0, loading: false,
          }} coverage={coverage} avgCoverage={avgCoverage} />
        </div>
      </div>

      {/* Error Banner */}
      {dashboardError && (
        <Alert variant="destructive" className="border-destructive/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Dashboard Error</AlertTitle>
          <AlertDescription>{dashboardError} Retrying automatically...</AlertDescription>
        </Alert>
      )}

      {/* Content KPIs */}
      <ContentKPIs data={contentKPIs} />

      {/* Critical Alerts */}
      <CriticalAlertsCard alerts={alerts} loading={v3Loading} />

      {/* Quick Actions + Platform Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <QuickActionsCard />
        <Card className="h-full dark:bg-white/[0.03] bg-card border-border rounded-2xl flex flex-col justify-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Platform Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PlatformStatus />
          </CardContent>
        </Card>
      </div>

      {/* Recent Content Activity */}
      <ActivityLog />

      {/* SEO Health + Translation Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <SEOHealthCard data={seoHealth} loading={v3Loading} uncoveredPages={pageQuality.uncovered ?? 0} trend={seoTrend} issues={seoIssuesDetail} />

        {/* Translation Status — languages needing attention */}
        <Card className="h-full dark:bg-white/[0.03] bg-card border-border rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Translation Status
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => navigate('/a93jf02kd92ms71x8qp4/pages')}>
                Details <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {lowCoverageLangs.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 py-4">
                <CheckCircle2 className="h-4 w-4" />
                All languages fully translated
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Languages needing attention ({lowCoverageLangs.length})</p>
                {lowCoverageLangs.map(lang => (
                  <div key={lang.language_name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground truncate max-w-[160px]">{lang.language_name}</span>
                      <span className="font-medium text-foreground">{lang.coverage_percentage.toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={lang.coverage_percentage} className="h-1.5"
                      indicatorClassName={
                        lang.coverage_percentage >= 80 ? 'bg-emerald-500'
                          : lang.coverage_percentage >= 40 ? 'bg-amber-500' : 'bg-destructive'
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content Status Table */}
      <ContentStatusTable pages={contentPages} loading={v3Loading} />

      {/* Analytics & Trends — Collapsible */}
      <Collapsible open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between h-10 text-sm text-muted-foreground hover:text-foreground">
            <span>Analytics & Trends</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${analyticsOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-6 pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <UserGrowthCard data={userGrowth} loading={v3Loading} dateLabel={dateRange === 'today' ? 'today' : dateRange === '7d' ? 'last 7d' : dateRange === '30d' ? 'last 30d' : 'all time'} />
            <TranslationVelocityCard data={velocity} loading={v3Loading} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <PageQualityCard data={pageQuality} loading={v3Loading} />
            <ContentFreshnessCard data={freshness} loading={v3Loading} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <TopPagesCard topPages={topPages} bottomPages={bottomPages} loading={v3Loading} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AdminDashboardOverview;
