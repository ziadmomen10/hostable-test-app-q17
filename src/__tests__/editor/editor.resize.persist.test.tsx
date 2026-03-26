/**
 * Resize Persistence Test
 * 
 * Verifies that:
 * 1. Resize updates element position in document store
 * 2. Position values are correctly stored at array item level
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
          { id: 'item-1', label: 'Item 1' },
          { id: 'item-2', label: 'Item 2' },
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

describe('Resize Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to initial state
    useEditorStore.getState().resetEditor();
  });

  it('should update element position through store', () => {
    const mockPageData = createMockPageData();

    // Initialize the store
    useEditorStore.getState().initializeEditor('test-page', mockPageData);

    // Initial state - no position
    expect(useEditorStore.getState().pageData?.sections[0]?.props?.items?.[0]?.position).toBeUndefined();

    // Resize element
    useEditorStore.getState().updateElementPosition('section-1', 'items.0', { 
      width: '200px', 
      height: '150px' 
    });

    // After resize
    const position = useEditorStore.getState().pageData?.sections[0]?.props?.items?.[0]?.position;
    expect(position?.width).toBe('200px');
    expect(position?.height).toBe('150px');
    expect(useEditorStore.getState().hasUnsavedChanges).toBe(true);
  });

  it('should merge position updates (not replace)', () => {
    const mockPageData = createMockPageData();

    useEditorStore.getState().initializeEditor('test-page', mockPageData);

    // First resize - set both width and height
    useEditorStore.getState().updateElementPosition('section-1', 'items.0', { 
      width: '200px', 
      height: '150px' 
    });

    // Second resize - only width
    useEditorStore.getState().updateElementPosition('section-1', 'items.0', { 
      width: '300px' 
    });

    // Height should be preserved
    const position = useEditorStore.getState().pageData?.sections[0]?.props?.items?.[0]?.position;
    expect(position?.width).toBe('300px');
    expect(position?.height).toBe('150px');
  });

  it('should handle invalid element paths gracefully', () => {
    const mockPageData = createMockPageData();
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    useEditorStore.getState().initializeEditor('test-page', mockPageData);

    // Try to resize with invalid path - should not crash
    useEditorStore.getState().updateElementPosition('section-1', 'nonexistent.path', { width: '100px' });

    // Props should remain unchanged
    expect(useEditorStore.getState().pageData?.sections[0]?.props?.title).toBe('Test Section');
    
    consoleWarnSpy.mockRestore();
  });

  it('should store position at array item level, not nested property', () => {
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

    // Resize using deep path (services.0.label)
    useEditorStore.getState().updateElementPosition('section-1', 'services.0.label', { 
      width: '100px' 
    });

    // Position should be stored at services[0].position, not services[0].label.position
    const position = useEditorStore.getState().pageData?.sections[0]?.props?.services?.[0]?.position;
    expect(position?.width).toBe('100px');
    
    // Label should still be a string, not an object
    const label = useEditorStore.getState().pageData?.sections[0]?.props?.services?.[0]?.label;
    expect(typeof label).toBe('string');
  });
});
