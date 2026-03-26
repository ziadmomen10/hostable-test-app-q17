/**
 * Section Registry Types
 * 
 * Type definitions for the section registration system.
 */

import { ComponentType } from 'react';
import { LucideIcon } from 'lucide-react';
import { SectionType } from '@/types/pageEditor';

// ============================================================================
// Core Types
// ============================================================================

export interface DndArrayConfig {
  path: string;
  strategy: 'grid' | 'horizontal' | 'vertical';
  handlePosition?: 'left' | 'top-left' | 'top-right';
}

export interface SectionDefinition {
  type: SectionType;
  displayName: string;
  icon: LucideIcon;
  category: 'layout' | 'content' | 'commerce' | 'media' | 'interactive';
  component: ComponentType<any>;
  settingsComponent: ComponentType<{
    data: any;
    onChange: (data: any) => void;
    sectionId?: string;
  }>;
  defaultProps: Record<string, any>;
  description: string;
  translatableProps?: string[];
  usesDataWrapper?: boolean;
  dndArrays?: DndArrayConfig[];
  /**
   * The page group this block belongs to in the Block Library accordion.
   * Sections without this field appear under the "General" fallback group.
   * Value is case-sensitive — must be identical across all sections in the same group.
   * Examples: 'Career Page', 'VPS Hosting', 'Game Hosting', 'Contact Page'
   */
  pageGroup?: string;
  /**
   * Controls display order within the page group (lower = first).
   * Sections without this field are sorted alphabetically within their group.
   */
  pageGroupOrder?: number;
}

export interface SectionInstanceData {
  id: string;
  type: SectionType;
  props: Record<string, any>;
  order: number;
  visible: boolean;
  translationKeys?: Record<string, string>;
}
