/**
 * Editor Components Index
 * 
 * Central export for all Visual Page Editor components.
 */

// Error Boundary and Loading States
export { EditorErrorBoundary } from './EditorErrorBoundary';
export { 
  EditorLoadingState, 
  ToolbarSkeleton, 
  CanvasSkeleton, 
  SidePanelSkeleton 
} from './EditorLoadingState';

// Core Editor Components
export { EditorToolbar } from './EditorToolbar';
export type { 
  EditorToolbarProps, 
  CoverageStats, 
  LanguageOption 
} from './EditorToolbar';

export { LeftSidePanel } from './LeftSidePanel';
export type { 
  LeftSidePanelProps, 
  SectionInfo, 
  ExtractedSection 
} from './LeftSidePanel';

export { RightSidePanel } from './RightSidePanel';
export type { RightSidePanelProps } from './RightSidePanel';

// Save Status Indicator
export { SaveStatusIndicator } from './SaveStatusIndicator';
export { default as SaveStatusIndicatorDefault } from './SaveStatusIndicator';
