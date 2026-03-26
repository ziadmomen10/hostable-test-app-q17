# Page Builder System Documentation

> **Version**: 1.0  
> **Last Updated**: January 2025  
> **Status**: Production

This document provides a comprehensive technical specification of the existing page builder system. It is intended for developers, designers, and product managers who need to understand how the builder works.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Section System](#4-section-system)
5. [Settings Engine](#5-settings-engine)
6. [Page System](#6-page-system)
7. [Data Model](#7-data-model)
8. [Grid System](#8-grid-system)
9. [Drag & Drop System](#9-drag--drop-system)
10. [Inline Editing System](#10-inline-editing-system)
11. [Translation System](#11-translation-system)
12. [Libraries & Dependencies](#12-libraries--dependencies)
13. [Designer Usage Guide](#13-designer-usage-guide)
14. [Developer Guide](#14-developer-guide)
15. [Known Limitations](#15-known-limitations)
16. [File Reference](#16-file-reference)

---

## 1. System Overview

### What It Is

The Page Builder is an **Elementor-style visual page editor** built with pure React. It allows non-technical users to create and edit web pages by dragging, dropping, and configuring pre-built sections.

### Architecture Philosophy

```
┌─────────────────────────────────────────────────────────────┐
│                        PAGE                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     SECTION                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │  │
│  │  │   COLUMN    │  │   COLUMN    │  │   COLUMN    │    │  │
│  │  │  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │    │  │
│  │  │  │WIDGET │  │  │  │WIDGET │  │  │  │WIDGET │  │    │  │
│  │  │  └───────┘  │  │  └───────┘  │  │  └───────┘  │    │  │
│  │  │  ┌───────┐  │  │             │  │             │    │  │
│  │  │  │WIDGET │  │  │             │  │             │    │  │
│  │  │  └───────┘  │  │             │  │             │    │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     SECTION                            │  │
│  │                        ...                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

The system follows a strict **Section → Column → Widget** hierarchy:

- **Pages** contain an ordered list of sections
- **Sections** are self-contained blocks (Hero, Pricing, FAQ, etc.)
- **Columns** organize content horizontally with responsive widths
- **Widgets** are atomic content units (text, images, buttons)

### Problems Solved

| Problem | Solution |
|---------|----------|
| Non-technical users need to edit pages | Visual drag-and-drop interface |
| Content updates shouldn't require deploys | Database-driven content with live preview |
| Need consistent design across pages | Pre-built section templates with styling constraints |
| Multi-language support | Integrated translation key binding system |
| Prevent data loss | Autosave with undo/redo history |

### Why Native React?

This system replaced a previous GrapesJS-based editor. The native React implementation provides:

- **Smaller bundle size**: No external editor framework
- **Type safety**: Full TypeScript coverage
- **Faster rendering**: React's virtual DOM vs GrapesJS canvas
- **Simpler state**: Zustand store vs external state sync
- **Better maintainability**: Standard React patterns

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | React | ^18.3.1 | UI component library |
| **Language** | TypeScript | - | Type safety |
| **Build Tool** | Vite | - | Fast development server |
| **Styling** | Tailwind CSS | - | Utility-first CSS |
| **State Management** | Zustand | ^5.0.9 | Global state store |
| **Drag & Drop** | @dnd-kit | ^6.3.1 / ^10.0.0 | DnD primitives |
| **Rich Text** | TipTap | ^3.15.3 | Inline text editing |
| **Data Fetching** | TanStack Query | ^5.83.0 | Server state management |
| **Backend** | Supabase | ^2.57.0 | PostgreSQL + Auth + Storage |
| **Icons** | Lucide React | ^0.462.0 | Icon library |
| **Animations** | Framer Motion | ^12.23.26 | Motion library |
| **Panels** | react-resizable-panels | ^2.1.9 | Resizable layout |

---

## 3. Frontend Architecture

### Component Hierarchy

```
ReactPageEditor                          ← Root editor component
├── EditorProvider                       ← Context initialization
│   └── TranslationEngineProvider        ← Translation context
│       │
│       ├── EditorToolbar                ← Top: Save, Undo, Redo, Preview, Publish
│       │
│       ├── ResizablePanelGroup          ← Three-column layout
│       │   │
│       │   ├── LeftSidePanel            ← Left: Section list / Block library
│       │   │   ├── SectionList          ← Current sections (reorderable)
│       │   │   └── BlockLibrary         ← Available section types
│       │   │
│       │   ├── EditorCanvas             ← Center: Main editing area
│       │   │   └── DndContext           ← Drag-and-drop context
│       │   │       └── SortableContext  ← Sortable sections
│       │   │           └── SectionWrapper (per section)
│       │   │               └── EditorSectionRenderer
│       │   │                   └── SectionDndProvider
│       │   │                       └── [SectionComponent]
│       │   │                           ├── EditableElement
│       │   │                           └── EditableText
│       │   │
│       │   └── RightSidePanel           ← Right: Settings panel
│       │       ├── SettingsPanel
│       │       │   ├── GridSettingsPanel
│       │       │   ├── ColumnSettingsPanel
│       │       │   ├── SectionStyleSettings
│       │       │   └── [SectionSettingsContent]
│       │       └── TranslationPanel
│       │
│       ├── FloatingToolbar              ← Context menu on selection
│       ├── SelectionOverlay             ← Blue selection border
│       └── InlineEditor                 ← TipTap portal for text editing
```

### State Management (Zustand Store)

The editor uses a single Zustand store (`editorStore.ts`) as the **single source of truth**.

#### Modular Slice Architecture

The store is composed from 6 domain-specific slices for maintainability:

| Slice | File | Purpose | Lines |
|-------|------|---------|-------|
| `documentSlice` | `src/stores/editor/slices/documentSlice.ts` | Section CRUD, element updates, translation keys | ~490 |
| `gridSlice` | `src/stores/editor/slices/gridSlice.ts` | Grid, column, widget operations | ~285 |
| `historySlice` | `src/stores/editor/slices/historySlice.ts` | Undo/redo history management | ~120 |
| `selectionSlice` | `src/stores/editor/slices/selectionSlice.ts` | Selection model, hover state | ~155 |
| `uiSlice` | `src/stores/editor/slices/uiSlice.ts` | Device mode, tabs, drag/resize modes | ~130 |
| `statusSlice` | `src/stores/editor/slices/statusSlice.ts` | Loading, saving, autosave status | ~65 |

The main store file (`src/stores/editorStore.ts`) composes these slices:

```typescript
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import {
  createDocumentSlice,
  createGridSlice,
  createHistorySlice,
  createSelectionSlice,
  createUISlice,
  createStatusSlice,
} from './editor/slices';

export const useEditorStore = create<EditorStoreState & EditorStoreActions>()(
  devtools(
    subscribeWithSelector((...a) => ({
      ...initialState,
      ...createDocumentSlice(...a),
      ...createGridSlice(...a),
      ...createHistorySlice(...a),
      ...createSelectionSlice(...a),
      ...createUISlice(...a),
      ...createStatusSlice(...a),
    })),
    { name: 'editor-store' }
  )
);
```

#### Core State Shape

```typescript
interface EditorState {
  // Page Data
  pageData: PageData | null;           // Complete page content
  pageId: string | null;               // Current page ID
  
  // Selection
  selection: {
    sectionId: string | null;          // Selected section
    columnId: string | null;           // Selected column
    elementPath: string | null;        // Selected element path
    isInlineEditing: boolean;          // Inline edit mode active
  };
  
  // Editor Mode
  editorMode: 'idle' | 'selecting' | 'dragging' | 'resizing' | 'inline-editing';
  
  // History
  history: PageData[];                 // Undo stack
  historyIndex: number;                // Current position
  
  // Change Tracking
  hasUnsavedChanges: boolean;          // Dirty flag
  sectionVersions: Record<string, number>; // Per-section change counter
  
  // UI State
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  activeTab: 'sections' | 'blocks';
}
```

#### Key Store Actions

```typescript
// Section Management (documentSlice)
addSection(type: SectionType, index?: number): void
deleteSection(sectionId: string): void
reorderSections(sourceIndex: number, destinationIndex: number): void
duplicateSection(sectionId: string): void
toggleSectionVisibility(sectionId: string): void

// Data Updates (documentSlice)
updateSectionProps(sectionId: string, props: Partial<any>): void
updateSectionStyle(sectionId: string, style: Partial<SectionStyleProps>): void
updateElementValue(sectionId: string, path: string, value: any): void

// Grid Operations (gridSlice)
setSectionGrid(sectionId: string, grid: SectionGrid): void
addColumn(sectionId: string, column: GridColumn, index?: number): void
removeColumn(sectionId: string, columnId: string): void
updateColumnWidth(sectionId: string, columnId: string, width: ResponsiveWidth): void

// Selection (selectionSlice)
selectSection(sectionId: string | null): void
selectColumn(sectionId: string, columnId: string): void
selectElement(sectionId: string, elementPath: string): void
startInlineEdit(): void
stopInlineEdit(): void

// History (historySlice)
undo(): void
redo(): void
pushHistory(): void

// Status (statusSlice)
setHasUnsavedChanges(value: boolean): void
markSaved(): void
```

### Rendering Modes

The system has two distinct rendering paths:

#### Editor Mode

Used in `/admin/pages/edit/:pageId`:

```
EditorCanvas
  → EditorSectionRenderer
    → SectionComponent (with editing wrappers)
      → EditableElement / EditableText (clickable, inline-editable)
```

Features:
- Selection overlays
- Drag handles
- Inline editing
- Settings panel integration
- Real-time updates

#### Live Mode

Used in `/page/:slug` (public pages):

```
LivePageRenderer
  → LiveSectionRenderer
    → SectionComponent (no editing wrappers)
```

Features:
- Zero editor dependencies
- Optimized for performance
- Translation resolution
- No edit overlays

---

## 4. Section System

### Section Types

The system includes **26 pre-built section types**:

| Type | Category | Description | Key Props |
|------|----------|-------------|-----------|
| `hero` | layout | Main hero with headline, CTA, services | `title`, `subtitle`, `primaryButtonText`, `services[]` |
| `pricing` | commerce | Pricing cards/carousel | `title`, `plans[]`, `billingPeriod` |
| `features` | content | Feature grid with icons | `title`, `features[]` |
| `faq` | content | Collapsible Q&A accordion | `title`, `faqs[]` |
| `testimonials` | content | Customer review carousel | `title`, `testimonials[]` |
| `cta` | layout | Call-to-action banner | `title`, `buttonText`, `buttonLink` |
| `trusted-by` | content | Trust badges and logos | `title`, `logos[]` |
| `hosting-services` | commerce | Service offering cards | `title`, `services[]` |
| `why-choose` | content | Benefit icons/text | `title`, `reasons[]` |
| `need-help` | content | Support/contact options | `title`, `options[]` |
| `logo-carousel` | media | Scrolling logo strip | `logos[]`, `speed` |
| `stats-counter` | content | Animated statistics | `stats[]` |
| `steps` | content | Process/timeline steps | `title`, `steps[]` |
| `announcement-banner` | layout | Top notification bar | `message`, `linkText`, `linkUrl` |
| `icon-features` | content | Icon-based feature list | `title`, `features[]` |
| `alternating-features` | content | Image/text alternating blocks | `features[]` |
| `os-selector` | interactive | Operating system picker | `operatingSystems[]` |
| `data-center` | content | Server location map | `title`, `locations[]` |
| `bento-grid` | layout | Flexible grid cards | `items[]` |
| `awards` | content | Award/certification badges | `title`, `awards[]` |
| `plans-comparison` | commerce | Feature comparison table | `title`, `plans[]`, `features[]` |
| `blog-grid` | content | Article preview cards | `title`, `posts[]` |
| `contact` | content | Contact form + info | `title`, `email`, `phone` |
| `server-specs` | commerce | Hardware specifications | `title`, `specs[]` |
| `video` | media | Video embed/player | `videoUrl`, `title` |
| `generic` | layout | Fallback/custom container | `content` |

### Section Definition Structure

Each section is defined in individual files under `src/lib/sections/definitions/`:

```typescript
// src/lib/sections/types.ts
interface SectionDefinition {
  type: SectionType;                    // Unique identifier
  displayName: string;                  // Human-readable name
  icon: LucideIcon;                     // Toolbar icon
  category: 'layout' | 'content' | 'commerce' | 'media' | 'interactive';
  component: ComponentType<any>;        // Display component
  settingsComponent: ComponentType<{    // Settings panel
    data: any;
    onChange: (data: any) => void;
    sectionId?: string;
  }>;
  defaultProps: Record<string, any>;    // Initial values
  description: string;                  // Tooltip description
  translatableProps?: string[];         // Keys for translation
  usesDataWrapper?: boolean;            // Component receives { data } prop
  dndArrays?: DndArrayConfig[];         // Arrays that support DnD
}

interface DndArrayConfig {
  path: string;                         // Dot-notation path to array
  strategy: 'grid' | 'horizontal' | 'vertical';  // DnD sorting strategy
  handlePosition?: 'left' | 'top-left' | 'top-right';  // Drag handle position
}
```

### Section Instance Structure

When a section is added to a page:

```typescript
interface SectionInstance {
  id: string;                           // Unique ID (uuid)
  type: SectionType;                    // Section type
  order: number;                        // Position in page
  visible: boolean;                     // Show/hide toggle
  props: Record<string, any>;           // Content data
  grid?: SectionGrid;                   // Column layout
  style?: SectionStyleProps;            // Visual styling
  translationKeys?: TranslationKeyMap;  // i18n bindings
}
```

### Section Registration (Modular Pattern)

Sections are registered in individual definition files:

```typescript
// src/lib/sections/definitions/hero.ts
import { Layout } from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import HeroSettingsContent from '@/components/admin/sections/HeroSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultHeroProps = {
  badge: 'New Feature',
  title: 'Build Something Amazing',
  subtitle: 'Start your journey today',
  primaryButtonText: 'Get Started',
  services: [
    { id: '1', icon: 'Laptop', label: 'Web Apps' },
  ],
};

registerSection({
  type: 'hero',
  displayName: 'Hero Section',
  icon: Layout,
  category: 'layout',
  component: HeroSection,
  settingsComponent: createSettingsWrapper(HeroSettingsContent),
  defaultProps: defaultHeroProps,
  description: 'Main hero section with headline and CTA',
  dndArrays: [{ path: 'services', strategy: 'horizontal' }],
  translatableProps: ['title', 'subtitle', 'primaryButtonText'],
});

// Then import in src/lib/sections/index.ts:
// import './definitions/hero';
```

---

## 5. Settings Engine

### Three-Level Settings

The settings system operates at three levels:

```
┌─────────────────────────────────────┐
│         SECTION SETTINGS            │  ← Content: title, items, etc.
├─────────────────────────────────────┤
│           GRID SETTINGS             │  ← Layout: columns, gaps, widths
├─────────────────────────────────────┤
│          STYLE SETTINGS             │  ← Visual: background, padding
└─────────────────────────────────────┘
```

### Section Settings (Content)

Located in `src/components/admin/sections/[Type]SettingsContent.tsx`:

```typescript
// Example: HeroSettingsContent.tsx
interface HeroSettingsContentProps {
  data: HeroSectionData;
  onChange: (data: Partial<HeroSectionData>) => void;
}

function HeroSettingsContent({ data, onChange }: HeroSettingsContentProps) {
  return (
    <>
      <Input
        label="Badge Text"
        value={data.badge}
        onChange={(e) => onChange({ badge: e.target.value })}
      />
      <Input
        label="Title"
        value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
      />
      <ItemListEditor
        items={data.services}
        onItemsChange={(services) => onChange({ services })}
      />
    </>
  );
}
```

### Grid Settings (Layout)

Located in `src/components/editor/grid/GridSettingsPanel.tsx`:

```typescript
interface GridSettings {
  columns: GridColumn[];                // Column definitions
  gap: string;                          // Gap between columns
  alignment: 'start' | 'center' | 'end' | 'stretch';
  verticalAlignment: 'start' | 'center' | 'end';
}

interface GridColumn {
  id: string;
  width: ResponsiveValue<string>;       // { desktop: '33%', tablet: '50%', mobile: '100%' }
  widgets: GridWidget[];
}
```

### Style Settings (Visual)

Located in `src/components/editor/settings/SectionStyleSettings.tsx`:

```typescript
interface SectionStyleProps {
  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
  backgroundOverlay?: string;
  
  // Spacing
  paddingTop?: ResponsiveValue<string>;
  paddingBottom?: ResponsiveValue<string>;
  paddingLeft?: ResponsiveValue<string>;
  paddingRight?: ResponsiveValue<string>;
  marginTop?: string;
  marginBottom?: string;
  
  // Border
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  
  // Effects
  boxShadow?: string;
  
  // Visibility
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnMobile?: boolean;
}
```

### Settings Update Flow

```
User changes setting
        ↓
onChange callback fires
        ↓
Store action called:
  - updateSectionProps()    ← Content changes
  - updateSectionStyle()    ← Visual changes  
  - setSectionGrid()        ← Layout changes
        ↓
Store updates pageData
        ↓
sectionVersions[id]++ 
        ↓
React re-renders affected components
        ↓
hasUnsavedChanges = true
        ↓
Autosave triggers (2s debounce)
```

### Responsive Values

Many settings support responsive values:

```typescript
interface ResponsiveValue<T> {
  desktop: T;
  tablet?: T;
  mobile?: T;
}

// Usage
const columnWidth: ResponsiveValue<string> = {
  desktop: '33.33%',
  tablet: '50%',
  mobile: '100%',
};
```

---

## 6. Page System

### Page Creation Flow

```
Admin → Pages → "Add New Page"
        ↓
Enter: URL, Title, Description
        ↓
Supabase INSERT into `pages` table
        ↓
Redirect to /admin/pages/edit/:pageId
        ↓
Editor loads with empty sections[]
```

### Page Data Structure

```typescript
interface PageData {
  id: string;                           // UUID
  version: number;                      // Schema version
  sections: SectionInstance[];          // Ordered sections
  metadata: {
    title: string;
    description?: string;
    keywords?: string;
    lastModified: string;               // ISO timestamp
  };
}
```

### Page Loading

```typescript
// src/hooks/queries/usePageData.ts

function usePageData(pageId: string) {
  return useQuery({
    queryKey: ['page', pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .single();
      
      if (error) throw error;
      
      // Parse JSON content
      const pageData = data.content 
        ? JSON.parse(data.content) 
        : { sections: [], version: 1 };
      
      return { ...data, pageData };
    },
  });
}
```

### Page Saving

Three save mechanisms exist:

#### 1. Manual Save (Ctrl+S or Save Button)

```typescript
async function savePageContent() {
  const { pageData, pageId } = useEditorStore.getState();
  
  await supabase
    .from('pages')
    .update({
      content: JSON.stringify(pageData),
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId);
}
```

#### 2. Autosave (2-second Debounce)

```typescript
// src/hooks/queries/useAutosave.ts

function useAutosave(pageId: string, data: PageData) {
  const debouncedSave = useDebouncedCallback(
    async (data: PageData) => {
      await supabase
        .from('pages')
        .update({ content: JSON.stringify(data) })
        .eq('id', pageId);
    },
    2000 // 2 second debounce
  );

  useEffect(() => {
    if (hasUnsavedChanges) {
      debouncedSave(data);
    }
  }, [data, hasUnsavedChanges]);
}
```

#### 3. Emergency Save (On Unmount)

```typescript
useEffect(() => {
  return () => {
    if (hasUnsavedChanges) {
      // Synchronous save attempt on unmount
      navigator.sendBeacon('/api/save', JSON.stringify(pageData));
    }
  };
}, []);
```

### Page Rendering (Live)

```typescript
// src/pages/DynamicPage.tsx

function DynamicPage() {
  const { slug } = useParams();
  const { data: page } = useQuery(['page', slug], () => 
    supabase.from('pages').select('*').eq('page_url', slug).single()
  );

  const pageData = JSON.parse(page.content);

  return (
    <LivePageRenderer 
      sections={pageData.sections} 
      languageCode={currentLanguage}
    />
  );
}
```

---

## 7. Data Model

### Database Schema

#### `pages` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `page_url` | text | URL slug (e.g., "vps-hosting") |
| `page_title` | text | SEO title |
| `page_description` | text | SEO meta description |
| `page_keywords` | text | SEO keywords |
| `content` | text | JSON-stringified PageData |
| `css_content` | text | Legacy custom CSS |
| `is_active` | boolean | Published status |
| `supported_languages` | text[] | Enabled languages |
| `header_image_url` | text | OG image URL |
| `og_image_url` | text | Social share image |
| `country` | text | Target country |
| `default_currency` | text | Currency code |
| `show_price_switcher` | boolean | Currency toggle |
| `hidden_sections` | text[] | Section IDs to hide |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last modified |

#### Related Tables

| Table | Purpose |
|-------|---------|
| `page_translations` | Per-element translations |
| `page_versions` | Version history snapshots |
| `page_locks` | Concurrent editing locks |
| `page_seo` | Per-language SEO metadata |
| `page_translation_coverage` | Translation completeness stats |
| `translation_keys` | Registered translation keys |
| `translations` | Key-value translations |
| `languages` | Available languages |

### Example Page Content JSON

```json
{
  "id": "6fc5ff56-b159-445b-9f54-b7998a867c18",
  "version": 1,
  "metadata": {
    "title": "VPS Hosting",
    "description": "High-performance virtual private servers",
    "lastModified": "2025-01-13T10:30:00Z"
  },
  "sections": [
    {
      "id": "section-hero-abc123",
      "type": "hero",
      "order": 0,
      "visible": true,
      "props": {
        "badge": "New",
        "title": "Lightning Fast VPS Hosting",
        "subtitle": "Deploy in seconds, scale infinitely",
        "primaryButtonText": "Get Started",
        "primaryButtonLink": "/pricing",
        "secondaryButtonText": "Learn More",
        "heroImage": "/images/server-rack.png",
        "services": [
          { "icon": "Server", "label": "VPS" },
          { "icon": "Cloud", "label": "Cloud" },
          { "icon": "Shield", "label": "DDoS Protection" }
        ]
      },
      "translationKeys": {
        "title": "vps.hero.title",
        "subtitle": "vps.hero.subtitle",
        "primaryButtonText": "vps.hero.cta"
      },
      "style": {
        "paddingTop": { "desktop": "80px", "mobile": "40px" },
        "paddingBottom": { "desktop": "80px", "mobile": "40px" },
        "backgroundColor": "hsl(var(--background))"
      }
    },
    {
      "id": "section-pricing-def456",
      "type": "pricing",
      "order": 1,
      "visible": true,
      "props": {
        "title": "Simple, Transparent Pricing",
        "subtitle": "No hidden fees, cancel anytime",
        "plans": [
          {
            "name": "Starter",
            "monthlyPrice": 9.99,
            "yearlyPrice": 99.99,
            "features": ["1 vCPU", "2GB RAM", "50GB SSD"],
            "isFeatured": false
          },
          {
            "name": "Professional",
            "monthlyPrice": 29.99,
            "yearlyPrice": 299.99,
            "features": ["4 vCPU", "8GB RAM", "200GB SSD"],
            "isFeatured": true
          }
        ],
        "billingPeriod": "monthly"
      },
      "grid": {
        "columns": [
          {
            "id": "col-1",
            "width": { "desktop": "50%", "tablet": "100%" },
            "widgets": []
          },
          {
            "id": "col-2", 
            "width": { "desktop": "50%", "tablet": "100%" },
            "widgets": []
          }
        ],
        "gap": "2rem"
      }
    }
  ]
}
```

---

## 8. Grid System

### Elementor-Style Hierarchy

The grid system enforces a strict **Section → Column → Widget** hierarchy:

```
Section (full-width container)
│
├── Column (responsive width)
│   ├── Widget (text block)
│   └── Widget (image)
│
├── Column (responsive width)
│   └── Widget (button)
│
└── Column (responsive width)
    └── Widget (icon list)
```

### Grid Data Model

```typescript
// src/types/grid.ts

interface SectionGrid {
  columns: GridColumn[];
  gap?: string;                         // e.g., "1rem", "24px"
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  verticalAlignment?: 'start' | 'center' | 'end';
}

interface GridColumn {
  id: string;                           // Unique column ID
  width: ResponsiveValue<string>;       // Responsive widths
  widgets: GridWidget[];                // Contained widgets
  style?: ColumnStyleProps;             // Column-specific styles
}

interface GridWidget {
  id: string;                           // Unique widget ID
  type: WidgetType;                     // 'text' | 'image' | 'button' | etc.
  props: Record<string, any>;           // Widget-specific props
  style?: WidgetStyleProps;             // Widget-specific styles
}

interface ResponsiveValue<T> {
  desktop: T;
  tablet?: T;
  mobile?: T;
}
```

### Runtime Grid Normalization

Legacy sections without explicit grid definitions are normalized at runtime:

```typescript
// src/lib/gridNormalizer.ts

function normalizeSection(section: SectionInstance): SectionInstance {
  // If section already has grid, return as-is
  if (section.grid?.columns?.length) {
    return section;
  }

  // Convert array props to grid structure
  const definition = sectionDefinitions[section.type];
  
  // Example: Convert features[] to grid columns
  if (section.props.features) {
    return {
      ...section,
      grid: {
        columns: section.props.features.map((feature, i) => ({
          id: `col-${i}`,
          width: { desktop: '33.33%', tablet: '50%', mobile: '100%' },
          widgets: [{
            id: `widget-${i}`,
            type: 'feature-card',
            props: feature,
          }],
        })),
        gap: '1.5rem',
      },
    };
  }

  return section;
}
```

### Grid Store Actions

```typescript
// Available in editorStore.ts

// Column operations
addColumn(sectionId: string): void
removeColumn(sectionId: string, columnId: string): void
reorderColumn(sectionId: string, fromIndex: number, toIndex: number): void
updateColumnWidth(sectionId: string, columnId: string, width: ResponsiveValue<string>): void

// Widget operations
addWidgetToColumn(sectionId: string, columnId: string, widget: GridWidget): void
removeWidget(sectionId: string, columnId: string, widgetId: string): void
reorderWidgetInColumn(sectionId: string, columnId: string, fromIndex: number, toIndex: number): void
moveWidgetBetweenColumns(
  sectionId: string, 
  fromColumnId: string, 
  toColumnId: string, 
  widgetId: string,
  toIndex: number
): void
```

---

## 9. Drag & Drop System

### DnD Type Hierarchy

| Draggable Type | Valid Drop Targets | Result |
|----------------|-------------------|--------|
| `section` | Between sections | Reorder page sections |
| `column` | Columns in same section | Reorder columns |
| `widget` | Widgets, empty columns | Reorder or move widgets |
| `block` (from library) | Canvas, between sections | Add new section |

### Key Components

```
EditorCanvas
└── DndContext                          ← Main DnD context
    ├── SortableContext                 ← For sections
    │   └── SortableItem                ← Draggable section wrapper
    │       └── SectionWrapper
    │           └── GridSection
    │               └── SortableContext ← For columns
    │                   └── SortableColumn
    │                       └── SortableContext ← For widgets
    │                           └── SortableWidget
    │
    └── DragOverlay                     ← Ghost preview during drag
```

### DnD Configuration

```typescript
// src/lib/sectionDndConfig.ts

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,                      // 8px movement to start drag
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

const collisionDetection = closestCenter;
```

### useArrayItems Hook

For sections with array-based content (features, plans, FAQs):

```typescript
// src/hooks/useArrayItems.tsx

function useArrayItems<T>(items: T[], onItemsChange: (items: T[]) => void) {
  const sensors = useSensors(/* ... */);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((_, i) => `item-${i}` === active.id);
      const newIndex = items.findIndex((_, i) => `item-${i}` === over?.id);
      onItemsChange(arrayMove(items, oldIndex, newIndex));
    }
  };

  return { sensors, handleDragEnd };
}
```

---

## 10. Inline Editing System

### Flow Diagram

```
User double-clicks text element
            ↓
EditableElement detects double-click
            ↓
startInlineEdit(sectionId, path, bounds)
            ↓
Store sets:
  - selection.isInlineEditing = true
  - selection.elementBounds = DOMRect
            ↓
InlineEditor portal renders over element
            ↓
TipTap editor initialized with current content
            ↓
User types, formats text
            ↓
User presses Enter/Escape OR clicks outside
            ↓
handleSave() → updateElementValue(sectionId, path, tiptapJSON)
            ↓
stopInlineEdit() → clears inline editing state
            ↓
Section re-renders with new content
```

### EditableElement Component

```typescript
// src/components/editor/EditableElement.tsx

function EditableElement({ 
  sectionId, 
  path, 
  children,
  editable = true,
}: EditableElementProps) {
  const { startInlineEdit, selection } = useEditorStore();
  const ref = useRef<HTMLDivElement>(null);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editable) return;
    
    const bounds = ref.current?.getBoundingClientRect();
    if (bounds) {
      startInlineEdit(sectionId, path, bounds);
    }
  };

  return (
    <div
      ref={ref}
      data-editable
      data-section-id={sectionId}
      data-element-path={path}
      onDoubleClick={handleDoubleClick}
      className={cn(
        'cursor-text',
        selection.elementPath === path && 'ring-2 ring-primary'
      )}
    >
      {children}
    </div>
  );
}
```

### InlineEditor Component

```typescript
// src/components/editor/InlineEditor.tsx

function InlineEditor() {
  const { selection, stopInlineEdit, updateElementValue } = useEditorStore();
  const { sectionId, elementPath, elementBounds, isInlineEditing } = selection;

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link, TextAlign, Highlight],
    content: getCurrentContent(),
    onBlur: handleSave,
  });

  if (!isInlineEditing || !elementBounds) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: elementBounds.top,
        left: elementBounds.left,
        width: elementBounds.width,
        minHeight: elementBounds.height,
      }}
    >
      <TiptapBubbleMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>,
    document.body
  );
}
```

### Rich Text Storage

Inline-edited content is stored as TipTap JSON:

```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Lightning " },
        { 
          "type": "text", 
          "text": "Fast", 
          "marks": [{ "type": "bold" }] 
        },
        { "type": "text", "text": " VPS Hosting" }
      ]
    }
  ]
}
```

---

## 11. Translation System

### Key Binding Flow

```
Section Created
      ↓
