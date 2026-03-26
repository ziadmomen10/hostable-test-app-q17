/**
 * DebouncedInput
 * 
 * An input component that debounces onChange to reduce excessive re-renders.
 * Maintains local state for responsive typing while delaying store updates.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  /** Use textarea instead of input */
  multiline?: boolean;
  /** Textarea specific props */
  rows?: number;
}

export function DebouncedInput({
  value,
  onChange,
  debounceMs = 300,
  multiline = false,
  rows = 3,
  className,
  ...props
}: DebouncedInputProps) {
  // Local state for responsive typing
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  // Track if the pending change originated from this input
  const isOwnChangeRef = useRef(false);
  // Track the last value we sent to onChange
  const lastSentValueRef = useRef(value);

  // Sync local value when external value changes (e.g., undo/redo, reset)
  useEffect(() => {
    // Skip the initial mount to avoid double-firing
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // If this is a round-trip of our own change, ignore it
    if (isOwnChangeRef.current) {
      isOwnChangeRef.current = false;
      return;
    }
    
    // Only sync if:
    // 1. No pending debounce (user not actively typing)
    // 2. Value actually changed from what we have locally
    // 3. This isn't our own edit coming back
    const notTyping = !timeoutRef.current;
    const valueChanged = value !== localValue;
    const notOurEdit = value !== lastSentValueRef.current;
    
    if (notTyping && valueChanged && notOurEdit) {
      setLocalValue(value);
    }
  }, [value, localValue]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Clear any pending debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule the debounced update
    timeoutRef.current = setTimeout(() => {
      console.log('[DebouncedInput] Flushing:', { 
        valuePreview: newValue.slice(0, 30),
        debounceMs,
      });
      // Mark that the next value prop update is from our own change
      isOwnChangeRef.current = true;
      lastSentValueRef.current = newValue;
      onChange(newValue);
      timeoutRef.current = null;
    }, debounceMs);
  }, [onChange, debounceMs]);

  // Flush on blur to ensure changes are saved when leaving the field
  const handleBlur = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Only call onChange if value actually changed
    if (localValue !== value) {
      // Mark that the next value prop update is from our own change
      isOwnChangeRef.current = true;
      lastSentValueRef.current = localValue;
      onChange(localValue);
    }
    // Call original onBlur if provided
    props.onBlur?.(e as any);
  }, [localValue, value, onChange, props.onBlur]);

  if (multiline) {
    return (
      <Textarea
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={rows}
        className={cn(className)}
        {...(props as any)}
      />
    );
  }

  return (
    <Input
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={cn(className)}
      {...props}
    />
  );
}

export default DebouncedInput;
