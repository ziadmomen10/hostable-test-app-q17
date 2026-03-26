/**
 * Single Source of Truth Test
 * 
 * Verifies that:
 * 1. Only one document instance exists at a time
 * 2. All mutations go through the EditorStore
 * 3. Document reference is consistent across components
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  registerDocumentInstance,
  unregisterDocumentInstance,
  getDocumentInstanceId,
  validateDocumentSync,
} from '@/lib/editorApi';
import { useEditorStore } from '@/stores/editorStore';

describe('Document Single Source of Truth', () => {
  beforeEach(() => {
    // Clear any registered instances
    const currentId = getDocumentInstanceId();
    if (currentId) {
      unregisterDocumentInstance(currentId);
    }
    // Reset the editor store
    useEditorStore.getState().resetEditor();
  });

  afterEach(() => {
    // Clean up
    const currentId = getDocumentInstanceId();
    if (currentId) {
      unregisterDocumentInstance(currentId);
    }
  });

  it('should register a document instance', () => {
    const instanceId = 'test-instance-1';
    const mockDocument = { sections: [] };

    registerDocumentInstance(instanceId, mockDocument);

    expect(getDocumentInstanceId()).toBe(instanceId);
  });

  it('should unregister a document instance', () => {
    const instanceId = 'test-instance-1';
    const mockDocument = { sections: [] };

    registerDocumentInstance(instanceId, mockDocument);
    unregisterDocumentInstance(instanceId);

    expect(getDocumentInstanceId()).toBeNull();
  });

  it('should detect DESYNC when multiple instances are registered', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const instanceId1 = 'test-instance-1';
    const instanceId2 = 'test-instance-2';
    const mockDocument = { sections: [] };

    registerDocumentInstance(instanceId1, mockDocument);
    registerDocumentInstance(instanceId2, mockDocument);

    // In development mode, this should log an error
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[DESYNC DETECTED]'),
      expect.any(Object)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should not unregister if instance ID does not match', () => {
    const instanceId1 = 'test-instance-1';
    const instanceId2 = 'test-instance-2';
    const mockDocument = { sections: [] };

    registerDocumentInstance(instanceId1, mockDocument);
    unregisterDocumentInstance(instanceId2);

    // Should still be registered because IDs don't match
    expect(getDocumentInstanceId()).toBe(instanceId1);
  });

  it('should validate document sync correctly', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const instanceId = 'test-instance-1';
    const mockDocument = { sections: [] };
    const differentDocument = { sections: [{ id: 'section-1' }] };

    registerDocumentInstance(instanceId, mockDocument);
    
    // Validate with different document should log error
    validateDocumentSync(differentDocument, 'test-source');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[DESYNC DETECTED]'),
      expect.any(Object)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should not error when validating same document reference', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const instanceId = 'test-instance-1';
    const mockDocument = { sections: [] };

    registerDocumentInstance(instanceId, mockDocument);
    validateDocumentSync(mockDocument, 'test-source');

    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});

describe('Document Mutations via EditorStore', () => {
  beforeEach(() => {
    useEditorStore.getState().resetEditor();
  });

  it('should add sections through the store', () => {
    // Initialize with empty page
    useEditorStore.getState().initializeEditor('test-page', {
      id: 'test-page',
      version: 1,
      sections: [],
      metadata: { title: 'Test', lastModified: new Date().toISOString() },
    });

    // Add a section
    useEditorStore.getState().addSection('hero', 0);

    const { pageData } = useEditorStore.getState();
    expect(pageData?.sections.length).toBe(1);
    expect(pageData?.sections[0].type).toBe('hero');
  });

  it('should update section props through the store', () => {
    useEditorStore.getState().initializeEditor('test-page', {
      id: 'test-page',
      version: 1,
      sections: [
        { id: 'section-1', type: 'hero', props: { title: 'Old' }, order: 0, visible: true },
      ],
      metadata: { title: 'Test', lastModified: new Date().toISOString() },
    });

    useEditorStore.getState().updateSectionProps('section-1', { title: 'New Title' });

    expect(useEditorStore.getState().pageData?.sections[0].props.title).toBe('New Title');
  });

  it('should update element values through the store', () => {
    useEditorStore.getState().initializeEditor('test-page', {
      id: 'test-page',
      version: 1,
      sections: [
        { id: 'section-1', type: 'hero', props: { title: 'Hello' }, order: 0, visible: true },
      ],
      metadata: { title: 'Test', lastModified: new Date().toISOString() },
    });

    useEditorStore.getState().updateElementValue('section-1', 'title', 'World');

    expect(useEditorStore.getState().pageData?.sections[0].props.title).toBe('World');
  });

  it('should update element positions through the store', () => {
    useEditorStore.getState().initializeEditor('test-page', {
      id: 'test-page',
      version: 1,
      sections: [
        { 
          id: 'section-1', 
          type: 'hero', 
          props: { items: [{ id: 'item-1', label: 'Test' }] }, 
          order: 0, 
          visible: true 
        },
      ],
      metadata: { title: 'Test', lastModified: new Date().toISOString() },
    });

    useEditorStore.getState().updateElementPosition('section-1', 'items.0', { width: '100px' });

    const position = useEditorStore.getState().pageData?.sections[0].props.items?.[0]?.position;
    expect(position?.width).toBe('100px');
  });

  it('should mark changes as unsaved after mutations', () => {
    useEditorStore.getState().initializeEditor('test-page', {
      id: 'test-page',
      version: 1,
      sections: [],
      metadata: { title: 'Test', lastModified: new Date().toISOString() },
    });

    expect(useEditorStore.getState().hasUnsavedChanges).toBe(false);

    useEditorStore.getState().addSection('hero', 0);

    expect(useEditorStore.getState().hasUnsavedChanges).toBe(true);
  });
});
