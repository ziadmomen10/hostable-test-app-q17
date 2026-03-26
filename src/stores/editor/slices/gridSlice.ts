/**
 * Grid Slice
 * 
 * Handles all grid-related mutations for Elementor-style layouts:
 * - Column CRUD and reordering
 * - Widget CRUD and movement
 * - Column width updates
 */

import { StateCreator } from 'zustand';
import { SectionGrid, GridColumn, GridWidget, ResponsiveWidth } from '@/types/grid';
import { logger } from '@/lib/logger';
import type { EditorStoreState, GridActions } from '../types';

// ============================================================================
// Types
// ============================================================================

export type { GridActions } from '../types';

// Combined store type for cross-slice access
type CombinedStore = EditorStoreState & GridActions;

// ============================================================================
// Slice Creator
// ============================================================================

export const createGridSlice: StateCreator<
  CombinedStore,
  [['zustand/devtools', never], ['zustand/subscribeWithSelector', never]],
  [],
  GridActions
> = (set, get) => ({
  setSectionGrid: (sectionId, grid) => {
    const { pageData, sectionVersions } = get();
    if (!pageData) return;

    logger.grid.debug('setSectionGrid:', { sectionId, columnCount: grid.columns.length });
    const newSections = pageData.sections.map((s) =>
      s.id === sectionId ? { ...s, grid } : s
    );

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },

  addColumn: (sectionId, column, index) => {
    const { pageData, sectionVersions } = get();
    if (!pageData) return;

    const newSections = pageData.sections.map((section) => {
      if (section.id !== sectionId || !section.grid) return section;

      const newColumns = [...section.grid.columns];
      const insertIndex = index ?? newColumns.length;
      newColumns.splice(insertIndex, 0, column);

      return { ...section, grid: { ...section.grid, columns: newColumns } };
    });

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    logger.grid.debug('addColumn:', { sectionId, columnId: column.id, index });
    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },

  removeColumn: (sectionId, columnId) => {
    const { pageData, sectionVersions } = get();
    if (!pageData) return;

    const newSections = pageData.sections.map((section) => {
      if (section.id !== sectionId || !section.grid) return section;

      const newColumns = section.grid.columns.filter((c: GridColumn) => c.id !== columnId);
      return { ...section, grid: { ...section.grid, columns: newColumns } };
    });

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    logger.grid.debug('removeColumn:', { sectionId, columnId });
    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },

  reorderColumn: (sectionId, sourceIndex, destIndex) => {
    const { pageData, sectionVersions } = get();
    if (!pageData || sourceIndex === destIndex) return;

    const newSections = pageData.sections.map((section) => {
      if (section.id !== sectionId || !section.grid) return section;

      const newColumns = [...section.grid.columns];
      const [removed] = newColumns.splice(sourceIndex, 1);
      newColumns.splice(destIndex, 0, removed);

      return { ...section, grid: { ...section.grid, columns: newColumns } };
    });

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    logger.grid.debug('reorderColumn:', { sectionId, sourceIndex, destIndex });
    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },

  updateColumnWidth: (sectionId, columnId, width) => {
    const { pageData, sectionVersions } = get();
    if (!pageData) return;

    const newSections = pageData.sections.map((section) => {
      if (section.id !== sectionId || !section.grid) return section;

      const newColumns = section.grid.columns.map((col: GridColumn) =>
        col.id === columnId ? { ...col, width } : col
      );

      return { ...section, grid: { ...section.grid, columns: newColumns } };
    });

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    logger.grid.debug('updateColumnWidth:', { sectionId, columnId, width });
    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },

  addWidgetToColumn: (sectionId, columnId, widget, index) => {
    const { pageData, sectionVersions } = get();
    if (!pageData) return;

    const newSections = pageData.sections.map((section) => {
      if (section.id !== sectionId || !section.grid) return section;

      const newColumns = section.grid.columns.map((col: GridColumn) => {
        if (col.id !== columnId) return col;

        const newWidgets = [...col.widgets];
        const insertIndex = index ?? newWidgets.length;
        newWidgets.splice(insertIndex, 0, widget);

        return { ...col, widgets: newWidgets };
      });

      return { ...section, grid: { ...section.grid, columns: newColumns } };
    });

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    logger.grid.debug('addWidgetToColumn:', { sectionId, columnId, widgetId: widget.id, index });
    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },

  removeWidget: (sectionId, columnId, widgetIndex) => {
    const { pageData, sectionVersions } = get();
    if (!pageData) return;

    const newSections = pageData.sections.map((section) => {
      if (section.id !== sectionId || !section.grid) return section;

      const newColumns = section.grid.columns.map((col: GridColumn) => {
        if (col.id !== columnId) return col;

        const newWidgets = [...col.widgets];
        newWidgets.splice(widgetIndex, 1);

        return { ...col, widgets: newWidgets };
      });

      return { ...section, grid: { ...section.grid, columns: newColumns } };
    });

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    logger.grid.debug('removeWidget:', { sectionId, columnId, widgetIndex });
    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },

  reorderWidgetInColumn: (sectionId, columnId, sourceIndex, destIndex) => {
    const { pageData, sectionVersions } = get();
    if (!pageData || sourceIndex === destIndex) return;

    const newSections = pageData.sections.map((section) => {
      if (section.id !== sectionId || !section.grid) return section;

      const newColumns = section.grid.columns.map((col: GridColumn) => {
        if (col.id !== columnId) return col;

        const newWidgets = [...col.widgets];
        const [removed] = newWidgets.splice(sourceIndex, 1);
        newWidgets.splice(destIndex, 0, removed);

        return { ...col, widgets: newWidgets };
      });

      return { ...section, grid: { ...section.grid, columns: newColumns } };
    });

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    logger.grid.debug('reorderWidgetInColumn:', { sectionId, columnId, sourceIndex, destIndex });
    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },

  moveWidgetBetweenColumns: (sectionId, sourceColumnId, sourceIndex, destColumnId, destIndex) => {
    const { pageData, sectionVersions } = get();
    if (!pageData) return;

    let movedWidget: GridWidget | null = null;

    const newSections = pageData.sections.map((section) => {
      if (section.id !== sectionId || !section.grid) return section;

      const newColumns = section.grid.columns.map((col: GridColumn) => {
        if (col.id === sourceColumnId) {
          const newWidgets = [...col.widgets];
          [movedWidget] = newWidgets.splice(sourceIndex, 1);
          return { ...col, widgets: newWidgets };
        }
        return col;
      }).map((col: GridColumn) => {
        if (col.id === destColumnId && movedWidget) {
          const newWidgets = [...col.widgets];
          newWidgets.splice(destIndex, 0, movedWidget);
          return { ...col, widgets: newWidgets };
        }
        return col;
      });

      return { ...section, grid: { ...section.grid, columns: newColumns } };
    });

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    logger.grid.debug('moveWidgetBetweenColumns:', { 
      sectionId, 
      sourceColumnId, 
      sourceIndex, 
      destColumnId, 
      destIndex 
    });
    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },
});
