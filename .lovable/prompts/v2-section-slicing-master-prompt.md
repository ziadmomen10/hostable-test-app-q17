# V2 Section Slicing & Block Integration — Master Prompt

**Version:** 2.0 (Gap-corrected, codebase-verified)
**Context ID:** 8F42B1C3-5D9E-4A7B-B2E1-9C3F4D5A6E7B

---

## How to Use

Paste the entire prompt block below at the start of any new V2 section slicing task, then immediately follow it with:

```
The section to integrate is: [SectionName]
Source file: src/components/design-v2/sections/[FileName].tsx
Anima asset base URL: https://c.animaapp.com/[projectId]/img/
pageGroupOrder: [N]  (existing V2 sections occupy orders 1=Business Suite, 2=Hosting Options, 3=Benefits — use the next number)
```

---

## THE PROMPT

```
You are a senior front-end engineer. Your task is to take a static V2 React/Tailwind
section component and fully integrate it into the visual page builder as a
production-ready, reusable block.

The output must pass a 12-point verification gate with ZERO follow-up changes needed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — SYSTEM TERMINOLOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In the UI, registered sections are shown to users as "blocks" in the Block Library.
In code, they are called "sections." These terms are synonymous in this codebase.
Always name new section types with the prefix: v2-[kebab-name]
Examples: v2-hero, v2-pricing, v2-navbar, v2-footer
The value 'generic' is a RESERVED sentinel — never use it as a section type.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — THE 9 FILES (ALL REQUIRED, NO EXCEPTIONS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE 1 — src/types/newSectionTypes.ts
  Add TypeScript interfaces for the section's data shape.
  All interfaces must extend or compose from base types as needed.

FILE 2 — src/lib/sections/definitions/[v2-section-name].ts
  Register the section via registerSection().

FILE 3 — src/components/design-v2/sections/[SectionName].tsx  [DISPLAY]
  The visual component rendered in the builder canvas and on the live page.
  MUST use a NAMED export: export const MySectionName = ...

FILE 4 — src/components/admin/sections/[SectionName]SettingsContent.tsx  [SETTINGS]
  The settings panel rendered in the right sidebar of the editor.
  MUST use a DEFAULT export: export default MySettingsContent
  (Also add a named export for type inference if needed, but default is mandatory.)

FILE 5 — src/lib/sections/index.ts
  Add the side-effect import at the bottom of the import list:
  import './definitions/v2-[section-name]';

FILE 6 — src/types/pageEditor.ts
  Add the new type to the SectionType union, inside the V2 Design comment block:
  | 'v2-[section-name]'
  ADD ONLY TO SectionType. Do NOT touch the SectionData union — it is frozen legacy code.
  WARNING: After adding here, TypeScript will immediately error on FILE 9 (gridNormalizer.ts)
  until you add the matching normalizationRules entry. Both files must be updated together.

FILE 7 — src/lib/sectionDndConfig.ts
  If the section HAS sortable arrays: add an entry to sectionDndRegistry.
  If the section has NO sortable arrays (e.g. positional bento layouts): do NOT add any
  entry at all — simply omit the section. Never add an entry with arrays: [] as this
  causes hasDndSupport() to return true incorrectly.

  Format for sections WITH sortable arrays:
  'v2-[section-name]': {
    arrays: [{ path: 'arrayName', strategy: 'grid', handlePosition: 'top-left' }]
  },

  strategy values: 'grid' | 'horizontal' | 'vertical'
  handlePosition values: 'top-left' | 'top-right' | 'left'

FILE 8 — src/types/grid.ts
  Add the new widget type string(s) to the GridWidgetType union.
  This MUST be done BEFORE editing FILE 9 to avoid TypeScript errors.
  Add inside the V2 Design comment block:
  | 'v2-[item-name]'

FILE 9 — src/lib/gridNormalizer.ts
  Add a normalizationRules entry inside the Record<SectionType, NormalizationRule>.
  Place it before the 'generic' sentinel entry at the bottom.

  Template:
  'v2-[section-name]': {
    sectionType: 'v2-[section-name]',
    arrayPaths: [
      {
        arrayPath: 'items',            // must match array key in defaultProps
        widgetType: 'v2-[item-name]', // must already exist in GridWidgetType (FILE 8)
        columnDistribution: 3,         // target desktop columns (number or 'auto' or 'single')
      }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle'], // all non-array field keys in defaultProps
    usesDataWrapper: true,             // always true for V2 sections
  },

  For sections with NO arrays (pure layout/text sections):
  'v2-[section-name]': {
    sectionType: 'v2-[section-name]',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badge', 'title', 'subtitle', /* all fields */],
    usesDataWrapper: true,
  },

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3 — DEFINITION FILE RULES (FILE 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Exact import block (do not deviate):
  import { SomeIcon } from 'lucide-react';
  import { MySectionComponent } from '@/components/design-v2/sections/MySectionComponent';
  import MySettingsContent from '@/components/admin/sections/MySettingsContent';
  import { registerSection, createSettingsWrapper } from '../registry';

registerSection() MUST include ALL fields:

  type           — 'v2-[kebab-name]' — unique, never reuse an existing value
  displayName    — Human-readable, shown in Block Library (e.g., 'V2 Business Suite')
  icon           — A Lucide icon import
  category       — Use: 'commerce' for service/product sections
                         'content' for feature/benefit/about sections
                         'layout' for hero/navbar/footer sections
  component      — The named-export display component (FILE 3)
  settingsComponent — createSettingsWrapper(MySettingsContent) — uses the DEFAULT export (FILE 4)
  defaultProps   — Complete flat object with ALL fields populated.
                   Use real copy from the Figma/Anima design, not placeholder text.
                   This IS the data object that the component receives as { data }.
                   Do NOT wrap it in { data: {...} } — the system handles that.
  description    — One sentence describing what the block renders
  usesDataWrapper — Always true for V2 sections
  pageGroup      — Always 'V2 Design' for V2 sections
  pageGroupOrder — Integer. Existing V2 orders: 1=Business Suite, 2=Hosting Options, 3=Benefits.
                   Use the next sequential number.
  translatableProps — Complete list of ALL user-facing string field paths.
                   For top-level fields: 'title', 'badge', 'subtitle'
                   For array items: 'items.*.title', 'items.*.description'
                   List EVERY user-facing string. Do not omit any.
  dndArrays      — Array of { path, strategy, handlePosition } for each sortable array.
                   Use [] if there are no sortable arrays (e.g., positional bento grids).
                   This field is metadata. Actual DnD runtime requires FILE 7 entry too.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4 — DISPLAY COMPONENT RULES (FILE 3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.1 — MANDATORY IMPORTS

  import React from 'react';
  import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
  import { SortableItem } from '@/components/editor/SortableItem';
  import { useArrayItems } from '@/hooks/useArrayItems';

  SortableWrapper is NOT a standalone import — it is destructured FROM useArrayItems.
  Do NOT import SortableWrapper from anywhere else.

4.2 — HOOK ORDER: useArrayItems MUST BE THE FIRST HOOK CALLED

  // ✅ CORRECT
  export const MySectionName = ({ data, sectionId }: MySectionProps) => {
    const { items, getItemProps, SortableWrapper } = useArrayItems('items', data?.items);
    const [someState, setSomeState] = useState(false);  // other hooks after
    ...
  }

  // ❌ WRONG — any hook before useArrayItems will break the builder
  export const MySectionName = ({ data, sectionId }: MySectionProps) => {
    const [someState, setSomeState] = useState(false);
    const { items, getItemProps, SortableWrapper } = useArrayItems('items', data?.items);
    ...
  }

  If the section has no sortable arrays, still call useArrayItems first:
  const { SortableWrapper } = useArrayItems('items', data?.items ?? []);
  (The hook auto-disables DnD when the array has no entry in sectionDndRegistry.)

4.3 — useArrayItems RETURN VALUES

  const {
    items,           // T[] — the safe, always-defined array (never undefined)
    itemIds,         // string[] — auto-generated IDs for SortableContext
    isEnabled,       // boolean — true only in editor mode with DnD configured
    handlePosition,  // HandlePosition — from the DnD config
    getItemProps,    // (index: number) => props object — ONE argument only, no item.id
    SortableWrapper, // React.FC<{children}> — wraps the array container
  } = useArrayItems('arrayPath', data?.arrayField);

  CRITICAL: getItemProps takes ONE argument: the numeric index.
  getItemProps(index)            ✅ correct
  getItemProps(index, item.id)   ❌ TypeScript error — this overload does not exist

4.4 — DATA ACCESS PATTERN

  V2 sections receive props: { data, sectionId, isEditing }
  The data object IS the defaultProps object defined in FILE 2.
  Always access via: data?.fieldName ?? 'Fallback default'
  Never use hardcoded strings in JSX that should be user-editable.
  Never access data.fieldName without optional chaining — data can be undefined on first render.

4.5 — EDITABLE ELEMENTS

  Use EditableInline for short single-line text: badges, labels, prices, short titles
  Use EditableElement for block-level text: h1-h6 headings, paragraph descriptions

  Rules:
  - The path= attribute MUST exactly match the key path in defaultProps and in FILE 2
  - Top-level fields: path="title"
  - Array item fields: path={`items.${index}.description`}
  - Always specify as= for semantic HTML on EditableElement: as="h2", as="p", etc.
    Without as=, the default is <div>, which is semantically wrong for headings.
  - Add sectionId={sectionId} to every editable element
  - Do NOT wrap decorative/non-editable text in EditableElement

4.6 — SORTABLE ARRAY PATTERN

  <SortableWrapper>          {/* From useArrayItems — wraps the grid/list container */}
    {items.map((item, index) => (
      <SortableItem          {/* From '@/components/editor/SortableItem' */}
        key={`${sectionId}-items-${index}`}
        {...getItemProps(index)}
      >
        {/* Visible card content goes here */}
        <article className="...">
          <EditableElement as="h3" sectionId={sectionId} path={`items.${index}.title`}>
            {item.title}
          </EditableElement>
        </article>
      </SortableItem>
    ))}
  </SortableWrapper>

  Only use SortableWrapper/SortableItem for arrays that ARE in sectionDndRegistry (FILE 7).
  For positional bento grids where reordering would break layout: do NOT use SortableWrapper.

4.7 — OUTER WRAPPER PATTERN (MANDATORY FOR ALL V2 SECTIONS)

  Every V2 section MUST use this exact two-layer structure:

  <section className="w-full bg-[color]">                           {/* OUTER — bg only */}
    <div className="flex flex-col w-full max-w-[1920px] mx-auto    {/* INNER — layout */}
                    items-center gap-10 md:gap-14
                    py-12 md:py-20
                    px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
      ...content
    </div>
  </section>

  The outer <section> carries ONLY the background color and w-full.
  NEVER put max-w or mx-auto on the outer <section>.
  This ensures edge-to-edge backgrounds render correctly at all screen widths.

4.8 — RTL SAFETY

  Apply dir="ltr" to any element that uses:
  - Absolute pixel coordinate positioning (top-[X], left-[X], right-[X])
  - CSS transform: translate() for layout (not for centering text)
  - Fixed-pixel widths for layout shells (not for content widths)

  This protects coordinate-dependent layouts from mirroring in Arabic/Hebrew modes.
  Semantic text content should remain directionality-inherited (do not lock text nodes).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5 — RESPONSIVE LAYOUT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These rules encode every responsive failure discovered during V2 section integration.
Read every rule. Apply all that are relevant to the section being built.

RULE R1 — Mobile-first stack (always)
  Default (no breakpoint prefix): single column, all items full-width (w-full).
  No horizontal constraints at base breakpoint. No side-by-side layout before md:.

RULE R2 — Tablet layout: always use CSS Grid, never flex-wrap with calc()
  CORRECT:  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
  WRONG:    <div className="flex flex-wrap gap-6">
               <div className="w-full md:w-[calc(50%-12px)]">

  The calc() approach breaks at intermediate canvas widths inside the editor panel.
  CSS Grid is deterministic regardless of parent constraints.

RULE R3 — Desktop breakpoint selection for complex or fixed-width layouts
  The editor canvas panel is typically 700–850px wide. This is BELOW the lg: (1024px)
  threshold but close enough that scaled/fixed-pixel desktop layouts will overflow.

  IF the desktop layout uses CSS transform: scale(), or places 5+ items in a fixed-pixel
  row, use xl: (1280px) as the ACTIVATION breakpoint, NOT lg: (1024px).

  Pattern:
    <div className="hidden xl:block">  {/* desktop scaled layout */}
    <div className="xl:hidden">        {/* mobile/tablet grid fallback */}

  This ensures the editor canvas (which is typically below xl) shows the clean
  grid fallback instead of an overflowing fixed-width desktop layout.

  For standard 2–4 column grids that naturally fit at lg:, using lg: is fine.

RULE R4 — Bento/asymmetric grids: always CSS Grid with col-span
  NEVER use flex-wrap with two different calc() widths for a bento layout.

  Standard V2 bento pattern:
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6
                  lg:gap-x-[38px] lg:gap-y-[40px] w-full">
    {/* Wide card — 60% of desktop row */}
    <article className="col-span-1 md:col-span-1 lg:col-span-3 h-[300px] md:h-[350px] lg:h-[400px] ..." />
    {/* Narrow card — 40% of desktop row */}
    <article className="col-span-1 md:col-span-1 lg:col-span-2 h-[350px] lg:h-[399px] ..." />
    {/* Full-width card */}
    <article className="col-span-1 md:col-span-2 lg:col-span-5 h-[180px] lg:h-[201px] ..." />
  </div>

  col-span-3 on a 5-column grid = 60%. col-span-2 = 40%. No calc() needed.

RULE R5 — Cards with absolute-positioned content
  Every such card MUST have:
  - article element: position: relative (class 'relative') + explicit h-[Npx] at every breakpoint
  - Content container: z-10 to layer above background images
  - Mobile centering: top-1/2 -translate-y-1/2 for vertical centering
  - Desktop override: lg:top-[Xpx] lg:translate-y-0 for pixel-exact desktop placement
  - Background image: z-0 (or just omit z — it defaults below z-10)

RULE R6 — Background image focal point
  Set object-position WITHOUT breakpoint prefix to show the correct zone at ALL viewports.
  IF the key visual (UI mockup, product shot) is at top-left: use object-left-top
  IF the subject is centered: use object-center
  NEVER write lg:object-left-top — this means mobile shows the wrong zone.

  <img className="absolute inset-0 w-full h-full object-cover object-left-top" />

RULE R7 — Grid row heights: let CSS Grid handle them
  In a CSS Grid layout, items in the same row auto-match height.
  NEVER add min-h to individual grid items — it creates height mismatches.
  Remove min-h from CTA/BrowseAll cards — let the grid control row height.

RULE R8 — Text overflow in card titles
  NEVER use whitespace-nowrap on card titles.
  Long product names ("Dedicated Hosting", "WordPress Hosting") will overflow.
  Allow natural text wrapping on all titles. Use truncation only if single-line
  is a hard design requirement AND the container has a known fixed width.

RULE R9 — Mobile decoration for visually-rich cards
  If a card's desktop decoration uses hidden lg:block with large absolutely-positioned
  elements, there MUST be a simplified mobile alternative.
  The mobile alternative MUST NOT use top-1/2 — it will overlap bottom-aligned text.
  Use: absolute top-[20%] left-1/2 -translate-x-1/2 flex items-center gap-4

  Pattern:
    {/* Desktop: complex decoration */}
    <div className="hidden lg:block absolute top-14 left-[-565px] w-[1492px] h-[1095px]">
      ...large decoration...
    </div>
    {/* Mobile: simplified icon row */}
    <div className="lg:hidden absolute top-[20%] left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-70">
      <img className="w-10 h-10" src="..." alt="" role="presentation" />
      <img className="w-10 h-10" src="..." alt="" role="presentation" />
    </div>

RULE R10 — CSS Transform scale() layouts
  When using transform: scale() for proportional card display:
  - The scale container must have overflow-hidden
  - The section header MUST be a sibling BEFORE the overflow-hidden container,
    both inside a shared relative wrapper — NOT inside overflow-hidden
  - Calibrate scale factors per breakpoint to prevent overflow:
      xl:scale-[0.646]  2xl:scale-[0.782]  min-[1700px]:scale-[1.0]
  - The fixed-size inner element must define its own w-[Npx] h-[Npx] explicitly
  - Container min-h = (cardHeight × scaleFactor) + (2 × paddingPx) at each breakpoint
  - Apply dir="ltr" to every scaled card interior

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6 — SETTINGS COMPONENT RULES (FILE 4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6.1 — Exact import block:
  import React, { useCallback } from 'react';
  import { SomeIcon } from 'lucide-react';
  import { SectionHeaderFields, ItemListEditor } from '@/components/admin/sections/shared';
  import { DebouncedInput } from '@/components/ui/debounced-input';
  import { Label } from '@/components/ui/label';
  import { useDataChangeHandlers } from '@/hooks/useLatestRef';
  import type { MySectionData, MyItemType } from '@/types/newSectionTypes';

6.2 — Outer wrapper:
  <div className="space-y-6 p-3">   ← exactly p-3, not p-4 or p-6

6.3 — Data change handler (mandatory, prevents stale closure bugs):
  const { updateField, updateArray, updateFields, dataRef } = useDataChangeHandlers(data, onChange);

  Available handlers:
  updateField('key', value)             — update a single field
  updateArray('key', newArray)          — replace an entire array
  updateFields({ key1: v1, key2: v2 }) — update multiple fields atomically
  dataRef.current                       — always-fresh reference to current data

6.4 — SectionHeaderFields for standard header:
  <SectionHeaderFields
    badge={data.badge}
    title={data.title}
    subtitle={data.subtitle}          // include only if section has subtitle
    onBadgeChange={(v) => updateField('badge', v)}
    onTitleChange={(v) => updateField('title', v)}
    onSubtitleChange={(v) => updateField('subtitle', v)}
    showBadge={!!data.badge}
    onShowBadgeChange={(show) => updateField('badge', show ? 'BADGE TEXT' : undefined)}
  />

6.5 — ItemListEditor for arrays:
  <ItemListEditor
    items={data.items || []}
    onItemsChange={(items) => updateArray('items', items)}
    createNewItem={() => ({
      id: crypto.randomUUID(),  // ← REQUIRED for DnD — never omit
      title: 'New Item',
      description: '',
      // ...all required fields with reasonable defaults
    })}
    getItemTitle={(item: MyItemType) => item.title || 'Untitled'}
    getItemIcon={() => <SomeIcon className="h-3 w-3 text-primary" />}
    minItems={1}
    maxItems={8}                // adjust to match design constraints
    addItemLabel="Add Item"
    collapsible
    confirmDelete
    renderItem={(item, _index, onUpdate) => (
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Title</Label>
          <DebouncedInput
            value={item.title}
            onChange={(v) => onUpdate({ title: v })}
            placeholder="e.g., My Item"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
        {/* For multi-line text (descriptions): */}
        <div className="space-y-1.5">
          <Label className="text-xs">Description</Label>
          <DebouncedInput
            value={item.description}
            onChange={(v) => onUpdate({ description: v })}
            placeholder="Short description..."
            className="text-xs"
            debounceMs={300}
            multiline
            rows={2}
          />
        </div>
        {/* For image URL fields: */}
        <div className="space-y-1.5">
          <Label className="text-xs">Image URL</Label>
          <DebouncedInput
            value={item.imageUrl}
            onChange={(v) => onUpdate({ imageUrl: v })}
            placeholder="https://..."
            className="h-8 text-xs"
            debounceMs={300}
          />
          {item.imageUrl && (
            <img src={item.imageUrl} className="w-full h-20 object-contain rounded border mt-1" alt="" />
          )}
        </div>
      </div>
    )}
  />

6.6 — Export rules (CRITICAL):
  Display components (FILE 3): named export
    export const V2MySectionName = ...

  Settings components (FILE 4): default export (named export optional)
    const V2MySectionSettingsContent = ...
    export default V2MySectionSettingsContent;

  Definition file imports (FILE 2):
    import { V2MySectionName } from '@/components/design-v2/sections/V2MySectionName';
    import V2MySectionSettingsContent from '@/components/admin/sections/V2MySectionSettingsContent';

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7 — EXECUTION ORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Execute in this exact order. The order matters due to TypeScript dependencies.

STEP 1 — Read the source component fully before writing any code.
  Identify: all text nodes (→ translatableProps), all image URLs (→ defaultProps),
  all arrays (→ dndArrays + sectionDndRegistry), all colors, all breakpoint layouts,
  all absolutely-positioned elements (→ responsive rules to apply).

STEP 2 — Choose the responsive strategy:
  Does the desktop layout use scale() or 5+ fixed-pixel items in a row?
    YES → use xl: not lg: as the desktop breakpoint (Rule R3)
  Is there a bento grid (2 different column widths side-by-side)?
    YES → use CSS Grid col-span (Rule R4)
  Are there background images with off-center subjects?
    YES → confirm object-position without breakpoint prefix (Rule R6)
  Are there cards with absolutely-positioned content?
    YES → confirm relative + explicit height + z-10 on content (Rule R5)

STEP 3 — Write TypeScript interfaces in src/types/newSectionTypes.ts (FILE 1)
  Include every field. Mark optional fields with ?.
  Export all interfaces.

STEP 4 — Write the settings component (FILE 4)
  Follow Section 6 exactly. Verify every defaultProps field has a settings control.
  Use default export.

STEP 5 — Write the display component (FILE 3)
  Apply ALL rules from Section 4. Apply ALL applicable rules from Section 5.
  useArrayItems MUST be the first hook.
  Every user-facing string wrapped in EditableInline or EditableElement.
  Every background image has correct object-position (no breakpoint prefix for focal point).
  Every absolute-positioned content block has z-10.
  dir="ltr" applied to all coordinate-dependent layout shells.
  Two-layer section wrapper: outer bg-only, inner max-w-[1920px] with padding.
  Use named export.

STEP 6 — Write the definition file (FILE 2)
  defaultProps must copy ALL text content exactly from what you wrote in STEP 5.
  translatableProps must list EVERY user-facing string field including array wildcards.
  dndArrays must match what you will register in FILE 7.

STEP 7 — Add the import to src/lib/sections/index.ts (FILE 5)
  import './definitions/v2-[section-name]';

STEP 8 — Add to SectionType union in src/types/pageEditor.ts (FILE 6)
  Add inside the Phase 7 / V2 Design comment block.
  Do NOT touch the SectionData union.
  After this edit, TypeScript will error on gridNormalizer.ts — proceed immediately to STEP 9.

STEP 9 — Add GridWidgetType in src/types/grid.ts (FILE 8)
  Add to the GridWidgetType union inside the V2 Design comment block.
  This MUST be done before STEP 10.

STEP 10 — Add normalizationRules entry in src/lib/gridNormalizer.ts (FILE 9)
  Use the template from Section 2 FILE 9.
  Place BEFORE the 'generic' sentinel entry.
  widgetType values must already exist in GridWidgetType (done in STEP 9).

STEP 11 — Register in sectionDndRegistry in src/lib/sectionDndConfig.ts (FILE 7)
  If section has sortable arrays: add entry to sectionDndRegistry.
  If no sortable arrays: leave the file unchanged.

STEP 12 — Run the 12-point verification gate (Section 8).
  Do NOT declare the task complete until all 12 checks pass.
  If any check fails, fix it before moving to the next check.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8 — 12-POINT VERIFICATION GATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All 12 must pass. Zero exceptions.

CHECK 1 — RENDERING
  Add the section from Block Library in the editor.
  Confirm it renders in the canvas without console errors.

CHECK 2 — BLOCK LIBRARY GROUPING
  Confirm the section appears under the 'V2 Design' accordion group.
  Confirm pageGroupOrder places it in the correct position within the group.

CHECK 3 — SETTINGS PANEL
  Click the section in the editor canvas.
  Confirm the right sidebar shows the correct settings fields.
  Edit a text field — confirm the canvas updates in real time with no lag.

CHECK 4 — INLINE EDITING
  Hover over each editable text element in the canvas.
  Confirm the edit overlay (dashed border) appears on hover.
  Confirm the path= values in each EditableElement match:
    (a) the key in defaultProps
    (b) the field label in the settings panel
  These three must be in sync.

CHECK 5 — DnD REORDERING
  If sectionDndRegistry has an entry for this section:
    Hover over a card — confirm the drag handle appears.
    Drag one card to a new position — confirm it reorders.
    Reload the page — confirm the reorder persisted.
  If section has no DnD entry: confirm no drag handles appear.

CHECK 6 — TRANSLATION KEYS
  After saving the page, reload the editor and open the Translations tab.
  Count the keys — must match the total number of unique translatable strings
  listed in translatableProps (counting each array item field × item count).
  No key should be missing. No key should be duplicated.

CHECK 7 — AUTOSAVE PERSISTENCE
  Edit a field in the settings panel. Wait 3 seconds. Reload the page.
  Confirm the edited content is preserved — not reverted to defaultProps.

CHECK 8 — MOBILE VIEWPORT (375px)
  Resize the canvas to 375px (or use mobile preview toggle).
  Confirm: no horizontal scroll, no clipped text, no overflowing elements,
  no cards taller than the viewport, no overlapping UI elements.
  Confirm all background images show the correct focal region.
  Confirm mobile decorations don't overlap card title/description text.

CHECK 9 — TABLET VIEWPORT (768px)
  Resize to 768px. Confirm the 2-column grid layout activates correctly.
  Confirm all cards have equal heights within each grid row (CSS Grid auto-match).
  Confirm no text overflows its card container.

CHECK 10 — DESKTOP VIEWPORT (1280px)
  Resize to 1280px (xl breakpoint). Confirm full desktop layout activates.
  Confirm no horizontal overflow. Confirm all absolutely-positioned text content
  is visible above background images (z-10 working).
  Confirm bento col-span proportions match the design.

CHECK 11 — RTL LAYOUT
  Switch the editor language to Arabic or Hebrew.
  Confirm all semantic text (headings, descriptions) aligns right.
  Confirm all coordinate-dependent card layouts (scale rows, absolute-positioned
  content blocks) remain visually intact — protected by dir="ltr" on layout shells.

CHECK 12 — LIVE PAGE RENDER
  Open the live/staging page in a new browser tab.
  Confirm the section renders identically to the editor canvas.
  Confirm no 'Unknown section type' warning appears in the browser console.
  Confirm no translation loading flicker for the default language.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9 — FAILURE MODE REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FAILURE 1 — Cards render as a narrow pill, content overflows to the right
  Cause: flex-wrap with calc(50% - Npx) breaks at intermediate canvas widths
  Fix: Replace with CSS Grid — grid grid-cols-1 md:grid-cols-2

FAILURE 2 — Desktop layout clips inside the editor canvas
  Cause: lg: (1024px) used for a layout that is too wide for the ~750px editor canvas
  Fix: Change to xl: (1280px) — hidden xl:block / xl:hidden

FAILURE 3 — Text invisible behind background image
  Cause: Missing z-10 on content container
  Fix: Add z-10 to every content container inside cards that have background images

FAILURE 4 — Background image shows wrong region on mobile
  Cause: object-center or lg:object-left-top used when key content is at top-left
  Fix: Use object-left-top WITHOUT any breakpoint prefix

FAILURE 5 — Mobile decoration overlaps card title/description
  Cause: absolute top-1/2 -translate-y-1/2 places icons at vertical center,
         overlapping justify-end content at the bottom
  Fix: Change to absolute top-[20%] left-1/2 -translate-x-1/2

FAILURE 6 — Settings panel changes don't update the canvas
  Cause: Hardcoded string literal in JSX not bound to data?.field
  Fix: Every user-facing string must be data?.field ?? 'Fallback' and wrapped in
       EditableInline or EditableElement

FAILURE 7 — Translation tab shows fewer keys than expected
  Cause: Array item fields missing from translatableProps
  Fix: Add 'arrayName.*.fieldName' for every translatable field in every array

FAILURE 8 — DnD drag handles don't appear
  Cause: useArrayItems called after another hook (breaks hook order rule), OR
         section not registered in sectionDndRegistry (FILE 7)
  Fix: Ensure useArrayItems is the FIRST hook; ensure sectionDndRegistry has the entry

FAILURE 9 — Section header clipped by overflow-hidden container
  Cause: Header is inside the overflow-hidden container with negative top offset
  Fix: Place header as a sibling BEFORE the overflow-hidden container inside a shared relative wrapper

FAILURE 10 — TypeScript error "Type X is not assignable to type GridWidgetType"
  Cause: New widget type added to gridNormalizer.ts before adding to grid.ts
  Fix: Add to GridWidgetType in grid.ts FIRST, then reference in gridNormalizer.ts

FAILURE 11 — TypeScript error on normalizationRules (missing key)
  Cause: SectionType updated in pageEditor.ts but normalizationRules entry not yet added
  Fix: Both pageEditor.ts and gridNormalizer.ts must be updated together in the same edit

FAILURE 12 — DnD causes hasDndSupport() to return true unexpectedly
  Cause: Empty arrays: [] entry added to sectionDndRegistry for a section with no DnD
  Fix: Simply omit the section from sectionDndRegistry entirely

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 10 — QUALITY BAR (DEFINITION OF DONE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Done" means ALL of the following are true:
  - Pixel-accurate rendering at 375px, 768px, 1280px, and 1920px
  - Every user-facing string is editable without touching code
  - The section can be added, removed, reordered, translated without issues
  - Zero console warnings or errors in any viewport or language mode
  - A non-technical user can fully configure the section using only the
    settings panel and inline click-to-edit — zero code knowledge required
  - All 12 verification checks pass

"Mostly done" is not done. Do not declare the task complete early.
```

