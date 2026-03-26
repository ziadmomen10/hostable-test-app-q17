/**
 * StatsCounterSettingsContent - Content-only settings.
 */
import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart3 } from 'lucide-react';
import { StatsCounterSectionData, StatItem } from '@/types/newSectionTypes';
import { IconPicker, getIconComponent, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface StatsCounterSettingsContentProps { data: StatsCounterSectionData; onChange: (data: StatsCounterSectionData) => void; }

const StatsCounterSettingsContent: React.FC<StatsCounterSettingsContentProps> = ({ data, onChange }) => {
  const { updateArray } = useDataChangeHandlers(data, onChange);
  const handleStatsChange = useCallback((stats: StatItem[]) => updateArray('stats', stats), [updateArray]);
  const getItemIcon = useCallback((item: StatItem) => {
    const IconComponent = getIconComponent(item.icon || 'BarChart');
    return <IconComponent className="h-4 w-4 text-primary" />;
  }, []);

  return (
    <div className="space-y-3 p-3">
      <ItemListEditor items={data.stats} onItemsChange={handleStatsChange} createNewItem={() => ({ value: '0', label: 'New Stat', prefix: '', suffix: '', icon: 'BarChart' })} getItemTitle={(item) => `${item.prefix || ''}${item.value}${item.suffix || ''}`} getItemSubtitle={(item) => item.label || ''} getItemIcon={getItemIcon} addItemLabel="Add Stat" emptyMessage="No stats yet." emptyStateIcon={<BarChart3 className="h-10 w-10 text-muted-foreground/50 mb-2" />} maxItems={8} minItems={0} showDuplicateButton renderItem={(item, index, onUpdate) => (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3"><div className="space-y-1.5"><Label className="text-xs">Icon</Label><IconPicker value={item.icon || 'BarChart'} onChange={(v) => onUpdate({ icon: v })} /></div><div className="space-y-1.5"><Label className="text-xs">Value</Label><Input value={item.value} onChange={(e) => onUpdate({ value: e.target.value })} placeholder="99.9" className="h-9" /></div></div>
          <div className="grid grid-cols-2 gap-3"><div className="space-y-1.5"><Label className="text-xs">Prefix</Label><Input value={item.prefix || ''} onChange={(e) => onUpdate({ prefix: e.target.value })} placeholder="$" className="h-8" /></div><div className="space-y-1.5"><Label className="text-xs">Suffix</Label><Input value={item.suffix || ''} onChange={(e) => onUpdate({ suffix: e.target.value })} placeholder="%" className="h-8" /></div></div>
          <div className="space-y-1.5"><Label className="text-xs">Label</Label><Input value={item.label} onChange={(e) => onUpdate({ label: e.target.value })} placeholder="Uptime Guarantee" className="h-8" /></div>
        </div>
      )} />
    </div>
  );
};

export default StatsCounterSettingsContent;
