# V2 Section Integration — Anima Export to Builder Block

You are integrating Anima-exported React/TypeScript sections into an existing
website builder. The builder is modular with many interconnected systems.

GOLDEN RULE: When this prompt contradicts the actual code in the repository,
ALWAYS follow the repository. The code is the source of truth.

CRITICAL RULES:
- You MUST complete Phase 1 (analysis) BEFORE writing any code.
- You MUST NOT modify any existing component, hook, type, or registry entry
  (except the designated insertion points listed in Phase 3).
- You MUST NOT add new npm dependencies. Use only what is already installed.
- You MUST NOT create preview/staging pages. Only create builder blocks.
- If a section type string already exists in the SectionType union, STOP and
  report the conflict. Do not overwrite.

---

## PHASE 1: Repository Analysis (MANDATORY)

Read ALL of the following files before proceeding. Do not skip any.

### Architecture (read every file)
1.  src/lib/sections/registry.ts         — registerSection() API
2.  src/lib/sections/types.ts            — SectionDefinition interface (all fields)
3.  src/lib/sections/index.ts            — barrel imports (add side-effect import here)
4.  src/types/pageEditor.ts              — SectionType union (add your type here)
5.  src/types/newSectionTypes.ts         — data interfaces for V2 sections
6.  src/types/baseSectionTypes.ts        — BaseSectionData, BaseSectionProps
7.  src/types/grid.ts                    — GridWidgetType union (add widget type here)
8.  src/lib/gridNormalizer.ts            — normalizationRules (EVERY SectionType MUST have entry)
9.  src/lib/sectionDndConfig.ts          — sectionDndRegistry for sortable arrays
10. src/components/editor/EditableElement.tsx  — inline editing wrappers
11. src/hooks/useArrayItems.tsx           — DnD hook for sortable arrays
12. src/components/editor/SortableItem.tsx     — sortable item wrapper
13. src/hooks/useLatestRef.ts            — useDataChangeHandlers for settings

### Reference Section (MANDATORY — read this complete set end-to-end)
Use this as your PRIMARY pattern source. Copy its patterns exactly:
- Definition:  src/lib/sections/definitions/v2-career-benefits2.ts
- Display:     src/components/design-v2/sections/V2CareerBenefits2Section.tsx
- Settings:    src/components/admin/sections/V2CareerBenefits2SettingsContent.tsx
- Interface:   the V2CareerBenefit2Item + V2CareerBenefits2SectionData in src/types/newSectionTypes.ts

Also read one section WITHOUT arrays for contrast:
- src/lib/sections/definitions/v2-career-cta.ts + its display + settings components

### Module Detection
Scan the repository for ALL systems that interact with section blocks.
Known systems include (but are NOT limited to):
- Drag-and-drop (SectionDndProvider, useArrayItems, SortableItem)
- Inline editing (EditableElement, EditableInline — sectionId + path)
- Translation/i18n (translatableProps in definition)
- Settings panel (settings component with useDataChangeHandlers)
- Theme/styling (CSS custom properties like var(--heading-h2-*))
- Grid normalization (normalizationRules — typed as Record<SectionType, ...>)
- SEO (semantic HTML, aria attributes)
- Rich text (RichTextRenderer)

If you discover additional systems, integrate with them.

### Pre-Flight Check
After analysis, before writing code:
1. List each section you will create (type string, display name)
2. Confirm the type string does NOT exist in SectionType union
3. Confirm no widget type collision in GridWidgetType
4. State which reference section you are copying patterns from

---

## PHASE 2: Anima Export Defects to Fix

Fix ALL of these common Anima problems:
- Absolute positioning for layout → replace with flex/grid
- Fixed pixel widths on containers → replace with max-w + responsive
- No responsive breakpoints → add mobile-first responsive classes
- Deeply nested wrapper divs → flatten to semantic HTML
- Inline styles → convert to Tailwind classes

PRESERVE these Anima patterns:
- External asset URLs from animaapp.com domains (intentional)
- CSS custom properties like var(--heading-h2-font-weight) (theme tokens)

---

## PHASE 3: Create Each Section (9-File Standard)

For EACH section, create or modify exactly these files. DO NOT invent
patterns — copy them from the reference section (V2CareerBenefits2).

### File 1: TypeScript Interface
Location: src/types/newSectionTypes.ts (append)

- Extend BaseSectionData
- Array item id type: match the reference section pattern exactly
- Export all interfaces