translationKeys map initialized empty
      ↓
User opens Translation Panel
      ↓
User clicks "Assign Key" on prop
      ↓
TranslationKeyPicker opens
      ↓
User selects/creates key (e.g., "hero.title")
      ↓
translationKeys[propPath] = keyName
      ↓
Section saved with binding
```

### Translation Key Map

```typescript
interface TranslationKeyMap {
  [propPath: string]: string;  // e.g., { "title": "hero.main_title" }
}

// Example section with translations
{
  "id": "section-123",
  "type": "hero",
  "props": {
    "title": "Fast Hosting",           // Original value
    "subtitle": "Deploy in seconds"
  },
  "translationKeys": {
    "title": "hero.main_title",        // Bound to translation key
    "subtitle": "hero.subtitle"
  }
}
```

### Translation Resolution

#### Editor Mode

```typescript
// src/hooks/useEditorTranslations.ts

function useEditorTranslations(sectionId: string) {
  const section = useEditorStore(s => s.pageData?.sections.find(s => s.id === sectionId));
  const { translations, currentLanguage } = useTranslationEngine();

  const getTranslatedValue = (propPath: string, originalValue: string) => {
    const key = section?.translationKeys?.[propPath];
    if (!key) return originalValue;
    
    return translations[currentLanguage]?.[key] ?? originalValue;
  };

  return { getTranslatedValue };
}
```

#### Live Mode

```typescript
// src/hooks/useLiveTranslations.ts

