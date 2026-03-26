/**
 * BlockLibrary
 *
 * Left panel component that displays available section blocks
 * grouped by page group (accordion) rather than flat category tabs.
 *
 * - Sections with a `pageGroup` field appear under their named group.
 * - Sections without `pageGroup` fall back to the "General" group.
 * - Named groups are sorted alphabetically; "General" is always last.
 * - Within each group, sections are sorted by `pageGroupOrder` then `displayName`.
 * - Searching auto-expands all groups that contain a match.
 *
 * DraggableBlockItem, handleAddSection, addSection store call,
 * useDraggable hook usage, and DRAG_TYPES.BLOCK data are all preserved unchanged.
 */

import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { getAllSectionDefinitions } from '@/lib/sectionDefinitions.tsx';
import { SectionDefinition } from '@/types/reactEditor';
import { DRAG_TYPES } from '@/types/grid';
import {
  useEditorStore,
  usePageData,
  useSelectedSectionId,
} from '@/stores/editorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Search,
  Plus,
  GripVertical,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================================================
// Draggable Block Item — unchanged from original implementation
// ============================================================================

interface BlockItemProps {
  definition: SectionDefinition;
  onClick: () => void;
}

function DraggableBlockItem({ definition, onClick }: BlockItemProps) {
  const Icon = definition.icon;

  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: `block-${definition.type}`,
    data: {
      type: DRAG_TYPES.BLOCK,
      blockType: definition.type,
      displayName: definition.displayName,
      icon: definition.icon,
    },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'p-3 rounded-lg border bg-card transition-all',
        'hover:bg-accent hover:border-primary/50',
        'group relative',
        isDragging && 'opacity-50 ring-2 ring-primary shadow-lg z-50'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div
          {...listeners}
          {...attributes}
          className={cn(
            'w-6 h-9 rounded flex items-center justify-center cursor-grab active:cursor-grabbing',
            'text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50',
            'transition-colors shrink-0'
          )}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Icon */}
        <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20">
          <Icon className="h-4 w-4 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{definition.displayName}</h4>
          {definition.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {definition.description}
            </p>
          )}
        </div>

        {/* Click-to-add indicator */}
        <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    </div>
  );
}

// ============================================================================
// BlockLibrary Component
// ============================================================================

export function BlockLibrary() {
  const pageData = usePageData();
  const selectedSectionId = useSelectedSectionId();
  const addSection = useEditorStore((state) => state.addSection);

  const [searchQuery, setSearchQuery] = useState('');
  // Start with "General" open so existing sections are immediately visible
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const HIDDEN_GROUPS = new Set([
    'V2 Design',
    'V2 Job Detail',
    'VPS Hosting',
    'Contact Page',
    'Career Page',
    'V2 Career Page 2',
  ]);

  const allDefinitions = getAllSectionDefinitions().filter(
    (def) => !HIDDEN_GROUPS.has((def as any).pageGroup || '')
  );

  // ── Filter by search query ──────────────────────────────────────────────────
  const filteredDefinitions = allDefinitions.filter((def) => {
    if (searchQuery === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      def.displayName.toLowerCase().includes(q) ||
      (def.description?.toLowerCase().includes(q) ?? false)
    );
  });

  // ── Group by pageGroup, falling back to 'General' ──────────────────────────
  const grouped = filteredDefinitions.reduce<Record<string, SectionDefinition[]>>(
    (acc, def) => {
      const group = (def as any).pageGroup || 'General';
      if (!acc[group]) acc[group] = [];
      acc[group].push(def);
      return acc;
    },
    {}
  );

  // ── Sort group names — alphabetical, "General" always last ─────────────────
  const sortedGroupNames = Object.keys(grouped).sort((a, b) => {
    if (a === 'General') return 1;
    if (b === 'General') return -1;
    return a.localeCompare(b);
  });

  // ── Sort definitions within each group ─────────────────────────────────────
  sortedGroupNames.forEach((groupName) => {
    grouped[groupName].sort((a, b) => {
      const orderA = (a as any).pageGroupOrder ?? 999;
      const orderB = (b as any).pageGroupOrder ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.displayName.localeCompare(b.displayName);
    });
  });

  // ── Auto-expand all matching groups when searching ──────────────────────────
  useEffect(() => {
    if (searchQuery) {
      setOpenGroups(new Set(sortedGroupNames));
    }
    // When search is cleared, keep user-opened groups
    if (!searchQuery) {
      setOpenGroups((prev) => new Set(prev));
    }
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Add section handler — unchanged ────────────────────────────────────────
  const handleAddSection = (definition: SectionDefinition) => {
    const sections = pageData?.sections || [];
    const selectedIndex = sections.findIndex((s) => s.id === selectedSectionId);
    const insertIndex = selectedIndex !== -1 ? selectedIndex + 1 : sections.length;

    console.log('[BlockLibrary] Adding section:', {
      type: definition.type,
      insertIndex,
      currentCount: sections.length,
    });

    addSection(definition.type, insertIndex);
    toast.success(`${definition.displayName} section added`);
  };

  // ── Toggle a group open/closed ──────────────────────────────────────────────
  const toggleGroup = (groupName: string, open: boolean) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      open ? next.add(groupName) : next.delete(groupName);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Search ── */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search sections..."
            className="pl-8 h-8 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Drag hint ── */}
      <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/30 border-b flex items-center gap-1">
        <GripVertical className="h-3 w-3 shrink-0" />
        Drag to canvas or click to add
      </div>

      {/* ── Accordion group list ── */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {filteredDefinitions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No sections found</p>
            {searchQuery && (
              <p className="text-xs mt-1">Try a different search term</p>
            )}
          </div>
        ) : (
          sortedGroupNames.map((groupName) => {
            const defs = grouped[groupName];
            const isOpen = openGroups.has(groupName);
            const isGeneral = groupName === 'General';

            return (
              <Collapsible
                key={groupName}
                open={isOpen}
                onOpenChange={(open) => toggleGroup(groupName, open)}
              >
                <CollapsibleTrigger
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors',
                    'hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isOpen && 'bg-muted/40'
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {isGeneral ? (
                      <Layers className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-primary/60 shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wide truncate">
                      {groupName}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground/70 shrink-0">
                      ({defs.length})
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 shrink-0',
                      isOpen && 'rotate-180'
                    )}
                  />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="space-y-2 pt-2 pb-3 px-1">
                    {defs.map((def) => (
                      <DraggableBlockItem
                        key={def.type}
                        definition={def}
                        onClick={() => handleAddSection(def)}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })
        )}
      </div>
    </div>
  );
}

export default BlockLibrary;