### File 2: SectionType Union
Location: src/types/pageEditor.ts
- Add type string BEFORE 'generic'. Convention: 'v2-{kebab-name}'

### File 3: GridWidgetType Union
Location: src/types/grid.ts
- Add widget type string. Convention: 'v2-{name}-item' or 'v2-{name}-widget'

### File 4: Display Component
Location: src/components/design-v2/sections/V2{PascalName}Section.tsx

CRITICAL — DO NOT write useArrayItems calls from memory. Read the actual
hook signature in src/hooks/useArrayItems.tsx and copy the exact calling
pattern from V2CareerBenefits2Section.tsx.

Rules:
- Named export AND default export (match reference pattern)
- Props: { data?: DataType; sectionId?: string; isEditing?: boolean }
- Destructure data fields with ?? fallbacks matching defaultProps
- useArrayItems MUST be the first hook called (no hooks before it)
- Wrap text in EditableElement/EditableInline with sectionId + path
- Array item paths: `arrayName.${index}.fieldName`
- Use SortableWrapper and getItemProps from useArrayItems return
- Semantic HTML with aria-labelledby, aria-hidden on decorative images
- dir="ltr" on absolute-positioned decorative elements (RTL protection)

Responsive layout (mandatory):
- Mobile-first: single column, px-4
- Tablet (md/lg): 2-column grid where appropriate
- Desktop (xl): full design fidelity
- Two-layer wrapper: outer w-full bg, inner max-w-[1920px] mx-auto + padding
- CSS Grid for multi-column, NEVER flex-wrap with calc
- Match the reference section's padding scale exactly

### File 5: Settings Component
Location: src/components/admin/sections/V2{PascalName}SettingsContent.tsx

- Named function export AND default export (match reference)
- Root div: className="space-y-6 p-3"
- useDataChangeHandlers(data, onChange) from src/hooks/useLatestRef.ts
- DebouncedInput for text fields (debounceMs={300})
- New items added at runtime: use id: crypto.randomUUID()

### File 6: Section Definition
Location: src/lib/sections/definitions/v2-{name}.ts

Call registerSection() — copy the EXACT field structure from the reference
definition file. Required fields:
- type, displayName, icon, category, component, settingsComponent
- defaultProps (complete, all fields populated)
- description, usesDataWrapper, pageGroup, pageGroupOrder
- translatableProps: use WILDCARD format ['items.*.field'] (not indexed)
- dndArrays: array configs matching sectionDndConfig format

### File 7: Registry Import
Location: src/lib/sections/index.ts
- Add: import './definitions/v2-{name}'; (alphabetical order)

### File 8: DnD Registry
Location: src/lib/sectionDndConfig.ts
- Add entry if section has sortable arrays
- Match strategy to layout: 'grid' for cards, 'vertical' for lists

### File 9: Normalization Rule (MANDATORY — TypeScript will fail without it)
Location: src/lib/gridNormalizer.ts
- Add entry to normalizationRules for your SectionType
- Copy structure from the closest existing V2 section entry
- Check usesDataWrapper by examining how props are passed to the component

---

## PHASE 4: Verification Gate

Before finishing, verify EVERY item:

 1. TypeScript compiles with zero errors
 2. Display component renders with only defaultProps (no external data)
 3. useArrayItems is the FIRST hook (if arrays exist)
 4. useArrayItems arguments match the actual hook signature
 5. All user-visible text wrapped in EditableElement/EditableInline
 6. Editable paths exactly match defaultProps keys
 7. Settings component updates all fields correctly
 8. Responsive at mobile (<640px), tablet (768px), desktop (1280px)
 9. No fixed pixel widths on layout containers
10. Semantic HTML with aria attributes
11. RTL-safe (decorative positioned elements locked with dir="ltr")
12. translatableProps uses wildcard format (items.*.field)
13. All 9 files created/modified
14. No console.log statements
15. CSS custom properties (var(--*)) preserved from Anima export
16. normalizationRules entry exists for every new SectionType
17. No existing files modified beyond designated insertion points
18. Both named and default exports on display and settings components

---

## ERROR HANDLING

- Section type already exists: STOP, report conflict, ask for rename
- File structure doesn't match expected pattern: STOP, report findings
- Anima export ambiguous about section boundaries: STOP, ask for clarification
- Hook/API signature differs from this prompt: FOLLOW THE CODE, not this prompt
