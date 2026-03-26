/**
 * Grid Settings Panel
 * 
 * Settings panel for section grid configuration:
 * - Column count presets
 * - Gap configuration
 * - Alignment
 * - Add/remove columns
 */

import React from 'react';
import { Plus, Minus, Grid3X3, AlignHorizontalDistributeCenter, AlignHorizontalDistributeStart, AlignHorizontalDistributeEnd } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useEditorStore } from '@/stores/editorStore';
import { generateColumnId } from '@/types/grid';
import type { SectionGrid, GridColumn as GridColumnType } from '@/types/grid';

interface GridSettingsPanelProps {
  sectionId: string;
  grid: SectionGrid;
}

const COLUMN_PRESETS = [
  { label: '1 Column', value: 1, icon: '▢' },
  { label: '2 Columns', value: 2, icon: '▢▢' },
  { label: '3 Columns', value: 3, icon: '▢▢▢' },
  { label: '4 Columns', value: 4, icon: '▢▢▢▢' },
  { label: '6 Columns', value: 6, icon: '▢▢▢▢▢▢' },
];

const GAP_OPTIONS = [
  { label: 'None', value: '0' },
  { label: 'Extra Small', value: '0.5rem' },
  { label: 'Small', value: '1rem' },
  { label: 'Medium', value: '1.5rem' },
  { label: 'Large', value: '2rem' },
  { label: 'Extra Large', value: '3rem' },
];

export function GridSettingsPanel({ sectionId, grid }: GridSettingsPanelProps) {
  const { setSectionGrid, addColumn, removeColumn } = useEditorStore();
  
  const currentColumnCount = grid.columns.length;
  const currentGap = grid.gap || '1rem';
  const currentAlignment = grid.alignment || 'stretch';

  const handleColumnCountChange = (count: number) => {
    const currentColumns = grid.columns;
    
    if (count > currentColumnCount) {
      // Add columns
      const columnsToAdd = count - currentColumnCount;
      const newWidth = `${(100 / count).toFixed(2)}%`;
      
      for (let i = 0; i < columnsToAdd; i++) {
        const newColumn: GridColumnType = {
          id: generateColumnId(),
          width: { desktop: newWidth },
          widgets: [],
        };
        addColumn(sectionId, newColumn);
      }
      
      // Redistribute widths
      const updatedColumns = [...currentColumns];
      for (let i = 0; i < columnsToAdd; i++) {
        updatedColumns.push({
          id: generateColumnId(),
          width: { desktop: newWidth },
          widgets: [],
        });
      }
      
      // Update all column widths to be equal
      const equalWidth = `${(100 / count).toFixed(2)}%`;
      const redistributedColumns = updatedColumns.map(col => ({
        ...col,
        width: { ...col.width, desktop: equalWidth },
      }));
      
      setSectionGrid(sectionId, { ...grid, columns: redistributedColumns });
    } else if (count < currentColumnCount) {
      // Remove columns from the end (move widgets to last remaining column)
      const columnsToRemove = currentColumnCount - count;
      const remainingColumns = currentColumns.slice(0, count);
      const removedColumns = currentColumns.slice(count);
      
      // Collect all widgets from removed columns
      const widgetsToMove = removedColumns.flatMap(col => col.widgets);
      
      // Add widgets to the last remaining column
      if (remainingColumns.length > 0 && widgetsToMove.length > 0) {
        const lastColumn = remainingColumns[remainingColumns.length - 1];
        lastColumn.widgets = [...lastColumn.widgets, ...widgetsToMove];
      }
      
      // Redistribute widths
      const equalWidth = `${(100 / count).toFixed(2)}%`;
      const redistributedColumns = remainingColumns.map(col => ({
        ...col,
        width: { ...col.width, desktop: equalWidth },
      }));
      
      setSectionGrid(sectionId, { ...grid, columns: redistributedColumns });
    }
  };

  const handleGapChange = (gap: string) => {
    setSectionGrid(sectionId, { ...grid, gap });
  };

  const handleAlignmentChange = (alignment: 'start' | 'center' | 'end' | 'stretch') => {
    setSectionGrid(sectionId, { ...grid, alignment });
  };

  const handleAddColumn = () => {
    const newColumn: GridColumnType = {
      id: generateColumnId(),
      width: { desktop: '1fr' },
      widgets: [],
    };
    addColumn(sectionId, newColumn);
  };

  const handleRemoveLastColumn = () => {
    if (grid.columns.length > 1) {
      const lastColumn = grid.columns[grid.columns.length - 1];
      removeColumn(sectionId, lastColumn.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Grid3X3 className="h-4 w-4" />
        <span>Grid Settings</span>
      </div>
      
      <Separator />
      
      {/* Column Count Presets */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Column Layout</Label>
        <div className="grid grid-cols-5 gap-1">
          {COLUMN_PRESETS.map(preset => (
            <Button
              key={preset.value}
              variant={currentColumnCount === preset.value ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => handleColumnCountChange(preset.value)}
            >
              {preset.value}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Add/Remove Column Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleRemoveLastColumn}
          disabled={currentColumnCount <= 1}
        >
          <Minus className="h-3 w-3 mr-1" />
          Remove
        </Button>
        <span className="text-sm font-medium w-8 text-center">{currentColumnCount}</span>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleAddColumn}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>
      
      <Separator />
      
      {/* Gap Setting */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Column Gap</Label>
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
      
      {/* Alignment Setting */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Alignment</Label>
        <div className="flex gap-1">
          <Button
            variant={currentAlignment === 'start' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => handleAlignmentChange('start')}
          >
            <AlignHorizontalDistributeStart className="h-4 w-4" />
          </Button>
          <Button
            variant={currentAlignment === 'center' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => handleAlignmentChange('center')}
          >
            <AlignHorizontalDistributeCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={currentAlignment === 'end' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => handleAlignmentChange('end')}
          >
            <AlignHorizontalDistributeEnd className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Separator />
      
      {/* Column List */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Columns ({currentColumnCount})</Label>
        <div className="space-y-1">
          {grid.columns.map((column, index) => (
            <div 
              key={column.id}
              className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs"
            >
              <span>Column {index + 1}</span>
              <span className="text-muted-foreground">
                {column.widgets.length} widget{column.widgets.length !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export type { GridSettingsPanelProps };