function useLiveTranslations(section: SectionInstance, languageCode: string) {
  const { data: translations } = useQuery(
    ['translations', languageCode],
    () => fetchTranslations(languageCode)
  );

  const resolvedProps = useMemo(() => {
    const result = { ...section.props };
    
    for (const [path, key] of Object.entries(section.translationKeys || {})) {
      const translation = translations?.[key];
      if (translation) {
        set(result, path, translation);
      }
    }
    
    return result;
  }, [section, translations]);

  return resolvedProps;
}
```

### Translation Tables

| Table | Purpose |
|-------|---------|
| `translation_keys` | Registry of all keys with metadata |
| `translations` | Key-value pairs per language |
| `page_translations` | Page-specific overrides |
| `languages` | Available languages |

---

## 12. Libraries & Dependencies

### Core Libraries

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | React DOM renderer |
| `typescript` | - | Type safety |
| `vite` | - | Build tool |
| `tailwindcss` | - | Utility CSS |
| `tailwindcss-animate` | ^1.0.7 | Animation utilities |

### State & Data

| Package | Version | Purpose |
|---------|---------|---------|
| `zustand` | ^5.0.9 | Global state management |
| `@tanstack/react-query` | ^5.83.0 | Server state & caching |
| `@supabase/supabase-js` | ^2.57.0 | Backend client |

### Drag & Drop

| Package | Version | Purpose |
|---------|---------|---------|
| `@dnd-kit/core` | ^6.3.1 | DnD engine |
| `@dnd-kit/sortable` | ^10.0.0 | Sortable lists |
| `@dnd-kit/utilities` | ^3.2.2 | DnD helpers |

### Rich Text Editing

| Package | Version | Purpose |
|---------|---------|---------|
| `@tiptap/react` | ^3.15.3 | Rich text editor |
| `@tiptap/starter-kit` | ^3.15.3 | Basic extensions |
| `@tiptap/extension-link` | ^3.15.3 | Link support |
| `@tiptap/extension-underline` | ^3.15.3 | Underline format |
| `@tiptap/extension-text-align` | ^3.15.3 | Text alignment |
| `@tiptap/extension-highlight` | ^3.15.3 | Highlight format |
| `@tiptap/extension-color` | ^3.15.3 | Text color |
| `@tiptap/extension-placeholder` | ^3.15.3 | Placeholder text |
| `@tiptap/extension-bubble-menu` | ^3.15.3 | Floating toolbar |

### UI Components

| Package | Version | Purpose |
|---------|---------|---------|
| `@radix-ui/*` | Various | Headless UI primitives |
| `lucide-react` | ^0.462.0 | Icon library |
| `framer-motion` | ^12.23.26 | Animations |
| `react-resizable-panels` | ^2.1.9 | Panel layout |
| `sonner` | ^1.7.4 | Toast notifications |
| `cmdk` | ^1.1.1 | Command palette |

### Forms & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | ^7.61.1 | Form management |
| `@hookform/resolvers` | ^3.10.0 | Validation resolvers |
| `zod` | ^3.25.76 | Schema validation |

### Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `date-fns` | ^4.1.0 | Date formatting |
| `clsx` | ^2.1.1 | Class merging |
| `tailwind-merge` | ^2.6.0 | Tailwind class merging |
| `class-variance-authority` | ^0.7.1 | Component variants |

---

## 13. Designer Usage Guide

### Creating a New Page

1. Navigate to **Admin → Pages**
2. Click **"Add New Page"**
3. Fill in:
   - **URL**: e.g., `vps-hosting` (becomes `/vps-hosting`)
   - **Title**: Page title for SEO
   - **Description**: Meta description
4. Click **Save**
5. Click **"Edit"** to open the builder

### Adding Sections

#### Method 1: Block Library (Recommended)

1. Click **"Blocks"** tab in left panel
2. Browse categories: Layout, Content, Commerce, Media
3. **Click** a block card to append to page
4. Or **drag** block card to specific position

#### Method 2: Section List

1. Click **"Sections"** tab in left panel
2. Click **"+ Add Section"** at bottom
3. Select section type from modal

### Editing Content

#### Using Settings Panel

1. **Click** a section to select it
2. Right panel shows three tabs:
   - **Grid**: Column layout, gaps, alignment
   - **Content**: Section-specific settings
   - **Style**: Visual appearance

3. Modify values in the settings panel
4. Changes appear immediately on canvas

#### Inline Text Editing

1. **Double-click** any editable text
2. Floating toolbar appears with formatting options
3. Type or format text
4. Click away or press **Escape** to save

### Reordering Content

#### Reorder Sections

1. Hover section in canvas or left panel
2. Grab the **drag handle** (⋮⋮ icon)
3. Drag to new position
4. Release to drop

#### Reorder Items (Features, Plans, etc.)

1. Select section with array content
2. In settings panel, find item list
3. Use drag handles next to each item
4. Or use ↑/↓ buttons

### Managing Visibility

#### Hide Section

1. Select section
2. Click **eye icon** in section header
3. Or toggle "Visible" in settings

#### Responsive Visibility

1. Select section
2. Go to **Style** tab
3. Toggle:
   - Hide on Desktop
   - Hide on Tablet
   - Hide on Mobile

### Saving & Publishing

#### Autosave

- Changes save automatically every 2 seconds
- Look for "Saved" indicator in toolbar

#### Manual Save

- Press **Ctrl+S** (Windows) or **Cmd+S** (Mac)
- Or click **Save** button in toolbar

#### Publishing

1. Go to **Admin → Pages**
2. Toggle **"Active"** switch for the page
3. Page is now live at its URL

### Preview Mode

1. Click **"Preview"** button in toolbar
2. Canvas switches to live rendering mode
3. Click **"Edit"** to return to editing

### What NOT to Touch

| ❌ Don't | Why |
|---------|-----|
| Edit JSON directly in database | Can corrupt page structure |
| Modify section IDs | Breaks references and history |
| Remove required props | Causes rendering errors |
| Use unsupported HTML | May break layout |
| Edit `sectionDefinitions.tsx` | Requires developer knowledge |

---

## 14. Developer Guide

### Adding a New Section Type

#### Step 1: Define Types

```typescript
// src/types/sectionProps.ts

export interface NewSectionProps {
  title: string;
  subtitle?: string;
  items: Array<{
    icon: string;
    label: string;
    description: string;
  }>;
}
```

#### Step 2: Create Display Component

```typescript
// src/components/landing/NewSection.tsx

import { SectionContainer, SectionHeader } from './shared';

interface NewSectionProps {
  title: string;
  subtitle?: string;
  items: Array<{ icon: string; label: string; description: string }>;
}

export function NewSection({ title, subtitle, items }: NewSectionProps) {
  return (
    <SectionContainer>
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="grid grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div key={index} className="p-6 bg-card rounded-lg">
            <Icon name={item.icon} />
            <h3>{item.label}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
```

#### Step 3: Create Settings Component

```typescript
// src/components/admin/sections/NewSectionSettingsContent.tsx

import { Input } from '@/components/ui/input';
import { ItemListEditor } from './shared/ItemListEditor';

interface Props {
  data: NewSectionProps;
  onChange: (data: Partial<NewSectionProps>) => void;
}

export function NewSectionSettingsContent({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <Input
        label="Title"
        value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
      />
      <Input
        label="Subtitle"
        value={data.subtitle}
        onChange={(e) => onChange({ subtitle: e.target.value })}
      />
      <ItemListEditor
        items={data.items}
        onItemsChange={(items) => onChange({ items })}
        itemFields={[
          { name: 'icon', label: 'Icon', type: 'icon' },
          { name: 'label', label: 'Label', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ]}
      />
    </div>
  );
}
```

#### Step 4: Register Section

```typescript
// src/lib/sectionDefinitions.tsx

import { NewSection } from '@/components/landing/NewSection';
import { NewSectionSettingsContent } from '@/components/admin/sections/NewSectionSettingsContent';

export const sectionDefinitions = {
  // ... existing sections
  
  'new-section': {
    type: 'new-section',
    displayName: 'New Section',
    icon: Sparkles,
    category: 'content',
    component: NewSection,
    settingsComponent: NewSectionSettingsContent,
    defaultProps: {
      title: 'New Section Title',
      subtitle: 'Subtitle goes here',
      items: [
        { icon: 'Star', label: 'Feature 1', description: 'Description' },
        { icon: 'Heart', label: 'Feature 2', description: 'Description' },
      ],
    },
    translatableProps: ['title', 'subtitle', 'items.*.label', 'items.*.description'],
  },
};
```

### Extending Element Settings

To add settings for a new element type:

1. Create settings component in `src/components/editor/settings/`:

```typescript
// src/components/editor/settings/VideoSettings.tsx

export function VideoSettings({ sectionId, elementPath, onClose }: ElementSettingsProps) {
  const value = useEditorStore(s => /* get value from store */);
  
  return (
    <div className="p-4">
      <Input label="Video URL" value={value.url} onChange={/* ... */} />
      <Switch label="Autoplay" checked={value.autoplay} onCheckedChange={/* ... */} />
      <Switch label="Loop" checked={value.loop} onCheckedChange={/* ... */} />
    </div>
  );
}
```

2. Update `ElementSettings.tsx` type inference:

```typescript
function inferElementType(elementPath: string): ElementSettingsType {
  const path = elementPath.toLowerCase();
  
  // Add new pattern
  if (path.includes('video') || path.includes('embed')) {
    return 'video';
  }
  
  // ... existing patterns
}
```

3. Add to routing switch:

```typescript
case 'video':
  return <VideoSettings sectionId={sectionId} elementPath={elementPath} onClose={onClose} />;
