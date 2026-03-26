export type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

export interface TestResult {
  name: string;
  status: TestStatus;
  duration: number;
  error?: string;
}

export interface TestDefinition {
  name: string;
  fn: () => Promise<void>;
  skip?: boolean;
  skipReason?: string;
}

export interface TestGroup {
  name: string;
  tests: TestDefinition[];
}

export async function runTest(
  def: TestDefinition,
  timeout = 10000
): Promise<TestResult> {
  if (def.skip) {
    return { name: def.name, status: 'skipped', duration: 0, error: def.skipReason };
  }

  const start = performance.now();
  try {
    await Promise.race([
      def.fn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout (10s)')), timeout)
      ),
    ]);
    return { name: def.name, status: 'passed', duration: performance.now() - start };
  } catch (err) {
    return {
      name: def.name,
      status: 'failed',
      duration: performance.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function formatResultsMarkdown(
  groups: { name: string; results: TestResult[] }[]
): string {
  const all = groups.flatMap(g => g.results);
  const passed = all.filter(r => r.status === 'passed').length;
  const failed = all.filter(r => r.status === 'failed').length;
  const skipped = all.filter(r => r.status === 'skipped').length;
  const totalDuration = all.reduce((s, r) => s + r.duration, 0);

  let md = `# E2E Test Report\n\n`;
  md += `**Total:** ${all.length} | ✅ ${passed} | ❌ ${failed} | ⏭️ ${skipped} | ⏱️ ${totalDuration.toFixed(0)}ms\n\n`;

  for (const group of groups) {
    md += `## ${group.name}\n\n`;
    md += `| Test | Status | Duration | Error |\n|------|--------|----------|-------|\n`;
    for (const r of group.results) {
      const icon = r.status === 'passed' ? '✅' : r.status === 'failed' ? '❌' : '⏭️';
      md += `| ${r.name} | ${icon} ${r.status} | ${r.duration.toFixed(0)}ms | ${r.error || '—'} |\n`;
    }
    md += '\n';
  }
  return md;
}
