/**
 * KeyboardShortcutsDialog Component
 * 
 * Modal dialog showing all available keyboard shortcuts for the Visual Page Editor.
 * Organizes shortcuts by category (Editing, Navigation, View).
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Edit3, Navigation, Eye } from 'lucide-react';
import {
  SHORTCUTS,
  getShortcutDisplay,
  type ShortcutDefinition,
} from '@/lib/keyboardShortcuts';

// ============================================================================
// Types
// ============================================================================

export interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============================================================================
// Category Icons
// ============================================================================

const categoryIcons: Record<string, React.ReactNode> = {
  editing: <Edit3 className="h-4 w-4" />,
  navigation: <Navigation className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
};

const categoryLabels: Record<string, string> = {
  editing: 'Editing',
  navigation: 'Navigation',
  view: 'View',
};

// ============================================================================
// Helper Functions
// ============================================================================

function groupShortcutsByCategory(shortcuts: ShortcutDefinition[]): Record<string, ShortcutDefinition[]> {
  const grouped: Record<string, ShortcutDefinition[]> = {
    editing: [],
    navigation: [],
    view: [],
  };

  // Deduplicate shortcuts by description (e.g., Delete has both Delete and Backspace)
  const seenDescriptions = new Set<string>();
  for (const shortcut of shortcuts) {
    if (!seenDescriptions.has(shortcut.description)) {
      grouped[shortcut.category].push(shortcut);
      seenDescriptions.add(shortcut.description);
    }
  }

  return grouped;
}

// ============================================================================
// Component
// ============================================================================

export const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const groupedShortcuts = groupShortcutsByCategory(SHORTCUTS);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
            shortcuts.length > 0 && (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  {categoryIcons[category]}
                  {categoryLabels[category]}
                </h3>
                <div className="space-y-1">
                  {shortcuts.map((shortcut, index) => (
                    <ShortcutRow key={index} shortcut={shortcut} />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center border-t pt-4">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">?</kbd> anytime to show this dialog
        </p>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// Sub-components
// ============================================================================

interface ShortcutRowProps {
  shortcut: ShortcutDefinition;
}

const ShortcutRow: React.FC<ShortcutRowProps> = ({ shortcut }) => {
  const displayKey = getShortcutDisplay(shortcut);

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50">
      <span className="text-sm">{shortcut.description}</span>
      <Badge variant="secondary" className="font-mono text-xs px-2">
        {displayKey}
      </Badge>
    </div>
  );
};

export default KeyboardShortcutsDialog;
