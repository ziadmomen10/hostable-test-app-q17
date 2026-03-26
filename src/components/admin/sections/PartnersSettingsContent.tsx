import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SectionHeaderFields, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { PartnersSectionData, PartnerItem } from '@/types/newSectionTypes';

interface PartnersSettingsContentProps {
  data: PartnersSectionData;
  onChange: (data: PartnersSectionData) => void;
}

const PartnersSettingsContent = ({ 
  data, 
  onChange 
}: PartnersSettingsContentProps) => {
  // CRITICAL: Use this hook to prevent stale closure bugs
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);
  
  return (
    <div className="space-y-6 p-3">
      {/* Reusable header fields component */}
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(value) => updateField('badge', value)}
        onTitleChange={(value) => updateField('title', value)}
        onSubtitleChange={(value) => updateField('subtitle', value)}
      />
      
      {/* Array item editor */}
      {/* Note: Do NOT use explicit generic syntax <ItemListEditor<T>> - it breaks the build */}
      <ItemListEditor
        items={data.partners || []}
        onItemsChange={(partners) => updateArray('partners', partners)}
        getItemTitle={(item) => item.name || 'Untitled Partner'}
        createNewItem={() => ({
          id: crypto.randomUUID(),
          logo: '/placeholder.svg',
          name: 'New Partner',
          description: 'Partner description',
          website: '',
        })}
        addItemLabel="Add Partner"
        renderItem={(item, index, onUpdate) => (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input
                value={item.logo || ''}
                onChange={(e) => onUpdate({ logo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Partner Name</Label>
              <Input
                value={item.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="e.g. TechCorp"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={item.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Brief description of the partner"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Website URL (optional)</Label>
              <Input
                value={item.website || ''}
                onChange={(e) => onUpdate({ website: e.target.value })}
                placeholder="https://partner-website.com"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default PartnersSettingsContent;