---

## Gap Assessment Summary — What Was Fixed in v2.0

| Issue | v1.0 (Draft) | v2.0 (This File) |
|---|---|---|
| `getItemProps` signature | `getItemProps(index, item.id)` — WRONG | `getItemProps(index)` — verified from source |
| `SortableWrapper` import | Ambiguous | Explicitly destructured from `useArrayItems`, NOT a standalone import |
| `sectionDndRegistry` rule | Unclear | Explicit: omit entirely if no DnD, never use `arrays: []` |
| `GridWidgetType` dependency | Not mentioned | STEP 9 must happen before STEP 10 |
| `SectionType` + `normalizationRules` | Not mentioned | Must be updated together — TypeScript errors until both done |
| Export pattern | Not specified | Named for display, default for settings — verified from codebase |
| `useDataChangeHandlers` returns | Partial list | Full: `updateField`, `updateArray`, `updateFields`, `dataRef` |
| `SectionData` union | Not addressed | Explicitly frozen — add to `SectionType` ONLY |
| `sectionDndConfig.ts` does NOT read `dndArrays` | Not stated | Explicitly stated — runtime DnD requires FILE 7 entry separately |
| `createNewItem` without `id` | Not specified | `id: crypto.randomUUID()` is REQUIRED for DnD |
| `DebouncedInput` `multiline` prop | Not mentioned | Documented for description fields |
| Category guidance | Vague | Specific: commerce / content / layout guidance added |
| `'generic'` reserved | Not mentioned | Explicitly stated as reserved sentinel |
| `pageEditor.ts` `SectionData` frozen | Not stated | Explicitly: Do NOT touch `SectionData` |
| `p-3` vs `p-4` ambiguity | Minor note | Verified: `p-3` is the standard |
| Object-position without breakpoint | In R6 | Reinforced with explicit correct/wrong example |
| Bento grid positional exclusion | Mentioned briefly | Fully explained with the v2-benefits example |
| RULE R3 canvas width claim | Incorrect ("ABOVE... wait") | Fixed: editor canvas is BELOW lg threshold |
