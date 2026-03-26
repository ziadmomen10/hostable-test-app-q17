/**
 * Object Helper Utilities
 * 
 * Canonical location for nested object manipulation functions.
 * Use these throughout the codebase instead of duplicating.
 */

// ============================================================================
// Nested Value Getters
// ============================================================================

/**
 * Get a nested value from an object using dot notation.
 * Handles array indices (e.g., "items.0.title").
 * 
 * @param obj - The object to read from
 * @param path - Dot-notation path (e.g., "items.0.title")
 * @returns The value at the path, or undefined
 */
export function getNestedValue(obj: unknown, path: string): unknown {
  if (obj === null || obj === undefined || !path) return undefined;
  
  const parts = path.split('.');
  let current: unknown = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  
  return current;
}

/**
 * Get a nested string value from an object using dot notation.
 * Returns null if the value is not a string.
 */
export function getNestedString(obj: Record<string, unknown>, path: string): string | null {
  const value = getNestedValue(obj, path);
  return typeof value === 'string' ? value : null;
}

// ============================================================================
// Nested Value Setters
// ============================================================================

/**
 * Set a nested value in an object using dot notation (IMMUTABLE).
 * Returns a new object with the updated value - does not modify the original.
 * 
 * @param obj - The object to update
 * @param path - Dot-notation path (e.g., "items.0.title")
 * @param value - The value to set
 * @returns A new object with the updated value
 */
export function setNestedValueImmutable<T>(obj: T, path: string, value: unknown): T {
  const parts = path.split('.');
  const result = deepClone(obj);
  let current: Record<string, unknown> = result as Record<string, unknown>;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      // Create array if next part is numeric, otherwise object
      current[part] = isNaN(Number(parts[i + 1])) ? {} : [];
    }
    current = current[part] as Record<string, unknown>;
  }
  
  current[parts[parts.length - 1]] = value;
  return result;
}

/**
 * Set a nested value in an object using dot notation (MUTABLE).
 * Modifies the object in place - use when mutation is acceptable.
 * 
 * @param obj - The object to update (mutated in place)
 * @param path - Dot-notation path (e.g., "items.0.title")
 * @param value - The value to set
 */
export function setNestedValueMutable(
  obj: Record<string, unknown>, 
  path: string, 
  value: unknown
): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      current[part] = isNaN(Number(parts[i + 1])) ? {} : [];
    }
    current = current[part] as Record<string, unknown>;
  }
  
  current[parts[parts.length - 1]] = value;
}

// ============================================================================
// Cloning
// ============================================================================

/**
 * Deep clone an object using JSON serialization.
 * 
 * Note: This approach has limitations:
 * - Won't preserve functions, Dates, RegExp, etc.
 * - Won't handle circular references
 * - undefined values in objects will be omitted
 * 
 * For most JSON-serializable data structures (like editor state), this works well.
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  return JSON.parse(JSON.stringify(obj));
}

// ============================================================================
// Legacy Aliases (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use setNestedValueImmutable instead
 */
export const setNestedValue = setNestedValueImmutable;
