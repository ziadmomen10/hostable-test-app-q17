/**
 * Document Slice
 * 
 * Handles all document-related state mutations including:
 * - Section CRUD (add, update, delete, duplicate, reorder)
 * - Element value updates
 * - Translation key management
 */

import { StateCreator } from 'zustand';
import { SectionType } from '@/types/pageEditor';
import { SectionInstance } from '@/types/reactEditor';
import { createSectionInstance } from '@/lib/sectionDefinitions';
import { setNestedValueImmutable, getNestedValue } from '@/lib/utils/objectHelpers';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import type { 
  EditorStoreState, 
  DocumentActions,
  DocumentState 
} from '../types';

// ============================================================================
// Types
// ============================================================================

export type { DocumentState, DocumentActions } from '../types';

// Combined store type for cross-slice access
type CombinedStore = EditorStoreState & DocumentActions & {
  // Access to selection state for addSection/duplicateSection
  selection: EditorStoreState['selection'];
  selectedSectionId: EditorStoreState['selectedSectionId'];
};

// ============================================================================
// Initial State
// ============================================================================

export const initialDocumentState: DocumentState = {
  pageId: null,
  pageData: null,
  originalPageData: null,
  sectionVersions: {},
};

// Initial selection constant for reset operations
const initialSelection = {
  type: 'none' as const,
  sectionId: null,
  columnId: null,
  elementPath: null,
  isInlineEditing: false,
};

// ============================================================================
// Slice Creator
// ============================================================================

export const createDocumentSlice: StateCreator<
  CombinedStore,
  [['zustand/devtools', never], ['zustand/subscribeWithSelector', never]],
  [],
  DocumentActions
