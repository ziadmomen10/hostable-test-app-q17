/**
 * Column Settings Panel
 * 
 * Settings panel for individual column configuration:
 * - Column width (percentage or fraction)
 * - Vertical alignment
 * - Widget gap within column
 * - Responsive overrides
 * - Delete column
 */

import React from 'react';
import { Trash2, Columns, AlignVerticalDistributeStart, AlignVerticalDistributeCenter, AlignVerticalDistributeEnd } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { useEditorStore } from '@/stores/editorStore';
import type { GridColumn as GridColumnType, ResponsiveWidth } from '@/types/grid';

interface ColumnSettingsPanelProps {
  sectionId: string;
  column: GridColumnType;
  columnIndex: number;
  totalColumns: number;
}

const WIDTH_PRESETS = [
  { label: 'Auto (1fr)', value: '1fr' },
  { label: '25%', value: '25%' },
  { label: '33%', value: '33.33%' },
  { label: '50%', value: '50%' },
  { label: '66%', value: '66.66%' },
  { label: '75%', value: '75%' },
  { label: '100%', value: '100%' },
];

const GAP_OPTIONS = [
  { label: 'None', value: '0' },
  { label: 'Small', value: '0.5rem' },
  { label: 'Medium', value: '1rem' },
  { label: 'Large', value: '1.5rem' },
];

export function ColumnSettingsPanel({ 
  sectionId, 
  column, 
  columnIndex, 
  totalColumns 
}: ColumnSettingsPanelProps) {
  const { updateColumnWidth, removeColumn, setSectionGrid, pageData } = useEditorStore();
  
  const currentWidth = column.width.desktop || '1fr';
  const currentAlignment = column.alignment || 'start';
  const currentGap = column.gap || '1rem';
  
  // Get current section grid for updates
  const section = pageData?.sections.find(s => s.id === sectionId);
  const grid = section?.grid;

  const handleWidthChange = (value: string) => {
    const newWidth: ResponsiveWidth = {
      ...column.width,
      desktop: value,
    };
    updateColumnWidth(sectionId, column.id, newWidth);
  };

  const handleAlignmentChange = (alignment: 'start' | 'center' | 'end' | 'stretch') => {
    if (!grid) return;
    
    const updatedColumns = grid.columns.map(col => 
      col.id === column.id ? { ...col, alignment } : col
    );
    setSectionGrid(sectionId, { ...grid, columns: updatedColumns });
  };

  const handleGapChange = (gap: string) => {
    if (!grid) return;
    
    const updatedColumns = grid.columns.map(col => 
      col.id === column.id ? { ...col, gap } : col
    );
    setSectionGrid(sectionId, { ...grid, columns: updatedColumns });
  };

  const handleDeleteColumn = () => {
    if (totalColumns > 1) {
      removeColumn(sectionId, column.id);
    }
  };

  const handleResponsiveWidthChange = (device: 'tablet' | 'mobile', value: string) => {
    const newWidth: ResponsiveWidth = {
      ...column.width,
      [device]: value || undefined,
    };
    updateColumnWidth(sectionId, column.id, newWidth);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Columns className="h-4 w-4" />
          <span>Column {columnIndex + 1} Settings</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={handleDeleteColumn}
          disabled={totalColumns <= 1}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator />
      
      {/* Column Width */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Column Width (Desktop)</Label>
        <Select value={currentWidth} onValueChange={handleWidthChange}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WIDTH_PRESETS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Custom width (e.g., 40%)"
          value={currentWidth}
          onChange={(e) => handleWidthChange(e.target.value)}
          className="h-8 text-xs"
        />
      </div>
      
      <Separator />
      
      {/* Responsive Widths */}
      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground">Responsive Widths</Label>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs">Tablet</span>
            <Select 
              value={column.width.tablet || ''} 
              onValueChange={(v) => handleResponsiveWidthChange('tablet', v)}
            >
              <SelectTrigger className="h-7 w-24">
                <SelectValue placeholder="Auto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Auto</SelectItem>
                <SelectItem value="50%">50%</SelectItem>
                <SelectItem value="100%">100%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs">Mobile</span>
            <Select 
              value={column.width.mobile || ''} 
              onValueChange={(v) => handleResponsiveWidthChange('mobile', v)}
            >
              <SelectTrigger className="h-7 w-24">
                <SelectValue placeholder="Auto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Auto</SelectItem>
                <SelectItem value="100%">100%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Vertical Alignment */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Vertical Alignment</Label>
        <div className="flex gap-1">
          <Button
            variant={currentAlignment === 'start' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => handleAlignmentChange('start')}
          >
            <AlignVerticalDistributeStart className="h-4 w-4" />
          </Button>
          <Button
            variant={currentAlignment === 'center' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => handleAlignmentChange('center')}
          >
            <AlignVerticalDistributeCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={currentAlignment === 'end' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => handleAlignmentChange('end')}
          >
            <AlignVerticalDistributeEnd className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Widget Gap */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Widget Gap</Label>
        <Select value={currentGap} onValueChange={handleGapChange}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GAP_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Separator />
      
      {/* Widget Count */}
      <div className="p-2 bg-muted/50 rounded text-xs">
        <span className="text-muted-foreground">Widgets: </span>
        <span className="font-medium">{column.widgets.length}</span>
      </div>
    </div>
  );
}

export type { ColumnSettingsPanelProps };
