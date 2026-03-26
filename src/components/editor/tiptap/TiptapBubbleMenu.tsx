// @ts-nocheck
/**
 * TipTap Bubble Menu
 * 
 * NOTE: Not mounted at runtime. Active editor is SimpleRichEditor (native contenteditable).
 * Preserved for documentation reference only. Type-checking suppressed since Tiptap
 * extension types are no longer loaded via extensions.ts.
 */

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Palette,
  Highlighter,
  RemoveFormatting,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { colorPalette } from './extensions';

interface TiptapBubbleMenuProps {
  editor: Editor;
  multiline?: boolean;
}

export function TiptapBubbleMenu({ editor, multiline = false }: TiptapBubbleMenuProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkOpen, setIsLinkOpen] = useState(false);

  const handleSetLink = () => {
    if (linkUrl) {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href: url }).run();
    }
    setLinkUrl('');
    setIsLinkOpen(false);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  // Format button component
  const FormatButton = ({
    isActive,
    onClick,
    icon: Icon,
    title,
  }: {
    isActive: boolean;
    onClick: () => void;
    icon: React.ElementType;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('h-7 w-7', isActive && 'bg-muted text-foreground')}
      onClick={onClick}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  // Color picker component
  const ColorPicker = ({
    type,
    icon: Icon,
    title,
  }: {
    type: 'text' | 'highlight';
    icon: React.ElementType;
    title: string;
  }) => {
    const colors = type === 'text' ? colorPalette.text : colorPalette.highlight;
    const isActive = type === 'text' 
      ? editor.isActive('textStyle', { color: /./ })
      : editor.isActive('highlight');

    const applyColor = (colorValue: string | null) => {
      if (type === 'text') {
        if (colorValue) {
          editor.chain().focus().setColor(colorValue).run();
        } else {
          editor.chain().focus().unsetColor().run();
        }
      } else {
        if (colorValue) {
          editor.chain().focus().setHighlight({ color: colorValue }).run();
        } else {
          editor.chain().focus().unsetHighlight().run();
        }
      }
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', isActive && 'bg-muted text-foreground')}
            title={title}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start" sideOffset={8}>
          <div className="grid grid-cols-4 gap-1">
            {colors.map((color) => (
              <button
                key={color.name}
                className={cn(
                  'h-6 w-6 rounded border border-border flex items-center justify-center',
                  color.value === null && 'bg-background'
                )}
                style={{ backgroundColor: color.value || undefined }}
                title={color.name}
                onClick={() => applyColor(color.value)}
              >
                {color.value === null && (
                  <span className="text-[10px] text-muted-foreground">×</span>
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <BubbleMenu
      editor={editor}
      options={{
        placement: 'top',
        offset: 8,
      }}
      className="flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-lg z-[10002]"
    >
      {/* Text formatting */}
      <FormatButton
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={Bold}
        title="Bold (Ctrl+B)"
      />
      <FormatButton
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={Italic}
        title="Italic (Ctrl+I)"
      />
      <FormatButton
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        icon={Underline}
        title="Underline (Ctrl+U)"
      />
      <FormatButton
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        icon={Strikethrough}
        title="Strikethrough"
      />
      <FormatButton
        isActive={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
        icon={Code}
        title="Code"
      />

      <Separator orientation="vertical" className="mx-1 h-5" />

      {/* Colors */}
      <ColorPicker type="text" icon={Palette} title="Text Color" />
      <ColorPicker type="highlight" icon={Highlighter} title="Highlight" />

      <Separator orientation="vertical" className="mx-1 h-5" />

      {/* Links */}
      <Popover open={isLinkOpen} onOpenChange={setIsLinkOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', editor.isActive('link') && 'bg-muted text-foreground')}
            title="Insert Link (Ctrl+K)"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" align="start" sideOffset={8}>
          <div className="flex gap-2">
            <Input
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSetLink();
                }
              }}
              className="h-8"
              autoFocus
            />
            <Button size="sm" className="h-8" onClick={handleSetLink}>
              Add
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {editor.isActive('link') && (
        <FormatButton
          isActive={false}
          onClick={handleRemoveLink}
          icon={Unlink}
          title="Remove Link"
        />
      )}

      {/* Multiline-only features */}
      {multiline && (
        <>
          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* Alignment */}
          <FormatButton
            isActive={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            icon={AlignLeft}
            title="Align Left"
          />
          <FormatButton
            isActive={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            icon={AlignCenter}
            title="Align Center"
          />
          <FormatButton
            isActive={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            icon={AlignRight}
            title="Align Right"
          />
          <FormatButton
            isActive={editor.isActive({ textAlign: 'justify' })}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            icon={AlignJustify}
            title="Justify"
          />

          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* Headings */}
          <FormatButton
            isActive={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            icon={Heading1}
            title="Heading 1"
          />
          <FormatButton
            isActive={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            icon={Heading2}
            title="Heading 2"
          />
          <FormatButton
            isActive={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            icon={Heading3}
            title="Heading 3"
          />

          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* Lists */}
          <FormatButton
            isActive={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            icon={List}
            title="Bullet List"
          />
          <FormatButton
            isActive={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            icon={ListOrdered}
            title="Numbered List"
          />
        </>
      )}

      <Separator orientation="vertical" className="mx-1 h-5" />

      {/* Clear formatting */}
      <FormatButton
        isActive={false}
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        icon={RemoveFormatting}
        title="Clear Formatting"
      />
    </BubbleMenu>
  );
}