> = (set, get) => ({
  initializeEditor: (pageId, pageData) => {
    logger.editor.info('Initializing:', { pageId, hasSections: pageData?.sections?.length ?? 0 });
    set({
      pageId,
      pageData,
      originalPageData: pageData ? JSON.parse(JSON.stringify(pageData)) : null,
      hasUnsavedChanges: false,
      history: pageData ? [JSON.parse(JSON.stringify(pageData))] : [],
      historyIndex: pageData ? 0 : -1,
      isLoading: false,
      autosaveStatus: 'idle',
    });
  },

  resetEditor: () => set({
    pageId: null,
    pageData: null,
    originalPageData: null,
    sectionVersions: {},
    history: [],
    historyIndex: -1,
    hasUnsavedChanges: false,
    isLoading: true,
    autosaveStatus: 'idle',
  }),

  setPageId: (pageId) => set({ pageId }),

  setPageData: (pageData) => {
    logger.editor.debug('setPageData:', { sections: pageData?.sections?.length ?? 0 });
    set({ pageData, hasUnsavedChanges: false, autosaveStatus: 'idle' });
  },

  addSection: (type, index) => {
    const section = createSectionInstance(type as SectionType);
    if (!section) return;

    const { pageData } = get();
    if (!pageData) return;

    const newSections = [...pageData.sections];
    const insertIndex = index ?? newSections.length;
    section.order = insertIndex;
    newSections.splice(insertIndex, 0, section);
    newSections.forEach((s, i) => { s.order = i; });

    logger.editor.debug('addSection:', { type, insertIndex, newSectionId: section.id });

    const newPageData = { ...pageData, sections: newSections };
    set({
      pageData: newPageData,
      hasUnsavedChanges: true,
      selectedSectionId: section.id,
      selection: { 
        type: 'section', 
        sectionId: section.id, 
        columnId: null, 
        elementPath: null, 
        isInlineEditing: false 
      },
    });
  },

  updateSectionProps: (sectionId, props) => {
    const { pageData, sectionVersions } = get();
    if (!pageData) {
      logger.editor.error('updateSectionProps: No pageData!');
      return;
    }

    const sectionIndex = pageData.sections.findIndex(s => s.id === sectionId);
    const oldVersion = sectionVersions[sectionId] || 0;
    const newVersion = oldVersion + 1;

    logger.editor.debug('updateSectionProps:', {
      sectionId: sectionId.slice(-8),
      sectionIndex,
      propsKeys: Object.keys(props),
      propsPreview: JSON.stringify(props).slice(0, 100),
      oldVersion,
      newVersion,
    });

    if (sectionIndex === -1) {
      logger.editor.error('updateSectionProps: Section not found!', sectionId);
      return;
    }

    const newSections = pageData.sections.map(s =>
      s.id === sectionId ? { ...s, props: { ...s.props, ...props } } : s
    );

    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });

    logger.editor.debug('updateSectionProps DONE - new version:', newVersion);
  },

  updateSectionStyle: (sectionId, style) => {
    const { pageData, sectionVersions } = get();
    if (!pageData) return;

    logger.editor.debug('updateSectionStyle:', { sectionId, style });
    const newSections = pageData.sections.map(s =>
      s.id === sectionId ? { ...s, style: { ...s.style, ...style } } : s
    );

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },

  deleteSection: (sectionId) => {
    const { pageData, selectedSectionId, selection, pageId } = get();
    if (!pageData) return;

    logger.editor.debug('deleteSection:', sectionId);
    const newSections = pageData.sections
      .filter(s => s.id !== sectionId)
      .map((s, i) => ({ ...s, order: i }));

    // CRITICAL: Clean up translation keys for the deleted section
    // This prevents orphan keys that cause conflicts during key generation
    if (pageId) {
      supabase
        .from('translation_keys')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('page_id', pageId)
        .eq('section_id', sectionId)
        .then(({ error }) => {
          if (error) {
            logger.editor.error('Failed to deactivate keys for deleted section:', error);
          } else {
            logger.editor.info('Deactivated translation keys for deleted section:', sectionId);
          }
        });
    }

    set({
      pageData: { ...pageData, sections: newSections },
      hasUnsavedChanges: true,
      requiresImmediateSave: true, // Trigger immediate save for destructive operations
      selectedSectionId: selectedSectionId === sectionId ? null : selectedSectionId,
      selection: selectedSectionId === sectionId ? initialSelection : selection,
    });
  },

  reorderSections: (sourceIndex, destinationIndex) => {
    const { pageData } = get();
    if (!pageData || sourceIndex === destinationIndex) return;

    logger.editor.debug('reorderSections:', { sourceIndex, destinationIndex });
    const newSections = [...pageData.sections];
    const [removed] = newSections.splice(sourceIndex, 1);
    newSections.splice(destinationIndex, 0, removed);
    newSections.forEach((s, i) => { s.order = i; });
    set({
      pageData: { ...pageData, sections: newSections },
      hasUnsavedChanges: true,
      requiresImmediateSave: true, // Trigger immediate save for structural changes
    });
  },

  duplicateSection: (sectionId) => {
    const { pageData } = get();
    if (!pageData) return;

    const originalIndex = pageData.sections.findIndex(s => s.id === sectionId);
    if (originalIndex === -1) return;

    const original = pageData.sections[originalIndex];
    const duplicate: SectionInstance = {
      ...original,
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      props: JSON.parse(JSON.stringify(original.props)),
      translationKeys: original.translationKeys
        ? JSON.parse(JSON.stringify(original.translationKeys))
        : undefined,
      order: originalIndex + 1,
    };

    logger.editor.debug('duplicateSection:', { from: sectionId, to: duplicate.id });
    const newSections = [...pageData.sections];
    newSections.splice(originalIndex + 1, 0, duplicate);
    newSections.forEach((s, i) => { s.order = i; });

    set({
      pageData: { ...pageData, sections: newSections },
      hasUnsavedChanges: true,
      selectedSectionId: duplicate.id,
      selection: { 
        type: 'section', 
        sectionId: duplicate.id, 
        columnId: null, 
        elementPath: null, 
        isInlineEditing: false 
      },
    });
  },

  toggleSectionVisibility: (sectionId) => {
    const { pageData } = get();
    if (!pageData) return;

    logger.editor.debug('toggleSectionVisibility:', sectionId);
    const newSections = pageData.sections.map(s =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    );
    set({
      pageData: { ...pageData, sections: newSections },
      hasUnsavedChanges: true,
    });
  },

  updateElementValue: (sectionId, elementPath, value) => {
    const { pageData, sectionVersions } = get();
    if (!pageData) return;

    logger.editor.debug('updateElementValue:', { 
      sectionId, 
      elementPath, 
      valuePreview: String(value).substring(0, 50) 
    });
    
    const newSections = pageData.sections.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        props: setNestedValueImmutable(section.props, elementPath, value),
      };
    });

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },

  updateElementPosition: (sectionId, elementPath, position) => {
    const { pageData, sectionVersions } = get();
    if (!pageData) return;

    logger.editor.debug('updateElementPosition:', { sectionId, elementPath, position });

    const pathParts = elementPath.split('.');
    let arrayPath = '';
    let itemIndex = -1;

    for (let i = 0; i < pathParts.length; i++) {
      const num = Number(pathParts[i]);
      if (!isNaN(num) && pathParts[i] !== '') {
        arrayPath = pathParts.slice(0, i).join('.');
        itemIndex = num;
        break;
      }
    }

    if (itemIndex === -1 || !arrayPath) {
      logger.editor.warn('updateElementPosition: Could not find array index in path:', elementPath);
      return;
    }

    const newSections = pageData.sections.map(section => {
      if (section.id !== sectionId) return section;

      const array = getNestedValue(section.props, arrayPath);
      if (!Array.isArray(array) || itemIndex >= array.length) return section;

      const newArray = [...array];
      const item = { ...newArray[itemIndex] };
      item.position = { ...(item.position || {}), ...position };
      newArray[itemIndex] = item;

      return {
        ...section,
        props: setNestedValueImmutable(section.props, arrayPath, newArray),
      };
    });

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },

  reorderArrayItem: (sectionId, arrayPath, sourceIndex, destinationIndex) => {
    const { pageData, sectionVersions } = get();
    if (!pageData || sourceIndex === destinationIndex) return;

    logger.editor.debug('reorderArrayItem:', { sectionId, arrayPath, sourceIndex, destinationIndex });
    
    const newSections = pageData.sections.map(section => {
      if (section.id !== sectionId) return section;

      const propsContainer = section.props.data || section.props;
      const array = getNestedValue(propsContainer, arrayPath);

      if (!Array.isArray(array)) {
        logger.editor.warn('reorderArrayItem: array not found at path', arrayPath, 'in section', sectionId);
        return section;
      }

      const newArray = [...array];
      const [removed] = newArray.splice(sourceIndex, 1);
      newArray.splice(destinationIndex, 0, removed);

      if (section.props.data) {
        const newData = setNestedValueImmutable(section.props.data, arrayPath, newArray);
        return {
          ...section,
          props: { ...section.props, data: newData },
        };
      }

      return {
        ...section,
        props: setNestedValueImmutable(section.props, arrayPath, newArray),
      };
    });

    const newVersion = (sectionVersions[sectionId] || 0) + 1;

    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: { ...sectionVersions, [sectionId]: newVersion },
      hasUnsavedChanges: true,
    });
  },

  moveArrayItemBetweenSections: (
    sourceSectionId, 
    sourceArrayPath, 
    sourceIndex, 
    targetSectionId, 
    targetArrayPath, 
    targetIndex
  ) => {
    const { pageData, sectionVersions } = get();
    if (!pageData) return;

    logger.editor.debug('moveArrayItemBetweenSections:', { 
      sourceSectionId, 
      sourceArrayPath, 
      sourceIndex, 
      targetSectionId, 
      targetArrayPath, 
      targetIndex 
    });

    let movedItem: any = null;

    let newSections = pageData.sections.map(section => {
      if (section.id !== sourceSectionId) return section;

      const sourceArray = getNestedValue(section.props, sourceArrayPath);
      if (!Array.isArray(sourceArray)) return section;

      const newSourceArray = [...sourceArray];
      [movedItem] = newSourceArray.splice(sourceIndex, 1);

      return {
        ...section,
        props: setNestedValueImmutable(section.props, sourceArrayPath, newSourceArray),
      };
    });

    if (!movedItem) return;

    newSections = newSections.map(section => {
      if (section.id !== targetSectionId) return section;

      const targetArray = getNestedValue(section.props, targetArrayPath);
      if (!Array.isArray(targetArray)) return section;

      const newTargetArray = [...targetArray];
      newTargetArray.splice(targetIndex, 0, movedItem);

      return {
        ...section,
        props: setNestedValueImmutable(section.props, targetArrayPath, newTargetArray),
      };
    });

    const newVersionSource = (sectionVersions[sourceSectionId] || 0) + 1;
    const newVersionTarget = (sectionVersions[targetSectionId] || 0) + 1;

    set({
      pageData: { ...pageData, sections: newSections },
      sectionVersions: {
        ...sectionVersions,
        [sourceSectionId]: newVersionSource,
        [targetSectionId]: newVersionTarget,
      },
      hasUnsavedChanges: true,
    });
  },

  setTranslationKey: (sectionId, propPath, translationKey) => {
    const { pageData } = get();
    if (!pageData) return;

    const newSections = pageData.sections.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        translationKeys: { ...s.translationKeys, [propPath]: translationKey },
      };
    });
    set({
      pageData: { ...pageData, sections: newSections },
      hasUnsavedChanges: true,
    });
  },

  removeTranslationKey: (sectionId, propPath) => {
    const { pageData } = get();
    if (!pageData) return;

    const newSections = pageData.sections.map(s => {
      if (s.id !== sectionId || !s.translationKeys) return s;
      const { [propPath]: removed, ...remainingKeys } = s.translationKeys;
      return {
        ...s,
        translationKeys: Object.keys(remainingKeys).length > 0 ? remainingKeys : undefined,
      };
    });
    set({
      pageData: { ...pageData, sections: newSections },
      hasUnsavedChanges: true,
    });
  },
});
