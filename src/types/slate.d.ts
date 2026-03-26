/**
 * Slate.js TypeScript Declarations
 * 
 * Custom type definitions for Slate editor elements and formatting.
 */

import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

// Custom editor type combining all plugins
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

// Block-level element types
export type ParagraphElement = {
  type: 'paragraph';
  children: Descendant[];
};

export type HeadingOneElement = {
  type: 'heading-one';
  children: Descendant[];
};

export type HeadingTwoElement = {
  type: 'heading-two';
  children: Descendant[];
};

export type HeadingThreeElement = {
  type: 'heading-three';
  children: Descendant[];
};

export type LinkElement = {
  type: 'link';
  url: string;
  children: Descendant[];
};

export type BulletedListElement = {
  type: 'bulleted-list';
  children: Descendant[];
};

export type NumberedListElement = {
  type: 'numbered-list';
  children: Descendant[];
};

export type ListItemElement = {
  type: 'list-item';
  children: Descendant[];
};

// Union of all custom element types
export type CustomElement =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | LinkElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement;

// Text leaf with formatting marks
export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

// Empty text (required by Slate)
export type EmptyText = {
  text: string;
};

export type CustomText = FormattedText | EmptyText;

// Extend Slate's built-in types
declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// Format types for toggle functions
export type TextFormat = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code';
export type BlockFormat = 'paragraph' | 'heading-one' | 'heading-two' | 'heading-three' | 'bulleted-list' | 'numbered-list';
