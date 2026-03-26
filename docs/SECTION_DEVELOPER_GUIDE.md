# Section Developer Guide

> **The Complete, Authoritative Guide to Adding Sections to the Page Builder**
>
> Last Updated: January 2025
>
> Target Audience: Mid-level developers with React/TypeScript experience

---

## Table of Contents

1. [Introduction](#section-1-introduction)
2. [Before You Start](#section-2-before-you-start)
3. [Quick Start (30-Minute Path)](#section-3-quick-start-30-minute-path)
4. [Complete Templates](#section-4-complete-templates)
5. [Working with Props](#section-5-working-with-props)
6. [Shared Building Blocks](#section-6-shared-building-blocks)
7. [Common Patterns](#section-7-common-patterns)
8. [Styling Your Section](#section-8-styling-your-section)
9. [Testing Your Section](#section-9-testing-your-section)
10. [Troubleshooting](#section-10-troubleshooting)
11. [Reference](#section-11-reference)
12. [Examples](#section-12-examples)
13. [Checklist and Summary](#section-13-checklist-and-summary)

---

# SECTION 1: Introduction

## 1.1 What is a Section?

A **section** is a self-contained, reusable building block for landing pages. Each section represents a distinct piece of content or functionality that users can add, configure, and arrange on their pages.

### The Page Hierarchy

```
Page
├── Section 1 (e.g., Hero)
│   └── Content: title, subtitle, buttons, image
├── Section 2 (e.g., Features)
│   └── Content: header + array of feature cards
├── Section 3 (e.g., Testimonials)
│   └── Content: header + array of testimonial items
└── Section N...
```

### What Sections Can Do

| Capability | Description |
|------------|-------------|
| Display content | Text, images, icons, videos, buttons |
| Accept configuration | Users edit settings in the right panel |
| Support styling | Background, padding, shadows, borders |
| Support arrays | Lists of items (features, team members, etc.) |
| Support nesting | Arrays within arrays (social links per team member) |
| Support drag-and-drop | Reorder sections and array items |
| Support translations | Connect text to translation keys |

### What Sections Cannot Do

| Limitation | Reason |
|------------|--------|
| Run backend code | Sections are React components only |
| Access databases directly | Use page-level data fetching instead |
| Have independent state | All state flows through the editor store |
| Override page layout | Sections live within the page container |

---

## 1.2 Section Anatomy

Every section consists of **four parts** that work together:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SECTION ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────────────┐     ┌─────────────────────────────────────┐   │
│   │   TYPE DEFS     │     │      DISPLAY COMPONENT              │   │
│   │                 │     │                                     │   │
│   │ - Interface     │────▶│  - Renders the section visually     │   │
│   │ - Props shape   │     │  - Uses shared display components   │   │
│   │ - Item types    │     │  - Handles responsive layout        │   │
│   │                 │     │                                     │   │
│   └─────────────────┘     └─────────────────────────────────────┘   │
│          │                              ▲                            │
│          │                              │                            │
│          ▼                              │ props                      │
│   ┌─────────────────┐     ┌─────────────────────────────────────┐   │
│   │  REGISTRATION   │     │      SETTINGS COMPONENT             │   │
│   │                 │     │                                     │   │
│   │ - Type name     │     │  - Renders the settings panel       │   │
│   │ - Category      │────▶│  - Uses shared settings components  │   │
│   │ - Icon          │     │  - Calls onChange to update props   │   │
│   │ - Defaults      │     │                                     │   │
│   │                 │     │                                     │   │
│   └─────────────────┘     └─────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Part 1: Type Definitions

Defines the shape of your section's data using TypeScript interfaces.

```typescript
// What data does your section need?
interface MyFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface MyFeaturesData {
  title: string;
  subtitle?: string;
  features: MyFeature[];
}
```

### Part 2: Display Component

The React component that renders your section on the page.

```typescript
// How does your section look?
export function FeaturesSection({ data }: { data: FeaturesData }) {
  return (
    <SectionContainer>
      <SectionHeader title={data.title} subtitle={data.subtitle} />
      <div className="grid grid-cols-3 gap-6">
        {data.features.map(feature => (
          <FeatureCard key={feature.id} {...feature} />
        ))}
      </div>
    </SectionContainer>
  );
}
```

### Part 3: Settings Component

The form component that lets users edit your section's content.

```typescript
// How do users configure your section?
export function FeaturesSettingsContent({ data, onChange }: SettingsProps) {
  return (
    <>
      <SectionHeaderFields data={data} onChange={onChange} />
      <ItemListEditor
        items={data.features}
        onItemsChange={(features) => onChange({ ...data, features })}
        renderItem={(item, onUpdate) => (
          <FeatureItemFields item={item} onUpdate={onUpdate} />
        )}
      />
    </>
  );
}
```

### Part 4: Registration

Connects all pieces together and tells the system about your section.

```typescript
// Create: src/lib/sections/definitions/features.ts
import { LayoutGrid } from 'lucide-react';
import FeaturesSection from '@/components/landing/FeaturesSection';
import FeaturesSettingsContent from '@/components/admin/sections/FeaturesSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'features',
  displayName: 'Features Grid',
  icon: LayoutGrid,
  category: 'content',
  component: FeaturesSection,
  settingsComponent: createSettingsWrapper(FeaturesSettingsContent),
  defaultProps: {
    title: 'Our Features',
    features: [{ id: '1', icon: 'Star', title: 'Feature 1', description: '' }]
  },
  description: 'Feature cards with icons',
  dndArrays: [{ path: 'features', strategy: 'grid' }],
});

// Then add to src/lib/sections/index.ts:
// import './definitions/features';
```

---

## 1.3 What You Get For Free

When you follow this guide, these features work **automatically** with zero additional code:

### Style Settings (Automatic)

| Feature | Description | User Control |
|---------|-------------|--------------|
| Background color | Solid color behind section | Color picker |
| Background image | Image behind section | Image upload |
| Background overlay | Color overlay on images | Color + opacity |
| Padding | Top/bottom spacing | Slider (px/rem) |
| Shadow | Drop shadow | Preset options |
| Border | Border styling | Width, color, radius |
| Border radius | Corner rounding | Slider |

### Layout Settings (Automatic)

| Feature | Description | User Control |
|---------|-------------|--------------|
| Container width | Section content width | Full/wide/narrow |
| Content alignment | Text alignment | Left/center/right |
| Columns | Grid column count | 1-6 columns |
| Gap | Space between items | Slider |
| Device visibility | Show/hide per device | Mobile/tablet/desktop toggles |

### Editor Features (Automatic)

| Feature | Description |
|---------|-------------|
| Block library | Section appears in "Add Section" panel |
| Selection | Click to select, shows blue outline |
| Hover highlight | Visual feedback on hover |
| Drag-and-drop | Reorder sections on page |
| Array reordering | Drag-and-drop for item arrays |
| Duplicate | Copy section with all settings |
| Delete | Remove section from page |
| Settings panel | Right panel shows your settings component |

### Persistence (Automatic)

| Feature | Description |
|---------|-------------|
| Save | Page saves include all section data |
| Load | Section data restored on page load |
| Undo/Redo | All changes can be undone |
| Version history | Previous versions accessible |

### Rendering (Automatic)

| Feature | Description |
|---------|-------------|
| Editor preview | Live preview while editing |
| Preview mode | Clean preview without editor UI |
| Live page | Published page renders sections |
| Responsive | Works on all device sizes |

### Translation Support (Automatic)

| Feature | Description |
|---------|-------------|
| Key picker | Assign translation keys to text |
| Translation panel | Manage translations per section |
| Live translation | Switch languages in editor |

---

## 1.4 Time Estimate

### Target: Under 30 Minutes

For a standard section following the patterns in this guide:

| Task | Time |
|------|------|
| Define types | 2 minutes |
| Create display component | 10 minutes |
| Create settings component | 10 minutes |
| Register section | 3 minutes |
| Test and verify | 5 minutes |
| **Total** | **~30 minutes** |

### Files You Will Create

| File | Lines | Purpose |
|------|-------|---------|
| `src/components/landing/XxxSection.tsx` | 50-150 | Display component |
| `src/components/admin/sections/XxxSettingsContent.tsx` | 50-150 | Settings component |

### Files You Will Create

| File | Lines | Purpose |
|------|-------|---------|
| `src/lib/sections/definitions/[name].ts` | 30-60 | Section definition & registration |

### Files You Will Modify

| File | Change |
|------|--------|
| `src/lib/sections/index.ts` | Add import for your definition file (1 line) |
| `src/types/pageEditor.ts` | Add type to union (1 line) |

---

# SECTION 2: Before You Start

## 2.1 Prerequisites

### Required Knowledge

| Skill | Level Needed | Why |
|-------|--------------|-----|
| React | Intermediate | Components, props, hooks |
| TypeScript | Basic | Interfaces, generics |
| Tailwind CSS | Basic | Utility classes, responsive |
| ES6+ | Intermediate | Destructuring, spread, arrow functions |

### Development Environment

1. **Node.js** 18+ installed
2. **npm** or **bun** package manager
3. **VS Code** recommended (TypeScript support)

### Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:5173
```

### How to Test Changes

1. Open the admin panel: `/admin`
2. Navigate to Pages
3. Click "Edit" on any page
4. Your section should appear in the block library (left panel)
5. Add it to the page and test settings

---

## 2.2 Key Files to Know

### Core Files

| File | Purpose | When to Touch |
|------|---------|---------------|
| `src/lib/sections/definitions/[name].ts` | Individual section definition | Create for your section |
| `src/lib/sections/index.ts` | Barrel exports & imports all definitions | Add import for your definition |
| `src/lib/sections/registry.ts` | Central registry API | Reference only |
| `src/lib/sections/types.ts` | Section definition types | Reference only |
| `src/types/pageEditor.ts` | `SectionType` union type | Add your section type |
| `src/types/baseSectionTypes.ts` | Base interfaces all sections extend | Reference only |

### Display Components

| Location | Purpose |
|----------|---------|
| `src/components/landing/` | All section display components |
| `src/components/landing/shared/` | Shared display utilities |
| `src/components/landing/shared/SectionContainer.tsx` | Outer wrapper component |
| `src/components/landing/shared/SectionHeader.tsx` | Title/subtitle/badge component |

### Settings Components

| Location | Purpose |
|----------|---------|
| `src/components/admin/sections/` | All section settings components |
| `src/components/admin/sections/shared/` | Shared settings utilities |
| `src/components/admin/sections/shared/ItemListEditor.tsx` | Array editor with DnD |
| `src/components/admin/sections/shared/ItemFieldRenderers.tsx` | Form field components |
| `src/components/admin/sections/shared/SectionHeaderFields.tsx` | Badge/title/subtitle fields |
| `src/components/admin/sections/shared/IconPicker.tsx` | Icon selection component |
| `src/components/admin/sections/shared/iconConstants.ts` | Available icons list |

### Hooks and Utilities

| File | Purpose |
|------|---------|
| `src/hooks/useArrayItems.tsx` | Array DnD for display components |
| `src/hooks/useLatestRef.ts` | Stable data reference for handlers |
| `src/hooks/useArrayCRUD.ts` | Array operations hook |
| `src/lib/gridUtils.ts` | Grid/column utilities |

---

## 2.3 Architecture Overview

### Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   User clicks       Settings              Editor                Display   │
│   in Settings ──▶   Component  ──▶        Store    ──▶         Component │
│   Panel             onChange()            (Zustand)            (re-render)│
│                                                                           │
│   ┌─────────┐      ┌───────────┐      ┌───────────┐      ┌─────────────┐ │
│   │  User   │      │  Settings │      │  Editor   │      │   Display   │ │
│   │  Types  │─────▶│  Form     │─────▶│  Store    │─────▶│   Canvas    │ │
│   │  "Hi"   │      │  onChange │      │  sections │      │   Shows     │ │
│   │         │      │  ({ ... })│      │  [...]    │      │   "Hi"      │ │
│   └─────────┘      └───────────┘      └───────────┘      └─────────────┘ │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Where State Lives

| State | Location | Scope |
|-------|----------|-------|
| Section data | `editorStore.ts` (Zustand) | All sections on page |
| Selected section | `editorStore.ts` | Currently selected section ID |
| Hover state | `editorStore.ts` | Currently hovered element |
| UI state | Local component state | Panel open/closed, tabs, etc. |

### Store Slice Architecture

The editor store is composed from 6 domain-specific slices for maintainability:

| Need to... | Modify Slice |
|------------|--------------|
| Add section CRUD operation | `documentSlice.ts` |
| Add grid/column/widget operation | `gridSlice.ts` |
| Modify undo/redo behavior | `historySlice.ts` |
| Change selection behavior | `selectionSlice.ts` |
| Add new editor mode | `uiSlice.ts` |
| Change save/load behavior | `statusSlice.ts` |

Slice files are located in `src/stores/editor/slices/`.

### Editor vs Live Mode

| Aspect | Editor Mode | Live Mode |
|--------|-------------|-----------|
| Component used | `EditorSectionRenderer` | `LiveSectionRenderer` |
| Wrapper | Adds selection, DnD, overlays | Minimal wrapper |
| Data source | Editor store | Page content from DB |
| Interactivity | Full editing | View only |

---

# SECTION 3: Quick Start (30-Minute Path)

## 3.1 Overview

Adding a new section requires **4 steps**:

| Step | Action | Time |
|------|--------|------|
| 1 | Define your section's data types | 2 min |
| 2 | Create the display component | 10 min |
| 3 | Create the settings component | 10 min |
| 4 | Register the section | 3 min |

This is the fastest path. Follow exactly for a working section in 30 minutes.

---

## 3.2 Step 1: Define Your Section's Data

### Where to Add Types

Add your types directly in your display component file, or in `src/types/newSectionTypes.ts` for complex types.

### Required Base Interface

Every section data interface should include these fields (inherited from base):

```typescript
// These are available automatically - you don't define them
interface BaseSectionData {
  id: string;              // Unique section ID
  type: SectionType;       // Section type identifier
  styleProps?: SectionStyleProps;  // Background, padding, etc.
  layoutProps?: SectionLayoutProps; // Columns, gap, alignment
}
```

### Defining Your Section Data

```typescript
// Define your section-specific data
// Put this at the top of your display component file

interface BenefitItem {
  id: string;        // Required for arrays - enables DnD
  icon: string;      // Icon name from Lucide
  title: string;
  description: string;
}

interface BenefitsSectionData {
  // Header content (optional but common)
  badge?: string;
  title: string;
  subtitle?: string;
  
  // Section-specific content
  benefits: BenefitItem[];
}
```

### Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Section data | `XxxSectionData` | `BenefitsSectionData` |
| Array item | `XxxItem` | `BenefitItem` |
| Section type | `kebab-case` | `'benefits'` |
| Display component | `XxxSection` | `BenefitsSection` |
| Settings component | `XxxSettingsContent` | `BenefitsSettingsContent` |

---

## 3.3 Step 2: Create the Display Component

### Where to Create

```
src/components/landing/BenefitsSection.tsx
```

### Required Imports

```typescript
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import { BaseSectionData, BaseLayoutProps } from '@/types/baseSectionTypes';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';

// Note: SortableWrapper comes from useArrayItems hook, not from an import!
```

### Component Structure

```typescript
// BenefitsSection.tsx

import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import { BaseSectionData, BaseLayoutProps } from '@/types/baseSectionTypes';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';

// 1. Define your types
interface BenefitItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface BenefitsSectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  benefits: BenefitItem[];
}

// 2. Define props interface
interface BenefitsSectionProps extends BaseLayoutProps {
  data: BenefitsSectionData & BaseSectionData;
}

// 3. Create the component
export function BenefitsSection({ data }: BenefitsSectionProps) {
  // 4. Set up DnD for arrays using the hook
  // Note: useArrayItems gets editing context from SectionDndContext automatically
  const { items: benefits, SortableWrapper, getItemProps, isEnabled } = useArrayItems(
    'benefits',        // arrayPath - matches dndArrays config in registration
    data.benefits      // the array data
  );

  // 5. Get column classes based on layoutProps
  const columns = data.layoutProps?.columns || 3;
  const gap = data.layoutProps?.gap || 6;

  return (
    // 6. Wrap in SectionContainer
    <SectionContainer
      id={data.id}
      styleOverrides={data.styleProps}
    >
      {/* 7. Use SectionHeader for title/subtitle */}
      <SectionHeader
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        alignment={data.layoutProps?.alignment}
      />

      {/* 8. Use SortableWrapper from the hook (handles SortableContext) */}
      <SortableWrapper>
        <div 
          className="grid gap-6"
          style={{ 
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap * 4}px`
          }}
        >
          {/* 9. Use getItemProps to get SortableItem props */}
          {benefits.map((benefit, index) => {
            const IconComponent = ICON_MAP[benefit.icon] || ICON_MAP['Star'];
            const itemProps = getItemProps(index);
            
            return (
              <SortableItem
                key={benefit.id}
                {...itemProps}
              >
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </SortableItem>
            );
          })}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
}
```

### Key Points

1. **Always use `SectionContainer`** - it applies style settings
2. **Use `SectionHeader`** for title/subtitle/badge patterns
3. **Use `useArrayItems`** for any array that needs DnD
4. **Wrap array container in `SortableWrapper`**
5. **Wrap each item in `SortableItem`**
6. **Use `ICON_MAP`** to render icons by name
7. **Use semantic Tailwind classes** (`text-foreground`, `bg-card`, etc.)

---

## 3.4 Step 3: Create the Settings Component

### Where to Create

```
src/components/admin/sections/BenefitsSettingsContent.tsx
```

### Required Imports

```typescript
import { 
  SectionHeaderFields,
  ItemListEditor,
  TextField,
  IconPicker,
} from '@/components/admin/sections/shared';
import { useLatestRef, useDataChangeHandlers } from '@/hooks/useLatestRef';
```

### Component Structure

```typescript
// BenefitsSettingsContent.tsx

import { 
  SectionHeaderFields,
  ItemListEditor,
  TextField,
} from '@/components/admin/sections/shared';
import { IconPicker } from '@/components/admin/sections/shared/IconPicker';
import { useLatestRef, useDataChangeHandlers } from '@/hooks/useLatestRef';

// 1. Import or redefine your types
interface BenefitItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface BenefitsSectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  benefits: BenefitItem[];
}

// 2. Define settings props
interface BenefitsSettingsContentProps {
  data: BenefitsSectionData;
  onChange: (data: BenefitsSectionData) => void;
}

// 3. Create the component
export function BenefitsSettingsContent({ data, onChange }: BenefitsSettingsContentProps) {
  // 4. Create stable data reference and change handlers (prevents stale closures)
  const dataRef = useLatestRef(data);
  // Note: useDataChangeHandlers returns updateField/updateArray (not handleFieldChange)
  const { updateField, updateArray } = useDataChangeHandlers(dataRef, onChange);

  // 5. Render settings form
  return (
    <div className="space-y-6">
      {/* 6. Use SectionHeaderFields for common header pattern */}
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(badge) => updateField('badge', badge)}
        onTitleChange={(title) => updateField('title', title)}
        onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
      />

      {/* 7. Use ItemListEditor for arrays */}
      <ItemListEditor
        items={data.benefits || []}
        onItemsChange={(benefits) => updateArray('benefits', benefits)}
        createNewItem={() => ({
          id: crypto.randomUUID(),
          icon: 'Star',
          title: 'New Benefit',
          description: '',
        })}
        renderItem={(item, index, onUpdate) => (
          <div className="space-y-3">
            {/* Icon picker */}
            <IconPicker
              value={item.icon}
              onChange={(icon) => onUpdate({ icon })}
            />
            
            {/* Title field */}
            <TextField
              label="Title"
              value={item.title}
              onChange={(title) => onUpdate({ title })}
            />
            
            {/* Description field */}
            <TextField
              label="Description"
              value={item.description}
              onChange={(description) => onUpdate({ description })}
              multiline
            />
          </div>
        )}
      />
    </div>
  );
}
```

### Key Points

1. **Use `useLatestRef`** - prevents stale closure bugs
2. **Use `useDataChangeHandlers`** - provides stable update functions
3. **Use `SectionHeaderFields`** - for badge/title/subtitle pattern
4. **Use `ItemListEditor`** - for any array with add/remove/reorder
5. **Provide `createNewItem`** - factory function for new items (include `id`!)
6. **Use shared field components** - `TextField`, `IconPicker`, etc.

---

## 3.5 Step 4: Register the Section

### Where to Register

```
src/lib/sectionDefinitions.tsx
```

### Add Import

At the top of the file, add:

```typescript
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { BenefitsSettingsContent } from '@/components/admin/sections/BenefitsSettingsContent';
```

### Add Registration

In the `registerSections()` function, add:

```typescript
registerSection({
  // 1. Unique type identifier (kebab-case)
  type: 'benefits',
  
  // 2. Display name shown in block library
  displayName: 'Benefits',
  
  // 3. Icon shown in block library (from Lucide)
  icon: Award,
  
  // 4. Category for grouping in block library
  category: 'content',  // 'content' | 'commerce' | 'media' | 'layout' | 'social'
  
  // 5. Display component
  component: BenefitsSection,
  
  // 6. Settings component
  settingsComponent: BenefitsSettingsContent,
  
  // 7. Whether component receives data prop wrapped
  usesDataWrapper: true,  // true if your component uses { data } prop
  
  // 8. Default values when section is first added
  defaultProps: {
    title: 'Why Choose Us',
    subtitle: 'Discover the benefits of working with us',
    benefits: [
      {
        id: crypto.randomUUID(),
        icon: 'Star',
        title: 'Benefit 1',
        description: 'Description of the first benefit',
      },
      {
        id: crypto.randomUUID(),
        icon: 'Zap',
        title: 'Benefit 2',
        description: 'Description of the second benefit',
      },
      {
        id: crypto.randomUUID(),
        icon: 'Shield',
        title: 'Benefit 3',
        description: 'Description of the third benefit',
      },
    ],
  },
  
  // 9. Enable DnD for arrays (specify array paths)
  dndArrays: [
    { path: 'benefits', idField: 'id' },
  ],
  
  // 10. Props that should be translatable (optional)
  translatableProps: ['title', 'subtitle', 'benefits.*.title', 'benefits.*.description'],
});
```

### Add Type to Union

In `src/types/pageEditor.ts`, add your type to the `SectionType` union:

```typescript
export type SectionType = 
  | 'hero'
  | 'features'
  | 'cta'
  // ... existing types
  | 'benefits';  // Add your new type
```

---

## 3.6 Verify It Works

### Quick Checklist

After completing the 4 steps, verify:

| Test | How to Check | Expected Result |
|------|--------------|-----------------|
| Block library | Open editor, check left panel | Section appears with icon |
| Add to page | Click section in library | Section added to canvas |
| Selection | Click section on canvas | Blue outline appears |
| Settings panel | Select section | Settings form appears in right panel |
| Edit fields | Change title in settings | Canvas updates immediately |
| Array add | Click "Add Item" in settings | New item appears on canvas |
| Array reorder | Drag items in settings | Order changes on canvas |
| Save | Click Save button | No errors |
| Reload | Refresh page | All settings preserved |

### Common First-Run Issues

| Issue | Likely Cause | Solution |
|-------|--------------|----------|
| Section not in library | Missing registration | Check `sectionDefinitions.tsx` |
| TypeScript error | Type not in union | Add to `SectionType` in `pageEditor.ts` |
| Settings don't update | Stale closure | Use `useLatestRef` pattern |
| Canvas blank | Wrong data access | Check `usesDataWrapper` flag |
| Arrays not sortable | Missing DnD config | Add `dndArrays` to registration |

---

# SECTION 4: Complete Templates

## 4.1 Display Component Template

Copy this template and replace all `[Xxx]` placeholders:

```typescript
// src/components/landing/[Xxx]Section.tsx
// Replace [Xxx] with your section name (e.g., Benefits, Services, Awards)

import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import { BaseSectionData, BaseLayoutProps } from '@/types/baseSectionTypes';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';

// ============================================
// TYPE DEFINITIONS
// ============================================

// Define the shape of each item in your array
// REQUIRED: Every item must have an 'id' field for DnD to work
interface [Xxx]Item {
  id: string;
  icon: string;
  title: string;
  description: string;
  // Add more fields as needed
}

// Define the shape of your section's data
interface [Xxx]SectionData {
  // Common header fields
  badge?: string;
  title: string;
  subtitle?: string;
  
  // Your section's array (if applicable)
  items: [Xxx]Item[];
  
  // Add more section-level fields as needed
}

// ============================================
// COMPONENT PROPS
// ============================================

interface [Xxx]SectionProps extends BaseLayoutProps {
  data: [Xxx]SectionData & BaseSectionData;
}

// ============================================
// COMPONENT
// ============================================

export function [Xxx]Section({ data }: [Xxx]SectionProps) {
  // Set up drag-and-drop for the items array
  // SortableWrapper is returned by the hook (not imported separately)
  const { items, SortableWrapper, getItemProps, isEnabled } = useArrayItems(
    'items',           // arrayPath - must match dndArrays config in registration
    data.items || []   // the array data
  );

  // Get layout settings with defaults
  const columns = data.layoutProps?.columns || 3;
  const gap = data.layoutProps?.gap || 6;
  const alignment = data.layoutProps?.alignment || 'center';

  return (
    <SectionContainer
      id={data.id}
      styleOverrides={data.styleProps}
    >
      {/* Section Header */}
      <SectionHeader
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        alignment={alignment}
      />

      {/* Items Grid with DnD */}
      {/* SortableWrapper takes no props - it's pre-configured by the hook */}
      <SortableWrapper>
        <div 
          className="grid"
          style={{ 
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap * 4}px`
          }}
        >
          {items.map((item, index) => {
            const IconComponent = ICON_MAP[item.icon] || ICON_MAP['Star'];
            
            return (
              // Spread getItemProps(index) to get all required DnD props
              <SortableItem
                key={item.id}
                {...getItemProps(index)}
              >
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </SortableItem>
            );
          })}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
}
```

---

## 4.2 Settings Component Template

Copy this template and replace all `[Xxx]` placeholders:

```typescript
// src/components/admin/sections/[Xxx]SettingsContent.tsx
// Replace [Xxx] with your section name (e.g., Benefits, Services, Awards)

import { 
  SectionHeaderFields,
  ItemListEditor,
  TextField,
} from '@/components/admin/sections/shared';
import { IconPicker } from '@/components/admin/sections/shared/IconPicker';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

// ============================================
// TYPE DEFINITIONS
// (Duplicate from display component or import from shared types)
// ============================================

interface [Xxx]Item {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface [Xxx]SectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  items: [Xxx]Item[];
}

// ============================================
// COMPONENT PROPS
// ============================================

interface [Xxx]SettingsContentProps {
  data: [Xxx]SectionData;
  onChange: (data: [Xxx]SectionData) => void;
}

// ============================================
// COMPONENT
// ============================================

export function [Xxx]SettingsContent({ data, onChange }: [Xxx]SettingsContentProps) {
  // useDataChangeHandlers takes data directly (creates its own ref internally)
  // Returns updateField and updateArray functions
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* SECTION HEADER FIELDS                       */}
      {/* ============================================ */}
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(badge) => updateField('badge', badge)}
        onTitleChange={(title) => updateField('title', title)}
        onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
      />

      {/* ============================================ */}
      {/* ITEMS ARRAY EDITOR                          */}
      {/* ============================================ */}
      <ItemListEditor
        title="Items"
        items={data.items || []}
        onItemsChange={(items) => updateArray('items', items)}
        
        // Factory function to create new items
        // IMPORTANT: Always include a unique 'id' field
        createNewItem={() => ({
          id: crypto.randomUUID(),
          icon: 'Star',
          title: 'New Item',
          description: '',
        })}
        
        // Render function for each item's fields
        // Note: signature is (item, index, onUpdate)
        renderItem={(item, index, onUpdate) => (
          <div className="space-y-3">
            {/* Icon Picker */}
            <IconPicker
              value={item.icon}
              onChange={(icon) => onUpdate({ ...item, icon })}
            />
            
            {/* Title Field */}
            <TextField
              label="Title"
              value={item.title}
              onChange={(title) => onUpdate({ ...item, title })}
            />
            
            {/* Description Field */}
            <TextField
              label="Description"
              value={item.description}
              onChange={(description) => onUpdate({ ...item, description })}
              multiline
            />
          </div>
        )}
      />
    </div>
  );
}
```

---

## 4.3 Type Definition Template

For complex types or when sharing types between files:

```typescript
// src/types/newSectionTypes.ts (add to existing file)
// Or define at top of your display component

// ============================================
// ITEM INTERFACES
// ============================================

/**
 * Represents a single item in the [Xxx] section
 * @property id - Unique identifier (required for DnD)
 * @property icon - Lucide icon name
 * @property title - Item heading
 * @property description - Item body text
 */
export interface [Xxx]Item {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// ============================================
// SECTION DATA INTERFACE
// ============================================

/**
 * Data structure for the [Xxx] section
 */
export interface [Xxx]SectionData {
  // Header content
  badge?: string;           // Optional small label above title
  title: string;            // Main section heading
  subtitle?: string;        // Optional subheading
  
  // Content
  items: [Xxx]Item[];       // Array of items to display
  
  // Additional options
  showIcons?: boolean;      // Toggle icon visibility
  columnsOnMobile?: number; // Column count on mobile (1-2)
}

// ============================================
// TYPE EXPORTS
// ============================================

export type { [Xxx]Item, [Xxx]SectionData };
```

---

## 4.4 Registration Template

```typescript
// Add to src/lib/sectionDefinitions.tsx

// ============================================
// IMPORTS (add at top of file)
// ============================================
import { [Icon] } from 'lucide-react';
import { [Xxx]Section } from '@/components/landing/[Xxx]Section';
import { [Xxx]SettingsContent } from '@/components/admin/sections/[Xxx]SettingsContent';

// ============================================
// REGISTRATION (add inside registerSections function)
// ============================================
registerSection({
  // Unique identifier - use kebab-case
  type: '[xxx]',
  
  // Name shown in block library UI
  displayName: '[Xxx]',
  
  // Icon shown in block library (imported from lucide-react)
  icon: [Icon],
  
  // Category for grouping
  // Options: 'content' | 'commerce' | 'media' | 'layout' | 'social'
  category: 'content',
  
  // The display component
  component: [Xxx]Section,
  
  // The settings component
  settingsComponent: [Xxx]SettingsContent,
  
  // Set to true if component uses { data } prop pattern
  usesDataWrapper: true,
  
  // Default values when section is first added
  defaultProps: {
    title: 'Section Title',
    subtitle: 'Optional subtitle text',
    items: [
      {
        id: crypto.randomUUID(),
        icon: 'Star',
        title: 'Item 1',
        description: 'Description for item 1',
      },
      {
        id: crypto.randomUUID(),
        icon: 'Zap',
        title: 'Item 2',
        description: 'Description for item 2',
      },
    ],
  },
  
  // Configure DnD for arrays
  // path: dot-notation path to array
  // idField: property name used as unique ID (usually 'id')
  dndArrays: [
    { path: 'items', idField: 'id' },
  ],
  
  // Props that support translation keys (optional)
  // Use *.fieldName for array items
  translatableProps: [
    'title',
    'subtitle',
    'items.*.title',
    'items.*.description',
  ],
});
```

---

# SECTION 5: Working with Props

## 5.1 Simple Props

### Text Strings

**Type Definition:**
```typescript
interface CTAData {
  headline: string;
  description?: string;  // Optional
}
```

**Display Component:**
```typescript
<h2 className="text-3xl font-bold">{data.headline}</h2>
{data.description && (
  <p className="text-muted-foreground">{data.description}</p>
)}
```

**Settings Component:**
```typescript
<TextField
  label="Headline"
  value={data.headline}
  onChange={(headline) => handleFieldChange('headline', headline)}
/>

<TextField
  label="Description"
  value={data.description || ''}
  onChange={(description) => handleFieldChange('description', description)}
  multiline
/>
```

### Numbers

**Type Definition:**
```typescript
interface PricingData {
  price: number;
  discount?: number;
}
```

**Display Component:**
```typescript
<span className="text-4xl font-bold">${data.price}</span>
{data.discount && (
  <span className="text-sm text-green-600">Save {data.discount}%</span>
)}
```

**Settings Component:**
```typescript
<NumberField
  label="Price"
  value={data.price}
  onChange={(price) => handleFieldChange('price', price)}
  min={0}
  step={0.01}
/>

<NumberField
  label="Discount %"
  value={data.discount || 0}
  onChange={(discount) => handleFieldChange('discount', discount)}
  min={0}
  max={100}
/>
```

### Booleans

**Type Definition:**
```typescript
interface FeatureData {
  showIcon: boolean;
  isHighlighted?: boolean;
}
```

**Display Component:**
```typescript
<div className={data.isHighlighted ? 'border-primary' : 'border-border'}>
  {data.showIcon && <StarIcon className="w-6 h-6" />}
</div>
```

**Settings Component:**
```typescript
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

<div className="flex items-center justify-between">
  <Label>Show Icon</Label>
  <Switch
    checked={data.showIcon}
    onCheckedChange={(showIcon) => handleFieldChange('showIcon', showIcon)}
  />
</div>

<div className="flex items-center justify-between">
  <Label>Highlight</Label>
  <Switch
    checked={data.isHighlighted || false}
    onCheckedChange={(isHighlighted) => handleFieldChange('isHighlighted', isHighlighted)}
  />
</div>
```

---

## 5.2 Array Props

### Defining Array Types

```typescript
// The item interface - MUST have an 'id' field
interface TestimonialItem {
  id: string;           // Required for DnD
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
}

// The section data
interface TestimonialsSectionData {
  title: string;
  testimonials: TestimonialItem[];  // Array of items
}
```

### Rendering Arrays in Display

```typescript
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableWrapper, SortableItem } from '@/components/editor/SortableItem';

export function TestimonialsSection({ data, editable = false }) {
  // Set up DnD
  const { items: testimonials, sensors, handleDragEnd } = useArrayItems({
    sectionId: data.id,
    items: data.testimonials || [],
    arrayPath: 'testimonials',
    editable,
  });

  return (
    <SortableWrapper
      sensors={sensors}
      items={testimonials}
      onDragEnd={handleDragEnd}
      disabled={!editable}
    >
      <div className="grid grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <SortableItem
            key={testimonial.id}
            id={testimonial.id}
            disabled={!editable}
          >
            <blockquote className="p-6 bg-card rounded-lg">
              <p className="italic">"{testimonial.quote}"</p>
              <footer className="mt-4">
                <strong>{testimonial.name}</strong>
                <span className="text-muted-foreground"> - {testimonial.role}</span>
              </footer>
            </blockquote>
          </SortableItem>
        ))}
      </div>
    </SortableWrapper>
  );
}
```

### Editing Arrays in Settings

```typescript
import { ItemListEditor, TextField } from '@/components/admin/sections/shared';

export function TestimonialsSettingsContent({ data, onChange }) {
  const dataRef = useLatestRef(data);
  const { handleArrayChange } = useDataChangeHandlers(dataRef, onChange);

  return (
    <ItemListEditor
      title="Testimonials"
      items={data.testimonials || []}
      onItemsChange={(testimonials) => handleArrayChange('testimonials', testimonials)}
      
      createNewItem={() => ({
        id: crypto.randomUUID(),  // Always include unique ID
        name: 'Customer Name',
        role: 'Position',
        quote: 'What they said...',
      })}
      
      renderItem={(item, onUpdate) => (
        <div className="space-y-3">
          <TextField
            label="Name"
            value={item.name}
            onChange={(name) => onUpdate({ ...item, name })}
          />
          <TextField
            label="Role"
            value={item.role}
            onChange={(role) => onUpdate({ ...item, role })}
          />
          <TextField
            label="Quote"
            value={item.quote}
            onChange={(quote) => onUpdate({ ...item, quote })}
            multiline
          />
        </div>
      )}
    />
  );
}
```

### Enabling Drag-and-Drop Reordering

In registration:

```typescript
registerSection({
  // ... other options
  dndArrays: [
    { path: 'testimonials', idField: 'id' },
  ],
});
```

---

## 5.3 Nested Props

### Objects Within Objects

```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  socialLinks: SocialLink[];  // Nested array!
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface TeamSectionData {
  members: TeamMember[];
}
```

### Accessing Nested Values

```typescript
// In display component
{member.socialLinks?.map((link) => (
  <a key={link.id} href={link.url}>
    {link.platform}
  </a>
))}
```

### Updating Nested Values in Settings

```typescript
// Nested ItemListEditor for social links
<ItemListEditor
  title="Team Members"
  items={data.members || []}
  onItemsChange={(members) => handleArrayChange('members', members)}
  createNewItem={() => ({
    id: crypto.randomUUID(),
    name: 'New Member',
    role: 'Role',
    socialLinks: [],
  })}
  renderItem={(member, onUpdateMember) => (
    <div className="space-y-4">
      <TextField
        label="Name"
        value={member.name}
        onChange={(name) => onUpdateMember({ ...member, name })}
      />
      
      {/* Nested array editor */}
      <ItemListEditor
        title="Social Links"
        items={member.socialLinks || []}
        onItemsChange={(socialLinks) => 
          onUpdateMember({ ...member, socialLinks })
        }
        createNewItem={() => ({
          id: crypto.randomUUID(),
          platform: 'Twitter',
          url: '',
        })}
        renderItem={(link, onUpdateLink) => (
          <div className="space-y-2">
            <TextField
              label="Platform"
              value={link.platform}
              onChange={(platform) => onUpdateLink({ ...link, platform })}
            />
            <TextField
              label="URL"
              value={link.url}
              onChange={(url) => onUpdateLink({ ...link, url })}
            />
          </div>
        )}
      />
    </div>
  )}
/>
```

### Registration for Nested Arrays

```typescript
dndArrays: [
  { path: 'members', idField: 'id' },
  { path: 'members.*.socialLinks', idField: 'id' },  // Nested path!
],
```

---

## 5.4 Optional Props

### TypeScript Optional Syntax

```typescript
interface HeroData {
  title: string;           // Required
  subtitle?: string;       // Optional
  showButton?: boolean;    // Optional with implied undefined
  buttonText?: string;
}
```

### Providing Defaults

```typescript
// In component destructuring
export function HeroSection({ data }) {
  const {
    title,
    subtitle = '',              // Default to empty string
    showButton = true,          // Default to true
    buttonText = 'Get Started', // Default value
  } = data;
  
  // Use the values
}
```

### Handling in Display

```typescript
return (
  <div>
    <h1>{title}</h1>
    
    {/* Conditional rendering for optional content */}
    {subtitle && <p>{subtitle}</p>}
    
    {/* Boolean check for optional elements */}
    {showButton && (
      <button>{buttonText}</button>
    )}
  </div>
);
```

### Handling in Registration Defaults

```typescript
defaultProps: {
  title: 'Welcome',
  // Don't include optional props you want undefined
  // Or include them with explicit values:
  showButton: true,
  buttonText: 'Get Started',
},
```

---

## 5.5 Media Props

### Images

**Type Definition:**
```typescript
interface HeroData {
  backgroundImage?: string;  // URL string
  logoUrl?: string;
}
```

**Display Component:**
```typescript
<div 
  className="relative"
  style={data.backgroundImage ? {
    backgroundImage: `url(${data.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : undefined}
>
  {data.logoUrl && (
    <img 
      src={data.logoUrl} 
      alt="Logo" 
      className="h-12 w-auto"
    />
  )}
</div>
```

**Settings Component:**
```typescript
import { ImageField } from '@/components/admin/sections/shared';

<ImageField
  label="Background Image"
  value={data.backgroundImage || ''}
  onChange={(url) => handleFieldChange('backgroundImage', url)}
  showPreview
/>

<ImageField
  label="Logo"
  value={data.logoUrl || ''}
  onChange={(url) => handleFieldChange('logoUrl', url)}
  showPreview
/>
```

### Icons

**Type Definition:**
```typescript
interface FeatureItem {
  id: string;
  icon: string;  // Icon name from Lucide
  title: string;
}
```

**Display Component:**
```typescript
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';

// In render:
const IconComponent = ICON_MAP[item.icon] || ICON_MAP['Star'];
return <IconComponent className="w-6 h-6 text-primary" />;
```

**Settings Component:**
```typescript
import { IconPicker } from '@/components/admin/sections/shared/IconPicker';

<IconPicker
  value={item.icon}
  onChange={(icon) => onUpdate({ ...item, icon })}
/>
```

### Videos

**Type Definition:**
```typescript
interface VideoSectionData {
  videoUrl?: string;       // YouTube/Vimeo embed URL
  posterImage?: string;    // Thumbnail
  autoplay?: boolean;
}
```

**Display Component:**
```typescript
{data.videoUrl && (
  <div className="aspect-video rounded-lg overflow-hidden">
    <iframe
      src={data.videoUrl}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
)}
```

**Settings Component:**
```typescript
<TextField
  label="Video URL (YouTube/Vimeo embed)"
  value={data.videoUrl || ''}
  onChange={(videoUrl) => handleFieldChange('videoUrl', videoUrl)}
  placeholder="https://www.youtube.com/embed/..."
/>
```

---

## 5.6 Link Props

### Link Interface

```typescript
interface LinkConfig {
  href: string;
  label: string;
  target?: '_blank' | '_self';
  variant?: 'default' | 'outline' | 'ghost';
}

interface CTAData {
  primaryButton?: LinkConfig;
  secondaryButton?: LinkConfig;
}
```

### Rendering Links

```typescript
import { Button } from '@/components/ui/button';

{data.primaryButton?.href && (
  <Button asChild variant={data.primaryButton.variant || 'default'}>
    <a 
      href={data.primaryButton.href}
      target={data.primaryButton.target || '_self'}
    >
      {data.primaryButton.label}
    </a>
  </Button>
)}
```

### Editing Links

```typescript
import { CTAButtonSettings } from '@/components/admin/sections/shared/CTAButtonSettings';

<CTAButtonSettings
  label="Primary Button"
  button={data.primaryButton}
  onChange={(primaryButton) => handleFieldChange('primaryButton', primaryButton)}
/>
```

Or manually:

```typescript
<div className="space-y-2">
  <TextField
    label="Button Text"
    value={data.primaryButton?.label || ''}
    onChange={(label) => handleFieldChange('primaryButton', {
      ...data.primaryButton,
      label,
    })}
  />
  <TextField
    label="Button URL"
    value={data.primaryButton?.href || ''}
    onChange={(href) => handleFieldChange('primaryButton', {
      ...data.primaryButton,
      href,
    })}
  />
  <div className="flex items-center gap-2">
    <Switch
      checked={data.primaryButton?.target === '_blank'}
      onCheckedChange={(checked) => handleFieldChange('primaryButton', {
        ...data.primaryButton,
        target: checked ? '_blank' : '_self',
      })}
    />
    <Label>Open in new tab</Label>
  </div>
</div>
```

---

# SECTION 6: Shared Building Blocks

## 6.1 Display Components

### SectionContainer

**What it does:** Wraps your entire section, applying background, padding, and style overrides.

**When to use:** Always - every section should be wrapped in `SectionContainer`.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Section ID for selection/targeting |
| `styleOverrides` | `SectionStyleProps` | No | Style settings from data |
| `className` | `string` | No | Additional classes |
| `children` | `ReactNode` | Yes | Section content |

**Example:**
```typescript
import { SectionContainer } from '@/components/landing/shared';

<SectionContainer
  id={data.id}
  styleOverrides={data.styleProps}
  className="relative overflow-hidden"
>
  {/* Your section content */}
</SectionContainer>
```

---

### SectionHeader

**What it does:** Renders the common badge + title + subtitle pattern.

**When to use:** When your section has a header with title and optional badge/subtitle.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `badge` | `string` | No | Small label above title |
| `title` | `string` | Yes | Main heading |
| `subtitle` | `string` | No | Subheading below title |
| `alignment` | `'left' \| 'center' \| 'right'` | No | Text alignment |
| `className` | `string` | No | Additional classes |

**Example:**
```typescript
import { SectionHeader } from '@/components/landing/shared';

<SectionHeader
  badge={data.badge}
  title={data.title}
  subtitle={data.subtitle}
  alignment={data.layoutProps?.alignment || 'center'}
/>
```

---

### ICON_MAP

**What it does:** Maps string icon names to Lucide icon components.

**When to use:** When rendering icons from a string name stored in data.

**Available icons:** 200+ icons from Lucide. See `iconConstants.ts` for full list.

**Example:**
```typescript
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';

const IconComponent = ICON_MAP[item.icon] || ICON_MAP['Star'];
return <IconComponent className="w-6 h-6 text-primary" />;
```

---

### SortableWrapper & SortableItem

**What they do:** Enable drag-and-drop reordering for array items.

**When to use:** When rendering arrays that users can reorder.

**Note:** `SortableWrapper` is returned from `useArrayItems` hook - you don't import it directly.

**useArrayItems Hook Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `items` | `T[]` | The array items (safe, never undefined) |
| `itemIds` | `string[]` | Generated IDs for each item |
| `isEnabled` | `boolean` | Whether DnD is active |
| `handlePosition` | `HandlePosition` | Where drag handle appears |
| `getItemProps` | `(index: number) => SortableItemProps` | Get props for SortableItem |
| `SortableWrapper` | `React.FC` | Wrapper component with SortableContext |

**SortableItem Props (from getItemProps):**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Unique item ID |
| `sectionId` | `string` | Yes | Parent section ID |
| `arrayPath` | `string` | Yes | Path to array in data |
| `index` | `number` | Yes | Item index in array |
| `isEditing` | `boolean` | Yes | Whether editing is enabled |
| `handlePosition` | `HandlePosition` | No | Drag handle position |

**Example:**
```typescript
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';

// In your display component:
const { items, SortableWrapper, getItemProps, isEnabled } = useArrayItems(
  'features',      // arrayPath - must match dndArrays config
  data.features    // the array data
);

<SortableWrapper>
  {items.map((item, index) => (
    <SortableItem key={item.id} {...getItemProps(index)}>
      {/* Item content */}
    </SortableItem>
  ))}
</SortableWrapper>
```
| `children` | `ReactNode` | Yes | Item content |

**Example:**
```typescript
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableWrapper, SortableItem } from '@/components/editor/SortableItem';

const { items, sensors, handleDragEnd } = useArrayItems({
  sectionId: data.id,
  items: data.features || [],
  arrayPath: 'features',
  editable,
});

<SortableWrapper
  sensors={sensors}
  items={items}
  onDragEnd={handleDragEnd}
  disabled={!editable}
>
  {items.map(item => (
    <SortableItem key={item.id} id={item.id} disabled={!editable}>
      {/* Item content */}
    </SortableItem>
  ))}
</SortableWrapper>
```

---

## 6.2 Settings Components

### SectionHeaderFields

**What it does:** Renders badge, title, and subtitle input fields with proper styling.

**When to use:** When your section has the common header pattern.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `badge` | `string` | No | Current badge value |
| `title` | `string` | Yes | Current title value |
| `subtitle` | `string` | No | Current subtitle value |
| `onBadgeChange` | `(value: string) => void` | No | Badge change handler |
| `onTitleChange` | `(value: string) => void` | Yes | Title change handler |
| `onSubtitleChange` | `(value: string) => void` | No | Subtitle change handler |
| `showBadge` | `boolean` | No | Show badge field (default: true) |

**Example:**
```typescript
import { SectionHeaderFields } from '@/components/admin/sections/shared';

<SectionHeaderFields
  badge={data.badge}
  title={data.title}
  subtitle={data.subtitle}
  onBadgeChange={(badge) => handleFieldChange('badge', badge)}
  onTitleChange={(title) => handleFieldChange('title', title)}
  onSubtitleChange={(subtitle) => handleFieldChange('subtitle', subtitle)}
/>
```

---

### ItemListEditor

**What it does:** Full array editor with add, remove, reorder, and per-item editing.

**When to use:** For any array of items users can manage.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | Section heading |
| `items` | `T[]` | Yes | Current array |
| `onItemsChange` | `(items: T[]) => void` | Yes | Update handler |
| `createNewItem` | `() => T` | Yes | Factory for new items |
| `renderItem` | `(item: T, onUpdate: (item: T) => void, index: number) => ReactNode` | Yes | Render each item's fields |
| `maxItems` | `number` | No | Maximum items allowed |
| `minItems` | `number` | No | Minimum items required |
| `collapsible` | `boolean` | No | Collapse items by default |
| `itemLabel` | `(item: T, index: number) => string` | No | Custom item label |

**Example:**
```typescript
import { ItemListEditor, TextField } from '@/components/admin/sections/shared';

<ItemListEditor
  title="Features"
  items={data.features || []}
  onItemsChange={(features) => handleArrayChange('features', features)}
  createNewItem={() => ({
    id: crypto.randomUUID(),
    icon: 'Star',
    title: 'New Feature',
    description: '',
  })}
  itemLabel={(item) => item.title || 'Untitled'}
  renderItem={(item, onUpdate) => (
    <div className="space-y-3">
      <TextField
        label="Title"
        value={item.title}
        onChange={(title) => onUpdate({ ...item, title })}
      />
    </div>
  )}
/>
```

---

### TextField

**What it does:** Text input with optional label, placeholder, and multiline support.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | No | Field label |
| `value` | `string` | Yes | Current value |
| `onChange` | `(value: string) => void` | Yes | Change handler |
| `placeholder` | `string` | No | Placeholder text |
| `multiline` | `boolean` | No | Use textarea |
| `maxLength` | `number` | No | Character limit |

**Example:**
```typescript
import { TextField } from '@/components/admin/sections/shared';

<TextField
  label="Description"
  value={item.description}
  onChange={(description) => onUpdate({ ...item, description })}
  multiline
  maxLength={200}
  placeholder="Enter a brief description..."
/>
```

---

### ImageField

**What it does:** Image URL input with optional preview and upload integration.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `src` | `string` | Yes | Current image URL (note: uses `src` not `value`) |
| `onChange` | `(url: string) => void` | Yes | Change handler |
| `label` | `string` | No | Field label |
| `placeholder` | `string` | No | Placeholder URL |
| `showPreview` | `boolean` | No | Show image preview |
| `previewSize` | `'sm' \| 'md' \| 'lg'` | No | Preview image size |
| `onUploadClick` | `() => void` | No | Handler for upload button |

**Example:**
```typescript
import { ImageField } from '@/components/admin/sections/shared';

<ImageField
  label="Photo"
  src={member.photo || ''}
  onChange={(photo) => onUpdate({ photo })}
  showPreview
  previewSize="md"
/>
```

---

### IconPicker

**What it does:** Searchable grid for selecting Lucide icons.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | Yes | Current icon name |
| `onChange` | `(icon: string) => void` | Yes | Change handler |

**Example:**
```typescript
import { IconPicker } from '@/components/admin/sections/shared/IconPicker';

<IconPicker
  value={item.icon}
  onChange={(icon) => onUpdate({ ...item, icon })}
/>
```

---

### NumberField

**What it does:** Number input with optional min/max/step.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | No | Field label |
| `value` | `number` | Yes | Current value |
| `onChange` | `(value: number) => void` | Yes | Change handler |
| `min` | `number` | No | Minimum value |
| `max` | `number` | No | Maximum value |
| `step` | `number` | No | Step increment |

**Example:**
```typescript
import { NumberField } from '@/components/admin/sections/shared';

<NumberField
  label="Price"
  value={data.price}
  onChange={(price) => handleFieldChange('price', price)}
  min={0}
  step={0.01}
/>
```

---

### ToggleField

**What it does:** Switch toggle with label.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | Yes | Field label |
| `checked` | `boolean` | Yes | Current state |
| `onChange` | `(checked: boolean) => void` | Yes | Change handler |
| `description` | `string` | No | Helper text |

**Example:**
```typescript
import { ToggleField } from '@/components/admin/sections/shared';

<ToggleField
  label="Show Social Links"
  checked={member.showSocialLinks || false}
  onChange={(showSocialLinks) => onUpdate({ ...member, showSocialLinks })}
  description="Display social media icons below the member info"
/>
```

---

### SelectField

**What it does:** Dropdown select with options.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | No | Field label |
| `value` | `string` | Yes | Current value |
| `onChange` | `(value: string) => void` | Yes | Change handler |
| `options` | `{ value: string; label: string }[]` | Yes | Available options |

**Example:**
```typescript
import { SelectField } from '@/components/admin/sections/shared';

<SelectField
  label="Layout"
  value={data.layout || 'grid'}
  onChange={(layout) => handleFieldChange('layout', layout)}
  options={[
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
    { value: 'carousel', label: 'Carousel' },
  ]}
/>
```

---

### RatingField

**What it does:** Star rating slider.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | No | Field label |
| `value` | `number` | Yes | Current rating |
| `onChange` | `(value: number) => void` | Yes | Change handler |
| `max` | `number` | No | Maximum stars (default: 5) |

**Example:**
```typescript
import { RatingField } from '@/components/admin/sections/shared';

<RatingField
  label="Rating"
  value={testimonial.rating || 5}
  onChange={(rating) => onUpdate({ ...testimonial, rating })}
  max={5}
/>
```

---

### CTAButtonSettings

**What it does:** Complete button configuration (text, URL, variant, visibility).

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | Yes | Field group label (e.g., "Primary Button") |
| `text` | `string` | Yes | Button text |
| `url` | `string` | Yes | Button URL/link |
| `onTextChange` | `(text: string) => void` | Yes | Text change handler |
| `onUrlChange` | `(url: string) => void` | Yes | URL change handler |
| `variant` | `ButtonVariant` | No | Button style variant |
| `onVariantChange` | `(variant: ButtonVariant) => void` | No | Variant change handler |
| `showToggle` | `boolean` | No | Show visibility toggle |
| `isVisible` | `boolean` | No | Button visibility state |
| `onVisibilityChange` | `(visible: boolean) => void` | No | Visibility change handler |

**Example:**
```typescript
import { CTAButtonSettings } from '@/components/admin/sections/shared/CTAButtonSettings';

<CTAButtonSettings
  label="Primary Button"
  text={data.primaryButtonText || ''}
  url={data.primaryButtonUrl || ''}
  onTextChange={(text) => updateField('primaryButtonText', text)}
  onUrlChange={(url) => updateField('primaryButtonUrl', url)}
/>
```

---

# SECTION 7: Common Patterns

## 7.1 Grid of Cards Pattern

**Use cases:** Features, services, team members, benefits, pricing cards

### Display Component Pattern

```typescript
export function FeaturesSection({ data }: FeaturesSectionProps) {
  // useArrayItems gets context from SectionDndContext
  const { items, SortableWrapper, getItemProps } = useArrayItems(
    'features',
    data.features
  );

  const columns = data.layoutProps?.columns || 3;

  return (
    <SectionContainer id={data.id} styleOverrides={data.styleProps}>
      <SectionHeader
        title={data.title}
        subtitle={data.subtitle}
      />
      
      <SortableWrapper>
        <div 
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {items.map((item, index) => (
            <SortableItem key={item.id} {...getItemProps(index)}>
              <Card>
                <CardHeader>
                  <Icon name={item.icon} />
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {item.description}
                </CardContent>
              </Card>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
}
```

### Settings Component Pattern

```typescript
export function FeaturesSettingsContent({ data, onChange }) {
  const dataRef = useLatestRef(data);
  const { updateField, updateArray } = useDataChangeHandlers(dataRef, onChange);

  return (
    <div className="space-y-6">
      <SectionHeaderFields
        title={data.title}
        subtitle={data.subtitle}
        onTitleChange={(title) => updateField('title', title)}
        onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
      />
      
      <ItemListEditor
        items={data.features || []}
        onItemsChange={(features) => updateArray('features', features)}
        createNewItem={() => ({
          id: crypto.randomUUID(),
          icon: 'Star',
          title: 'New Feature',
          description: '',
        })}
        renderItem={(item, onUpdate) => (
          <div className="space-y-3">
            <IconPicker
              value={item.icon}
              onChange={(icon) => onUpdate({ ...item, icon })}
            />
            <TextField
              label="Title"
              value={item.title}
              onChange={(title) => onUpdate({ ...item, title })}
            />
            <TextField
              label="Description"
              value={item.description}
              onChange={(description) => onUpdate({ ...item, description })}
              multiline
            />
          </div>
        )}
      />
    </div>
  );
}
```

---

## 7.2 List with Icons Pattern

**Use cases:** Benefits list, process steps, feature highlights

### Display Component Pattern

```typescript
export function BenefitsSection({ data }: BenefitsSectionProps) {
  const { items, SortableWrapper, getItemProps } = useArrayItems(
    'benefits',
    data.benefits
  );

  return (
    <SectionContainer id={data.id} styleOverrides={data.styleProps}>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Content */}
        <div>
          <SectionHeader title={data.title} subtitle={data.subtitle} alignment="left" />
        </div>
        
        {/* Right: Benefits List */}
        <SortableWrapper>
          <div className="space-y-4">
            {items.map((item, index) => (
              <SortableItem key={item.id} {...getItemProps(index)}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableWrapper>
      </div>
    </SectionContainer>
  );
}
```

---

## 7.3 Hero/Banner Pattern

**Use cases:** Hero section, CTA banner, announcement

### Display Component Pattern

```typescript
export function HeroSection({ data }) {
  return (
    <SectionContainer id={data.id} styleOverrides={data.styleProps}>
      <div className="text-center max-w-3xl mx-auto">
        {data.badge && (
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
            {data.badge}
          </span>
        )}
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {data.headline}
        </h1>
        
        {data.subheadline && (
          <p className="text-xl text-muted-foreground mb-8">
            {data.subheadline}
          </p>
        )}
        
        <div className="flex items-center justify-center gap-4">
          {data.primaryButton?.href && (
            <Button asChild size="lg">
              <a href={data.primaryButton.href}>{data.primaryButton.label}</a>
            </Button>
          )}
          {data.secondaryButton?.href && (
            <Button asChild variant="outline" size="lg">
              <a href={data.secondaryButton.href}>{data.secondaryButton.label}</a>
            </Button>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
```

### Settings Component Pattern

```typescript
export function HeroSettingsContent({ data, onChange }) {
  const dataRef = useLatestRef(data);
  const { updateField } = useDataChangeHandlers(dataRef, onChange);

  return (
    <div className="space-y-6">
      <TextField
        label="Badge"
        value={data.badge || ''}
        onChange={(badge) => updateField('badge', badge)}
        placeholder="Optional badge text"
      />
      
      <TextField
        label="Headline"
        value={data.headline}
        onChange={(headline) => updateField('headline', headline)}
      />
      
      <TextField
        label="Subheadline"
        value={data.subheadline || ''}
        onChange={(subheadline) => handleFieldChange('subheadline', subheadline)}
        multiline
      />
      
      <CTAButtonSettings
        label="Primary Button"
        text={data.primaryButtonText || ''}
        url={data.primaryButtonUrl || ''}
        onTextChange={(text) => updateField('primaryButtonText', text)}
        onUrlChange={(url) => updateField('primaryButtonUrl', url)}
      />
      
      <CTAButtonSettings
        label="Secondary Button"
        text={data.secondaryButtonText || ''}
        url={data.secondaryButtonUrl || ''}
        onTextChange={(text) => updateField('secondaryButtonText', text)}
        onUrlChange={(url) => updateField('secondaryButtonUrl', url)}
      />
    </div>
  );
}
```

---

## 7.4 Accordion/Expandable Pattern

**Use cases:** FAQ, expandable sections, nested content

### Display Component Pattern

```typescript
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function FAQSection({ data }: FAQSectionProps) {
  const { items, SortableWrapper, getItemProps } = useArrayItems(
    'faqs',
    data.faqs
  );

  return (
    <SectionContainer id={data.id} styleOverrides={data.styleProps}>
      <SectionHeader title={data.title} subtitle={data.subtitle} />
      
      <SortableWrapper>
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          {items.map((faq, index) => (
            <SortableItem key={faq.id} {...getItemProps(index)}>
              <AccordionItem value={faq.id}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </SortableItem>
          ))}
        </Accordion>
      </SortableWrapper>
    </SectionContainer>
  );
}
```

---

## 7.5 Carousel/Slider Pattern

**Use cases:** Testimonials, logo carousel, image gallery

### Display Component Pattern

```typescript
import useEmblaCarousel from 'embla-carousel-react';

export function TestimonialsSection({ data }) {
  const [emblaRef] = useEmblaCarousel({ loop: true });

  return (
    <SectionContainer id={data.id} styleOverrides={data.styleProps}>
      <SectionHeader title={data.title} subtitle={data.subtitle} />
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {data.testimonials?.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="flex-none w-full md:w-1/2 lg:w-1/3 px-4"
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {testimonial.avatar && (
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
```

---

## 7.6 Pricing/Comparison Pattern

**Use cases:** Pricing tables, feature comparison, plan selection

### Display Component Pattern

```typescript
export function PricingSection({ data }: PricingSectionProps) {
  const { items: plans, SortableWrapper, getItemProps } = useArrayItems(
    'plans',
    data.plans
  );

  return (
    <SectionContainer id={data.id} styleOverrides={data.styleProps}>
      <SectionHeader title={data.title} subtitle={data.subtitle} />
      
      <SortableWrapper>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <SortableItem key={plan.id} {...getItemProps(index)}>
              <Card className={plan.featured ? 'border-primary shadow-lg' : ''}>
                {plan.featured && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.featured ? 'default' : 'outline'}>
                    {plan.buttonText || 'Get Started'}
                  </Button>
                </CardFooter>
              </Card>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
}
```

---

# SECTION 8: Styling Your Section

## 8.1 What the Style System Handles

These style settings are handled **automatically** by the page builder. Users configure them through the Style tab, and they apply through `SectionContainer`:

| Setting | Description | Applied Via |
|---------|-------------|-------------|
| Background color | Solid fill behind section | `styleProps.backgroundColor` |
| Background image | Image behind section | `styleProps.backgroundImage` |
| Background overlay | Color overlay on images | `styleProps.overlayColor`, `overlayOpacity` |
| Padding top/bottom | Vertical spacing | `styleProps.paddingTop`, `paddingBottom` |
| Margin top/bottom | Vertical margin | `styleProps.marginTop`, `marginBottom` |
| Shadow | Drop shadow | `styleProps.shadow` |
| Border | Border styling | `styleProps.border*` |
| Border radius | Corner rounding | `styleProps.borderRadius` |
| Visibility | Show/hide per device | `styleProps.hideOnMobile`, etc. |

### How Style Settings Reach Your Component

```
User changes style in panel
        │
        ▼
Style saved to section data (styleProps)
        │
        ▼
SectionContainer reads styleProps
        │
        ▼
Applies as inline styles and classes
        │
        ▼
Your content renders inside
```

**You don't need to do anything** - just wrap your content in `SectionContainer` and pass `styleOverrides`:

```typescript
<SectionContainer
  id={data.id}
  styleOverrides={data.styleProps}
>
  {/* Your content - style settings apply automatically */}
</SectionContainer>
```

---

## 8.2 Internal Section Styling

For styling elements **inside** your section, use Tailwind classes:

### Using Tailwind Classes

```typescript
// Good - uses theme-aware colors
<div className="bg-card text-foreground border border-border rounded-lg p-6">
  <h3 className="text-lg font-semibold text-foreground">Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>

// Bad - hardcoded colors won't respect theme
<div className="bg-white text-black border-gray-200">
```

### Responsive Design Patterns

```typescript
// Mobile-first responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  {items.map(item => (
    <div className="p-4 md:p-6" key={item.id}>
      <h3 className="text-lg md:text-xl lg:text-2xl">{item.title}</h3>
    </div>
  ))}
</div>
```

### Theme-Aware Colors

Always use semantic color classes:

| Use This | Not This | Why |
|----------|----------|-----|
| `text-foreground` | `text-black` | Adapts to dark mode |
| `text-muted-foreground` | `text-gray-500` | Consistent with theme |
| `bg-card` | `bg-white` | Adapts to dark mode |
| `bg-primary` | `bg-blue-500` | Uses theme primary |
| `border-border` | `border-gray-200` | Consistent borders |
| `bg-primary/10` | `bg-blue-50` | Theme-aware opacity |

---

## 8.3 Respecting Style Props

### What NOT to Hardcode

| Don't Hardcode | Why | Let User Control Via |
|----------------|-----|---------------------|
| Section background | User picks in style panel | `styleProps.backgroundColor` |
| Section padding | User adjusts in style panel | `styleProps.paddingTop/Bottom` |
| Section visibility | User toggles per device | `styleProps.hideOnMobile` |

### Using Layout Props

```typescript
export function MySection({ data }) {
  // Read layout settings with sensible defaults
  const columns = data.layoutProps?.columns || 3;
  const gap = data.layoutProps?.gap || 6;
  const alignment = data.layoutProps?.alignment || 'center';
  
  return (
    <SectionContainer id={data.id} styleOverrides={data.styleProps}>
      <SectionHeader
        title={data.title}
        alignment={alignment}  // Respect user's alignment choice
      />
      
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,  // Respect column setting
          gap: `${gap * 4}px`,  // Respect gap setting
        }}
      >
        {/* Items */}
      </div>
    </SectionContainer>
  );
}
```

---

# SECTION 9: Testing Your Section

## 9.1 Editor Testing Checklist

Test these in the page editor:

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Block library | Open left panel, find your section | Section appears with correct icon and category |
| 2 | Add to page | Click section in library | Section added to canvas with default content |
| 3 | Selection | Click section on canvas | Blue selection outline appears |
| 4 | Hover | Move mouse over section | Subtle highlight on hover |
| 5 | Reorder | Drag section up/down | Section moves, reorders in list |
| 6 | Settings panel | Select section, check right panel | Your settings form appears |
| 7 | Edit text | Change title in settings | Canvas updates immediately |
| 8 | Edit array | Add/remove/reorder items | Canvas reflects changes |
| 9 | Duplicate | Click duplicate button | New copy appears below |
| 10 | Delete | Click delete button | Section removed from page |

---

## 9.2 Style Testing Checklist

Test style settings in the Style tab:

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Background color | Pick a color | Section background changes |
| 2 | Background image | Upload/paste URL | Image appears behind content |
| 3 | Padding | Adjust top/bottom sliders | Spacing changes |
| 4 | Shadow | Select shadow preset | Drop shadow appears |
| 5 | Border | Enable border, set color | Border appears |
| 6 | Border radius | Adjust radius | Corners round |
| 7 | Visibility | Toggle "Hide on mobile" | Section hides at mobile breakpoint |

---

## 9.3 Persistence Testing Checklist

Test save/load functionality:

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Save | Click Save button | "Saved" message, no errors |
| 2 | Reload | Refresh browser | Page loads with all content |
| 3 | Settings preserved | Check settings panel | All values match what was saved |
| 4 | Array order | Check item order | Items in same order as before |
| 5 | Styles preserved | Check style tab | All style settings preserved |
| 6 | Multiple sections | Add several sections | All persist correctly |

---

## 9.4 Live Page Testing Checklist

Test the published page:

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Publish | Click Publish button | Page publishes without error |
| 2 | View live | Open live URL | Page loads with all sections |
| 3 | Content | Check all text/images | All content displays correctly |
| 4 | Styling | Check backgrounds/spacing | All styles apply |
| 5 | Responsive | Resize browser | Layout adapts correctly |
| 6 | Mobile | View on phone/emulator | Mobile layout works |
| 7 | Interactions | Click buttons/links | All links work |

---

# SECTION 10: Troubleshooting

## 10.1 Section Doesn't Appear in Block Library

**Symptoms:**
- Section not visible in "Add Section" panel
- No errors in console

**Possible Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Missing registration | Check `sectionDefinitions.tsx` - is `registerSection()` called? |
| Registration not imported | Ensure component imports are at top of file |
| Wrong category | Check `category` value - must be valid category string |
| Missing icon | Ensure `icon` is imported from `lucide-react` |
| Syntax error | Check console for import/syntax errors |

**Debug Steps:**
```typescript
// In sectionDefinitions.tsx, add after registration:
console.log('Registered sections:', getSectionRegistry());
```

---

## 10.2 Settings Don't Update Canvas

**Symptoms:**
- Change values in settings panel
- Canvas doesn't reflect changes
- Values reset when clicking away

**Possible Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Stale closure | Use `useLatestRef` and `useDataChangeHandlers` |
| Wrong onChange signature | Ensure `onChange(entireDataObject)` not `onChange(fieldValue)` |
| Mutating state directly | Always create new objects: `{ ...data, field: value }` |
| Missing dependency | Check if callback captures stale `data` |

**Fix Pattern:**
```typescript
// WRONG - stale closure
const handleChange = (value) => {
  onChange({ ...data, title: value });  // 'data' is stale!
};

// RIGHT - use ref
const dataRef = useLatestRef(data);
const handleChange = (value) => {
  onChange({ ...dataRef.current, title: value });
};

// BEST - use helper hook
const { handleFieldChange } = useDataChangeHandlers(dataRef, onChange);
<TextField onChange={(v) => handleFieldChange('title', v)} />
```

---

## 10.3 Style Settings Don't Apply

**Symptoms:**
- Change background color - nothing happens
- Padding changes don't take effect
- Style tab changes are ignored

**Possible Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Missing `SectionContainer` | Wrap content in `SectionContainer` |
| Missing `styleOverrides` prop | Pass `styleOverrides={data.styleProps}` |
| Hardcoded styles override | Remove conflicting inline styles |
| CSS specificity issue | Don't use `!important` in section styles |

**Correct Pattern:**
```typescript
// Always wrap in SectionContainer with styleOverrides
<SectionContainer
  id={data.id}
  styleOverrides={data.styleProps}  // This applies style settings!
>
  {/* Content */}
</SectionContainer>
```

---

## 10.4 Section Doesn't Save

**Symptoms:**
- Click save, reload, data is gone
- Save button shows error
- Console errors on save

**Possible Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Invalid data structure | Match `defaultProps` schema in registration |
| Missing required fields | Ensure all required fields have values |
| Type mismatch | Check types match TypeScript interfaces |
| Circular reference | Remove circular references in data |

**Debug Steps:**
```typescript
// Log data before save
console.log('Saving section data:', JSON.stringify(data, null, 2));
```

---

## 10.5 Section Looks Wrong on Live Page

**Symptoms:**
- Section looks fine in editor, broken on live page
- Missing content on live page
- Styling different on live page

**Possible Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Wrong `usesDataWrapper` flag | Set `usesDataWrapper: true` if component expects `{ data }` prop |
| Missing data in live renderer | Check `LiveSectionRenderer` handles your type |
| Different CSS scope | Avoid scoped styles that only work in editor |
| Missing icon imports | Ensure `ICON_MAP` includes needed icons |

**Check Registration:**
```typescript
registerSection({
  // ...
  usesDataWrapper: true,  // Set to true if your component uses data.title, etc.
});
```

---

## 10.6 TypeScript Errors

### Error: Type '"my-section"' is not assignable to type 'SectionType'

**Solution:** Add your type to the union in `src/types/pageEditor.ts`:

```typescript
export type SectionType = 
  | 'hero'
  | 'features'
  // ... existing types
  | 'my-section';  // Add this
```

### Error: Property 'myField' does not exist on type...

**Solution:** Define proper interfaces for your data:

```typescript
interface MySectionData {
  myField: string;  // Add the field
}
```

### Error: Type 'X' is missing properties...

**Solution:** Ensure your `defaultProps` includes all required fields:

```typescript
defaultProps: {
  title: 'Default Title',      // Required
  items: [],                   // Required array
  // Don't forget any required fields!
}
```

---

## 10.7 Array Items Don't Reorder

**Symptoms:**
- Drag array items in settings - they don't move
- DnD works in settings but not on canvas
- Items have no drag handle

**Possible Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Missing `dndArrays` in registration | Add `dndArrays: [{ path: 'items', strategy: 'grid' }]` |
| Items missing `id` field | Every item MUST have unique `id` property |
| Missing `useArrayItems` hook | Use hook in display component for canvas DnD |
| Missing `SortableWrapper`/`SortableItem` | Wrap array and items properly |

**Complete DnD Setup:**
```typescript
// 1. Registration (in src/lib/sections/definitions/my-section.ts)
dndArrays: [{ path: 'items', strategy: 'grid' }],

// 2. Default props - items have IDs
defaultProps: {
  items: [{ id: crypto.randomUUID(), title: 'Item' }]
}

// 3. Display component - useArrayItems provides SortableWrapper
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';

const { items, SortableWrapper, getItemProps, isEnabled } = useArrayItems(
  'items',       // arrayPath - matches dndArrays config
  data.items     // the array data
);

<SortableWrapper>
  {items.map((item, index) => (
    <SortableItem key={item.id} {...getItemProps(index)}>
      {/* content */}
    </SortableItem>
  ))}
</SortableWrapper>

// 4. Settings - createNewItem includes ID
createNewItem={() => ({ id: crypto.randomUUID(), title: 'New' })
```

---

# SECTION 11: Reference

## 11.1 All Section Types

Current sections registered in the system:

| Type | Display Name | Category | Complexity | Good Example For |
|------|--------------|----------|------------|------------------|
| `hero` | Hero | content | Simple | Basic header pattern |
| `cta` | Call to Action | content | Simple | Buttons and links |
| `features` | Features Grid | content | Medium | Arrays with icons |
| `icon-features` | Icon Features | content | Medium | Icon-centric layout |
| `steps` | Steps | content | Medium | Numbered sequence |
| `testimonials` | Testimonials | social | Medium | Quote cards |
| `faq` | FAQ | content | Medium | Accordion pattern |
| `pricing` | Pricing | commerce | Complex | Nested features |
| `team-members` | Team Members | content | Complex | Images + nested arrays |
| `contact` | Contact | content | Medium | Form layout |
| `stats-counter` | Stats Counter | content | Simple | Number display |
| `trusted-by` | Trusted By | social | Simple | Logo display |
| `logo-carousel` | Logo Carousel | media | Medium | Carousel pattern |
| `video` | Video | media | Simple | Video embed |
| `blog-grid` | Blog Grid | content | Medium | Card grid |
| `awards` | Awards | content | Medium | Badge display |
| `bento-grid` | Bento Grid | layout | Complex | Asymmetric grid |
| `alternating-features` | Alternating Features | content | Medium | Left/right layout |
| `why-choose` | Why Choose Us | content | Medium | Comparison |
| `need-help` | Need Help | content | Simple | Support CTA |
| `data-center` | Data Center | content | Medium | Location display |
| `server-specs` | Server Specs | commerce | Medium | Spec tables |
| `hosting-services` | Hosting Services | commerce | Medium | Service cards |
| `os-selector` | OS Selector | commerce | Medium | Selection UI |
| `plans-comparison` | Plans Comparison | commerce | Complex | Comparison table |
| `announcement-banner` | Announcement Banner | content | Simple | Alert pattern |

---

## 11.2 All Prop Types

Supported TypeScript types for section props:

| Type | Description | Example Definition | Example Value |
|------|-------------|-------------------|---------------|
| `string` | Text content | `title: string` | `"Welcome"` |
| `string?` | Optional text | `subtitle?: string` | `undefined` or `"Hello"` |
| `number` | Numeric value | `price: number` | `29.99` |
| `boolean` | True/false | `showIcon: boolean` | `true` |
| `string[]` | Array of strings | `tags: string[]` | `["web", "app"]` |
| `T[]` | Array of objects | `items: Feature[]` | `[{id, title}]` |
| `Record<string, T>` | Key-value map | `icons: Record<string, string>` | `{home: "House"}` |
| `union` | Limited options | `size: 'sm' \| 'md' \| 'lg'` | `"md"` |

### Special Types

| Type | Purpose | From |
|------|---------|------|
| `SectionStyleProps` | Background, padding, etc. | `baseSectionTypes.ts` |
| `SectionLayoutProps` | Columns, gap, alignment | `baseSectionTypes.ts` |
| `LinkConfig` | Button/link settings | Define in section |

---

## 11.3 All Icon Names

Icons are from Lucide. Common icons include:

| Category | Icons |
|----------|-------|
| Actions | `Check`, `X`, `Plus`, `Minus`, `Edit`, `Trash`, `Copy` |
| Arrows | `ArrowRight`, `ArrowLeft`, `ArrowUp`, `ArrowDown`, `ChevronRight` |
| Communication | `Mail`, `Phone`, `MessageSquare`, `Send`, `Bell` |
| Commerce | `ShoppingCart`, `CreditCard`, `DollarSign`, `Package`, `Truck` |
| Data | `BarChart`, `PieChart`, `TrendingUp`, `Activity`, `Percent` |
| Devices | `Monitor`, `Smartphone`, `Tablet`, `Laptop`, `Server` |
| Files | `File`, `Folder`, `Download`, `Upload`, `Image` |
| General | `Star`, `Heart`, `Bookmark`, `Flag`, `Award`, `Gift` |
| Interface | `Menu`, `Settings`, `Search`, `Filter`, `Grid`, `List` |
| Media | `Play`, `Pause`, `Volume`, `Camera`, `Video`, `Music` |
| Nature | `Sun`, `Moon`, `Cloud`, `Zap`, `Flame`, `Leaf` |
| People | `User`, `Users`, `UserPlus`, `UserCheck` |
| Security | `Lock`, `Unlock`, `Shield`, `Key`, `Eye`, `EyeOff` |
| Social | `Share`, `Twitter`, `Facebook`, `Linkedin`, `Github` |
| Status | `AlertCircle`, `CheckCircle`, `Info`, `HelpCircle`, `XCircle` |
| Tech | `Code`, `Terminal`, `Database`, `Cpu`, `Globe`, `Wifi` |
| Time | `Clock`, `Calendar`, `Timer`, `History`, `RefreshCw` |
| Travel | `Map`, `MapPin`, `Navigation`, `Compass`, `Plane` |

Full list in `src/components/admin/sections/shared/iconConstants.ts`.

---

## 11.4 All Registration Options

Complete reference for `registerSection()` options:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | `SectionType` | Yes | - | Unique identifier (kebab-case) |
| `displayName` | `string` | Yes | - | Name shown in UI |
| `icon` | `LucideIcon` | Yes | - | Icon component from lucide-react |
| `category` | `SectionCategory` | Yes | - | Grouping in block library |
| `component` | `React.FC` | Yes | - | Display component |
| `settingsComponent` | `React.FC` | Yes | - | Settings panel component |
| `defaultProps` | `object` | Yes | - | Initial values for new sections |
| `usesDataWrapper` | `boolean` | No | `false` | Component receives `{ data }` prop |
| `dndArrays` | `DndArrayConfig[]` | No | `[]` | Arrays that support DnD |
| `translatableProps` | `string[]` | No | `[]` | Props that support translation keys |
| `description` | `string` | No | - | Tooltip description |
| `keywords` | `string[]` | No | `[]` | Search keywords for block library |

### Categories

| Category | Description |
|----------|-------------|
| `'content'` | Text-heavy sections (hero, features, FAQ) |
| `'commerce'` | Business sections (pricing, services) |
| `'media'` | Image/video sections (gallery, video) |
| `'layout'` | Structural sections (grid, columns) |
| `'social'` | Social proof sections (testimonials, logos) |

### DndArrayConfig

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `path` | `string` | Yes | Dot-notation path to array (`'items'` or `'members.*.socialLinks'`) |
| `strategy` | `'grid' \| 'horizontal' \| 'vertical'` | Yes | DnD sorting strategy |
| `handlePosition` | `'left' \| 'top-left' \| 'top-right'` | No | Position of drag handle |

---

## 11.5 File Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Display component | `[Name]Section.tsx` | `BenefitsSection.tsx` |
| Settings component | `[Name]SettingsContent.tsx` | `BenefitsSettingsContent.tsx` |
| Section type | `kebab-case` | `'benefits'` |
| Data interface | `[Name]SectionData` | `BenefitsSectionData` |
| Item interface | `[Name]Item` | `BenefitItem` |

### Naming Mapping

| Section Type | Display Component | Settings Component |
|--------------|-------------------|-------------------|
| `'hero'` | `HeroSection.tsx` | `HeroSettingsContent.tsx` |
| `'features'` | `FeaturesSection.tsx` | `FeaturesSettingsContent.tsx` |
| `'team-members'` | `TeamMembersSection.tsx` | `TeamMembersSettingsContent.tsx` |
| `'my-section'` | `MySectionSection.tsx` | `MySectionSettingsContent.tsx` |

---

## 11.6 Folder Structure

```
src/
├── components/
│   ├── landing/                          # Display components
│   │   ├── shared/                       # Shared display utilities
│   │   │   ├── index.ts                  # Exports SectionContainer, SectionHeader
│   │   │   ├── SectionContainer.tsx      # Section wrapper with styles
│   │   │   └── SectionHeader.tsx         # Title/subtitle pattern
│   │   │
│   │   ├── HeroSection.tsx               # Example section
│   │   ├── FeaturesSection.tsx           # Example section
│   │   ├── CTASection.tsx                # Example section
│   │   └── [YourSection]Section.tsx      # YOUR DISPLAY COMPONENT
│   │
│   ├── admin/
│   │   └── sections/                     # Settings components
│   │       ├── shared/                   # Shared settings utilities
│   │       │   ├── index.ts              # Exports all shared components
│   │       │   ├── ItemListEditor.tsx    # Array editor
│   │       │   ├── ItemFieldRenderers.tsx # Field components
│   │       │   ├── SectionHeaderFields.tsx # Header fields
│   │       │   ├── IconPicker.tsx        # Icon selector
│   │       │   ├── iconConstants.ts      # Icon definitions
│   │       │   └── CTAButtonSettings.tsx # Button config
│   │       │
│   │       ├── HeroSettingsContent.tsx   # Example settings
│   │       ├── FeaturesSettingsContent.tsx
│   │       └── [YourSection]SettingsContent.tsx  # YOUR SETTINGS COMPONENT
│   │
│   └── editor/                           # Editor components
│       ├── SortableItem.tsx              # DnD item wrapper
│       ├── grid/                         # Grid system components
│       │   ├── README.md                 # Grid system documentation
│       │   ├── GridSection.tsx           # Grid container
│       │   ├── GridColumn.tsx            # Droppable column
│       │   └── GridWidget.tsx            # Sortable widget
│       └── ...                           # Other editor components
│
├── lib/
│   ├── sections/                         # MODULAR SECTION DEFINITIONS
│   │   ├── types.ts                      # SectionDefinition, DndArrayConfig
│   │   ├── registry.ts                   # registerSection, getSectionDefinition
│   │   ├── index.ts                      # Barrel export + imports definitions
│   │   └── definitions/                  # Per-section definition files
│   │       ├── hero.ts                   # Hero section definition
│   │       ├── features.ts               # Features section definition
│   │       └── [your-section].ts         # YOUR DEFINITION FILE
│   │
│   ├── utils/
│   │   └── objectHelpers.ts              # Canonical object utilities
│   ├── logger.ts                         # Environment-aware logging
│   └── sectionDefinitions.tsx            # DEPRECATED - use lib/sections/
│
├── stores/
│   └── editor/                           # Modular editor store
│       ├── types.ts                      # EditorState types
│       ├── helpers.ts                    # Utility functions
│       ├── slices/                       # Domain-specific slices
│       │   ├── selectionSlice.ts
│       │   ├── gridSlice.ts
│       │   └── historySlice.ts
│       └── index.ts                      # Store barrel export
│
├── types/
│   ├── baseSectionTypes.ts               # Base interfaces
│   ├── pageEditor.ts                     # SectionType union - ADD YOUR TYPE
│   └── newSectionTypes.ts                # Additional type definitions
│
└── hooks/
    ├── useArrayItems.tsx                 # DnD hook for arrays
    ├── useLatestRef.ts                   # Stable ref hook
    └── useArrayCRUD.ts                   # Array operations
```

---

# SECTION 12: Examples

## 12.1 Simple Section Example: Call to Action

### Overview

The CTA section is a simple section with:
- Title, subtitle, description
- Two buttons (primary and secondary)
- No arrays

### Type Definition

```typescript
interface CTASectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryButton?: {
    label: string;
    href: string;
    variant?: 'default' | 'outline';
  };
  secondaryButton?: {
    label: string;
    href: string;
    variant?: 'default' | 'outline';
  };
}
```

### Display Component

```typescript
// src/components/landing/CTASection.tsx

import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import { Button } from '@/components/ui/button';
import { BaseSectionData, BaseLayoutProps } from '@/types/baseSectionTypes';

interface CTASectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryButton?: { label: string; href: string };
  secondaryButton?: { label: string; href: string };
}

interface CTASectionProps extends BaseLayoutProps {
  data: CTASectionData & BaseSectionData;
}

export function CTASection({ data }: CTASectionProps) {
  const alignment = data.layoutProps?.alignment || 'center';
  
  return (
    <SectionContainer id={data.id} styleOverrides={data.styleProps}>
      <div className={`max-w-3xl ${alignment === 'center' ? 'mx-auto text-center' : ''}`}>
        <SectionHeader
          badge={data.badge}
          title={data.title}
          subtitle={data.subtitle}
          alignment={alignment}
        />
        
        {data.description && (
          <p className="text-muted-foreground mb-8">{data.description}</p>
        )}
        
        <div className="flex items-center gap-4 justify-center">
          {data.primaryButton?.href && (
            <Button asChild size="lg">
              <a href={data.primaryButton.href}>{data.primaryButton.label}</a>
            </Button>
          )}
          {data.secondaryButton?.href && (
            <Button asChild variant="outline" size="lg">
              <a href={data.secondaryButton.href}>{data.secondaryButton.label}</a>
            </Button>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
```

### Settings Component

```typescript
// src/components/admin/sections/CTASettingsContent.tsx

import { SectionHeaderFields, TextField } from '@/components/admin/sections/shared';
import { CTAButtonSettings } from '@/components/admin/sections/shared/CTAButtonSettings';
import { useLatestRef, useDataChangeHandlers } from '@/hooks/useLatestRef';

interface CTASectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryButton?: { label: string; href: string };
  secondaryButton?: { label: string; href: string };
}

interface CTASettingsContentProps {
  data: CTASectionData;
  onChange: (data: CTASectionData) => void;
}

export function CTASettingsContent({ data, onChange }: CTASettingsContentProps) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6">
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(badge) => updateField('badge', badge)}
        onTitleChange={(title) => updateField('title', title)}
        onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
      />
      
      <TextField
        label="Description"
        value={data.description || ''}
        onChange={(description) => updateField('description', description)}
        multiline
      />
      
      <CTAButtonSettings
        label="Primary Button"
        text={data.primaryButton?.label || ''}
        url={data.primaryButton?.href || ''}
        onTextChange={(label) => updateField('primaryButton', { ...data.primaryButton, label })}
        onUrlChange={(href) => updateField('primaryButton', { ...data.primaryButton, href })}
      />
      
      <CTAButtonSettings
        label="Secondary Button"
        text={data.secondaryButton?.label || ''}
        url={data.secondaryButton?.href || ''}
        onTextChange={(label) => updateField('secondaryButton', { ...data.secondaryButton, label })}
        onUrlChange={(href) => updateField('secondaryButton', { ...data.secondaryButton, href })}
      />
    </div>
  );
}
```

### Registration

```typescript
// In src/lib/sectionDefinitions.tsx

import { Megaphone } from 'lucide-react';
import { CTASection } from '@/components/landing/CTASection';
import { CTASettingsContent } from '@/components/admin/sections/CTASettingsContent';

registerSection({
  type: 'cta',
  displayName: 'Call to Action',
  icon: Megaphone,
  category: 'content',
  component: CTASection,
  settingsComponent: CTASettingsContent,
  usesDataWrapper: true,
  defaultProps: {
    title: 'Ready to Get Started?',
    subtitle: 'Join thousands of satisfied customers',
    primaryButton: { label: 'Get Started', href: '#' },
    secondaryButton: { label: 'Learn More', href: '#' },
  },
});
```

---

## 12.2 Medium Section Example: Features Grid

### Overview

The Features section demonstrates:
- Array of items with DnD
- Icon picker integration
- Grid layout with responsive columns

### Type Definition

```typescript
interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  features: FeatureItem[];
}
```

### Display Component

```typescript
// src/components/landing/FeaturesSection.tsx

import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import { BaseSectionData, BaseLayoutProps } from '@/types/baseSectionTypes';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableWrapper, SortableItem } from '@/components/editor/SortableItem';
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';

interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  features: FeatureItem[];
}

interface FeaturesSectionProps extends BaseLayoutProps {
  data: FeaturesSectionData & BaseSectionData;
}

export function FeaturesSection({ data, editable = false }: FeaturesSectionProps) {
  const { items: features, sensors, handleDragEnd } = useArrayItems({
    sectionId: data.id,
    items: data.features || [],
    arrayPath: 'features',
    editable,
  });

  const columns = data.layoutProps?.columns || 3;
  const gap = data.layoutProps?.gap || 8;

  return (
    <SectionContainer id={data.id} styleOverrides={data.styleProps}>
      <SectionHeader
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        alignment={data.layoutProps?.alignment}
      />

      <SortableWrapper
        sensors={sensors}
        items={features}
        onDragEnd={handleDragEnd}
        disabled={!editable}
      >
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {features.map((feature) => {
            const IconComponent = ICON_MAP[feature.icon] || ICON_MAP['Star'];
            
            return (
              <SortableItem
                key={feature.id}
                id={feature.id}
                disabled={!editable}
              >
                <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </SortableItem>
            );
          })}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
}
```

### Settings Component

```typescript
// src/components/admin/sections/FeaturesSettingsContent.tsx

import { 
  SectionHeaderFields, 
  ItemListEditor, 
  TextField 
} from '@/components/admin/sections/shared';
import { IconPicker } from '@/components/admin/sections/shared/IconPicker';
import { useLatestRef, useDataChangeHandlers } from '@/hooks/useLatestRef';

interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  features: FeatureItem[];
}

interface FeaturesSettingsContentProps {
  data: FeaturesSectionData;
  onChange: (data: FeaturesSectionData) => void;
}

export function FeaturesSettingsContent({ data, onChange }: FeaturesSettingsContentProps) {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6">
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(badge) => updateField('badge', badge)}
        onTitleChange={(title) => updateField('title', title)}
        onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
      />

      <ItemListEditor
        items={data.features || []}
        onItemsChange={(features) => updateArray('features', features)}
        createNewItem={() => ({
          id: crypto.randomUUID(),
          icon: 'Star',
          title: 'New Feature',
          description: 'Feature description goes here',
        })}
        getItemTitle={(item) => item.title || 'Untitled Feature'}
        renderItem={(item, index, onUpdate) => (
          <div className="space-y-4">
            <IconPicker
              value={item.icon}
              onChange={(icon) => onUpdate({ icon })}
            />
            <TextField
              label="Title"
              value={item.title}
              onChange={(title) => onUpdate({ title })}
            />
            <TextField
              label="Description"
              value={item.description}
              onChange={(description) => onUpdate({ description })}
              multiline
            />
          </div>
        )}
      />
    </div>
  );
}
```

### Registration

```typescript
// In src/lib/sectionDefinitions.tsx

import { LayoutGrid } from 'lucide-react';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { FeaturesSettingsContent } from '@/components/admin/sections/FeaturesSettingsContent';

registerSection({
  type: 'features',
  displayName: 'Features Grid',
  icon: LayoutGrid,
  category: 'content',
  component: FeaturesSection,
  settingsComponent: FeaturesSettingsContent,
  usesDataWrapper: true,
  defaultProps: {
    badge: 'Features',
    title: 'Everything You Need',
    subtitle: 'All the tools to succeed',
    features: [
      { id: crypto.randomUUID(), icon: 'Zap', title: 'Fast', description: 'Lightning quick performance' },
      { id: crypto.randomUUID(), icon: 'Shield', title: 'Secure', description: 'Enterprise-grade security' },
      { id: crypto.randomUUID(), icon: 'Globe', title: 'Global', description: 'Available worldwide' },
    ],
  },
  dndArrays: [
    { path: 'features', idField: 'id' },
  ],
  translatableProps: ['title', 'subtitle', 'features.*.title', 'features.*.description'],
});
```

---

## 12.3 Complex Section Example: Team Members

### Overview

The Team Members section demonstrates:
- Array of members with DnD
- Image upload for photos
- Nested array for social links
- Toggle for showing/hiding social links

### Type Definition

```typescript
interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface TeamMember {
  id: string;
  photo?: string;
  name: string;
  role: string;
  bio?: string;
  showSocialLinks?: boolean;
  socialLinks?: SocialLink[];
}

interface TeamMembersSectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  members: TeamMember[];
}
```

### Display Component

```typescript
// src/components/landing/TeamMembersSection.tsx

import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import { BaseSectionData, BaseLayoutProps } from '@/types/baseSectionTypes';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableWrapper, SortableItem } from '@/components/editor/SortableItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface TeamMember {
  id: string;
  photo?: string;
  name: string;
  role: string;
  bio?: string;
  showSocialLinks?: boolean;
  socialLinks?: SocialLink[];
}

interface TeamMembersSectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  members: TeamMember[];
}

interface TeamMembersSectionProps extends BaseLayoutProps {
  data: TeamMembersSectionData & BaseSectionData;
}

export function TeamMembersSection({ data, editable = false }: TeamMembersSectionProps) {
  const { items: members, sensors, handleDragEnd } = useArrayItems({
    sectionId: data.id,
    items: data.members || [],
    arrayPath: 'members',
    editable,
  });

  const columns = data.layoutProps?.columns || 4;

  return (
    <SectionContainer id={data.id} styleOverrides={data.styleProps}>
      <SectionHeader
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        alignment={data.layoutProps?.alignment}
      />

      <SortableWrapper
        sensors={sensors}
        items={members}
        onDragEnd={handleDragEnd}
        disabled={!editable}
      >
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {members.map((member) => (
            <SortableItem
              key={member.id}
              id={member.id}
              disabled={!editable}
            >
              <div className="flex flex-col items-center text-center group">
                <Avatar className="w-32 h-32 mb-4 ring-4 ring-background shadow-lg">
                  <AvatarImage src={member.photo} alt={member.name} />
                  <AvatarFallback className="text-2xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-primary font-medium text-sm mb-2">
                  {member.role}
                </p>
                
                {member.bio && (
                  <p className="text-muted-foreground text-sm mb-3">
                    {member.bio}
                  </p>
                )}
                
                {member.showSocialLinks && member.socialLinks?.length > 0 && (
                  <div className="flex gap-2">
                    {member.socialLinks.map((link) => {
                      const IconComponent = ICON_MAP[link.platform] || ICON_MAP['Link'];
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <IconComponent className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
}
```

### Settings Component

```typescript
// src/components/admin/sections/TeamMembersSettingsContent.tsx

import { 
  SectionHeaderFields, 
  ItemListEditor, 
  TextField,
  ImageField,
  ToggleField,
} from '@/components/admin/sections/shared';
import { IconPicker } from '@/components/admin/sections/shared/IconPicker';
import { useLatestRef, useDataChangeHandlers } from '@/hooks/useLatestRef';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface TeamMember {
  id: string;
  photo?: string;
  name: string;
  role: string;
  bio?: string;
  showSocialLinks?: boolean;
  socialLinks?: SocialLink[];
}

interface TeamMembersSectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  members: TeamMember[];
}

interface TeamMembersSettingsContentProps {
  data: TeamMembersSectionData;
  onChange: (data: TeamMembersSectionData) => void;
}

export function TeamMembersSettingsContent({ data, onChange }: TeamMembersSettingsContentProps) {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6">
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(badge) => updateField('badge', badge)}
        onTitleChange={(title) => updateField('title', title)}
        onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
      />

      <ItemListEditor
        items={data.members || []}
        onItemsChange={(members) => updateArray('members', members)}
        createNewItem={() => ({
          id: crypto.randomUUID(),
          name: 'New Member',
          role: 'Role',
          bio: '',
          showSocialLinks: false,
          socialLinks: [],
        })}
        getItemTitle={(member) => member.name || 'Unnamed'}
        renderItem={(member, index, onUpdateMember) => (
          <div className="space-y-4">
            {/* Photo */}
            <ImageField
              label="Photo"
              src={member.photo || ''}
              onChange={(photo) => onUpdateMember({ photo })}
              showPreview
            />
            
            {/* Name */}
            <TextField
              label="Name"
              value={member.name}
              onChange={(name) => onUpdateMember({ name })}
            />
            
            {/* Role */}
            <TextField
              label="Role"
              value={member.role}
              onChange={(role) => onUpdateMember({ role })}
            />
            
            {/* Bio */}
            <TextField
              label="Bio"
              value={member.bio || ''}
              onChange={(bio) => onUpdateMember({ bio })}
              multiline
            />
            
            {/* Social Links Toggle */}
            <ToggleField
              label="Show Social Links"
              checked={member.showSocialLinks || false}
              onChange={(showSocialLinks) => onUpdateMember({ showSocialLinks })}
            />
            
            {/* Nested Social Links Editor */}
            {member.showSocialLinks && (
              <ItemListEditor
                items={member.socialLinks || []}
                onItemsChange={(socialLinks) => onUpdateMember({ socialLinks })}
                createNewItem={() => ({
                  id: crypto.randomUUID(),
                  platform: 'Twitter',
                  url: '',
                })}
                getItemTitle={(link) => link.platform || 'Link'}
                renderItem={(link, linkIndex, onUpdateLink) => (
                  <div className="space-y-3">
                    <IconPicker
                      value={link.platform}
                      onChange={(platform) => onUpdateLink({ platform })}
                    />
                    <TextField
                      label="URL"
                      value={link.url}
                      onChange={(url) => onUpdateLink({ url })}
                      placeholder="https://..."
                    />
                  </div>
                )}
              />
            )}
          </div>
        )}
      />
    </div>
  );
}
```

### Registration

```typescript
// In src/lib/sectionDefinitions.tsx

import { Users } from 'lucide-react';
import { TeamMembersSection } from '@/components/landing/TeamMembersSection';
import { TeamMembersSettingsContent } from '@/components/admin/sections/TeamMembersSettingsContent';

registerSection({
  type: 'team-members',
  displayName: 'Team Members',
  icon: Users,
  category: 'content',
  component: TeamMembersSection,
  settingsComponent: TeamMembersSettingsContent,
  usesDataWrapper: true,
  defaultProps: {
    badge: 'Our Team',
    title: 'Meet the Team',
    subtitle: 'The people behind the product',
    members: [
      {
        id: crypto.randomUUID(),
        name: 'John Doe',
        role: 'CEO',
        bio: 'Leading with vision',
        showSocialLinks: true,
        socialLinks: [
          { id: crypto.randomUUID(), platform: 'Twitter', url: '#' },
          { id: crypto.randomUUID(), platform: 'Linkedin', url: '#' },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: 'Jane Smith',
        role: 'CTO',
        bio: 'Building the future',
        showSocialLinks: true,
        socialLinks: [
          { id: crypto.randomUUID(), platform: 'Github', url: '#' },
        ],
      },
    ],
  },
  dndArrays: [
    { path: 'members', idField: 'id' },
    { path: 'members.*.socialLinks', idField: 'id' },
  ],
  translatableProps: [
    'title', 
    'subtitle', 
    'members.*.name', 
    'members.*.role', 
    'members.*.bio'
  ],
});
```

---

# SECTION 13: Checklist and Summary

## 13.1 Quick Reference Checklist

Print this checklist and follow it for every new section:

```
┌────────────────────────────────────────────────────────────────┐
│                    NEW SECTION CHECKLIST                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PREPARATION                                                    │
│  [ ] Decided on section type name (kebab-case)                 │
│  [ ] Identified props needed (simple, array, nested?)          │
│  [ ] Found similar section to reference                        │
│                                                                 │
│  STEP 1: TYPES                                                  │
│  [ ] Defined item interface(s) with id field                   │
│  [ ] Defined section data interface                            │
│  [ ] Added type to SectionType union in pageEditor.ts          │
│                                                                 │
│  STEP 2: DISPLAY COMPONENT                                      │
│  [ ] Created src/components/landing/[Name]Section.tsx          │
│  [ ] Imported SectionContainer, SectionHeader                  │
│  [ ] Used useArrayItems for arrays                             │
│  [ ] Used SortableWrapper/SortableItem for DnD                 │
│  [ ] Used ICON_MAP for icons                                   │
│  [ ] Used semantic Tailwind classes                            │
│                                                                 │
│  STEP 3: SETTINGS COMPONENT                                     │
│  [ ] Created src/components/admin/sections/[Name]SettingsContent.tsx │
│  [ ] Used useLatestRef and useDataChangeHandlers               │
│  [ ] Used SectionHeaderFields for header                       │
│  [ ] Used ItemListEditor for arrays                            │
│  [ ] Used shared field components                              │
│  [ ] createNewItem includes id field                           │
│                                                                 │
│  STEP 4: REGISTRATION                                           │
│  [ ] Added imports to sectionDefinitions.tsx                   │
│  [ ] Called registerSection with all required fields           │
│  [ ] Set usesDataWrapper: true                                 │
│  [ ] Added dndArrays for each array                            │
│  [ ] Set sensible defaultProps                                 │
│                                                                 │
│  TESTING                                                        │
│  [ ] Section appears in block library                          │
│  [ ] Can add to page                                           │
│  [ ] Settings panel works                                       │
│  [ ] All fields update canvas                                  │
│  [ ] Array add/remove/reorder works                            │
│  [ ] Style settings apply                                      │
│  [ ] Save and reload preserves data                            │
│  [ ] Live page renders correctly                               │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 13.2 File Creation Summary

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/landing/[Name]Section.tsx` | Display component |
| `src/components/admin/sections/[Name]SettingsContent.tsx` | Settings component |

### Files to Modify

| File | Change |
|------|--------|
| `src/types/pageEditor.ts` | Add `'your-type'` to `SectionType` union |
| `src/lib/sectionDefinitions.tsx` | Add imports and `registerSection()` call |

---

## 13.3 Do's and Don'ts

### Do's ✅

| Do | Why |
|----|-----|
| Use `SectionContainer` wrapper | Applies style settings automatically |
| Use `useLatestRef` in settings | Prevents stale closure bugs |
| Use `useArrayItems` for DnD | Integrates with editor DnD system |
| Include `id` in array items | Required for DnD and React keys |
| Use shared components | Consistent UI, less code |
| Use semantic Tailwind classes | Theme-aware, dark mode compatible |
| Set `usesDataWrapper: true` | Component receives `{ data }` prop correctly |
| Add `dndArrays` for arrays | Enables drag-and-drop in editor |
| Test in editor AND live page | Catch rendering differences early |
| Copy from similar section | Faster, fewer mistakes |

### Don'ts ❌

| Don't | Why |
|-------|-----|
| Hardcode backgrounds | Users can't customize in style panel |
| Mutate state directly | Causes subtle bugs, breaks undo |
| Skip the `id` field | DnD and React lists break |
| Use raw colors | Won't adapt to dark mode |
| Create complex state | All state should flow through editor store |
| Forget settings validation | Invalid data causes save errors |
| Use `!important` | Breaks style system overrides |
| Forget responsive design | Mobile experience matters |
| Skip testing | Bugs are harder to find later |
| Build from scratch | Use templates and shared components |

---

## Architecture Rules

All sections and editor code must follow these architecture rules:

### 1. No Black Boxes
- Every feature lives in designated folders
- No business logic in UI components
- No magic variables or hidden state

### 2. Single Source of Truth
- Section data lives in `editorStore.pageData.sections[]`
- No duplicate state that can drift
- Settings, display, and save use the same model

### 3. Visibility Rule
- Setting changes reflect immediately on canvas
- State updates reflect immediately in UI
- All changes persist correctly

### 4. File Size Limits
- No file over 300 lines (target)
- Split large files by domain/responsibility

### 5. No Vibe-Coding
- Single responsibility per function
- No copy-paste logic
- Meaningful names for everything

### 6. Modular Section Definitions
- Each section in its own file: `src/lib/sections/definitions/[name].ts`
- Import via barrel: `src/lib/sections/index.ts`

### 7. Consolidated Utilities
- Object helpers in `src/lib/utils/objectHelpers.ts`
- Logging via `src/lib/logger.ts` (silent in production)

---

## Conclusion

This guide covers everything you need to add sections to the page builder. Follow the patterns, use the shared components, and you'll have a working section in under 30 minutes.

**Key Takeaways:**

1. **Every section has 4 parts**: Types, Display, Settings, Registration
2. **Use shared components**: They handle the hard stuff
3. **Always include `id` in arrays**: Required for DnD
4. **Use `useLatestRef`**: Prevents the #1 bug (stale closures)
5. **Wrap in `SectionContainer`**: Enables style settings
6. **Test thoroughly**: Editor, styles, save/load, live page
7. **Register in modular file**: `src/lib/sections/definitions/[name].ts`

**Need help?** Reference the examples in Section 12, or look at existing sections in the codebase.

**Grid System**: For advanced column/widget layouts, see `src/components/editor/grid/README.md`

---

*Last Updated: January 2025*
*Version: 2.0 - Updated for modular architecture*
