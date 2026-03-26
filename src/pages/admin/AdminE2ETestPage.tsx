import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { allTestGroups } from '@/lib/e2e/testGroups';
import { runTest, formatResultsMarkdown } from '@/lib/e2e/testRunner';
import type { TestResult, TestStatus } from '@/lib/e2e/testRunner';
import { ChevronDown, ChevronRight, Play, Copy, CheckCircle2, XCircle, Clock, SkipForward, Loader2, FlaskConical, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface GroupState {
  results: TestResult[];
  running: boolean;
}

const statusIcon: Record<TestStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-muted-foreground" />,
  running: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
  passed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  failed: <XCircle className="h-4 w-4 text-red-500" />,
  skipped: <SkipForward className="h-4 w-4 text-yellow-500" />,
};

const statusBg: Record<TestStatus, string> = {
  pending: 'bg-muted/50',
  running: 'bg-blue-500/10 border-blue-500/20',
  passed: 'bg-green-500/10 border-green-500/20',
  failed: 'bg-red-500/10 border-red-500/20',
  skipped: 'bg-yellow-500/10 border-yellow-500/20',
};

const AdminE2ETestPage: React.FC = () => {
  const [groupStates, setGroupStates] = useState<Record<number, GroupState>>({});
  const [runningAll, setRunningAll] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set());
  const [sessionViolation, setSessionViolation] = useState<string | null>(null);

  const toggleGroup = (idx: number) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  // Verify admin session is still intact
  const checkSessionIntegrity = async (adminUserId: string): Promise<boolean> => {
    const { data } = await supabase.auth.getSession();
    if (!data.session || data.session.user.id !== adminUserId) {
      setSessionViolation(
        `Session safety violation! Expected user ${adminUserId} but got ${data.session?.user.id || 'no session'}. Tests halted.`
      );
      return false;
    }
    return true;
  };

  const runGroup = useCallback(async (groupIdx: number) => {
    const group = allTestGroups[groupIdx];
    setGroupStates(prev => ({ ...prev, [groupIdx]: { results: [], running: true } }));
    setOpenGroups(prev => new Set(prev).add(groupIdx));

    const results: TestResult[] = [];
    for (const test of group.tests) {
      setGroupStates(prev => ({
        ...prev,
        [groupIdx]: {
          running: true,
          results: [...results, { name: test.name, status: 'running', duration: 0 }],
        },
      }));

      const result = await runTest(test);
      results.push(result);

      setGroupStates(prev => ({
        ...prev,
        [groupIdx]: { running: true, results: [...results] },
      }));
    }

    setGroupStates(prev => ({
      ...prev,
      [groupIdx]: { results, running: false },
    }));
  }, []);

  const runAll = useCallback(async () => {
    setRunningAll(true);
    setSessionViolation(null);

    // Capture admin user ID before starting
    const { data: sessionData } = await supabase.auth.getSession();
    const adminUserId = sessionData.session?.user.id;
    if (!adminUserId) {
      toast.error('No active session. Please log in first.');
      setRunningAll(false);
      return;
    }

    for (let i = 0; i < allTestGroups.length; i++) {
      await runGroup(i);

      // After each group, verify admin session is still intact
      const ok = await checkSessionIntegrity(adminUserId);
      if (!ok) {
        toast.error('Session safety violation detected! Tests halted.');
        break;
      }
    }
    setRunningAll(false);
  }, [runGroup]);

  const copyResults = useCallback(() => {
    const groups = allTestGroups.map((g, i) => ({
      name: g.name,
      results: groupStates[i]?.results || g.tests.map(t => ({
        name: t.name, status: 'pending' as TestStatus, duration: 0,
      })),
    }));
    const md = formatResultsMarkdown(groups);
    navigator.clipboard.writeText(md);
    toast.success('Results copied to clipboard');
  }, [groupStates]);

  // Summary stats
  const allResults = Object.values(groupStates).flatMap(g => g.results);
  const totalTests = allTestGroups.reduce((s, g) => s + g.tests.length, 0);
  const passed = allResults.filter(r => r.status === 'passed').length;
  const failed = allResults.filter(r => r.status === 'failed').length;
  const skipped = allResults.filter(r => r.status === 'skipped').length;
  const totalDuration = allResults.reduce((s, r) => s + r.duration, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">End-to-End Test Suite</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyResults} disabled={allResults.length === 0}>
            <Copy className="h-4 w-4 mr-1" /> Copy Results
          </Button>
          <Button size="sm" onClick={runAll} disabled={runningAll}>
            {runningAll ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />}
            Run All Tests
          </Button>
        </div>
      </div>

      {/* Session Violation Alert */}
      {sessionViolation && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-600 dark:text-red-400">
          <ShieldAlert className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{sessionViolation}</span>
        </div>
      )}

      {/* Summary Bar */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total', value: totalTests, color: 'text-foreground' },
          { label: 'Passed', value: passed, color: 'text-green-500' },
          { label: 'Failed', value: failed, color: 'text-red-500' },
          { label: 'Skipped', value: skipped, color: 'text-yellow-500' },
          { label: 'Duration', value: `${totalDuration.toFixed(0)}ms`, color: 'text-blue-500' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Test Groups */}
      <div className="space-y-3">
        {allTestGroups.map((group, gIdx) => {
          const state = groupStates[gIdx];
          const isOpen = openGroups.has(gIdx);
          const gPassed = state?.results.filter(r => r.status === 'passed').length || 0;
          const gFailed = state?.results.filter(r => r.status === 'failed').length || 0;
          const gTotal = group.tests.length;

          return (
            <Collapsible key={gIdx} open={isOpen} onOpenChange={() => toggleGroup(gIdx)}>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left">
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <span className="font-semibold text-sm text-foreground">
                      GROUP {gIdx + 1}: {group.name}
                    </span>
                    {state && !state.running && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {gPassed}/{gTotal} passed
                        {gFailed > 0 && <span className="text-red-500 ml-1">({gFailed} failed)</span>}
                      </span>
                    )}
                    {state?.running && <Loader2 className="h-3 w-3 animate-spin text-blue-500 ml-2" />}
                  </CollapsibleTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); runGroup(gIdx); }}
                    disabled={state?.running || runningAll}
                  >
                    <Play className="h-3 w-3 mr-1" /> Run
                  </Button>
                </div>

                <CollapsibleContent>
                  <div className="border-t border-border divide-y divide-border">
                    {group.tests.map((test, tIdx) => {
                      const result = state?.results[tIdx];
                      const status: TestStatus = result?.status || 'pending';

                      return (
                        <div
                          key={tIdx}
                          className={cn(
                            'flex items-center justify-between px-4 py-2.5 text-sm transition-colors border-l-2',
                            statusBg[status],
                            status === 'passed' ? 'border-l-green-500' :
                            status === 'failed' ? 'border-l-red-500' :
                            status === 'skipped' ? 'border-l-yellow-500' :
                            status === 'running' ? 'border-l-blue-500' :
                            'border-l-transparent'
                          )}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {statusIcon[status]}
                            <span className="truncate text-foreground">{test.name}</span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {result?.duration ? (
                              <span className="text-xs text-muted-foreground">{result.duration.toFixed(0)}ms</span>
                            ) : null}
                            {result?.error && status !== 'skipped' && (
                              <span className="text-xs text-red-500 max-w-[300px] truncate" title={result.error}>
                                {result.error}
                              </span>
                            )}
                            {result?.error && status === 'skipped' && (
                              <span className="text-xs text-yellow-600 max-w-[300px] truncate" title={result.error}>
                                {result.error}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

export default AdminE2ETestPage;
