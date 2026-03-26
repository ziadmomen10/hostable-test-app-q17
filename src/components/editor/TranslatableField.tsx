/**
 * TranslatableField Component
 * 
 * A wrapper that adds translation key binding UI to any form field.
 * Shows a globe icon that opens the TranslationKeyPicker.
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { TranslationKeyPicker } from './TranslationKeyPicker';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface TranslatableFieldProps {
  sectionId: string;
  propPath: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  sectionType?: string;
  sectionIndex?: number;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function TranslatableField({
  sectionId,
  propPath,
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  maxLength,
  sectionType,
  sectionIndex,
  className,
  inputClassName,
  disabled = false,
}: TranslatableFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {/* Label row with translation picker */}
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs font-medium">{label}</Label>
        <div className="flex items-center gap-1">
          {maxLength && (
            <span className="text-[10px] text-muted-foreground">
              {value.length}/{maxLength}
            </span>
          )}
          <TranslationKeyPicker
            sectionId={sectionId}
            propPath={propPath}
            propLabel={label}
            currentValue={value}
          />
        </div>
      </div>

      {/* Input field with debouncing for smooth typing */}
      <DebouncedInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        debounceMs={300}
        className={cn(multiline ? 'text-sm resize-none' : 'h-8 text-sm', inputClassName)}
      />
    </div>
  );
}

// ============================================================================
// TranslatableInput (simpler version without label)
// ============================================================================

interface TranslatableInputProps {
  sectionId: string;
  propPath: string;
  propLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TranslatableInput({
  sectionId,
  propPath,
  propLabel,
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}: TranslatableInputProps) {
  return (
    <div className="relative flex items-center gap-1">
      <DebouncedInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        debounceMs={300}
        className={cn('h-8 text-sm pr-8', className)}
      />
      <TranslationKeyPicker
        sectionId={sectionId}
        propPath={propPath}
        propLabel={propLabel}
        currentValue={value}
        className="absolute right-1"
      />
    </div>
  );
}

export default TranslatableField;
