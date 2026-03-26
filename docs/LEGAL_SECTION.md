# Legal Layout Section

## Changelog
- **2026-03-23** — Add "Cancellation & Refunds Policy" legal item; extend `LegalContentSection` with `table` and `faq` fields; add `<LegalTable />` and `<FaqList />` sub-components to renderer; update render order to `heading → paragraphs → table → lists → faq → banner`
- **2026-03-23** — Refactor `LegalContentRenderer`: added JSDoc, `EditContext` interface, `editCtx` spread, `isSubSection` flag, `boldNestedTitles` prop, `noBox` on `BulletList`, `NestedListItem` intro detection, consecutive grey-box margin collapse, helper inline comment
- **2026-03-19** — Initial implementation: hash navigation, structured content renderer, settings cleanup

---

## Main Files

| File | Role |
|---|---|
| `src/lib/sections/definitions/legal.ts` | Registers the block in the panel, defines `defaultProps` (initial items on first drag & drop) |
| `src/hooks/useLegalSection.ts` | All state logic — hash reading, active item, content mapping |
| `src/components/design-v2/sections/LegalLayoutSection.tsx` | UI only — dark header + sidebar + content area |
| `src/components/design-v2/legal/LegalContentRenderer.tsx` | Renders structured content (headings, paragraphs, lists, tables, FAQs, banners) |
| `src/components/admin/sections/LegalSettingsContent.tsx` | Settings panel — edit/add/delete items |
| `src/content/legal/terms-and-conditions.ts` | Static content for Terms & Conditions |
| `src/content/legal/privacy-policy.ts` | Static content for Privacy Policy |
| `src/content/legal/cookie-policy.ts` | Static content for Cookie Policy |
| `src/content/legal/cancellation-refunds-policy.ts` | Static content for Cancellation & Refunds Policy |
| `src/types/newSectionTypes.ts` | Type definitions (`LegalItem`, `LegalLayoutSectionData`, `LegalContentSection`) |

---

## Flow

1. **Page load** → `getSlugFromHash()` reads `window.location.hash` → sets `activeSlug`
2. **Sidebar click** → `handleItemClick(slug)` → sets `window.location.hash` + `setActiveSlug`
3. **Browser back/forward** → `hashchange` event → `setActiveSlug` updates
4. **Active item resolves** → `LEGAL_CONTENT_MAP[slug]` returns structured sections
5. **Render** → `LegalContentRenderer` for structured content + `item.content` appended below (admin extra text)
6. **No content yet** → `item.content` plain text field from settings panel as fallback

---

## Adding a New Legal Document

1. Create `src/content/legal/[slug].ts` with `LegalContentSection[]`
2. Import and add to `LEGAL_CONTENT_MAP` in `useLegalSection.ts`
3. Add default item to `DEFAULT_ITEMS` in `useLegalSection.ts`
4. Add item to `defaultLegalProps.items` in `legal.ts`

---

## LegalContentRenderer Internals

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `sections` | `LegalContentSection[]` | — | Array of content sections to render |
| `sectionId` | `string?` | — | Passed to `EditableElement` / `EditableInline` for in-place editing |
| `itemIndex` | `number` | `0` | Index of the legal item — used to build the edit `basePath` |
| `className` | `string` | `''` | Extra classes on the outer wrapper |
| `boldNestedTitles` | `boolean` | `false` | Enables bold `Key: value` rendering in nested bullet lists |

### Sub-components

| Component | Role |
|---|---|
| `<PlainList />` | Non-bulleted key-value list; bold key when `": "` is present |
| `<NestedListItem />` | Single bullet that may expand into intro paragraph + nested sub-bullets |
| `<BulletList />` | Bulleted list, optionally wrapped in a grey left-border box |
| `<LegalTable />` | Bordered table; first column narrow; cells support `string` (single para) or `string[]` (multi-para) |
| `<FaqList />` | Static FAQ rows — question text + `ChevronDown` icon; no interactivity, no answers |

### Helper functions

| Function | Behaviour |
|---|---|
| `renderText(text)` | Highlights `[[text]]` spans in primary-800 green; returns plain string if none present |
| `renderBoldColon(text, boldClass?, restClass?)` | Splits `"Key: value"` — bold key, plain value; falls back to `renderText` if no `": "` found |

### EditContext

A shared interface `{ sectionId?, basePath, sectionIndex }` is defined once and spread into all three sub-components via `editCtx`, avoiding repetitive prop drilling.

### Section rendering logic

- **`isSubSection`** — sets `gap-2` (vs `gap-5`) and renders the heading as `text-base font-bold` (vs `text-2xl font-medium`)
- **Consecutive grey boxes** — when both the current and previous section are grey-box list sections (no heading, no banner), `−mt-8` collapses the visual gap between them so they appear as one continuous block
- **`NestedListItem` intro detection** — if the first `subItem` ends with `:`, or if `boldTitles` is on and there is exactly one sub-item, that first sub-item is rendered as an intro `<p>` rather than a bullet point
