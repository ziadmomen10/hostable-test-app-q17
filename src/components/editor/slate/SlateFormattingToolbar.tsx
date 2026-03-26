/**
 * Slate Formatting Toolbar
 * 
 * A floating toolbar that appears when text is selected, providing
 * formatting options like bold, italic, underline, and links.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useSlate, useFocused } from 'slate-react';
import { Editor, Range, Transforms, Element as SlateElement } from 'slate';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code,
  Link,
  Unlink,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  RemoveFormatting
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { TextFormat, BlockFormat, CustomElement, LinkElement } from '@/types/slate.d';

// ============================================================================
// Format Helpers
// ============================================================================

const isMarkActive = (editor: Editor, format: TextFormat): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: TextFormat) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: BlockFormat): boolean => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

const isLinkActive = (editor: Editor): boolean => {
  const [link] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
  return !!link;
};

const getLinkUrl = (editor: Editor): string => {
  const [link] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
  if (link) {
    const [node] = link;
    return (node as LinkElement).url;
  }
  return '';
};

const toggleBlock = (editor: Editor, format: BlockFormat) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === 'bulleted-list' || format === 'numbered-list';

  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && 
      ['bulleted-list', 'numbered-list'].includes(n.type),
    split: true,
  });

  const newType: CustomElement['type'] = isActive ? 'paragraph' : isList ? 'list-item' : format;
  
  Transforms.setNodes<SlateElement>(editor, { type: newType });

  if (!isActive && isList) {
    const block: CustomElement = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const insertLink = (editor: Editor, url: string) => {
  if (!url) return;
  
  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  
  const link: LinkElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

const removeLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
};

const clearFormatting = (editor: Editor) => {
  const marks: TextFormat[] = ['bold', 'italic', 'underline', 'strikethrough', 'code'];
  marks.forEach(mark => Editor.removeMark(editor, mark));
};

// ============================================================================
// Components
// ============================================================================

interface FormatButtonProps {
  format: TextFormat;
  icon: React.ElementType;
}

function FormatButton({ format, icon: Icon }: FormatButtonProps) {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'h-7 w-7 p-0',
        isActive && 'bg-muted text-primary'
      )}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

interface BlockButtonProps {
  format: BlockFormat;
  icon: React.ElementType;
}

function BlockButton({ format, icon: Icon }: BlockButtonProps) {
  const editor = useSlate();
  const isActive = isBlockActive(editor, format);
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'h-7 w-7 p-0',
        isActive && 'bg-muted text-primary'
      )}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

function LinkButton() {
  const editor = useSlate();
  const isActive = isLinkActive(editor);
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);
  
  const handleInsert = () => {
    if (url) {
      insertLink(editor, url);
      setUrl('');
      setOpen(false);
    }
  };
  
  const handleRemove = () => {
    removeLink(editor);
  };
  
  useEffect(() => {
    if (open && isActive) {
      setUrl(getLinkUrl(editor));
    }
  }, [open, isActive, editor]);
  
  if (isActive) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 bg-muted text-primary"
        onMouseDown={(e) => {
          e.preventDefault();
          handleRemove();
        }}
      >
        <Unlink className="h-4 w-4" />
      </Button>
    );
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Link className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" side="top">
        <div className="flex gap-2">
          <Input
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleInsert();
              }
            }}
            className="h-8 text-sm"
          />
          <Button size="sm" className="h-8" onClick={handleInsert}>
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ClearFormattingButton() {
  const editor = useSlate();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0"
      onMouseDown={(e) => {
        e.preventDefault();
        clearFormatting(editor);
      }}
    >
      <RemoveFormatting className="h-4 w-4" />
    </Button>
  );
}

// ============================================================================
// Main Toolbar
// ============================================================================

interface SlateFormattingToolbarProps {
  multiline?: boolean;
}

export function SlateFormattingToolbar({ multiline = false }: SlateFormattingToolbarProps) {
  const editor = useSlate();
  const inFocus = useFocused();
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useCallback(() => {
    const { selection } = editor;
    
    // Hide toolbar if no selection or collapsed
    if (!selection || Range.isCollapsed(selection) || !inFocus) {
      setPosition(null);
      return;
    }

    // Get DOM selection
    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) {
      setPosition(null);
      return;
    }

    const range = domSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Position toolbar above selection
    setPosition({
      top: rect.top - 45,
      left: Math.max(10, rect.left + (rect.width / 2) - 150), // Center, min 10px from left
    });
  }, [editor, inFocus]);

  // Update position when selection changes
  useEffect(() => {
    updatePosition();
  }, [editor.selection, updatePosition]);

  if (!position) {
    return null;
  }

  return createPortal(
    <div
      className="fixed z-[10002] flex items-center gap-0.5 p-1 bg-background border rounded-lg shadow-lg animate-in fade-in zoom-in-95 duration-150"
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Text formatting */}
      <FormatButton format="bold" icon={Bold} />
      <FormatButton format="italic" icon={Italic} />
      <FormatButton format="underline" icon={Underline} />
      <FormatButton format="strikethrough" icon={Strikethrough} />
      <FormatButton format="code" icon={Code} />
      
      <Separator orientation="vertical" className="h-5 mx-1" />
      
      {/* Links */}
      <LinkButton />
      
      {multiline && (
        <>
          <Separator orientation="vertical" className="h-5 mx-1" />
          
          {/* Block formatting */}
          <BlockButton format="paragraph" icon={Pilcrow} />
          <BlockButton format="heading-one" icon={Heading1} />
          <BlockButton format="heading-two" icon={Heading2} />
          <BlockButton format="heading-three" icon={Heading3} />
          
          <Separator orientation="vertical" className="h-5 mx-1" />
          
          {/* Lists */}
          <BlockButton format="bulleted-list" icon={List} />
          <BlockButton format="numbered-list" icon={ListOrdered} />
        </>
      )}
      
      <Separator orientation="vertical" className="h-5 mx-1" />
      
      {/* Clear formatting */}
      <ClearFormattingButton />
    </div>,
    document.body
  );
}

export default SlateFormattingToolbar;
