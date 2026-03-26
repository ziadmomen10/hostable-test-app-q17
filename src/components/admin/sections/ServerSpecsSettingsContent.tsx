/**
 * Server Specs Settings Content - Content-only settings.
 */
import React, { useCallback } from 'react';
import { ServerSpecsSectionData, ServerSpec } from '@/types/newSectionTypes';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Server, Crown } from 'lucide-react';
import { SectionHeaderFields, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface ServerSpecsSettingsContentProps { data: ServerSpecsSectionData; onChange: (data: ServerSpecsSectionData) => void; }

const ServerSpecsSettingsContent: React.FC<ServerSpecsSettingsContentProps> = ({ data, onChange }) => {
  const { updateFields, updateArray } = useDataChangeHandlers(data, onChange);
  const handleSpecsChange = useCallback((specs: ServerSpec[]) => updateArray('specs', specs), [updateArray]);
  const createNewSpec = useCallback((): ServerSpec => ({ name: 'New Server', cpu: '4 vCPU', ram: '8GB', storage: '100GB SSD', bandwidth: '1TB', price: '$49.99/mo' }), []);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields badge={data.badge || ''} title={data.title} subtitle={data.subtitle || ''} onBadgeChange={(badge) => updateFields({ badge })} onTitleChange={(title) => updateFields({ title })} onSubtitleChange={(subtitle) => updateFields({ subtitle })} />
      <div className="border-t pt-4">
        <h4 className="font-medium text-sm mb-3">Server Specifications</h4>
        <ItemListEditor items={data.specs} onItemsChange={handleSpecsChange} createNewItem={createNewSpec} getItemTitle={(spec) => spec.name || 'Untitled Server'} getItemSubtitle={(spec) => spec.price} getItemIcon={(spec) => spec.isPopular ? <Crown className="h-3 w-3 text-yellow-500" /> : <Server className="h-3 w-3 text-muted-foreground" />} addItemLabel="Add Server" emptyMessage="No servers." emptyStateIcon={<Server className="h-10 w-10 text-muted-foreground/50 mb-2" />} minItems={1} maxItems={10} showDuplicateButton confirmDelete renderItem={(spec, index, onUpdate) => (
          <div className="space-y-3 pt-2">
            <div><Label className="text-[10px]">Server Name</Label><DebouncedInput value={spec.name} onChange={(value) => onUpdate({ name: value })} className="h-7 text-xs" debounceMs={300} /></div>
            <div className="grid grid-cols-2 gap-2"><div><Label className="text-[10px]">CPU</Label><DebouncedInput value={spec.cpu} onChange={(value) => onUpdate({ cpu: value })} placeholder="4 vCPU" className="h-7 text-xs" debounceMs={300} /></div><div><Label className="text-[10px]">RAM</Label><DebouncedInput value={spec.ram} onChange={(value) => onUpdate({ ram: value })} placeholder="8GB" className="h-7 text-xs" debounceMs={300} /></div></div>
            <div className="grid grid-cols-2 gap-2"><div><Label className="text-[10px]">Storage</Label><DebouncedInput value={spec.storage} onChange={(value) => onUpdate({ storage: value })} placeholder="100GB SSD" className="h-7 text-xs" debounceMs={300} /></div><div><Label className="text-[10px]">Bandwidth</Label><DebouncedInput value={spec.bandwidth} onChange={(value) => onUpdate({ bandwidth: value })} placeholder="1TB" className="h-7 text-xs" debounceMs={300} /></div></div>
            <div><Label className="text-[10px]">Price</Label><DebouncedInput value={spec.price} onChange={(value) => onUpdate({ price: value })} placeholder="$49.99/mo" className="h-7 text-xs" debounceMs={300} /></div>
            <div className="flex items-center justify-between"><Label className="text-[10px]">Popular</Label><Switch checked={spec.isPopular || false} onCheckedChange={(checked) => onUpdate({ isPopular: checked })} /></div>
          </div>
        )} />
      </div>
    </div>
  );
};

export default ServerSpecsSettingsContent;
