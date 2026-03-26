# Elementor-Style Grid System

## Overview

The editor uses an **Elementor-style 3-level layout hierarchy** as the mandatory, single layout model:

```
Section → Column → Widget
```

This model ensures:
- Stable drag-and-drop boundaries
- Predictable bounding boxes for overlays
- CSS Grid-based responsive layouts
- Backward compatibility with existing saved data

## Architecture

### 1. Grid Data Model (`src/types/grid.ts`)

```typescript
// Widget: Atomic content unit (no layout control)
interface GridWidget {
  id: string;
  type: GridWidgetType;  // 'feature-card', 'plan-card', etc.
  props: Record<string, any>;
  sourcePath?: string;   // Back-reference for denormalization
}

// Column: Layout container for widgets
interface GridColumn {
  id: string;
  width: ResponsiveWidth;  // { desktop, tablet?, mobile? }
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  widgets: GridWidget[];
}

// SectionGrid: Layout definition
interface SectionGrid {
  columns: GridColumn[];
  gap?: string;
  responsive?: { tablet?: { columns: number }; mobile?: { columns: number } };
}
```

### 2. Grid Normalization (`src/lib/gridNormalizer.ts`)

Converts existing section data to grid format **at runtime** without modifying saved data:

```typescript
// Normalize a section
const normalized = normalizeSection(section);
// { id, type, grid, headerProps, originalProps, isNormalized }

// Convert back to legacy format for saving
const legacyProps = denormalizeGrid(normalized, section.type);
```

**Normalization Rules:**
- Each section type has defined array paths (e.g., `features`, `plans`)
- Array items become widgets in columns
- Header props (badge, title, subtitle) stay at section level
- Data wrapper sections (`stats-counter`, `steps`, etc.) are handled

### 3. Widget Registry (`src/lib/widgetRegistry.ts`)

Maps widget types to React components:

```typescript
// Get component for a widget type
const WidgetComponent = getWidgetComponent('feature-card');

// Register a custom widget
registerWidgetComponent('custom-widget', CustomWidgetComponent);
```

### 4. Grid Components (`src/components/editor/grid/`)

- **GridSection**: CSS Grid container, normalizes section and renders columns
- **GridColumn**: Droppable container, renders widgets with sortable context
- **GridWidget**: Sortable wrapper, delegates to widget registry
- **ColumnResizeHandle**: Column width resizing UI

### 5. Store Actions (`src/stores/editorStore.ts`)

Grid-specific mutations:

```typescript
// Column operations
setSectionGrid(sectionId, grid)
addColumn(sectionId, column, index?)
removeColumn(sectionId, columnId)
reorderColumn(sectionId, sourceIndex, destIndex)
updateColumnWidth(sectionId, columnId, width)

// Widget operations
addWidgetToColumn(sectionId, columnId, widget, index?)
removeWidget(sectionId, columnId, widgetIndex)
reorderWidgetInColumn(sectionId, columnId, sourceIndex, destIndex)
moveWidgetBetweenColumns(sectionId, sourceColumnId, sourceIndex, destColumnId, destIndex)
```

## DnD Boundaries

With grid enforcement:

| Drag Operation | Target |
|----------------|--------|
| Widget → Widget (same column) | Reorder within column |
| Widget → Column | Move between columns |
| Column → Column | Reorder columns in section |
| Section → Section | Reorder sections |

## CSS Rules

```css
/* Section = Grid container */
.grid-section { display: grid; }

/* Columns = Grid cells */
.grid-container { 
  display: grid;
  grid-template-columns: repeat(auto, 1fr);
}

/* Widgets = Flex children */
.grid-column { display: flex; flex-direction: column; }
```

## Migration Strategy

1. **Runtime Normalization**: Existing sections normalized on read
2. **Dual Path**: Check `section.grid` - if absent, normalize
3. **Progressive Save**: When user edits, save normalized grid format
4. **Backward Compatible**: Legacy sections without `grid` continue to work

## Testing

Run grid normalization tests:

```bash
npm run test -- src/__tests__/editor/grid.normalization.test.ts
```