```

### Working with the Store

```typescript
import { useEditorStore } from '@/stores/editorStore';

function MyComponent() {
  // Read state
  const pageData = useEditorStore(s => s.pageData);
  const selection = useEditorStore(s => s.selection);
  
  // Get actions
  const { 
    addSection, 
    updateSectionProps, 
    selectSection 
  } = useEditorStore();
  
  // Selective subscription (prevents unnecessary re-renders)
  const sectionTitle = useEditorStore(
    s => s.pageData?.sections.find(s => s.id === 'section-123')?.props.title
  );
}
```

### Testing Considerations

```typescript
// Mock store for testing
const mockStore = {
  pageData: {
    sections: [/* test sections */],
  },
  selection: {
    sectionId: null,
    elementPath: null,
  },
  addSection: vi.fn(),
  updateSectionProps: vi.fn(),
};

vi.mock('@/stores/editorStore', () => ({
  useEditorStore: (selector) => selector(mockStore),
}));
```

---

## 15. Known Limitations

### Technical Limitations

| Limitation | Impact | Workaround |
|------------|--------|------------|
| **No SSR** | SEO depends on client rendering | Use pre-rendering or SSG for critical pages |
| **Single user editing** | No real-time collaboration | Page locks prevent conflicts |
| **Client-side only** | Large pages slow initial load | Paginate sections, lazy load |
| **No nested sections** | Flat section structure only | Use grid columns for nesting |
| **50+ sections** | Performance degradation | Split into multiple pages |

### Feature Limitations

| Limitation | Impact | Workaround |
|------------|--------|------------|
| **Limited CSS animations** | Only Tailwind utilities available | Use Framer Motion in custom sections |
| **Image upload** | Supabase storage only | External URLs work for images |
| **Rich text not universal** | Some fields are plain text | Use designated text areas |
| **No custom fonts** | System/Google fonts only | Add fonts to Tailwind config |
| **No custom code blocks** | Can't inject arbitrary HTML/JS | Create custom section types |

### Known Issues

| Issue | Status | Notes |
|-------|--------|-------|
| Undo may skip grouped changes | Known | Single undo = last atomic change |
| Drag ghost sometimes misaligned | Known | Refresh fixes it |
| Large images slow canvas | Known | Optimize before upload |
| Translation key search slow | Known | Paginate results |

### Browser Support

| Browser | Support |
|---------|---------|
| Chrome (latest) | ✅ Full |
| Firefox (latest) | ✅ Full |
| Safari (latest) | ✅ Full |
| Edge (latest) | ✅ Full |
| IE 11 | ❌ Not supported |
| Mobile browsers | ⚠️ View only (editing limited) |

---

## 16. File Reference

### Core Files

| File | Lines | Purpose |
|------|-------|---------|
| `src/stores/editorStore.ts` | ~1300 | Central Zustand store |
| `src/lib/sectionDefinitions.tsx` | ~930 | Section registry |
| `src/lib/gridNormalizer.ts` | ~600 | Grid conversion utilities |
| `src/components/editor/EditorCanvas.tsx` | ~700 | Main canvas component |
| `src/components/editor/ReactPageEditor.tsx` | ~250 | Root editor component |

### Component Directories

| Directory | Purpose |
|-----------|---------|
| `src/components/editor/` | Editor components |
| `src/components/editor/grid/` | Grid system components |
| `src/components/editor/settings/` | Element settings panels |
| `src/components/editor/slate/` | Legacy Slate editor (deprecated) |
| `src/components/editor/tiptap/` | TipTap rich text components |
| `src/components/landing/` | Section display components |
| `src/components/admin/sections/` | Section settings components |
| `src/components/live/` | Live rendering components |

### Type Definitions

| File | Purpose |
|------|---------|
| `src/types/reactEditor.ts` | Core editor types |
| `src/types/grid.ts` | Grid system types |
| `src/types/pageEditor.ts` | Page-level types |
| `src/types/sectionProps.ts` | Section prop interfaces |
| `src/types/elementSettings.ts` | Element settings types |
| `src/types/translationEngine.ts` | Translation types |

### Hooks

| File | Purpose |
|------|---------|
| `src/hooks/queries/usePageData.ts` | Page data fetching |
| `src/hooks/queries/usePageMutations.ts` | Page save operations |
| `src/hooks/queries/useAutosave.ts` | Autosave logic |
| `src/hooks/useEditorTranslations.ts` | Editor translation resolution |
| `src/hooks/useLiveTranslations.ts` | Live translation resolution |
| `src/hooks/useArrayItems.tsx` | Array DnD hook |
| `src/hooks/useElementBounds.ts` | Element positioning |

### Context Providers

| File | Purpose |
|------|---------|
| `src/components/editor/EditorProvider.tsx` | Editor context |
| `src/contexts/SectionDndContext.tsx` | Section DnD context |
| `src/contexts/TranslationEngineContext.tsx` | Translation context |
| `src/contexts/AuthContext.tsx` | Authentication context |

---

## Appendix A: Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save page |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Escape` | Deselect / Cancel inline edit |
| `Delete` | Delete selected section |
| `Ctrl/Cmd + D` | Duplicate selected section |
| `↑` / `↓` | Navigate sections |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Section** | A self-contained page block (Hero, Pricing, etc.) |
| **Column** | A horizontal division within a section |
| **Widget** | An atomic content unit (text, image, button) |
| **Props** | Content data for a section |
| **Grid** | Column/widget layout structure |
| **Style** | Visual properties (colors, spacing, etc.) |
| **Translation Key** | Identifier linking content to translations |
| **Inline Editing** | Direct text editing on canvas |
| **Autosave** | Automatic saving after changes |

---

## Appendix C: API Quick Reference

### Store Actions

```typescript
// Section
addSection(type, index?)
removeSection(sectionId)
reorderSections(activeId, overId)
duplicateSection(sectionId)

// Data
updateSectionProps(sectionId, props)
updateSectionStyle(sectionId, style)
updateElementValue(sectionId, path, value)

// Selection
selectSection(sectionId)
selectElement(sectionId, path)
startInlineEdit(sectionId, path, bounds)
stopInlineEdit()

// History
undo()
redo()

// Grid
addColumn(sectionId)
removeColumn(sectionId, columnId)
addWidgetToColumn(sectionId, columnId, widget)
```

### Database Queries

```sql
-- Get page by URL
SELECT * FROM pages WHERE page_url = 'vps-hosting';

-- Get page translations
SELECT * FROM page_translations WHERE page_id = '...' AND language_id = '...';

-- Get translation coverage
SELECT * FROM translation_coverage_stats WHERE page_id = '...';
```

---

*This documentation reflects the system as of January 2025. For updates, check the repository's CHANGELOG.md.*
