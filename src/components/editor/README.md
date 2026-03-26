# React Page Builder Architecture

## Overview

The React Page Builder is a visual page editor that allows users to create and edit pages using a component-based approach. It replaces the previous GrapesJS-based editor with a native React implementation for better performance, maintainability, and type safety.

## Directory Structure

```
src/
├── components/
│   ├── editor/                    # Core editor components
│   │   ├── EditorProvider.tsx     # Context provider for editor state
│   │   ├── EditorCanvas.tsx       # Main canvas rendering sections
│   │   ├── EditorToolbar.tsx      # Top toolbar with actions
│   │   ├── SectionList.tsx        # Left panel section list
│   │   ├── SectionRenderer.tsx    # Renders individual sections
│   │   ├── SectionWrapper.tsx     # Wrapper with edit controls
│   │   ├── SettingsPanel.tsx      # Right panel for section settings
│   │   ├── BlockLibrary.tsx       # Available section blocks
│   │   ├── TranslationPanel.tsx   # Translation management
│   │   └── index.ts               # Public exports
│   │
│   ├── admin/
│   │   ├── editor/                # Admin-specific editor components
│   │   │   ├── EditorToolbar.tsx  # Extended toolbar with translations
│   │   │   ├── LeftSidePanel.tsx  # Sections & blocks panel
│   │   │   ├── RightSidePanel.tsx # Settings & layers panel
│   │   │   ├── dialogs/           # Modal dialogs
│   │   │   └── index.ts
│   │   │
│   │   └── sections/              # Section settings components
│   │       ├── HeroSettingsContent.tsx
│   │       ├── PricingSettingsContent.tsx
│   │       ├── FAQSettingsContent.tsx
│   │       └── ... (other section settings)
│   │
│   └── landing/                   # Section display components
│       ├── HeroSection.tsx
│       ├── PricingSection.tsx
│       ├── FAQSection.tsx
│       └── ... (other sections)
│
├── hooks/
│   ├── queries/                   # React Query hooks
│   │   ├── usePageData.ts         # Page CRUD operations
│   │   ├── usePageMutations.ts    # Save/update mutations
│   │   ├── useAutosave.ts         # Autosave functionality
│   │   └── useLanguages.ts        # Language management
│   │
│   ├── useTranslationEngine.ts    # Translation management
│   └── useEditorTranslations.ts   # Editor-specific translations
│
├── types/
│   ├── pageEditor.ts              # Section data types
│   ├── reactEditor.ts             # Editor state types
│   └── newSectionTypes.ts         # Additional section types
│
└── pages/
    └── admin/
        └── AdminPageEditor.tsx    # Main editor page
```

## Core Concepts

### 1. Section-Based Architecture

Pages are composed of **sections**, each with:
- A unique `id`
- A `type` (e.g., 'hero', 'pricing', 'faq')
- A `data` object containing section-specific content
- A `visible` flag for show/hide

```typescript
interface PageSection {
  id: string;
  type: SectionType;
  data: Record<string, unknown>;
  visible: boolean;
}
```

### 2. Fully Controlled Components

All settings components follow the **fully controlled pattern**:

```typescript
interface SettingsContentProps<T> {
  data: T;                          // Data from parent
  onChange: (data: T) => void;      // Callback for changes
}

// Example: No internal useState for data
const HeroSettingsContent: React.FC<SettingsContentProps<HeroSectionData>> = ({
  data,
  onChange,
}) => {
  // Derive values directly from data
  const title = data.title;
  
  // Call onChange directly on user input
  const handleTitleChange = (value: string) => {
    onChange({ ...data, title: value });
  };
  
  return <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} />;
};
```

### 3. Single Source of Truth

The `ReactPageEditor` component owns all page state:

```typescript
const [sections, setSections] = useState<PageSection[]>([]);

// All changes flow through setSections
const handleSectionDataChange = (sectionId: string, newData: unknown) => {
  setSections(prev => prev.map(s => 
    s.id === sectionId ? { ...s, data: newData } : s
  ));
};
```

### 4. Section Registry

Sections are registered in `SectionRegistry.ts`:

```typescript
export const getSectionConfig = (type: SectionType) => ({
  type,
  name: sectionNames[type],
  defaultData: getDefaultData(type),
  SettingsComponent: getSettingsComponent(type),
  RenderComponent: getRenderComponent(type),
});
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ReactPageEditor                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              sections: PageSection[]                 │   │
│  └─────────────────────────────────────────────────────┘   │
│           │                              │                  │
│           ▼                              ▼                  │
│  ┌─────────────────┐          ┌──────────────────────┐    │
│  │  EditorCanvas   │          │   SettingsPanel      │    │
│  │                 │          │                      │    │
│  │ ┌─────────────┐ │          │ ┌──────────────────┐ │    │
│  │ │SectionRender│ │  select  │ │SettingsContent   │ │    │
│  │ │   (view)    │◄├──────────┤►│ (edit form)      │ │    │
│  │ └─────────────┘ │          │ └──────────────────┘ │    │
│  └─────────────────┘          └──────────────────────┘    │
│                                        │                   │
│                                        │ onDataChange      │
│                                        ▼                   │
│                               ┌──────────────────┐        │
│                               │  setSections()   │        │
│                               └──────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Adding a New Section

### Step 1: Define Types

```typescript
// src/types/pageEditor.ts
export interface MySectionData {
  title: string;
  items: Array<{ id: string; text: string }>;
}
```

### Step 2: Create Display Component

```typescript
// src/components/landing/MySection.tsx
export const MySection: React.FC<MySectionData> = ({ title, items }) => (
  <section className="py-16">
    <h2>{title}</h2>
    {items.map(item => <p key={item.id}>{item.text}</p>)}
  </section>
);
```

### Step 3: Create Settings Component

```typescript
// src/components/admin/sections/MySectionSettingsContent.tsx
interface Props {
  data: MySectionData;
  onChange: (data: MySectionData) => void;
}

export const MySectionSettingsContent: React.FC<Props> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <Input
        value={data.title}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
      />
      <ItemListEditor
        items={data.items}
        onChange={(items) => onChange({ ...data, items })}
      />
    </div>
  );
};
```

### Step 4: Register in SectionRegistry

```typescript
// src/components/admin/sections/SectionRegistry.ts
import { MySectionSettingsContent } from './MySectionSettingsContent';

// Add to type union
export type SectionType = '...' | 'my-section';

// Add default data
const defaultData = {
  'my-section': { title: 'New Section', items: [] },
};

// Add settings component mapping
const settingsComponents = {
  'my-section': MySectionSettingsContent,
};
```

## Translation System

The translation system uses a key-based approach:

```typescript
// Hook usage
const { translateKey, getTranslation } = useTranslationEngine();

// Translate a key to all languages
await translateKey({
  key: 'hero.title',
  sourceText: 'Welcome to our site',
  pageId: 'page-123',
});

// Get translation for display
const translatedTitle = getTranslation('hero.title', currentLanguage);
```

## Autosave

The editor uses debounced autosave:

```typescript
const { triggerSave, saveStatus } = useAutosave({
  pageId,
  sections,
  debounceMs: 2000,
  onSaveSuccess: () => toast.success('Saved'),
});

// Triggered automatically on sections change
useEffect(() => {
  triggerSave();
}, [sections]);
```

## Best Practices

1. **Never use internal state for section data** - Always derive from `data` prop
2. **Call `onChange` immediately** - Don't batch or delay updates
3. **Keep settings components focused** - One component per section type
4. **Use shared components** - `ItemListEditor`, `IconPicker`, `SectionHeaderFields`
5. **Type everything** - Use TypeScript interfaces for all data structures
6. **Test with multiple sections** - Ensure changes don't affect other sections

## Migration from GrapesJS

The new architecture removes:
- GrapesJS library and plugins
- HTML string manipulation
- Canvas iframe rendering
- Complex trait/attribute systems

Benefits:
- **50%+ smaller bundle** - No GrapesJS dependency
- **Type-safe** - Full TypeScript support
- **Faster rendering** - Native React components
- **Easier debugging** - Standard React DevTools
- **Simpler state** - Single source of truth
