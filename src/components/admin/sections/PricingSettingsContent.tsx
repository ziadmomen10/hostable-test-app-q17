/**
 * PricingSettingsContent Component
 * 
 * Enhanced with proper Add Plan button, duplicate functionality,
 * and improved nested feature management.
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card } from '@/components/ui/card';
import { 
  Star, Plus, ChevronDown, ChevronRight, Trash2, Copy,
  Globe, Cpu, HardDrive, Network, ShieldCheck, Lock, CloudUpload, Zap, 
  Users, ArrowRightLeft, Headphones, BadgeCheck, Mail, Server, Database, 
  Wifi, Clock, RefreshCw, Shield, Check, MemoryStick, ArrowUp, ArrowDown,
  GripVertical,
  type LucideIcon
} from 'lucide-react';
import { PricingSectionData, PlanData } from '@/types/pageEditor';
import { SectionHeaderFields } from './shared';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Input } from '@/components/ui/input';

const iconMap: Record<string, LucideIcon> = {
  Globe, Cpu, MemoryStick, HardDrive, ArrowLeftRight: ArrowRightLeft, Network,
  ShieldCheck, Lock, CloudUpload, Zap, Users, ArrowRightLeft,
  Headphones, BadgeCheck, Mail, Server, Database, Wifi, Clock,
  RefreshCw, Shield, Check,
};

const AVAILABLE_ICONS = Object.entries(iconMap).map(([name, icon]) => ({ name, icon }));

interface PricingSettingsContentProps {
  data: PricingSectionData;
  onChange: (data: PricingSectionData) => void;
}

const PricingSettingsContent: React.FC<PricingSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateField, dataRef } = useDataChangeHandlers(data, onChange);
  const [expandedPlans, setExpandedPlans] = useState<number[]>([0]);
  const [activeTab, setActiveTab] = useState('section');
  const [editingPlanFeatures, setEditingPlanFeatures] = useState<number | null>(0);
  const [newFeatureIcon, setNewFeatureIcon] = useState('Check');
  const [newFeatureLabel, setNewFeatureLabel] = useState('');

  const updatePlan = useCallback((index: number, field: keyof PlanData, value: any) => {
    onChange({
      ...dataRef.current,
      plans: dataRef.current.plans.map((p, i) => i === index ? { ...p, [field]: value } : p),
    });
  }, [onChange, dataRef]);

  const toggleHighlight = useCallback((index: number, isHighlighted: boolean) => {
    onChange({
      ...dataRef.current,
      plans: dataRef.current.plans.map((p, i) => ({
        ...p,
        isHighlighted: isHighlighted ? i === index : (i === index ? false : p.isHighlighted),
      })),
    });
  }, [onChange, dataRef]);

  // NEW: Proper Add Plan function
  const addPlan = useCallback(() => {
    if (dataRef.current.planCount >= 6) return;
    
    const newPlan: PlanData = {
      name: `Plan ${dataRef.current.planCount + 1}`,
      description: 'Plan description',
      price: '0',
      originalPrice: '',
      discount: '',
      period: '/mo',
      buttonText: 'Get Started',
      isHighlighted: false,
      featureValues: {},
      features: [],
    };
    
    onChange({
      ...dataRef.current,
      planCount: dataRef.current.planCount + 1,
      plans: [...dataRef.current.plans, newPlan],
    });
    setExpandedPlans(prev => [...prev, dataRef.current.plans.length]);
  }, [onChange, dataRef]);

  // NEW: Duplicate Plan function
  const duplicatePlan = useCallback((index: number) => {
    if (dataRef.current.planCount >= 6) return;
    
    const originalPlan = dataRef.current.plans[index];
    const newPlan: PlanData = {
      ...JSON.parse(JSON.stringify(originalPlan)),
      name: `${originalPlan.name} (Copy)`,
      isHighlighted: false,
    };
    
    const newPlans = [
      ...dataRef.current.plans.slice(0, index + 1),
      newPlan,
      ...dataRef.current.plans.slice(index + 1),
    ];
    
    onChange({
      ...dataRef.current,
      planCount: dataRef.current.planCount + 1,
      plans: newPlans,
    });
    setExpandedPlans(prev => [...prev, index + 1]);
  }, [onChange, dataRef]);

  const deletePlan = useCallback((index: number) => {
    if (dataRef.current.planCount <= 1) return;
    onChange({
      ...dataRef.current,
      planCount: dataRef.current.planCount - 1,
      plans: dataRef.current.plans.filter((_, i) => i !== index),
    });
    setExpandedPlans(prev => prev.filter(p => p !== index).map(p => p > index ? p - 1 : p));
  }, [onChange, dataRef]);

  const movePlan = useCallback((index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= dataRef.current.plans.length) return;
    
    const newPlans = [...dataRef.current.plans];
    [newPlans[index], newPlans[newIndex]] = [newPlans[newIndex], newPlans[index]];
    
    onChange({ ...dataRef.current, plans: newPlans });
    
    setExpandedPlans(prev => {
      return prev.map(p => {
        if (p === index) return newIndex;
        if (p === newIndex) return index;
        return p;
      });
    });
  }, [onChange, dataRef]);

  const addFeature = useCallback((planIndex: number) => {
    if (!newFeatureLabel.trim()) return;
    
    onChange({
      ...dataRef.current,
      plans: dataRef.current.plans.map((p, i) => 
        i === planIndex 
          ? { ...p, features: [...(p.features || []), { icon: newFeatureIcon, label: newFeatureLabel }] }
          : p
      ),
    });
    setNewFeatureLabel('');
  }, [onChange, dataRef, newFeatureIcon, newFeatureLabel]);

  const removeFeature = useCallback((planIndex: number, featureIndex: number) => {
    onChange({
      ...dataRef.current,
      plans: dataRef.current.plans.map((p, i) => 
        i === planIndex 
          ? { ...p, features: (p.features || []).filter((_, fi) => fi !== featureIndex) }
          : p
      ),
    });
  }, [onChange, dataRef]);

  const moveFeature = useCallback((planIndex: number, featureIndex: number, direction: 'up' | 'down') => {
    const plan = dataRef.current.plans[planIndex];
    if (!plan.features) return;
    
    const newIndex = direction === 'up' ? featureIndex - 1 : featureIndex + 1;
    if (newIndex < 0 || newIndex >= plan.features.length) return;
    
    const newFeatures = [...plan.features];
    [newFeatures[featureIndex], newFeatures[newIndex]] = [newFeatures[newIndex], newFeatures[featureIndex]];
    
    onChange({
      ...dataRef.current,
      plans: dataRef.current.plans.map((p, i) => 
        i === planIndex ? { ...p, features: newFeatures } : p
      ),
    });
  }, [onChange, dataRef]);

  const togglePlanExpanded = useCallback((planIndex: number) => {
    setExpandedPlans(prev => 
      prev.includes(planIndex) ? prev.filter(p => p !== planIndex) : [...prev, planIndex]
    );
  }, []);

  const getIconComponent = useCallback((iconName: string): LucideIcon => {
    return iconMap[iconName] || Check;
  }, []);

  const canAddPlan = data.planCount < 6;
  const canRemovePlan = data.planCount > 1;

  return (
    <TooltipProvider>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-2 mt-2" style={{ width: 'calc(100% - 16px)' }}>
          <TabsTrigger value="section" className="text-xs">Section</TabsTrigger>
          <TabsTrigger value="plans" className="text-xs">Plans</TabsTrigger>
          <TabsTrigger value="features" className="text-xs">Features</TabsTrigger>
        </TabsList>

        <div className="mt-2">
          {/* Section Settings Tab */}
          <TabsContent value="section" className="space-y-3 mt-0 px-3 pb-3">
            <SectionHeaderFields
              title={data.title}
              subtitle={data.subtitle}
              onTitleChange={(v) => updateField('title', v)}
              onSubtitleChange={(v) => updateField('subtitle', v)}
              titleLabel="Section Title"
              subtitleLabel="Section Subtitle"
              titlePlaceholder="Web Hosting Plans..."
            />
          </TabsContent>

          {/* Plan Cards Tab */}
          <TabsContent value="plans" className="space-y-2 mt-0 px-3 pb-3">
            {/* Header with count */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {data.planCount} plan{data.planCount !== 1 ? 's' : ''}
                {canAddPlan && <span className="ml-1">({6 - data.planCount} more allowed)</span>}
              </span>
            </div>

            {Array.from({ length: data.planCount }, (_, index) => {
              const plan: PlanData = data.plans[index] || {
                name: '',
                description: '',
                originalPrice: '',
                price: '',
                discount: '',
                period: '/mo',
                buttonText: 'Get Started',
                isHighlighted: false,
                featureValues: {},
                features: [],
              };
              const isExpanded = expandedPlans.includes(index);
              
              return (
                <Collapsible key={index} open={isExpanded} onOpenChange={() => togglePlanExpanded(index)}>
                  <Card className="overflow-hidden">
                    <div className="flex items-center gap-2 p-2">
                      {/* Drag handle */}
                      <div className="cursor-grab text-muted-foreground hover:text-foreground">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center gap-2 flex-1 text-left"
                        >
                          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                          <span className="font-medium text-xs truncate">{plan.name || `Plan ${index + 1}`}</span>
                          {plan.isHighlighted && (
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => movePlan(index, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move up</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => movePlan(index, 'down')}
                              disabled={index === data.planCount - 1}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move down</TooltipContent>
                        </Tooltip>
                        
                        {canAddPlan && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => duplicatePlan(index)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Duplicate</TooltipContent>
                          </Tooltip>
                        )}
                        
                        {canRemovePlan && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => deletePlan(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    
                    <CollapsibleContent className="px-2 py-2 border-t space-y-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <DebouncedInput 
                          value={plan.name}
                          onChange={(v) => updatePlan(index, 'name', v)}
                          placeholder="Starter"
                          className="h-7 text-xs"
                          debounceMs={300}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <DebouncedInput 
                          value={plan.description}
                          onChange={(v) => updatePlan(index, 'description', v)}
                          placeholder="For small websites"
                          className="h-7 text-xs"
                          debounceMs={300}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Price</Label>
                          <DebouncedInput 
                            value={plan.price}
                            onChange={(v) => updatePlan(index, 'price', v)}
                            placeholder="19.99"
                            className="h-7 text-xs"
                            debounceMs={300}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Original</Label>
                          <DebouncedInput 
                            value={plan.originalPrice}
                            onChange={(v) => updatePlan(index, 'originalPrice', v)}
                            placeholder="29.99"
                            className="h-7 text-xs"
                            debounceMs={300}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Discount %</Label>
                          <DebouncedInput 
                            value={plan.discount}
                            onChange={(v) => updatePlan(index, 'discount', v)}
                            placeholder="33"
                            className="h-7 text-xs"
                            debounceMs={300}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Period</Label>
                          <Select 
                            value={plan.period} 
                            onValueChange={(val) => updatePlan(index, 'period', val)}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="/mo">/mo</SelectItem>
                              <SelectItem value="/yr">/yr</SelectItem>
                              <SelectItem value="/week">/week</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs">Button Text</Label>
                        <DebouncedInput 
                          value={plan.buttonText}
                          onChange={(v) => updatePlan(index, 'buttonText', v)}
                          placeholder="Get Started"
                          className="h-7 text-xs"
                          debounceMs={300}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs font-medium">Highlight</span>
                        </div>
                        <Switch 
                          checked={plan.isHighlighted}
                          onCheckedChange={(checked) => toggleHighlight(index, checked)}
                        />
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}

            {/* Add Plan Button */}
            {canAddPlan && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPlan}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            )}

            {!canAddPlan && (
              <p className="text-xs text-muted-foreground text-center py-2">
                Maximum of 6 plans reached
              </p>
            )}
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-3 mt-0 px-3 pb-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Select Plan</Label>
              <Select 
                value={editingPlanFeatures?.toString() || '0'}
                onValueChange={(val) => setEditingPlanFeatures(parseInt(val, 10))}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: data.planCount }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {data.plans[i]?.name || `Plan ${i + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {editingPlanFeatures !== null && data.plans[editingPlanFeatures] && (
              <>
                <div className="border rounded-lg divide-y max-h-[180px] overflow-y-auto">
                  {(data.plans[editingPlanFeatures].features || []).length === 0 ? (
                    <div className="p-3 text-center text-xs text-muted-foreground">
                      No features yet. Add features below.
                    </div>
                  ) : (
                    (data.plans[editingPlanFeatures].features || []).map((feature, fi) => {
                      const IconComp = getIconComponent(feature.icon);
                      return (
                        <div key={fi} className="flex items-center gap-2 p-2 hover:bg-muted/50">
                          <GripVertical className="h-3 w-3 text-muted-foreground cursor-grab" />
                          <IconComp className="h-3 w-3 text-muted-foreground" />
                          <span className="flex-1 text-xs truncate">{feature.label}</span>
                          <div className="flex items-center gap-0.5">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => moveFeature(editingPlanFeatures, fi, 'up')}
                              disabled={fi === 0}
                            >
                              <ArrowUp className="h-2.5 w-2.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => moveFeature(editingPlanFeatures, fi, 'down')}
                              disabled={fi === (data.plans[editingPlanFeatures].features || []).length - 1}
                            >
                              <ArrowDown className="h-2.5 w-2.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => removeFeature(editingPlanFeatures, fi)}
                            >
                              <Trash2 className="h-2.5 w-2.5 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Add Feature</Label>
                  <div className="flex gap-1">
                    <Select value={newFeatureIcon} onValueChange={setNewFeatureIcon}>
                      <SelectTrigger className="w-20 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
                          <SelectItem key={name} value={name}>
                            <div className="flex items-center gap-1">
                              <Icon className="h-3 w-3" />
                              <span className="text-xs">{name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input 
                      value={newFeatureLabel}
                      onChange={(e) => setNewFeatureLabel(e.target.value)}
                      placeholder="Feature label"
                      className="flex-1 h-7 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && editingPlanFeatures !== null) {
                          addFeature(editingPlanFeatures);
                        }
                      }}
                    />
                    <Button 
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => editingPlanFeatures !== null && addFeature(editingPlanFeatures)}
                      disabled={!newFeatureLabel.trim()}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

        </div>
      </Tabs>
    </TooltipProvider>
  );
};

export default PricingSettingsContent;
