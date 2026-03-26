/**
 * Plans Comparison Settings Content
 * Fully controlled - derives from initialData, calls onDataChange directly.
 * Uses ItemListEditor for plans and features management.
 */

import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { LayoutGrid, ListChecks, Crown } from 'lucide-react';
import { PlansComparisonSectionData, PlanColumn, PlanFeatureRow } from '@/types/newSectionTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionHeaderFields, ItemListEditor } from './shared';
import { useDataChangeHandlers, useLatestRef } from '@/hooks/useLatestRef';

interface PlansComparisonSettingsContentProps {
  data: PlansComparisonSectionData;
  onChange: (data: PlansComparisonSectionData) => void;
}

const PlansComparisonSettingsContent: React.FC<PlansComparisonSettingsContentProps> = ({
  data,
  onChange,
}) => {
  // Use stable handlers that always reference fresh data
  const { updateFields, dataRef } = useDataChangeHandlers(data, onChange);

  // Plan functions - need to also update feature values when plans change
  const handlePlansChange = useCallback((newPlans: PlanColumn[]) => {
    const currentData = dataRef.current;
    // If a plan was added, add a new value column to all features
    if (newPlans.length > currentData.plans.length) {
      const newFeatures = currentData.features.map(f => ({
        ...f,
        values: [...f.values, false],
      }));
      updateFields({ plans: newPlans, features: newFeatures });
    } 
    // If a plan was removed, remove the corresponding value column from features
    else if (newPlans.length < currentData.plans.length) {
      // Find the removed index
      const removedIndex = currentData.plans.findIndex((p, i) => 
        i >= newPlans.length || p !== newPlans[i]
      );
      const newFeatures = currentData.features.map(f => ({
        ...f,
        values: f.values.filter((_, i) => i !== removedIndex),
      }));
      updateFields({ plans: newPlans, features: newFeatures });
    } else {
      // Just update plans (reorder or edit)
      updateFields({ plans: newPlans });
    }
  }, [updateFields, dataRef]);

  const updateFeatureValue = useCallback((featureIndex: number, planIndex: number, value: boolean | string) => {
    const currentData = dataRef.current;
    const newFeatures = [...currentData.features];
    const newValues = [...newFeatures[featureIndex].values];
    newValues[planIndex] = value;
    newFeatures[featureIndex] = { ...newFeatures[featureIndex], values: newValues };
    updateFields({ features: newFeatures });
  }, [updateFields, dataRef]);

  const createNewPlan = useCallback((): PlanColumn => ({
    name: 'New Plan',
    price: '$0/mo',
    isPopular: false,
  }), []);

  const createNewFeature = useCallback((): PlanFeatureRow => ({
    feature: 'New Feature',
    values: dataRef.current.plans.map(() => false),
  }), [dataRef]);

  const handleFeaturesChange = useCallback((features: PlanFeatureRow[]) => {
    updateFields({ features });
  }, [updateFields]);

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-3">
        <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
        <TabsTrigger value="plans" className="text-xs">Plans</TabsTrigger>
        <TabsTrigger value="features" className="text-xs">Features</TabsTrigger>
      </TabsList>

      {/* Content Tab */}
      <TabsContent value="content" className="space-y-3 p-3">
        <SectionHeaderFields
          badge={data.badge || ''}
          title={data.title}
          subtitle={data.subtitle || ''}
          onBadgeChange={(badge) => updateFields({ badge })}
          onTitleChange={(title) => updateFields({ title })}
          onSubtitleChange={(subtitle) => updateFields({ subtitle })}
        />
      </TabsContent>

      {/* Plans Tab */}
      <TabsContent value="plans" className="p-3">
        <ItemListEditor
          items={data.plans}
          onItemsChange={handlePlansChange}
          createNewItem={createNewPlan}
          getItemTitle={(plan) => plan.name || 'Untitled Plan'}
          getItemSubtitle={(plan) => typeof plan.price === 'number' ? `$${plan.price}${plan.period || '/mo'}` : plan.price}
          getItemIcon={(plan) => plan.isPopular ? (
            <Crown className="h-3 w-3 text-yellow-500" />
          ) : (
            <LayoutGrid className="h-3 w-3 text-muted-foreground" />
          )}
          addItemLabel="Add Plan"
          emptyMessage="No plans. Add one to get started."
          emptyStateIcon={<LayoutGrid className="h-10 w-10 text-muted-foreground/50 mb-2" />}
          minItems={1}
          maxItems={6}
          showDuplicateButton
          confirmDelete
          renderItem={(plan, index, onUpdate) => (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px]">Name</Label>
                  <Input
                    value={plan.name}
                    onChange={(e) => onUpdate({ name: e.target.value })}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[10px]">Price</Label>
                  <Input
                    value={plan.price}
                    onChange={(e) => onUpdate({ price: e.target.value })}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[10px]">Popular</Label>
                <Switch
                  checked={plan.isPopular || false}
                  onCheckedChange={(checked) => onUpdate({ isPopular: checked })}
                />
              </div>
            </div>
          )}
        />
      </TabsContent>

      {/* Features Tab */}
      <TabsContent value="features" className="p-3">
        <ItemListEditor
          items={data.features}
          onItemsChange={handleFeaturesChange}
          createNewItem={createNewFeature}
          getItemTitle={(feature) => feature.feature || 'Untitled Feature'}
          getItemIcon={() => <ListChecks className="h-3 w-3 text-muted-foreground" />}
          addItemLabel="Add Feature"
          emptyMessage="No features. Add one to compare across plans."
          emptyStateIcon={<ListChecks className="h-10 w-10 text-muted-foreground/50 mb-2" />}
          minItems={1}
          maxItems={30}
          showDuplicateButton
          confirmDelete
          renderItem={(feature, fIndex, onUpdate) => (
            <div className="space-y-3 pt-2">
              <div>
                <Label className="text-[10px]">Feature Name</Label>
                <Input
                  value={feature.feature}
                  onChange={(e) => onUpdate({ feature: e.target.value })}
                  className="h-7 text-xs"
                  placeholder="Feature name"
                />
              </div>
              <div className="grid grid-cols-4 gap-1">
                {feature.values.map((value, pIndex) => (
                  <div key={pIndex} className="text-center">
                    <Label className="text-[8px] text-muted-foreground block truncate">
                      {data.plans[pIndex]?.name}
                    </Label>
                    {typeof value === 'boolean' ? (
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => updateFeatureValue(fIndex, pIndex, checked)}
                      />
                    ) : (
                      <Input
                        value={value}
                        onChange={(e) => updateFeatureValue(fIndex, pIndex, e.target.value)}
                        className="h-6 text-[10px] text-center p-1"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        />
      </TabsContent>

    </Tabs>
  );
};

export default PlansComparisonSettingsContent;
