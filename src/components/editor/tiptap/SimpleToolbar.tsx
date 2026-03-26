/**
 * SimpleToolbar
 * 
 * Formatting toolbar for the SimpleRichEditor.
 * Uses onMouseDown with preventDefault to avoid focus loss.
 */

import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Palette,
  Highlighter,
  RemoveFormatting,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// ============================================================================
// Types
// ============================================================================

interface SimpleToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onAddLink: () => void;
  className?: string;
}

interface ToolbarButtonProps {
  icon: React.ElementType;
  onMouseDown: () => void;
  title: string;
  isActive?: boolean;
}

// ============================================================================
// Color Palette
// ============================================================================

export const colorPalette = [
  '#000000', '#374151', '#6B7280', '#9CA3AF',
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899',
  '#FFFFFF', '#F3F4F6', '#E5E7EB', '#D1D5DB',
];

export const highlightPalette = [
  '#FEF08A', '#BBF7D0', '#A5F3FC', '#DDD6FE',
  '#FECACA', '#FED7AA', '#E0E7FF', '#FBCFE8',
];

// ============================================================================
// Toolbar Button
// ============================================================================

function ToolbarButton({ icon: Icon, onMouseDown, title, isActive }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onMouseDown();
      }}
      title={title}
      className={cn(
        'h-7 w-7 flex items-center justify-center rounded transition-colors',
        'hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring',
        isActive && 'bg-muted text-primary'
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

// ============================================================================
// Color Picker
// ============================================================================

interface ColorPickerProps {
  colors: string[];
  onSelect: (color: string) => void;
  icon: React.ElementType;
  title: string;
}

function ColorPicker({ colors, onSelect, icon: Icon, title }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          title={title}
          className={cn(
            'h-7 w-7 flex items-center justify-center rounded transition-colors',
            'hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring'
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-2" 
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="grid grid-cols-4 gap-1">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(color);
                setOpen(false);
              }}
              className="h-6 w-6 rounded border border-border hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// Main Toolbar
// ============================================================================

export function SimpleToolbar({ onFormat, onAddLink, className }: SimpleToolbarProps) {
  return (
    <div 
      className={cn(
        'flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-lg',
        className
      )}
      onMouseDown={(e) => {
        // Prevent any mousedown from bubbling up
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Text formatting */}
      <ToolbarButton
        icon={Bold}
        onMouseDown={() => onFormat('bold')}
        title="Bold (Ctrl+B)"
      />
      <ToolbarButton
        icon={Italic}
        onMouseDown={() => onFormat('italic')}
        title="Italic (Ctrl+I)"
      />
      <ToolbarButton
        icon={Underline}
        onMouseDown={() => onFormat('underline')}
        title="Underline (Ctrl+U)"
      />
      <ToolbarButton
        icon={Strikethrough}
        onMouseDown={() => onFormat('strikeThrough')}
        title="Strikethrough"
      />
      <ToolbarButton
        icon={Code}
        onMouseDown={() => onFormat('code')}
        title="Code"
      />
      
      {/* Separator */}
      <div className="w-px h-5 bg-border mx-1" />
      
      {/* Colors */}
      <ColorPicker
        colors={colorPalette}
        onSelect={(color) => onFormat('foreColor', color)}
        icon={Palette}
        title="Text Color"
      />
      <ColorPicker
        colors={highlightPalette}
        onSelect={(color) => onFormat('hiliteColor', color)}
        icon={Highlighter}
        title="Highlight"
      />
      
      {/* Separator */}
      <div className="w-px h-5 bg-border mx-1" />
      
      {/* Link */}
      <ToolbarButton
        icon={LinkIcon}
        onMouseDown={onAddLink}
        title="Add Link (Ctrl+K)"
      />
      
      {/* Clear formatting */}
      <ToolbarButton
        icon={RemoveFormatting}
        onMouseDown={() => onFormat('removeFormat')}
        title="Clear Formatting"
      />
    </div>
  );
}

export default SimpleToolbar;
