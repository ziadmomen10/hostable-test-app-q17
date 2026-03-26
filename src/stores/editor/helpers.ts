/**
 * Editor Store Helpers
 * 
 * Re-exports object manipulation utilities from canonical location.
 * Maintained for backward compatibility.
 * 
 * @deprecated Import directly from '@/lib/utils/objectHelpers' for new code.
 */

export { 
  getNestedValue, 
  setNestedValueImmutable as setNestedValue, 
  deepClone,
  getNestedString,
  setNestedValueMutable,
} from '@/lib/utils/objectHelpers';
