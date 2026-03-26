/**
 * useArrayItems Hook
 * 
 * Provides automatic DnD support for arrays within sections.
 */

import React, { useMemo } from 'react';
import { SortableContext, rectSortingStrategy, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useSectionDnd } from '@/contexts/SectionDndContext';
import { DndStrategy, HandlePosition } from '@/lib/sectionDndConfig';

interface ArrayItemsResult<T> {
  items: T[];
  itemIds: string[];
  isEnabled: boolean;
  handlePosition: HandlePosition;
  getItemProps: (index: number) => {
    id: string;
    sectionId: string;
    arrayPath: string;
    index: number;
    isEditing: boolean;
    handlePosition: HandlePosition;
  };
  SortableWrapper: React.FC<{ children: React.ReactNode }>;
}

function getStrategy(strategyType: DndStrategy) {
  switch (strategyType) {
    case 'grid':
      return rectSortingStrategy;
    case 'vertical':
      return verticalListSortingStrategy;
    case 'horizontal':
      return horizontalListSortingStrategy;
    default:
      return rectSortingStrategy;
  }
}

export function useArrayItems<T>(arrayPath: string, items: T[] | undefined | null): ArrayItemsResult<T> {
  const dndContext = useSectionDnd();
  
  // Defensive: ensure items is always an array
  const safeItems = items || [] as T[];
  
  const arrayConfig = dndContext?.config?.arrays.find(a => a.path === arrayPath);
  
  const isEnabled = Boolean(dndContext?.isEditing && arrayConfig);
  const sectionId = dndContext?.sectionId || '';
  
  const itemIds = useMemo(() => 
    safeItems.map((_, index) => `${sectionId}-${arrayPath}-${index}`),
    [safeItems.length, sectionId, arrayPath]
  );
  
  const strategyType = arrayConfig?.strategy || 'grid';
  const strategy = getStrategy(strategyType);
  const handlePosition = arrayConfig?.handlePosition || 'top-left';
  
  const getItemProps = (index: number) => ({
    id: itemIds[index],
    sectionId,
    arrayPath,
    index,
    isEditing: isEnabled,
    handlePosition,
  });
  
  const SortableWrapper = useMemo(() => {
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      if (!isEnabled) {
        return <>{children}</>;
      }
      return (
        <SortableContext items={itemIds} strategy={strategy}>
          {children}
        </SortableContext>
      );
    };
    return Wrapper;
  }, [isEnabled, itemIds, strategy]);
  
  return {
    items: safeItems,
    itemIds,
    isEnabled,
    handlePosition,
    getItemProps,
    SortableWrapper,
  };
}

export function useArrayDndEnabled(arrayPath: string): boolean {
  const dndContext = useSectionDnd();
  const arrayConfig = dndContext?.config?.arrays.find(a => a.path === arrayPath);
  return Boolean(dndContext?.isEditing && arrayConfig);
}
