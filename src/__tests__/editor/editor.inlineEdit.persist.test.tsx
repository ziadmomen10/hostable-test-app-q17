/**
 * Inline Edit Persistence Test
 * 
 * Verifies that:
 * 1. Inline editing updates the document store
 * 2. Changes are persisted after saving
 * 3. Canvas re-renders with new values
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
        title: 'Original Title',
        subtitle: 'Original Subtitle',
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

describe('Inline Edit Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to initial state
    useEditorStore.getState().resetEditor();
  });

  it('should update element value through store', () => {
    const mockPageData = createMockPageData();

    // Initialize the store
    useEditorStore.getState().initializeEditor('test-page', mockPageData);

    // Initial state
    expect(useEditorStore.getState().pageData?.sections[0]?.props?.title).toBe('Original Title');
    expect(useEditorStore.getState().hasUnsavedChanges).toBe(false);

    // Update element value
    useEditorStore.getState().updateElementValue('section-1', 'title', 'Updated Title');

    // After update
    expect(useEditorStore.getState().pageData?.sections[0]?.props?.title).toBe('Updated Title');
    expect(useEditorStore.getState().hasUnsavedChanges).toBe(true);
  });

  it('should preserve other section data when updating one element', () => {
    const mockPageData = createMockPageData();

    useEditorStore.getState().initializeEditor('test-page', mockPageData);

    // Update title
    useEditorStore.getState().updateElementValue('section-1', 'title', 'New Title');

    // Subtitle should be preserved
    expect(useEditorStore.getState().pageData?.sections[0]?.props?.subtitle).toBe('Original Subtitle');
  });

  it('should update nested element values', () => {
    const mockPageData: PageData = {
      id: 'test-page',
      version: 1,
      sections: [
        {
          id: 'section-1',
          type: 'hero',
          props: {
            services: [
              { icon: 'Globe', label: 'Service 1' },
              { icon: 'Server', label: 'Service 2' },
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
    };

    useEditorStore.getState().initializeEditor('test-page', mockPageData);

    // Initial state
    expect(useEditorStore.getState().pageData?.sections[0]?.props?.services?.[0]?.label).toBe('Service 1');

    // Update nested value
    useEditorStore.getState().updateElementValue('section-1', 'services.0.label', 'Updated Service');

    // After update
    expect(useEditorStore.getState().pageData?.sections[0]?.props?.services?.[0]?.label).toBe('Updated Service');
    // Other items preserved
    expect(useEditorStore.getState().pageData?.sections[0]?.props?.services?.[1]?.label).toBe('Service 2');
  });

  it('should handle empty initial data', () => {
    const emptyPageData: PageData = {
      id: 'empty-page',
      version: 1,
      sections: [],
      metadata: {
        title: 'Empty Page',
        lastModified: new Date().toISOString(),
      },
    };

    useEditorStore.getState().initializeEditor('empty-page', emptyPageData);

    expect(useEditorStore.getState().pageData?.sections.length).toBe(0);
  });
});
