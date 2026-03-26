import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import type { DashboardMetricsData } from '@/components/DashboardMetrics';

interface CoverageItem {
  language_name: string;
  coverage_percentage: number;
}

interface DashboardExportButtonProps {
  metrics: DashboardMetricsData;
  coverage: CoverageItem[];
  avgCoverage: number;
}

const DashboardExportButton: React.FC<DashboardExportButtonProps> = ({ metrics, coverage, avgCoverage }) => {
  const handleExport = () => {
    const lines: string[] = [];
    lines.push(`Dashboard Export - ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`);
    lines.push('');
    lines.push('CORE METRICS');
    lines.push('Metric,Value');
    lines.push(`Total Users,${metrics.totalUsers}`);
    lines.push(`Total Pages,${metrics.totalPages}`);
    lines.push(`Active Languages,${metrics.totalLanguages}`);
    lines.push(`Total Translations,${metrics.totalTranslations}`);
    lines.push(`AI Translated,${metrics.aiTranslatedCount}`);
    lines.push(`Manual / Other,${metrics.reviewedCount}`);
    lines.push(`Online Now,${metrics.onlineUsers}`);
    lines.push(`Active Currencies,${metrics.activeCurrencies}`);
    lines.push(`Pending SEO Tasks,${metrics.pendingSeoTasks}`);
    lines.push('');
    lines.push('TRANSLATION COVERAGE');
    lines.push('Language,Coverage %');
    lines.push(`Average,${avgCoverage.toFixed(1)}`);
    coverage.forEach(c => lines.push(`${c.language_name},${c.coverage_percentage.toFixed(1)}`));

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" className="gap-2 h-8 text-xs bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] backdrop-blur-sm rounded-xl" onClick={handleExport} disabled={metrics.loading}>
      <Download className="h-3.5 w-3.5" />
      Export
    </Button>
  );
};

export default DashboardExportButton;
