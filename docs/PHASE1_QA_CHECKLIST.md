# Phase 1: Selection & Inline Editing - QA Checklist

## Selection Tests
- [ ] Click on section border → section selected, settings panel shows section settings
- [ ] Click on editable text (e.g., Hero title) → element selected, blue overlay appears
- [ ] Hover over editable element → dashed hover border appears
- [ ] Click outside all elements → selection cleared
- [ ] Press Escape → clears selection

## Inline Editing Tests
- [ ] Double-click on selected text → enters inline edit mode (green border)
- [ ] Type new text → text updates in real-time
- [ ] Press Enter → saves text, exits inline edit
- [ ] Press Escape → cancels edit, restores original value
- [ ] Click outside → saves text, exits inline edit

## Settings Panel Tests
- [ ] Section selected → shows section settings component
- [ ] Element selected → shows element settings (value input, translation key, breadcrumb)
- [ ] Edit value in settings panel → updates canvas immediately
- [ ] Click "Edit Inline" button → starts inline editing on canvas

## Floating Toolbar Tests
- [ ] Element selected → floating toolbar appears above element
- [ ] Click Edit button → starts inline editing
- [ ] Click Duplicate → duplicates parent section
- [ ] Click Delete → deletes parent section (with confirmation)
- [ ] Click Move Up/Down → reorders section
- [ ] Click X → clears selection

## Visual Tests
- [ ] Selection overlay positions correctly on scroll
- [ ] Floating toolbar repositions on scroll
- [ ] Overlay updates when window resizes
- [ ] Hover overlay is dashed blue
- [ ] Selected overlay is solid blue with corner handles
- [ ] Inline edit overlay is solid green

## Files Created
- `src/stores/editorStore.ts` - Zustand store
- `src/components/editor/SelectionOverlay.tsx`
- `src/components/editor/FloatingToolbar.tsx`
- `src/components/editor/EditableText.tsx`
- `src/components/editor/ElementSettings.tsx`
- `src/hooks/useElementBounds.ts`
- `src/stores/__tests__/editorStore.test.ts`

## Files Modified
- `src/components/editor/EditorProvider.tsx` - Zustand sync
- `src/components/editor/EditorCanvas.tsx` - Element click detection
- `src/components/editor/SectionWrapper.tsx` - data-section-wrapper attribute
- `src/components/editor/SectionRenderer.tsx` - Pass sectionId to components
- `src/components/editor/SettingsPanel.tsx` - Element/section settings switch
- `src/components/editor/index.ts` - New exports
- `src/components/landing/HeroSection.tsx` - data-editable attributes
- `src/components/landing/FeaturesSection.tsx` - data-editable attributes
- `src/components/landing/PricingSection.tsx` - data-editable attributes
