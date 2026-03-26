import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type DateRange = 'today' | '7d' | '30d' | 'all';

interface DashboardDateFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const options: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'all', label: 'All time' },
];

const DashboardDateFilter: React.FC<DashboardDateFilterProps> = ({ value, onChange }) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => { if (v) onChange(v as DateRange); }}
      className="dark:bg-white/[0.06] bg-slate-100 backdrop-blur-sm rounded-lg p-0.5 border dark:border-white/[0.08] border-slate-200"
    >
      {options.map((opt) => (
        <ToggleGroupItem
          key={opt.value}
          value={opt.value}
          className="text-xs px-3 py-1 h-7 text-muted-foreground data-[state=on]:dark:bg-white/[0.12] data-[state=on]:bg-white data-[state=on]:text-foreground data-[state=on]:shadow-sm data-[state=on]:border data-[state=on]:dark:border-white/[0.15] data-[state=on]:border-slate-200 rounded-md transition-all"
        >
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default DashboardDateFilter;
