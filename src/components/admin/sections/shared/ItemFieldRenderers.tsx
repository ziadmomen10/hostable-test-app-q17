/**
 * Reusable Field Renderer Components
 * 
 * Pre-built field patterns used across section settings.
 * Reduces code duplication and ensures consistency.
 * Uses DebouncedInput for better typing performance.
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconPicker } from './IconPicker';


// ============================================================================
// Icon + Title Field (used in 12+ sections)
// ============================================================================

export interface IconTitleFieldProps {
  icon: string;
  title: string;
  onIconChange: (icon: string) => void;
  onTitleChange: (title: string) => void;
  iconLabel?: string;
  titleLabel?: string;
  titlePlaceholder?: string;
  className?: string;
}

export function IconTitleField({
  icon,
  title,
  onIconChange,
  onTitleChange,
  iconLabel = 'Icon',
  titleLabel = 'Title',
  titlePlaceholder = 'Enter title',
  className,
}: IconTitleFieldProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      <div className="space-y-1.5">
        <Label className="text-xs">{iconLabel}</Label>
        <IconPicker
          value={icon || 'Star'}
          onChange={onIconChange}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">{titleLabel}</Label>
        <DebouncedInput
          value={title}
          onChange={onTitleChange}
          placeholder={titlePlaceholder}
          className="h-9"
        />
      </div>
    </div>
  );
}

// ============================================================================
// Price Field (Pricing, ServerSpecs, HostingServices)
// ============================================================================

export interface PriceFieldProps {
  price: string;
  originalPrice?: string;
  period?: string;
  onPriceChange: (price: string) => void;
  onOriginalPriceChange?: (originalPrice: string) => void;
  onPeriodChange?: (period: string) => void;
  priceLabel?: string;
  originalPriceLabel?: string;
  periodLabel?: string;
  showOriginalPrice?: boolean;
  showPeriod?: boolean;
  periodOptions?: string[];
  className?: string;
}

export function PriceField({
  price,
  originalPrice = '',
  period = '/mo',
  onPriceChange,
  onOriginalPriceChange,
  onPeriodChange,
  priceLabel = 'Price',
  originalPriceLabel = 'Original',
  periodLabel = 'Period',
  showOriginalPrice = true,
  showPeriod = true,
  periodOptions = ['/mo', '/yr', '/week'],
  className,
}: PriceFieldProps) {
  const columns = [showOriginalPrice, showPeriod].filter(Boolean).length + 1;
  
  return (
    <div className={cn(`grid grid-cols-${columns} gap-2`, className)} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      <div className="space-y-1">
        <Label className="text-xs">{priceLabel}</Label>
        <DebouncedInput
          value={price}
          onChange={onPriceChange}
          placeholder="19.99"
          className="h-7 text-xs"
        />
      </div>
      
      {showOriginalPrice && onOriginalPriceChange && (
        <div className="space-y-1">
          <Label className="text-xs">{originalPriceLabel}</Label>
          <DebouncedInput
            value={originalPrice}
            onChange={onOriginalPriceChange}
            placeholder="29.99"
            className="h-7 text-xs"
          />
        </div>
      )}
      
      {showPeriod && onPeriodChange && (
        <div className="space-y-1">
          <Label className="text-xs">{periodLabel}</Label>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Rating Field (Testimonials)
// ============================================================================

export interface RatingFieldProps {
  rating: number;
  onChange: (rating: number) => void;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function RatingField({
  rating,
  onChange,
  max = 5,
  label = 'Rating',
  showValue = true,
  className,
}: RatingFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-3">
        <Slider
          value={[rating]}
          onValueChange={([val]) => onChange(val)}
          min={1}
          max={max}
          step={1}
          className="flex-1"
        />
        {showValue && (
          <div className="flex items-center gap-1 w-16">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Render star icons for display
 */
export function StarRating({ rating, max = 5, className }: { rating: number; max?: number; className?: string }) {
  return (
    <div className={cn('flex gap-0.5', className)}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3 w-3',
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
          )}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Image Field
// ============================================================================

export interface ImageFieldProps {
  src: string;
  onChange: (src: string) => void;
  onUploadClick?: () => void;
  label?: string;
  placeholder?: string;
  showPreview?: boolean;
  previewSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ImageField({
  src,
  onChange,
  onUploadClick,
  label = 'Image URL',
  placeholder = '/placeholder.svg',
  showPreview = true,
  previewSize = 'sm',
  className,
}: ImageFieldProps) {
  const previewSizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };
  
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        {showPreview && src && (
          <img
            src={src}
            alt="Preview"
            className={cn(
              previewSizes[previewSize],
              'rounded object-cover border'
            )}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <DebouncedInput
          value={src}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 h-8"
        />
        {onUploadClick && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={onUploadClick}
          >
            <Upload className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Text Field with optional character count
// ============================================================================

export interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  className?: string;
  inputClassName?: string;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  multiline = false,
  rows = 3,
  className,
  inputClassName,
}: TextFieldProps) {
  const showCount = maxLength !== undefined;
  const isOverLimit = maxLength !== undefined && value.length > maxLength;
  
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        {showCount && (
          <span className={cn(
            'text-xs',
            isOverLimit ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <DebouncedInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        className={cn(multiline ? 'resize-none' : 'h-9', inputClassName)}
      />
    </div>
  );
}

// ============================================================================
// Toggle Field (Switch with label)
// ============================================================================

export interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'highlight';
  className?: string;
}

export function ToggleField({
  label,
  description,
  checked,
  onChange,
  icon,
  variant = 'default',
  className,
}: ToggleFieldProps) {
  const variantClasses = {
    default: '',
    highlight: 'p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded',
  };
  
  return (
    <div className={cn(
      'flex items-center justify-between',
      variantClasses[variant],
      className
    )}>
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <span className="text-xs font-medium">{label}</span>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

// ============================================================================
// Select Field
// ============================================================================

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className,
}: SelectFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-xs">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ============================================================================
// Number Field with +/- buttons
// ============================================================================

export interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}: NumberFieldProps) {
  const handleDecrement = () => {
    const newValue = value - step;
    if (newValue >= min) onChange(newValue);
  };
  
  const handleIncrement = () => {
    const newValue = value + step;
    if (newValue <= max) onChange(newValue);
  };
  
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleDecrement}
          disabled={value <= min}
        >
          <span className="text-lg">−</span>
        </Button>
        <span className="text-lg font-bold w-8 text-center">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleIncrement}
          disabled={value >= max}
        >
          <span className="text-lg">+</span>
        </Button>
      </div>
    </div>
  );
}
