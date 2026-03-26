/**
 * TrustedBySettingsContent - Content-only settings for Trusted By section.
 * Uses platforms (ReviewPlatform[]) and companies (TrustedCompany[]) structure.
 */
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, X, ChevronDown, Star, Building2 } from 'lucide-react';
import { TrustedBySectionData, ReviewPlatform, TrustedCompany } from '@/types/pageEditor';
import { SectionHeaderFields, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface TrustedBySettingsContentProps {
  data: TrustedBySectionData;
  onChange: (data: TrustedBySectionData) => void;
}

const TrustedBySettingsContent: React.FC<TrustedBySettingsContentProps> = ({ data, onChange }) => {
  const { updateField, updateArray, dataRef } = useDataChangeHandlers(data, onChange);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [platformsOpen, setPlatformsOpen] = useState(true);
  const [companiesOpen, setCompaniesOpen] = useState(false);

  // Safely get arrays with defaults
  const platforms = data.platforms || [];
  const companies = data.companies || [];

  const handlePlatformsChange = useCallback(
    (newPlatforms: ReviewPlatform[]) => updateArray('platforms', newPlatforms),
    [updateArray]
  );

  const createNewPlatform = useCallback(
    (): ReviewPlatform => ({
      name: 'Platform',
      rating: 5.0,
      reviewCount: '100+',
    }),
    []
  );

  const addCompany = useCallback(() => {
    if (!newCompanyName.trim()) return;
    const newCompany: TrustedCompany = { name: newCompanyName.trim() };
    updateArray('companies', [...(dataRef.current.companies || []), newCompany]);
    setNewCompanyName('');
  }, [newCompanyName, updateArray, dataRef]);

  const removeCompany = useCallback(
    (index: number) => {
      const currentCompanies = dataRef.current.companies || [];
      updateArray('companies', currentCompanies.filter((_, i) => i !== index));
    },
    [updateArray, dataRef]
  );

  return (
    <div className="space-y-4 p-3">
      <SectionHeaderFields
        title={data.title}
        onTitleChange={(v) => updateField('title', v)}
        titleLabel="Section Title"
        titlePlaceholder="Trusted by leading companies"
      />

      {/* Review Platforms */}
      <Collapsible open={platformsOpen} onOpenChange={setPlatformsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-muted/50 rounded-lg hover:bg-muted">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Review Platforms</span>
            <span className="text-xs text-muted-foreground">({platforms.length})</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${platformsOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <ItemListEditor
            items={platforms}
            onItemsChange={handlePlatformsChange}
            createNewItem={createNewPlatform}
            getItemTitle={(platform) => platform.name || 'Untitled Platform'}
            getItemSubtitle={(platform) => `${platform.rating} stars • ${platform.reviewCount} reviews`}
            getItemIcon={() => <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
            addItemLabel="Add Review Platform"
            emptyMessage="No review platforms."
            emptyStateIcon={<Star className="h-10 w-10 text-muted-foreground/50 mb-2" />}
            minItems={0}
            maxItems={6}
            showDuplicateButton
            confirmDelete
            renderItem={(platform, index, onUpdate) => (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Platform Name</Label>
                    <DebouncedInput
                      value={platform.name}
                      onChange={(value) => onUpdate({ name: value })}
                      placeholder="Google, Trustpilot, etc."
                      className="h-9"
                      debounceMs={300}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Rating (0-5)</Label>
                    <DebouncedInput
                      type="number"
                      value={String(platform.rating)}
                      onChange={(value) => onUpdate({ rating: parseFloat(value) || 0 })}
                      placeholder="4.8"
                      className="h-9"
                      debounceMs={300}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Review Count</Label>
                  <DebouncedInput
                    value={platform.reviewCount}
                    onChange={(value) => onUpdate({ reviewCount: value })}
                    placeholder="1,000+ reviews"
                    className="h-8"
                    debounceMs={300}
                  />
                </div>
              </div>
            )}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Company Names */}
      <Collapsible open={companiesOpen} onOpenChange={setCompaniesOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-muted/50 rounded-lg hover:bg-muted">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Company Names</span>
            <span className="text-xs text-muted-foreground">({companies.length})</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${companiesOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center gap-1 bg-muted rounded-full px-3 py-1">
                <span className="text-sm">{company.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 hover:bg-destructive/10"
                  onClick={() => removeCompany(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="h-9"
              onKeyDown={(e) => e.key === 'Enter' && addCompany()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCompany}
              disabled={!newCompanyName.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TrustedBySettingsContent;
