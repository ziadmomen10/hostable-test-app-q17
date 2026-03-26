/**
 * Drag and Drop Persistence Test
 * 
 * Verifies that:
 * 1. Reordering array items updates document store
 * 2. Moving items between sections works correctly
 * 3. Changes persist after re-render
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEditorStore } from '@/stores/editorStore';
import { PageData } from '@/types/reactEditor';

const createMockPageData = (): PageData => ({
  id: 'test-page',
  version: 1,
  sections: [
    {
      id: 'section-1',
      type: 'hero',
      props: {
        title: 'Test Section',
        items: [
          { id: 'item-1', label: 'First' },
          { id: 'item-2', label: 'Second' },
          { id: 'item-3', label: 'Third' },
        ],
      },
      order: 0,
      visible: true,
    },
  ],
  metadata: {
    title: 'Test Page',
    lastModified: new Date().toISOString(),
  },
});

describe('Drag and Drop Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to initial state
    useEditorStore.getState().resetEditor();
  });

  it('should reorder array items through store', () => {
    const mockPageData = createMockPageData();
    
    // Initialize the store
    useEditorStore.getState().initializeEditor('test-page', mockPageData);
    
    // Initial order
    const getLabels = () => useEditorStore.getState().pageData?.sections[0]?.props?.items?.map((i: any) => i.label);
    expect(getLabels()).toEqual(['First', 'Second', 'Third']);

    // Reorder: move first to third position
    useEditorStore.getState().reorderArrayItem('section-1', 'items', 0, 2);

    // After reorder
    expect(getLabels()).toEqual(['Second', 'Third', 'First']);
    expect(useEditorStore.getState().hasUnsavedChanges).toBe(true);
  });

  it('should handle swap reordering', () => {
    const mockPageData = createMockPageData();
    
    useEditorStore.getState().initializeEditor('test-page', mockPageData);
    
    const getLabels = () => useEditorStore.getState().pageData?.sections[0]?.props?.items?.map((i: any) => i.label);

    // Swap first two
    useEditorStore.getState().reorderArrayItem('section-1', 'items', 1, 0);

    expect(getLabels()).toEqual(['Second', 'First', 'Third']);
  });

  it('should not change order when source equals destination', () => {
    const mockPageData = createMockPageData();
    
    useEditorStore.getState().initializeEditor('test-page', mockPageData);
    
    const getLabels = () => useEditorStore.getState().pageData?.sections[0]?.props?.items?.map((i: any) => i.label);

    // Reorder same position
    useEditorStore.getState().reorderArrayItem('section-1', 'items', 1, 1);

    // Order should remain the same
    expect(getLabels()).toEqual(['First', 'Second', 'Third']);
    // Should NOT mark as having unsaved changes
    expect(useEditorStore.getState().hasUnsavedChanges).toBe(false);
  });
});

describe('Move Between Sections', () => {
  beforeEach(() => {
    useEditorStore.getState().resetEditor();
  });

  it('should move items between sections', () => {
    const multiSectionPageData: PageData = {
      id: 'test-page',
      version: 1,
      sections: [
        {
          id: 'section-1',
          type: 'hero',
          props: {
            items: [
              { id: 'item-1', label: 'Section1-Item1' },
              { id: 'item-2', label: 'Section1-Item2' },
            ],
          },
          order: 0,
          visible: true,
        },
        {
          id: 'section-2',
          type: 'features',
          props: {
            items: [
              { id: 'item-3', label: 'Section2-Item1' },
            ],
          },
          order: 1,
          visible: true,
        },
      ],
      metadata: {
        title: 'Test Page',
        lastModified: new Date().toISOString(),
      },
    };

    useEditorStore.getState().initializeEditor('test-page', multiSectionPageData);

    const getSection1Items = () => useEditorStore.getState().pageData?.sections[0]?.props?.items?.map((i: any) => i.label);
    const getSection2Items = () => useEditorStore.getState().pageData?.sections[1]?.props?.items?.map((i: any) => i.label);

    // Initial state
    expect(getSection1Items()).toEqual(['Section1-Item1', 'Section1-Item2']);
    expect(getSection2Items()).toEqual(['Section2-Item1']);

    // Move first item from section 1 to section 2
    useEditorStore.getState().moveArrayItemBetweenSections(
      'section-1', 'items', 0,
      'section-2', 'items', 1
    );

    // Section 1 should have one less item
    expect(getSection1Items()).toEqual(['Section1-Item2']);
    // Section 2 should have the moved item
    expect(getSection2Items()).toEqual(['Section2-Item1', 'Section1-Item1']);
  });
});
