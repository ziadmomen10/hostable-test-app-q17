/**
 * useLatestRef Hook
 * 
 * Creates a ref that always contains the latest value.
 * This is essential for preventing stale closures in callbacks
 * when you need access to the current value without re-creating the callback.
 * 
 * Usage:
 * const dataRef = useLatestRef(data);
 * const handleChange = useCallback(() => {
 *   console.log(dataRef.current); // Always fresh!
 * }, []); // No dependencies needed!
 */

import { useRef, useEffect, useCallback } from 'react';

/**
 * Returns a ref that always contains the latest value.
 * Updates synchronously on each render.
 */
export function useLatestRef<T>(value: T): React.MutableRefObject<T> {
  const ref = useRef(value);
  
  // Update ref synchronously to ensure it's always current
  ref.current = value;
  
  return ref;
}

/**
 * Creates a stable callback that always calls the latest version of the function.
 * The returned callback reference never changes, but always invokes the current function.
 * 
 * Usage:
 * const handleClick = useStableCallback((e) => {
 *   console.log(data); // Always fresh data!
 * });
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef(callback);
  
  // Update ref synchronously
  callbackRef.current = callback;
  
  // Return a stable callback that forwards to the latest function
  return useCallback(
    ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
    []
  );
}

/**
 * Creates a data change handler that always uses the latest data reference.
 * This is specifically designed for settings components that need to spread
 * current data when making partial updates.
 * 
 * Usage:
 * const { updateField, updateArray } = useDataChangeHandlers(initialData, onDataChange);
 */
export function useDataChangeHandlers<T extends Record<string, any>>(
  data: T,
  onDataChange: (data: T) => void
) {
  const dataRef = useLatestRef(data);
  const onDataChangeRef = useLatestRef(onDataChange);
  
  /**
   * Update a single field in the data object
   */
  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    const newData = { ...dataRef.current, [field]: value };
    console.log('[useDataChangeHandlers] updateField:', { 
      field, 
      valuePreview: String(value).slice(0, 50),
    });
    onDataChangeRef.current(newData);
  }, []);
  
  /**
   * Update an array field in the data object
   */
  const updateArray = useCallback(<K extends keyof T>(field: K, items: T[K]) => {
    onDataChangeRef.current({ ...dataRef.current, [field]: items });
  }, []);
  
  /**
   * Update multiple fields at once
   */
  const updateFields = useCallback((updates: Partial<T>) => {
    onDataChangeRef.current({ ...dataRef.current, ...updates });
  }, []);
  
  /**
   * Get the current data (fresh reference)
   */
  const getCurrentData = useCallback(() => dataRef.current, []);
  
  return {
    updateField,
    updateArray,
    updateFields,
    getCurrentData,
    dataRef,
  };
}

export default useLatestRef;
