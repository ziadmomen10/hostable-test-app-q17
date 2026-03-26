/**
 * Editor Dialogs Index
 * 
 * Central export for all Visual Page Editor dialog components.
 */

export { ImageUploadDialog } from './ImageUploadDialog';
export type { ImageUploadState, ImageUploadDialogProps } from './ImageUploadDialog';

export { CodeViewerDialog } from './CodeViewerDialog';
export type { CodeViewerDialogProps } from './CodeViewerDialog';

export { BulkAssignKeysDialog } from './BulkAssignKeysDialog';
export type { UnassignedElement, BulkAssignKeysDialogProps } from './BulkAssignKeysDialog';

export { BatchTranslateDialog } from './BatchTranslateDialog';
export type { BatchTranslateElement, BatchTranslateDialogProps } from './BatchTranslateDialog';

export { BatchTranslateProgressDialog } from './BatchTranslateProgressDialog';
export type { 
  BatchLogEntry, 
  BatchProgress, 
  BatchComplete, 
  BatchTranslateProgressDialogProps 
} from './BatchTranslateProgressDialog';

export { TranslateToPagesDialog } from './TranslateToPagesDialog';
export type { 
  MatchingPage, 
  TranslatePagesElement, 
  TranslateToPagesDialogProps 
} from './TranslateToPagesDialog';

export { KeyboardShortcutsDialog } from './KeyboardShortcutsDialog';
export type { KeyboardShortcutsDialogProps } from './KeyboardShortcutsDialog';
